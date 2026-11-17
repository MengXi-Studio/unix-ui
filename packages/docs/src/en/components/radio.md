---
title: Radio
subtitle: 单选框
demo: pages-sub/radio/radio
added: 0.7.0
---

## Introduction

Radio components: single selection within a group of options. Split into four components:

- `m-radio-group`: radio group container (current value via v-model:value, shared visual specs)
- `m-radio`: a single radio (joins the group by name; standalone usage is controlled via the `checked` prop)
- `m-radio-popup` / `m-radio-input`: popup radio and radio input forms, see [RadioPopup](/en/components/radio-popup) and [RadioInput](/en/components/radio-input)

> Value type: UTS has no `any`, option keys are `string | number`, current value is `RadioValue | null` (`null` = nothing selected); `'1'` equals `1` (stringified comparison).

## Usage

### Basic Usage {#demo-basic}

```vue
<m-radio-group v-model:value="value">
	<m-radio name="a">Radio a</m-radio>
	<m-radio name="b">Radio b</m-radio>
</m-radio-group>
```

### Standalone {#demo-independent}

Outside a group the radio is controlled (stateless; taps only emit events, the parent writes back):

```vue
<m-radio :checked="value == 'a'" @click="value = 'a'">Standalone a</m-radio>
<m-radio :checked="value == 'b'" @click="value = 'b'">Standalone b</m-radio>
```

### Disabled / Readonly {#demo-disabled}

Per-item `disabled` (ring filled with gray, checked state turns gray) / `readonly` (normal look, not switchable); group-level flags merge with item flags; taps on disabled items still emit `click`:

```vue
<m-radio-group v-model:value="value" disabled>
	<m-radio name="a">Disabled</m-radio>
</m-radio-group>
```

### Custom Shape / Color / Size {#demo-shape}

The group's `shape` / `checked-color` / `icon-size` apply to all items; items may override:

```vue
<m-radio-group v-model:value="value" shape="square" checked-color="#ee0a24" icon-size="24px">
	<m-radio name="a">Square red</m-radio>
	<m-radio name="b" shape="round" checked-color="#07c160">Override</m-radio>
</m-radio-group>
```

### Label Position and Disabled Label {#demo-label}

```vue
<m-radio name="a" label-position="left">Label on left</m-radio>
<m-radio name="b" label-disabled>Label not clickable</m-radio>
```

### Direction {#demo-direction}

```vue
<m-radio-group v-model:value="value" direction="horizontal">
	<m-radio name="a">Horizontal a</m-radio>
	<m-radio name="b">Horizontal b</m-radio>
</m-radio-group>
```

### Custom Icon and Content {#demo-slots}

The `icon` and `default` slots both receive `{ checked, disabled }`:

```vue
<m-radio name="a">
	<template #icon="{ checked }">
		<view :class="checked ? 'on' : ''" />
	</template>
	Custom icon
</m-radio>
```

### With Cell {#demo-cell}

Whole-row toggling: place m-radio in the m-cell `value` slot and write the group value on row tap:

```vue
<m-radio-group v-model:value="value">
	<m-cell v-for="item in list" clickable @click="value = item">
		<template #value>
			<m-radio :name="item" @click.stop />
		</template>
	</m-cell>
</m-radio-group>
```

## API

### Props (m-radio-group)

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| value | Currently selected key (v-model:value; null = none) | RadioValue \| null | `null` |
| disabled | Disable all radios | boolean | `false` |
| readonly | Make all radios readonly | boolean | `false` |
| direction | Layout direction: `vertical` / `horizontal` | RadioDirection | `vertical` |
| icon-size | Icon size (number appends px / string as-is) | string \| number | `''` |
| checked-color | Checked color | string | `''` |
| shape | Shape: `round` / `square` | RadioShape | `round` |
| custom-class / custom-style | Root node styling | - | - |

### Events (m-radio-group)

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Selected value changed | value: RadioValue \| null |
| change | Selected value changed | value: RadioValue \| null |

### Props (m-radio)

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Option key (required in group; string / number) | RadioValue | `null` |
| checked | Checked state (standalone controlled; group-driven in group) | boolean | `false` |
| shape | Shape (inherits group when unset) | RadioShape | `null` |
| disabled | Disabled | boolean | `false` |
| readonly | Readonly (normal look, not switchable) | boolean | `false` |
| label-disabled | Disable label clicks (icon still clickable) | boolean | `false` |
| label-position | Label position: `right` / `left` | RadioLabelPosition | `right` |
| icon-size | Icon size | string \| number | `''` |
| checked-color | Checked color (inherits group when unset) | string | `''` |
| bind-group | Bind to the radio group | boolean | `true` |
| custom-class / custom-style | Root node styling | - | - |

### Slots (m-radio)

| Name | Description | Scope |
| --- | --- | --- |
| default | Custom label | `{ checked, disabled }` |
| icon | Custom icon | `{ checked, disabled }` |

### Events (m-radio)

| Event | Description | Arguments |
| --- | --- | --- |
| change | Checked state changed (both in-group and standalone) | checked: boolean |
| click | Radio tapped (also on disabled / readonly rejection) | event: MouseEvent |

### Methods (m-radio)

| Method | Description | Arguments |
| --- | --- | --- |
| select | Select this item (external call for cell layouts) | - |

## Theming

Customize radio styles with the following SCSS variables (define them directly in the project root `uni.scss`):

| Variable | Description | Default |
| --- | --- | --- |
| $m-radio-padding | Item padding | 10px 16px |
| $m-radio-icon-size | Icon ring size | 20px |
| $m-radio-icon-border-width | Ring border width | 1px |
| $m-radio-icon-border-color | Unchecked ring color | #c8c9cc |
| $m-radio-icon-color | Checked ring and dot color | #1989fa |
| $m-radio-square-radius | square shape ring radius | 4px |
| $m-radio-dot-size | Inner dot size (50% of icon size) | 10px |
| $m-radio-label-gap | Gap between icon and label | 8px |
| $m-radio-label-font-size | Label font size | 14px |
| $m-radio-label-color | Label color | #323233 |
| $m-radio-label-disabled-color | Disabled label color | #c8c9cc |
| $m-radio-icon-disabled-background | Disabled ring fill color | #ebedf0 |
| $m-radio-icon-disabled-color | Disabled checked ring and dot color | #c8c9cc |

See [Theming](/en/guide/theming) for full variables and override instructions.

## Differences from Vant

- **Value type**: Vant uses `any`; this library uses `string | number`, and the current value may be `null` (nothing selected)
- **Icon form**: Vant's default `round` is a filled circle with a white check; this library's `round` is a ring with an inner dot (aligned with Sard's dot-select mental model), `square` is a square with an inner dot, and Vant's white-check form is not provided to avoid confusion with checkbox; Vant's `dot` shape equals this library's default visual, so no separate value exists
- **readonly**: adopted from Sard; both item and group support readonly with a normal look
- **Re-tap selected item**: cannot be deselected (Vant semantics); use [RadioInput](/en/components/radio-input)'s `clearable` for clearing
- **Slot syntax**: uvue has no v-slot shorthand; declare via `<template #icon="{ checked }">`

## Notes

- `name` is required in a group (null degrades to standalone controlled form)
- Re-tapping the selected item does not deselect or re-emit `change` (rigid single selection)
- The icon is a hand-drawn view (ring + dot); the icon slot replaces it entirely
