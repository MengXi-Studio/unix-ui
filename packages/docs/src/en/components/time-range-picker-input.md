---
title: TimeRangePickerInput
subtitle: TimeRangePickerInput
demo: pages-sub/datetime/time-range-picker-input/time-range-picker-input
added: 0.6.0
---

## Introduction

Time range input composed of [Input](/en/components/input) and [TimeRangePickerPopup](/en/components/time-range-picker-popup): the trigger shows "start - end" read-only, and confirming writes back the two ends through `v-model:value`.

## Usage

### Basic {#demo-basic}

```vue
<m-time-range-picker-input v-model:value="value" @confirm="onConfirm" @clear="onClear" />
```

```ts
const value = ref<string[] | null>(null)
```

### Seconds and custom tabs {#demo-columns}

```vue
<m-time-range-picker-input
	v-model:value="value"
	:columns-type="['hour', 'minute', 'second']"
	:tabs="['Start', 'End']"
/>
```

### Steps, range and 12-hour cycle {#demo-constraints}

```vue
<m-time-range-picker-input v-model:value="value" :minute-step="15" min-time="09:00" max-time="18:00" />
<m-time-range-picker-input v-model:value="value2" :hour-cycle="12" />
```

### Disabled and non-clearable {#demo-disabled}

```vue
<m-time-range-picker-input :value="['09:00', '18:00']" disabled />
<m-time-range-picker-input v-model:value="value" :clearable="false" />
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Two ends (`v-model:value`) | string[] \| null | `null` |
| tabs | Two tab titles | string[] \| null | `['开始时间', '结束时间']` |
| columns-type | Column types | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| placeholder | Placeholder | string | `请选择时间范围` |
| disabled | Whether disabled | boolean | `false` |
| clearable | Whether to show the clear button | boolean | `true` |
| border | Whether the trigger shows a border container | boolean | `true` |
| inlaid | Inlaid trigger form | boolean | `false` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| min-time | Minimum time | string \| null | `null` |
| max-time | Maximum time | string \| null | `null` |
| minute-step | Minute step | number | `1` |
| second-step | Second step | number | `1` |
| hour-cycle | Hour cycle (24 / 12) | number | `24` |
| filter | Option filter | TimePickerFilter \| null | `null` |
| formatter | Option formatter | TimePickerFormatter \| null | `null` |
| position | Popup position | DatePickerPosition | `bottom` |
| round | Popup round corners | boolean | `true` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Writes back the two ends after confirm (`null` on clear) | value: string[] \| null |
| confirm | Fires after the popup confirms | value: string[] |
| clear | Fires when the clear button is clicked | - |

## Theming

Input appearance is controlled by [Input](/en/components/input) theme variables; clear-button variables:

| Variable | Description | Default |
| --- | --- | --- |
| $m-time-range-picker-input-trigger-z-index | Transparent trigger layer level | 1 |
| $m-time-range-picker-input-clear-z-index | Clear button level | 2 |
| $m-time-range-picker-input-clear-width | Clear button hit area width | 40px |
| $m-time-range-picker-input-clear-icon-size | Clear icon size | 16px |
| $m-time-range-picker-input-clear-color | Clear icon color | #c8c9cc |
