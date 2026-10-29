---
title: Calendar
demo: pages-sub/calendar/calendar
---

## Introduction

A calendar component supporting three selection types — single, multiple and range — in popup or inline form, with year-month navigation, day formatting, month watermark and over-range prompts. The popup form is composed on top of [m-popup](/en/components/popup); the over-range prompt reuses [m-toast](/en/components/toast).

## Examples

### Basic Usage {#demo-basic}

Popup form by default (`poppable: true`); bind visibility with `v-model:show`. Tapping a date then the confirm button emits `confirm` and closes automatically.

```vue
<m-button block @click="show = true">Open Calendar</m-button>
<m-calendar v-model:show="show" @confirm="onConfirm" />
```

### Inline Panel {#demo-flat}

Set `poppable` to `false` to render inline (6 months starting from today by default), without popup or confirm button; tapping a day emits `select` directly.

```vue
<m-calendar :poppable="false" @select="onSelect" />
```

### Multiple Selection and Over-range {#demo-multiple}

Set `type` to `multiple` to toggle selection on tap (unselect emits `unselect` first, then `select`); `max-range` limits the number of selectable days (applies to both range and multiple). When exceeded, the tap is rejected and `over-range` is emitted; `show-range-prompt` controls the toast.

```vue
<m-calendar
	:poppable="false"
	type="multiple"
	:max-range="3"
	range-prompt="Select up to 3 days"
	@select="onSelect"
	@unselect="onUnselect"
	@over-range="onOverRange"
/>
```

### Range Selection {#demo-range}

Set `type` to `range` and tap a start day then an end day; `allow-same-day` allows the same day as both ends; with `show-confirm` set to `false`, `confirm` is emitted automatically once the range is complete.

```vue
<m-calendar
	:poppable="false"
	type="range"
	:show-confirm="false"
	:allow-same-day="true"
	@confirm="onConfirm"
/>
```

### Custom Range and Color {#demo-color}

`min-date` / `max-date` limit the selectable interval (out-of-range days are disabled, tapping emits `click-disabled-date`); `default-date` pre-selects dates; `color` derives the selected dot and range bar color (supports `#hex` and gradients). Date props must be constructed numerically (`new Date(2026, 9, 10)`, month is 0-based).

```vue
<m-calendar
	:poppable="false"
	type="range"
	:min-date="minDate"
	:max-date="maxDate"
	:default-date="[new Date(2026, 9, 15), new Date(2026, 9, 18)]"
	color="#07c160"
	@click-disabled-date="onDisabled"
/>
```

### Year-Month Navigation {#demo-switch-mode}

Set `switch-mode` to `month` for a single-month view with prev/next month buttons; set to `year-month` to add prev/next year buttons. Navigation is clamped to the selectable range; tapping the current month title emits `click-subtitle`, and the panel month change emits `panel-change`.

```vue
<m-calendar :poppable="false" switch-mode="month" @panel-change="onPanelChange" />
<m-calendar :poppable="false" switch-mode="year-month" @panel-change="onPanelChange" />
```

### Custom Day Text {#demo-formatter}

`formatter` is applied after built-in marks and can override text, top / bottom info, disabled state and custom class; `row-height` adjusts day cell height; `first-day-of-week` sets the week start (0 Sunday - 6 Saturday).

```vue
<m-calendar
	:poppable="false"
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
	return day
}
```

### Slots {#demo-slots}

Supports `title` / `subtitle` / `month-title` / `text` / `top-info` / `bottom-info` / `footer` plus confirm text and nav icon slots; `text` is a scoped slot with `day` as the cell data.

```vue
<m-calendar :poppable="false" :show-mark="false" :max-date="maxDate">
	<template #title>
		<text>Check-in Date</text>
	</template>
	<template #subtitle>
		<text>Special Offer</text>
	</template>
	<template #text="{ day }">
		<text>{{ day.text }}</text>
	</template>
	<template #footer>
		<view><text>Custom footer area</text></view>
	</template>
</m-calendar>
```

### Methods {#demo-methods}

