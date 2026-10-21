# unix-ui 组件库 monorepo 搭建 + mxi-button 组件实施计划

## Context

在空仓库 `/Users/queyupeng/github/MengXi-Studio/unix-ui` 中从零搭建面向 uni-app x 的 UI 组件库：

- npm 包名 `@meng-xi/unix-ui`，组件前缀 `mxi-`（如 `<mxi-button>`）
- pnpm monorepo：`packages/core`（组件库）、`packages/docs`（VitePress 文档站）、`packages/playground`（uni-app x 演示工程）
- 兼容 uni-app x 全平台（App-Android/iOS/HarmonyOS、Web、小程序），启用蒸汽模式（vapor）
- 支持 easycom 自动导入（沿用 uni_modules 零配置约定）与全局 uni.scss 主题变量
- 首个组件 `mxi-button`，API 对标 Vant Button

**架构模式直接复用姊妹项目 `unix-request` 的成熟实践**（探索结论）：
- core 本身是标准 uni_modules 插件目录；HBuilderX 只扫描工程内 `uni_modules/`，故用 `scripts/sync-uni-modules.mjs` 将 core 同步到 `playground/uni_modules/mxi-ui`
- playground 为 HBuilderX uni-app x 工程（无 package.json），`manifest.json` 启用 `vapor: true` + `vapor-render-target: bytecode`
- docs 用 VitePress ^1.6.3；根脚本 dev:docs / build:docs / sync:uni-modules / release(bumpp) / typecheck
- 关键差异：unix-request 的 core 是 `utssdk/` UTS 插件；unix-ui 的 core 是 `components/` 组件插件（easycom 约定 `uni_modules/插件id/components/组件名/组件名.uvue` 自动注册，无需 pages.json 配置）

**调研结论引用**：
- uni-ui-x 官方：`<script setup lang="uts">`、`type Props` + `withDefaults`、具名元组 `defineEmits`、class 类型用 `string.ClassString`、无 scoped、无伪元素
- Vant Button：type/size/plain/round/square/disabled/hairline/block/loading/loading-text/color 等完整 Props 表（见下文实现细节）；disabled/loading 时 click 不触发；hairline 用 scale(0.5) 实现 0.5px

## 目录结构

```
unix-ui/
├── package.json                    # 根：private、packageManager: pnpm@10.31.0、workspaces、scripts
├── pnpm-workspace.yaml             # packages/*（复用 unix-request 原文）
├── .gitignore（已存在，补充 unpackage/ 等条目）
├── scripts/
│   └── sync-uni-modules.mjs        # 改造自 unix-request：src=core, dest=playground/uni_modules/mxi-ui
├── packages/
│   ├── core/                       # npm 包 @meng-xi/unix-ui ⇄ uni_modules 插件（双身份）
│   │   ├── package.json            # name: @meng-xi/unix-ui，main/exports 不指向单入口（组件包无入口）
│   │   ├── readme.md               # 简版：简介 + 安装 + easycom 说明
│   │   ├── changelog.md
│   │   ├── license.md
│   │   ├── theme/
│   │   │   └── vars.scss           # 主题变量，全部 !default，供 uni.scss 引入/覆盖
│   │   └── components/
│   │       └── mxi-button/
│   │           └── mxi-button.uvue
│   ├── docs/                       # @meng-xi/unix-ui-docs（VitePress）
│   │   ├── package.json            # 复用 unix-request docs 的依赖版本
│   │   └── src/
│   │       ├── .vitepress/config.mts
│   │       ├── index.md            # 首页（Hero + 特性）
│   │       ├── guide/getting-started.md
│   │       └── components/button.md
│   └── playground/                 # uni-app x 演示工程（HBuilderX 打开）
│       ├── App.uvue / main.uts
│       ├── manifest.json           # appid 新申请占位、uni-app-x: { styleIsolationVersion: 2, vapor: true, vapor-render-target: bytecode }
│       ├── pages.json              # 主包 index + 分包 pages-sub/button
│       ├── uni.scss                # @import uni_modules/mxi-ui/theme/vars.scss（演示用户侧主题接入）
│       ├── pages/index/index.uvue          # 组件总览入口
│       ├── pages-sub/button/button.uvue    # button 全 Props 演示页
│       └── uni_modules/
│           └── mxi-ui/             # sync 产物；package.json 手工维护（id: mxi-ui）+ changelog.md（KEEP 机制）
```

## 关键实现

### 1. 根工程（复用 unix-request 原文，仅换名）

- `package.json`：name `unix-ui`、description「为 uni-app x 提供功能完善的 UI 组件库」、scripts 同款（dev:docs/build:docs filter 到 `@meng-xi/unix-ui-docs`）、devDependencies：bumpp/prettier/typescript
- `scripts/sync-uni-modules.mjs`：从 unix-request 改造——`src=packages/core`、`dest=packages/playground/uni_modules/mxi-ui`、`INCLUDE=['components','theme','readme.md','license.md']`、`KEEP=['package.json','changelog.md']`，哈希校验逻辑照搬

### 2. core/theme/vars.scss（uni.scss 主题方案，双层机制）

