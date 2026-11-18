---
title: SelectPopup
subtitle: 列表选择弹层
demo: pages-sub/select-popup/select-popup
added: 0.7.0
---

## Introduction

A list selection popup composed of [Popup](/en/components/popup) and [Select](/en/components/select): popup behavior belongs to `m-popup`, list selection belongs to the panel, and this component only composes and forwards. An optional title sits on top, and the popup closes automatically after selection according to `confirm-on-select` (default `true`).

## Demos

### Basic usage {#demo-basic}

Control visibility with `v-model:show`, bind the value with `v-model:value`, and render a title with `title`:

```vue
<m-select-popup v-model:show="show" v-model:value="value" :options="options" title="Select line" />
```

```uts
const show = ref<boolean>(false)
const value = ref<string | number>('line-2')
const options = ref<UTSJSONObject[]>([
	{ label: '机加工一线', value: 'line-1' },
	{ label: '注塑二线', value: 'line-2' },
	{ label: '压铸四线', value: 'line-4' }
] as UTSJSONObject[])
```

### Title and filtering {#demo-filter}

`filterable` shows a filter box inside the popup; filtering behaves the same as [Select](/en/components/select):

```vue
<m-select-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	title="Select line"
	filterable
	filter-placeholder="Type a keyword"
/>
```

### Keep open on select {#demo-keep-open}

With `confirm-on-select` set to `false`, selecting an option does not close the popup, which suits continuous operations:

```vue
<m-select-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	title="Continuous selection"
	:confirm-on-select="false"
/>
```

### Custom options {#demo-slot}

The `option` slot is forwarded to the inner panel; its scope is `{ option, index, selected, disabled }`:

```vue
<m-select-popup v-model:show="show" v-model:value="value" :options="colorOptions" title="Select color">
	<template #option="{ option, selected }">
		<view class="color-item">
			<view class="color-item__block" :style="'background-color: ' + option.getString('value')! + ';'"></view>
			<text>{{ option.getString('label') }}</text>
		</view>
	</template>
</m-select-popup>
```

### Bottom slot {#demo-bottom-slot}

The `bottom` slot sits at the bottom of the list and can hold load-more or hint content:

```vue
<m-select-popup v-model:show="show" v-model:value="value" :options="options" title="With footer">
	<template #bottom>
		<view class="bottom-tip"><text>Footer slot: load more / hints</text></view>
	</template>
</m-select-popup>
```

### Popup lifecycle {#demo-lifecycle}

`open` / `opened` / `close` / `closed` forward the `m-popup` lifecycle events:

```vue
<m-select-popup
	v-model:show="show"
	:options="options"
	@open="onOpen"
	@opened="onOpened"
	@close="onClose"
	@closed="onClosed"
/>
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| title | Top title (hidden when empty) | string | `''` |
| value | Active value (`v-model:value`) | string \| number | `''` |
| options | Option list; an item with `children` is treated as a group | UTSJSONObject[] | `[]` |
| field-names | Field mapping (label / value / disabled / children) | UTSJSONObject \| null | `null` |
| filterable | Whether to show the filter box | boolean | `false` |
| filter-placeholder | Filter box placeholder | string | `请输入关键词` |
| filter-value | Filter value (`v-model:filter-value`) | string | `''` |
| filter-method | Remote filter callback; disables local filtering when present | (query: string) => void \| null | `null` |
| disabled | Disable the list | boolean | `false` |
| empty-text | Empty list text | string | `暂无选项` |
| confirm-on-select | Whether to close the popup after selection | boolean | `true` |
| position | Popup position, one of `top` `bottom` `left` `right` `center` | string | `bottom` |
| round | Whether to use round corners | boolean | `true` |
| close-on-click-overlay | Whether clicking the overlay closes the popup | boolean | `true` |
| safe-area-inset-top | Top safe area | boolean | `false` |
| safe-area-inset-bottom | Bottom safe area | boolean | `true` |
| z-index | Popup stacking level | number | `100` |
| duration | Animation duration (seconds) | number | `0.3` |
| custom-class / custom-style | Applied to the inner list root | - | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:show | Visibility changed (`v-model:show`) | show: boolean |
| update:value | Active value changed (`v-model:value`) | value: string \| number |
| change | Active value changed (popup then closes per `confirm-on-select`) | value: string \| number |
| select | Active item changed (raw option object) | option: UTSJSONObject |
| update:filterValue | Filter value changed (`v-model:filter-value`) | query: string |
| open / opened | Popup opening / opened | - |
| close / closed | Popup closing / closed | - |
| click-overlay | Overlay clicked | - |

### Methods

| Method | Description |
| --- | --- |
| scrollTop | Scroll the list back to the top (forwarded to the inner Select) |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| option | `{ option, index, selected, disabled }` | Custom item content; `option` is the raw option object (UTSJSONObject) |
| bottom | - | Content at the bottom of the list (load more / hints) |

## Theming

Overlay, corner radius and animation are controlled by [Popup](/en/components/popup) theme variables; list appearance is controlled by [Select theming](/en/components/select). Title-related variables:

| Variable | Description | Default |
| --- | --- | --- |
| $m-select-header-padding | Title padding | 14px 12px 8px 12px |
| $m-select-header-font-size | Title font size | 16px |
| $m-select-header-color | Title color | $m-text-color |
| $m-select-bg | Popup content background | $m-white |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Sard

- **Visibility binding**: Sard uses `v-model:visible`; this project uses `v-model:show`
- **Value binding**: Sard uses `v-model`; this project uses `v-model:value`
- **Selection mode**: single selection only for now; multi-select is planned
- **Options**: Sard uses `SelectOption` / `SelectOptionGroup` child components; this project uses object arrays where an item with `children` is a group
- **Custom content**: an `option` scoped slot replaces Sard's `SelectOption` default and `label` slots
- **Value type**: only `string | number`, no `any`

## Notes

- The popup closes automatically after selection (`confirm-on-select: true`); clicking the active option emits no `change`, so the popup will not close either
- When `filter-method` is passed, no local filtering happens: only the query is emitted — write remote data back to `options` yourself
- `custom-class` / `custom-style` apply to the inner list root, not the popup container; tune the popup with props such as `position` / `round`
- The popup stacking level defaults to `100`; adjust `z-index` to coordinate with other floating layers

See [Select](/en/components/select) and [SelectInput](/en/components/select-input) for more examples.
