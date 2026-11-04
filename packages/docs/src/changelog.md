# 更新日志

## [0.3.0] - 2026-11-03

新增弹性布局组件（m-flex / m-flex-item）、状态栏占位组件（m-status-bar）、粘性布局组件（m-sticky / m-sticky-box）与瀑布流组件（m-waterfall / m-waterfall-item / m-waterfall-load），均为布局组件。

### 新增

- **m-flex / m-flex-item 弹性布局**：`direction` 四值（row / row-reverse / column / column-reverse，等价 flex-direction）、`gap` 三档内置（small / medium / large，对应 `$m-flex-gap-sm` / `$m-flex-gap` / `$m-flex-gap-lg`）与自定义尺寸（number 补 px / string 原样）、`align` 四值（等价 align-items，App 端 baseline 降级 flex-start）、`justify` 六值（等价 justify-content，新增 between / around / evenly）、`flex` CSS 简写透传、`wrap` 自动换行（仅 row / row-reverse）与 default 插槽；间距由 m-flex-item 的 margin 实现（App 端 ucss 不支持 flex `gap`），子项经 provide/inject + reactive 注册序感知轮位——row 非首项 `margin-left`、row-reverse 非末项 `margin-left`、column 非首项 `margin-top`、column-reverse 非末项 `margin-bottom`（反向方向首尾无多余留白），水平换行时全部子项 `margin-left` + 容器等值负 margin 补偿（各行行首顶格）、行间距为子项 `margin-bottom`（末行底部多出一段为已知限制）；未包裹的子元素不参与间距计算，m-flex-item 独立使用时退化为普通纵向容器
- **m-status-bar 状态栏占位**：为 Navbar / Notify 等贴顶元素预留系统状态栏高度；`height` prop（px，大于 0 时直接使用）优先，否则 App 端自动读取 `uni.getWindowInfo().statusBarHeight`，Web / 小程序无系统状态栏保持 0（不占位）；`custom-class` / `custom-style` 样式直达（背景色等），无专属主题变量；playground 的 demo-navbar 同步改为消费该组件
- **m-sticky 粘性布局（全端受控吸附）**：页面在滚动容器 `@scroll` 中回传 `scroll-top`，组件沿 `parentElement` 自动识别最近的滚动容器（Web 按 `uni-scroll-view` 类名、App / 小程序按滚动高度大于可视高度），以其实视区为吸附基准；吸附时内容节点切换 `position: fixed`，根节点回填实测占位高度避免布局塌陷。**不使用原生 CSS `position: sticky`**：uni-app x Web 运行时给所有 `view` 注入 `overflow: hidden`，sticky 的最近滚动容器会退化为不滚动的父级而完全失效（实测滚动 400px 后 rect.top=-198 不吸附）。`position`（top / bottom）与互斥生效的 `offset-top` / `offset-bottom`（相对滚动容器可视边缘，自定义导航栏无需叠加高度）、`z-index`（默认 99 走主题类，非默认 inline 覆盖）、`custom-class` / `custom-style`（挂在内容节点）、`change(isFixed)` 与 `scroll({ scrollTop, isFixed })` 事件；仅首次测量 + 窗口 resize 自动重测，内容尺寸变化需重建组件（不提供 `refresh()`）
- **m-sticky-box 容器边界**：provide/inject 向内部 m-sticky 注入容器 `UniElement` 引用，吸附元素到达容器上下边缘时回顶（复刻 Vant 的 containerVisible 判定与 translateY 补偿）；容器高度需显式指定以形成吸附行程；新增主题变量 `$m-sticky-z-index: 99 !default`
- **m-waterfall / m-waterfall-item / m-waterfall-load 瀑布流**：容器实测可用宽度等分出列宽，项在正确列宽下实测自身高度上报，按「注册顺序 → 最短列优先」计算绝对定位（left / top / width）并回填容器总高度；严格顺序排版（前项未加载完成时后续项隐藏等待，已显示项不跳动），未加载项以 `visibility: hidden` 按正确列宽占位保证测量准确；`columns`（默认 2）、`column-gap` / `row-gap`（px，默认 16）、`custom-class` / `custom-style`；项插槽透出 `onLoad`（内容加载完成后调用，触发重测）与 `columnWidth`；`loadstart` / `load` 事件与 `reflow()` / `onLoad(handler)` 实例方法；`m-waterfall-load` 按 width / height 用 `padding-top` 预占高度，`max-wait` 内加载完成取图片真实宽高、超时保留自定义比例并透出 `overtime`；无 ResizeObserver，容器宽度在挂载 / 窗口 resize / reflow 时测量，容器左右 padding 会挤压列宽（留白请放外层）

### 修复