```scss
// 编译期变量：uni-app x 会将用户项目根 uni.scss 自动注入每个组件样式，
// 因此组件内直接使用 $mxi-* 变量；此处 !default 保证用户未配置时也可编译（自举）
$mxi-color-primary: #1989fa !default;
$mxi-color-success: #07c160 !default;
$mxi-color-warning: #ff976a !default;
$mxi-color-danger:  #ee0a24 !default;
$mxi-color-default-text: #323233 !default;
$mxi-color-default-bg: #ffffff !default;
$mxi-color-default-border: #ebedf0 !default;
$mxi-white: #ffffff !default;
$mxi-text-color: #323233 !default;
$mxi-disabled-opacity: 0.5 !default;
$mxi-border-width: 1px !default;
$mxi-radius-md: 8px !default;
$mxi-radius-max: 999px !default;
$mxi-button-mini-height: 24px !default;
$mxi-button-small-height: 32px !default;
$mxi-button-normal-height: 44px !default;
$mxi-button-large-height: 50px !default;
$mxi-button-normal-padding: 0 15px !default;
$mxi-button-icon-size: 1.2em !default;
```

组件 `.uvue` 的 style 顶部 `@import '../theme/vars.scss';`（相对路径在 uni_modules 同步后结构不变，双保险：uni.scss 注入值优先 > 组件内 !default）。

### 3. mxi-button.uvue（UTS 强类型，对标 Vant Button）

```ts
// <script setup lang="uts">
type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'
type ButtonSize = 'large' | 'normal' | 'small' | 'mini'
type Props = {
  type?: ButtonType
  size?: ButtonSize
  plain?: boolean
  round?: boolean
  square?: boolean
  disabled?: boolean
  hairline?: boolean
  block?: boolean
  loading?: boolean
  loadingText?: string
  color?: string          // 支持渐变色 linear-gradient
  customClass?: string.ClassString
  customStyle?: string
}
const props = withDefaults(defineProps<Props>(), { type: 'default', size: 'normal', plain: false, round: false, square: false, disabled: false, hairline: false, block: false, loading: false, loadingText: '', color: '', customStyle: '' })
const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()
// click 仅在 !disabled && !loading 时 emit
```

- template：根 view（block 时 width:100%），内层文字置于 `<text>`；loading 时显示加载图标替代文字（loadingText 优先）
- 加载图标：view 圆环（border + transparent 单边）+ `UniElement.animate` 旋转（ucss 禁用 @keyframes，规则要求用 animate API）；实现于组件内函数，带标准中文注释
- hairline（0.5px）：ucss 无伪元素 → 绝对定位内层 view 承载 1px 边框 + `transform: scale(0.5)` 降级实现
- 样式类 BEM：`.mxi-button`、`.mxi-button--primary`、`.mxi-button--plain`、`.mxi-button--disabled`（opacity: $mxi-disabled-opacity）、`.mxi-button--hairline`、`.mxi-button__text`、`.mxi-button__loading`
- plain：文字/边框取主题色、背景白；color prop 存在时文字/边框用 color、背景透明
- 平台差异用条件编译：`/* #ifdef WEB */ cursor: pointer /* #endif */` 等
- template 中滚动容器规则不适用（组件非页面）

### 4. playground 演示页

- `pages/index/index.uvue`：组件总览（scroll-view，条件编译按页面模板规范 `<!-- #ifdef APP -->`），入口卡片跳转 button 演示
- `pages-sub/button/button.uvue`：分区展示所有 Props 组合（type×5、size×4、plain/round/square/hairline/block/disabled/loading/color 渐变），含点击事件 log 输出验证
- `uni.scss`：`@import '@/uni_modules/mxi-ui/theme/vars.scss';` 演示主题接入方式

### 5. docs（VitePress）

- `config.mts`：中文站点、侧边栏（指南/组件/button）
- `guide/getting-started.md`：npm 安装 → uni.scss 引入主题变量 → easycom 说明（uni_modules 同步或 npm 安装两种方式）
- `components/button.md`：Props/Events 表格（对齐 Vant 文档格式）+ 主题定制 + 示例代码块

## 实施步骤

1. 根工程：package.json、pnpm-workspace.yaml、.gitignore 补充、scripts/sync-uni-modules.mjs
2. core 包：package.json、theme/vars.scss、components/mxi-button/mxi-button.uvue、readme.md/changelog.md/license.md
3. playground：manifest.json、pages.json、App.uvue、main.uts、uni.scss、index 页、button 演示页、uni_modules/mxi-ui 手工 package.json（id: mxi-ui）
4. 执行 `pnpm sync:uni-modules` 同步 core → playground
5. docs 包：package.json、VitePress 配置与三个页面
6. 根 `pnpm install` + `pnpm typecheck`（node 脚本部分）
7. 运行验证（见下）

## 验证（DoD）

- [ ] `pnpm install` 无错误；`pnpm sync:uni-modules:check` 校验一致
- [ ] **按 core-protocol 先 `curl https://github.com/dcloudio/hbuilderx-extension-docs/blob/master/zh-cn/cli/_sidebar.md` 确认 HBuilderX CLI 命令格式**，再用 CLI 对 playground 执行编译（优先 web 发行/运行，验证编译通过无报错）
- [ ] 如 CLI 可行：运行后用浏览器（browser agent）打开 playground web 版，截图验证 mxi-button 各状态渲染正确、click 事件正常、disabled/loading 不触发 click
- [ ] `pnpm dev:docs` 启动 VitePress 无报错，button 文档页可访问
- [ ] 清理调试代码，保留必要业务日志

## 明确不做（本轮范围）

- icon 相关 props（icon/icon-position/icon-prefix）——后续版本配合 mxi-icon 组件实现
- url/to/replace 路由跳转 props——依赖路由库选型，后续评估
- 其余组件——按组件清单逐批追加
- 根 README.md——用户未要求
