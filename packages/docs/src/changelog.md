# 更新日志

## [0.2.0] - 2026-10-28

新增弹窗类基础组件（m-overlay / m-popup）与分割线组件（m-divider），基础组件数量达到 12 个。

### 新增

- **m-overlay 遮罩层**：`show` 显示驱动、`z-index` 层级、`duration` 动画时长（秒，`0` 禁用动画）、`custom-class` / `custom-style` 样式直达与 `click` 事件（遮罩不自动关闭，对齐 Vant 语义）；内置 Web 端 body 滚动锁（多实例堆叠全关才还原），是弹窗类组件的基础
- **m-popup 弹出层**：五方位（center / top / bottom / left / right）、round 分侧圆角、closeable 关闭图标（`close-icon` / `close-icon-position` 四角）、`close-on-click-overlay`、遮罩定制（`overlay` / `overlay-class` / `overlay-style`）、`z-index` / `duration`、`lazy-render` / `destroy-on-close`、`safe-area-inset-top` / `safe-area-inset-bottom`、`before-close` 关闭前拦截（boolean 同步版）；`v-model:show` 双向绑定，open / opened / close / closed / click / click-overlay / click-close-icon 全事件；center 缩放淡入、四方位平移过渡，基于 m-overlay 组合实现
- **m-divider 分割线**：水平 / 垂直两种形态（垂直为 flex 子项，外层容器需 `flex-direction: row` + `align-items: center`）、`dashed` 虚线、`hairline` 0.5px 细线（border 1px + 单轴缩放 0.5 实现，App 端安全）、`content-position` 内容位置（left / right / center，一侧线限宽 10%）、默认插槽与文本样式继承

## [0.1.0] - 2026-10-27

首个可用版本：面向 uni-app x 的 UI 组件库，pnpm monorepo 架构（core / docs / playground 三包），UTS + uvue 一套源码多端覆盖，内置 9 个基础组件。

### 新增

- **m-button 按钮**：五种类型（default / primary / success / warning / danger）、四种尺寸（large / normal / small / mini）、朴素（plain）、圆形（round）、方形（square）、块级（block）、禁用（disabled）、加载状态（loading / loading-text，加载图标由 [m-loading](/components/loading) 驱动，loading-type 支持 circular / spinner）、按压反馈（基于 hover-class，透明度可经 `$m-button-active-opacity` 覆盖）、自定义颜色（color，支持 `linear-gradient` 渐变）、细边框（hairline）
- **m-badge 徽标**：右上角徽标数字 / 文案 / 红点，max 截断（`{max}+`）、语义色名与 CSS 色值、四角 position、offset-x / offset-y 偏移、show-zero 与 content 自定义内容插槽；无子元素时独立展示，可与 m-icon 组合使用
- **m-icon 图标**：内置 257 个字体图标（name 为 IconName 联合类型），支持 color / size 自定义、custom-class / custom-style 标签样式直达、icon 插槽与 click 事件；字体文件随包内置（`@font-face` 声明式加载），零配置、离线可用
- **m-loading 加载**：两种加载类型（circular 弧段圆环 / spinner 花瓣）、自定义颜色（color，支持 CSS 色值与语义色名）、自定义大小（size，支持 `100%` 撑满外部定尺寸容器）、垂直排列（vertical）、自定义文案样式（text-size / text-color）、默认文案插槽与 icon 自定义图标插槽；spinner 型采用 1.2s 12 步离散旋转 + 亮度拖尾，circular 型为弧段圆环匀速旋转，动画基于 `UniElement.animate`（ucss 无 `@keyframes`）
- **m-cell / m-cell-group 单元格**：title / value / label、图标、四向箭头、inset 圆角卡片分组
- **m-row / m-col 栅格布局**：gutter 间距、对齐、换行
- **m-image 图片**：mode 直通、加载 / 失败占位、淡入过渡、圆形、懒加载
- **m-text 文本**：语义色 / 色值双模式、三档字号、单行省略、多行截断、可选中
- **m-space 间距**：方向 / 换行 / 对齐，size 单值或双值（行 / 列）分写
- **easycom 自动导入**：uni_modules 规范目录结构（`uni_modules/m-ui-x/components/组件名/组件名.uvue`），免 import 免注册；npm 方式提供 pages.json `easycom.custom` 规则
- **主题机制**：默认主题零配置内置（组件内顶层引入 `theme/vars.scss`，全 `!default`）；在项目根 uni.scss 直接定义 `$m-*` 变量即可编译期全局覆盖，详见[主题定制](/guide/theming)
- **0.5px 细边框**：ucss 无伪元素，采用绝对定位 view + `scale(0.5)` 方案，Web 与原生端表现一致
- **事件语义**：禁用与加载状态下 click 不触发

### 工程化

- **pnpm monorepo**：packages/core（组件源码）/ packages/docs（VitePress 文档站）/ packages/playground（uni-app x 演示工程）
- **uni_modules 同步脚本**：`sync-uni-modules.mjs` 将 core 同步至 playground `uni_modules/m-ui-x`，含 sha256 一致性校验（`--check`）
- **蒸汽模式**：playground 已启用 `vapor: true` + `vapor-render-target: bytecode`，组件在蒸汽模式编译验证通过
- **VitePress 文档站**：本地搜索（中文翻译）、UTS 语法高亮、暗色代码主题、首页徽章

### 平台支持

- **Web**：编译与运行验证通过（渲染、事件、主题覆盖矩阵实测）
- **Android / iOS / HarmonyOS / 小程序**：代码已按条件编译适配，待真机与开发者工具实测
