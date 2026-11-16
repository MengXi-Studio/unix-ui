---
title: PickerPopup
subtitle: PickerPopup
demo: pages-sub/picker-popup/picker-popup
added: 0.6.0
---

## Introduction

Picker popup composed of [Popup](/en/components/popup) and [Picker](/en/components/picker). It closes automatically after confirm or cancel.

## Usage

### Basic {#demo-basic}

```vue
<m-button @click="show = true">Open picker</m-button>
<m-picker-popup v-model:show="show" :columns="columns" title="Select line" @confirm="onConfirm" />
```

```ts
const show = ref(false)
```

### Controlled value {#demo-controlled}

```vue
<m-picker-popup v-model:show="show" v-model:value="value" :columns="columns" />
```

### Multiple columns and cascade {#demo-columns}

```vue
<m-picker-popup v-model:show="show" v-model:value="value" :columns="yearMonthDay" title="Date" />
<m-picker-popup v-model:show="show2" v-model:value="value2" :columns="regionTree" title="Region" />
```

### Slots {#demo-slots}

```vue
<m-picker-popup v-model:show="show" :columns="columns" title="Lines">
	<template #columns-top>
		<view><text>Swipe to select</text></view>
	</template>
	<template #confirm>
		<text>Done</text>
	</template>
</m-picker-popup>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| columns | Column data (1D / 2D) | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | Selected value (`v-model:value`) | string \| number \| (string \| number)[] \| null | `null` |
| title | Toolbar title | string | `请选择` |
| confirm-button-text | Confirm button text | string | `确认` |
| cancel-button-text | Cancel button text | string | `取消` |
| show-toolbar | Whether to show the toolbar | boolean | `true` |
| loading | Whether to show the loading state | boolean | `false` |
| readonly | Readonly | boolean | `false` |
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
| update:value | Selected value written back | value |
| change | Wheel column changed | value, selectedOptions: PickerOption[], indexes: number[] |
| confirm | Confirm clicked (popup then closes) | value, selectedOptions, indexes |
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
| columns-top | Content above the wheels |
| columns-bottom | Content below the wheels |
| option | Option content (scoped: `option`, `index`, `rowIndex`, `columnIndex`; Web only, falls back to built-in text on App / Mini Program) |

## Theming

Popup appearance is controlled by [Popup](/en/components/popup) theme variables; see [Picker theming](/en/components/picker#theming) for the panel.
