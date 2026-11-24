---
title: RadioInput
subtitle: 单选输入框
demo: pages-sub/form/radio-input/radio-input
added: 0.7.0
---

## Introduction

Radio input: a form component combining `m-input` (readonly trigger) + `m-radio-popup`. Tapping the whole area opens the popup for single selection; the selected option's label is displayed; `clearable` shows a hand-drawn clear button that writes back `null` and emits `clear`.

> Value type: option keys are `string | number`, current value is `RadioValue | null` (`null` = nothing selected, placeholder shown).

## Usage

### Basic Usage {#demo-basic}

```vue
<m-radio-input v-model:value="value" :options="options" title="Select city" placeholder="Select city" />
```

### Clear Button {#demo-clear}

`clearable` (true by default) shows a clear button on the right when a value exists and the component is not disabled:

```vue
<m-radio-input v-model:value="value" :options="options" @clear="onClear" />
```

### Disabled and Forms {#demo-disabled}

```vue
<m-radio-input v-model:value="value" :options="options" disabled title="Disabled" />
<m-radio-input v-model:value="value" :options="options" inlaid title="Inlaid" />
```

### Custom Field Names {#demo-field-names}

```vue
<m-radio-input
	v-model:value="value"
	:options="options"
	:field-names="{ label: 'name', value: 'code', disabled: 'disabled' }"
	title="Select region code"
/>
```

## API

### Props

Only the props below are exposed; popup visibility (`show`) and popup header / overlay options (`show-header`, `closeable`, `close-icon`, `close-on-click-overlay`, `safe-area-inset-bottom`, `z-index`, `duration`) are fixed internally.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| value | Currently selected key (v-model:value; null = none) | RadioValue | `null` |
| options | Option array (label / value / disabled fields) | UTSJSONObject[] | `null` |
| placeholder | Placeholder text | string | `请选择` |
| disabled | Disabled (trigger layer not rendered, popup cannot open) | boolean | `false` |
| readonly | Readonly (options in popup not switchable) | boolean | `false` |
| clearable | Show clear button (visible when a value exists and not disabled) | boolean | `true` |
| border | Trigger shows bordered container (passes to m-input) | boolean | `true` |
| inlaid | Trigger inlaid form (passes to m-input) | boolean | `false` |
| title | Popup title | string | `''` |
| direction | Option layout, `vertical` or `horizontal` | RadioDirection | `vertical` |
| shape | Option shape, `round` or `square` | RadioShape | `round` |
| icon-size | Icon size (number gets px / string as-is) | string \| number | `''` |
| checked-color | Checked color | string | `''` |
| label-position | Label position, `right` or `left` | RadioLabelPosition | `right` |
| field-names | Custom option field names (null = label / value / disabled) | RadioFieldNames \| null | `null` |
| options-height | Options area height in px (0 uses theme variable) | number | `0` |
| position | Popup position: `top` `bottom` `left` `right` `center` | RadioInputPosition | `bottom` |
| round | Popup rounded corners | boolean | `true` |
| custom-class / custom-style | Root node styling | - | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Selected value changed | value: RadioValue \| null |
| change | Selected value changed | value: RadioValue \| null |
| click-item | An option was tapped (passed from popup) | index: number |
| clear | Clear button tapped | - |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-radio-input-trigger-z-index | Trigger layer z-index | 1 |
| $m-radio-input-clear-z-index | Clear button z-index | 2 |
| $m-radio-input-clear-width | Clear button width | 40px |
| $m-radio-input-clear-icon-size | Clear icon size | 16px |
| $m-radio-input-clear-color | Clear icon color | #c8c9cc |

Trigger visuals reuse `$m-input-*`, popup reuses `$m-radio-popup-*`.

## Notes

- The clear button is hand-drawn (m-input's built-in `clearable` icon sits below the trigger layer and would be blocked); tapping writes back `null`
- The trigger is a transparent overlay: it is not rendered when disabled, avoiding native disabled controls swallowing taps
- The display text matches the value against options for the label, falling back to the value text when unmatched