- **清理 VDOM Web 运行时 TS 诊断 WARNING（32 处 Prop 类型）**：可空 prop 声明 `T | null` 且默认 null 时，编译器生成 `type: [T, null]` 形态的 props（Vue Prop 类型系统不接受 type 数组中的 null），触发 `No overload matches this call` 诊断噪音并会泄漏到使用者的运行日志；统一去掉类型标注中的 `| null` 并**保留 `default: null`**（未传时运行时仍为 null，三态语义与行为不变）——涉及 m-calendar（`value` / `minDate` / `maxDate` / `defaultDate` / `formatter` / 月块 `panel`）、m-calendar-popup（同前）、m-calendar-input（`value` / `minDate` / `maxDate`）、m-col `offset`、m-row（`justify` / `align`）、m-grid（`gutter` / `columnNum` / `iconSize`）、m-grid-item（`icon` / `gutter`）、m-image（`width` / `height` / `radius`）、m-space（`size` / `align`）、m-input（`formatter` / `precision` / `min` / `max`）、m-cell（`icon` / `clickable`）、m-toast（`type` / `position` / `icon` / `forbidClick` / `loadingType` / `duration` / `wordBreak`）、m-popup `beforeClose`；残余 3 条 SSRSlot WARNING 来自插槽条件转发的生成代码，属编译器类型标注噪音，不影响运行

## [0.2.0] - 2026-11-03

新增弹窗类基础组件（m-overlay / m-popup）、分割线组件（m-divider）、宫格组件（m-grid / m-grid-item）、轻提示组件（m-toast，反馈组件）、紧凑布局组件（m-compact，布局组件）、输入框组件（m-input，表单组件）与日历三组件（m-calendar / m-calendar-popup / m-calendar-input，表单组件），基础组件数量达到 18 个。

### 新增

