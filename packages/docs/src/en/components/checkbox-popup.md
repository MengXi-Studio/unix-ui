---
title: CheckboxPopup
subtitle: 复选弹出框
demo: pages-sub/checkbox-popup/checkbox-popup
added: 0.5.0
---

## Introduction

`m-checkbox-popup` combines m-popup (bottom sheet) with m-checkbox-group; options render from an options array (no item templates required), with a header title and close icon, and the selected set is controlled via `v-model:value`. Popup props are fully forwarded (following the m-cascader-popup precedent).

```vue
<m-checkbox-popup
	v-model:show="show"
	v-model:value="list"
	:options="options"
	title="Pick tags"
/>
```

## API

### CheckboxPopupProps

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Popup visible (v-model:show) | boolean | `false` |
| value | Selected set (v-model:value) | CheckboxValueArray | `[]` |
| options | Options array (label / value / disabled fields) | UTSJSONObject[] | `null` |
| title | Popup title | string | `''` |
| show-header | Show header (title + close icon) | boolean | `true` |
| closeable | Show close icon | boolean | `true` |
| close-icon | Close icon name | IconName | `cross` |
| disabled | Disable all options | boolean | `false` |
| max | Maximum selectable count (0 unbounded) | number | `0` |
| direction | Layout direction: `vertical` / `horizontal` | CheckboxDirection | `vertical` |
| shape | Shape: `round` / `square` | CheckboxShape | `round` |
| icon-size | Icon size (number gets px appended) | string \| number | `''` |
| checked-color | Checked color | string | `''` |
| label-position | Label position: `right` / `left` | CheckboxLabelPosition | `right` |
| field-names | Field mapping (default label / value / disabled) | CheckboxFieldNames | `null` |
| options-height | Options area height px (0 uses theme variable) | number | `0` |
| position | Popup position (forwarded to m-popup) | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | Popup rounded corners | boolean | `true` |
| close-on-click-overlay | Close on overlay tap | boolean | `true` |
| safe-area-inset-bottom | Bottom safe-area padding | boolean | `true` |
| z-index | Stacking level | number | `99` |
| duration | Transition duration in seconds | number | `0.3` |
| custom-class / custom-style | Root node styling | - | - |

### CheckboxPopupEvents

| Event | Description | Parameters |
| --- | --- | --- |
| update:show | Popup visibility changed (overlay and close icon both route here) | value: boolean |
| update:value | Selected set changed (v-model:value) | value: CheckboxValueArray |
| change | Selected set changed | value: CheckboxValueArray |
| click-item | Option tapped (including disabled) | index: number |
| close | Closed (close icon or overlay) | - |

### CheckboxPopupSlots

| Slot | Description |
| --- | --- |
| footer | Popup footer area (e.g. a confirm button) |

## Notes

- Options with a null value are not rendered (they cannot join the selection)
- Numeric values equal their string counterparts (`'1'` equals `1`, stringified comparison, same as [Checkbox](/en/components/checkbox))
- The selected set writes back immediately (no confirm semantics; use the footer slot with a local copy if you need confirm-then-apply)
