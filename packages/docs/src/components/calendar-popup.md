---
title: CalendarPopup
subtitle: 日历弹出框
demo: pages-sub/calendar-popup/calendar-popup
---

## 介绍

日历弹出框组件，基于 [Popup](/components/popup)（底部弹出层）与 [Calendar](/components/calendar)（日历面板）组合实现，负责弹层显隐、方位 / 圆角 / 层级等容器能力；日历的选择能力（类型 / 格式化 / 范围限制等）全量透传。

点击确认按钮或选满自动确认后，弹层自动关闭。表单触发场景（输入框回填）直接使用 [CalendarInput](/components/calendar-input)。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:show` 控制显隐；点击确认后派发 `confirm` 并自动关闭。弹层全生命周期事件（open / opened / close / closed / click-overlay）一应俱全。

```vue
<m-button block @click="show = true">打开日历</m-button>
<m-calendar-popup v-model:show="show" @confirm="onConfirm" @closed="onClosed" />
```

### 受控选中值 {#demo-controlled}

通过 `v-model:value` 受控选中值（single 为 Date，multiple / range 为 Date[]）：日历内 select 实时回写（single 未设值时默认选中今天，对齐日历面板语义）；外部赋值后打开弹层，选中态跟随受控值。

```vue
<m-button block @click="show = true">打开日历</m-button>
<m-calendar-popup v-model:show="show" v-model:value="value" />
```

### 多选弹层 {#demo-multiple}

`type` 设为 `multiple` 点击切换选中 / 取消（取消触发 `unselect`）；`max-range=3` 超限拒绝选择并 toast（`over-range`）。

```vue
<m-calendar-popup
	v-model:show="show"
	type="multiple"
	:max-range="3"
	range-prompt="最多选择 3 天"
	@select="onSelect"
	@unselect="onUnselect"
	@over-range="onOverRange"
	@confirm="onConfirm"
/>
```

### 范围自动确认 {#demo-range}

`show-confirm` 设为 `false` 时选满即自动确认并自动关闭弹层；`allow-same-day` 允许起止同日。

```vue
<m-calendar-popup
	v-model:show="show"
	type="range"
	:show-confirm="false"
	:allow-same-day="true"
	@confirm="onConfirm"
/>
```

### 方位 / 圆角 / 高度 {#demo-shape}

`position` 指定弹出方位（透传 m-popup，center 为居中弹出）；`round=false` 关闭圆角；`popup-height` 控制面板高度，`%` 值按窗口高换算为 px 后下发。

```vue
<m-calendar-popup
	v-model:show="show"
	position="center"
	:round="false"
	popup-height="90%"
/>
```

### formatter 与界外禁用 {#demo-formatter}

`min-date` / `max-date` 限定可选区间（界外置灰，点击派发 `click-disabled-date`）；`formatter` 自定义日期文案与标记。

```vue
<m-calendar-popup
	v-model:show="show"
	:min-date="minDate"
	:max-date="maxDate"
	:formatter="dayFormatter"
	@click-disabled-date="onDisabled"
/>
```

### 插槽 {#demo-slots}

支持日历面板的全部插槽（title / subtitle / footer / 导航图标等），透传到内部 m-calendar。

```vue
<m-calendar-popup v-model:show="show">
	<template #title>
		<text>选择入住日期</text>
	</template>
	<template #footer>
		<view><text>自定义 footer 区域</text></view>
	</template>
