---
title: DateStrip
subtitle: Date Strip
demo: pages-sub/date-strip/date-strip
added: 0.5.0
---

## Introduction

A horizontal date strip for selecting single dates, multiple dates, or a date range from a continuous sequence. Selection takes effect immediately — there is no confirm button. By default it shows the 7 days before through the 7 days after today, and supports formatted string values, lunar text, disabled / filtered dates, and custom slots.

All date computation is powered by the [date utilities](/en/tools/date): `addDays` for the default range, `eachDayOfInterval` for the sequence, `getDayStart` for normalized comparisons, `getDayDiff` for range length, `formatDate` / `parseDate` for `value-format`, and `solarToLunar` + `getLunarDateText` for lunar text.

## Demos

### Basic usage {#demo-basic}

Tap a date to select it; `v-model:value` is updated and `change` is emitted.

```vue
<m-date-strip v-model:value="value" @change="onChange" />
```

### Multiple and limit {#demo-multiple}

With `type="multiple"`, tapping toggles selection. `max-range` caps the number of selected days; exceeding it rejects the tap and emits `over-range` without changing the value.

```vue
<m-date-strip type="multiple" :max-range="3" @over-range="onOverRange" />
```

### Range selection {#demo-range}

With `type="range"`, the first tap sets the start and the second sets the end; the two are swapped automatically if the second is earlier. `allow-same-day` permits a single-day range, and endpoint labels are customizable.

```vue
<m-date-strip
	type="range"
	:allow-same-day="true"
	start-date-text="Check in"
	end-date-text="Check out"
	same-date-text="Same day"
/>
```

### Value format {#demo-value-format}

When `value-format` is set, `v-model` binds to strings (parsed with `parseDate`, formatted with `formatDate`; invalid strings are treated as unselected).

```vue
<m-date-strip v-model:value="dateText" value-format="YYYY-MM-DD" />
```

### Lunar text {#demo-lunar}

`show-lunar` renders lunar text below the day number (leap months are prefixed with 闰). Dates outside 1900-2100 are left blank.

```vue
<m-date-strip show-lunar />
```

### Filter and disabled dates {#demo-filter}

Dates for which `filter` returns `false` are not rendered; dates for which `disabled-date` returns `true` are greyed out and tapping them emits `click-disabled-date`.

```vue
<m-date-strip :filter="hideSunday" :disabled-date="disableTomorrow" />
```

### Slots {#demo-slots}

The `item` slot replaces the entire item content; `top-info` / `bottom-info` replace the extra lines above and below the day number.

```vue
<m-date-strip>
	<template #item="{ item }">
		<text>{{ item.text }}</text>
	</template>
</m-date-strip>
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| type | Selection type: `single` `multiple` `range` | CalendarType | `single` |
| value | Selected value (`v-model:value`) | Date \| Date[] \| string \| string[] \| null | `null` |
| value-format | Value format (e.g. `YYYY-MM-DD`); strings are bound when non-empty | string | - |
| min-date | Minimum selectable date | Date \| null | `null` (today - 7 days) |
| max-date | Maximum selectable date | Date \| null | `null` (today + 7 days) |
| current-date | Reference date for "today" | Date \| null | `null` (now) |
| disabled-date | Returns `true` to disable a date (still rendered) | (date: Date) => boolean | - |
| filter | Returns `false` to hide a date | (date: Date) => boolean | - |
| max-range | Maximum selectable days for range / multiple (inclusive; `-1` unlimited) | number | `-1` |
| allow-same-day | Whether a range may start and end on the same day | boolean | `false` |
| formatter | Item formatter (text / class / marker overrides) | CalendarFormatter | - |
| show-lunar | Show lunar text below the day number | boolean | `false` |
| start-date-text | Range start label | string | `开始` |
| end-date-text | Range end label | string | `结束` |
| same-date-text | Same-day range label | string | `开始/结束` |
| custom-class | Custom root class | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Selected value changed (`v-model:value`) | value: Date \| Date[] \| string \| string[] \| null |
| change | Value changed by user tap | same as above |
| over-range | Selection exceeds `max-range`; value unchanged | - |
| click-disabled-date | A disabled date was tapped | date: Date |

### Slots

| Name | Description | Arguments |
| --- | --- | --- |
| item | Fully customize item content | item: CalendarDayItem |
| top-info | Content above the day number | day: CalendarDayItem |
| bottom-info | Content below the day number | day: CalendarDayItem |

## Theming

| Variable | Default | Description |
| --- | --- | --- |
| `$m-date-strip-background` | `$m-white` | Strip background |
| `$m-date-strip-track-padding` | `4px` | Track vertical padding |
| `$m-date-strip-item-width` | `64px` | Item width |
| `$m-date-strip-item-padding-y` | `8px` | Item vertical padding |
| `$m-date-strip-item-border-radius` | `4px` | Item border radius |
| `$m-date-strip-item-bg-selected` | `$m-color-primary` | Selected / range edge background |
| `$m-date-strip-item-bg-middle` | `rgba($m-color-primary, 0.1)` | Range middle background |
| `$m-date-strip-item-week-font-size` | `12px` | Weekday font size |
| `$m-date-strip-item-week-color` | `$m-text-color-tertiary` | Weekday color |
| `$m-date-strip-item-day-font-size` | `16px` | Day number font size |
| `$m-date-strip-item-color` | `$m-text-color` | Day number color |
| `$m-date-strip-item-color-selected` | `$m-white` | Selected text color |
| `$m-date-strip-item-color-disabled` | `$m-text-color-fourth` | Disabled day color |
| `$m-date-strip-item-info-font-size` | `10px` | Lunar / info font size |
| `$m-date-strip-item-info-color` | `$m-text-color-tertiary` | Lunar / info color |

## Differences from Sard DateStrip

- Limit naming follows this library's m-calendar: `max-range` + `over-range` (Sard uses `max-days` + `over-max-days`), and no toast is shown.
- `formatter` reuses `CalendarDayItem` (`topInfo` / `bottomInfo` / `className`); inline `style` objects are not supported due to native platform limits.
- Date props use numeric construction (`new Date(2026, 10, 14)`, month starting at 0).
