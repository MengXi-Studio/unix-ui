## 0.3.0 (2026-11-03)

- 新增 `m-flex` / `m-flex-item` 弹性布局组件：`direction` 四值（row / row-reverse / column / column-reverse）、`gap` 三档内置（small / medium / large，对应 `$m-flex-gap-sm` / `$m-flex-gap` / `$m-flex-gap-lg`）与自定义尺寸（number 补 px / string 原样）、`align` 四值（App 端 baseline 降级 flex-start）、`justify` 六值（start / end / center / between / around / evenly）、`flex` CSS 简写透传、`wrap` 自动换行（仅 row / row-reverse）；间距由 m-flex-item 的 margin 实现（App 端 ucss 不支持 flex
  `gap`），子项经 provide/inject + reactive 注册序感知轮位——row 非首项 / row-reverse 非末项 margin-left、column 非首项 margin-top、column-reverse 非末项 margin-bottom（反向方向首尾无多余留白），水平换行时全部子项 margin-left + 容器等值负 margin 补偿（各行行首顶格）、行间距为子项 margin-bottom（末行底部多出一段为已知限制）；未包裹的子元素不参与间距计算，独立使用时退化为普通纵向容器
- 新增 `m-status-bar` 状态栏占位组件：为 Navbar / Notify 等贴顶元素预留系统状态栏高度；`height` prop（px，大于 0 时直接使用）优先，否则 App 端自动读取 `uni.getWindowInfo().statusBarHeight`，Web / 小程序保持 0（不占位）；`custom-class` / `custom-style` 样式直达（背景色等），无专属主题变量；demo-navbar 同步改为消费该组件
- 新增 `m-sticky` 粘性布局组件（全端受控吸附）：页面在滚动容器 `@scroll` 中回传 `scroll-top`，组件沿 `parentElement` 自动识别最近的滚动容器（Web 按 `uni-scroll-view` 类名、App / 小程序按滚动高度大于可视高度），以其实视区为吸附基准；吸附时内容节点切换 `position: fixed`，根节点回填实测占位高度避免布局塌陷。不使用原生 CSS `position: sticky`：uni-app x Web 运行时给所有 `view` 注入 `overflow: hidden`，sticky 的最近滚动容器会退化为不滚动的父级而完全失效（实测滚动 400px 后 rect.top=-198 不吸附）。`position: 'top' | 'bottom'` 与互斥生效的 `offset-top` / `offset-bottom`（相对滚动容器可视边缘）、`z-index`（默认 99 走主题类）、`custom-class` / `custom-style`（挂在内容节点）、`change(isFixed)` 与 `scroll({ scrollTop, isFixed })` 事件
- 新增 `m-sticky-box` 容器边界组件：provide/inject 向内部 m-sticky 注入容器 `UniElement` 引用，吸附元素到达容器上下边缘时回顶（复刻 Vant 的 containerVisible 判定与 translateY 补偿）；容器高度需显式指定以形成吸附行程
- 新增主题变量 `$m-sticky-z-index: 99 !default`；仅首次测量 + 窗口 resize 自动重测，内容尺寸变化需重建组件（不提供 `refresh()`）
- 清理 VDOM Web 运行时 TS 诊断 WARNING（32 处 Prop 类型）：可空 prop 声明 `T | null` 且默认 null 时，编译器生成 `type: [T, null]` 形态的 props（Vue Prop 类型系统不接受 type 数组中的 null），触发 `No overload matches this call` 诊断噪音并会泄漏到使用者的运行日志；统一去掉类型标注中的 `| null` 并**保留 `default: null`**（未传时运行时仍为 null，三态语义与行为不变）——覆盖 `m-calendar` / `m-calendar-popup` / `m-calendar-input` 的日期与 `formatter` 类可空 prop、`m-col` `offset`、`m-row` `justify` / `align`、`m-grid` `gutter` / `columnNum` / `iconSize`、`m-grid-item` `icon` / `gutter`、`m-image` `width` / `height` / `radius`、`m-space` `size` / `align`、`m-input` `formatter` / `precision` / `min` / `max`、`m-cell` `icon` / `clickable`、`m-toast` 七个可空 prop、`m-popup` `beforeClose`；残余 3 条 SSRSlot WARNING 来自插槽条件转发的生成代码，属编译器类型标注噪音，不影响运行

## 0.2.0 (2026-11-03)

