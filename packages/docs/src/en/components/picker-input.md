---
title: PickerInput
subtitle: PickerInput
demo: pages-sub/pickers/picker-input/picker-input
added: 0.6.0
---

## Introduction

Picker input composed of [Input](/en/components/input) and [PickerPopup](/en/components/picker-popup): the trigger shows the selected labels read-only, clicking the whole area opens the popup, and confirming writes back through `v-model:value`.

## Usage

### Basic {#demo-basic}

```vue
<m-picker-input
	v-model:value="value"
	:columns="columns"
	title="Select line"
	placeholder="Select line"
	@confirm="onConfirm"
	@clear="onClear"
/>
```

### Multiple columns {#demo-multi}

```vue
<m-picker-input v-model:value="value" :columns="yearMonthDay" title="Select date" />
```

Labels of all columns are joined with " / ".

### Cascade {#demo-cascade}

```vue
<m-picker-input v-model:value="value" :columns="regionTree" title="Select region" />
```

```ts
// External assignment positions every level
value.value = [1000, 1100, 1110]
```

### Disabled and non-clearable {#demo-disabled}

```vue
<m-picker-input :columns="columns" :value="'注塑二线'" disabled />
<m-picker-input v-model:value="value" :columns="columns" :clearable="false" />
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column data (1D / 2D) | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | Selected value (`v-model:value`) | string \| number \| (string \| number)[] \| null | `null` |
| placeholder | Placeholder | string | `请选择` |
| disabled | Whether disabled | boolean | `false` |
| clearable | Whether to show the clear button | boolean | `true` |
| border | Whether the trigger shows a border container | boolean | `true` |
| inlaid | Inlaid trigger form | boolean | `false` |
| title | Popup toolbar title | string | `请选择` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| option-height | Option row height in px | number | `0` (44) |
| visible-option-num | Visible option count | number | `0` (6) |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| position | Popup position | DatePickerPosition | `bottom` |
| round | Popup round corners | boolean | `true` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Written back after confirm (`null` on clear) | value |
| confirm | Fires after the popup confirms | value, selectedOptions: PickerOption[], indexes: number[] |
| clear | Fires when the clear button is clicked | - |

## Theming

Input appearance is controlled by [Input](/en/components/input) theme variables; clear-button variables:

| Variable | Description | Default |
| --- | --- | --- |
| $m-picker-input-trigger-z-index | Transparent trigger layer level | 1 |
| $m-picker-input-clear-z-index | Clear button level | 2 |
| $m-picker-input-clear-width | Clear button hit area width | 40px |
| $m-picker-input-clear-icon-size | Clear icon size | 16px |
| $m-picker-input-clear-color | Clear icon color | #c8c9cc |
