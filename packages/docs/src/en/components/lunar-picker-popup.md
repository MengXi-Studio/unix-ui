---
title: LunarPickerPopup
subtitle: LunarPickerPopup
demo: pages-sub/lunar-picker-popup/lunar-picker-popup
added: 0.6.0
---

`Popup` + `LunarPicker` composition: a bottom sheet lunar wheel that closes automatically after confirm / cancel.

## Introduction

- Popup behavior (visibility / position / round / safe area / overlay) comes from `Popup`; lunar selection comes from `LunarPicker`.
- `v-model:show` controls visibility, `v-model:value` holds the selected Gregorian `Date`.
- With `reset-on-open`, every open resets the selection to `value` / today.

## Demo

```vue
<template>
  <m-button block @click="show = true">Open</m-button>
  <m-lunar-picker-popup v-model:show="show" v-model:value="value" title="Select lunar date" />
</template>

<script setup lang="uts">
  const show = ref<boolean>(false)
  const value = ref<Date>(new Date(2026, 5, 15))
</script>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show (v-model:show) | `boolean` | `false` |
| value | Selected date (Gregorian, v-model:value) | `Date \| null` | `null` |
| columns-type | Column combination | `LunarPickerColumnType[] \| null` | `null` |
| min-date | Minimum selectable date | `Date \| null` | Lunar table start |
| max-date | Maximum selectable date | `Date \| null` | Lunar table end |
| show-gan-zhi | Append GanZhi to year column | `boolean` | `false` |
| show-zodiac | Append zodiac to year column | `boolean` | `false` |
| title | Toolbar title | `string` | `''` |
| confirm-button-text | Confirm button text | `string` | `Confirm` |
| cancel-button-text | Cancel button text | `string` | `Cancel` |
| show-toolbar | Whether to show the toolbar | `boolean` | `true` |
| loading | Loading state | `boolean` | `false` |
| readonly | Read-only | `boolean` | `false` |
| filter | Option filter | `LunarPickerFilter \| null` | `null` |
| formatter | Option formatter | `LunarPickerFormatter \| null` | `null` |
| option-height | Option row height in px | `number` | `0` |
| visible-option-num | Visible option count | `number` | `0` |
| swipe-duration | Scroll stop threshold in ms | `number` | `200` |
| position | Popup position | `DatePickerPosition` | `bottom` |
| round | Round corners | `boolean` | `true` |
| close-on-click-overlay | Close on overlay click | `boolean` | `true` |
| reset-on-open | Reset selection on open | `boolean` | `false` |
| safe-area-inset-top | Top safe area | `boolean` | `false` |
| safe-area-inset-bottom | Bottom safe area | `boolean` | `true` |
| z-index | z-index | `number` | `1` |
| duration | Animation duration in seconds | `number` | `0.3` |
| custom-class | Custom panel class | `string` | `''` |
| custom-style | Custom panel inline style | `string` | `''` |

### Events

`update:show` / `update:value` / `change` / `confirm` / `cancel` / `open` / `opened` / `close` / `closed` / `click-overlay`.

### Slots

Same as `LunarPicker`: `toolbar` / `title` / `confirm` / `cancel` / `option` / `columns-top` / `columns-bottom`.

## Theming

Customize via `$m-popup-*` and `$m-picker-*`; option text uses `$m-date-picker-option-*`.

## Next Steps

- [LunarPicker](/en/components/lunar-picker)
- [LunarPickerInput](/en/components/lunar-picker-input)
- [Popup](/en/components/popup)
