---
title: DateRangePicker
subtitle: DateRangePicker
demo: pages-sub/date-range-picker/date-range-picker
added: 0.6.0
---

## Introduction

Date range panel: two tabs (start / end) share one date wheel, each editing one end of the range, and the two ends are swapped into ascending order on confirm.

This is a pure inline panel: the popup form is composed by [DateRangePickerPopup](/en/components/date-range-picker-popup) and the form-trigger form by [DateRangePickerInput](/en/components/date-range-picker-input). The wheel reuses [DatePicker](/en/components/date-picker).

## Usage

### Basic {#demo-basic}

`v-model:value` binds the two ends (`Date[]`, length 0-2). Switch tabs to edit different ends; on confirm the range is swapped into ascending order if the start is later than the end.

```vue
<m-date-range-picker v-model:value="value" @change="onChange" @confirm="onConfirm" />
```

```ts
const value = ref<Date[] | null>(null)
```

### Custom tabs {#demo-tabs}

```vue
<m-date-range-picker v-model:value="value" :tabs="['Check-in', 'Check-out']" />
```

### Columns and range {#demo-columns}

```vue
<m-date-range-picker
	v-model:value="value"
	:columns-type="['year', 'month']"
	:min-date="minDate"
	:max-date="maxDate"
	:tabs="['Start month', 'End month']"
/>
```

### Slots {#demo-slots}

- `header`: shortcut area above the tabs
- `title`: replaces both tabs (scoped: `tabs`, `activeIndex`)
- `footer`: replaces the whole footer
- `confirm` / `cancel`: footer button content

```vue
<m-date-range-picker v-model:value="value">
	<template #header>
		<view><text @click="setLastWeek">Last week</text></view>
	</template>
	<template #confirm>
		<text>Done</text>
	</template>
</m-date-range-picker>
```

### Readonly and loading {#demo-states}

```vue
<m-date-range-picker readonly />
<m-date-range-picker :loading="loading" />
```

### Instance methods {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedValue')
picker.value?.$callMethod('confirm')
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Two ends (`v-model:value`, length 0-2) | Date[] \| null | `null` |
| tabs | Two tab titles | string[] \| null | `['开始日期', '结束日期']` |
| columns-type | Column types | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | Minimum selectable date | Date \| null | `null` (10 years ago) |
| max-date | Maximum selectable date | Date \| null | `null` (10 years later) |
| filter | Option filter function | DatePickerFilter \| null | `null` |
| formatter | Option formatter function | DatePickerFormatter \| null | `null` |
| option-height | Option row height in px (`0` uses 44) | number | `0` |
| visible-option-num | Visible option count (`0` uses 6) | number | `0` |
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
| update:value | Writes back the two ends after confirm (ascending; `null` when empty) | value: Date[] \| null |
| change | Fires after the active end switches | value: Date[], activeIndex: number |
| confirm | Fires when the confirm button is clicked | value: Date[] |
| cancel | Fires when the cancel button is clicked | - |

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
| $m-date-range-picker-background | Panel background | #ffffff |
| $m-date-range-picker-tabs-height | Tabs height | 44px |
| $m-date-range-picker-tab-font-size | Tab font size | 14px |
| $m-date-range-picker-tab-color | Inactive tab color | #646566 |
| $m-date-range-picker-tab-active-color | Active tab and underline color | #1989fa |
| $m-date-range-picker-tab-line-width | Active underline width | 40px |
| $m-date-range-picker-footer-height | Footer height | 48px |
| $m-date-range-picker-footer-border-color | Footer divider color | #ebedf0 |
| $m-date-range-picker-action-font-size | Footer button font size | 14px |
| $m-date-range-picker-cancel-color | Cancel text color | #646566 |
| $m-date-range-picker-confirm-color | Confirm text color | #1989fa |

See [DatePicker theming](/en/components/date-picker#theming) for the wheel area.

## Differences from Sard

- Component split: Sard ships panel / Popout / Input; this project provides `m-date-range-picker` / `m-date-range-picker-popup` / `m-date-range-picker-input` (popup naming follows the project)
- Granularity: year / month / day only (no hour / minute / second); columns are configured by `columns-type` instead of Sard's `type` letter string
- Value: `Date[]` (length 0-2); no `value-format` string output
- Out-of-range handling: the range is swapped into ascending order on confirm
- Lunar calendar (`calendar`) is not implemented