- 新增 `m-overlay` 遮罩层组件：`show` 显示驱动、`z-index` 层级、`duration` 动画时长（秒，0 禁用动画）、`custom-class` / `custom-style` 样式直达与 `click`
  事件（遮罩不自动关闭，对齐 Vant 语义）；淡入淡出为 opacity 两态过渡，内置 Web 端 body 滚动锁定（多实例堆叠全关才还原），是弹窗类组件的基础
- 新增 `m-popup` 弹出层组件：五方位（center / top / bottom / left / right）、`round` 分侧圆角、`closeable` 关闭图标（`close-icon` / `close-icon-position` 四角）、`close-on-click-overlay`、遮罩定制（`overlay` /
  `overlay-class` / `overlay-style`）、`z-index` / `duration`、`lazy-render` / `destroy-on-close`、`safe-area-inset-top` / `safe-area-inset-bottom`、`before-close` 关闭前拦截；`v-model:show` 双向绑定与 open / opened /
  close / closed / click / click-overlay / click-close-icon 全事件；center 缩放淡入、四方位平移过渡，基于 m-overlay 组合实现
- 新增 `m-divider` 分割线组件：水平 / 垂直两种形态（垂直为 flex 子项，外层容器需 `flex-direction: row` + `align-items: center`）、`dashed` 虚线、`hairline` 0.5px 细线（border
  1px + 单轴缩放 0.5 实现，App 端安全）、`content-position` 内容位置（left / right / center，一侧线限宽 10%）、默认插槽与文本样式继承
- 新增 `m-grid` / `m-grid-item` 宫格组件：`column-num` 自定义列数、`square` 正方形格子、`gutter` 格子间距、`border` 完整表格边框（容器顶线 + 左线、格子右线 + 下线拼线）、`center` 内容居中、`direction` 横排、`reverse`
  反向、`clickable` 按压反馈（hover-class）；格子 `text` / `icon` / `icon-color`、`dot` / `badge` 徽标、`click` 事件与 `url` 应用内跳转，default / icon / text 三插槽
- 新增 `m-toast` 轻提示组件：函数式 API（`showToast` / `showSuccessToast` / `showFailToast` / `showLoadingToast` / `closeToast`，string 简写与 ToastOptions 对象双入参，单例语义）与组件式（`v-model:show` +
  default 插槽）双形态；`type`（text / loading / success / fail）、`position`（top / middle / bottom）、`icon` 自定义图标、`overlay` / `forbidClick` 遮罩与点击拦截、`closeOnClick` /
  `closeOnClickOverlay`、`duration`（loading 型默认 0 不自动关）、`wordBreak` 换行控制（normal / break-all 全端生效，break-word 仅 Web/小程序，App 回退 normal）、`onOpened` / `onClose` 回调与 opened /
  close 事件；采用「全局函数 + 页面预置容器 + 全局单例桥」方案（uni-app x 无运行时动态挂载能力），API 手感对齐 Vant
- 新增 `m-compact` 紧凑布局组件：包裹 `m-button` 使相邻项圆角衔接、相邻边框合并为 1px，支持变体混排；`block` 块级撑满（水平 `flex: 1` 等分 / 垂直满宽，子按钮无需逐个设置）、`direction` 水平 / 垂直排列；组内子项 `v-if` /
  `v-for` 动态增删时首、中、尾位置自动重排；0.5px 细边框（hairline）按钮的缩放层同步清理对应侧圆角与边框；基于 provide/inject + reactive 注册序实现位置感知（ucss 无 `:first-child`
  结构选择器），无专属主题变量（圆角 / 边框复用 `$m-button-*` 系列）
- 新增 `m-space-item` 间距子项组件：m-space 子元素的包裹组件，间距由其 margin 实现——App 端 ucss 不支持 flex
  `gap`（官方 CSS 属性清单无 gap，原生运行时属性表亦无），原 gap 声明被编译器静默丢弃导致 App 端间距失效；子项经 provide/inject +
  reactive 注册序感知自身位次（复用 m-compact 先例），horizontal 全部子项 margin-left + 容器等值负 margin 补偿（换行各行行首顶格）/
  vertical 非首项 margin-top，wrap 场景行间距为子项 margin-bottom（末行底部多出一段为已知限制）；未包裹的子元素不参与间距计算，独立使用时退化为普通纵向容器
