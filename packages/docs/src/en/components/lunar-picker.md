# LunarPicker

A wheel picker for the Chinese lunar calendar (year / month including leap month / day). The external value is still a Gregorian `Date`; the lunar calendar only affects the columns and display text, so it can be swapped with `DatePicker` or mixed in the same form.

## Introduction

- Columns are derived from the lunar utilities in `utils/date`: the month column follows the real lunar month sequence (a leap month follows its month and reads like "Leap 2nd Month"), and the day column has 29 or 30 entries based on the lunar month length.
- The year column can append the sexagenary cycle (GanZhi) and zodiac; `min-date` / `max-date` are Gregorian dates and the column boundaries are mapped back to lunar.
- The panel visuals (toolbar / selection frame / wheels / loading overlay) are provided by the inner `Picker`; this component only builds columns and maps values.

## Demos

### Basic usage {#demo-basic}

```vue
<template>
  <m-lunar-picker v-model:value="value" title="Select lunar date" @confirm="onConfirm" />
</template>

<script setup lang="uts">
  const value = ref<Date>(new Date(2026, 5, 15))
  const onConfirm = (date: Date) => {
    console.log('Gregorian date', date)
  }
</script>
```

### Leap month and month length {#demo-leap}

```vue
<template>
  <m-lunar-picker v-model:value="value" :min-date="minDate" :max-date="maxDate" />
</template>

<script setup lang="uts">
  // Leap 2nd month in 2023: 2023-03-22 to 2023-04-19
  const value = ref<Date>(new Date(2023, 2, 22))
  const minDate = new Date(2023, 2, 1)
  const maxDate = new Date(2023, 3, 30)
</script>
```

### GanZhi and zodiac {#demo-ganzhi}

```vue
<template>
  <m-lunar-picker v-model:value="value" show-gan-zhi show-zodiac />
</template>
```

### Column combination {#demo-columns}

```vue
<template>
  <m-lunar-picker v-model:value="value" :columns-type="columnsType" />
</template>

<script setup lang="uts">
  import { LunarPickerColumnType } from '@/uni_modules/m-ui-x/components/m-lunar-picker/lunar-picker.uts'

  const value = ref<Date>(new Date(2026, 5, 1))
  const columnsType: LunarPickerColumnType[] = ['year', 'month']
</script>
```

### Instance methods {#demo-methods}

```vue
<template>
  <m-lunar-picker ref="picker" v-model:value="value" />
</template>

<script setup lang="uts">
  const picker = ref<ComponentPublicInstance | null>(null)
  const reset = () => {
    picker.value?.$callMethod('resetSelection')
  }
</script>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected date (Gregorian, v-model:value) | `Date \| null` | `null` |
| columns-type | Column combination (year / month / day in any order) | `LunarPickerColumnType[] \| null` | `null` |
| min-date | Minimum selectable Gregorian date | `Date \| null` | 1900-01-31 |
| max-date | Maximum selectable Gregorian date | `Date \| null` | 2100-12-31 |
| show-gan-zhi | Append GanZhi to year column | `boolean` | `false` |
| show-zodiac | Append zodiac to year column | `boolean` | `false` |
| title | Toolbar title | `string` | `''` |
| confirm-button-text | Confirm button text | `string` | `Confirm` |
| cancel-button-text | Cancel button text | `string` | `Cancel` |
| show-toolbar | Whether to show the toolbar | `boolean` | `true` |
| loading | Whether to show loading state | `boolean` | `false` |
| readonly | Read-only (wheels snap back) | `boolean` | `false` |
| filter | Option filter | `LunarPickerFilter \| null` | `null` |
| formatter | Option formatter | `LunarPickerFormatter \| null` | `null` |
| option-height | Option row height in px (0 uses 44) | `number` | `0` |
| visible-option-num | Visible option count (0 uses 6) | `number` | `0` |
| swipe-duration | Scroll stop threshold in ms | `number` | `200` |
| custom-class | Custom root class | `string` | `''` |
| custom-style | Custom root inline style | `string` | `''` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Emitted after confirm | `date: Date` |
| change | Emitted when a wheel column changes | `date: Date, columnIndex: number` |
| confirm | Confirm button clicked | `date: Date` |
| cancel | Cancel button clicked | — |

### Methods

| Name | Description | Return |
| --- | --- | --- |
| confirm() | Confirm programmatically | — |
| resetSelection() | Reset to value / today | — |
| getSelectedDate() | Get the selected Gregorian date | `Date` |
| getSelectedLunarText() | Get the lunar display text | `string` |

### Slots

`toolbar` / `title` / `confirm` / `cancel` / `option` / `columns-top` / `columns-bottom`, forwarded to the inner `Picker`.

## Theming

The panel container, toolbar, selection frame and loading overlay are provided by the inner `Picker`; customize them via `$m-picker-*`. Option text uses `$m-date-picker-option-font-size` / `-color` / `-selected-color`, shared with the Gregorian picker column.

## Next Steps

- [DatePicker](/en/components/date-picker)
- [LunarPickerPopup](/en/components/lunar-picker-popup)
- [LunarPickerInput](/en/components/lunar-picker-input)
- [Date utilities](/en/tools/date)
