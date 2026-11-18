---
title: Segmented
subtitle: 分段控制器
demo: pages-sub/segmented/segmented
added: 0.7.0
---

## Introduction

A segmented control for single selection among several options. Options split the track equally and the active one is marked by a white thumb that slides smoothly. Supports three sizes, a pill shape, vertical direction, a custom-content slot, ellipsis, whole/option-level disabled and readonly.

## Demos

### Basic usage {#demo-basic}

Bind the value with `v-model:value` and define options with `options`:

```vue
<m-segmented v-model:value="value" :options="options" />
```

```uts
const value = ref<string | number>('早班')
const options = ref<UTSJSONObject[]>([
	{ label: '早班', value: '早班' },
	{ label: '中班', value: '中班' },
	{ label: '晚班', value: '晚班' }
] as UTSJSONObject[])
```

### Size {#demo-size}

`size` accepts `small` / `medium` (default) / `large`; height, font size and padding change together:

```vue
<m-segmented v-model:value="value" :options="options" size="small" />
<m-segmented v-model:value="value" :options="options" />
<m-segmented v-model:value="value" :options="options" size="large" />
```

### Pill shape {#demo-shape}

```vue
<m-segmented v-model:value="value" :options="options" shape="round" />
```

### Vertical direction {#demo-vertical}

```vue
<m-segmented v-model:value="value" :options="options" direction="vertical" />
```

### Custom content {#demo-custom}

The `item` slot renders custom content such as icon + text; its scope is `{ option, index, active, disabled }`:

```vue
<m-segmented v-model:value="value" :options="options" size="large">
	<template #item="{ option, active }">
		<view class="custom-item">
			<m-icon :name="option.getString('icon')!" :custom-class="active ? 'custom-item__icon custom-item__icon--active' : 'custom-item__icon'" />
			<text :class="active ? 'custom-item__text custom-item__text--active' : 'custom-item__text'">{{ option.getString('label') }}</text>
		</view>
	</template>
</m-segmented>
```

### Icon only {#demo-icon-only}

With only an icon in the slot, options stay equally split and centered:

```vue
<m-segmented v-model:value="value" :options="options" size="large">
	<template #item="{ option, active }">
		<m-icon :name="option.getString('icon')!" :custom-class="active ? 'custom-item__icon custom-item__icon--active' : 'custom-item__icon'" />
	</template>
</m-segmented>
```

### Ellipsis {#demo-ellipsis}

`ellipsis` defaults to `true` (single-line ellipsis); set it to `false` to allow wrapping:

```vue
<m-segmented v-model:value="value" :options="options" />
<m-segmented v-model:value="value" :options="options" :ellipsis="false" />
```

### Disabled and readonly {#demo-disabled}

Component-level `disabled` greys out all options; the `disabled` field on an option only disables that item; `readonly` keeps the active state but blocks switching:

```vue
<m-segmented v-model:value="value" :options="options" disabled />
<m-segmented v-model:value="value" :options="options" readonly />
```

### Custom field names {#demo-field-names}

`fieldNames` maps `label` / `value` / `disabled`; missing keys fall back to the same names:

```vue
<m-segmented v-model:value="value" :options="options" :field-names="fieldNames" />
```

```uts
const fieldNames = ref<UTSJSONObject>({ label: 'text', value: 'code', disabled: 'off' })
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | Active value (v-model:value) | string \| number | `''` |
| options | Option list | UTSJSONObject[] | `[]` |
| field-names | Field mapping (label / value / disabled) | UTSJSONObject \| null | `null` |
| size | Size, one of `small` `medium` `large` | string | `medium` |
| shape | Shape, one of `square` `round` | string | `square` |
| direction | Layout direction, one of `horizontal` `vertical` | string | `horizontal` |
| disabled | Disable all options | boolean | `false` |
| readonly | Readonly (shows the active state, blocks switching) | boolean | `false` |
| ellipsis | Single-line ellipsis for labels | boolean | `true` |
| duration | Thumb animation duration in seconds, 0 disables it | number | `0.2` |
| custom-class / custom-style | Pass-through classes / styles on the root node | - | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:value | Active value changed (v-model:value) | value: string \| number |
| change | Active value changed | value: string \| number |

### Slots

| Name | Scope | Description |
| --- | --- | --- |
| item | `{ option, index, active, disabled }` | Custom item content; `option` is the raw option object (UTSJSONObject) |

## Theming

Define the following variables directly in the project root `uni.scss` to override the defaults:

| Variable | Description | Default |
| --- | --- | --- |
| $m-segmented-padding | Container padding | 2px |
| $m-segmented-bg | Container background | #f2f3f5 |
| $m-segmented-radius | Square corner radius | $m-radius-md |
| $m-segmented-radius-round | Pill corner radius | $m-radius-max |
| $m-segmented-thumb-bg | Thumb background | white |
| $m-segmented-thumb-radius | Thumb radius | 4px |
| $m-segmented-thumb-radius-round | Thumb radius in pill shape | $m-radius-max |
| $m-segmented-thumb-shadow | Thumb shadow | 0 2px 4px rgba(0, 0, 0, 0.08) |
| $m-segmented-height-sm | Small height | 28px |
| $m-segmented-height | Medium height | 32px |
| $m-segmented-height-lg | Large height | 40px |
| $m-segmented-font-size | Medium font size | 14px |
| $m-segmented-font-size-sm | Small font size | 12px |
| $m-segmented-font-size-lg | Large font size | 16px |
| $m-segmented-item-padding | Medium item padding | 0 12px |
| $m-segmented-item-padding-sm | Small item padding | 0 8px |
| $m-segmented-item-padding-lg | Large item padding | 0 16px |
| $m-segmented-item-padding-vertical | Vertical item padding | 8px 12px |
| $m-segmented-item-padding-vertical-sm | Vertical small item padding | 6px 8px |
| $m-segmented-item-padding-vertical-lg | Vertical large item padding | 10px 16px |
| $m-segmented-item-color | Inactive text color | $m-text-color-tertiary |
| $m-segmented-item-color-active | Active text color | $m-text-color |
| $m-segmented-item-color-disabled | Disabled text color | $m-text-color-fourth |

## Differences from Sard

- **Binding**: Sard uses `v-model`; this project uses `v-model:value`
- **Value type**: only `string | number`, no `any`
- **Options**: object arrays only; map primitive arrays to `{ label, value }` yourself
- **Custom content**: an `item` scoped slot replaces the `segmented-item` child component
- **Width**: options always split the track equally, never sized by content
- **Same-value click**: emits nothing and cannot deselect

## Notes

- The component is controlled; when `value` matches no option the thumb is hidden and all options are inactive
- Component-level `disabled` takes precedence over option-level `disabled`; `readonly` blocks switching without changing the visuals
- The thumb animation uses `UniElement.animate`; on mini programs it falls back to direct placement, and `duration: 0` disables animation entirely
