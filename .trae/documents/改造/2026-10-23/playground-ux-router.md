# playground 示例项目改造：接入 ux-router、对齐市面 UI 组件库示例形态

> 状态：**已完成**（2026-10-23 疑问闭环 Q1=B / Q2=B / Q3=A / Q4=A，实现并验证通过）

## 需求

- 用户原话：「使用 ux-router 插件的功能，改造 playground 示例项目，要求更加符合市面上的 UI 组件示例项目」。
- 改造对象：`packages/playground`（playground 是组件库的验收工程，同时也是发布到插件市场的示例工程，形态对标 uni-ui / Vant 的官方 demo）。
- 插件：`uni_modules/ux-router`（自研同生态插件，vue-router 4 风格 API，UTS 源码随 uni_modules 分发，readme 已通读）。

## 需求分析

### 现状盘点

- `pages/index/index.uvue`：4 张组件卡片（Button / Loading / Icon / Badge）+ 每卡 `goXxxDemo()` 直调 `uni.navigateTo` —— 无路由表、无分组、无搜索、导航 API 零散。
- `main.uts`：极简 `createApp`，未挂任何插件；`App.uvue`：全局样式（rpx 体系）。
- `pages.json`：主包 index + 分包 `pages-sub`（4 页），原生导航栏标题。
- 组件总数少（4 个），演示页结构均为「section + card」穷举式。

### 市面 UI 组件库示例项目形态（对标）

| 参照 | 首页 | 演示页 | 特征 |
| --- | --- | --- | --- |
| uni-ui 官方示例 | 纯分组列表（基础 / 布局 / 导航…），条目 = 名称 + 描述 | 原生导航栏标题 | 朴素、多端一致 |
| Vant mobile demo | 品牌区（logo + 简介 + 版本）→ 搜索框 → 分组列表（条目 = 中文名 + 英文名 + 简介） | 自绘 navbar（返回 + 标题），页面转场动画 | 信息密度高、观感精致 |
| wot-design-uni demo | 搜索 + 分组（条目 = 中文 + 英文标识 + 箭头） | navbar 标题 + 页内区块 | 介于两者之间 |

共识：**分组导航 + 组件条目（中英文名 + 简介）+ 统一演示页标题** 是基本盘；搜索与转场动画是加分项。

### ux-router 能力映射（readme 已核对）

| 能力 | 在示例项目中的用法 |
| --- | --- |
| `createRouter({ routes })` + 路由表 | 新建 `router/` 目录（config + 实例），path / name / meta(title) 与 pages.json 对齐 |
| `app.use(router)` | `main.uts` 安装（provide 路由 + onShow 自动 syncRoute） |
| `router.push({ name })` / `RouterLink` | 替换首页零散的 `uni.navigateTo`；条目用编程式或声明式 |
| `afterEach` 守卫 | 读 `to.meta.title` 调 `uni.setNavigationBarTitle`（web 端实测有效），守卫实战示范 |
| `useRoute()` | 演示页读取 meta / query（为后续组件 demo 传参立规范） |
| `AnimationPlugin` | H5 端 WAAPI 页面转场（opt-in） |
| ParamsPlugin / EventsPlugin / InterceptorPlugin | 组件 demo 无诉求，默认不启用（避免示例项目过重） |

### 实现要点

- 新增 `playground/router/`（应用层目录，不属于组件库契约范围）：`router.config.uts`（路由表）+ `index.uts`（createRouter 实例导出）；`main.uts` 安装。
- 首页重构为分组导航列表；组件条目数据（中英文名 / 描述 / 分组 / 路由 name）集中一处声明，新增组件时加一条即可。
- 演示页导航调用统一走 `useRouter()`；pages.json 结构按导航形态决策（见 Q2）同步调整。
- 工程基座改动说明：pages.json（可能改 navigationStyle）、新增 router/ 目录——均为 playground 应用层，不触碰 core 契约。

## 伪代码设计

### 路由表（router/router.config.uts）

