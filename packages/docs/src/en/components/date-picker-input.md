---
title: DatePickerInput
subtitle: DatePickerInput
demo: pages-sub/datetime/date-picker-input/date-picker-input
added: 0.6.0
---

## Introduction

Date input composed of [Input](/en/components/input) and [DatePickerPopup](/en/components/date-picker-popup): the trigger displays the current date read-only, clicking the whole area opens the popup, and confirming writes back through `v-model:value` with a format derived from the column types.

## Usage

### Basic {#demo-basic}

After confirmation the value is written back as `YYYY-MM-DD`; when a value exists a clear button appears, clearing writes back `null` and fires `clear`.

```vue
<m-date-picker-input v-model:value="value" title="Select date" @confirm="onConfirm" @clear="onClear" />
```

```ts
const value = ref<Date | null>(null)
```

### Column types {#demo-columns}

The display format is derived from `columns-type`: `['year']` → `YYYY`, `['year', 'month']` → `YYYY-MM`, `['month', 'day']` → `MM-DD`; missing parts normalize to January 1st.

```vue
<m-date-picker-input v-model:value="yearMonth" :columns-type="['year', 'month']" placeholder="Select year-month" />
<m-date-picker-input v-model:value="year" :columns-type="['year']" placeholder="Select year" />
<m-date-picker-input v-model:value="monthDay" :columns-type="['month', 'day']" placeholder="Select month-day" />
```

### Selectable range {#demo-range}

```vue
<m-date-picker-input v-model:value="value" :min-date="minDate" :max-date="maxDate" placeholder="Limited range" />
```

### Disabled and non-clearable {#demo-disabled}

`disabled` disables the trigger layer and hides the clear button; `clearable` set to `false` hides only the clear button.

```vue
<m-date-picker-input :value="value" disabled />
<m-date-picker-input v-model:value="value" :clearable="false" />
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected date (`v-model:value`) | Date \| null | `null` |
| columns-type | Column types | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| placeholder | Placeholder | string | `请选择日期` |
| disabled | Whether disabled | boolean | `false` |
| clearable | Whether to show the clear button (visible when a value exists and not disabled) | boolean | `true` |
| border | Whether the trigger shows a border container | boolean | `true` |
| inlaid | Inlaid trigger form | boolean | `false` |
| title | Popup toolbar title | string | `''` |
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
| update:value | Writes back the selected date after confirm (`null` on clear) | date: Date \| null |
| confirm | Fires after the popup confirms | date: Date |
| clear | Fires when the clear button is clicked | - |

## Theming

Input appearance (border, background, text, placeholder) is controlled by [Input](/en/components/input) theme variables; clear-button variables:

| Variable | Description | Default |
| --- | --- | --- |
| $m-date-picker-input-trigger-z-index | Transparent trigger layer level | 1 |
| $m-date-picker-input-clear-z-index | Clear button level | 2 |
| $m-date-picker-input-clear-width | Clear button hit area width | 40px |
| $m-date-picker-input-clear-icon-size | Clear icon size | 16px |
| $m-date-picker-input-clear-color | Clear icon color | #c8c9cc |

## Differences from Vant

- Vant has no date input component; this project provides `m-date-picker-input` following the existing calendar / cascader trio conventions
- The display format is derived from `columns-type` (year-month-day joined by `-`); there is no separate `format` prop
- Clearing uses a custom button (the built-in `m-input` clearable icon would sit under the transparent trigger layer)
