---
title: Stepper
subtitle: Stepper
demo: pages-sub/form/stepper/stepper
added: 0.8.0
---

## Introduction

Adjust a numeric value with a minus button, an input field and a plus button. Supports range limits, step, decimal precision, integer mode, empty values, per-part disabling, long-press repeat, change interception, four visual variants, two sizes and a round theme.

> The value type is `number | null`; `null` means an empty input (requires `allow-empty`).

## Examples

### Basic usage {#demo-basic}

Bind the value with `v-model:value` and listen to confirmed changes with `change`:

```vue
<m-stepper v-model:value="value" @change="onChange" />
```

```uts
const value = ref<number | null>(1)

function onChange(value: number | null) {
	console.log('stepper change: ' + (value == null ? 'null' : value.toString()))
}
```

### Min / max and auto-fixed {#demo-range}

`min` / `max` limit the range; `auto-fixed` is enabled by default. Disable it to keep out-of-range values:

```vue
<m-stepper v-model:value="value" :min="0" :max="5" />
<m-stepper v-model:value="value" :min="0" :max="5" :auto-fixed="false" />
```

### Step and precision {#demo-step}

`step` sets the increment, `decimal-length` fixes the decimal places, and `integer` allows integers only:

```vue
<m-stepper v-model:value="stepValue" :step="5" />
<m-stepper v-model:value="decimalValue" :step="0.1" :decimal-length="2" />
<m-stepper v-model:value="integerValue" integer />
```

### Empty value {#demo-empty}

`allow-empty` allows `null`; `value-on-clear` sets the value written back after clearing, accepting `'min'` / `'max'` / a number / `null`:

```vue
<m-stepper v-model:value="emptyValue" allow-empty />
<m-stepper v-model:value="clearMinValue" allow-empty value-on-clear="min" :min="3" />
```

### Readonly and disabled {#demo-status}

`readonly` keeps the normal look but blocks editing; `disabled` greys out the whole control; `disable-plus` / `disable-minus` / `disable-input` disable one part only:

```vue
<m-stepper :value="4" readonly />
<m-stepper :value="4" disabled />
<m-stepper v-model:value="value" disable-plus />
<m-stepper v-model:value="value" disable-input />
```

### Variants {#demo-variant}

`variant` accepts `solid` / `outlined` / `accent` / `ghost`:

```vue
<m-stepper v-model:value="value" variant="solid" />
<m-stepper v-model:value="value" variant="outlined" />
<m-stepper v-model:value="value" variant="accent" />
<m-stepper v-model:value="value" variant="ghost" />
```

### Size and round theme {#demo-size}

`size="small"` shrinks the control; `theme="round"` shows primary-colored pill buttons; `input-width` / `button-size` customize pixel sizes:

```vue
<m-stepper v-model:value="value" size="small" />
<m-stepper v-model:value="value" theme="round" :button-size="24" :disable-input="true" />
<m-stepper v-model:value="value" :input-width="56" :button-size="34" />
```

### Long press {#demo-press}

`long-press` is enabled by default; `press-time` sets the trigger delay and `interval` the repeat interval:

```vue
<m-stepper v-model:value="value" />
<m-stepper v-model:value="value" :press-time="600" :interval="300" />
<m-stepper v-model:value="value" :long-press="false" />
```

### Before change and events {#demo-before}

`before-change` runs before a change and returns `false` to block it; it may also return `Promise<boolean>`. Clicking a boundary button emits `overlimit`:

```vue
<m-stepper
	v-model:value="value"
	:min="0"
	:max="10"
	:before-change="beforeChange"
	@change="onChange"
	@overlimit="onOverlimit"
/>
```

