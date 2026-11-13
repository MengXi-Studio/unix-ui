---
title: Checkbox
subtitle: 复选框
demo: pages-sub/checkbox/checkbox
added: 0.5.0
---

## Introduction

Checkbox components: multi-select within a group of options. Split into four components:

- `m-checkbox-group`: checkbox group container (selected set via v-model:value, shared visual specs and max)
- `m-checkbox`: a single checkbox (joins the group by name; standalone usage keeps its own boolean state via v-model)
- `m-checkbox-popup` / `m-checkbox-input`: popup multi-select and checkbox input forms, see [CheckboxPopup](/en/components/checkbox-popup) and [CheckboxInput](/en/components/checkbox-input)

> Value type: UTS has no `any[]`, so the selected set is `Array<string | number>` (verified to compile on all targets); name only accepts string / number, and `'1'` equals `1` (stringified comparison).

## Usage

### Basic Usage {#demo-basic}

```vue
<m-checkbox-group v-model:value="list">
	<m-checkbox name="a">Checkbox a</m-checkbox>
	<m-checkbox name="b">Checkbox b</m-checkbox>
</m-checkbox-group>
```

### Standalone {#demo-independent}

Outside a group, bind a boolean via `v-model`:

```vue
<m-checkbox v-model:modelValue="checked">Standalone checkbox</m-checkbox>
```

### Disabled {#demo-disabled}

Per-item `disabled` or a whole-group disable; taps on disabled items still emit `click`:

```vue
<m-checkbox-group v-model:value="list" disabled>
	<m-checkbox name="a">Disabled</m-checkbox>
</m-checkbox-group>
```

### Custom Shape / Color / Size {#demo-shape}

The group's `shape` / `checked-color` / `icon-size` apply to all items; items may override:

```vue
<m-checkbox-group v-model:value="list" shape="square" checked-color="#ee0a24" icon-size="24px">
	<m-checkbox name="a">Square red</m-checkbox>
	<m-checkbox name="b" shape="round" checked-color="#07c160">Override</m-checkbox>
</m-checkbox-group>
```

### Label Position and Disabled Label {#demo-label}

```vue
<m-checkbox name="a" label-position="left">Label on the left</m-checkbox>
<m-checkbox name="b" label-disabled>Label not clickable (icon works)</m-checkbox>
```

### Maximum Amount {#demo-max}

`max` limits selections; once reached, further taps only emit `click`:

```vue
<m-checkbox-group v-model:value="list" :max="2">
	<m-checkbox name="a">Option a</m-checkbox>
	<m-checkbox name="b">Option b</m-checkbox>
	<m-checkbox name="c">Option c</m-checkbox>
</m-checkbox-group>
```

### Direction {#demo-direction}

```vue
<m-checkbox-group v-model:value="list" direction="horizontal">
	<m-checkbox name="a">Horizontal a</m-checkbox>
	<m-checkbox name="b">Horizontal b</m-checkbox>
</m-checkbox-group>
```

### Custom Icon and Content {#demo-slots}

Both the `icon` and `default` slots expose `{ checked, disabled }`:

```vue
<m-checkbox name="a">
	<template #icon="{ checked }">
		<view :class="checked ? 'on' : ''" />
	</template>
	Custom icon
</m-checkbox>
```

### Check All and Indeterminate {#demo-indeterminate}

`indeterminate` shows a dash for the partially selected state; drive the group set directly or via `toggleAll`:

```vue
<m-checkbox :model-value="allChecked" :indeterminate="indeterminate" @click="toggleAll">Check all</m-checkbox>
<m-checkbox-group v-model:value="list" @change="onChange">
	<m-checkbox name="a">Option a</m-checkbox>
	<m-checkbox name="b">Option b</m-checkbox>
</m-checkbox-group>
```

### With Cell {#demo-cell}

Toggle on the whole row: put m-checkbox into m-cell's `value` slot and call `toggle()` via ref (or mutate the set):

```vue
<m-checkbox-group v-model:value="list">
	<m-cell v-for="item in list" clickable @click="toggle(item)">
		<template #value>
			<m-checkbox :name="item" @click.stop />
		</template>
	</m-cell>
</m-checkbox-group>
```