```vue
const cal = ref<ComponentPublicInstance | null>(null)
cal.value?.$callMethod('scrollToDate', new Date(2026, 10, 15))
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model:show | Whether to show the popup (popup form only) | boolean | `false` |
| type | Selection type, one of `single` `multiple` `range` | CalendarType | `single` |
| poppable | Popup form (`false` for inline panel) | boolean | `true` |
| title | Regular title | string | `日期选择` |
| color | Theme color (derives selected dot and range bar, supports `#hex` and gradients) | string | - |
| min-date | Minimum date | Date \| null | `null` (today) |
| max-date | Maximum date | Date \| null | `null` (today + 6 months) |
| default-date | Default selected date(s), consumed by type semantics | Date \| Date[] \| null | `null` |
| row-height | Day cell height in px (`0` uses default variable) | number | `0` |
| formatter | Day formatter (applied last, can override built-in marks) | CalendarFormatter \| null | `null` |
| show-mark | Whether to show the month watermark | boolean | `true` |
| show-title | Whether to show the title | boolean | `true` |
| show-subtitle | Whether to show the subtitle | boolean | `true` |
| show-confirm | Whether to show the confirm button (`false` auto-confirms when complete) | boolean | `true` |
| confirm-text | Confirm button text | string | `确认` |
| confirm-disabled-text | Confirm button text when disabled (range incomplete) | string | `确认` |
| readonly | Read-only mode (day taps ignored) | boolean | `false` |
| first-day-of-week | Week start day (0 Sunday - 6 Saturday) | number | `0` |
| switch-mode | Panel switch mode, one of `none` (scrolling list) `month` (single month + month nav) `year-month` (single month + year-month nav) | CalendarSwitchMode | `none` |
| position | Popup position (passed to m-popup) | CalendarPosition | `bottom` |
| round | Popup round corners (passed to m-popup) | boolean | `true` |
| close-on-click-overlay | Whether clicking the mask closes the popup | boolean | `true` |
| safe-area-inset-top | Top safe area inset (passed to m-popup) | boolean | `false` |
| safe-area-inset-bottom | Bottom safe area inset (passed to m-popup) | boolean | `true` |
| z-index | Popup z-index (passed to m-popup) | number | `1` |
| duration | Popup animation duration in seconds (passed to m-popup) | number | `0.3` |
| popup-height | Popup panel height (px as-is; `%` converted from window height to px) | string | `80%` |
| max-range | Max selectable days for range / multiple (both ends included; `-1` unlimited) | number | `-1` |
| range-prompt | Over-range prompt text (empty string uses default) | string | - |
| show-range-prompt | Whether to show the toast on over-range | boolean | `true` |
| allow-same-day | Whether range selection allows the same start and end day | boolean | `false` |
| custom-class | Custom root class | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Emitted when popup visibility changes (v-model) | value: boolean |
| select | Emitted on every day tap (including after unselect; value shape follows type) | value: Date \| Date[] |
| confirm | Emitted after confirm button tap / auto confirm | value: Date \| Date[] |
| unselect | Emitted when a selected day is toggled off in multiple mode (before the paired select) | date: Date |
| over-range | Emitted when a selection exceeding max-range is rejected | - |
| click-disabled-date | Emitted when a disabled day is tapped | date: Date |
| click-subtitle | Emitted when the subtitle / nav month title is tapped | - |
| month-show | Emitted when a month enters the viewport (popup mount and scroll) | date: Date |
| panel-change | Emitted when the switch-mode panel month changes | date: Date |
| open | Emitted when the popup opens | - |
| opened | Emitted when the open animation ends | - |
| close | Emitted when the popup closes | - |
| closed | Emitted when the close animation ends | - |
| click-overlay | Emitted when the mask is tapped | event: MouseEvent |

### Methods

Call via template ref (uvue components use `$callMethod`).

| Method | Description | Arguments |
| --- | --- | --- |
| reset | Clear selection and return to the focused month | - |
| scrollToDate | Scroll to the month of the given date (instant, no animation) | date: Date |
| getSelectedDate | Read current selection (single value for single, array for multiple / range) | - |

### Slots

