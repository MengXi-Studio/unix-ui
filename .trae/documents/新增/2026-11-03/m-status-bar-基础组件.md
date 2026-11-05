# m-status-bar 状态栏占位组件 实施方案

## 需求

用户提供参考页 `https://sard.wzt.zone/components/status-bar`（Sard StatusBar），意图新增状态栏占位组件。

Sard 侧实现极简：无 props / 事件 / 插槽，仅一个 `flex: none; height: var(--s-status-bar-height)` 的空节点，高度由 `windowInfo.statusBarHeight` 在 HTML 上写 CSS 变量 `--s-status-bar-height`；用于 `Navbar`、`Notify` 等贴顶元素的顶部占位。若应用嵌套在 APP webview 中，可由宿主注入高度。

uni-app x 无「JS 写 CSS 变量」链路，且 `uni.getWindowInfo().statusBarHeight` 在 Web 端恒为 0，需重新设计取值与降级方式。

## 需求分析

| 层 | 落点 | 内容 |
| --- | --- | --- |
| core 组件 | `packages/core/components/m-status-bar/m-status-bar.uvue` | 状态栏占位组件（单文件，无跨组件共享逻辑） |
| 主题变量 | `packages/core/theme/vars.scss` | 视方案决定是否新增 `$m-status-bar-*`（纯高度占位可能无需变量） |
| 演示页 | `packages/playground/pages-sub/status-bar/status-bar.uvue` + `pages.json` | Web 端模拟高度演示 + App 端真实高度真机验收 |
| 使用文档 | `packages/docs/src/components/status-bar.md`、`src/en/components/status-bar.md` | 双语文档 |
| 侧栏导航 | `packages/docs/.vitepress/config/zh.ts`、`en.ts` | 归入「布局」分组（与 Divider / Grid / Layout / Space 同组） |
| changelog | 文档站 zh / en、`playground/uni_modules/m-ui-x/changelog.md` | 0.3.0 新条目（0.3.0 尚未发布） |

影响面与既有代码的关联：

- `packages/playground/components/demo-navbar/demo-navbar.uvue` 当前自行用 `#ifdef APP` + `uni.getWindowInfo().statusBarHeight` 实现 `padding-top` 占位（应用层骨架，不属于 core）。是否改为消费 `m-status-bar` 需确认。
- `m-popup` 的 `safe-area-inset-top` 走 `env(safe-area-inset-top)` inline 注入，是另一套安全区方案，本组件不复用（语义不同：状态栏高度 ≠ 安全区高度，Web 端安全区恒 0）。

## 伪代码设计

### 方案 A：对齐 Sard 的零 API 占位（推荐）

- Props：`customClass?: string.ClassString`、`customStyle?: string`（仅保留本库通用样式直达，便于外部设背景色）
- 无事件、无插槽（Sard 亦为空节点）
- 高度解析：
  - App：`uni.getWindowInfo().statusBarHeight`（`#ifdef APP` 编译期取值）
  - Web / 小程序：取不到即 0（不渲染高度），由使用者自行在需要时给固定高度或改用 `customStyle`
  - 是否提供 0 值兜底（如 Web 桌面端回退 20px）待确认（Q2）
- 样式：`.m-status-bar { flex: none; }`，高度走 `:style` 内联（`height: Npx;`），避免为单一高度写无穷类
- 演示页：Web 端状态栏恒 0 不可见 → 需一个可手动设高的入口（Q3）

### 方案 B：可覆盖高度的增强版

- 在方案 A 基础上增加 `height?: number`（0 表示自动取系统状态栏高度，非 0 直接作为 px 使用）
- 好处：Web 演示可直观展示；嵌套 APP webview / 刘海屏自定义高度场景有出口
- 代价：多一个 props，偏离 Sard 的极简定位

### 模板结构（两方案共用）

```
<view :class="'m-status-bar' + customClass 拼接" :style="rootStyle"></view>
```

`rootStyle` = `customStyle` 补分号 + `height: <解析值>px;`

## 疑问清单

### Q1 组件 API 边界：方案 A（零 props，对齐 Sard）还是方案 B（增加 `height` 覆盖）？
影响：组件 props 清单、演示页形态、文档 Props 表。
回答：B。

