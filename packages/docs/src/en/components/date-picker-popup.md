---
title: DatePickerPopup
subtitle: DatePickerPopup
demo: pages-sub/datetime/date-picker-popup/date-picker-popup
added: 0.6.0
---

## Introduction

Date picker popup composed of [Popup](/en/components/popup) and [DatePicker](/en/components/date-picker): popup behavior (visibility / position / round corners / safe area / overlay) belongs to `m-popup`, wheel selection belongs to `m-date-picker`, and this component only composes and forwards. It closes automatically after confirm or cancel.

## Usage

### Basic {#demo-basic}

`v-model:show` controls visibility; confirm / cancel close the popup automatically and write back `update:show`. Popup lifecycle events (`open` / `opened` / `close` / `closed`) and overlay clicks are forwarded as well.

```vue
<m-button @click="show = true">Open date picker</m-button>
<m-date-picker-popup
	v-model:show="show"
	title="Select date"
	@confirm="onConfirm"
	@cancel="onCancel"
/>
```

### Controlled value {#demo-controlled}

`v-model:value` is controlled: it is written back on confirm, and reopening follows the external value.

```vue
<m-date-picker-popup v-model:show="show" v-model:value="value" />
```

```ts
const value = ref<Date | null>(null)
```

### Columns and range {#demo-columns}

`columns-type` decides the columns and `min-date` / `max-date` limit the option range; all other selection props match `m-date-picker`.

```vue
<m-date-picker-popup
	v-model:show="show"
	:columns-type="['year', 'month']"
	:min-date="minDate"
	:max-date="maxDate"
	title="Select year-month"
/>
```

### Readonly and loading {#demo-states}

```vue
<m-date-picker-popup v-model:show="show" readonly loading />
```

### Slots {#demo-slots}

`toolbar` / `title` / `confirm` / `cancel` / `option` / `columns-top` / `columns-bottom` are forwarded to the inner `m-date-picker`; slots not passed keep their default rendering.

```vue
<m-date-picker-popup v-model:show="show">
	<template #title>
		<text>Select period</text>
	</template>
	<template #confirm>
		<text>Done</text>
	</template>
</m-date-picker-popup>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| columns-type | Column types | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | Minimum selectable date | Date \| null | `null` (10 years ago) |
| max-date | Maximum selectable date | Date \| null | `null` (10 years later) |
| value | Currently selected date (`v-model:value`) | Date \| null | `null` (today) |
| title | Toolbar title | string | `''` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| show-toolbar | Whether to show the toolbar | boolean | `true` |
| loading | Whether to show the loading state | boolean | `false` |
| readonly | Readonly | boolean | `false` |
| filter | Option filter function | DatePickerFilter \| null | `null` |
| formatter | Option formatter function | DatePickerFormatter \| null | `null` |
| option-height | Option row height in px (`0` uses default 44) | number | `0` |
| visible-option-num | Number of visible options (`0` uses default 6) | number | `0` |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| position | Popup position | DatePickerPosition | `bottom` |
| round | Whether to use round corners | boolean | `true` |
| close-on-click-overlay | Whether clicking the overlay closes the popup | boolean | `true` |
| reset-on-open | Reset the selection to value / today when opening | boolean | `false` |
| safe-area-inset-top | Top safe area | boolean | `false` |
| safe-area-inset-bottom | Bottom safe area | boolean | `true` |
| z-index | Stacking level | number | `1` |
| duration | Animation duration (seconds) | number | `0.3` |
| custom-class | Custom class of the panel root | string.ClassString | - |
| custom-style | Custom inline style of the panel root | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Visibility change (`false` after confirm / cancel / overlay close) | value: boolean |
| update:value | Writes back the selected date after confirm | date: Date |
| change | Wheel column switched | date: Date, columnIndex: number |
| confirm | Confirm button clicked (popup then closes) | date: Date |
| cancel | Cancel button clicked (popup then closes) | - |
| open / opened / close / closed | Popup lifecycle | - |
| click-overlay | Overlay clicked | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| toolbar | Replaces the whole toolbar |
| title | Toolbar title |
| confirm | Confirm button content |
| cancel | Cancel button content |
| option | Option content (scoped: `option`, `index`; Web only, falls back to built-in text on App / Mini Program) |
| columns-top | Content above the wheel area |
| columns-bottom | Content below the wheel area |

## Theming

Popup appearance (background, round corners, overlay) is controlled by [Popup](/en/components/popup) theme variables; see [DatePicker theming](/en/components/date-picker#theming) for the wheel area.

## Differences from Vant

- Component split: Vant requires composing `van-popup` + `van-date-picker` manually, while this project provides `m-date-picker-popup` with automatic close on confirm / cancel
- `v-model:show` controlled visibility is an extension here; Vant composition needs manual visibility state
- `reset-on-open` is an extension: by default the previous selection is kept, and enabling it resets to `value` / today
- Height is driven by the panel content (no `popup-height`); the picker panel height is fixed at toolbar + row height × visible rows
