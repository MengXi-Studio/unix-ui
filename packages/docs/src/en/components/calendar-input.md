---
title: CalendarInput
subtitle: CalendarInput
demo: pages-sub/calendar-input/calendar-input
---

## Introduction

Calendar input component composed of [Input](/en/components/input) (read-only trigger) and [CalendarPopup](/en/components/calendar-popup) (calendar popup): clicking the trigger opens the popup, and the confirmed value is written back via `v-model:value` and displayed; a self-drawn clear button appears when a value exists.

The value is one-way controlled: the external `value` syncs the inner calendar's initial selection via `default-date`, and the confirmed value is written back via `update:value`. The display text derives from `value` (single value / range / multiple joined text). The popup resets its inner selection to the current `value` on every open (via the inner popup's `reset-on-open`), so unconfirmed selections do not linger.

## Usage

### Basic {#demo-basic}

Displays `YYYY-MM-DD` after confirm; `clearable` defaults to `true`, showing a clear button when a value exists (fires `clear`).

```vue
<m-calendar-input v-model:value="value" @confirm="onConfirm" @clear="onClear" />
```

### Range and multiple {#demo-type}

Set `type` to `range` to display a "start ~ end" span; `multiple` displays a comma-joined text. With `max-range=3`, picks beyond the limit are rejected with a toast.

```vue
<m-calendar-input
	v-model:value="rangeValue"
	type="range"
	placeholder="Check-in / check-out date"
	@confirm="onConfirm"
/>
<m-calendar-input
	v-model:value="multiValue"
	type="multiple"
	:max-range="3"
	placeholder="Multiple dates (up to 3 days)"
	@confirm="onConfirm"
/>
```

### Limited range and theme color {#demo-limit}

`min-date` / `max-date` limit the selectable range (out-of-range days disabled); `color` derives the selected dot and range bar color.

```vue
<m-calendar-input
	v-model:value="value"
	type="range"
	:min-date="minDate"
	:max-date="maxDate"
	color="#07c160"
/>
```

### Disabled and forms {#demo-state}

`disabled` disables the trigger (not rendered, popup cannot open); `clearable=false` hides the clear button; `border=false` for the borderless embedded form (forwarded to m-input, composable with cells).

```vue
<m-calendar-input v-model:value="value" disabled />
<m-calendar-input v-model:value="value" :clearable="false" />
<m-calendar-input v-model:value="value" :border="false" />
```

### Popup form {#demo-shape}

`title` customizes the popup title; `popup-height` / `position` / `round` are forwarded to the popup container (same as [CalendarPopup](/en/components/calendar-popup#demo-shape)).

```vue
<m-calendar-input
	v-model:value="value"
	title="Check-in date"
	popup-height="70%"
	position="center"
	:round="false"
/>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model:value | Selected value (Date for single, Date[] for multiple / range, null when empty) | Date \| Date[] \| null | `null` |
| type | Selection type, one of `single` `multiple` `range` | CalendarType | `single` |
| placeholder | Placeholder text | string | `请选择日期` |
| disabled | Whether disabled (trigger not rendered, popup cannot open) | boolean | `false` |
| clearable | Whether to show the clear button (visible when a value exists and not disabled) | boolean | `true` |
| border | Whether the trigger shows a bordered container (forwarded to m-input) | boolean | `true` |
| inlaid | Embedded trigger form (forwarded to m-input) | boolean | `false` |
| title | Popup regular title | string | `日期选择` |
| color | Theme color (derives the selected dot and range bar; `#hex` and gradients supported) | string | - |
| min-date | Minimum date | Date \| null | `null` (today) |
| max-date | Maximum date | Date \| null | `null` (today + 6 months) |
| max-range | Maximum selectable days for range / multiple (both ends counted; `-1` unlimited) | number | `-1` |
| allow-same-day | Whether range selection allows the same start and end day | boolean | `false` |
| popup-height | Popup panel height (px passes through; `%` converts against the window height) | string | `80%` |
| position | Popup position (forwarded to m-popup) | CalendarPosition | `bottom` |
| round | Popup rounded corners (forwarded to m-popup) | boolean | `true` |
| custom-class | Custom root class name | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Writes back the selected value after confirm (v-model binding); clicking clear writes back `null` | value: Date \| Date[] \| null |
| confirm | Fires after the popup confirm (button / auto-confirm) | value: Date \| Date[] |
| clear | Fires after the clear button is clicked | - |

### Display format

| type | Display | Example |
| --- | --- | --- |
| single | Single value `YYYY-MM-DD` | `2026-10-29` |
| range | `start ~ end` (start only when incomplete) | `2026-10-15 ~ 2026-10-18` |
| multiple | Comma-joined | `2026-10-15、2026-10-18` |

## Notes

- **Trigger implementation**: m-input's readonly is simulated via native disabled (native disabled controls swallow click events), so a transparent overlay layer catches clicks across the whole area to open the popup; the trigger is not rendered in the `disabled` state
- **Clear button**: m-input's built-in clearable icon sits under the trigger layer and would be blocked, so the clear button is self-drawn
- **z-index stacking**: trigger (1) < clear button (2) < popup overlay (3, fixed `:z-index="3"` passed internally) so the overlay covers the component's own floating layers; when raising `z-index` externally, check this in sync
- **Reset on open**: the inner selection resets to the current `value` every time the popup opens (implemented via [CalendarPopup](/en/components/calendar-popup)'s `reset-on-open`); unconfirmed selections do not linger, and the focus month resets to the month of `value`

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-calendar-input-trigger-z-index | Transparent trigger layer z-index | 1 |
| $m-calendar-input-clear-z-index | Clear button z-index | 2 |
| $m-calendar-input-clear-width | Clear button fixed width | 40px |
| $m-calendar-input-clear-icon-size | Clear icon size | 16px |
| $m-calendar-input-clear-color | Clear icon color | #c8c9cc |

See [Theming](/en/guide/theming) for the full variable list and override instructions.

## Differences from Vant

- Component split: Vant has no calendar input composite (popup calendar + field write-back must be assembled manually); this project ships the full "trigger + popup + write-back + clear" chain
- Placeholder and display: `placeholder` shows when no value is selected; the display text derives from `type` (see [Display format](#display-format)), unlike manually composing text with a Vant Field
- Date props only accept `Date` instances: `min-date` / `max-date` / `value` must be constructed numerically (`new Date(2026, 9, 29)`, months 0-based); string dates are not supported
- The read-only trigger is implemented as an overlay layer (native readonly cannot be used to trigger popups); trigger forms like `border` / `inlaid` are forwarded via m-input