### Q2 App 端 `statusBarHeight` 取不到 / Web 端为 0 时如何处理？
候选：① 保持 0（组件不占位，需占位时由使用者自行处理）；② 回退 `env(safe-area-inset-top)`；③ 回退固定 20px（Sard 在浏览器默认 `--s-status-bar-height` 有兜底值，需确认其 base 变量定义）。
影响：跨端视觉一致性、文档「已知限制」表述。
回答：1️⃣。

### Q3 是否提供手动高度入口用于 Web 演示（Web 模拟器无法体现真实状态栏）？
候选：① 方案 B 的 `height` prop 天然解决；② 演示页用 `customStyle` 写死高度做视觉演示；③ 不演示高度，仅文档说明。
影响：演示页验收方式（截图比对能否看到占位）。
回答：1️⃣。

### Q4 是否把 `demo-navbar` 的 `padding-top` 占位改为消费 `m-status-bar`？
影响：playground 应用层骨架（非 core 契约范围），改动会让导航结构与组件演示统一，但增加跨包依赖。
回答：是。

### Q5 组件分组与文档定位：归入「布局」组是否合适（Sard 归「布局」）？
影响：`demo-components.uts` 分组、zh/en 侧栏位置、首页演示入口。
回答：布局。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- Q1 选方案 B：`height` prop 落地（0 自动、> 0 直用），并保留本库通用 `custom-class` / `custom-style`。
- Q2 选「保持 0」：Web / 小程序无系统状态栏即不占位，不做 `env` 或 20px 兜底。
- Q3 选「height prop 解决演示」：演示页用 24 / 44 / 88 显式高度做 Web 可视化验收。
- Q4 选「是」：`demo-navbar` 移除自算 `padding-top` 与 `statusBarHeight` ref，改为模板内 `<m-status-bar />` + 44px 导航行。
- Q5 布局组：`demo-components.uts`、zh / en 侧栏均归入「布局组件」并按字母序排在 Space 之后。
- uni-app x 无「JS 写 CSS 变量」，Sard 的 `--s-status-bar-height` 链路改为运行时解析高度 + 内联 `height`。
- 主题变量：未新增（纯高度占位，颜色经样式直达），与需求分析中「视方案决定」一致。

### 变更文件清单

- `packages/core/components/m-status-bar/m-status-bar.uvue`（新增）
- `packages/playground/pages-sub/status-bar/status-bar.uvue`（新增）
- `packages/playground/pages.json`、`packages/playground/router/router.config.uts`、`packages/playground/pages/index/demo-components.uts`（演示注册与分组）
- `packages/playground/components/demo-navbar/demo-navbar.uvue`（改为消费 m-status-bar）
- `packages/docs/src/components/status-bar.md`、`packages/docs/src/en/components/status-bar.md`（新增双语文档）
- `packages/docs/.vitepress/config/zh.ts`、`en.ts`（侧栏）
- `packages/docs/src/changelog.md`、`packages/docs/src/en/changelog.md`、`packages/playground/uni_modules/m-ui-x/changelog.md`（0.3.0 登记）
- `packages/playground/uni_modules/m-ui-x/**`（`pnpm sync:uni-modules` 同步产物）

### 验证方式与结果

- `pnpm sync:uni-modules` + `pnpm sync:uni-modules:check`：通过（playground 插件与 core 一致）。
- `pnpm build:demo`（HBuilderX 5.34 / VDOM）：编译成功，仅既有 SSRSlot 类型标注 warning，无新增诊断。
- 浏览器实测（`http://localhost:5174/unix-ui/playground/pages-sub/status-bar/status-bar`）：四个分区全部渲染；浅蓝色条实测高度 24 / 44 / 88px，渐变条与 `demo-status-bar--dark` 深色圆角条存在；控制台无 error / warning。
- `pnpm build:docs`：构建通过，VitePress 死链检查无报错。

### 遗留 TODO

- App（Android / iOS）真机未实测：`uni.getWindowInfo().statusBarHeight` 取值与 demo-navbar 视觉需真机确认（与 0.1.0 起的平台支持声明一致）。
- Web / 小程序不占位为定案取舍（Q2=1），如有业务需要由使用者显式传 `height`。

