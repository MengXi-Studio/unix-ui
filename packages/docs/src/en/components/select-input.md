---
title: SelectInput
subtitle: 列表选择输入框
demo: pages-sub/select-input/select-input
added: 0.7.0
---

## Introduction

A list selection input composed of [Input](/en/components/input) (readonly display of the current label) and [SelectPopup](/en/components/select-popup): clicking the whole area opens the popup, and selection writes back through `v-model:value`; `clearable` provides a clear button. The displayed label resolves in this order: recursive lookup in `options` → `map-label` → raw value string, which covers remote-data scenarios.

## Demos

### Basic usage {#demo-basic}

```vue
<m-select-input v-model:value="value" :options="options" title="Select line" placeholder="Please select a line" />
```

```uts
const value = ref<string | number>('line-2')
const options = ref<UTSJSONObject[]>([
	{ label: '机加工一线', value: 'line-1' },
	{ label: '注塑二线', value: 'line-2' },
	{ label: '压铸四线', value: 'line-4' }
] as UTSJSONObject[])
```

### Clearable {#demo-clearable}

`clearable` defaults to `true`: a clear button appears when a value exists, and clicking it writes back an empty string and emits `change`; set it to `false` to hide the button:

```vue
<m-select-input v-model:value="value" :options="options" />
<m-select-input v-model:value="value" :options="options" :clearable="false" />
```

### Readonly and disabled {#demo-disabled}

`readonly` keeps the display but ignores clicks and clearing; `disabled` greys out the component and blocks opening:

```vue
<m-select-input v-model:value="value" :options="options" readonly />
<m-select-input v-model:value="value" :options="options" disabled />
```

### Label mapping {#demo-map-label}

In remote scenarios the current value may not exist in `options`; use `map-label` as a fallback mapping from value to display text:

```vue
<m-select-input v-model:value="value" :options="options" :map-label="mapLabel" />
```

```uts
const mapLabel = ref<UTSJSONObject>({ 'line-9': 'Remote line 9' })
```

### Filtering {#demo-filter}

`filterable` shows a filter box inside the popup; with `filter-method` local filtering is disabled:

```vue
<m-select-input
	v-model:value="value"
	:options="options"
	title="Select line"
	filterable
	filter-placeholder="Type a keyword"
/>
```

### Controlled visibility and position {#demo-show-position}

Control popup visibility with `v-model:show` and choose the popup position with `position`:

```vue
<m-select-input v-model:value="value" v-model:show="show" :options="options" position="center" />
```

```uts
const show = ref<boolean>(false)
```

### Custom options {#demo-slot}

The `option` / `bottom` slots are forwarded to the inner panel:

```vue
<m-select-input v-model:value="value" :options="options" title="Select color">
	<template #option="{ option, selected }">
		<view class="color-item">
			<view class="color-item__block" :style="'background-color: ' + option.getString('value')! + ';'"></view>
			<text>{{ option.getString('label') }}</text>
		</view>
	</template>
</m-select-input>
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current value (`v-model:value`) | string \| number | `''` |
| options | Option list; an item with `children` is treated as a group | UTSJSONObject[] | `[]` |
| field-names | Field mapping (label / value / disabled / children) | UTSJSONObject \| null | `null` |
| placeholder | Placeholder text | string | `请选择` |
| title | Popup title | string | `''` |
| clearable | Whether to show the clear button | boolean | `true` |
| disabled | Disable (greys out and blocks opening) | boolean | `false` |
| readonly | Readonly (keeps the display, ignores clicks and clearing) | boolean | `false` |
| filterable | Whether to show the filter box | boolean | `false` |
| filter-placeholder | Filter box placeholder | string | `请输入关键词` |
| filter-value | Filter value (`v-model:filter-value`) | string | `''` |
| filter-method | Remote filter callback; disables local filtering when present | (query: string) => void \| null | `null` |
| empty-text | Empty list text | string | `暂无选项` |
| confirm-on-select | Whether to close the popup after selection | boolean | `true` |
| map-label | Label mapping (`value → text`, fallback for remote data) | UTSJSONObject \| null | `null` |
| input-align | Input text alignment, one of `left` `center` `right` | string | `left` |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| position | Popup position, one of `top` `bottom` `left` `right` `center` | string | `bottom` |
| round | Whether to use round corners | boolean | `true` |
| close-on-click-overlay | Whether clicking the overlay closes the popup | boolean | `true` |
| safe-area-inset-top | Top safe area | boolean | `false` |
| safe-area-inset-bottom | Bottom safe area | boolean | `true` |
| duration | Animation duration (seconds) | number | `0.3` |
| custom-class / custom-style | Pass-through classes / styles on the root node | - | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:value | Value changed (`v-model:value`; empty string on clear) | value: string \| number |
| change | Value changed (also emitted on clear) | value: string \| number |
| select | Active item changed (raw option object) | option: UTSJSONObject |
| update:filterValue | Filter value changed (`v-model:filter-value`) | query: string |
| update:show | Popup visibility changed (`v-model:show`) | show: boolean |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| option | `{ option, index, selected, disabled }` | Custom item content; `option` is the raw option object (UTSJSONObject) |
| bottom | - | Content at the bottom of the list (load more / hints) |

## Theming

Input appearance is controlled by [Input](/en/components/input) theme variables; the list and title are controlled by [SelectPopup theming](/en/components/select-popup). Clear-button variables:

| Variable | Description | Default |
| --- | --- | --- |
| $m-select-input-clear-right | Clear button right offset | 12px |
| $m-select-input-clear-size | Clear icon size | 16px |
| $m-select-input-clear-color | Clear icon color | $m-text-color-fourth |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Sard

- **Binding**: Sard uses `v-model`; this project uses `v-model:value`
- **Selection mode**: single selection only for now; multi-select and multi-label display are planned
- **Options**: Sard uses option child components; this project uses object arrays where an item with `children` is a group
- **Custom content**: an `option` scoped slot replaces Sard's `SelectOption` default and `label` slots
- **Value type**: only `string | number`, no `any`
- **Clear button**: a self-drawn button (the `m-input` clear icon is unavailable in readonly mode), unlike Sard's built-in `clearable`

## Notes

- Clicking the active option emits nothing, so the popup will not close automatically (there is no `change` to trigger it)
- When `filter-method` is passed, no local filtering happens: only the query is emitted — write remote data back to `options` yourself
- The displayed label comes from a matching item in `options` (including one level of `children`), then `map-label` keyed by `value.toString()`, and finally falls back to the raw value string
- The clear button is self-drawn and hidden when `readonly` / `disabled` or when no value exists; in `readonly` mode clicking the area does not open the popup either
- The inner popup stacking level is fixed at `3` (it must cover the trigger layer and clear button above the input); no `z-index` prop is provided

See [Select](/en/components/select) and [SelectPopup](/en/components/select-popup) for more examples.
