---
title: Compact
demo: pages-sub/compact/compact
---

## Introduction

Makes form components connect compactly with merged borders. When `m-compact` wraps `m-button`, buttons inside automatically sense their position: adjacent items join corner radii and merge neighboring borders into 1px, supporting horizontal / vertical directions and block-level filling.

## Examples

### Basic Usage {#demo-basic}

Wrap button components with `m-compact` to turn them into a compact layout; variant mixing is supported.

```vue
<m-compact>
	<m-button>Button 1</m-button>
	<m-button>Button 2</m-button>
	<m-button>Button 3</m-button>
</m-compact>
```

### Block Element {#demo-block}

Set the `block` attribute to make buttons fill the parent element width: horizontally they split evenly via `flex: 1`, no need to set `block` on each button.

```vue
<m-compact block>
	<m-button>Button 1</m-button>
	<m-button>Button 2</m-button>
	<m-button>Button 3</m-button>
</m-compact>
```

### Vertical Layout {#demo-vertical}

Set `direction="vertical"` for a vertical compact layout; without block, buttons shrink to content width. Currently only `Button` combinations are supported.

```vue
<m-compact direction="vertical">
	<m-button>Button 1</m-button>
	<m-button>Button 2</m-button>
	<m-button>Button 3</m-button>
</m-compact>
```

### Vertical Block Element {#demo-vertical-block}

`direction="vertical"` and `block` can be set together: buttons fill the width with radii and borders joining vertically.

```vue
<m-compact direction="vertical" block>
	<m-button>Button 1</m-button>
	<m-button>Button 2</m-button>
	<m-button>Button 3</m-button>
</m-compact>
```

### Dynamic Add / Remove {#demo-dynamic}

When children are added or removed dynamically via `v-if` / `v-for`, first / middle / last positions are recalculated automatically, keeping radii and border joining up to date.

```vue
<m-compact>
	<m-button v-for="item in list" :key="item">Item {{ item }}</m-button>
</m-compact>
```

### Hairline Buttons {#demo-hairline}

0.5px hairline buttons (`hairline`) clear the corresponding side radii and borders inside the compact layout, matching the merge behavior of regular 1px border buttons.

```vue
<m-compact>
	<m-button plain :hairline="true">Button 1</m-button>
	<m-button plain :hairline="true">Button 2</m-button>
	<m-button plain :hairline="true">Button 3</m-button>
</m-compact>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| block | Block-level element, making inner buttons fill the parent element width | boolean | `false` |
| direction | Layout direction, optional values `horizontal` `vertical` | CompactDirection | `horizontal` |

### Slots

| Name | Description |
| --- | --- |
| default | Custom default content (currently only m-button combinations are supported) |

## Theming

The compact layout has no dedicated SCSS variables: radii and border styles are entirely carried by the inner `m-button` itself — overriding the `$m-button-*` variables (e.g. `$m-button-radius`, `$m-border-width`) applies to the compact form as well.

See [Theming](/en/guide/theming) for all variables and how to override them.

## Differences from Sard

- Currently only `m-button` combinations are supported: uni-app x cannot style arbitrary children with CSS structural selectors (`:first-child`, etc.) as on the Web. Instead, m-compact provides an injected context and m-button registers to sense its position and apply modifier classes automatically; input components will be supported once m-input lands
- `direction` / `block` are creation-time snapshots: runtime dynamic switching has no effect; rebuild the component instead
- Border merging strategy: non-first items clear the adjacent-side border and the previous item's border serves as the divider — visually identical to Sard's negative-margin overlap approach