```uts
const beforeChange = (value: number | null): boolean | Promise<boolean> => {
	return value == null || value <= 8
}
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current value (v-model:value); omitted means the initial value | number | `1` |
| min | Minimum value | number | `1` |
| max | Maximum value | number | Unlimited |
| step | Step size | number | `1` |
| decimal-length | Fixed decimal places (-1 = not fixed) | number | `-1` |
| integer | Allow integers only | boolean | `false` |
| allow-empty | Allow an empty value (null) | boolean | `false` |
| value-on-clear | Value written back after clearing; accepts `'min'` / `'max'` | number \| string \| null | `null` |
| auto-fixed | Auto-correct out-of-range values on buttons and blur | boolean | `true` |
| disabled | Disable the whole stepper | boolean | `false` |
| readonly | Readonly (normal look, no edits) | boolean | `false` |
| disable-input | Disable the input only (buttons still work) | boolean | `false` |
| disable-plus | Disable the plus button | boolean | `false` |
| disable-minus | Disable the minus button | boolean | `false` |
| show-plus | Show the plus button | boolean | `true` |
| show-minus | Show the minus button | boolean | `true` |
| show-input | Show the input | boolean | `true` |
| long-press | Long-press to change continuously | boolean | `true` |
| press-time | Long-press trigger delay in ms | number | `350` |
| interval | Repeat interval in ms | number | `150` |
| before-change | Before-change guard; return false (or a resolving Promise) to block | `(value: number \| null) => boolean \| Promise<boolean>` | - |
| input-width | Input width in px (0 uses the theme value) | number | `0` |
| button-size | Button size / input height in px (0 uses the theme value) | number | `0` |
| theme | Theme; `round` renders pill-shaped primary buttons | `default` \| `round` | `default` |
| variant | Visual variant | `solid` \| `outlined` \| `accent` \| `ghost` | `solid` |
| size | Size | `medium` \| `small` | `medium` |
| placeholder | Input placeholder | string | `''` |
| custom-class / custom-style | Root style passthrough | - | - |

### Events

| Event | Description | Callback |
| --- | --- | --- |
| update:value | Value changed (v-model:value) | value: number \| null |
| change | Confirmed value change (button click or blur) | value: number \| null |
| plus | The plus button was clicked | - |
| minus | The minus button was clicked | - |
| overlimit | A boundary or disabled button was clicked | - |
| focus | The input was focused | event: UniEvent |
| blur | The input was blurred | event: UniEvent |

## Theming

The stepper can be styled with the following SCSS variables (define them in the project's root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-stepper-height | Default height / button size | 28px |
| $m-stepper-input-width | Input width | 32px |
| $m-stepper-input-font-size | Input font size | 14px |
| $m-stepper-input-text-color | Input text color | Body text color |
| $m-stepper-input-disabled-text-color | Disabled input text color | Tertiary text color |
| $m-stepper-background | Default background (solid) | #f2f3f5 |
| $m-stepper-radius | Default border radius | Medium radius |
| $m-stepper-radius-round | Round theme border radius | Pill radius |
| $m-stepper-button-icon-color | Button icon color | Body text color |
| $m-stepper-button-icon-size | Button icon size | 16px |
| $m-stepper-button-disabled-icon-color | Disabled button icon color | Quaternary text color |
| $m-stepper-border-color | Outlined border color | #ebedf0 |
| $m-stepper-accent-background | Accent variant background | Primary at 10% |
| $m-stepper-accent-color | Accent variant text / icon color | Primary color |
| $m-stepper-round-color | Round theme button background | Primary color |
| $m-stepper-round-icon-color | Round theme icon color | #ffffff |
| $m-stepper-height-small | Small height | 24px |
| $m-stepper-input-width-small | Small input width | 28px |
| $m-stepper-input-font-size-small | Small input font size | 12px |
| $m-stepper-button-icon-size-small | Small icon size | 14px |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Vant / Sard

- **Binding**: unified as `v-model:value`, with a `number | null` value type
- **Empty values**: both Vant `allow-empty` and Sard `value-on-clear` are provided; clearing can write back `'min'` / `'max'`
- **Auto-correct**: `auto-fixed` (default `true`); disabling it skips clamping on buttons and blur
- **Style**: both Vant `theme="round"` and Sard `variant` / `size`
- **Long press**: merged into `long-press` / `press-time` / `interval`
- **Not implemented**: Vant `name` (change payload tag) and `default-value`; manage the initial `value` on the caller side

## Notes

- Intermediate input such as `1.` or `-` is allowed; normalization happens on blur
- `decimal-length` keeps trailing zeros in the display (e.g. `0.30`); emitted values are numbers
- `integer` takes precedence over `decimal-length` and rounds to the nearest integer
- When `theme="round"` and `variant` are both set, round wins (no background/border + primary buttons)
- The native input type is `number` when `integer` is set, otherwise `digit`; a minus sign is accepted only when `min < 0`
