## 0.7.3 (2026-11-22)

- 修复 VDOM 模式（uni-app x + 微信小程序）下具名插槽被误判为「未传入」、调用方传入的内容被整块隐藏（issue #27，0.7.2 回归）：VDOM 模式下小程序端具名插槽值是布尔 `true`（已传）或不存在该 key（未传），并非节点数组，原 `slotHasContent` 只按「数组长度 > 0」判定，布尔值取不到 `length`，`m-tabs` 的 `nav-left` / `nav-right` 以及所有经该守卫的具名插槽（picker-popup 系列的 `toolbar` / `title` / `confirm` / `cancel` 等）全部被 `v-if` 隐藏。`slotHasContent` 的小程序分支改为按值形态分流：渲染函数视为已传入、布尔直接返回其值，其余仍按数组长度判定（0.7.2「空数组视为未传」的修复不受影响）；Web / App 代码路径不变

## 0.7.2 (2026-11-21)

- 修复微信小程序端 picker-popup 系列未传插槽时默认工具栏被空插槽覆盖（issue #24）：小程序端未传具名插槽时 `$slots.x` 为空数组而非 null，`$slots.x != null` 恒真，弹层转发空插槽后面板 `<slot>` fallback 不再渲染，顶部取消 / 标题 / 确认与底部按钮区域空白、无法提交。新增 `utils/slot.uts` 的 `slotHasContent` 跨端判定，弹层条件转发与面板默认内容改显式 `v-if / v-else`；同根因一并修复 `m-date-range-picker` / `m-time-range-picker`（两段标题与底部按钮）、`m-calendar`（确认按钮文案）、`m-cascader`（标题）、`m-number-keyboard`（额外键文字）
- 修复 Android 端云打包 Kotlin 编译失败：插槽判定原先直接写在模板里（`v-if="slotHasContent($slots['toolbar'])"`），Android 模板编译器会把「导入函数 + `$slots` 入参」生成成 `.invoke` 形式，报 `Unresolved reference 'invoke'`；改为 24 个组件在脚本层用计算属性（`hasToolbarSlot` 等）求值，模板只引用布尔值。同时修复 `m-date-picker-column` 的 `scheduleVerify` 前向引用——Android 端 setup 函数按声明顺序编译为局部函数，后面的函数不能被前面的函数调用，定位校验已内联为自递归
- 调整 `m-checkbox` / `m-checkbox-group` / `m-checkbox-input` / `m-checkbox-popup` 的 `shape` 默认值为 `square`（圆角方框），需要圆形请显式传 `shape="round"`
- 修复微信小程序端勾选图标显示为黑色：选中态的白勾原由 `.m-checkbox__check` 着色，该类挂在 `m-icon` 内部节点上，小程序端自定义组件默认样式隔离（`isolated`）导致父组件样式无法命中子组件内部节点，`custom-class` 的 `color` 被静默忽略；改为把 `color / font-size` 落在 `m-checkbox` 自己的图标容器 `.m-checkbox__icon-wrap--checked` 上、靠继承穿透组件边界下发，并删除失效规则
- 修复微信小程序端默认插槽判定失效导致选中态与文案丢失：`slotHasContent` 按数组长度判定只对具名插槽成立，小程序端写在组件标签之间的匿名子节点不进入 `$slots.default` 数组（有内容时为空数组、无内容时该 key 缺失），长度判定恒为 `false`，组件内 `<slot>` 的 fallback 被编译成 `wx:else` 后永不渲染。默认插槽统一改用 `slots['default'] != null` 判定，`m-checkbox` 选中白勾 / `indeterminate` 横杠、`m-loading` 文案、`m-toast` 消息、`m-badge` 包裹子元素、`m-radio` / `m-checkbox` 独立使用时的标签、`m-number-keyboard-popup` 键盘上方内容区恢复正常；`utils/slot.uts` 补充「仅用于具名插槽」的口径说明
- 修复微信小程序端 `m-date-picker-popup` / `m-time-picker-popup` 首次打开（及复开）滚轮停在首项、不定位到 `value`（issue #25）：滚轮列原先把内部镜像 `actualTop` 提前写成目标值，而弹层首帧挂载时滚动视口高度为 0、`scroll-top` 被忽略且不产生 `@scroll`，镜像与真实位置脱节后 `resetSelection` 的再次定位被「已到位」判断跳过；改为镜像只由 `@scroll` 回灌真实位置，同值强制定位的偏移归位改用定时器（小程序端相邻两次 setData 会合帧），并在布局可用后补一次校验重发；新增 `m-picker` / `m-date-picker` / `m-time-picker` / `m-lunar-picker` 实例方法 `reposition()`，四个 picker-popup 在 `open` 时自动调用