- **m-overlay 遮罩层**：`show` 显示驱动、`z-index` 层级、`duration` 动画时长（秒，`0` 禁用动画）、`custom-class` / `custom-style` 样式直达与 `click` 事件（遮罩不自动关闭，对齐 Vant 语义）；内置 Web 端 body 滚动锁（多实例堆叠全关才还原），是弹窗类组件的基础
- **m-popup 弹出层**：五方位（center / top / bottom / left / right）、round 分侧圆角、closeable 关闭图标（`close-icon` / `close-icon-position` 四角）、`close-on-click-overlay`、遮罩定制（`overlay` / `overlay-class` / `overlay-style`）、`z-index` / `duration`、`lazy-render` / `destroy-on-close`、`safe-area-inset-top` / `safe-area-inset-bottom`、`before-close` 关闭前拦截（boolean 同步版）；`v-model:show` 双向绑定，open / opened / close / closed / click / click-overlay / click-close-icon 全事件；center 缩放淡入、四方位平移过渡，基于 m-overlay 组合实现
- **m-divider 分割线**：水平 / 垂直两种形态（垂直为 flex 子项，外层容器需 `flex-direction: row` + `align-items: center`）、`dashed` 虚线、`hairline` 0.5px 细线（border 1px + 单轴缩放 0.5 实现，App 端安全）、`content-position` 内容位置（left / right / center，一侧线限宽 10%）、默认插槽与文本样式继承
- **m-grid / m-grid-item 宫格**：`column-num` 自定义列数、`square` 正方形格子（padding-top 百分比 + 内容绝对定位）、`gutter` 格子间距（行 / 列同值，平均分配对齐 m-row 先例）、`border` 完整表格边框（容器承担顶线 + 左线，格子承担右线 + 下线拼线）、`center` 内容居中、`direction` 横排、`reverse` 图标文本换位、`clickable` 按压反馈（view 原生 hover-class）；格子 `text` / `icon` / `icon-color`、`dot` / `badge` 徽标（m-badge 联动）、`click` 事件与 `url` 应用内页面跳转，default / icon / text 三插槽
- **m-toast 轻提示**：函数式 API（`showToast` / `showSuccessToast` / `showFailToast` / `showLoadingToast` / `closeToast`，string 简写与 ToastOptions 对象双入参，单例语义）与组件式（`v-model:show` + default 插槽）双形态；`type`（text / loading / success / fail）、`position`（top / middle / bottom）、`icon` 自定义图标、`overlay` / `forbidClick` 遮罩与点击拦截、`closeOnClick` / `closeOnClickOverlay`、`duration`（loading 型默认 0 不自动关）、`wordBreak` 换行控制（normal / break-all 全端生效，break-word 仅 Web/小程序，App 回退 normal，对齐 Vant）、`onOpened` / `onClose` 回调与 opened / close 事件；采用「全局函数 + 页面预置容器 + 全局单例桥」方案（uni-app x 无运行时动态挂载能力），API 手感对齐 Vant
- **m-compact 紧凑布局**：包裹 m-button 使相邻项圆角衔接、相邻边框合并为 1px，支持变体混排；`block` 块级撑满（水平 `flex: 1` 等分 / 垂直满宽，子按钮无需逐个设置）、`direction` 水平 / 垂直排列；组内子项 `v-if` / `v-for` 动态增删时首、中、尾位置自动重排；0.5px 细边框（hairline）按钮的缩放层同步清理对应侧圆角与边框；基于 provide/inject + reactive 注册序实现位置感知（ucss 无 `:first-child` 结构选择器），无专属主题变量（圆角 / 边框复用 `$m-button-*` 系列，详见 [Compact](/components/compact)）
- **m-space-item 间距子项**：m-space 子元素的包裹组件，间距由其 margin 实现——App 端 ucss 不支持 flex `gap`，原 gap 声明被编译器静默丢弃导致 App 端间距失效；子项经 provide/inject + reactive 注册序感知自身位次（复用 m-compact 先例），horizontal 全部子项 margin-left + 容器等值负 margin 补偿（换行各行行首顶格）/ vertical 非首项 margin-top，wrap 场景行间距为子项 margin-bottom（末行底部多出一段为已知限制）；未包裹的子元素不参与间距计算，独立使用时退化为普通纵向容器（详见 [Space](/components/space)）
- **m-input 输入框**：六种类型（text / tel / digit / number / password / textarea）、`clearable` + `clear-trigger` 两时机（focus / always，对齐 Vant）、`maxlength`（-1 不限制）+ `show-word-limit` 字数统计、`border` / `inlaid`（清边框内边距嵌入单元格）、`disabled` / `readonly`（无原生 readonly 以 disabled 模拟）、`confirm-type`、textarea `auto-height`；`formatter` + `format-trigger`（onChange / onBlur）、`precision` 精度保留尾零、`min` / `max` 失焦数字收敛、`show-eye` 明文切换（对齐 Sard）；prepend / append 插槽、`v-model` 统一 string 与 input / change（失焦快照比对，模拟 Vant 语义）/ focus / blur / clear 事件、expose `focus()` / `blur()` 方法；provide/inject 注入 m-compact 上下文，可与 m-button 混排（详见 [Input](/components/input)）
- **m-calendar / m-calendar-popup / m-calendar-input 日历三组件**：对标 Vant Calendar，按「面板 / 弹出框 / 输入框」拆为三个组件——m-calendar 纯平铺面板（single / multiple / range 三种选择类型、`switch-mode` 年月切换导航（导航 clamp 到可选范围）、`formatter` 日期格式化、`first-day-of-week` 周起始日、`row-height` 行高、月份背景水印、`height` 面板高度、`color` 主题色派生选中圆与范围 bar（支持渐变）、`min-date` / `max-date` 界外禁用、`max-range` 范围与多选通用超限限制（拒绝 + `over-range` + m-toast 提示）、`allow-same-day` 起止同日、`default-date` 预选；select / confirm / unselect / over-range / month-show / panel-change / click-subtitle / click-disabled-date 事件与 12 个插槽；expose `reset()` / `resetSelection()` / `scrollToDate()` / `getSelectedDate()` / `refreshView()` 方法）；m-calendar-popup 基于 m-popup 组合的弹层日历（弹层 props 全透传与 `popup-height` % 换算、确认后自动关闭、复开 `refreshView` 复位聚焦月、`v-model:value` 受控选中值透传、`reset-on-open` 打开时重置选择为 value / default-date、日历事件与插槽条件转发）；m-calendar-input 基于 m-input 只读触发器 + 弹层组合（`v-model:value` 确认回填、single 单值 / range 区间串 / multiple 顿号串展示、自绘清空按钮、disabled / border / inlaid 形态、弹层打开重置选择为当前值（内部启用 `reset-on-open`））（详见 [Calendar](/components/calendar)）

### 修复

- **双模式（蒸汽 / VDOM）云打包兼容**：修复 VDOM 编译产物全部 Kotlin 错误，组件库可同时以两种模式打包（Web 端行为不变）——`watch` 监听源加显式返回类型（10 处）、`useSlots()` 槽位检测改索引访问（6 组件）、m-loading `Animation` → `UniAnimation`、m-calendar-panel 模板工具函数本地桥接转发、m-calendar-popup 事件处理函数统一 const 箭头函数与 `$slots['xxx']` 索引化
- **清理 ucss 编译 ERROR（App 端）**：m-divider 内容位置侧线 `max-width: 10%` 改 `flex: none` + `width`（App 端 max-width 不支持百分比）；m-toast 气泡宽度上限 App 端改运行时按窗口宽 70% 换算 px 内联注入（顺带修复原声明被丢弃导致的长文本无上限）；`word-break: break-word` App 端条件编译排除，回退 normal；m-space 间距重构为 m-space-item margin 方案（App 端 ucss 不支持 flex `gap`，声明被静默丢弃导致间距失效），演示页同步去除全部 gap 用法，双模式云打包 gap WARNING 清零
- **修复 Android 云打包 Kotlin 编译错误**：4 处 UTS 先用后声明（m-calendar watch 回调 / m-input 事件桥接 / m-toast 关闭流程 / 演示页工具函数声明序）与 3 处类型问题（`custom-class` 显式 `as string`、`hexDigitValue` 可空短路、m-row 分组首组显式类型）

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
