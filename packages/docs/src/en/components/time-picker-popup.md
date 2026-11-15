---
title: TimePickerPopup
subtitle: TimePickerPopup
demo: pages-sub/time-picker-popup/time-picker-popup
added: 0.6.0
---

## Introduction

Time picker popup composed of [Popup](/en/components/popup) and [TimePicker](/en/components/time-picker). It closes automatically after confirm or cancel.

## Usage

### Basic {#demo-basic}

```vue
<m-button @click="show = true">Open time picker</m-button>
<m-time-picker-popup v-model:show="show" @confirm="onConfirm" @cancel="onCancel" />
```

```ts
const show = ref(false)
```

### Controlled value {#demo-controlled}

```vue
<m-time-picker-popup v-model:show="show" v-model:value="value" :columns-type="['hour', 'minute', 'second']" />
```

```ts
const value = ref<string | null>('09:30')
```

### Steps, range and 12-hour cycle {#demo-columns}

```vue
<m-time-picker-popup v-model:show="show" :minute-step="15" min-time="09:00" max-time="18:00" />
<m-time-picker-popup v-model:show="show2" :hour-cycle="12" />
```

### Slots {#demo-slots}

```vue
<m-time-picker-popup v-model:show="show">
	<template #confirm>
		<text>Done</text>
	</template>
</m-time-picker-popup>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| value | Time string (`v-model:value`) | string \| null | `null` |
| columns-type | Column types | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| min-time | Minimum time | string \| null | `null` |
| max-time | Maximum time | string \| null | `null` |
| minute-step | Minute step | number | `1` |
| second-step | Second step | number | `1` |
| hour-cycle | Hour cycle (24 / 12) | number | `24` |
| title | Toolbar title | string | `选择时间` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| show-toolbar | Whether to show the toolbar | boolean | `true` |
| loading | Whether to show the loading state | boolean | `false` |
| readonly | Readonly | boolean | `false` |
| filter | Option filter | TimePickerFilter \| null | `null` |
| formatter | Option formatter | TimePickerFormatter \| null | `null` |
| option-height | Option row height in px | number | `0` (44) |
| visible-option-num | Visible option count | number | `0` (6) |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
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
| update:show | Visibility change | value: boolean |
| update:value | Writes back the time string after confirm | value: string |
| change | Wheel column changed | value: string, columnIndex: number |
| confirm | Confirm clicked (popup then closes) | value: string |
| cancel | Cancel clicked (popup then closes) | - |
| open / opened / close / closed | Popup lifecycle | - |
| click-overlay | Overlay clicked | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| toolbar | Replaces the whole toolbar |
| title | Title content |
| confirm | Confirm button content |
| cancel | Cancel button content |
| option | Option content (scoped: `option`, `index`) |

## Theming

Popup appearance is controlled by [Popup](/en/components/popup) theme variables; see [TimePicker theming](/en/components/time-picker#theming) for the panel.
