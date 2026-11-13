---
title: ColorPickerPopup
subtitle: 颜色选择器弹出框
demo: pages-sub/color-picker-popup/color-picker-popup
added: 0.5.0
---

## Introduction

`m-color-picker-popup` combines m-popup with m-color-picker. The header has three columns (cancel / title / confirm); interactions only update an internal draft, and the value is written back through `v-model:value` and the popup closes on confirm. Cancel or overlay close discards the pending change. Popup props are fully forwarded (following the m-calendar-popup precedent).

```vue
<m-color-picker-popup
	v-model:show="visible"
	v-model:value="color"
	title="Pick a color"
	show-alpha
	show-presets
/>
```

## API

### ColorPickerPopupProps

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Popup visible (v-model:show) | boolean | `false` |
| value | Current color (v-model:value, written back on confirm) | string | `''` |
| title | Popup title | string | `选择颜色` |
| show-header | Show header (cancel / title / confirm) | boolean | `true` |
| show-confirm | Show confirm button (false applies on selection) | boolean | `true` |
| confirm-text | Confirm button text | string | `确定` |
| cancel-text | Cancel button text | string | `取消` |
| show-alpha | Enable opacity | boolean | `false` |
| format | Output color format | `hex` \| `rgb` \| `hsl` | `rgb` |
| show-format | Show format switcher | boolean | `false` |
| presets | Preset color list | string[] | `null` |
| show-presets | Show preset swatches | boolean | `false` |
| show-inputs | Show R / G / B / A numeric inputs | boolean | `false` |
| show-recent | Show recent colors | boolean | `false` |
| show-eyedropper | Show eyedropper entry (Web only) | boolean | `false` |
| panel-height | Panel height in px (0 uses theme variable) | number | `0` |
| disabled | Disable interactions (confirm ignored) | boolean | `false` |
| readonly | Read-only (no interaction) | boolean | `false` |
| position | Popup position (forwarded to m-popup) | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | Popup rounded corners (forwarded to m-popup) | boolean | `true` |
| close-on-click-overlay | Close on overlay click (forwarded to m-popup) | boolean | `true` |
| safe-area-inset-bottom | Bottom safe area (forwarded to m-popup) | boolean | `true` |
| z-index | Stacking order (forwarded to m-popup) | number | `100` |
| duration | Animation duration in seconds (forwarded to m-popup) | number | `0.3` |
| custom-class / custom-style | Content root style passthrough | - | - |

### ColorPickerPopupEvents

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Popup visibility changed (v-model:show) | value: boolean |
| update:value | Color written back on confirm (v-model:value) | value: string |
| change | Color changed (on confirm, or live when show-confirm=false) | value: string |
| confirm | Confirm clicked | value: string |
| cancel | Cancel clicked (pending change discarded) | - |
| update:format | Format switched (v-model:format) | format: ColorFormat |
| format-change | Format switched | format: ColorFormat |
| open / opened | Popup opened / open animation finished | - |
| close / closed | Popup closed / close animation finished | - |
| click-overlay | Overlay clicked | event: MouseEvent |

## Notes

- The draft resets to the current `value` each time the popup opens; unconfirmed changes are not kept
- With `show-confirm=false` the color is written back live through `update:value` / `change`, and closing the overlay keeps it
- Interactive nodes are re-measured after the open animation finishes so touch coordinates stay accurate (rects shift during animation)

## Related

- [ColorPicker](/en/components/color-picker): panel-only form
- [ColorPickerInput](/en/components/color-picker-input): form input form
