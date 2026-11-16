---
title: TimeRangePicker
subtitle: TimeRangePicker
demo: pages-sub/time-range-picker/time-range-picker
added: 0.6.0
---

## Introduction

Time range panel: two tabs (start / end) share one time wheel, each editing one end of the range, and the two ends are swapped into ascending order on confirm.

The popup form is composed by [TimeRangePickerPopup](/en/components/time-range-picker-popup) and the form-trigger form by [TimeRangePickerInput](/en/components/time-range-picker-input).

## Usage

### Basic {#demo-basic}

```vue
<m-time-range-picker v-model:value="value" @change="onChange" @confirm="onConfirm" />
```

```ts
const value = ref<string[] | null>(null)
```

### Custom tabs and steps {#demo-tabs}

```vue
<m-time-range-picker
	v-model:value="value"
	:tabs="['Check-in', 'Check-out']"
	:minute-step="15"
	min-time="09:00"
	max-time="18:00"
/>
```

### 12-hour cycle and seconds {#demo-cycle}

```vue
<m-time-range-picker v-model:value="value" :columns-type="['hour', 'minute', 'second']" :hour-cycle="12" />
```

### Slots {#demo-slots}

```vue
<m-time-range-picker v-model:value="value" :tabs="['Start', 'End']">
	<template #header>
		<view><text @click="setWorkTime">Working hours</text></view>
	</template>
	<template #confirm>
		<text>Done</text>
	</template>
</m-time-range-picker>
```

### Readonly, loading and methods {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedValue')
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Two ends (`v-model:value`, length 0-2) | string[] \| null | `null` |
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
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Writes back the two ends after confirm (ascending; `null` when empty) | value: string[] \| null |
| change | Fires after the active end switches | value: string[], activeIndex: number |
| confirm | Confirm clicked | value: string[] |
| cancel | Cancel clicked | - |

### Methods

| Method | Description |
| --- | --- |
| confirm | Programmatic confirm |
| resetSelection | Resets to the external value |
| getSelectedValue | Returns the ascending two ends |

### Slots

| Name | Description |
| --- | --- |
| header | Content above the tabs (shortcuts) |
| title | Replaces both tabs (scoped: `tabs`, `activeIndex`) |
| footer | Replaces the whole footer |
| confirm | Confirm button content |
| cancel | Cancel button content |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-time-range-picker-background | Panel background | #ffffff |
| $m-time-range-picker-tabs-height | Tabs height | 44px |
| $m-time-range-picker-tab-font-size | Tab font size | 14px |
| $m-time-range-picker-tab-color | Inactive tab color | #646566 |
| $m-time-range-picker-tab-active-color | Active tab and underline color | #1989fa |
| $m-time-range-picker-tab-line-width | Active underline width | 40px |
| $m-time-range-picker-footer-height | Footer height | 48px |
| $m-time-range-picker-footer-border-color | Footer divider color | #ebedf0 |
| $m-time-range-picker-action-font-size | Footer button font size | 14px |
| $m-time-range-picker-cancel-color | Cancel text color | #646566 |
| $m-time-range-picker-confirm-color | Confirm text color | #1989fa |

See [TimePicker theming](/en/components/time-picker#theming) for the wheel area.

## Differences from DateRangePicker

- Value: an array of time strings (`['HH:mm', 'HH:mm']`) without dates
- Both ends share the same columns, steps, range and cycle configuration
- A reversed range is swapped into ascending order on confirm
