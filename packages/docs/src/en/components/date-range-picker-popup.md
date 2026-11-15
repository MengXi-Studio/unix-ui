---
title: DateRangePickerPopup
subtitle: DateRangePickerPopup
demo: pages-sub/date-range-picker-popup/date-range-picker-popup
added: 0.6.0
---

## Introduction

Date range popup composed of [Popup](/en/components/popup) and [DateRangePicker](/en/components/date-range-picker): popup behavior belongs to `m-popup`, the two tabs and two ends belong to the panel, and this component only composes and forwards. It closes automatically after confirm or cancel.

## Usage

### Basic {#demo-basic}

```vue
<m-button @click="show = true">Open date range</m-button>
<m-date-range-picker-popup v-model:show="show" @confirm="onConfirm" @cancel="onCancel" />
```

```ts
const show = ref(false)
```

### Controlled value {#demo-controlled}

```vue
<m-date-range-picker-popup v-model:show="show" v-model:value="value" />
```

```ts
const value = ref<Date[] | null>(null)
```

### Columns and tabs {#demo-columns}

```vue
<m-date-range-picker-popup
	v-model:show="show"
	:columns-type="['year', 'month']"
	:tabs="['Start month', 'End month']"
	:min-date="minDate"
	:max-date="maxDate"
/>
```

### Slots {#demo-slots}

`header` / `title` / `footer` / `confirm` / `cancel` are forwarded to the inner panel; slots not passed keep their default rendering.

```vue
<m-date-range-picker-popup v-model:show="show">
	<template #header>
		<view><text @click="setLastWeek">Last week</text></view>
	</template>
	<template #confirm>
		<text>Done</text>
	</template>
</m-date-range-picker-popup>
```

### Readonly and loading {#demo-states}

```vue
<m-date-range-picker-popup v-model:show="show" readonly loading />
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| value | Two ends (`v-model:value`) | Date[] \| null | `null` |
| tabs | Two tab titles | string[] \| null | `['开始日期', '结束日期']` |
| columns-type | Column types | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | Minimum selectable date | Date \| null | `null` (10 years ago) |
| max-date | Maximum selectable date | Date \| null | `null` (10 years later) |
| filter | Option filter function | DatePickerFilter \| null | `null` |
| formatter | Option formatter function | DatePickerFormatter \| null | `null` |
| option-height | Option row height in px | number | `0` (44) |
| visible-option-num | Visible option count | number | `0` (6) |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| readonly | Readonly | boolean | `false` |
| loading | Whether to show the loading state | boolean | `false` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| position | Popup position | DatePickerPosition | `bottom` |
| round | Whether to use round corners | boolean | `true` |
| close-on-click-overlay | Whether clicking the overlay closes the popup | boolean | `true` |
| reset-on-open | Reset to value when opening | boolean | `false` |
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
| update:value | Writes back the two ends after confirm | value: Date[] \| null |
| change | Active end switched | value: Date[], activeIndex: number |
| confirm | Confirm clicked (popup then closes) | value: Date[] |
| cancel | Cancel clicked (popup then closes) | - |
| open / opened / close / closed | Popup lifecycle | - |
| click-overlay | Overlay clicked | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| header | Content above the tabs (shortcuts) |
| title | Replaces both tabs (scoped: `tabs`, `activeIndex`) |
| footer | Replaces the whole footer |
| confirm | Confirm button content |
| cancel | Cancel button content |

## Theming

Popup appearance is controlled by [Popup](/en/components/popup) theme variables; see [DateRangePicker theming](/en/components/date-range-picker#theming) for the panel.

## Differences from Sard

- Sard uses `DatetimeRangePickerPopout` + `v-model:visible`; this project uses `m-date-range-picker-popup` + `v-model:show`
- Built-in auto close on confirm / cancel; Sard composes this through `FormPopout`
- Height is driven by the panel content (tabs + wheel + footer); no `popup-height`
