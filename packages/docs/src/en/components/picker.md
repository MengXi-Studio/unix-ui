---
title: Picker
subtitle: Picker
demo: pages-sub/picker/picker
added: 0.6.0
---

## Introduction

General-purpose wheel picker panel: automatically detects one-dimensional / two-dimensional column data, supports `children` cascade, disabled options and custom option content.

This is a pure inline panel: the popup form is composed by [PickerPopup](/en/components/picker-popup) and the form-trigger form by [PickerInput](/en/components/picker-input); for an index-driven view without toolbar see [PickerView](/en/components/picker-view).

## Usage

### Basic {#demo-basic}

A one-dimensional `columns` renders as a single column; `v-model:value` is a scalar.

```vue
<m-picker v-model:value="value" :columns="columns" @change="onChange" @confirm="onConfirm" />
```

```ts
import { PickerOption } from '@meng-xi/unix-ui/components/m-picker/picker.uts'

const columns: PickerOption[] = [
	{ label: 'Line 1', value: 'line1' },
	{ label: 'Line 2', value: 'line2' }
]
const value = ref<string | number | null>(null)
```

### Multiple columns {#demo-multi}

```vue
<m-picker v-model:value="value" :columns="yearMonthDay" />
```

```ts
const yearMonthDay: PickerOption[][] = [
	[{ label: '2025', value: 2025 }, { label: '2026', value: 2026 }],
	[{ label: 'Jan', value: 1 }, { label: 'Feb', value: 2 }],
	[{ label: '1st', value: 1 }, { label: '15th', value: 15 }]
]
```

### Cascade {#demo-cascade}

Options with `children` switch to cascade mode: changing an upper column rebuilds the lower columns from the first item.

```vue
<m-picker v-model:value="value" :columns="regionTree" title="Region" />
```

### Disabled options {#demo-disabled}

```ts
const shiftOptions: PickerOption[] = [
	{ label: 'Day', value: 'day' },
	{ label: 'Mid (full)', value: 'mid', disabled: true },
	{ label: 'Night', value: 'night' }
]
```

### Slots {#demo-slots}

- `toolbar`: replaces the whole toolbar
- `title` / `confirm` / `cancel`: replaces the corresponding part
- `columns-top` / `columns-bottom`: custom areas above / below the wheels
- `option`: custom option content (scoped: `option`, `index`, `rowIndex`, `columnIndex`)

### Methods {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedValue')
picker.value?.$callMethod('getSelectedIndexes')
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column data (1D single / cascade, 2D multi) | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | Selected value (`v-model:value`) | string \| number \| (string \| number)[] \| null | `null` |
| title | Toolbar title | string | `请选择` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| show-toolbar | Whether to show the toolbar | boolean | `true` |
| loading | Whether to show the loading state | boolean | `false` |
| readonly | Readonly | boolean | `false` |
| option-height | Option row height in px (`0` uses 44) | number | `0` |
| visible-option-num | Visible option count (`0` uses 6) | number | `0` |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### PickerOption

| Field | Description | Type | Required |
| --- | --- | --- | --- |
| label | Display text | string | yes |
| value | Business value (type preserved on emit) | string \| number | yes |
| children | Cascade children | PickerOption[] | no |
| disabled | Whether disabled | boolean | no |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Selected value written back | value |
| change | Wheel column changed | value, selectedOptions: PickerOption[], indexes: number[] |
| confirm | Confirm clicked | value, selectedOptions, indexes |
| cancel | Cancel clicked | - |

### Methods

| Method | Description |
| --- | --- |
| confirm | Programmatic confirm |
| resetSelection | Resets to the external value |
| getSelectedValue | Returns the current value |
| getSelectedIndexes | Returns the selected indexes |

### Slots

| Name | Description |
| --- | --- |
| toolbar | Replaces the whole toolbar |
| title | Title content |
| confirm | Confirm button content |
| cancel | Cancel button content |
| columns-top | Content above the wheels |
| columns-bottom | Content below the wheels |
| option | Option content (scoped: `option`, `index`, `rowIndex`, `columnIndex`; Web only, falls back to built-in text on App / Mini Program) |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-picker-background | Panel background | #ffffff |
| $m-picker-toolbar-height | Toolbar height | 44px |
| $m-picker-action-padding | Toolbar button padding | 0 16px |
| $m-picker-action-font-size | Toolbar button font size | 14px |
| $m-picker-cancel-color | Cancel text color | #646566 |
| $m-picker-confirm-color | Confirm text color | #1989fa |
| $m-picker-title-font-size | Title font size | 16px |
| $m-picker-title-color | Title color | #323233 |
| $m-picker-frame-color | Selection frame line color | #ebedf0 |
| $m-picker-loading-background | Loading overlay background | rgba(255,255,255,0.9) |

Option text styles follow the date picker column variables (`$m-date-picker-option-*`).
