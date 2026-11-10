---
title: Space
demo: pages-sub/space/space
added: 0.1.0
---

## Introduction

The space component sets a uniform spacing between child elements. It supports horizontal and vertical directions, custom spacing, alignment, wrapping and block filling.

Spacing is implemented via the margins of the **m-space-item** child component (flex `gap` is not supported by ucss on the App platform), so each child element must be wrapped with `<m-space-item>`; unwrapped children do not participate in spacing. Used standalone, m-space-item degrades to an ordinary vertical container.

## Examples

### Basic Usage {#demo-basic}

Arranges horizontally by default with the theme default spacing (8px) between child elements.

```vue
<m-space>
	<m-space-item><m-button type="primary">Button</m-button></m-space-item>
	<m-space-item><m-button type="primary">Button</m-button></m-space-item>
	<m-space-item><m-button type="primary">Button</m-button></m-space-item>
</m-space>
```

### Vertical Spacing {#demo-vertical}

Use the `direction` attribute to set the spacing direction, can be set to `horizontal` `vertical`. The default is `horizontal`.

```vue
<m-space direction="vertical">
	<m-space-item><m-button type="primary" block>Button</m-button></m-space-item>
	<m-space-item><m-button type="primary" block>Button</m-button></m-space-item>
</m-space>
```

### Custom Spacing {#demo-custom}

`size` accepts a number (px is appended), a string (used as is) and an array `[horizontal, vertical]`; the theme default spacing is used when not set, and the vertical direction takes the first array value as the main-axis spacing.

```vue
<m-space :size="20">
	<m-space-item><m-button>20px spacing</m-button></m-space-item>
	<m-space-item><m-button>20px spacing</m-button></m-space-item>
</m-space>
<m-space size="12px">
	<m-space-item><m-button>12px spacing</m-button></m-space-item>
	<m-space-item><m-button>12px spacing</m-button></m-space-item>
</m-space>
<m-space :size="[20, 8]" wrap>
	<m-space-item><m-button>20 horizontal</m-button></m-space-item>
	<m-space-item><m-button>8 vertical after wrapping</m-button></m-space-item>
</m-space>
```

### Alignment {#demo-align}

Use the `align` attribute to set the alignment of child elements, can be set to `start` `end` `center` `baseline`. When not set, the horizontal direction defaults to `center` and the vertical direction defaults to `stretch`.

```vue
<m-space align="start">
	<m-space-item><m-button>Align start</m-button></m-space-item>
	<m-space-item><m-button>Align start</m-button></m-space-item>
</m-space>
<m-space align="center">
	<m-space-item><m-button>Align center</m-button></m-space-item>
	<m-space-item><m-button>Align center</m-button></m-space-item>
</m-space>
<m-space align="end">
	<m-space-item><m-button>Align end</m-button></m-space-item>
	<m-space-item><m-button>Align end</m-button></m-space-item>
</m-space>
<m-space align="baseline">
	<m-space-item><m-button>Align baseline</m-button></m-space-item>
	<m-space-item><m-button>Align baseline</m-button></m-space-item>
</m-space>
```

### Wrapping {#demo-wrap}

Enable the `wrap` attribute so child elements wrap automatically when exceeding the width; effective only in the horizontal direction. The main-axis spacing is implemented via each item's margin-left together with an equal negative margin on the container (all lines start flush with the first), and the line spacing is the item's margin-bottom — the last line has an extra spacing at the bottom (child components cannot detect the wrap position; a known limitation).

```vue
<m-space wrap>
	<m-space-item><m-button type="primary">Button 1</m-button></m-space-item>
	<m-space-item><m-button type="primary">Button 2</m-button></m-space-item>
	<m-space-item><m-button type="primary">Button 3</m-button></m-space-item>
</m-space>
```

### Block Filling

The `fill` attribute makes the component fill the parent element's width as a block; by default the width shrinks to fit the content.

```vue
<m-space direction="vertical" fill>
	<m-space-item><m-button type="primary" block>Button</m-button></m-space-item>
	<m-space-item><m-button type="primary" block>Button</m-button></m-space-item>
</m-space>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Spacing direction, can be set to `horizontal` `vertical` | SpaceDirection | `horizontal` |
| size | Spacing size, px is appended for number, string used as is, array `[horizontal, vertical]`; the theme default spacing is used when not set | SpaceSize \| SpaceSize[] \| null | null |
| align | Alignment, can be set to `start` `end` `center` `baseline`, defaults to `center` horizontally and `stretch` vertically when not set | SpaceAlign \| null | null |
| wrap | Whether to wrap automatically, effective only in the horizontal direction | boolean | `false` |
| fill | Whether to fill the parent element as a block | boolean | `false` |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Slots

| Name | Description |
| --- | --- |
| default | Child element content |

### SpaceItem Props (m-space-item)

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

## Theming

Space styles can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-space-size | Default spacing (when size is not set) | 8px |

See [Theming](/en/guide/theming) for the full variable list and override instructions.
