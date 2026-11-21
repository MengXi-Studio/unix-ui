---
title: DatePicker
subtitle: DatePicker
demo: pages-sub/datetime/date-picker/date-picker
added: 0.6.0
---

## Introduction

Date picker panel that selects year, month and day through wheel columns, supporting arbitrary column combinations, selectable range limits, option filtering and formatting, a customizable toolbar, plus readonly and loading states.

This is a pure inline panel: the popup form is composed by [DatePickerPopup](/en/components/date-picker-popup) and the form-trigger form by [DatePickerInput](/en/components/date-picker-input).

## Usage

### Basic {#demo-basic}

`v-model:value` binds the selected date; `min-date` / `max-date` limit the selectable range (defaults to 10 years before and after today). Once the wheel stops it snaps to the nearest option and fires `change`; clicking confirm writes back `v-model:value` and fires `confirm`.

```vue
<m-date-picker v-model:value="currentDate" title="Select date" @confirm="onConfirm" />
```

```ts
const currentDate = ref<Date | null>(null)
```

### Column types {#demo-columns}

`columns-type` controls the columns and accepts any order of `year`, `month` and `day`:

- `['year']` year only
- `['month']` month only
- `['year', 'month']` year and month (day normalizes to the 1st)
- `['month', 'day']` month and day (keeps the current year)

```vue
<m-date-picker :columns-type="['year', 'month']" title="Select year-month" />
<m-date-picker :columns-type="['month', 'day']" title="Select month-day" />
```

### Selectable range {#demo-range}

`min-date` / `max-date` limit the year bounds and narrow the month / day ranges based on the selected year and month; out-of-range picks are clamped automatically. Always build dates numerically (`new Date(2026, 2, 10)`, month is 0-based).

```vue
<m-date-picker :min-date="minDate" :max-date="maxDate" title="Limited range" />
```

### Filter options {#demo-filter}

`filter(type, options, values)` filters the column options, where `values` are the selected values of preceding columns; return a new array instead of mutating the input.

```ts
const halfYearFilter = (type: string, options: DatePickerOption[], values: string[]): DatePickerOption[] => {
	if (type != 'month') {
		return options
	}
	const result: DatePickerOption[] = []
	for (let i = 0; i < options.length; i++) {
		if (options[i].value == '06' || options[i].value == '12') {
			result.push(options[i])
		}
	}
	return result
}
```

```vue
<m-date-picker :columns-type="['year', 'month']" :filter="halfYearFilter" />
```

### Format options {#demo-formatter}

`formatter(type, option)` rewrites the option text and returns the same option object.

```ts
const suffixFormatter = (type: string, option: DatePickerOption): DatePickerOption => {
	if (type == 'year') {
		option.text = option.text + 'Y'
	} else if (type == 'month') {
		option.text = option.text + 'M'
	} else {
		option.text = option.text + 'D'
	}
	return option
}
```

```vue
<m-date-picker :formatter="suffixFormatter" />
```

### Toolbar and layout {#demo-toolbar}

`show-toolbar` toggles the toolbar; `option-height` / `visible-option-num` adjust row height and visible rows; `columns-top` / `columns-bottom` slots sit above and below the wheel area.

```vue
<m-date-picker :show-toolbar="false" :visible-option-num="5" :option-height="48">
	<template #columns-top>
		<view><text>Custom top content</text></view>
	</template>
	<template #columns-bottom>
		<view><text>Custom bottom content</text></view>
	</template>
</m-date-picker>
```

### Slots {#demo-slots}

Supports `toolbar` (replaces the whole toolbar), `title` / `confirm` / `cancel` (partial replacement), `option` (Web only; scoped: `option`, `index`) and `columns-top` / `columns-bottom`.

```vue
<m-date-picker :columns-type="['year', 'month']">
	<template #title>
		<text>Select period</text>
	</template>
	<template #confirm>
		<text>Done</text>
	</template>
	<template #option="{ option }">
		<text>{{ option.text }}</text>
	</template>
</m-date-picker>
```

