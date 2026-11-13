# 更新日志

## [0.5.0] - 2026-11-13

新增 m-color-picker 颜色选择器三件套、m-fab / m-fab-item 悬浮按钮组件、m-checkbox 复选框四组件、m-date-strip 日期横条与日期工具函数集。

### 新增

- **m-color-picker / m-color-picker-popup / m-color-picker-input 颜色选择器三件套**：m-color-picker 饱和度-明度面板 + 色相滑块（`show-alpha` 增加透明度条与 A 分量），`v-model:value` 字符串受控，`format` 支持 `hex` / `rgb` / `hsl`（hex 带透明度输出 8 位 `#RRGGBBAA`，传入值兼容 `#RGB` / `#RGBA` / `#RRGGBB` / `#RRGGBBAA` / `rgb()` / `rgba()` / `hsl()` / `hsla()`）；`show-format` 面板内切换格式、`presets` / `show-presets` 预设色（未传用内置常用色）、`show-inputs` R/G/B/A 数值输入（失焦提交 + 范围钳制）、`show-recent` 最近使用颜色（最多 8 个，手势结束或选色后记录）、`show-eyedropper` 吸管取色（`#ifdef WEB` 条件编译，Chromium EyeDropper，非 Web 端不渲染入口）；面板渐变按 App 端 `background-image` 仅支持单层 `linear-gradient` 的约束用 3 个绝对定位层叠加（纯色相 + 横向白 + 纵向黑）；m-color-picker-popup 为「取消 / 标题 / 确定」头部 + 内部草稿值（确定回写并关闭、取消与遮罩关闭丢弃），`show-confirm=false` 时选择即生效；m-color-picker-input 只读触发器 + 左侧色块预览 + 可选字段标签 + 自绘清空 + 弹层选色；新增 `$m-color-picker-*` 主题变量段（详见 [ColorPicker](/components/color-picker)）
- **m-checkbox-group / m-checkbox / m-checkbox-popup / m-checkbox-input 复选框四组件**：m-checkbox-group 多选集合容器（`v-model:value` 为 `Array<string | number>` 联合类型数组，已实测全端编译合法；`'1'` 与 `1` 字符串化比较视为同一项），统一下发 shape / checked-color / icon-size / disabled / max / direction（子项可覆盖）；m-checkbox 双形态（组内按 name 参与勾选 / 独立 `v-model` 布尔自持），square 形状、label-position 左右互换、label-disabled 仅禁文本、indeterminate 不确定横杠、icon / default 插槽（作用域 `{ checked, disabled }`）、expose `toggle()`（搭配单元格整行切换）；m-checkbox-popup 底部弹层（options 数组驱动渲染 + field-names 映射 + footer 插槽）；m-checkbox-input 只读触发器 + 弹层（label「、」连接回显、超 2 项截断「等 N 项」、自绘清空按钮）；新增 `$m-checkbox-*` 主题变量段（详见 [Checkbox](/components/checkbox)）
- **m-fab / m-fab-item 悬浮按钮**：入口圆钮固定于视口指定位置，点击展开扩展按钮列表、点击扩展按钮后自动收起；四角定位（`top` / `right` / `bottom` / `left`，未传用主题默认间距，入口在视口上半侧时向下展开）；`background` / `color` 自定义入口与子项配色（支持渐变，子项未设时继承容器）；`hide-name` 隐藏名称；`entry` 插槽自定义入口内容（作用域 `visible`）与 `name` 插槽自定义名称；`overlay-closable` 展开期间渲染遮罩并支持点击收起；`draggable` 拖拽（`axis` 四值限制方向、`margin-x` / `margin-y` 边界钳制、`magnet` 松手吸附最近边、`v-model:offset` 受控位置以入口中心点坐标回写）；展开 / 收起为逐项 inline transition（按注册序 stagger，收起逆序）；新增 `$m-fab-*` 主题变量段（详见 [Fab](/components/fab)）
- **m-date-strip 日期横条**：横向滚动展示一段连续日期（默认今天前 7 天 ~ 后 7 天），`type` 支持 `single` / `multiple` / `range`，点选即生效无确认按钮；`v-model:value` 在 `value-format` 非空时双向绑定字符串（内部经 `parseDate` / `formatDate` 转换，非法串按未选中处理）；`max-range` 超限拒绝并派发 `over-range`（对齐 m-calendar 命名，不内置 toast）；`allow-same-day` 允许范围起止同日，端点文案由 `start-date-text` / `end-date-text` / `same-date-text` 定制；`disabled-date` 灰显禁用并派发 `click-disabled-date`，`filter` 直接剔除不展示日期；`show-lunar` 在日号下方展示农历（复用日期工具集 `solarToLunar` + `getLunarDateText`）；`formatter` 复用 `CalendarDayItem` 契约，另提供 `item` / `top-info` / `bottom-info` 作用域插槽；挂载与外部值变更时自动居中选中项；新增 `$m-date-strip-*` 主题变量段（详见 [DateStrip](/components/date-strip)）
- **日期工具函数集**：新增 `packages/core/utils/date.uts` 公共入口，按能力分层为 `utils/date/`（core / compare / arith / boundary / grid / format / lunar）七个纯函数模块，共 69 个具名导出——基础原语（归一 / 校验 / 时间戳 / 闰年 / 月天数 / 年内天数）、比较（同日 / 同月 / 先后 / 区间 / 今天 / 周末）、算术与差值、周月年边界与区间枚举、固定 6×7 月历网格与周序号 / 季度、格式化解析（13 个基线 token + `W` / `Q` / `A` / `a`，`[]` 字面量转义，解析回校验拦截溢出）、农历 1900-2100 全量换算（闰月负数表示）与干支 / 生肖 / 月名 / 日名 / 时辰名；全部纯函数不可变、按本地零点计算、失败返回 `null`；m-calendar 通用日期函数改用工具集并通过 `calendar.uts` re-export 保持旧导入路径兼容（详见 [Date](/tools/date)）