```
routes: RouteConfig[] = [
  { path: 'pages/index/index', name: 'home', meta: { title: 'unix-ui 组件演示' } },
  { path: 'pages-sub/button/button', name: 'button', meta: { title: 'Button 按钮' } },
  { path: 'pages-sub/loading/loading', name: 'loading', meta: { title: 'Loading 加载' } },
  { path: 'pages-sub/icon/icon', name: 'icon', meta: { title: 'Icon 图标' } },
  { path: 'pages-sub/badge/badge', name: 'badge', meta: { title: 'Badge 徽标' } }
]
export const router = createRouter({ routes, strict: true })  // 插件按 Q3 决策
```

### main.uts

```
import { router } from './router'
const app = createSSRApp(App)
app.use(router)
```

### 首页 index.uvue（形态按 Q1 / Q2 结果组装）

```
品牌区（库名 + 一句话简介 + 版本号）      ← Q1=B
搜索框（input，本地过滤组件条目）          ← Q1=B
分组导航：
  分组标题（如「基础组件」）
  条目行（RouterLink 或 router.push）：
    [中文名 + 英文名 | 简介 | > 箭头]
守卫：router.afterEach(to => uni.setNavigationBarTitle({ title: to.meta.title }))
```

### 演示页

- 导航统一 `useRouter()`：如演示页内互相跳转、返回（若 Q2 选自绘 navbar，返回按钮调 `router.back()`）。
- 组件 demo 页内容结构不动（本轮范围是导航与信息架构，不是重写 4 个演示页内容）。

## 疑问清单

### Q1 首页信息架构形态（影响：首页重写幅度与 pages.json）

- 方案 A：对标 uni-ui 官方示例——纯分组列表（分组标题 + 条目行），无品牌区无搜索；最朴素、改动最小
- 方案 B（推荐）：对标 Vant mobile demo——品牌区（库名 + 简介 + 当前版本号）→ 搜索框（本地过滤条目）→ 分组列表；信息架构一步到位，后续组件增多不用再改骨架
- 方案 C：A 的列表 + B 的品牌区（无搜索折中）

回答：B。

### Q2 演示页导航形态（影响：pages.json navigationStyle 与新增骨架组件）

- 方案 A：保留 pages.json 原生导航栏（各端原生样式，零成本；但各端观感不一致、定制弱）
- 方案 B（推荐）：`navigationStyle: custom` + 新增统一自绘骨架（返回箭头 + 中文标题 + 英文名副标题，返回调 `router.back()`，沿用 ux-router 的守卫链），web 端观感与 Vant demo 对齐；App 端需自绘状态栏占位（条件编译处理）

回答：B。

### Q3 路由器能力展示范围（影响：插件启用与是否新增演示区块）

- 方案 A（推荐）：最小接入——导航（push / RouterLink）+ afterEach 守卫设置导航栏标题；示例项目保持「组件 demo」纯粹性
- 方案 B：A + 启用 AnimationPlugin（H5 转场动画，全局默认动画配置）
- 方案 C：B + 额外做「路由能力演示」区块（params 传参、EventsPlugin 通道、拦截器开关演示页）——示例项目兼任 ux-router 的用法示范

回答：A。

### Q4 组件条目导航方式（影响：首页条目的实现写法）

- 方案 A（推荐）：编程式 `router.push({ name: 'xxx' })`（条目行自带复杂的筛选 / 布局逻辑，编程式更直接；RouterLink 本质也是 view 包点击）
- 方案 B：声明式 `<RouterLink to="...">` 包条目（体现组件能力，但需要手动 import 组件且 to 仅支持字符串 path）

回答：A。

## 实施记录

### 落码清单（2026-10-23）