- 新增 `m-input` 输入框组件：六种类型（text / tel / digit / number / password / textarea）、`clearable` + `clear-trigger` 两时机（focus / always）、`show-word-limit` 字数统计、`border` /
  `inlaid`（清边框内边距嵌入单元格）、`disabled` / `readonly`、textarea `auto-height`；`formatter` + `format-trigger`（onChange / onBlur）、`precision`（保留尾零）、`min` / `max` 失焦数字收敛、`show-eye`
  明文切换；prepend / append 插槽、`v-model` 与 input / change / focus / blur / clear 事件、expose `focus()` / `blur()` 方法；注入 m-compact 上下文，可与 m-button 混排
- 新增 `m-calendar` / `m-calendar-popup` / `m-calendar-input` 日历三组件（对标 Vant Calendar，按「面板 / 弹出框 / 输入框」拆分）：`m-calendar` 纯平铺日历面板，single / multiple / range 三种选择类型、`switch-mode`
  年月切换导航（month / year-month，导航 clamp 到可选范围）、`formatter` 日期格式化（topInfo / bottomInfo / className / 禁用态）、`first-day-of-week` 周起始日、`row-height`
  行高、月份背景水印（`show-mark`，水平居中）、`height` 面板高度（固定高度内部滚动，副标题随滚动切换为视口月份）、`color` 主题色派生选中方块与范围 bar（支持渐变）、`min-date` / `max-date` 界外禁用、`max-range`
  范围与多选通用超限限制（拒绝 + `over-range` 事件 + m-toast 提示）、`allow-same-day` 起止同日、`default-date` 预选；select / confirm / unselect / over-range / month-show / panel-change / click-subtitle /
  click-disabled-date 事件；title / subtitle / month-title / text / top-info / bottom-info / footer /
  confirm-text 与四个导航图标插槽（默认渲染内置在面板组件内，与样式同 scope；宿主仅条件转发用户插槽）；月块内标题内置渲染对齐 Vant（首月由副标题承担当月标题，其余月显示），传入 month-title 插槽可自定义；日格行距对齐 Vant（行高即行距，无额外间距）；选中态为 54px 圆角方块盖于范围 bar 之上（`$m-calendar-day-radius`
  可调）；expose `reset()` / `resetSelection()` / `scrollToDate()` / `getSelectedDate()` / `refreshView()` 方法；`v-model:value`
  双向绑定选中值（类型随 type，优先于 default-date 作初始值，select/unselect/reset 自动回写）；`show-confirm` 默认 `false`
  纯面板选择即所得（选满自动 confirm，弹层组合 m-calendar-popup 默认开启确认按钮）。`m-calendar-popup` 基于 m-popup 组合的弹层日历：弹层 props 全透传（position / round / z-index / duration / 遮罩可关 / 安全区）与
  `popup-height`（% 按窗口高换算）、确认后自动关闭、复开时 `refreshView` 复位聚焦月、`v-model:value` 受控选中值透传、`reset-on-open` 打开时重置选择为 value /
  default-date、日历事件与插槽条件转发（未传入保持默认渲染）。`m-calendar-input` 基于 m-input 只读触发器 + 弹层组合：`v-model:value` 确认回填（single 单值 / range「起 ~ 止」/
  multiple 顿号串展示）、自绘清空按钮（clear 事件）、disabled / border / inlaid 触发器形态、弹层打开重置选择为当前值（内部启用 `reset-on-open`）
- 双模式（蒸汽 / VDOM）云打包兼容：修复 VDOM 编译产物全部 Kotlin 错误，组件库可同时以两种模式打包（Web 端行为不变）
  - `watch` 监听源加显式返回类型（10 处：m-icon / m-col / m-loading / m-calendar / m-toast / m-popup / m-overlay / m-image），规避 VDOM 产物 `Return type mismatch`
  - `useSlots()` 槽位检测改索引访问 `slots['default'] != null`（m-badge / m-loading / m-grid-item / m-toast / m-input / m-calendar-popup，VDOM 运行时返回 Map）
  - m-loading：`Animation` → `UniAnimation`（VDOM 运行时类型名）
  - m-calendar-panel：模板调用的 calendar.uts 工具函数经 setup 内本地桥接转发（模板表达式对导入函数的调用在 VDOM 产物中不可调用）
  - m-calendar-popup：事件转发处理函数统一 const 箭头函数（23 处）+ 插槽条件转发模板 `$slots['xxx']` 索引化
