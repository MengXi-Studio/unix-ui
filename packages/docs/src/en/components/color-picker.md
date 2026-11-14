---
title: ColorPicker
subtitle: 颜色选择器
demo: pages-sub/color-picker/color-picker
added: 0.5.0
---

## Introduction

`m-color-picker` is a color picker with a saturation-brightness panel plus a hue slider; enable `show-alpha` to adjust opacity as well. The value is a controlled string (`v-model:value`) and can be serialized as `hex` / `rgb` / `hsl`. Optional features include format switching, preset swatches, R/G/B/A numeric inputs, recent colors, and an eyedropper on Web.

```vue
<m-color-picker v-model:value="color" show-alpha />
```

## API

### ColorPickerProps

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current color (v-model:value) | string | `#1989FA` |
| show-alpha | Enable opacity (alpha track + A component) | boolean | `false` |
| format | Output color format | `hex` \| `rgb` \| `hsl` | `rgb` |
| show-format | Show format switcher (hex / rgb / hsl) and current value | boolean | `false` |
| presets | Preset color list (falls back to built-in colors when empty) | string[] | `null` |
| show-presets | Show preset swatches | boolean | `false` |
| show-inputs | Show R / G / B / A numeric inputs | boolean | `false` |
| show-recent | Show recent colors (up to 8) | boolean | `false` |
| show-eyedropper | Show eyedropper entry (Web only) | boolean | `false` |
| panel-height | Panel height in px (0 uses theme variable) | number | `0` |
| disabled | Disable interactions | boolean | `false` |
| readonly | Read-only (no interaction, no disabled style) | boolean | `false` |
| custom-class / custom-style | Root style passthrough | - | - |

### ColorPickerEvents

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Color changed (v-model:value) | value: string |
| change | Color changed | value: string |
| update:format | Format switched (v-model:format) | format: ColorFormat |
| format-change | Format switched | format: ColorFormat |

## Color formats

- `hex`: `#RRGGBB` by default; with `show-alpha` it outputs 8-digit `#RRGGBBAA`
- `rgb`: `rgb(r, g, b)` / `rgba(r, g, b, a)`
- `hsl`: `hsl(h, s%, l%)` / `hsla(h, s%, l%, a)`
- Incoming values accept `#RGB` / `#RGBA` / `#RRGGBB` / `#RRGGBBAA` / `rgb()` / `rgba()` / `hsl()` / `hsla()`; empty or invalid input falls back to the default color

## Notes

- The panel and tracks convert touch coordinates via `touchstart` / `touchmove`; on desktop use touch or pointer emulation
- Gradient layering: `background-image` on App supports a single `linear-gradient` only, so the panel stacks three absolutely positioned layers (solid hue + horizontal white + vertical black) instead of multiple backgrounds
- The eyedropper relies on the Chromium `EyeDropper` API and is guarded by `#ifdef WEB`: it is not rendered on App / HarmonyOS / mini programs, and non-Chromium browsers show a toast on click
- Recent colors live in component state (not persisted, not shared between instances) and are recorded on gesture end or preset selection
- Numeric inputs commit on blur or confirm, clamping RGB to 0-255 and A to 0-100

## Related

- [ColorPickerPopup](/en/components/color-picker-popup): popup form (applies on confirm)
- [ColorPickerInput](/en/components/color-picker-input): form input form
