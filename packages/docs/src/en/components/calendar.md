---
title: Calendar
subtitle: Calendar
demo: pages-sub/calendar/calendar
---

## Introduction

Calendar panel component supporting single, multiple and range selection types, with year-month navigation, day formatting, month watermark and over-range prompting.

This is a pure inline panel: the popup form is composed by [CalendarPopup](/en/components/calendar-popup) and the form-trigger form by [CalendarInput](/en/components/calendar-input). Over-range prompts reuse [Toast](/en/components/toast).

## Usage

### Basic {#demo-basic}

Rendered inline (defaults to 6 months from today), pick-and-done: clicking a day triggers `select` and syncs `v-model:value` (no confirm button by default, matching the pure-panel semantics; with `show-confirm` enabled a confirm button is rendered at the bottom, and when disabled `confirm` fires automatically once the selection is complete — the popup form enables it by default via m-calendar-popup).

```vue
<m-calendar v-model:value="selected" @select="onSelect" />
```

### Multiple and over-range {#demo-multiple}

Set `type` to `multiple` to toggle selection (canceling fires `unselect` before `select`); `max-range` limits the maximum selectable days (applies to both range and multiple), rejecting the current pick and triggering `over-range` when exceeded. `show-range-prompt` controls whether a toast prompt is shown.

```vue
<m-calendar
	type="multiple"
	:max-range="3"
	range-prompt="Up to 3 days"
	@select="onSelect"
	@unselect="onUnselect"
	@over-range="onOverRange"
/>
```

### Range selection {#demo-range}

Set `type` to `range` and pick a start day then an end day; `allow-same-day` allows the same day as both ends; with `show-confirm` enabled the confirm button must be clicked to fire `confirm` (disabled by default, `confirm` fires automatically once the range is complete).

```vue
<m-calendar
	type="range"
	:show-confirm="false"
	:allow-same-day="true"
	@confirm="onConfirm"
/>
```

### Custom range and theme color {#demo-color}

`min-date` / `max-date` limit the selectable range (out-of-range days are disabled; clicking them triggers `click-disabled-date`); `default-date` pre-selects dates; `color` derives the selected block and the range bar color (supports `#hex` and gradients). Date props must be constructed with numeric values (`new Date(2026, 9, 10)`, months are 0-based).

```vue
<m-calendar
	type="range"
	:min-date="minDate"
	:max-date="maxDate"
	:default-date="[new Date(2026, 9, 15), new Date(2026, 9, 18)]"
	color="#07c160"
	@click-disabled-date="onDisabled"
/>
```

### Year-month navigation {#demo-switch-mode}

Set `switch-mode` to `month` for a single-month view with prev/next month navigation; `year-month` adds prev/next year buttons. Navigation is clamped within the selectable range; clicking the current month title triggers `click-subtitle`, and the panel month change triggers `panel-change`.

```vue
<m-calendar switch-mode="month" @panel-change="onPanelChange" />
<m-calendar switch-mode="year-month" @panel-change="onPanelChange" />
```

### Panel height {#demo-height}

By default the panel grows with its content (6 months from today). Pass a length value like px to `height` to fix the panel height with inner scrolling (best paired with `max-date`).

With a fixed height the subtitle follows scrolling in real time and switches to the month in the viewport (aligned with Vant); when the panel grows with content (page scrolling) the subtitle stays on the initial focus month.

Note: in uvue an outer `:style` binding is not forwarded to the component root (Vant is a standard Vue component and accepts outer height limits directly); use the `height` prop or `custom-style` instead.

```vue
<m-calendar height="400px" />
```

### Custom day text {#demo-formatter}

`formatter` applies after built-in markers and can override the text, top / bottom info, disabled state and custom class name; `row-height` adjusts day row height; `first-day-of-week` sets the week start day (0 Sunday - 6 Saturday).

```vue
<m-calendar
	:row-height="56"
	:first-day-of-week="1"
	:formatter="dayFormatter"
/>
```

```ts
const dayFormatter = (day: CalendarDayItem): CalendarDayItem => {
	if (day.type == 'placeholder') {
		return day
	}
	if (getDayDiff(day.date, new Date()) == 0) {
		day.bottomInfo = 'Today'
	}
	if (day.date.getFullYear() == 2026 && day.date.getMonth() == 9 && day.date.getDate() == 20) {
		day.topInfo = 'Full'
		day.type = 'disabled'
	}
	return day
}
```

### Slots {#demo-slots}

Supports `title` / `subtitle` / `month-title` / `text` / `top-info` / `bottom-info` / `footer` plus confirm text and nav icon slots; `text` is a scoped slot where `day` is the cell data. The in-month title row is rendered by default (aligned with Vant: the first month omits it since the subtitle already shows the month, the rest render it); pass the `month-title` slot to customize it.

