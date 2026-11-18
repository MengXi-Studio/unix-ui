---
title: Select
subtitle: 列表选择
demo: pages-sub/select/select
added: 0.7.0
---

## Introduction

A list selection panel for single selection among options. Rendering is driven by `options`: an item containing `children` is rendered as a group title, while its children are selectable. The value is controlled (`v-model:value`), and the active item is marked with primary-color text plus a check icon on the right. Supports local / remote filtering, whole and per-option disabled, empty text, a custom option slot and a scroll-to-top method.

This is the flat panel: the popup form is composed by [SelectPopup](/en/components/select-popup), and the form-input form by [SelectInput](/en/components/select-input).

## Demos

### Basic usage {#demo-basic}

Bind the selected value with `v-model:value` and define options (`label` / `value`) with `options`:

```vue
<m-select v-model:value="value" :options="options" />
```

```uts
const value = ref<string | number>('line-2')
const options = ref<UTSJSONObject[]>([
	{ label: '机加工一线', value: 'line-1' },
	{ label: '注塑二线', value: 'line-2' },
	{ label: '压铸四线', value: 'line-4' }
] as UTSJSONObject[])
```

### Groups {#demo-group}

An option containing `children` is treated as a group: its `label` is rendered as a group title and its children are selectable; the group title itself is not selectable:

```vue
<m-select v-model:value="value" :options="groupOptions" />
```

```uts
const groupOptions = ref<UTSJSONObject[]>([
	{
		label: '华东厂区',
		children: [
			{ label: '机加工一线', value: 'e-1' },
			{ label: '注塑二线', value: 'e-2' }
		] as UTSJSONObject[]
	},
	{
		label: '华南厂区',
		children: [
			{ label: '压铸四线', value: 's-4' },
			{ label: '包装五线', value: 's-5' }
		] as UTSJSONObject[]
	}
] as UTSJSONObject[])
```

### Custom field names {#demo-field-names}

`field-names` maps `label` / `value` / `disabled` / `children`; missing keys fall back to the same names:

```vue
<m-select v-model:value="value" :options="options" :field-names="fieldNames" />
```

```uts
const fieldNames = ref<UTSJSONObject>({ label: 'text', value: 'code', children: 'items' })
```

### Filtering {#demo-filter}

`filterable` shows a filter box. Local filtering matches `label` by substring (case-insensitive) and keeps groups that have matching children:

```vue
<m-select v-model:value="value" :options="options" filterable filter-placeholder="Filter by line name" />
```

### Remote filtering {#demo-remote-filter}

Passing `filter-method` disables local filtering and only emits the query; combine it with `v-model:filter-value` for controlled filtering:

```vue
<m-select
	v-model:value="value"
	v-model:filter-value="query"
	:options="options"
	filterable
	:filter-method="onFilter"
/>
```

```uts
const query = ref<string>('')
const onFilter = (q: string) => {
	// fetch remote data and write it back to options
}
```

### Disabled {#demo-disabled}

Component-level `disabled` greys out all options; the `disabled` field on an option only disables that item:

```vue
<m-select v-model:value="value" :options="options" disabled />
<m-select v-model:value="value" :options="partialOptions" />
```

### Custom options {#demo-slot}

The `option` slot renders the whole item; its scope is `{ option, index, selected, disabled }` (`option` is the raw option object):

```vue
<m-select v-model:value="value" :options="colorOptions">
	<template #option="{ option, selected }">
		<view class="color-item">
			<view class="color-item__block" :style="'background-color: ' + option.getString('value')! + ';'"></view>
			<text>{{ option.getString('label') }}</text>
		</view>
	</template>
</m-select>
```

### Long list and scroll to top {#demo-scroll}

When the list exceeds the theme variable `$m-select-max-height` it scrolls internally; call the instance method `scrollTop()` to jump back to the top:

```vue
<m-select ref="selectRef" v-model:value="value" :options="longOptions" />
```

```uts
const selectRef = ref<ComponentPublicInstance | null>(null)
const backToTop = () => {
	const inst = selectRef.value
	if (inst != null) inst.$callMethod('scrollTop')
}
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | Active value (`v-model:value`) | string \| number | `''` |
| options | Option list; an item with `children` is treated as a group | UTSJSONObject[] | `[]` |
| field-names | Field mapping (label / value / disabled / children) | UTSJSONObject \| null | `null` |
| filterable | Whether to show the filter box | boolean | `false` |
| filter-placeholder | Filter box placeholder | string | `请输入关键词` |
| filter-value | Filter value (`v-model:filter-value`) | string | `''` |
| filter-method | Remote filter callback; disables local filtering when present | (query: string) => void \| null | `null` |
| disabled | Disable the whole panel | boolean | `false` |
| empty-text | Empty list text | string | `暂无选项` |
| custom-class / custom-style | Pass-through classes / styles on the root node | - | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:value | Active value changed (`v-model:value`) | value: string \| number |
| change | Active value changed | value: string \| number |
| select | Active item changed (raw option object) | option: UTSJSONObject |
| update:filterValue | Filter value changed (`v-model:filter-value`) | query: string |

### Methods

| Method | Description |
| --- | --- |
| scrollTop | Scroll the list back to the top |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| option | `{ option, index, selected, disabled }` | Custom item content; `option` is the raw option object (UTSJSONObject) |
| bottom | - | Content at the bottom of the list (load more / hints) |

## Theming

Define the following variables directly in the project root `uni.scss` to override the defaults:

| Variable | Description | Default |
| --- | --- | --- |
| $m-select-max-height | Panel max height | 320px |
| $m-select-bg | Panel background | $m-white |
| $m-select-filter-padding | Filter area padding | 8px 12px |
| $m-select-option-min-height | Option min height | 44px |
| $m-select-option-padding | Option padding | 0 12px |
| $m-select-option-color | Option text color | $m-text-color |
| $m-select-option-color-selected | Active option text color | $m-color-primary |
| $m-select-option-color-disabled | Disabled option text color | $m-text-color-fourth |
| $m-select-option-font-size | Option font size | 14px |
| $m-select-check-color | Check icon color | $m-color-primary |
| $m-select-check-size | Check icon size | 16px |
| $m-select-group-label-padding | Group title padding | 8px 12px |
| $m-select-group-label-font-size | Group title font size | 12px |
| $m-select-group-label-color | Group title color | $m-text-color-tertiary |
| $m-select-group-label-bg | Group title background | #f2f3f5 |
| $m-select-empty-padding | Empty state padding | 32px 0 |
| $m-select-empty-color | Empty state text color | $m-text-color-fourth |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Sard

- **Binding**: Sard uses `v-model`; this project uses `v-model:value`
- **Selection mode**: single selection only for now; multi-select (`multiple` / `multiple-limit` / toolbar) is planned
- **Options**: Sard uses `SelectOption` / `SelectOptionGroup` child components; this project uses object arrays where an item with `children` is a group
- **Custom content**: an `option` scoped slot replaces Sard's two-level `SelectOption` default and `label` slots
- **Value type**: only `string | number`, no `any`

## Notes

- The component is controlled and holds no internal value; clicking the active option emits nothing and cannot deselect
- When `filter-method` is passed, no local filtering happens: only `update:filter-value` is emitted and the callback is invoked — write remote data back to `options` yourself
- Group titles (items with `children`) are not selectable; filtering keeps only groups with matching children
- Component-level `disabled` takes precedence over option-level `disabled`; both block click events
- Call `scrollTop()` after data updates to reset the list position on long lists

See [SelectPopup](/en/components/select-popup) and [SelectInput](/en/components/select-input) for more examples.
