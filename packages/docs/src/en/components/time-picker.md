---
title: TimePicker
subtitle: TimePicker
demo: pages-sub/time-picker/time-picker
added: 0.6.0
---

## Introduction

Time picker panel with hour / minute / second wheel columns, supporting column combinations, steps, same-day time range constraints and 12 / 24-hour cycles.

This is a pure inline panel: the popup form is composed by [TimePickerPopup](/en/components/time-picker-popup) and the form-trigger form by [TimePickerInput](/en/components/time-picker-input). For ranges see [TimeRangePicker](/en/components/time-range-picker).

## Usage

### Basic {#demo-basic}

```vue
<m-time-picker v-model:value="value" @change="onChange" @confirm="onConfirm" />
```

```ts
const value = ref<string | null>(null)
```

### Hour / minute / second {#demo-columns}

```vue
<m-time-picker v-model:value="value" :columns-type="['hour', 'minute', 'second']" />
```

### Steps and range {#demo-step}

```vue
<m-time-picker v-model:value="value" :minute-step="15" min-time="09:00" max-time="18:00" title="Working hours" />
```

### 12-hour cycle {#demo-cycle}

```vue
<m-time-picker v-model:value="value" :hour-cycle="12" />
```

### Slots {#demo-slots}

```vue
<m-time-picker v-model:value="value">
	<template #confirm>
		<text>Done</text>
	</template>
	<template #option="{ option }">
		<text>{{ option.text }}</text>
	</template>
</m-time-picker>
```

### Instance methods {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedValue')
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Time string (`v-model:value`, `'HH:mm'` / `'HH:mm:ss'`) | string \| null | `null` (now) |
| columns-type | Column types (hour / minute / second) | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| min-time | Minimum time (same day) | string \| null | `null` |
| max-time | Maximum time (same day) | string \| null | `null` |
| minute-step | Minute step (1-59) | number | `1` |
| second-step | Second step (1-59) | number | `1` |
| hour-cycle | Hour cycle (24 / 12) | number | `24` |
| title | Toolbar title | string | `选择时间` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| show-toolbar | Whether to show the toolbar | boolean | `true` |
| loading | Whether to show the loading state | boolean | `false` |
| readonly | Readonly | boolean | `false` |
| filter | Option filter `(type, options, values) => options` | TimePickerFilter \| null | `null` |
| formatter | Option formatter `(type, option) => option` | TimePickerFormatter \| null | `null` |
| option-height | Option row height in px (`0` uses 44) | number | `0` |
| visible-option-num | Visible option count (`0` uses 6) | number | `0` |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Writes back the time string after confirm | value: string |
| change | Wheel column changed | value: string, columnIndex: number |
| confirm | Confirm clicked | value: string |
| cancel | Cancel clicked | - |

### Methods

| Method | Description |
| --- | --- |
| confirm | Programmatic confirm |
| resetSelection | Resets to the external value / now |
| getSelectedValue | Returns the current time string |

### Slots

| Name | Description |
| --- | --- |
| toolbar | Replaces the whole toolbar |
| title | Title content |
| confirm | Confirm button content |
| cancel | Cancel button content |
| option | Option content (scoped: `option`, `index`) |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-time-picker-background | Panel background | #ffffff |
| $m-time-picker-toolbar-height | Toolbar height | 44px |
| $m-time-picker-action-padding | Toolbar button padding | 0 16px |
| $m-time-picker-action-font-size | Toolbar button font size | 14px |
| $m-time-picker-cancel-color | Cancel text color | #646566 |
| $m-time-picker-confirm-color | Confirm text color | #1989fa |
| $m-time-picker-title-font-size | Title font size | 16px |
| $m-time-picker-title-color | Title color | #323233 |
| $m-time-picker-frame-color | Selection frame line color | #ebedf0 |
| $m-time-picker-loading-background | Loading overlay background | rgba(255,255,255,0.9) |

## Differences from DatePicker

- Value: time is a string (`'HH:mm'` / `'HH:mm:ss'`) without a date; DatePicker uses `Date`
- Constraints: `min-time` / `max-time` are resolved within the same day; a cross-day config (min later than max) means no constraint
- The 12-hour cycle only affects the columns; the bound value is always 24-hour
- The AM / PM column is not part of `columns-type`; it is added automatically by `hour-cycle`
