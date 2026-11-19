---
title: RadioPopup
subtitle: 单选弹出框
demo: pages-sub/form/radio-popup/radio-popup
added: 0.7.0
---

## Introduction

Radio popup: a popup single-select component combining `m-popup` + `m-radio-group`. Options are rendered from the `options` array (no need to write item templates), the current value is controlled via `v-model:value`; the popup does not auto-close after selection — close via the header close icon / overlay / footer.

> Value type: option keys are `string | number`, current value is `RadioValue | null` (`null` = nothing selected).

## Usage

### Basic Usage {#demo-basic}

```vue
<m-radio-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	title="Select line"
>
	<template #footer>
		<m-button block type="primary" @click="show = false">Confirm</m-button>
	</template>
</m-radio-popup>
```

### Custom Field Names {#demo-field-names}

```vue
<m-radio-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	:field-names="{ label: 'text', value: 'code', disabled: 'off' }"
	title="Select channel"
/>
```

### Disabled / Readonly {#demo-disabled}

The `disabled` field in option data disables a single option; the component's `readonly` makes the whole popup readonly:

```vue
<m-radio-popup v-model:show="show" v-model:value="value" :options="options" readonly />
```

### Direction / Custom Height {#demo-layout}

```vue
<m-radio-popup v-model:show="show" v-model:value="value" :options="options" direction="horizontal" />
<m-radio-popup v-model:show="show" v-model:value="value" :options="options" :options-height="200" />
```

## API

### Props

Passes through all `m-radio-group` spec props (value / disabled / readonly / direction / icon-size / checked-color / shape), plus:

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (v-model:show) | boolean | `false` |
| options | Option array (label / value / disabled fields) | UTSJSONObject[] | `null` |
| title | Popup title | string | `''` |
| show-header | Whether to show the header (title + close icon) | boolean | `true` |
| closeable | Whether to show the close icon | boolean | `true` |
| close-icon | Close icon name (m-icon name) | IconName | `cross` |
| label-position | Label position: `right` / `left` | RadioLabelPosition | `right` |
| field-names | Custom option field names | RadioFieldNames | `null` |
| options-height | Options area height in px (0 uses theme variable) | number | `0` |
| position | Popup position: `top` / `bottom` / `left` / `right` / `center` | RadioPopupPosition | `bottom` |
| round | Whether to show rounded corners | boolean | `true` |
| close-on-click-overlay | Close on overlay tap | boolean | `true` |
| safe-area-inset-bottom | Bottom safe area adaptation | boolean | `true` |
| z-index | Z-index | number | `99` |
| duration | Animation duration (seconds) | number | `0.3` |
| custom-class / custom-style | Root node styling | - | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Popup visibility changed | show: boolean |
| update:value | Selected value changed | value: RadioValue \| null |
| change | Selected value changed | value: RadioValue \| null |
| click-item | An option was tapped (including disabled) | index: number |
| close | Close icon tapped | - |

### Slots

| Name | Description |
| --- | --- |
| footer | Custom footer area (e.g. confirm button) |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-radio-popup-background | Popup background | #ffffff |
| $m-radio-popup-header-padding | Header padding | 14px 16px |
| $m-radio-popup-title-font-size | Title font size | 16px |
| $m-radio-popup-title-color | Title color | #323233 |
| $m-radio-popup-close-icon-size | Close icon size | 18px |
| $m-radio-popup-close-icon-color | Close icon color | #c8c9cc |
| $m-radio-popup-options-height | Options area height | 278px |

Option visuals reuse the `$m-radio-*` variables.

## Notes

- The popup does not auto-close after selection (consistent with the `v-model:show` controlled model; listen to `change` and set `show = false` for select-and-close behavior)
- Options with a null / missing `value` are skipped (cannot participate in selection)
- Values are compared stringified: `'1'` equals `1`