## 0.7.1 (2026-11-19)

- 修复 `m-icon` 微信小程序端图标字体加载失败（issue #22）：`uni.loadFontFace` 的 `source` 由裸 base64 改为标准 CSS 资源地址 `url("data:font/ttf;base64,...")`，此前微信将裸 base64 当作 URL 解析并报 `loadFontFace:fail createDownloadTask:fail invalid url`，导致所有图标回退默认字形；新增模块级 `mpFontState` 加载标记（`global: true` 全端生效只需一次），避免每个图标实例重复调用与重复报错，失败时复位以便重试并输出 `[m-icon] loadFontFace fail`

## 0.7.0 (2026-11-17)

- 新增 `m-number-keyboard` 数字键盘面板：1-9 + 0 + 删除键的纯按键区，不持有输入值，只派发 `input(key)` / `delete` / `close`；`type` 支持 `number` / `digit` / `idcard` / `random`（挂载与 `type` 切换时重排，也可调用 `shuffle()` 手动重排）；无额外键时 `0` 加宽占两格填满末行，`digit` / `idcard` 或自定义 `extra-keys` 时额外键位于末行左侧（digit 默认 `.`、idcard 默认 `X`）；`theme="custom"` 用右侧栏替代末行删除键，删除键与关闭键上下平分高度；`show-delete-key` / `delete-button-text` / `close-button-text` 控制动作键；`disabled-key` 回调返回 true 的键灰显且不派发事件；`extra-key` 插槽自定义额外键；expose `shuffle()`
- 新增 `m-number-keyboard-popup` 数字键盘弹出框：`m-popup` + 面板组合，默认插槽位于键盘上方承载验证码格 / 金额展示（未传插槽时不渲染内容区）；`title` / `show-toolbar` / `show-cancel` / `show-confirm` / `cancel-button-text` / `confirm-button-text` 控制工具条，取消 / 完成派发后自动关闭；`transparent` 去掉黑色蒙层、`show-shadow` 用顶部投影条分隔页面；面板 `close` 在弹层拆为 `close-key`，`close` 仅表示弹层生命周期；`type="random"` 每次打开重新打乱
- 新增 `$m-number-keyboard-*` 主题变量段（键高 / 圆角 / 底色 / 按压态 / 工具条 / 投影条等 20 项）
- 新增 `m-password-input` 密码输入格子：纯展示不持值，两种视觉风格 `bordered`（圆角方框）/ `underlined`（仅底部 1px 底线）；`mask` 隐藏为圆点（view + border-radius: 50% 跨平台一致）、`plain-text` 明文显示；`gap` 格子间距（px number 类型，禁用 string 避免 UTS 联合类型 Kotlin 退化）；`focused` 驱动当前位闪烁光标（setInterval 半周期切换响应式 class，全平台一致）与高亮边框；`disabled` 灰显不派发 `focus`、`readonly` 只读；`info` / `error-info` 下方提示文字（error 优先）
- 新增 `m-password-input-popup` 密码输入弹出框：`m-popup` + 格子 + `m-number-keyboard` 一体化组合；`v-model:value` 双向绑定，输入自动收敛 `maxlength=length`；弹层打开自动 `focused` 显示光标、`keyboard-type="random"` 每次打开重新打乱；内置 `disabledKey` 填满后数字键自动禁用；透传格子全部 props + 弹层主题工具条 + 透明投影等
- 新增 `$m-password-input-*` 主题变量段（高度 / gap / 圆角 / 边框 / 底线 / 圆点 / 光标 / 提示文字等 20 项）
- 新增 `m-radio` / `m-radio-group` 单选框两件套（对标 Vant Radio）：`v-model:value` 单值绑定（`RadioValue | null`，null 未选，UTS 无 any）；图标为自绘 view（外环 border + 内实心圆点，跨端渲染一致），禁用态用外环灰底填充 + 灰点表达（弃用透明度方案——未选灰环叠加透明度无可见差异），选中态退灰不再用主题色，`shape` 支持 `round` / `square`（Vant 的 `dot` 形态与本项目默认圆环+圆点视觉相同故不设独立值，`square` 为方框+内圆点，不引入 Vant 白勾以免与 checkbox 混淆）；独立使用为受控 `checked` prop（不持值）；吸收 Sard 的 `readonly`（子项 / 组容器合并）；点已选项不取消（单选刚性）；`label-position` / `label-disabled` / `icon-size` / `checked-color` / `direction` / `icon` / `default` 插槽与 checkbox 系对齐
- 修复 `m-input` inlaid 嵌入 `m-cell` 后值区拉伸与点击区问题（0.6.0 的控件层 `min-height` 只解决了高度塌陷）：inlaid 根节点新增 `flex-grow: 1`（basis 保持 auto——column 容器高度不塌陷、cell 内兄弟节点不被挤压），body / 控件随之填满 value 区，此前值区剩余宽度（标题与输入框之间的空隙）点击无反应；演示页移除用户侧补偿的 `custom-style="flex: 1"`（组件层已内建）
- 修复 `m-checkbox` 未选中态误渲染为实色勾（未选与选中渲染同一 `m-icon` 'success' 字形，m-icon 字体修复后勾形显形暴露）：未选态改为标准描边空框（`round` 圆环 / `square` 圆角方框），选中态实心填充（`$m-checkbox-icon-color` / `checked-color`）+ 白勾，indeterminate 实心底 + 白横杠；新增 `$m-checkbox-box-border-color` / `$m-checkbox-box-border-width` / `$m-checkbox-box-radius` / `$m-checkbox-check-icon-size` 主题变量
- 新增 `m-radio-popup` 单选弹出框：`m-popup` + `m-radio-group` 组合，options 数组驱动渲染（label / value / disabled + field-names 映射，对齐 checkbox-popup 先例）；点选后弹层不自动关闭（受控模型一致，需即选即关可监听 change）；头部标题 + 关闭钮，footer 插槽；透传弹层方位 / 圆角 / 遮罩关闭 / 安全区 / 层级 / 动画时长
- 新增 `m-radio-input` 单选输入框：`m-input` 只读触发器 + 单选弹层，选中项 label 回显（无匹配回退值文本）；自绘清空按钮回写 `null` 并派发 `clear`（m-input 内置 clearable 位于触发层下会被挡住）；`disabled` / `clearable` / `border` / `inlaid` 可配
- 新增 `$m-radio-*` 主题变量段（内边距 / 外环 / 内点 / 文本 / 弹层 / 触发层与清空按钮等 27 项）
- 新增 `m-rate` 评分组件：`v-model:value` 绑定 `number`（0 = 未评分），交互分值吸附 0.5 网格；单颗星由「未选字形 + 宽度百分比裁切层」叠成，`allow-half` 时裁切 50% 实现半星；`readonly` + `allow-half` 按小数位裁切，可展示 3.3 这类任意小数；`icon` / `void-icon` 接 m-icon 字形名（默认 `star` / `star-o`）并提供同名插槽（作用域 `{ index, active }`）；`count` / `size` / `gap` / `color` / `void-color` / `disabled-color` 定制；`clearable` 再次点击当前分值清零；`touchable` 默认开启，按住横向拖动连续选分（Web 桌面 click 与触摸共用同一套坐标换算）；`disabled` 灰显、`readonly` 视觉正常，均不响应交互但照常派发 `click`；MP 端 `v-for` 内不声明同名插槽，回退内置字形
- 新增 `$m-rate-*` 主题变量段（图标尺寸 / 间距 / 选中色 / 未选色 / 禁用色 5 项）
- 新增 `m-search` 搜索组件：组合 `m-input`（inlaid 形态）承载输入 / 清空 / 聚焦 / 只读禁用 / 格式化，自身负责搜索框外观与附加区域；`v-model:value` 绑定输入值，`change` 值变即派发；`shape`（round）+ `background` / `input-background` 定制外观；`label` / `left-icon`（默认 search）/ `right-icon` + 同名插槽承载框内元素；`show-action` + `action-text` + `action-type`（cancel / search）统一右侧按钮语义，`action` 插槽自定义后不再自动派发；键盘确认键派发 `search`；`error` / `error-message` 渲染红框与提示行；`left` / `action` 外部插槽；`focus()` / `blur()` 实例方法
- `m-input` 增强（新增能力，默认行为不变）：新增 `confirm` 事件（键盘确认键，回传当前值）与 `input-align` 属性（`left` / `center` / `right` 输入文字对齐）
- 新增 `$m-search-*` 主题变量段（内边距 / 外部与输入区背景 / 高度 / 圆角 / 左侧文本 / 图标 / 右侧按钮 / 错误提示等 20 项）
- 新增 `m-segmented` 分段控制器：`options` + `fieldNames` 驱动的等分单选，`v-model:value` 受控；`size`（三档）/ `shape`（胶囊）/ `direction`（纵向）全量支持；选中滑块按等分百分比定位，切换时走 `UniElement.animate` 平移（小程序端直接落位），`duration` 可关闭；`item` 作用域插槽（`{ option, index, active, disabled }`）支持图标 + 文本 / 仅图标等自定义内容；`ellipsis` 默认单行省略；组件级 `disabled` / 选项级 `disabled` / `readonly` 三态语义明确；同值点击不派发事件
- 新增 `$m-segmented-*` 主题变量段（内边距 / 背景 / 圆角 / 滑块 / 三档高度与字号与内边距 / 三态文字色等 20 项）
- 新增 `m-select` 列表选择面板：`options` 驱动单选（含 `children` 的项渲染为分组标题，子项可选），`v-model:value` 受控；`filterable` 本地包含匹配筛选 + `filterMethod` 远程受控筛选（`v-model:filter-value`）；整体 / 单项禁用、空态文案、选中态勾选图标、`option` 作用域插槽、`bottom` 插槽、`scrollTop()` 回顶
- 新增 `m-select-popup` 列表选择弹层：`m-popup` + `m-select` 组合，支持 `title`、`v-model:show`、`confirmOnSelect`（选中后自动关闭，默认开启）
- 新增 `m-select-input` 列表选择输入框：只读输入框触发器 + 弹层，展示标签按 `options` → `map-label` → 值字符串解析，自绘清除按钮，支持只读 / 禁用 / `v-model:show` 受控显隐
- 新增 `$m-select-*` 主题变量段（面板 / 筛选 / 标题 / 选项 / 勾选 / 分组 / 空态 / 输入框清除等 24 项）
- 三件套支持多选：`multiple` / `multiple-limit`（0 不限）/ `show-toolbar`（已选数量 + 清空）；多选时 `value` 为数组，点击已选项取消，达到上限后其余项点击无效；多选弹层选中不自动关闭（`confirmOnSelect` 仅对单选生效）；输入框新增 `max-labels`（默认 10，-1 不限），标签按「、」拼接并折叠为「等 N 项」
- 新增 `$m-select-toolbar-*` 主题变量段（内边距 / 字号 / 文字色 / 清空色 4 项）
- 修复微信小程序端打开 `m-color-picker-popup` 抛 `TypeError: Cannot read properties of null (reading 'proxy')`（issue #20）：`m-color-picker` 的 `measureNode` 在调用时取 `getCurrentInstance()`，经父组件 `$callMethod('refresh')` 调用时已脱离 setup 上下文返回 null；改为 setup 期一次性捕获实例（`#ifdef MP`，与 `m-fab` / `m-tabs` 写法一致）；`m-rate` 同类调用时取值一并修正
- 修复 Android 云打包 Kotlin 编译错误第二轮（5 个组件 + 6 个演示页，Web 端行为不变）：
  - Kotlin 局部函数禁前向引用（UTS 函数声明有提升、生成 Kotlin 后失效）：`m-select` 的 `selectedValues` / `containsValue` / `isSelected` 移至 `itemClass` 之前；`m-select-input` 的 `labelOf` 移至 `displayLabel` 之前；`m-password-input` 的 `stopCursorAnimation` 移至 `startCursorAnimation` 之前
  - Kotlin codegen 静默丢弃函数：`m-select-input` / `m-select-popup` 的 `onSelectValueChange` / `onSelectChange` 形参从 `RadioValue | RadioValue[]`（type alias 与数组联合的组合）展开为 `string | number | string[] | number[]`，事件绑定由函数名直传改为内联调用（UTS 函数声明不能作值传递）
  - watch 单表达式 source 补显式返回类型注解（`m-select` / `m-select-input`，对齐 m-radio-group 已验证写法）
  - `m-number-keyboard-popup`：`$slots.default` 改索引访问 `$slots['default']`（`default` 为 Kotlin 保留字，属性访问转义失败）
  - 演示页 rate / search / segmented / select / select-input / select-popup：事件日志函数形参放宽为 `any | null`（codegen 对组件事件处理器参数一律生成 Any）；插槽作用域变量（option / index）改为经页面函数内部 cast；`valuesText` 声明移至 `multiText` computed 之前；select 页 `@change="logMulti"` 改内联调用