- 清理 ucss 编译 ERROR（App 端，双模式均验证清零）：
  - `m-divider`：内容位置侧线 `max-width: 10%` → `flex: none` + `width`（App 端 max-width 不支持百分比；空线 flex:1 恒命中上限，视觉等价）
  - `m-toast`：气泡宽度上限 App 端改运行时按窗口宽 70% 换算 px 内联注入（原声明被编译器丢弃导致长文本无上限，本次顺带修复实际表现）；Web/小程序保留 `$m-toast-max-width` 覆盖契约
  - `m-toast`：`word-break: break-word` App 端条件编译排除（ucss 仅支持 normal / break-all），App 回退 normal 换行
  - `m-space`：间距实现重构为 m-space-item 子组件 margin 方案（App 端 ucss 不支持 flex `gap`，声明被编译器静默丢弃导致间距失效），双模式云打包 gap WARNING 清零；演示页（text / image / toast / popup / overlay /
    compact）同步去除全部 gap 用法，改 margin 间距类实现
- 修复 Android 云打包 Kotlin 编译错误（4 处 UTS 先用后声明 + 3 处类型问题，Web 端行为不变）：
  - `m-calendar`：`v-model:value` 的 watch 回调移至 `getSelectedDate` 声明之后（Kotlin 局部函数禁前向引用）
  - `m-input`：focus / blur 公共处理函数移至四个原生事件桥接函数之前
  - `m-toast`：关闭流程函数移至自动关闭计时函数之前；`custom-class` prop 传入选项结构体时显式 `as string`（Kotlin 端 ClassString 与 string 类型不同）
  - `m-calendar-input` 演示页：`fmtDate` 声明移至 `fmtValue` 之前
  - `m-calendar` 工具：`hexDigitValue` 对 `charCodeAt` 返回的空值先行短路（Kotlin 禁可空接收者运算）
  - `m-row`：行分组首组改为显式类型声明（嵌套空数组字面量在 Kotlin 端泛型无法推断）

## 0.1.0（2026-10-27）

- 首个版本发布：面向 uni-app x 的 UI 组件库（UTS + uvue 一套源码多端覆盖），内置 9 个基础组件
- 新增 `m-button` 按钮组件：支持类型（default / primary / success / warning / danger）、尺寸（large / normal / small /
  mini）、朴素、圆角、方形、细边框（0.5px）、块级、禁用、加载状态（加载图标由 m-loading 驱动，loading-type 支持 circular / spinner）、按压反馈（hover-class 实现）与自定义颜色（含渐变）
- 新增 `m-badge`
  徽标组件：右上角徽标数字 / 文案 / 红点，支持 max 截断（`{max}+`）、语义色名与 CSS 色值、四角 position、offset-x/offset-y 偏移、show-zero 与 content 自定义内容插槽；无子元素时独立展示，可与 m-icon 组合使用
- 新增 `m-icon` 图标组件：内置 257 个字体图标（`name` 为 `IconName` 联合类型），支持 `color` / `size` 自定义、`custom-class` / `custom-style` 标签样式直达、`icon` 插槽与 `click` 事件；字体文件随包内置（`@font-face`
  声明式加载），零配置、离线可用
- 新增 `m-loading` 加载组件：circular（弧段圆环）/ spinner（花瓣）双形态，支持 `color` / `size` 自定义（size 支持 `100%` 撑满外部定尺寸容器）、`vertical` 垂直排列、`text-size` / `text-color`
  文案样式、默认文案插槽与 icon 自定义图标插槽；动画基于 `UniElement.animate`（ucss 无 `@keyframes`）
- 新增 `m-cell` / `m-cell-group` 单元格组件：title / value / label、图标、四向箭头、inset 圆角卡片分组
- 新增 `m-row` / `m-col` 栅格布局组件：gutter 间距、对齐、换行
- 新增 `m-image` 图片组件：mode 直通、加载 / 失败占位、淡入过渡、圆形、懒加载
- 新增 `m-text` 文本组件：语义色 / 色值双模式、三档字号、单行省略、多行截断、可选中
- 新增 `m-space` 间距组件：方向 / 换行 / 对齐，size 单值或双值（行 / 列）分写
- 主题机制：默认主题零配置内置（组件内顶层引入 `theme/vars.scss`，全 `!default`），在工程根 uni.scss 直接定义 `$m-*` 变量即可编译期全局覆盖
- easycom 自动导入：遵循 uni_modules 组件插件规范（插件 id：`m-ui-x`），免 import 免注册