```vue
<m-calendar :show-mark="false" :max-date="maxDate">
	<template #title>
		<text>Check-in date</text>
	</template>
	<template #subtitle>
		<text>Monthly deals</text>
	</template>
	<template #month-title="{ text }">
		<text>{{ text }}</text>
	</template>
	<template #text="{ day }">
		<text>{{ day.text }}</text>
	</template>
	<template #footer>
		<view><text>Custom footer</text></view>
	</template>
</m-calendar>
```

### Instance methods {#demo-methods}

```vue
const cal = ref<ComponentPublicInstance | null>(null)
cal.value?.$callMethod('scrollToDate', new Date(2026, 10, 15))
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Selection type, one of `single` `multiple` `range` | CalendarType | `single` |
| title | Regular title | string | `日期选择` |
| color | Theme color (derives the selected block and range bar; `#hex` and gradients supported) | string | - |
| min-date | Minimum date | Date \| null | `null` (today) |
| max-date | Maximum date | Date \| null | `null` (today + 6 months) |
| default-date | Pre-selected date(s), consumed per type semantics | Date \| Date[] \| null | `null` |
| row-height | Day row height in px (`0` uses the default variable) | number | `0` |
| formatter | Day formatter (applies last, can override built-in markers and text) | CalendarFormatter \| null | `null` |
| show-mark | Whether to show the month watermark | boolean | `true` |
| show-title | Whether to show the title | boolean | `true` |
| show-subtitle | Whether to show the subtitle | boolean | `true` |
| show-confirm | Whether to show the confirm button (auto-confirm when complete if `false`) | boolean | `false` |
| value | Selected value (`v-model:value`; single is `Date\|null`, range / multiple is `Date[]`; takes precedence over `default-date` as the initial value) | Date \| Date[] \| null | - |
| confirm-text | Confirm button text | string | `确认` |
| confirm-disabled-text | Confirm button text in disabled state (range incomplete) | string | `确认` |
| readonly | Read-only mode (ignores day clicks) | boolean | `false` |
| first-day-of-week | Week start day (0 Sunday - 6 Saturday) | number | `0` |
| switch-mode | Panel switching mode: `none` (scrolling list) / `month` (single month + month nav) / `year-month` (single month + year-month nav) | CalendarSwitchMode | `none` |
| height | Panel height (length units like px pass through; empty string grows with content) | string | - |
| max-range | Maximum selectable days for range / multiple (both ends counted; `-1` unlimited) | number | `-1` |
| range-prompt | Over-range prompt text (empty string uses the default "最多选择 N 天") | string | - |
| show-range-prompt | Whether to show a toast via m-toast when over-range | boolean | `true` |
| allow-same-day | Whether range selection allows the same start and end day | boolean | `false` |
| custom-class | Custom root class name | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| select | Fires on every day click (also after deselecting; value shape follows type) | value: Date \| Date[] |
| confirm | Fires after the confirm button is clicked / auto-confirm | value: Date \| Date[] |
| unselect | Fires when a multiple-selected day is deselected (before the same select) | date: Date |
| over-range | Fires when a pick is rejected due to max-range | - |
| month-show | Fires when the focused month enters the viewport (once on mount, argument is the 1st of the month; not re-triggered while scrolling) | date: Date |
| panel-change | Fires when the switch-mode panel month changes | date: Date |
| click-subtitle | Fires when the subtitle / nav row month title is clicked | - |
| click-disabled-date | Fires when a disabled day is clicked | date: Date |

### Methods

Call via a template ref (uvue components use `$callMethod`).

| Method | Description | Arguments |
| --- | --- | --- |
| reset | Clears the selection and returns to the focused month | - |
| resetSelection | Silently resets the selection to the value / default-date source (no update:value write-back, no scrolling) | - |
| scrollToDate | Scrolls to the month of the given date (instant, no animation) | date: Date |
| getSelectedDate | Reads the current selection (single value for single, array for multiple / range) | - |
| refreshView | Recalculates sizes and resets the focused month (called by the popup composite on reopen) | - |

### Slots

| Name | Description |
| --- | --- |
| title | Regular title |
| subtitle | Subtitle / nav row current month title (in none mode the subtitle follows inner scrolling and switches to the viewport month) |
| month-title | In-month title row (rendered by default, first month omits it since the subtitle shows the month; pass the slot to customize; scoped: `month` the first day of the month as Date, `text` the title text) |
| text | Day text (scoped: `day`) |
| top-info | Day top info (scoped: `day`) |
| bottom-info | Day bottom info (scoped: `day`) |
| footer | Bottom area (defaults to the confirm button) |
| confirm-text | Confirm button text |
| prev-year / prev-month / next-month / next-year | switch-mode nav icons |

