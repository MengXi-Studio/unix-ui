## 0.2.0（2026-10-28）

- 新增 `m-overlay`
  遮罩层组件：`show` 显示驱动、`z-index` 层级、`duration` 动画时长（秒，0 禁用动画）、`custom-class` / `custom-style` 样式直达与 `click` 事件（遮罩不自动关闭，对齐 Vant 语义）；淡入淡出为 opacity 两态过渡，内置 Web 端 body 滚动锁定（多实例堆叠全关才还原），是弹窗类组件的基础
- 新增 `m-popup`
  弹出层组件：五方位（center / top / bottom / left / right）、`round` 分侧圆角、`closeable` 关闭图标（`close-icon` / `close-icon-position` 四角）、`close-on-click-overlay`、遮罩定制（`overlay` / `overlay-class` / `overlay-style`）、`z-index` / `duration`、`lazy-render` / `destroy-on-close`、`safe-area-inset-top` / `safe-area-inset-bottom`、`before-close` 关闭前拦截；`v-model:show` 双向绑定与 open / opened / close / closed / click / click-overlay / click-close-icon 全事件；center 缩放淡入、四方位平移过渡，基于 m-overlay 组合实现
- 新增 `m-divider`
  分割线组件：水平 / 垂直两种形态（垂直为 flex 子项，外层容器需 `flex-direction: row` + `align-items: center`）、`dashed` 虚线、`hairline` 0.5px 细线（border 1px + 单轴缩放 0.5 实现，App 端安全）、`content-position` 内容位置（left / right / center，一侧线限宽 10%）、默认插槽与文本样式继承
- 新增 `m-grid` / `m-grid-item`
  宫格组件：`column-num` 自定义列数、`square` 正方形格子、`gutter` 格子间距、`border` 完整表格边框（容器顶线 + 左线、格子右线 + 下线拼线）、`center` 内容居中、`direction` 横排、`reverse` 反向、`clickable` 按压反馈（hover-class）；格子 `text` / `icon` / `icon-color`、`dot` / `badge` 徽标、`click` 事件与 `url` 应用内跳转，default / icon / text 三插槽
- 新增 `m-toast`
  轻提示组件：函数式 API（`showToast` / `showSuccessToast` / `showFailToast` / `showLoadingToast` / `closeToast`，string 简写与 ToastOptions 对象双入参，单例语义）与组件式（`v-model:show` + default 插槽）双形态；`type`（text / loading / success / fail）、`position`（top / middle / bottom）、`icon` 自定义图标、`overlay` / `forbidClick` 遮罩与点击拦截、`closeOnClick` / `closeOnClickOverlay`、`duration`（loading 型默认 0 不自动关）、`wordBreak` 换行控制（normal / break-all / break-word，App 端 Vapor 5.31+ 生效）、`onOpened` / `onClose` 回调与 opened / close 事件；采用「全局函数 + 页面预置容器 + 全局单例桥」方案（uni-app x 无运行时动态挂载能力），API 手感对齐 Vant
- 新增 `m-compact`
  紧凑布局组件：包裹 `m-button` 使相邻项圆角衔接、相邻边框合并为 1px，支持变体混排；`block` 块级撑满（水平 `flex: 1` 等分 / 垂直满宽，子按钮无需逐个设置）、`direction` 水平 / 垂直排列；组内子项 `v-if` / `v-for` 动态增删时首、中、尾位置自动重排；0.5px 细边框（hairline）按钮的缩放层同步清理对应侧圆角与边框；基于 provide/inject + reactive 注册序实现位置感知（ucss 无 `:first-child` 结构选择器），无专属主题变量（圆角 / 边框复用 `$m-button-*` 系列）
- 新增 `m-input`
  输入框组件：六种类型（text / tel / digit / number / password / textarea）、`clearable` + `clear-trigger` 两时机（focus / always）、`show-word-limit` 字数统计、`border` / `inlaid`（清边框内边距嵌入单元格）、`disabled` / `readonly`、textarea `auto-height`；`formatter` + `format-trigger`（onChange / onBlur）、`precision`（保留尾零）、`min` / `max` 失焦数字收敛、`show-eye` 明文切换；prepend / append 插槽、`v-model` 与 input / change / focus / blur / clear 事件、expose `focus()` / `blur()` 方法；注入 m-compact 上下文，可与 m-button 混排
- 新增 `m-calendar`
  日历组件：对标 Vant Calendar，single / multiple / range 三种选择类型、弹层（m-popup 组合，`poppable` 切换平铺面板）与平铺双形态、`switch-mode` 年月切换导航（month / year-month，导航 clamp 到可选范围）、`formatter` 日期格式化（topInfo / bottomInfo / className / 禁用态）、`first-day-of-week` 周起始日、`row-height` 行高、月份背景水印（`show-mark`，右上角对齐）、`color` 主题色派生选中圆与范围 bar（支持渐变）、`min-date` / `max-date` 界外禁用、`max-range` 范围与多选通用超限限制（拒绝 + `over-range` 事件 + m-toast 提示）、`allow-same-day` 起止同日、`default-date` 预选；`v-model:show` 与 select / confirm / unselect / over-range / month-show / panel-change / click-subtitle / click-disabled-date / open / opened / close / closed / click-overlay 全事件；title / subtitle / month-title / text / top-info / bottom-info / footer / confirm-text 与四个导航图标插槽；expose `reset()` / `scrollToDate()` / `getSelectedDate()` 方法

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
