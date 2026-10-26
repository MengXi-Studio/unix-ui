---
demo: pages-sub/space/space
---

# Space

The space component sets a uniform spacing between child elements, implemented with flex gap. It supports horizontal and vertical directions, custom spacing, alignment, wrapping and block filling.

## Usage

Components follow the easycom convention and can be used without being imported. See [Getting Started](/en/guide/getting-started) for details.

## Examples

### Basic Usage

Arranges horizontally by default with the theme default spacing (8px) between child elements.

```vue
<mxi-space>
	<mxi-button type="primary">Button</mxi-button>
	<mxi-button type="primary">Button</mxi-button>
	<mxi-button type="primary">Button</mxi-button>
</mxi-space>
```

### Vertical Spacing

Use the `direction` attribute to set the spacing direction, can be set to `horizontal` `vertical`. The default is `horizontal`.

```vue
<mxi-space direction="vertical">
	<mxi-button type="primary" block>Button</mxi-button>
	<mxi-button type="primary" block>Button</mxi-button>
</mxi-space>
```

### Custom Spacing

`size` accepts a number (px is appended), a string (used as is) and an array `[horizontal, vertical]`; the theme default spacing is used when not set, and the vertical direction takes the first array value as the main-axis spacing.

```vue
<mxi-space :size="20">20px spacing</mxi-space>
<mxi-space size="12px">12px spacing</mxi-space>
<mxi-space :size="[20, 8]" wrap>20 horizontal / 8 vertical after wrapping</mxi-space>
```

### Alignment

Use the `align` attribute to set the alignment of child elements, can be set to `start` `end` `center` `baseline`. When not set, the horizontal direction defaults to `center` and the vertical direction defaults to `stretch`.

```vue
<mxi-space align="start">Align start</mxi-space>
<mxi-space align="center">Align center</mxi-space>
<mxi-space align="end">Align end</mxi-space>
<mxi-space align="baseline">Align baseline</mxi-space>
```

### Wrapping

Enable the `wrap` attribute so child elements wrap automatically when exceeding the width; effective only in the horizontal direction.

```vue
<mxi-space wrap>
	<mxi-button type="primary">Button 1</mxi-button>
	<mxi-button type="primary">Button 2</mxi-button>
	<mxi-button type="primary">Button 3</mxi-button>
</mxi-space>
```

### Block Filling

The `fill` attribute makes the component fill the parent element's width as a block; by default the width shrinks to fit the content.

```vue
<mxi-space direction="vertical" fill>
	<mxi-button type="primary" block>Button</mxi-button>
	<mxi-button type="primary" block>Button</mxi-button>
</mxi-space>
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

## Theming

Space styles can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $mxi-space-size | Default spacing (when size is not set) | 8px |

See [Theming](/en/guide/theming) for the full variable list and override instructions.