## Theming

Calendar styles can be customized with the following SCSS variables (define them in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-calendar-background | Panel background | #ffffff |
| $m-calendar-header-title-height | Title area height | 44px |
| $m-calendar-header-title-font-size | Title font size | 16px |
| $m-calendar-header-title-color | Title color | #323233 |
| $m-calendar-header-box-shadow | Header shadow (aligned with Vant) | 0 2px 10px rgba(125, 126, 128, 0.16) |
| $m-calendar-header-subtitle-height | Subtitle area height | 44px |
| $m-calendar-header-subtitle-font-size | Subtitle font size | 14px |
| $m-calendar-header-subtitle-color | Subtitle color | #323233 |
| $m-calendar-weekdays-height | Weekday header height | 30px |
| $m-calendar-weekdays-font-size | Weekday header font size | 12px |
| $m-calendar-weekdays-color | Weekday header color | #323233 |
| $m-calendar-nav-icon-size | Nav icon size | 20px |
| $m-calendar-nav-icon-color | Nav icon color | #969799 |
| $m-calendar-month-title-height | In-month title row height (synced with the CALENDAR_MONTH_TITLE_HEIGHT constant in calendar.uts for month-height estimation) | 44px |
| $m-calendar-month-title-font-size | Month title font size | 14px |
| $m-calendar-month-mark-color | Month watermark color | rgba(242, 243, 245, 0.8) |
| $m-calendar-month-mark-font-size | Month watermark font size | 160px |
| $m-calendar-day-height | Day cell height | 64px |
| $m-calendar-day-font-size | Day cell font size | 16px |
| $m-calendar-day-margin-bottom | Day cell vertical gap | 0px |
| $m-calendar-day-disabled-color | Disabled day text color | #c8c9cc |
| $m-calendar-info-font-size | Day top/bottom info font size | 10px |
| $m-calendar-info-color | Day top/bottom info color | #969799 |
| $m-calendar-day-radius | Selected block corner radius (fully rounded on endpoints, layered above the range bar) | 4px |
| $m-calendar-selected-day-size | Selected block size | 54px |
| $m-calendar-selected-day-color | Selected day text color | #ffffff |
| $m-calendar-selected-day-background | Selected day background (primary) | #1989fa |
| $m-calendar-range-middle-background | Range middle background | rgba(25, 137, 250, 0.1) |
| $m-calendar-range-middle-color | Range middle text color | #1989fa |

See [Theming](/en/guide/theming) for the full variable list and override instructions.

## Differences from Vant

- Component split: Vant ships one component with dual forms (popup / inline via `poppable`); this project splits it into three — `m-calendar` (pure panel), `m-calendar-popup` (popup) and `m-calendar-input` (form input), each with a single responsibility
- `height` is an extension prop: the Vant inline panel grows with content; this project accepts length values like px to fix the panel height with inner scrolling (in popup scenarios `popup-height` of `m-calendar-popup` takes over)
- `max-range` extends to the multiple type: Vant only applies it to range; here both range and multiple are covered; over-range semantics are "reject the pick + over-range event + (optional) toast"
- `allow-same-day` is an extension prop: Vant range disallows the same start and end day; this project can enable it, with the bar split into halves on both ends
- Deselecting in multiple fires "unselect followed by select": `select` fires on every click (same as Vant), while `unselect` is an extension event distinguishing the cancel action
- The subtitle scroll switch is based on estimated month heights (rows × day height + gap); overriding the `$m-calendar-day-height` / `$m-calendar-day-margin-bottom` variables introduces month-granularity drift in switching timing; `scrollToDate` still jumps without animation (Vant scrolls smoothly)
- Date props only accept `Date` instances: `min-date` / `max-date` / `default-date` must be constructed numerically (`new Date(2026, 9, 29)`, months 0-based); Vant's string dates are not supported
- `formatter` only supports synchronous functions (UTS has no promise-based formatter)
- `min-date` / `max-date` default to "today ~ today + 6 months" (same as Vant)
- Weekday headers and month titles are built-in Chinese (`2026年10月` format) with no locale mechanism; the in-month title row is rendered by default and the first month omits it since the subtitle already shows the month (aligned with Vant), customizable via the `month-title` slot, weekdays have no slot yet
- With gradient or non-`#hex` `color` values, the selected block follows the gradient while the range bar falls back to the default theme color (derived alpha only supports `#hex`)
