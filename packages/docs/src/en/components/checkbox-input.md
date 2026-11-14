---
title: CheckboxInput
subtitle: 复选输入框
demo: pages-sub/checkbox-input/checkbox-input
added: 0.5.0
---

## Introduction

`m-checkbox-input` combines m-input (readonly trigger) with m-checkbox-popup. Tapping the trigger opens the popup; selected labels join with 「、」 (over 2 items collapse to "first two + N items"); a custom clear button (m-input's built-in clearable icon sits below the trigger layer and would be covered); controlled via `v-model:value` (empty array = none).

```vue
<m-checkbox-input v-model:value="list" :options="options" title="Choose cities" />
```

## API

### CheckboxInputProps

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected set (v-model:value; empty array = none) | CheckboxValueArray | `[]` |
| options | Options array (label / value / disabled fields) | UTSJSONObject[] | `null` |
| placeholder | Placeholder | string | `请选择` |
| disabled | Disabled | boolean | `false` |
| clearable | Show clear button (visible when set and not disabled) | boolean | `true` |
| border | Trigger border container (forwarded to m-input) | boolean | `true` |
| inlaid | Trigger inlaid form (forwarded to m-input) | boolean | `false` |
| title | Popup title | string | `''` |
| max | Maximum selectable count (0 unbounded) | number | `0` |
| direction | Layout direction | CheckboxDirection | `vertical` |
| shape | Shape | CheckboxShape | `round` |
| icon-size | Icon size | string \| number | `''` |
| checked-color | Checked color | string | `''` |
| label-position | Label position | CheckboxLabelPosition | `right` |
| field-names | Field mapping (default label / value / disabled) | CheckboxFieldNames | `null` |
| options-height | Options area height px (0 uses theme variable) | number | `0` |
| position | Popup position (forwarded to m-popup, bottom by default) | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | Popup rounded corners | boolean | `true` |
| custom-class / custom-style | Root node styling | - | - |

### CheckboxInputEvents

| Event | Description | Parameters |
| --- | --- | --- |
| update:value | Selected set changed (v-model:value) | value: CheckboxValueArray |
| change | Selected set changed | value: CheckboxValueArray |
| click-item | Option tapped (forwarded from popup) | index: number |
| clear | Clear button tapped (writes back an empty set) | - |

## Notes

- The value type is `Array<string | number>`; option values may be numbers (the demo mixes numeric codes like 110000)
- The clear button writes back an empty array (not null); check `value.length > 0` for "has value"
- Display text: selected labels join with 「、」; unmatched values fall back to their text; over 2 items collapse to "first two + N items"
