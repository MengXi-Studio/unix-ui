# 架构开发规则（unix-ui）

> 本规则约束在本项目中的一切代码生成行为。pnpm monorepo 三包职责、同步机制与主题契约见本文件；
> 与本规则冲突的写法一律视为错误实现，即使 AI 认为「更简洁」或「TS 里惯用」。
> UTS 语言红线与 uvue / 条件编译规范见 `project_rules.md`；运行时踩坑记录见 `.claude/rules/LESSONS_LEARNED.md`。

## 1. Monorepo 分层与数据流（强制）

```
packages/core（组件源，唯一真源）
   │  scripts/sync-uni-modules.mjs（INCLUDE 白名单复制）
   ▼
packages/playground/uni_modules/mxi-ui-x（easycom 编译验证）

packages/docs（VitePress 双语文档站，手工维护）
```

- **组件源码只改 `packages/core`**；`playground/uni_modules/mxi-ui-x/` 下的 `components/`、`theme/` 是同步产物，**禁止手改**（下次同步即覆盖丢失）。
- 该目录下仅 `package.json`（插件 id：mxi-ui-x）与 `changelog.md` 为 KEEP 手工维护文件，其余一律以 core 为准。
- 修改 core 后必须执行 `pnpm sync:uni-modules` 再编译验证；提交前 `pnpm sync:uni-modules:check` 保证一致性。
- HBuilderX 编译只扫描工程 `uni_modules/` 目录，node_modules 内的组件不被 easycom 识别——这是同步机制存在的原因，不要试图让 playground 直接消费 core。

## 2. 命名与包名清单（导入路径与命名以此为准，禁止凭记忆写）

| 名称 | 值 | 说明 |
| --- | --- | --- |
| npm 包（core） | `@meng-xi/unix-ui` | 发布到 npm 的组件库包名 |
| 插件 id | `mxi-ui-x` | DCloud 插件市场唯一标识，uni_modules 目录名必须与之一致（x 呼应 uni-app x 生态） |
| 文档包 | `@meng-xi/unix-ui-docs` | VitePress 双语站（中文在 `src/` 根，英文在 `src/en/` 镜像） |
| 组件前缀 | `mxi-` | 组件目录与标签名：`components/mxi-button/mxi-button.uvue` |
| 主题变量前缀 | `$mxi-` | `theme/vars.scss` 全部变量；用户在根 uni.scss 定义同名变量即覆盖 |
| 同步脚本 | `scripts/sync-uni-modules.mjs` | INCLUDE=`['components','theme','readme.md','license.md']`，KEEP=`['package.json','changelog.md']` |

## 3. 新增组件的标准落码顺序

按「组件 → 主题 → 同步 → 演示 → 文档」顺序，缺一不可：

1. **组件源**：`packages/core/components/<mxi-name>/<mxi-name>.uvue`（组合式 API；`<style lang="scss">` **必须显式声明 lang**；style 顶层无条件 `@import '../../theme/vars.scss'`——组件目录固定两层，相对路径写死两级）。
2. **主题变量**：`packages/core/theme/vars.scss` 新增 `$mxi-<component>-*` 段，全部 `!default`；已有变量禁止改默认值（破坏用户覆盖契约）。
3. **同步**：`pnpm sync:uni-modules`。
4. **演示页**：`packages/playground/pages-sub/<name>/<name>.uvue` + `pages.json` 注册；一页穷举该组件全部 props / 变体 / 事件，便于截图验收。
5. **文档**：`packages/docs/src/components/<name>.md`（中文）与 `src/en/components/<name>.md`（英文）双份同步维护；更新 `.vitepress/config/zh.ts` 与 `en.ts` 侧栏。
6. **验证**：见第 6 节，达到 core-protocol DoD 方可声称完成。

## 4. 主题契约（本项目核心机制，违反即循环导入或覆盖失效）

