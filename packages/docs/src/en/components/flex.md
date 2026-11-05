---
title: Flex
demo: pages-sub/flex/flex
added: 0.3.0
---

## Introduction

The flex component uniformly sets the direction, spacing and alignment of child elements — equivalent to configuring `flex-direction` / `align-items` / `justify-content` / `flex-wrap` / `flex` on a flex container.

Spacing is implemented via the margins of the **m-flex-item** child component (flex `gap` is not supported by ucss on the App platform), so each child element must be wrapped with `<m-flex-item>`; unwrapped children do not participate in spacing. Used standalone, m-flex-item degrades to an ordinary vertical container.

## Examples

### Basic Usage {#demo-basic}

Arranges horizontally with `medium` spacing (theme default 8px).

```vue
<m-flex>
	<m-flex-item><m-button type="primary">Button</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">Button</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">Button</m-button></m-flex-item>
</m-flex>
```

### Direction {#demo-direction}

`direction` is equivalent to `flex-direction`, can be set to `row` `row-reverse` `column` `column-reverse`. The default is `row`. With reversed directions the first visual item is the last child, while spacing is still injected by position, so no extra space appears at either end.

```vue
<m-flex direction="column" gap="medium">
	<m-flex-item><m-button type="primary" block>Button 1</m-button></m-flex-item>
	<m-flex-item><m-button type="primary" block>Button 2</m-button></m-flex-item>
</m-flex>
<m-flex direction="row-reverse" gap="medium">
	<m-flex-item><m-button type="primary">1</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">2</m-button></m-flex-item>
</m-flex>
```

### Gap Sizes {#demo-gap}

`gap` has three built-in sizes: `small` (`$m-flex-gap-sm`), `medium` (`$m-flex-gap`, the default) and `large` (`$m-flex-gap-lg`).

```vue
<m-flex gap="small">
	<m-flex-item><m-button type="primary">small</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">small</m-button></m-flex-item>
</m-flex>
<m-flex gap="large">
	<m-flex-item><m-button type="primary">large</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">large</m-button></m-flex-item>
</m-flex>
```

### Custom Gap {#demo-custom}

`gap` also accepts custom sizes: a number gets a px suffix appended, a string is used as is (e.g. `'30px'`).

```vue
<m-flex :gap="20">
	<m-flex-item><m-button type="primary">20px</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">20px</m-button></m-flex-item>
</m-flex>
<m-flex gap="30px">
	<m-flex-item><m-button type="primary">30px</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">30px</m-button></m-flex-item>
</m-flex>
```

### Main-Axis Alignment {#demo-justify}

`justify` is equivalent to `justify-content`, can be set to `start` `end` `center` `between` `around` `evenly`; when omitted it falls back to `start`.

```vue
<m-flex justify="center">
	<m-flex-item><m-button size="small">center</m-button></m-flex-item>
	<m-flex-item><m-button size="small">Button</m-button></m-flex-item>
</m-flex>
<m-flex justify="between">
	<m-flex-item><m-button size="small">between</m-button></m-flex-item>
	<m-flex-item><m-button size="small">Button</m-button></m-flex-item>
</m-flex>
```

### Cross-Axis Alignment {#demo-align}

`align` is equivalent to `align-items`, can be set to `start` `end` `center` `baseline`; when omitted the view default `stretch` applies. `baseline` is not supported on App and falls back to flex-start.

```vue
<m-flex align="start" gap="medium">
	<m-flex-item><m-button size="small" type="primary">start</m-button></m-flex-item>
	<m-flex-item><view class="box"></view></m-flex-item>
</m-flex>
<m-flex align="center" gap="medium">
	<m-flex-item><m-button size="small" type="primary">center</m-button></m-flex-item>
	<m-flex-item><view class="box"></view></m-flex-item>
</m-flex>
```

### Wrapping {#demo-wrap}

With `wrap` enabled, child elements wrap automatically when they exceed the width; it only applies to `row` / `row-reverse`. The main-axis spacing is every item's margin-left compensated by an equal negative margin on the container (each wrapped line starts flush), and the line spacing is the item's margin-bottom — an extra spacing at the bottom of the last line is a known limitation (children cannot detect where a line breaks).

```vue
<m-flex wrap gap="medium">
	<m-flex-item><m-button type="primary">Button 1</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">Button 2</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">Button 3</m-button></m-flex-item>
</m-flex>
```

### Flex Shorthand {#demo-flex}

`flex` forwards the CSS `flex` shorthand to the container itself (e.g. to share space as a flex child of the parent).

```vue
<view class="row">
	<m-flex flex="1" gap="small">
		<m-flex-item><m-button size="small">left</m-button></m-flex-item>
	</m-flex>
	<m-flex flex="1" justify="end" gap="small">
		<m-flex-item><m-button size="small">right</m-button></m-flex-item>
	</m-flex>
</view>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| direction | Layout direction, can be set to `row` `row-reverse` `column` `column-reverse` | FlexDirection | `row` |
| gap | Spacing size: built-in `small` `medium` `large`, or a custom size as a number (px appended) / string (used as is) | FlexGap | `medium` |
| align | Cross-axis alignment, can be set to `start` `end` `center` `baseline` | FlexAlign \| null | null |
| justify | Main-axis alignment, can be set to `start` `end` `center` `between` `around` `evenly` | FlexJustify \| null | null |
| flex | CSS `flex` shorthand applied to the container itself | string | - |
| wrap | Whether to wrap automatically, only for `row` / `row-reverse` | boolean | `false` |
| custom-class | Custom root class name | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

### Slots

| Name | Description |
| --- | --- |
| default | Child content (children should be wrapped with m-flex-item) |

### FlexItem Props (m-flex-item)

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| custom-class | Custom root class name | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

## Theming

Spacing can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-flex-gap-sm | Spacing for `gap="small"` | 4px |
| $m-flex-gap | Spacing for `gap="medium"` (default) | 8px |
| $m-flex-gap-lg | Spacing for `gap="large"` | 12px |

See [Theming](/en/guide/theming) for the full variable list and override approach.