| 文件 | 变更 |
| --- | --- |
| `playground/router/router.config.uts` | 新建：路由表 5 条（home + button/loading/icon/badge），meta.title 统一「中文 English」格式 |
| `playground/router/index.uts` | 新建：`createRouter({ routes, strict: true })` 实例导出 + `afterEach` 守卫（`uni.setNavigationBarTitle` 更新 Web 端 document.title + 导航日志） |
| `playground/main.uts` | `app.use(router)` 安装（provide 路由 + onShow 自动 syncRoute） |
| `playground/pages.json` | `globalStyle.navigationStyle: "custom"` 全局自绘导航；各页标题同步「中文 English」格式（保留作 Web 首屏 title 初值） |
| `playground/App.uvue` | 全局新增 `.page-body { flex: 1 }`（演示页内容滚动区） |
| `playground/components/demo-navbar/demo-navbar.uvue` | 新建：自绘导航骨架（easycom 零 import）——App 端状态栏占位（`#ifdef APP` 取 `uni.getWindowInfo().statusBarHeight`）+ 返回箭头（mxi-icon `arrow-left` 吃自己狗粮，点击 `router.back()`）+ 居中中文标题 + 英文副标题 |
| `playground/pages/index/demo-components.uts` | 新建：组件条目数据表（`DemoComponent` / `DemoGroup` type + `demoGroups` 分组数组），新增组件登记一处即生效 |
| `playground/pages/index/index.uvue` | 重构：品牌区（unix-ui + v0.1.0 徽标 + slogan）→ 搜索框（input 受控 + computed 过滤中英文名，空分组剔除 + 无结果提示）→ 分组列表（条目 = 中文名 + 英文标识 + 简介 + mxi-icon arrow，动态分隔线），点击条目 `router.push({ name })` 编程式导航 |
| `playground/pages-sub/{button,loading,icon,badge}/*.uvue` | 四页统一改壳：删除 `#ifdef APP` 条件编译双结构，改为 `page → demo-navbar + scroll-view.page-body`（固定头 + 独立滚动体，全端统一） |

### 关键实现决策

- **scroll-view 全端统一**：原先 Web 端靠 body 滚动 / App 端 scroll-view 条件编译的结构，改为全端 `page + scroll-view` 统一结构，顺带消除了演示页的条件编译。
- **状态栏占位免条件编译模板**：`statusBarHeight` ref 在 script 内 `#ifdef APP` 赋值，模板统一 `:style` 绑定 padding-top（Web 端为 0 无副作用）。
- **mxi-icon size 为 string 类型**（纯数字自动补 px），模板传 `size="18"` 而非 `:size="18"`。
- **afterEach 守卫**：custom 导航栏下原生栏标题不可见，`uni.setNavigationBarTitle` 在 Web 端承担 document.title 更新；演示页标题由 demo-navbar 显式 props 渲染。
- **UX-router 类型核对**：`RouteMeta.title?` 访问为 `string | null`，守卫内 `to.meta.title ?? ''` 兜底；`PostNavigationGuard` 三参数显式标注（UTS 函数参数不可选）；`useRouter(): Router` 非空（未安装时 throw）。
- **分组分类对齐 Vant 官方 demo**（用户追加要求，2026-10-23）：条目按「基础组件（Button/Icon）/ 反馈组件（Loading）/ 展示组件（Badge）」三组拆分，注释中登记 Vant 完整分组体系（基础/表单/反馈/展示/导航）供后续组件归组；首页 v-for 按分组数据自动渲染，多组无需改模板；浏览器复测三组渲染、跨组搜索过滤、清空恢复均 PASS。

### 验证记录（DoD）

- [x] `pnpm sync:uni-modules:check` 通过（core 零变更）
- [x] HBuilderX CLI `cli launch web` 编译成功（dev server 端口 5174，旧进程已重启使 pages.json / main.uts 生效）
- [x] 浏览器实测（Chrome，history 路由）：
  - 首页品牌区 / 搜索框 / 分组列表 4 条目渲染 PASS；document.title =「unix-ui 组件演示」
  - 搜索「bad」实时过滤仅剩徽标条目，清空恢复 4 条 PASS
  - 首页 → 按钮演示页（`router.push` 按名导航）URL / 内容 / navbar「按钮 Button」PASS；返回箭头回首页 PASS
  - 徽标演示页直达渲染 + document.title「徽标 Badge」+ 返回首页 PASS
  - loading / icon 页 HTTP 200 可达（与 button/badge 同构）
  - console 无 error、network 无失败
- [x] `pnpm build:docs` 免跑：本轮零文档站变更
- [x] 无遗留调试代码

### 遗留

- App 端真机验证（状态栏占位、原生返回手势与 syncRoute 对齐）——与既有组件任务同一遗留项。
- 新增组件时的登记链路：`demo-components.uts` 条目 + `router.config.uts` 路由 + `pages.json` 注册 + 演示页 demo-navbar props，四处缺一不可。