## [0.4.2] - 2026-11-12

修复 m-tabs 微信小程序端 `canScroll` 实例 mounted 崩溃（[#8](https://github.com/MengXi-Studio/unix-ui/issues/8)），小程序端滚动布局居中、插槽底部条定位与 scrollspy 判定 / 点击定位恢复；隐藏 Web 端滚动布局标签栏的横向滚动条。

### 修复

- **m-tabs Web 端滚动布局标签栏显示横向滚动条**：0.4.1 修复滚动失效时把内部滚动层恢复为 `overflow-x: auto`，浏览器默认滚动条随之露出；取证发现 uni-h5 运行时的 `show-scrollbar="false"` 仅在内部滚动层追加 `uni-scroll-view-scrollbar-hidden` 类，而隐藏滚动条的 CSS 在运行时样式表里缺失（vapor 与 VDOM 构建的 `::-webkit-scrollbar` 均为 0 处），该 prop 在 Web 端形同虚设。修复两处：标签栏 scroll-view 显式 `:show-scrollbar="false"`（App 端语义生效）；Web 端组件内兜底——`#ifdef WEB` 条件编译内以 `scrollbar-width: none` + `::-webkit-scrollbar` 双覆盖内部真实滚动层（包装节点非模板节点，须后代选择器穿透；仅 Web 端编译，不受 App 端 ucss 后代选择器约束）。实测滚动条占高为 0、横向可滚性保持
- **m-tabs 微信小程序端 mounted 抛 `Cannot read properties of undefined (reading 'length')` 导致首屏无激活态**（[#8](https://github.com/MengXi-Studio/unix-ui/issues/8)）：小程序端 `UniElement` 无 `children` / `parentElement`（子树与祖先不可遍历），`findDescendantById` 的 `el.children.length` 与 `findScrollParent` 的祖先遍历在 `canScroll` 实例（shrink 或标签数超阈值）mounted 即崩，中断激活初始化；同时 `getBoundingClientRectAsync` 仅支持有 id 的元素（内部即 `createSelectorQuery().in($vm).select('#id')`，组件实例作用域多实例安全）。修复三处：`findDescendantById` / `findScrollParent` 小程序端编译期返回 null（调用点判空降级）；标签栏 / 底部条 / 根节点 / 内容块补 id（m-tab 内容块按注册序动态 id），新增 `queryRectById`（`uni.createSelectorQuery().in(instance.proxy)` 按 id 组件作用域查询）——滚动布局激活居中、插槽布局底部条定位、scrollspy 滚动判定与点击定位在小程序端全部恢复；底部条切换动画小程序端降级直接落位（`UniElement.animate` 的 transform keyframes 支持未证实），scroll-view 内嵌场景的 scrollspy 判定与点击定位按页面级滚动语义退化（`pageScrollTo`）

## [0.4.1] - 2026-11-12

修复 m-tabs 滚动 / 收缩布局下划线偏移、微信小程序端首屏问题、滚动布局激活标签居中失效、插槽布局下划线偏移与 scrollspy 点击定位失效。

### 修复

- **m-tabs 滚动 / 收缩布局激活下划线偏移半个条宽**：标签数超过 `swipe-threshold` 触发滚动布局（或 `shrink` 收缩布局）时，激活下划线为标题内嵌条，其 `left: 50%` 只钉住条左缘而未回退自身半宽，条整体向右偏移 `line-width` 的一半（默认 40px 即偏 20px），平分布局的独立底部条不受影响；补 `transform: translateX(-50%)` 居中回退（translateX 百分比相对自身宽，全端支持，随 `line-width` 自适应）
- **m-tabs 微信小程序端 mounted 抛 TypeError 导致首屏无激活标签**：小程序端 `UniElement` 仅提供异步 `getBoundingClientRectAsync`，无同步 `getBoundingClientRect`，组件 mounted 即在 `measureWidth` 处抛 `TypeError: el.getBoundingClientRect is not a function`，同一 hook 内的激活初始化不再执行，表现为首屏无激活标签、底部条不显示。修复三处：`measureWidth` 仅在 freeLine 布局（独立底部条）与 `swipeable`（轨道平移 / 手势阈值）场景测量（其余场景宽度本就未被消费），App / 小程序走异步接口、Web 保留同步测量（平台分支对齐 m-sticky）；`scrollspy` 的滚动判定与点击定位同样改为双端分支（小程序端批量异步测量后统一判定）。基于 m-sticky 同款平台分支先例，Web 端行为不变（[#5](https://github.com/MengXi-Studio/unix-ui/issues/5)）
- **m-tabs 滚动布局标签栏不可滚动、激活标签不居中**：导航 scroll-view 使用的 `scroll-x` 已废弃（uni-app x 改为 `direction` 属性，默认 `vertical`），仅设 `scroll-x` 时内部滚动层 `overflow-x` 为 hidden，横向触摸滚动与 `scroll-left` / `scroll-into-view` 程序化滚动全部失效，激活标签贴边裁切；同时标题行（view 默认 `overflow: hidden`）把溢出标题裁在行内，scroll-view 的滚动区域看不到溢出内容（`scrollWidth == offsetWidth`），即使补齐 direction 也被内部钳制为 0。修复三处：`:scroll-x` 改为 `:direction`（可滚动时 `horizontal`）；标题行 `overflow: visible` 放行溢出（裁剪交回 scroll-view 真实滚动层）；移除 `scroll-into-view`（只能对齐元素起始位置，末位标签永远贴边），改为程序化居中——按 id 深度优先定位激活标题元素（Web 端 scroll-view 有编译器内部包装层，不能假设直接子节点结构），测量标题中心与视口中心偏差后经 `scroll-left` 属性驱动滚动（`@scroll` 回灌镜像实际位置，手动滚动后同值目标也能重新触发），超界由 scroll-view 内部钳制，动画经 `scroll-with-animation` 平滑居中。m-cascader 层级 tabs 行同步修复（`scroll-x` → `direction="horizontal"` + 行 `overflow: visible`，`scroll-into-view` 层级定位恢复）
- **m-tabs 平分布局带 nav 插槽时下划线偏移**：独立底部条原按均匀槽位公式 `(i + 0.5) * 容器宽 / 标签数` 定位，nav-left / nav-right 插槽占位后标签实际中心与槽位中心失差（实测偏左约半个条宽）；改为测量制——按 id 深度优先定位激活标题元素实测中心，测量基准统一取底部条的定位父级（nav 原点，与渲染原点 `left: 0 + translateX` 严格一致；底部条与标题行分属 nav 的不同子树，基准不一致会放大偏移），首次直接落位、切换走 `UniElement.animate` 平移，插槽有无与标题行滚动状态均不敏感
- **m-tabs scrollspy 点击标签不滚动、激活与内容错位**：点击处理器调用的 `scrollTo` 实为 `defineExpose` 对象字面量的属性名而非组件函数，Web 构建下裸调用被解析到全局 `window.scrollTo`（索引被当作滚动坐标），在 scroll-view 滚动的页面里完全无效且无报错，改为调用 `scrollToIndex`。同时修正定位与 scrollspy 判定的基准线语义：二者统一为「吸顶标签栏底边」（滚动视口顶 + `offset-top` + 标签栏高）——原判定直接用 `offset-top` 作基准、在内容区处于非零视口偏移的滚动容器中时（如页面顶部有固定导航）会整体错位一个容器偏移，表现为标签激活与视口内容不一致；基准线用容器顶偏移 + `offset-top` + 标签栏高这组稳定量拼出，与 m-sticky 吸附切换时序解耦（scroll 事件触发判定时吸附态可能尚未切换，不能用标签栏实时 rect）

## [0.4.0] - 2026-11-11

新增 m-tabs / m-tab 标签页组件；m-image 新增点击预览能力。

### 新增

- **m-tabs / m-tab 标签页**：内容区域切换容器，`line` / `card` / `pill` 三种风格；`active` 支持索引与 name 混用匹配（先按 name 分类型全等匹配，无命中回退索引）；标签数超过 `swipe-threshold` 自动横向滚动并居中激活项；`animated` 轨道平移转场 + `swipeable` 手势跟手切换（手势切换不触发 `before-change`）；`sticky` 吸顶复用 m-sticky、`scrollspy` 滚动导航（内容平铺 + 滚动联动激活 + 点击定位）；`before-change` 切换前拦截（boolean 同步版）；`options` 数组纯标签栏形态（`field-names` 字段映射）；标题徽标（dot / badge / show-zero-badge）与 nav-left / nav-right 插槽（详见 [Tabs](/components/tabs)）
- **m-image 点击预览**：`preview` 开启后点击图片调用 `uni.previewImage` 弹出大图预览（全端可用：Web / 微信 / 支付宝小程序 / Android / iOS / HarmonyOS），仅加载成功态响应；`preview-list` 指定预览图列表（不传或为空回退单图 `[src]`），起始索引自动取当前 `src` 在列表中的位置（找不到回退 0），`preview-current` 可显式指定；`preview` 开启不影响 `click` 事件透传，两者并存（详见 [Image](/components/image)）

## [0.3.1] - 2026-11-09

微信小程序端适配修复批次：m-overlay 显隐与过渡时序、m-icon 字体加载。

### 修复

- **m-overlay 小程序端遮罩显隐失效**：根节点 `v-show` 在小程序端被 uni-app x 编译为 `virtualHostHidden` 表达式并被外部默认值 false 短路，隐藏的透明全屏遮罩常驻顶层拦截全部触摸，页面所有按钮无法点击；移除根节点 `v-show`，改为隐藏态在 rootStyle 末尾追加 `display: none`（置于 custom-style 之后压制其 display 声明）。根节点 `v-if` 依旧不可用（uni-app x Web 端根节点从注释节点切换创建后 attrs 透传的事件绑定丢失），基于 m-overlay 组合的 m-popup 等弹层组件在小程序端同步修复
- **m-overlay 小程序端淡入淡出无渐现**：小程序渲染层对间隔过近的两次 setData 合帧渲染，nextTick（逻辑层微任务）后设置的 opacity 1 与 display 移除合并为同一次绘制，过渡没有起点导致直接出现；非 Web 分支的显示触发由 nextTick 改为 50ms 定时错开时序（确保 display:none 移除的首帧已绘制完成，50ms 在 0.3s 起步的过渡中不可感知），Web 端双 rAF 时序不变
- **m-icon 微信小程序端字体加载失败**：wxss 的 `@font-face` 不支持本地字体文件路径（Web / App 端不受影响），图标全部显示为默认字形；MP-WEIXIN 端条件编译排除 style 内 `@font-face` 声明，改为 onMounted 中 `uni.loadFontFace`（`global: true` 全局生效）运行时加载 base64 内联字体（新增 `m-icon-font.uts`，字体数据随包内置零配置），首帧图标可能先以默认字形闪现属已知限制

## [0.3.0] - 2026-11-05

新增弹性布局组件（m-flex / m-flex-item）、状态栏占位组件（m-status-bar）、粘性布局组件（m-sticky / m-sticky-box）、瀑布流组件（m-waterfall / m-waterfall-item / m-waterfall-load）与级联选择三组件（m-cascader / m-cascader-popup / m-cascader-input，表单组件）。

### 新增

- **m-cascader / m-cascader-popup / m-cascader-input 级联选择三组件**：按「面板 / 弹出框 / 输入框」拆为三个组件——m-cascader 纯平铺面板（头部 + 层级 tabs + swiper 层级选项列表，`v-model:value` 叶子值 `string | number` 联合类型、options 为动态类型 `UTSJSONObject[]` 支持 `field-names` 字段名映射与异步加载（change 回调内修改 children 自动渲染，空数组视为叶子直接 finish）、`swipeable` 手势滑动换层（disable-touch 承载）、`active-color` 主题色派生、`options-height` 选项区高度（prop 覆盖主题变量）、closeable / close-icon / show-header 头部能力；change / finish / close / click-tab 事件与 title / option / options-top / options-bottom 四插槽，`value` 外部回灌按选项树重建路径并防 v-model 回写循环）；m-cascader-popup 基于 m-popup 组合的弹层级联（弹层 props 全透传、finish 后自动关闭、`v-model:value` 受控选中值透传、级联事件与四插槽条件转发、头部关闭图标统一走 update:show 关闭）；m-cascader-input 基于 m-input 只读触发器 + 弹层组合（`v-model:value` finish 回填、路径文字「/」连接回显（未找到路径回退 value 字符串）、自绘清空按钮、disabled / border / inlaid 形态、field-names / options-height / swipeable 全量透传）；新增 `$m-cascader-*` 与 `$m-cascader-input-*` 主题变量段（详见 [Cascader](/components/cascader)）
- **m-flex / m-flex-item 弹性布局**：`direction` 四值（row / row-reverse / column / column-reverse，等价 flex-direction）、`gap` 三档内置（small / medium / large，对应 `$m-flex-gap-sm` / `$m-flex-gap` / `$m-flex-gap-lg`）与自定义尺寸（number 补 px / string 原样）、`align` 四值（等价 align-items，App 端 baseline 降级 flex-start）、`justify` 六值（等价 justify-content，新增 between / around / evenly）、`flex` CSS 简写透传、`wrap` 自动换行（仅 row / row-reverse）与 default 插槽；间距由 m-flex-item 的 margin 实现（App 端 ucss 不支持 flex `gap`），子项经 provide/inject + reactive 注册序感知轮位——row 非首项 `margin-left`、row-reverse 非末项 `margin-left`、column 非首项 `margin-top`、column-reverse 非末项 `margin-bottom`（反向方向首尾无多余留白），水平换行时全部子项 `margin-left` + 容器等值负 margin 补偿（各行行首顶格）、行间距为子项 `margin-bottom`（末行底部多出一段为已知限制）；未包裹的子元素不参与间距计算，m-flex-item 独立使用时退化为普通纵向容器
- **m-status-bar 状态栏占位**：为 Navbar / Notify 等贴顶元素预留系统状态栏高度；`height` prop（px，大于 0 时直接使用）优先，否则 App 端自动读取 `uni.getWindowInfo().statusBarHeight`，Web / 小程序无系统状态栏保持 0（不占位）；`custom-class` / `custom-style` 样式直达（背景色等），无专属主题变量；playground 的 demo-navbar 同步改为消费该组件
- **m-sticky 粘性布局（全端受控吸附）**：页面在滚动容器 `@scroll` 中回传 `scroll-top`，组件沿 `parentElement` 自动识别最近的滚动容器（Web 按 `uni-scroll-view` 类名、App / 小程序按滚动高度大于可视高度），以其实视区为吸附基准；吸附时内容节点切换 `position: fixed`，根节点回填实测占位高度避免布局塌陷。**不使用原生 CSS `position: sticky`**：uni-app x Web 运行时给所有 `view` 注入 `overflow: hidden`，sticky 的最近滚动容器会退化为不滚动的父级而完全失效（实测滚动 400px 后 rect.top=-198 不吸附）。`position`（top / bottom）与互斥生效的 `offset-top` / `offset-bottom`（相对滚动容器可视边缘，自定义导航栏无需叠加高度）、`z-index`（默认 99 走主题类，非默认 inline 覆盖）、`custom-class` / `custom-style`（挂在内容节点）、`change(isFixed)` 与 `scroll({ scrollTop, isFixed })` 事件；仅首次测量 + 窗口 resize 自动重测，内容尺寸变化需重建组件（不提供 `refresh()`）
- **m-sticky-box 容器边界**：provide/inject 向内部 m-sticky 注入容器 `UniElement` 引用，吸附元素到达容器上下边缘时回顶（容器可见性判定与 translateY 补偿）；容器高度需显式指定以形成吸附行程；新增主题变量 `$m-sticky-z-index: 99 !default`
- **m-waterfall / m-waterfall-item / m-waterfall-load 瀑布流**：容器实测可用宽度等分出列宽，项在正确列宽下实测自身高度上报，按「注册顺序 → 最短列优先」计算绝对定位（left / top / width）并回填容器总高度；严格顺序排版（前项未加载完成时后续项隐藏等待，已显示项不跳动），未加载项以 `visibility: hidden` 按正确列宽占位保证测量准确；`columns`（默认 2）、`column-gap` / `row-gap`（px，默认 16）、`custom-class` / `custom-style`；项插槽透出 `onLoad`（内容加载完成后调用，触发重测）与 `columnWidth`；`loadstart` / `load` 事件与 `reflow()` / `onLoad(handler)` 实例方法；`m-waterfall-load` 按 width / height 用 `padding-top` 预占高度，`max-wait` 内加载完成取图片真实宽高、超时保留自定义比例并透出 `overtime`；无 ResizeObserver，容器宽度在挂载 / 窗口 resize / reflow 时测量，容器左右 padding 会挤压列宽（留白请放外层）

### 修复

- **清理 VDOM Web 运行时 TS 诊断 WARNING（32 处 Prop 类型）**：可空 prop 声明 `T | null` 且默认 null 时，编译器生成 `type: [T, null]` 形态的 props（Vue Prop 类型系统不接受 type 数组中的 null），触发 `No overload matches this call` 诊断噪音并会泄漏到使用者的运行日志；统一去掉类型标注中的 `| null` 并**保留 `default: null`**（未传时运行时仍为 null，三态语义与行为不变）——涉及 m-calendar（`value` / `minDate` / `maxDate` / `defaultDate` / `formatter` / 月块 `panel`）、m-calendar-popup（同前）、m-calendar-input（`value` / `minDate` / `maxDate`）、m-col `offset`、m-row（`justify` / `align`）、m-grid（`gutter` / `columnNum` / `iconSize`）、m-grid-item（`icon` / `gutter`）、m-image（`width` / `height` / `radius`）、m-space（`size` / `align`）、m-input（`formatter` / `precision` / `min` / `max`）、m-cell（`icon` / `clickable`）、m-toast（`type` / `position` / `icon` / `forbidClick` / `loadingType` / `duration` / `wordBreak`）、m-popup `beforeClose`；残余 3 条 SSRSlot WARNING 来自插槽条件转发的生成代码，属编译器类型标注噪音，不影响运行

## [0.2.0] - 2026-11-03

新增弹窗类基础组件（m-overlay / m-popup）、分割线组件（m-divider）、宫格组件（m-grid / m-grid-item）、轻提示组件（m-toast，反馈组件）、紧凑布局组件（m-compact，布局组件）、输入框组件（m-input，表单组件）与日历三组件（m-calendar / m-calendar-popup / m-calendar-input，表单组件），基础组件数量达到 18 个。

### 新增

- **m-overlay 遮罩层**：`show` 显示驱动、`z-index` 层级、`duration` 动画时长（秒，`0` 禁用动画）、`custom-class` / `custom-style` 样式直达与 `click` 事件（遮罩不自动关闭）；内置 Web 端 body 滚动锁（多实例堆叠全关才还原），是弹窗类组件的基础
- **m-popup 弹出层**：五方位（center / top / bottom / left / right）、round 分侧圆角、closeable 关闭图标（`close-icon` / `close-icon-position` 四角）、`close-on-click-overlay`、遮罩定制（`overlay` / `overlay-class` / `overlay-style`）、`z-index` / `duration`、`lazy-render` / `destroy-on-close`、`safe-area-inset-top` / `safe-area-inset-bottom`、`before-close` 关闭前拦截（boolean 同步版）；`v-model:show` 双向绑定，open / opened / close / closed / click / click-overlay / click-close-icon 全事件；center 缩放淡入、四方位平移过渡，基于 m-overlay 组合实现
- **m-divider 分割线**：水平 / 垂直两种形态（垂直为 flex 子项，外层容器需 `flex-direction: row` + `align-items: center`）、`dashed` 虚线、`hairline` 0.5px 细线（border 1px + 单轴缩放 0.5 实现，App 端安全）、`content-position` 内容位置（left / right / center，一侧线限宽 10%）、默认插槽与文本样式继承
- **m-grid / m-grid-item 宫格**：`column-num` 自定义列数、`square` 正方形格子（padding-top 百分比 + 内容绝对定位）、`gutter` 格子间距（行 / 列同值，平均分配对齐 m-row 先例）、`border` 完整表格边框（容器承担顶线 + 左线，格子承担右线 + 下线拼线）、`center` 内容居中、`direction` 横排、`reverse` 图标文本换位、`clickable` 按压反馈（view 原生 hover-class）；格子 `text` / `icon` / `icon-color`、`dot` / `badge` 徽标（m-badge 联动）、`click` 事件与 `url` 应用内页面跳转，default / icon / text 三插槽
- **m-toast 轻提示**：函数式 API（`showToast` / `showSuccessToast` / `showFailToast` / `showLoadingToast` / `closeToast`，string 简写与 ToastOptions 对象双入参，单例语义）与组件式（`v-model:show` + default 插槽）双形态；`type`（text / loading / success / fail）、`position`（top / middle / bottom）、`icon` 自定义图标、`overlay` / `forbidClick` 遮罩与点击拦截、`closeOnClick` / `closeOnClickOverlay`、`duration`（loading 型默认 0 不自动关）、`wordBreak` 换行控制（normal / break-all 全端生效，break-word 仅 Web/小程序，App 回退 normal）、`onOpened` / `onClose` 回调与 opened / close 事件；采用「全局函数 + 页面预置容器 + 全局单例桥」方案（uni-app x 无运行时动态挂载能力）
- **m-compact 紧凑布局**：包裹 m-button 使相邻项圆角衔接、相邻边框合并为 1px，支持变体混排；`block` 块级撑满（水平 `flex: 1` 等分 / 垂直满宽，子按钮无需逐个设置）、`direction` 水平 / 垂直排列；组内子项 `v-if` / `v-for` 动态增删时首、中、尾位置自动重排；0.5px 细边框（hairline）按钮的缩放层同步清理对应侧圆角与边框；基于 provide/inject + reactive 注册序实现位置感知（ucss 无 `:first-child` 结构选择器），无专属主题变量（圆角 / 边框复用 `$m-button-*` 系列，详见 [Compact](/components/compact)）
- **m-space-item 间距子项**：m-space 子元素的包裹组件，间距由其 margin 实现——App 端 ucss 不支持 flex `gap`，原 gap 声明被编译器静默丢弃导致 App 端间距失效；子项经 provide/inject + reactive 注册序感知自身位次（复用 m-compact 先例），horizontal 全部子项 margin-left + 容器等值负 margin 补偿（换行各行行首顶格）/ vertical 非首项 margin-top，wrap 场景行间距为子项 margin-bottom（末行底部多出一段为已知限制）；未包裹的子元素不参与间距计算，独立使用时退化为普通纵向容器（详见 [Space](/components/space)）
- **m-input 输入框**：六种类型（text / tel / digit / number / password / textarea）、`clearable` + `clear-trigger` 两时机（focus / always）、`maxlength`（-1 不限制）+ `show-word-limit` 字数统计、`border` / `inlaid`（清边框内边距嵌入单元格）、`disabled` / `readonly`（无原生 readonly 以 disabled 模拟）、`confirm-type`、textarea `auto-height`；`formatter` + `format-trigger`（onChange / onBlur）、`precision` 精度保留尾零、`min` / `max` 失焦数字收敛、`show-eye` 明文切换；prepend / append 插槽、`v-model` 统一 string 与 input / change（失焦快照比对）/ focus / blur / clear 事件、expose `focus()` / `blur()` 方法；provide/inject 注入 m-compact 上下文，可与 m-button 混排（详见 [Input](/components/input)）
- **m-calendar / m-calendar-popup / m-calendar-input 日历三组件**：按「面板 / 弹出框 / 输入框」拆为三个组件——m-calendar 纯平铺面板（single / multiple / range 三种选择类型、`switch-mode` 年月切换导航（导航 clamp 到可选范围）、`formatter` 日期格式化、`first-day-of-week` 周起始日、`row-height` 行高、月份背景水印、`height` 面板高度、`color` 主题色派生选中圆与范围 bar（支持渐变）、`min-date` / `max-date` 界外禁用、`max-range` 范围与多选通用超限限制（拒绝 + `over-range` + m-toast 提示）、`allow-same-day` 起止同日、`default-date` 预选；select / confirm / unselect / over-range / month-show / panel-change / click-subtitle / click-disabled-date 事件与 12 个插槽；expose `reset()` / `resetSelection()` / `scrollToDate()` / `getSelectedDate()` / `refreshView()` 方法）；m-calendar-popup 基于 m-popup 组合的弹层日历（弹层 props 全透传与 `popup-height` % 换算、确认后自动关闭、复开 `refreshView` 复位聚焦月、`v-model:value` 受控选中值透传、`reset-on-open` 打开时重置选择为 value / default-date、日历事件与插槽条件转发）；m-calendar-input 基于 m-input 只读触发器 + 弹层组合（`v-model:value` 确认回填、single 单值 / range 区间串 / multiple 顿号串展示、自绘清空按钮、disabled / border / inlaid 形态、弹层打开重置选择为当前值（内部启用 `reset-on-open`））（详见 [Calendar](/components/calendar)）

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