</m-calendar-popup>
```

## API

### Props

**弹层 Props**（透传 [m-popup](/components/popup)）：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model:show | 是否显示弹出层 | boolean | `false` |
| v-model:value | 选中值，single 为 Date，multiple / range 为 Date[]，`null` 未选 | Date \| Date[] \| null | `null` |
| popup-height | 弹层面板高度（px 原样；`%` 按窗口高换算为 px） | string | `80%` |
| position | 弹出方位，可选值 `center` `top` `bottom` `left` `right` | CalendarPosition | `bottom` |
| round | 是否显示圆角 | boolean | `true` |
| close-on-click-overlay | 点击遮罩后是否关闭 | boolean | `true` |
| reset-on-open | 弹层打开时是否重置选择为 value / default-date（默认保留复开时上次选择） | boolean | `false` |
| safe-area-inset-top | 顶部安全区间距 | boolean | `false` |
| safe-area-inset-bottom | 底部安全区间距 | boolean | `true` |
| z-index | 弹层层级 | number | `1` |
| duration | 弹层动画时长秒（`0` 禁用动画） | number | `0.3` |

**日历 Props**（透传 [m-calendar](/components/calendar)，除 `height` 外全部一致——面板高度由 `popup-height` 接管）：`type` / `title` / `color` / `min-date` / `max-date` / `default-date` / `value`（v-model:value） / `row-height` / `formatter` / `show-mark` / `show-title` / `show-subtitle` / `show-confirm` / `confirm-text` / `confirm-disabled-text` / `readonly` / `first-day-of-week` / `switch-mode` / `max-range` / `range-prompt` / `show-range-prompt` / `allow-same-day` / `custom-class` / `custom-style`，类型与默认值见 [Calendar Props](/components/calendar#props)。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐变化时触发（v-model 绑定；确认后组件内部自动置 `false`） | value: boolean |
| update:value | 选中值变化时触发（v-model 绑定；select 时回写，确认值以 confirm 参数为准） | value: Date \| Date[] \| null |
| open | 打开弹层时触发 | - |
| opened | 打开动画结束时触发 | - |
| close | 关闭弹层时触发 | - |
| closed | 关闭动画结束时触发 | - |
| click-overlay | 点击遮罩时触发 | event: MouseEvent |
| select | 点击日期格后触发（转发自内部日历） | value: Date \| Date[] |
| confirm | 点击确认按钮 / 选满自动确认后触发（确认后弹层自动关闭） | value: Date \| Date[] |
| unselect | 多选取消选中某日时触发 | date: Date |
| over-range | 选择超出 max-range 限制被拒绝时触发 | - |
| month-show | 聚焦月进入视口时触发（首次打开挂载时触发一次） | date: Date |
| panel-change | switch-mode 面板所在月变化时触发 | date: Date |
| click-subtitle | 点击副标题 / 导航行当前月标题时触发 | - |
| click-disabled-date | 点击禁用日期时触发 | date: Date |

### Slots

日历面板的全部插槽均支持，透传到内部 m-calendar：

| 名称 | 说明 |
| --- | --- |
| title | 常规标题 |
| subtitle | 副标题 / 导航行当前月标题 |
| month-title | 月份标题（作用域：`month` 该月首日 Date、`text` 标题文案） |
| text | 日期文字（作用域：`day` 该格数据） |
| top-info | 日期顶部信息（作用域：`day`） |
| bottom-info | 日期底部信息（作用域：`day`） |
| footer | 底部区域（默认为确认按钮） |
| confirm-text | 确认按钮文字 |
| prev-year / prev-month / next-month / next-year | switch-mode 导航图标 |

插槽为**条件转发**：仅传入的插槽覆盖内部日历默认渲染，未传入的插槽保持 m-calendar 默认内容。

## 主题定制

本组件无专属主题变量，弹层容器复用 `$m-popup-*` 系列、日历面板复用 `$m-calendar-*` 系列（见 [Calendar 主题定制](/components/calendar#主题定制)）。

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- 组件拆分：Vant 的弹层日历为 Calendar 单组件 `poppable` 形态，本项目拆为独立组件，与 m-popup / m-calendar 各司其职
- `popup-height` 为本项目扩展 prop：m-popup 面板高度自适应内容，`%` 值无法直接生效，由本组件按窗口高换算为 px 后经 `height` 下发（Vant 使用 `height` prop 直接生效）
- 复开行为：弹层复开时内部调用日历 `refreshView` 复位聚焦月（回到可选范围起始 / 预选月），选择状态保留；Vant 弹层复开保持上次滚动位置
- 插槽条件转发：未传入的插槽保持内部日历默认渲染（Vant 单组件内插槽天然如此，独立组合组件需显式处理）
- 内部日历实例方法（reset / scrollToDate 等）不透出；需要方法控制时改用 m-popup + m-calendar 自行组合