## API

### CheckboxGroupProps (m-checkbox-group)

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected name set (v-model:value) | CheckboxValueArray | `[]` |
| disabled | Disable all checkboxes | boolean | `false` |
| max | Maximum selectable count (0 unbounded) | number | `0` |
| direction | Layout direction: `vertical` / `horizontal` | CheckboxDirection | `vertical` |
| icon-size | Icon size (number gets px appended) | string \| number | `''` |
| checked-color | Checked color | string | `''` |
| shape | Shape: `round` / `square` | CheckboxShape | `round` |
| custom-class / custom-style | Root node styling | - | - |

### CheckboxGroupEvents

| Event | Description | Parameters |
| --- | --- | --- |
| update:value | Selected set changed | value: CheckboxValueArray |
| change | Selected set changed | value: CheckboxValueArray |

### CheckboxGroupMethods

| Method | Description | Parameters |
| --- | --- | --- |
| toggleAll | Toggle all (true check / false uncheck / null invert; bounded by max) | checked?: boolean \| null |

### CheckboxProps (m-checkbox)

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| name | Identifier (required in group; string / number) | CheckboxValue | `null` |
| model-value | Checked state (standalone via v-model:modelValue) | boolean | `false` |
| shape | Shape (inherits group when null) | CheckboxShape | `null` |
| disabled | Disabled | boolean | `false` |
| label-disabled | Disable label taps only | boolean | `false` |
| label-position | Label position: `right` / `left` | CheckboxLabelPosition | `right` |
| icon-size | Icon size | string \| number | `''` |
| checked-color | Checked color (inherits group when empty) | string | `''` |
| bind-group | Bind to the checkbox group | boolean | `true` |
| indeterminate | Indeterminate state (dash visual) | boolean | `false` |
| custom-class / custom-style | Root node styling | - | - |

### CheckboxSlots

| Slot | Description | Scoped props |
| --- | --- | --- |
| default | Custom text | `{ checked, disabled }` |
| icon | Custom icon | `{ checked, disabled }` |

### CheckboxEvents

| Event | Description | Parameters |
| --- | --- | --- |
| update:modelValue | Standalone checked changed | checked: boolean |
| change | Checked changed (both in-group and standalone) | checked: boolean |
| click | Checkbox tapped (also when disabled or max-rejected) | event: MouseEvent |

### CheckboxMethods

| Method | Description | Parameters |
| --- | --- | --- |
| toggle | Toggle checked (for cell compositions) | - |

## Theming

Customize with the following SCSS variables (define them in the project root `uni.scss`):

| Variable | Description | Default |
| --- | --- | --- |
| $m-checkbox-padding | Item padding | 10px 16px |
| $m-checkbox-icon-size | Icon size | 20px |
| $m-checkbox-icon-color | Unchecked icon color | #1989fa |
| $m-checkbox-label-gap | Icon-label gap | 8px |
| $m-checkbox-label-font-size | Label font size | 14px |
| $m-checkbox-label-color | Label color | #323233 |
| $m-checkbox-label-disabled-color | Label disabled color | #c8c9cc |
| $m-checkbox-disabled-opacity | Disabled icon opacity | 0.5 |

See [Theming](/en/guide/theming) for the full variable list and override rules.

## Differences from Vant

- **Value type**: Vant uses `any[]`; this library uses `Array<string | number>` (no any in UTS), and `'1'` equals `1` via stringified comparison
- **Component split**: on top of Vant's CheckboxGroup + Checkbox, the library's three-piece precedent adds `m-checkbox-popup` / `m-checkbox-input` forms
- **toggleAll parameter**: `null` inverts (matching Vant's no-arg invert); invert mode is not bounded by max
- **indeterminate**: when true the icon always shows a dash (independent of checked state); check-all toggling is driven by the consumer via `@click` / set operations
- **slot syntax**: uvue has no v-slot shorthand; declare slots as `<template #icon="{ checked }">`

## Notes

- `name` is required in a group (null degrades to a standalone checkbox with its own state)
- Disabled items are excluded from toggleAll inversion (check-all / uncheck-all still include them, matching Vant)