> **Note**: The `option` slot works on Web only. On App the slot scope index is typed `Any?`, which cannot be passed as a `number` parameter and fails Kotlin compilation; on Mini Program a repeated slot name inside `v-for` only renders the first one and emits duplicate-slot warnings. Both platforms fall back to the built-in text — use `formatter` to change option text instead.

### Readonly and loading {#demo-states}

With `readonly`, scrolling bounces back to the current value and never switches; `loading` covers the wheel area and blocks interaction.

```vue
<m-date-picker readonly />
<m-date-picker :loading="loading" />
```

### Instance methods {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedDate')
picker.value?.$callMethod('confirm')
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| columns-type | Column types, any order of `year` / `month` / `day` | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | Minimum selectable date | Date \| null | `null` (10 years ago) |
| max-date | Maximum selectable date | Date \| null | `null` (10 years later) |
| value | Currently selected date (`v-model:value`) | Date \| null | `null` (today) |
| title | Toolbar title | string | `''` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| show-toolbar | Whether to show the toolbar | boolean | `true` |
| loading | Whether to show the loading state | boolean | `false` |
| readonly | Readonly (wheel bounces back, no switching) | boolean | `false` |
| filter | Option filter function | DatePickerFilter \| null | `null` |
| formatter | Option formatter function | DatePickerFormatter \| null | `null` |
| option-height | Option row height in px (`0` uses default 44) | number | `0` |
| visible-option-num | Number of visible options (`0` uses default 6) | number | `0` |
| swipe-duration | Scroll-stop detection window in ms (snap delay) | number | `200` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Writes back the selected date after confirm (`v-model:value`) | date: Date |
| change | Fires after a wheel column switches | date: Date, columnIndex: number |
| confirm | Fires when the confirm button is clicked | date: Date |
| cancel | Fires when the cancel button is clicked | - |

### Methods

Call through a template ref (uvue components are invoked via `$callMethod`).

| Method | Description | Arguments |
| --- | --- | --- |
| confirm | Programmatic confirm (same as clicking confirm) | - |
| resetSelection | Resets the selection to value (`null` means today) | - |
| reposition | Re-aligns the wheels to the current value (called by the popup on `open`, once layout is ready) | - |
| getSelectedDate | Returns the currently selected date | - |

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

Customize the date picker via the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-date-picker-option-font-size | Option font size | 16px |
| $m-date-picker-option-color | Option color | #323233 |
| $m-date-picker-option-selected-color | Selected option color | #323233 |

> The panel container, toolbar, selection frame and loading overlay are provided by the inner `m-picker`; customize them via the `$m-picker-*` variables (e.g. `$m-picker-toolbar-height`, `$m-picker-frame-color`).

See [Theming](/en/guide/theming) for the full variable list and override rules.

## Differences from Vant

- Component split: Vant ships one component (`van-date-picker`), while this project provides three — `m-date-picker` panel, `m-date-picker-popup` popup and `m-date-picker-input` form input
- `value` (`v-model:value`) binds a `Date` instead of Vant's `string[]`; build dates numerically (`new Date(2026, 10, 15)`), consistent with the calendar trio
- `option-height` only accepts a number in px (no string units) so wheel snapping math stays exact
- `swipe-duration` semantics differ: built on the native `scroll-view`, it is the scroll-stop detection window (snap delay), not Vant's inertia duration
- No gradient mask overlay: uvue has no `pointer-events`, so an overlay would block wheel gestures; distant options fade out via opacity instead
- The `option` slot works on Web only (not rendered on App / Mini Program); use `formatter` instead
- `getSelectedDate` returns a `Date` instead of Vant's `string[]`; `change` arguments are `(date, columnIndex)` instead of `{ selectedValues, selectedOptions, selectedIndexes, columnIndex }`
- `filter` / `formatter` are synchronous only (UTS has no Promise-based form)
