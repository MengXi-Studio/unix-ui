## 0.5.2 (2026-11-14)

- 修复 `m-calendar` `switch-mode` 非 `none` 时首帧渲染全量月份（[#15](https://github.com/MengXi-Studio/unix-ui/issues/15)）：`currentPanelMonth` 挂载前为 `null` 时 `visibleMonths` 回退全量，`min-date` ~ `max-date` 覆盖 1900~2100 时首帧渲染 2412 个月，微信小程序触发 `Dom limit exceeded`（`setData` 约 36 MB）；兜底分支改为仅渲染聚焦月，首帧节点数与范围宽度无关

## 0.5.1 (2026-11-14)

- 修复 `m-tabs` options 平分模式小程序端首帧底部条仍贴左（[#13](https://github.com/MengXi-Studio/unix-ui/issues/13)）：0.5.0 在 `onMounted` 中补的 `nextTick` 只等到逻辑层更新，小程序端渲染层首次 `setData`
  尚未提交，`queryRectById` 查不到 `#m-tabs-nav` / `#m-tabs-tab-<i>` 时静默返回、不重试，`lineLeft` 保持 0，首屏底部条仍贴左（点击后才归位）。小程序端改为按 0 / 16 / 50 / 120ms 递增重试 `animateLine`（成功后的重复调用
  `from == to`，仅重设同一位置、无副作用），Web / App 保持原 `nextTick` 分支

## 0.5.0 (2026-11-14)

- 新增 `m-color-picker` / `m-color-picker-popup` / `m-color-picker-input` 颜色选择器三件套：饱和度-明度面板 + 色相 / 透明度滑块，`v-model:value` 字符串受控，`format` 支持 `hex` / `rgb` /
  `hsl`（hex 带透明度输出 8 位），`show-format` 格式切换、`presets` / `show-presets` 预设色、`show-inputs` R/G/B/A 数值输入、`show-recent` 最近使用颜色（最多 8 个）、`show-eyedropper`
  吸管取色（仅 Web，`#ifdef WEB`）；面板按 App 端单层 `linear-gradient` 约束用 3 层绝对定位叠加；弹层为「取消 / 标题 / 确定」+ 草稿值（确定回写、取消丢弃），输入框为只读触发器 + 色块预览 + 字段标签 + 自绘清空；新增
  `$m-color-picker-*` 主题变量
- 新增 `m-checkbox-group` / `m-checkbox` / `m-checkbox-popup` / `m-checkbox-input` 复选框四组件：多选集合 `v-model:value`（`Array<string | number>` 联合类型数组，`'1'` 与 `1`
  字符串化比较视为同一项）；单项双形态（组内按 name 勾选 / 独立 `v-model` 布尔自持）、square / round 形状、label-position 左右互换、label-disabled、indeterminate 不确定横杠、icon / default 插槽（作用域
  `{ checked, disabled }`）、expose `toggle()`；弹层 options 数组驱动 + field-names 映射 + footer 插槽；输入框「、」连接回显（超 2 项截断「等 N 项」）+ 自绘清空按钮；新增 `$m-checkbox-*` 主题变量
- 新增 `m-fab` / `m-fab-item` 悬浮按钮：入口圆钮固定于视口指定位置，点击展开扩展按钮列表、点击后自动收起；四角定位（`top` / `right` / `bottom` / `left`）、`background` / `color` 自定义配色（子项继承容器）、`hide-name`
  隐藏名称、`entry` / `name` 插槽自定义、`overlay-closable` 遮罩点击收起、`draggable` 拖拽（`axis` 方向限制 / `margin-x` `margin-y` 边界钳制 / `magnet` 松手吸附 / `v-model:offset`
  中心点坐标回写）；展开收起为逐项 stagger 过渡（收起逆序），新增 `$m-fab-*` 主题变量
- 新增 `m-date-strip` 日期横条：横向滚动展示一段连续日期（默认今天前 7 天 ~ 后 7 天），`type` 支持 `single` / `multiple` / `range`，点选即生效；`value-format` 非空时 `v-model:value` 双向绑定字符串（`parseDate` /
  `formatDate` 转换）；`max-range` 超限拒绝并派发 `over-range`（对齐 m-calendar 命名）；`allow-same-day`、`start-date-text` / `end-date-text` / `same-date-text` 端点文案；`disabled-date` 灰显禁用 +
  `click-disabled-date`，`filter` 剔除不展示；`show-lunar` 展示农历；`formatter` 复用 `CalendarDayItem`，并提供 `item` / `top-info` / `bottom-info` 插槽；挂载与外部值变更时自动居中选中项；新增 `$m-date-strip-*` 主题变量
- 新增日期工具函数集 `utils/date.uts`：公共入口按能力分层为 `utils/date/`（core / compare / arith / boundary / grid / format /
  lunar）七个纯函数模块，共 69 个具名导出——基础原语、比较、算术与差值、周月年边界与区间枚举、固定 6×7 月历网格与周序号 / 季度、格式化解析（13 基线 token + `W` / `Q` / `A` / `a`，`[]`
  字面量转义）、农历 1900-2100 全量换算与干支 / 生肖 / 月名 / 日名 / 时辰名；全部纯函数不可变、按本地零点计算、失败返回 `null`；引入方式 `import { formatDate } from '@/uni_modules/m-ui-x/utils/date.uts'`；`m-calendar`
  通用日期函数同步改用该工具集（旧导入路径由 `calendar.uts` re-export 保持兼容）
- 修复 `m-tabs` options 平分模式首帧底部条未定位（[#10](https://github.com/MengXi-Studio/unix-ui/issues/10)）：options 形态没有 `m-tab` 子组件，`ctx.items` 恒为空，`watch(ctx.items)` 中的 `animateLine` 不会触发；初始
  `activeIndex` 与解析结果相同也不会触发 `watch(activeIndex)`，`lineLeft` 保持初值 0，首屏底部条贴在标签栏最左缘（点击任意标签后才归位）。`onMounted` 在初始激活解析与渲染集合初始化后补一次 `nextTick` 首定位（`firstSet`
  首次直接落位、不播动画），Web 同步测量、小程序在节点渲染完成后按 id 异步查询
- 修复 `m-popup` 微信小程序端第二次打开无滑入动画（[#11](https://github.com/MengXi-Studio/unix-ui/issues/11)）：非 Web 端 `triggerPanelIn` 原用 `nextTick`
  切换进入态，小程序渲染层会把间隔过近的两次 setData 合帧渲染，面板起始位（`-out`）与遮罩 `display:none` 移除落在同一帧，过渡没有可插值起点，第二次及以后打开直接出现在终位（首次因 `lazyRender`
  挂载帧先绘制了起始位而正常）。改为与 m-overlay 淡入一致的 50ms 定时，确保起始位先完成一帧绘制；Web 端双 rAF 分支不变
- 修复 Android 云端打包编译失败：空联合类型数组字面量直接断言为 `CheckboxValueArray` 会生成无类型参数的 `_uA()`（Kotlin `Cannot infer type argument for 'E'`），新增 `emptyCheckboxValues()`
  工厂统一生成空集合，替换复选框组件 prop 默认值、上下文初始值与清空事件；日期横条演示页作用域插槽参数改为经类型收窄后读取字段（Kotlin 侧为 `Any?`）；复选框演示页 `change`
  回调参数类型不匹配与缺失参数一并修正；`m-checkbox` 禁用态改用扁平修饰类，消除 ucss 后代选择器 `Invalid selector` 报错

## 0.4.2 (2026-11-12)

- 修复 `m-tabs` Web 端滚动布局标签栏显示横向滚动条：0.4.1 修复滚动失效时内部滚动层恢复 `overflow-x: auto`，浏览器默认滚动条露出（uni-h5 运行时 `show-scrollbar="false"`
  只挂类、隐藏滚动条的 CSS 在运行时样式表缺失，Web 端形同虚设）；修复：标签栏 scroll-view 显式 `:show-scrollbar="false"`（App 端生效），Web 端组件内 `#ifdef WEB` 兜底以 `scrollbar-width: none` + `::-webkit-scrollbar`
  双覆盖内部真实滚动层，实测滚动条占高 0、可滚性保持
- 修复 `m-tabs` 微信小程序端 mounted 抛 `Cannot read properties of undefined (reading 'length')` 导致首屏无激活态（[#8](https://github.com/MengXi-Studio/unix-ui/issues/8)）：小程序端 `UniElement` 无 `children` /
  `parentElement`（子树与祖先不可遍历），`findDescendantById` 的 `el.children.length` 与 `findScrollParent` 的祖先遍历在 `canScroll` 实例（shrink 或标签数超阈值）mounted 即崩；同时 `getBoundingClientRectAsync`
  仅支持有 id 的元素。修复：`findDescendantById` / `findScrollParent` 小程序端编译期返回 null（调用点判空降级）；标签栏 / 底部条 / 根节点 / 内容块补 id，新增 `queryRectById`（`createSelectorQuery().in(instance.proxy)`
  按组件实例作用域查询，多实例安全）——滚动布局激活居中、插槽布局底部条定位、scrollspy 判定与点击定位在小程序端全部恢复；底部条切换动画降级直接落位，scroll-view 内嵌场景 scrollspy 按页面级滚动语义退化

## 0.4.1 (2026-11-12)

- 修复 `m-tabs` 滚动 / 收缩布局激活下划线偏移半个条宽：标题内嵌条 `left: 50%` 只钉条左缘未回退自身半宽，条整体右偏 `line-width` 的一半（默认偏 20px）；补 `transform: translateX(-50%)`
  居中回退（百分比相对自身宽，全端支持）
- 修复 `m-tabs` 微信小程序端 mounted 抛 `TypeError: el.getBoundingClientRect is not a function` 导致首屏无激活标签、底部条不显示：小程序端 `UniElement` 无同步测量 API，`measureWidth` 仅在 freeLine 布局与 `swipeable`
  场景测量并改走 `getBoundingClientRectAsync`（Web 保留同步测量，平台分支对齐 m-sticky），`scrollspy` 的滚动判定与点击定位同步改为双端分支（小程序端批量异步测量后统一判定）
- 修复 `m-tabs` 滚动布局标签栏不可滚动、激活标签贴边裁切：导航 scroll-view 使用的 `scroll-x` 已废弃（uni-app x 改为 `direction` 属性，默认 `vertical`），横向触摸滚动与程序化滚动全部失效；同时标题行（view 默认
  `overflow: hidden`）把溢出标题裁在行内，scroll-view 滚动区域看不到溢出内容（`scrollWidth == offsetWidth`）被内部钳制为 0。修复三处：`:scroll-x` 改为 `:direction`（可滚动时 `horizontal`）；标题行 `overflow: visible`
  放行溢出；移除 `scroll-into-view`（只能对齐元素起始位置，末位标签永远贴边）改为程序化居中（`scroll-left` 属性驱动 + `@scroll` 回灌镜像 + `scroll-with-animation` 平滑过渡）。`m-cascader`
  层级 tabs 行同步修复（层级定位恢复）
- 修复 `m-tabs` 平分布局带 nav 插槽时下划线偏移：独立底部条原按均匀槽位公式定位，nav-left /
  nav-right 插槽占位后失差（实测偏左约半个条宽）；改为测量制——按 id 深度优先定位激活标题元素实测中心，测量基准统一取底部条的定位父级（nav 原点，与渲染原点严格一致），插槽有无与标题行滚动状态均不敏感
- 修复 `m-tabs` scrollspy 点击标签不滚动、激活与内容错位：点击处理器调用的 `scrollTo` 实为 `defineExpose` 对象字面量的属性名而非组件函数，Web 构建下裸调用被解析到全局
  `window.scrollTo`（索引被当作滚动坐标），在 scroll-view 滚动的页面里完全无效且无报错，改为调用 `scrollToIndex`；同时定位与 scrollspy 判定的基准线统一为「吸顶标签栏底边」（滚动视口顶 +
  `offset-top` + 标签栏高）——原判定直接用 `offset-top` 作基准，在内容区处于非零视口偏移的滚动容器中时（如页面顶部有固定导航）会整体错位一个容器偏移，表现为标签激活与视口内容不一致；基准线用容器顶偏移 +
  `offset-top` + 标签栏高这组稳定量拼出，与 m-sticky 吸附切换时序解耦

## 0.4.0 (2026-11-11)

- 新增 `m-tabs` / `m-tab` 标签页：内容区域切换容器，`line` / `card` / `pill` 三种风格；`active` 支持索引与 name 混用匹配；标签数超过 `swipe-threshold` 自动横向滚动并居中激活项；`animated` 轨道平移转场 + `swipeable`
  手势跟手切换（手势切换不触发 `before-change`）；`sticky` 吸顶复用 m-sticky、`scrollspy` 滚动导航（内容平铺 + 滚动联动激活 + 点击定位）；`before-change` 切换前拦截（boolean 同步版）；`options`
  数组纯标签栏形态（`field-names` 字段映射）；标题徽标（dot / badge / show-zero-badge）与 nav-left / nav-right 插槽
- 新增 `m-image` 点击预览：`preview` 开启后点击图片调用 `uni.previewImage` 弹出大图预览（Web / 微信 / 支付宝小程序 / Android / iOS / HarmonyOS 全端可用），仅加载成功态响应；`preview-list`
  指定预览图列表（不传或为空回退单图 `[src]`），起始索引自动取当前 `src` 在列表中的位置（找不到回退 0），`preview-current` 可显式指定；`preview` 开启不影响 `click` 事件透传

## 0.3.1 (2026-11-09)

- 修复 `m-overlay` 小程序端遮罩显隐失效：根节点 `v-show` 在小程序端被 uni-app x 编译为 `virtualHostHidden` 表达式并被外部默认值 false 短路，隐藏的透明全屏遮罩常驻顶层拦截全部触摸，页面所有按钮无法点击；移除根节点
  `v-show`，改为隐藏态在 rootStyle 末尾追加 `display: none`（置于 custom-style 之后压制其 display 声明）。基于 m-overlay 组合的 `m-popup` / `m-cascader-popup` / `m-calendar-popup` 等弹层组件在小程序端同步修复
- 修复 `m-overlay` 小程序端淡入淡出无渐现：小程序渲染层对间隔过近的两次 setData 合帧渲染，nextTick（逻辑层微任务）后设置的 opacity
  1 与 display 移除合并为同一次绘制，过渡没有起点导致直接出现；非 Web 分支的显示触发由 nextTick 改为 50ms 定时错开时序（确保 display:none 移除的首帧已绘制完成），Web 端双 rAF 时序不变
- 修复 `m-icon` 微信小程序端字体加载失败：wxss 的 `@font-face` 不支持本地字体文件路径（Web / App 端不受影响），图标全部显示为默认字形；MP-WEIXIN 端条件编译排除 style 内 `@font-face` 声明，改为 onMounted 中
  `uni.loadFontFace`（`global: true` 全局生效）运行时加载 base64 内联字体（字体数据随包内置零配置），首帧图标可能先以默认字形闪现属已知限制

## 0.3.0 (2026-11-05)

- 新增 `m-cascader` / `m-cascader-popup` / `m-cascader-input` 级联选择三组件：按「面板 / 弹出框 / 输入框」拆分——m-cascader 纯平铺面板（`v-model:value` 叶子值 `string | number`、options 为动态类型 `UTSJSONObject[]` 支持
  `field-names` 字段名映射与异步加载（空数组视为叶子直接 finish）、`swipeable` 手势滑动换层、`active-color` 主题色、`options-height` 选项区高度；change / finish / close / click-tab 事件与 title / option / options-top /
  options-bottom 四插槽）；m-cascader-popup 基于 m-popup 组合的弹层级联（弹层 props 全透传、finish 后自动关闭、事件与插槽条件转发）；m-cascader-input 基于 m-input 只读触发器 + 弹层组合（`v-model:value`
  finish 回填、路径文字「/」连接回显、自绘清空按钮、disabled / border / inlaid 形态）
- 新增 `m-flex` / `m-flex-item` 弹性布局组件：`direction` 四值（row / row-reverse / column / column-reverse）、`gap` 三档内置（small / medium / large，对应 `$m-flex-gap-sm` / `$m-flex-gap` /
  `$m-flex-gap-lg`）与自定义尺寸（number 补 px / string 原样）、`align` 四值（App 端 baseline 降级 flex-start）、`justify` 六值（start / end / center / between / around / evenly）、`flex` CSS 简写透传、`wrap`
  自动换行（仅 row / row-reverse）；间距由 m-flex-item 的 margin 实现（App 端 ucss 不支持 flex `gap`），子项经 provide/inject + reactive 注册序感知轮位——row 非首项 /
  row-reverse 非末项 margin-left、column 非首项 margin-top、column-reverse 非末项 margin-bottom（反向方向首尾无多余留白），水平换行时全部子项 margin-left + 容器等值负 margin 补偿（各行行首顶格）、行间距为子项 margin-bottom（末行底部多出一段为已知限制）；未包裹的子元素不参与间距计算，独立使用时退化为普通纵向容器
- 新增 `m-status-bar` 状态栏占位组件：为 Navbar / Notify 等贴顶元素预留系统状态栏高度；`height` prop（px，大于 0 时直接使用）优先，否则 App 端自动读取 `uni.getWindowInfo().statusBarHeight`，Web
  / 小程序保持 0（不占位）；`custom-class` / `custom-style` 样式直达（背景色等），无专属主题变量；demo-navbar 同步改为消费该组件
- 新增 `m-sticky` 粘性布局组件（全端受控吸附）：页面在滚动容器 `@scroll` 中回传 `scroll-top`，组件沿 `parentElement` 自动识别最近的滚动容器（Web 按 `uni-scroll-view` 类名、App
  / 小程序按滚动高度大于可视高度），以其实视区为吸附基准；吸附时内容节点切换 `position: fixed`，根节点回填实测占位高度避免布局塌陷。不使用原生 CSS `position: sticky`：uni-app x Web 运行时给所有 `view` 注入
  `overflow: hidden`，sticky 的最近滚动容器会退化为不滚动的父级而完全失效（实测滚动 400px 后 rect.top=-198 不吸附）。`position: 'top' | 'bottom'` 与互斥生效的 `offset-top` /
  `offset-bottom`（相对滚动容器可视边缘）、`z-index`（默认 99 走主题类）、`custom-class` / `custom-style`（挂在内容节点）、`change(isFixed)` 与 `scroll({ scrollTop, isFixed })` 事件
- 新增 `m-sticky-box` 容器边界组件：provide/inject 向内部 m-sticky 注入容器 `UniElement` 引用，吸附元素到达容器上下边缘时回顶（复刻 Vant 的 containerVisible 判定与 translateY 补偿）；容器高度需显式指定以形成吸附行程
- 新增 `m-waterfall` / `m-waterfall-item` / `m-waterfall-load` 瀑布流组件：容器实测可用宽度等分列宽，项在正确列宽下实测高度上报，按「注册顺序 → 最短列优先」计算绝对定位并回填容器总高度；严格顺序排版，未加载项
  `visibility: hidden` 按列宽占位保证测量准确；`columns`（默认 2）、`column-gap` / `row-gap`（px，默认 16）、项插槽透出 `onLoad` / `columnWidth`、`loadstart` / `load` 事件与 `reflow()` / `onLoad(handler)`
  实例方法；`m-waterfall-load` 按 width / height 以 `padding-top` 预占高度，`max-wait` 内加载完成取图片真实宽高、超时保留自定义比例并透出 `overtime`；无 ResizeObserver，容器宽度在挂载 / 窗口 resize /
  reflow 时测量，容器左右 padding 会挤压列宽（留白请放外层）
- 新增主题变量 `$m-sticky-z-index: 99 !default`；仅首次测量 + 窗口 resize 自动重测，内容尺寸变化需重建组件（不提供 `refresh()`）
- 清理 VDOM Web 运行时 TS 诊断 WARNING（32 处 Prop 类型）：可空 prop 声明 `T | null` 且默认 null 时，编译器生成 `type: [T, null]` 形态的 props（Vue Prop 类型系统不接受 type 数组中的 null），触发
  `No overload matches this call` 诊断噪音并会泄漏到使用者的运行日志；统一去掉类型标注中的 `| null` 并**保留 `default: null`**（未传时运行时仍为 null，三态语义与行为不变）——覆盖 `m-calendar` / `m-calendar-popup` /
  `m-calendar-input` 的日期与 `formatter` 类可空 prop、`m-col` `offset`、`m-row` `justify` / `align`、`m-grid` `gutter` / `columnNum` / `iconSize`、`m-grid-item` `icon` / `gutter`、`m-image` `width` / `height` /
  `radius`、`m-space` `size` / `align`、`m-input` `formatter` / `precision` / `min` / `max`、`m-cell` `icon` / `clickable`、`m-toast` 七个可空 prop、`m-popup` `beforeClose`；残余 3 条 SSRSlot
  WARNING 来自插槽条件转发的生成代码，属编译器类型标注噪音，不影响运行

## 0.2.0 (2026-11-03)

- 新增 `m-overlay` 遮罩层组件：`show` 显示驱动、`z-index` 层级、`duration` 动画时长（秒，0 禁用动画）、`custom-class` / `custom-style` 样式直达与 `click`
  事件（遮罩不自动关闭）；淡入淡出为 opacity 两态过渡，内置 Web 端 body 滚动锁定（多实例堆叠全关才还原），是弹窗类组件的基础
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
  close 事件；采用「全局函数 + 页面预置容器 + 全局单例桥」方案（uni-app x 无运行时动态挂载能力），API 手感保持一致
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
- 新增 `m-calendar` / `m-calendar-popup` / `m-calendar-input` 日历三组件（按「面板 / 弹出框 / 输入框」拆分）：`m-calendar` 纯平铺日历面板，single / multiple / range 三种选择类型、`switch-mode` 年月切换导航（month /
  year-month，导航 clamp 到可选范围）、`formatter` 日期格式化（topInfo / bottomInfo / className / 禁用态）、`first-day-of-week` 周起始日、`row-height` 行高、月份背景水印（`show-mark`，水平居中）、`height`
  面板高度（固定高度内部滚动，副标题随滚动切换为视口月份）、`color` 主题色派生选中方块与范围 bar（支持渐变）、`min-date` / `max-date` 界外禁用、`max-range` 范围与多选通用超限限制（拒绝 + `over-range` 事件 +
  m-toast 提示）、`allow-same-day` 起止同日、`default-date` 预选；select / confirm / unselect / over-range / month-show / panel-change / click-subtitle / click-disabled-date 事件；title / subtitle / month-title / text /
  top-info / bottom-info / footer /
  confirm-text 与四个导航图标插槽（默认渲染内置在面板组件内，与样式同 scope；宿主仅条件转发用户插槽）；月块内标题内置渲染（首月由副标题承担当月标题，其余月显示），传入 month-title 插槽可自定义；日格行距对齐 Vant（行高即行距，无额外间距）；选中态为 54px 圆角方块盖于范围 bar 之上（`$m-calendar-day-radius`
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
