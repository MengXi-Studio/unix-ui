---
title: TimeRangePickerPopup
subtitle: TimeRangePickerPopup
demo: pages-sub/time-range-picker-popup/time-range-picker-popup
added: 0.6.0
---

## Introduction

Time range popup composed of [Popup](/en/components/popup) and [TimeRangePicker](/en/components/time-range-picker). It closes automatically after confirm or cancel.

## Usage

### Basic {#demo-basic}

```vue
<m-button @click="show = true">Open time range</m-button>
<m-time-range-picker-popup v-model:show="show" v-model:value="value" @confirm="onConfirm" />
```

```ts
const show = ref(false)
const value = ref<string[] | null>(null)
```

### Steps, range and 12-hour cycle {#demo-columns}

```vue
<m-time-range-picker-popup v-model:show="show" :tabs="['Start', 'End']" :minute-step="15" min-time="09:00" max-time="18:00" />
<m-time-range-picker-popup v-model:show="show2" :columns-type="['hour', 'minute', 'second']" :hour-cycle="12" />
```

### Slots {#demo-slots}

```vue
<m-time-range-picker-popup v-model:show="show" v-model:value="value">
	<template #header>
		<view><text @click="setWorkTime">Working hours</text></view>
	</template>
	<template #confirm>
		<text>Done</text>
	</template>
</m-time-range-picker-popup>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| value | Two ends (`v-model:value`) | string[] \| null | `null` |
| tabs | Two tab titles | string[] \| null | `['开始时间', '结束时间']` |
| columns-type | Column types | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| min-time | Minimum time | string \| null | `null` |
| max-time | Maximum time | string \| null | `null` |
| minute-step | Minute step | number | `1` |
| second-step | Second step | number | `1` |
| hour-cycle | Hour cycle (24 / 12) | number | `24` |
| filter | Option filter | TimePickerFilter \| null | `null` |
| formatter | Option formatter | TimePickerFormatter \| null | `null` |
| option-height | Option row height in px | number | `0` (44) |
| visible-option-num | Visible option count | number | `0` (6) |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| readonly | Readonly | boolean | `false` |
| loading | Whether to show the loading state | boolean | `false` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| position | Popup position | DatePickerPosition | `bottom` |
| round | Whether to use round corners | boolean | `true` |
| close-on-click-overlay | Whether clicking the overlay closes the popup | boolean | `true` |
| reset-on-open | Reset to value when opening | boolean | `false` |
| safe-area-inset-top | Top safe area | boolean | `false` |
| safe-area-inset-bottom | Bottom safe area | boolean | `true` |
| z-index | Stacking level | number | `1` |
| duration | Animation duration (seconds) | number | `0.3` |
| custom-class | Custom class of the panel root | string.ClassString | - |
| custom-style | Custom inline style of the panel root | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Visibility change | value: boolean |
| update:value | Writes back the two ends after confirm | value: string[] \| null |
| change | Active end switched | value: string[], activeIndex: number |
| confirm | Confirm clicked (popup then closes) | value: string[] |
| cancel | Cancel clicked (popup then closes) | - |
| open / opened / close / closed | Popup lifecycle | - |
| click-overlay | Overlay clicked | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| header | Content above the tabs (shortcuts) |
| title | Replaces both tabs (scoped: `tabs`, `activeIndex`) |
| footer | Replaces the whole footer |
| confirm | Confirm button content |
| cancel | Cancel button content |

## Theming

Popup appearance is controlled by [Popup](/en/components/popup) theme variables; see [TimeRangePicker theming](/en/components/time-range-picker#theming) for the panel.
