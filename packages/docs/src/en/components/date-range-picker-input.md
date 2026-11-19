---
title: DateRangePickerInput
subtitle: DateRangePickerInput
demo: pages-sub/datetime/date-range-picker-input/date-range-picker-input
added: 0.6.0
---

## Introduction

Date range input composed of [Input](/en/components/input) and [DateRangePickerPopup](/en/components/date-range-picker-popup): the trigger displays "start - end" read-only, clicking the whole area opens the popup, and confirming writes back the two ends through `v-model:value`.

## Usage

### Basic {#demo-basic}

```vue
<m-date-range-picker-input v-model:value="value" @confirm="onConfirm" @clear="onClear" />
```

```ts
const value = ref<Date[] | null>(null)
```

### Display format {#demo-format}

`outlet-format` customizes the display format; when omitted it is derived from `columns-type` (e.g. `YYYY-MM-DD`).

```vue
<m-date-range-picker-input v-model:value="value" outlet-format="YYYY/MM/DD" />
```

### Columns and range {#demo-columns}

```vue
<m-date-range-picker-input
	v-model:value="value"
	:columns-type="['year', 'month']"
	:tabs="['Start month', 'End month']"
	:min-date="minDate"
	:max-date="maxDate"
/>
```

### Disabled and non-clearable {#demo-disabled}

```vue
<m-date-range-picker-input :value="value" disabled />
<m-date-range-picker-input v-model:value="value" :clearable="false" />
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Two ends (`v-model:value`) | Date[] \| null | `null` |
| tabs | Two tab titles | string[] \| null | `['开始日期', '结束日期']` |
| columns-type | Column types | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| placeholder | Placeholder | string | `请选择日期范围` |
| disabled | Whether disabled | boolean | `false` |
| clearable | Whether to show the clear button | boolean | `true` |
| border | Whether the trigger shows a border container | boolean | `true` |
| inlaid | Inlaid trigger form | boolean | `false` |
| outlet-format | Display format (derived from columns when omitted) | string | `''` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| min-date | Minimum selectable date | Date \| null | `null` (10 years ago) |
| max-date | Maximum selectable date | Date \| null | `null` (10 years later) |
| filter | Option filter function | DatePickerFilter \| null | `null` |
| formatter | Option formatter function | DatePickerFormatter \| null | `null` |
| position | Popup position | DatePickerPosition | `bottom` |
| round | Popup round corners | boolean | `true` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Writes back the two ends after confirm (`null` on clear) | value: Date[] \| null |
| confirm | Fires after the popup confirms | value: Date[] |
| clear | Fires when the clear button is clicked | - |

## Theming

Input appearance is controlled by [Input](/en/components/input) theme variables; clear-button variables:

| Variable | Description | Default |
| --- | --- | --- |
| $m-date-range-picker-input-trigger-z-index | Transparent trigger layer level | 1 |
| $m-date-range-picker-input-clear-z-index | Clear button level | 2 |
| $m-date-range-picker-input-clear-width | Clear button hit area width | 40px |
| $m-date-range-picker-input-clear-icon-size | Clear icon size | 16px |
| $m-date-range-picker-input-clear-color | Clear icon color | #c8c9cc |

## Differences from Sard

- Sard derives `outlet-format` from `type`; this project derives it from `columns-type` and only affects display, never the bound value
- No `value-format`: `v-model:value` is always `Date[]`
- Clearing uses a custom button (the built-in `m-input` clearable icon would sit under the transparent trigger layer)
