---
title: Cascader
subtitle: Cascader
demo: pages-sub/cascader/cascader
added: 0.3.0
---

## Introduction

Cascader component for multi-level linked selection (e.g. province/city/district, categories). Top tabs show the selected title of each level (unselected level shows the placeholder), clicking an option enters the next level, and finishing the last level (children missing or empty array) triggers `finish`. Levels are hosted by a swiper with swipe gesture support.

This is a pure inline panel: the popup form is composed by [CascaderPopup](/en/components/cascader-popup) and the form-trigger form by [CascaderInput](/en/components/cascader-input).

The options tree is a dynamic type `UTSJSONObject[]` (supporting `field-names` mapping and async loading); demos and examples build it with `JSON.parse<UTSJSONObject[]>`:

```ts
const options: UTSJSONObject[] = JSON.parse<UTSJSONObject[]>(`[
	{ "text": "Zhejiang", "value": "330000", "children": [
		{ "text": "Hangzhou", "value": "330100", "children": [
			{ "text": "Xihu", "value": "330106" }
		]}
	]}
]`) ?? []
```

## Usage

### Basic {#demo-basic}

`v-model:value` binds the selected leaf value (`string | number`), clicking an option triggers `change` (including intermediate levels), completing the last level triggers `finish`:

```vue
<m-cascader
	v-model:value="value"
	title="Select region"
	:options="options"
	@change="onChange"
	@finish="onFinish"
/>
```

### Number value {#demo-number}

Option value supports number type: path matching is normalized to strings internally, event payloads keep the original value.

```vue
<m-cascader :options="numberOptions" :show-header="false" @finish="onFinish" />
```

### Active color and options height {#demo-color}

`active-color` overrides the selected text / check icon / tab underline theme color; `options-height` (px) overrides the options area height (`0` falls back to the theme variable `$m-cascader-options-height`, default 384):

```vue
<m-cascader :options="options" :options-height="200" active-color="#07c160" />
```

### Disable swipe {#demo-swipeable}

Set `swipeable` to `false` to disable swipe gesture level switching; only tab clicks or option clicks switch levels. `placeholder` customizes the unselected tab text:

```vue
<m-cascader :options="options" :swipeable="false" placeholder="Select city" />
```

### Async loading {#demo-async}

The component consumes the reactive reference of `options`: modify the option's `children` in the `change` callback (fill after a simulated request) and the new level renders automatically. An empty children array is treated as a leaf and triggers `finish` directly (show loading states with [Loading](/en/components/loading) / [Toast](/en/components/toast) yourself):

```ts
const onChange = (event: CascaderChangeEvent) => {
	if (event.tabIndex != 0) return
	const province = event.selectedOptions[0]
	if (province.getArray('children') != null) return
	setTimeout(() => {
		province.set('children', loadedChildren) // simulate request fill
	}, 600)
}
```

### Custom field names {#demo-field-names}

`field-names` maps the option tree field names (aligned with Vant); the `disabled` / `color` fields remain fixed keys:

```ts
const nameFields: CascaderFieldNames = {
	text: 'name',
	value: 'id',
	children: 'sub'
}
```

```vue
<m-cascader :options="options" :field-names="nameFields" />
```

### Slots {#demo-slots}

Four slots: `title` / `option` / `options-top` / `options-bottom`; the `option` slot scope is `{ option, selected }`:

```vue
<m-cascader :options="options">
	<template #title>
		<text>Select category</text>
	</template>
	<template #options-top>
		<text>Stock updates every Wednesday 10:00</text>
	</template>
	<template #option="{ option, selected }">
		<text>{{ option.getString('text') }}</text>
	</template>
	<template #options-bottom>
		<text>Bottom area</text>
	</template>
</m-cascader>
```

## API