| Name | Description |
| --- | --- |
| title | Regular title |
| subtitle | Subtitle / nav month title |
| month-title | Month title (scoped: `month` first day of month, `text` title text) |
| text | Day text (scoped: `day`) |
| top-info | Day top info (scoped: `day`) |
| bottom-info | Day bottom info (scoped: `day`) |
| footer | Bottom area (confirm button by default) |
| confirm-text | Confirm button text |
| prev-year / prev-month / next-month / next-year | switch-mode nav icons |

## Theming

Calendar styles can be customized with the following SCSS variables (define them in the project root `uni.scss` to override defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-calendar-background | Panel background | #ffffff |
| $m-calendar-header-title-height | Title area height | 44px |
| $m-calendar-header-title-font-size | Title font size | 16px |
| $m-calendar-header-title-color | Title color | #323233 |
| $m-calendar-header-subtitle-height | Subtitle area height | 32px |
| $m-calendar-header-subtitle-font-size | Subtitle font size | 14px |
| $m-calendar-header-subtitle-color | Subtitle color | #323233 |
| $m-calendar-weekdays-height | Weekdays header height | 30px |
| $m-calendar-weekdays-font-size | Weekdays font size | 12px |
| $m-calendar-weekdays-color | Weekdays color | #969799 |
| $m-calendar-nav-icon-size | Nav icon size | 20px |
| $m-calendar-nav-icon-color | Nav icon color | #969799 |
| $m-calendar-month-title-height | Month title height | 24px |
| $m-calendar-month-title-font-size | Month title font size | 14px |
| $m-calendar-month-mark-color | Month watermark color | rgba(50, 50, 51, 0.06) |
| $m-calendar-month-mark-font-size | Month watermark font size | 160px |
| $m-calendar-day-height | Day cell height | 64px |
| $m-calendar-day-font-size | Day font size | 16px |
| $m-calendar-day-margin-bottom | Day cell vertical gap | 4px |
| $m-calendar-day-disabled-color | Disabled day text color | #c8c9cc |
| $m-calendar-info-font-size | Day info font size | 10px |
| $m-calendar-info-color | Day info color | #969799 |
| $m-calendar-selected-day-size | Selected day dot size | 54px |
| $m-calendar-selected-day-color | Selected day text color | #ffffff |
| $m-calendar-selected-day-background | Selected day background (primary) | #1989fa |
| $m-calendar-range-middle-background | Range middle background | rgba(25, 137, 250, 0.1) |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Vant

- `popup-height` is a new prop: the m-popup panel height fits its content, so `%` cannot apply directly; the calendar converts it to px from window height (Vant uses a `height` prop directly)
- `max-range` extends to multiple type: Vant applies it to range only, this project applies it to both range and multiple; over-range semantics are "reject the tap + over-range event + (optional) toast"
- `allow-same-day` is an extension prop: Vant range does not allow the same start and end day; this project supports it with a half-width bar on each end
- Multiple unselect is an "unselect followed by select" sequence: `select` is emitted on every tap (including after unselect, same as Vant), `unselect` is an extension event marking the cancel action
- Inline form (`poppable=false`) subtitle is static: only the popup form updates the subtitle to the viewport month on scroll; in switch-mode the subtitle is the nav month
- `scrollToDate` jumps to the target month instantly without scroll animation (Vant scrolls smoothly)
- Month watermark aligns top-right (Vant centers it)
- Date props accept `Date` instances only: `min-date` / `max-date` / `default-date` must be constructed numerically (`new Date(2026, 9, 29)`, month 0-based); Vant's string dates are not supported
- `formatter` only accepts synchronous functions (UTS has no Promise-based formatter)
- `min-date` / `max-date` default to "today ~ today + 6 months" (same as Vant)
- Weekday header and month title texts are built-in Chinese (title format `2026年10月`) without Vant's locale mechanism; the month title can be customized via the `month-title` slot, the weekday header has no slot
- With a gradient (non-`#hex`) `color`, the selected dot follows the gradient while the range bar falls back to the default theme color (alpha derivation supports `#hex` only)
