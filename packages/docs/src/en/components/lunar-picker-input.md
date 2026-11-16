---
title: LunarPickerInput
subtitle: LunarPickerInput
demo: pages-sub/lunar-picker-input/lunar-picker-input
added: 0.6.0
---

`Input` + `LunarPickerPopup` form composition: click the field to open the lunar sheet; after confirm the field shows the lunar text.

## Introduction

- The value is a Gregorian `Date` (`v-model:value`); the display text is derived from the column combination (e.g. `2026年六月十五`).
- Supports clearable, disabled, column combination, GanZhi year text and range limits.
- The sheet always resets to the current `value` on open (internally `reset-on-open`).

## Demos

### Basic usage {#demo-basic}

```vue
<template>
  <m-lunar-picker-input v-model:value="value" title="Select lunar date" />
</template>

<script setup lang="uts">
  const value = ref<Date | null>(null)
</script>
```

### Column combination {#demo-columns}

```vue
<template>
  <m-lunar-picker-input v-model:value="value" :columns-type="columnsType" placeholder="Select lunar year and month" />
</template>

<script setup lang="uts">
  import { LunarPickerColumnType } from '@/uni_modules/m-ui-x/components/m-lunar-picker/lunar-picker.uts'

  const value = ref<Date | null>(null)
  const columnsType: LunarPickerColumnType[] = ['year', 'month']
</script>
```

### GanZhi year text {#demo-ganzhi}

```vue
<template>
  <m-lunar-picker-input v-model:value="value" show-gan-zhi />
</template>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected date (Gregorian, v-model:value) | `Date \| null` | `null` |
| columns-type | Column combination | `LunarPickerColumnType[] \| null` | `null` |
| placeholder | Placeholder | `string` | `Select lunar date` |
| disabled | Whether to disable | `boolean` | `false` |
| clearable | Whether to show the clear button | `boolean` | `true` |
| border | Whether the trigger has a border container | `boolean` | `true` |
| inlaid | Inlaid trigger style | `boolean` | `false` |
| show-gan-zhi | Append GanZhi to year column | `boolean` | `false` |
| show-zodiac | Append zodiac to year column | `boolean` | `false` |
| title | Sheet toolbar title | `string` | `''` |
| confirm-button-text | Confirm button text | `string` | `Confirm` |
| cancel-button-text | Cancel button text | `string` | `Cancel` |
| min-date | Minimum selectable date | `Date \| null` | Lunar table start |
| max-date | Maximum selectable date | `Date \| null` | Lunar table end |
| filter | Option filter | `LunarPickerFilter \| null` | `null` |
| formatter | Option formatter | `LunarPickerFormatter \| null` | `null` |
| position | Popup position | `DatePickerPosition` | `bottom` |
| round | Round corners | `boolean` | `true` |
| custom-class | Custom root class | `string` | `''` |
| custom-style | Custom root inline style | `string` | `''` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Emitted after confirm (null after clear) | `date: Date \| null` |
| confirm | Emitted on sheet confirm | `date: Date` |
| clear | Clear button clicked | — |

## Theming

- The input itself is styled by `Input` via `$m-input-*`.
- Trigger layer and clear button: `$m-lunar-picker-input-trigger-z-index` / `-clear-z-index` / `-clear-width` / `-clear-icon-size` / `-clear-color`.