### CascaderProps

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected value (`v-model:value`; leaf value, `null` unselected) | CascaderValue \| null | `null` |
| options | Options tree (dynamic type) | UTSJSONObject[] \| null | `null` |
| title | Title | string | `''` |
| placeholder | Placeholder text of unselected tab | string | `请选择` |
| active-color | Theme color (selected text / check / tab underline) | string | `''` |
| closeable | Show header close icon | boolean | `true` |
| close-icon | Close icon name | IconName | `cross` |
| show-header | Show header | boolean | `true` |
| field-names | Custom option field names (`null` uses text / value / children) | CascaderFieldNames \| null | `null` |
| options-height | Options area height px (`0` uses theme variable) | number | `0` |
| swipeable | Enable swipe gesture level switching | boolean | `true` |
| custom-class | Custom root class | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

### CascaderFieldNames

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| text | Option text field name | string | `text` |
| value | Option value field name | string | `value` |
| children | Children field name | string | `children` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Selected value changed (`v-model:value`; emitted on both change and finish) | value: CascaderValue |
| change | Clicked an option (including intermediate levels) | event: CascaderChangeEvent |
| finish | Finished the last level (children missing or empty array) | event: CascaderChangeEvent |
| close | Clicked the close icon | - |
| click-tab | Clicked a tab (not emitted for swipe gestures) | tabIndex: number, title: string |

### CascaderChangeEvent

| Field | Description | Type |
| --- | --- | --- |
| value | Value of the clicked option (original value) | CascaderValue |
| selectedOptions | Full selected path (option objects of each level) | UTSJSONObject[] |
| tabIndex | Level index of the clicked option | number |

### Slots

| Name | Description |
| --- | --- |
| title | Title |
| option | Option row content (scope: `option` option object, `selected` selected or not) |
| options-top | Above options area (scope: `tabIndex`) |
| options-bottom | Below options area (scope: `tabIndex`) |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-cascader-background | Panel background | #ffffff |
| $m-cascader-header-height | Header height | 48px |
| $m-cascader-header-title-font-size | Title font size | 16px |
| $m-cascader-header-title-font-weight | Title font weight | bold |
| $m-cascader-header-title-color | Title color | #323233 |
| $m-cascader-close-icon-size | Close icon size | 22px |
| $m-cascader-close-icon-color | Close icon color | #c8c9cc |
| $m-cascader-tabs-height | Tabs area height | 48px |
| $m-cascader-tab-max-width | Max width of a single tab (ellipsis on overflow) | 100px |
| $m-cascader-tab-font-size | Tab font size | 14px |
| $m-cascader-tab-color | Tab text color | #323233 |
| $m-cascader-tab-active-color | Active tab text and underline color | #1989fa |
| $m-cascader-tab-line-width | Underline width | 20px |
| $m-cascader-tab-line-height | Underline height | 3px |
| $m-cascader-tab-line-radius | Underline radius | 3px |
| $m-cascader-options-height | Options area height | 384px |
| $m-cascader-option-height | Option row height | 40px |
| $m-cascader-option-padding | Option row padding | 0 16px |
| $m-cascader-option-font-size | Option font size | 14px |
| $m-cascader-option-text-color | Option text color | #323233 |
| $m-cascader-option-active-color | Selected text and check color | #1989fa |
| $m-cascader-option-disabled-color | Disabled text color | #c8c9cc |
| $m-cascader-option-check-size | Check icon size | 16px |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Vant

- Component split: Vant uses a single component with `poppable` to switch popup/inline forms; this project splits into three — `m-cascader` pure panel, `m-cascader-popup` popup, `m-cascader-input` form input
- options is the dynamic type `UTSJSONObject[]` (supports runtime field-names mapping and async filling), built via `JSON.parse<UTSJSONObject[]>`; Vant uses static object arrays
- `options-height` is a project extension prop: Vant only offers CSS variable `--van-cascader-options-height`; here the prop overrides the theme variable (`0` falls back, default 384px same as Vant)
- Tabs are fixed-width (`$m-cascader-tab-max-width` 100px) in a horizontal scroll-view aligned by `scroll-into-view`; Vant uses equal-width adaptive tabs with smooth centering
- Async loading has no built-in loading: an empty children array is treated as a leaf and triggers `finish` directly; loading states are up to the business (matching Vant's actual "showLoadingToast by business" usage)
- Option `className` field is not supported; `disabled` / `color` semantics match Vant
