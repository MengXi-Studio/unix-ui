# playground 接入 ux-router routeGen 文件路由生成插件

## 需求

用户问「为啥不使用路由库中的自动插件？」，经方案对比（routesGen 渐进 / routeGen 全量 / 维持手动）后选定：**接入 routeGen 全量流水线**（页面文件 → pages.json + 路由表），消除「demo-components 条目 + router.config 路由 + pages.json 注册 + demo-navbar props」四处手工登记链路中的两处（pages.json 与路由表）。

依据：unix-router 仓库文档 `packages/docs/src/guide/file-based-routing.md`（HBuilderX 形态有官方接入说明：项目根 vite.config.ts 会整体替换内置配置，必须 hbxRequire 自行引入 uni()）与 `file-conventions.md`（defineUniPage 宏契约）。

## 方案

1. **vite.config.ts**（HBuilderX 形态）：hbxRequire 解析 HBuilderX 内置 `@dcloudio/vite-plugin-uni`，plugins = [uni, routeGen]；routeGen 从 uni_modules 分发版 `./uni_modules/ux-router/plugins/index.mjs` 引入。
2. **页面就近声明**：25 页（index + 24 演示页）script setup 顶部插入 `defineUniPage({ title, name })`，name 显式声明保持现有 kebab-case（如 `calendar-popup`），title 沿用「中文 English」格式——demo-components.uts 与 router 按名导航零改动。
3. **router 层**：`router.config.uts` 改为「生成产物 + 显式扩展层」——`import { routes as generatedRoutes } from './routes.gen.uts'`，concat 级联三组件两条别名路由（cascader-popup / cascader-input 指向同一 path，插件按 path 1:1 生成无法表达）。
4. **pages.json**：由插件重生成（globalStyle 等非页面字段自动合并保留），产物提交 git。
5. 产物 `routes.gen.uts` / `route-name.gen.d.ts` / `define-uni-page.d.ts` 一并提交（HBuilderX CLI 编译链不保证插件先行执行）。

## 验证 DoD

- dev server 重启后 pages.json / routes.gen.uts 自动生成，路由表 name / title 与原手写版一致
- 首页 → 三个级联条目 + 日历条目 router.push 按名导航正常，document.title 正确
- 控制台无新增报错；`pnpm sync:uni-modules:check` 通过（core 零变更）
- App 端真机（宏剥离后 Kotlin 编译）登记 TODO

## 实施记录

2026-11-04 完成并验证通过（DoD 达成）。

### 落码清单

| 产物 | 说明 |
| --- | --- |
| `packages/playground/vite.config.ts`【新建】 | HBuilderX 形态：hbxRequire 内置 `@dcloudio/vite-plugin-uni` + routeGen（uni_modules 分发版 `./uni_modules/ux-router/plugins/index.mjs`）；显式读 manifest `web` 段注入 base/port；含 `playground:main-entry` 前置 resolveId 修复（见踩坑 3）。仓库根已 `pnpm add -Dw unplugin`（插件适配器的 bare import 依赖） |
| 25 个页面 | script setup 顶部插入 `defineUniPage({ title, name })`，name 保持 kebab-case、title「中文 English」；loading.uvue 为纯静态页，补最小空 script setup 承载宏 |
| `router/routes.gen.uts` + `route-name.gen.d.ts`【生成产物，提交 git】 | 25 条路由与原手写版逐字一致（entryPage 置首） |
| `pages.json`【插件重生成】 | pages / subPackages 全自动 + navigationBarTitleText 来自宏 title；globalStyle 等非页面字段自动合并保留 |
| `router/router.config.uts`【改写】 | 改为「`import { routes as generatedRoutes } from './routes.gen.uts'` + concat 级联两条别名路由」的显式扩展层（插件按 path 1:1 生成，无法表达同 path 多 name） |
| `pages/index/demo-components.uts`【注释更新】 | 登记链路说明改为「宏声明 + 条目登记」两处 |
| `.trae/rules/architecture.md` | 第 3 节步骤 4 与第 6 节表格更新为新的路由声明落点 |

### 踩坑记录（本轮核心价值）

1. **vite.config.ts 替换内置配置后 manifest web 段的 server 侧注入丢失**：dev server 落到 5173 默认端口、base 丢失 → `base` / `server.port` 需在 vite.config.ts 里读 manifest 显式回填（保持 manifest 单一事实源）。
2. **uni 插件工厂必须调用**：`uniMod.default ?? uniMod` 只拿到函数对象当 plugin 用，钩子全部未注册，症状是 `/main` 返回 HTML fallback（SPA fallback）而非 JS 模块——必须 `uniFactory()`。
3. **`/main` 解析的 importer 条件**：`uni:h5-resolve-id` 要求 `importer.endsWith('index.html')` 才把 `/main` 映射到 main.uts，项目级 vite.config + 自定义 base 的 dev 链路下不命中 → 前置 `playground:main-entry` resolveId 显式映射。
4. **插件适配器的 bare import**：`plugins/index.mjs` 内部 `import 'unplugin'`，playground 无 node_modules → 仓库根安装 `unplugin`（unplugin 是 uniapp-cli-vite 内置依赖但解析基点在项目侧）。
5. **产物必须提交 git**：HBuilderX CLI 编译链不保证插件先行执行（unix-router 文档明确要求）。
6. **vite.config.ts 修改会触发 vite 自动重启**（无需手动重启 dev server），重启窗口期的浏览器请求报 ERR_ABORTED / CONNECTION_REFUSED，属于瞬态噪音。

### 验证结论

- dev server（5174，base /unix-ui/playground/）正常；`/main` 返回 JS 模块（uni transform 全生效：pages-json-js 注入、uni-h5 dist-x 插件、createVueApp）。
- 首页加载正常，document.title「unix-ui 组件演示」来自宏；三个级联条目按名导航全部正常且 title 各自正确（级联选择 Cascader / 级联弹出框 CascaderPopup / 级联输入框 CascaderInput）；日历弹出框条目导航正常。
- 抽验 5 个页面模块（calendar / waterfall / toast / button / loading）按需编译全部 200 text/javascript。
- 新开标签页控制台零 error，仅剩预期中的「重复路由路径」warn（级联别名路由，已在 router.config.uts 注释与任务文档说明）。
- `pnpm sync:uni-modules:check` 通过（core 零变更）。

### 遗留 TODO

- App / 小程序端：宏剥离后的 Kotlin 编译与页面注册需真机回归（本轮仅 Web 实测）。
- `unplugin` 安装在仓库根 devDependencies，插件市场用户工程需自行安装（unix-router 文档已有说明）。