## 0.6.0 (2026-11-15)

- 新增 `m-date-picker` / `m-date-picker-popup` / `m-date-picker-input` 日期选择三件套（对标 Vant DatePicker）：年 / 月 / 日滚轮列滚动停止后吸附到最近选项，`columns-type` 支持 `year` / `month` / `day` 任意顺序组合（缺失分量按 1 月 1 日归一），`min-date` / `max-date` 默认前后十年并据已选年月收敛月 / 日取值域；`filter` / `formatter` 二次加工列选项；`option-height` / `visible-option-num` / `swipe-duration` 调整滚轮，`readonly` 回弹、`loading` 阻断交互；顶部栏支持 `show-toolbar` 与 `toolbar` / `title` / `confirm` / `cancel` 插槽，另有 `option` / `columns-top` / `columns-bottom` 插槽（`option` 仅 Web 生效，App / 小程序端回退内置文本）；expose `confirm` / `resetSelection` / `getSelectedDate`；弹层确认或取消后自动关闭，输入框展示格式随列组合派生（`YYYY` / `YYYY-MM` / `YYYY-MM-DD` / `MM-DD`）并支持清空；`v-model:value` 绑定 `Date`；新增 `$m-date-picker-option-*` 与 `$m-date-picker-input-*` 主题变量
- 新增 `m-date-range-picker` / `m-date-range-picker-popup` / `m-date-range-picker-input` 日期范围三件套（对标 Sard DatetimeRangePicker）：开始 / 结束两段标题（`tabs` 可自定义）复用同一套日期滚轮，两端值分别维护，确认时若起点晚于终点自动交换为升序；`columns-type` / `min-date` / `max-date` / `filter` / `formatter` 沿用 `m-date-picker` 契约，`change` 派发两端快照与当前编辑端下标；弹层确认 / 取消后自动关闭；输入框 `outlet-format` 自定义「起 - 止」展示格式（缺省按列组合派生）、清空回写 `null`；插槽 `header`（快捷选项）/ `title`（整体替换两段标题，作用域 `tabs` / `activeIndex`）/ `footer` / `confirm` / `cancel`；expose `confirm` / `resetSelection` / `getSelectedValue`；新增 `$m-date-range-picker-*` 与 `$m-date-range-picker-input-*` 主题变量；首版仅年 / 月 / 日粒度
- 新增 `m-time-picker` / `m-time-picker-popup` / `m-time-picker-input` 时间三件套：时 / 分 / 秒滚轮列（`columns-type` 任意组合，默认时-分），值为 24 小时制 `'HH:mm'` / `'HH:mm:ss'` 字符串；`minute-step` / `second-step` 步长（1-59），`min-time` / `max-time` 同日选项收敛（单端配置自动补齐，跨天视为不约束），`hour-cycle` 24 / 12（12 制自动附加「上午 / 下午」列，值仍为 24 制）；复用 `m-date-picker-column` 滚轮；`toolbar` / `title` / `confirm` / `cancel` / `option` 插槽；expose `confirm` / `resetSelection` / `getSelectedValue`
- 新增 `m-time-range-picker` / `m-time-range-picker-popup` / `m-time-range-picker-input` 时间范围三件套：开始 / 结束两段标题（`tabs` 可自定义）复用一个时间滚轮，两端字符串各自维护，确认时自动交换为升序；两端共用列组合 / 步长 / 区间 / 制式；`header` / `title` / `footer` / `confirm` / `cancel` 插槽；输入框以「起 - 止」展示并支持清空
- 新增 `$m-time-picker-*` / `$m-time-picker-input-*` / `$m-time-range-picker-*` / `$m-time-range-picker-input-*` 主题变量段
- 新增 `m-picker` / `m-picker-popup` / `m-picker-input` 通用选择器三件套：`columns` 一维 / 二维自动识别（一维按单列、元素为数组按多列），选项统一 `{ label, value, children?, disabled? }`；一维含 `children` 走级联（切换上层后下层重建并回到首项）；值单列标量、多列 / 级联数组，事件回传 `(value, selectedOptions, indexes)`；禁用项灰显 / 吸附跳过 / 点击不选中；`toolbar` / `title` / `cancel` / `confirm` / `option` / `columns-top` / `columns-bottom` 插槽；expose `confirm` / `resetSelection` / `getSelectedValue` / `getSelectedIndexes`
- 新增 `m-picker-view` / `m-picker-view-column` 索引受控纯视图：`value: number[]`，无工具栏、无数值换算、不展开级联，`option` 插槽可自定义选项内容
- 新增 `$m-picker-*` / `$m-picker-input-*` / `$m-picker-view-*` 主题变量段
- `m-date-picker-column` 新增可选 `disabledOptions`（默认 null）：禁用项灰显、点击忽略、吸附跳过，日期 / 时间选择不传即行为不变
- 变更：`m-date-picker` / `m-time-picker` 面板内部迁移为 `m-picker` 组合（无 API 变更）：顶部栏 / 选中框 / 滚轮容器 / 加载遮罩由通用选择器承担，对外 props / events / 插槽 / 实例方法不变；面板级主题变量收敛为 `$m-picker-*`（`$m-date-picker-*` 仅保留选项文本三项，`$m-time-picker-*` 不再提供面板变量）
- 新增 `m-lunar-picker` 农历选择面板：农历年 / 月（含闰月，月序负值）/ 日三列滚轮，`columns-type` 任意组合；月列按 `getLunarMonthSequence` 生成（闰月紧随其月，文案形如「闰二月」），日列按农历月长 29 / 30 生成；`show-gan-zhi` / `show-zodiac` 为年列追加干支与生肖；`min-date` / `max-date` 为公历日期，列边界反向映射并默认覆盖农历表 1900–2100，越界静默钳制；`filter` / `formatter`、顶部栏与插槽契约同日期面板（`option` 插槽回退 `{ text, value }` 口径）；`v-model:value` 与 `change(date, columnIndex)` / `confirm(date)` 均为公历 `Date`；expose `confirm` / `resetSelection` / `getSelectedDate` / `getSelectedLunarText`
- 新增 `m-lunar-picker-popup` 农历选择弹出框：`m-popup` + 农历面板组合，`v-model:show` / `v-model:value` 受控，确认 / 取消后自动关闭；透传方位 / 圆角 / 遮罩关闭 / 安全区 / 层级 / 动画时长，`reset-on-open` 控制复开复位
- 新增 `m-lunar-picker-input` 农历输入框：`m-input` 只读触发器 + 农历弹层，展示文本按列组合派生（如 `2026年六月十五`，开启 `show-gan-zhi` 为 `丙午年六月十五`）；自绘清空按钮回写 `null` 并派发 `clear`，`disabled` / `clearable` / `border` / `inlaid` 可配
- 新增 `$m-lunar-picker-input-*`（触发层 / 清空按钮）主题变量段；面板视觉复用 `$m-picker-*`，列文本沿用 `$m-date-picker-option-*`
- `utils/date` 新增导出 `getLunarMonthSequence(year)` / `LUNAR_START_YEAR` / `LUNAR_END_YEAR`
- 修复：`m-input` 开启 `inlaid` 嵌入 `m-cell` 时控件高度塌陷（仅剩文本行高约 19.6px，贴顶且可点击区过小）；新增 `$m-input-inlaid-min-height`（默认 24px，与 `m-cell` 单行内容区一致），inlaid 控件保底高度并垂直居中占位符；所有透传 inlaid 的输入类组件同步生效
- 修复：`m-input` 在 `m-compact` 水平组合中输入文字贴顶（边框容器改为 `flex: 1` 撑满根节点，与同行 `m-button` 等高后文字垂直居中），普通形态与 `textarea` 高度不受影响
- 说明：`option` 插槽统一为仅 Web 生效——App 端插槽解构出的行下标为 `Any?`，无法作为 number 参数通过 Kotlin 编译；小程序端同名插槽在 `v-for` 内仅首个生效。两端回退内置文本，自定义文案请用 `formatter`

## 0.5.3 (2026-11-15)

- 修复 `m-calendar` 小程序端日格 `v-for` 内重复声明同名插槽（`month-title` / `text` / `top-info` / `bottom-info`）导致的 `More than one slot named "top-info"` 刷屏告警（[#17](https://github.com/MengXi-Studio/unix-ui/issues/17)）；小程序端改用 `formatter` 文本渲染，Web / App 插槽行为不变；`m-date-strip` 的 `item` / `top-info` / `bottom-info` 同理（`show-lunar` 不受影响）；`m-cascader` 的 `option` / `options-top` / `options-bottom` 同理

## 0.5.2 (2026-11-15)

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
