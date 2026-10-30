---
title: CalendarPopup
subtitle: CalendarPopup
demo: pages-sub/calendar-popup/calendar-popup
---

## Introduction

Calendar popup component composed of [Popup](/en/components/popup) (bottom sheet) and [Calendar](/en/components/calendar) (calendar panel). It owns the popup container capabilities (visibility, position, radius, level), while all calendar selection capabilities (type / formatter / range limits) are forwarded.

Clicking confirm — or auto-confirm on a completed range — closes the popup automatically. For form-trigger scenarios use [CalendarInput](/en/components/calendar-input) directly.

## Usage

### Basic {#demo-basic}

Toggle with `v-model:show`; after confirm, the `confirm` event fires and the popup closes automatically. Full popup lifecycle events (open / opened / close / closed / click-overlay) are available.

```vue
<m-button block @click="show = true">Open calendar</m-button>
<m-calendar-popup v-model:show="show" @confirm="onConfirm" @closed="onClosed" />
```

### Multiple selection {#demo-multiple}

Set `type` to `multiple` to toggle selection (canceling fires `unselect`); with `max-range=3`, picks beyond the limit are rejected with a toast (`over-range`).

```vue
<m-calendar-popup
	v-model:show="show"
	type="multiple"
	:max-range="3"
	range-prompt="Up to 3 days"
	@select="onSelect"
	@unselect="onUnselect"
	@over-range="onOverRange"
	@confirm="onConfirm"
/>
```

### Range auto-confirm {#demo-range}

With `show-confirm` set to `false`, completing the range auto-confirms and closes the popup; `allow-same-day` allows the same start and end day.

```vue
<m-calendar-popup
	v-model:show="show"
	type="range"
	:show-confirm="false"
	:allow-same-day="true"
	@confirm="onConfirm"
/>
```

### Position / radius / height {#demo-shape}

`position` sets the popup position (forwarded to m-popup; `center` pops up in the middle); `round=false` disables rounded corners; `popup-height` controls the panel height, with `%` values converted to px against the window height.

```vue
<m-calendar-popup
	v-model:show="show"
	position="center"
	:round="false"
	popup-height="90%"
/>
```

### Formatter and out-of-range disabling {#demo-formatter}

`min-date` / `max-date` limit the selectable range (out-of-range days are disabled; clicking them fires `click-disabled-date`); `formatter` customizes day text and markers.

```vue
<m-calendar-popup
	v-model:show="show"
	:min-date="minDate"
	:max-date="maxDate"
	:formatter="dayFormatter"
	@click-disabled-date="onDisabled"
/>
```

### Slots {#demo-slots}

All calendar panel slots are supported (title / subtitle / footer / nav icons), forwarded to the inner m-calendar.

```vue
<m-calendar-popup v-model:show="show">
	<template #title>
		<text>Check-in date</text>
	</template>
	<template #footer>
		<view><text>Custom footer</text></view>
	</template>
</m-calendar-popup>
```

## API

### Props

**Popup props** (forwarded to [m-popup](/en/components/popup)):

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model:show | Whether to show the popup | boolean | `false` |
| popup-height | Popup panel height (px passes through; `%` converts against the window height) | string | `80%` |
| position | Popup position, one of `center` `top` `bottom` `left` `right` | CalendarPosition | `bottom` |
| round | Whether to show rounded corners | boolean | `true` |
| close-on-click-overlay | Whether to close on overlay click | boolean | `true` |
| safe-area-inset-top | Top safe area inset | boolean | `false` |
| safe-area-inset-bottom | Bottom safe area inset | boolean | `true` |
| z-index | Popup z-index | number | `1` |
| duration | Popup animation duration in seconds (`0` disables animation) | number | `0.3` |

**Calendar props** (forwarded to [m-calendar](/en/components/calendar), all identical except `height` — the panel height is taken over by `popup-height`): `type` / `title` / `color` / `min-date` / `max-date` / `default-date` / `row-height` / `formatter` / `show-mark` / `show-title` / `show-subtitle` / `show-confirm` / `confirm-text` / `confirm-disabled-text` / `readonly` / `first-day-of-week` / `switch-mode` / `max-range` / `range-prompt` / `show-range-prompt` / `allow-same-day` / `custom-class` / `custom-style`. See [Calendar Props](/en/components/calendar#props) for types and defaults.

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Fires on popup visibility change (v-model binding; set to `false` internally after confirm) | value: boolean |
| open | Fires when the popup opens | - |
| opened | Fires when the opening animation ends | - |
| close | Fires when the popup closes | - |
| closed | Fires when the closing animation ends | - |
| click-overlay | Fires on overlay click | event: MouseEvent |
| select | Fires on day clicks (forwarded from the inner calendar) | value: Date \| Date[] |
| confirm | Fires after the confirm button / auto-confirm (the popup closes automatically) | value: Date \| Date[] |
| unselect | Fires when a multiple-selected day is deselected | date: Date |
| over-range | Fires when a pick is rejected due to max-range | - |
| month-show | Fires when the focused month enters the viewport (once on first open) | date: Date |
| panel-change | Fires when the switch-mode panel month changes | date: Date |
| click-subtitle | Fires when the subtitle / nav row month title is clicked | - |
| click-disabled-date | Fires when a disabled day is clicked | date: Date |

### Slots

All calendar panel slots are supported and forwarded to the inner m-calendar:

| Name | Description |
| --- | --- |
| title | Regular title |
| subtitle | Subtitle / nav row current month title |
| month-title | Month title (scoped: `month` the first day of the month as Date, `text` the title text) |
| text | Day text (scoped: `day`) |
| top-info | Day top info (scoped: `day`) |
| bottom-info | Day bottom info (scoped: `day`) |
| footer | Bottom area (defaults to the confirm button) |
| confirm-text | Confirm button text |
| prev-year / prev-month / next-month / next-year | switch-mode nav icons |

Slots are **conditionally forwarded**: only provided slots override the inner calendar's default rendering; the rest keep m-calendar's defaults.

## Theming

No dedicated theme variables; the popup container reuses the `$m-popup-*` family and the calendar panel reuses the `$m-calendar-*` family (see [Calendar Theming](/en/components/calendar#theming)).

See [Theming](/en/guide/theming) for the full variable list and override instructions.

## Differences from Vant

- Component split: the Vant popup calendar is the `poppable` form of a single Calendar component; this project ships it as a standalone component alongside m-popup / m-calendar, each with a single responsibility
- `popup-height` is an extension prop: m-popup panels grow with content so `%` values cannot take effect directly; this component converts them to px against the window height and passes them down via `height` (Vant uses a `height` prop directly)
- Reopen behavior: on reopen the inner calendar's `refreshView` resets the focused month (to the range start / pre-selected month) while the selection is preserved; the Vant popup keeps the last scroll position
- Conditional slot forwarding: unprovided slots keep the inner calendar's default rendering (trivial in Vant's single component, explicit in a standalone composite)
- Inner calendar instance methods (reset / scrollToDate, etc.) are not exposed; compose m-popup + m-calendar yourself when method control is needed