- 组件 style **顶层无条件** `@import '../../theme/vars.scss'`（全 `!default`）→ 用户零配置即有默认主题。
- 用户覆盖：在工程根 `uni.scss` **直接定义** `$mxi-*` 变量；**禁止**在 uni.scss 中 `@import` vars.scss——uni.scss 会注入每个组件样式，与组件内 import 同一文件触发 sass 循环导入（`This file is already being loaded`）。
- uni.scss 中引用任何文件一律 `@/` 别名（相对路径按各组件所在目录解析，必错）。
- `@import` 禁止嵌套在 `@if/@else` 等控制指令内（编译链报 `This at-rule is not allowed here`）；「默认值 + 可覆盖」一律用顶层无条件 import 实现，不要用 variable-exists 做双保险。
- 细边框（hairline）规范：0.5px 用「绝对定位 view + `transform: scale(0.5)`」实现；缩放层必须显式 `transform-origin: 0 0`（默认中心原点会偏移半个宽高）、根节点 `border-width: 0`（否则双线）、`border-radius` 同步 ×2。

## 5. 组件开发红线摘录（完整 UTS 规范见 `project_rules.md`）

- 不支持 `undefined`，可空一律 `null | T`；条件语句必须布尔表达式（禁 truthy/falsy）。
- 对象字面量只能赋给 `type` 定义的类型（禁 interface）；函数声明不能作值传递，回调一律箭头函数。
- 动画一律走 `UniElement.animate`（ucss 无 @keyframes、无伪元素）；watch 启动动画用 `{ flush: 'post' }`。
- 样式仅 class 选择器 + flex 布局；文字样式只设在 text/button 上；不用 scoped；不使用 rpx（除非随屏宽变化场景）。
- `<style lang="scss">` 只引入变量与运算能力（`$mxi-*`、`!default`、`rgba($var, alpha)` 派生、数值运算）；样式规则一律扁平书写——禁止层级嵌套（产生 ucss 禁止的后代选择器），禁用 `@each`/`@if` 批量生成类（类名由运行时拼接，扁平类是排查样式的对账清单；仅当变体矩阵膨胀时允许局部纯 `&` 拼接型循环，展开后必须仍是扁平类）。
- 平台差异代码用条件编译隔离（`#ifdef APP-ANDROID / APP-IOS / WEB` 等）。
- 组件类型与逻辑默认内联在 SFC 中，不外置到同级 `.uts`：easycom 页面零 import 拿不到组件内部类型（导出无消费方），Props 类型须留在组件内供 `defineProps` 编译期解析。仅当出现跨组件共享的纯数据/工具，或单文件体量影响可读性时，才拆同级 `.uts` 并用相对路径导入。

## 6. 目录契约与装配点（唯一，禁止在别处落码）

| 需求 | 唯一落点 |
| --- | --- |
| 组件实现 | `packages/core/components/<mxi-name>/` |
| 主题变量 | `packages/core/theme/vars.scss` |
| 组件演示页 | `packages/playground/pages-sub/<name>/` |
| 插件元数据（id / changelog） | `playground/uni_modules/mxi-ui-x/` 的 KEEP 文件 |
| 使用文档 | `packages/docs/src/`（zh 主包 + `en/` 镜像） |
| 文档导航 / 侧栏 | `packages/docs/.vitepress/config/zh.ts` + `en.ts` |

- playground 工程基座（manifest 的 vapor / devServer 端口、index.html 入口）改动需向用户说明理由。
- core 保持纯组件库：禁止全局副作用、禁止依赖 playground 专属配置、禁止引入 vars.scss 之外的样式资源。

## 7. 验证（core-protocol DoD 的项目级补充）

- **编译运行**：HBuilderX CLI `cli launch web --project <playground 绝对路径>`；dev server 端口在 playground manifest 显式指定（当前 5174），验收前 `lsof -i :端口` 确认进程归属（本机多项目易抢端口）。
- **页面实测**：history 路由，curl 校验需 `-H 'Accept: text/html'`；组件演示页走通全部变体并截图比对。
- **一致性**：`pnpm sync:uni-modules:check` 通过。
- **文档**：`pnpm build:docs`（VitePress 自带死链检查）通过；新增页面必须 zh / en 双侧同步，否则死链或导航缺项。
- 修改 `uni.scss` 后必须重启 dev server（编译期注入不热更新）。
