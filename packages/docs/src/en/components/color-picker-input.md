---
title: ColorPickerInput
subtitle: 颜色选择器输入框
demo: pages-sub/color-picker-input/color-picker-input
added: 0.5.0
---

## Introduction

`m-color-picker-input` combines m-input (read-only display) with m-color-picker-popup. Tapping the field opens the popup and the chosen color is written back through `v-model:value`; a swatch on the left previews the current color. Optional field label and a custom clear button are supported (following the m-cascader-input precedent).

```vue
<m-color-picker-input
	v-model:value="color"
	title="Line color"
	placeholder="Pick a color"
	show-alpha
	show-presets
	clearable
/>
```

## API

### ColorPickerInputProps

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current color (v-model:value) | string | `''` |
| title | Field label (rendered above the field when non-empty) | string | `''` |
| popup-title | Popup title | string | `选择颜色` |
| placeholder | Placeholder | string | `请选择颜色` |
| disabled | Disable the field (no tap response) | boolean | `false` |
| clearable | Show clear button (only when it has a value) | boolean | `false` |
| show-alpha | Enable opacity | boolean | `false` |
| format | Output color format | `hex` \| `rgb` \| `hsl` | `rgb` |
| show-format | Show format switcher | boolean | `false` |
| presets | Preset color list | string[] | `null` |
| show-presets | Show preset swatches | boolean | `false` |
| show-inputs | Show R / G / B / A numeric inputs | boolean | `false` |
| show-recent | Show recent colors | boolean | `false` |
| show-eyedropper | Show eyedropper entry (Web only) | boolean | `false` |
| confirm-text | Confirm button text | string | `确定` |
| cancel-text | Cancel button text | string | `取消` |
| border | Show the field border (forwarded to m-input) | boolean | `true` |
| inlaid | Inlaid field style (forwarded to m-input) | boolean | `false` |
| position | Popup position (forwarded to m-popup) | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | Popup rounded corners (forwarded to m-popup) | boolean | `true` |
| custom-class / custom-style | Root style passthrough | - | - |

### ColorPickerInputEvents

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Color changed (v-model:value) | value: string |
| change | Color changed | value: string |
| confirm | Confirm clicked | value: string |
| clear | Clear clicked (also writes back an empty string) | - |
| update:show | Popup visibility changed (v-model:show) | value: boolean |
| update:format | Format switched (v-model:format) | format: ColorFormat |
| format-change | Format switched | format: ColorFormat |

## Notes

- The field is value-controlled: it displays the raw `value` text (no reformatting) and the swatch is rendered by parsing `value`
- The clear button is a custom element, because m-input's built-in clearable icon is covered by the transparent trigger layer
- With `disabled`, the trigger layer is not rendered, so tapping never opens the popup

## Related

- [ColorPicker](/en/components/color-picker): panel-only form
- [ColorPickerPopup](/en/components/color-picker-popup): popup form
