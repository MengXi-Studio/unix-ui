---
title: Badge
demo: pages-sub/badge/badge
---

## Introduction

Display a badge number or a red dot at the top-right corner of an icon or text, or standalone.

## Examples

### Basic Usage {#demo-basic}

After setting the `content` prop, the badge is displayed at the top-right corner of the wrapped child; the `dot` prop renders a small red dot (ignores content). Wrapping an icon composes with the [Icon](/en/components/icon) component.

```vue
<m-badge content="5">
	<view class="child"></view>
</m-badge>
<m-badge content="Hot">
	<view class="child"></view>
</m-badge>
<m-badge dot>
	<view class="child"></view>
</m-badge>

<!-- Composed with an icon -->
<m-badge content="5">
	<m-icon name="chat-o" size="28" />
</m-badge>
```

### Max {#demo-max}

After setting the `max` prop, when the numeric `content` exceeds the maximum, `{max}+` is displayed (only effective when content is a number).

```vue
<m-badge content="20" max="9">
	<view class="child"></view>
</m-badge>
<m-badge content="200" max="99">
	<view class="child"></view>
</m-badge>
```

### Custom Color {#demo-color}

Use the `color` prop to set the badge background. Semantic color names (`primary` / `success` / `warning` / `danger` / `white`, mapped to theme variables — overriding uni.scss variables takes effect immediately) and CSS color values are supported; defaults to danger red.

```vue
<m-badge content="5" color="primary">
	<view class="child"></view>
</m-badge>
<m-badge dot color="primary">
	<view class="child"></view>
</m-badge>
```

### Custom Position {#demo-position}

Use the `position` prop to set the badge position, defaulting to `top-right`. The badge center sits on the corner.

```vue
<m-badge content="10" position="top-left">
	<view class="child"></view>
</m-badge>
<m-badge content="10" position="bottom-left">
	<view class="child"></view>
</m-badge>
<m-badge content="10" position="bottom-right">
	<view class="child"></view>
</m-badge>
```

### Offset {#demo-offset}

Use the `offset-x` / `offset-y` props to set the offset (split into two props for the most solid UTS type constraints): positive values point right / down respectively, negative values reverse, pure numbers are treated as `px`.

```vue
<m-badge content="10" offset-x="4" offset-y="4">
	<view class="child"></view>
</m-badge>
<m-badge content="10" offset-x="-4" offset-y="-4">
	<view class="child"></view>
</m-badge>
```

### Standalone {#demo-standalone}

When the badge has no child element, it renders as a standalone element.

```vue
<m-badge content="20" />
<m-badge content="200" max="99" />
<m-badge dot />
```

### Custom Badge Content {#demo-slot}

Use the `content` slot to customize the badge content, such as inserting an icon.

```vue
<m-badge>
	<view class="child"></view>
	<template #content>
		<view class="badge-icon-box">
			<m-icon name="success" custom-style="font-size: 10px;" />
		</view>
	</template>
</m-badge>
```

### Zero and show-zero {#demo-zero}

When `content` is numeric 0, the badge is displayed by default; setting `:show-zero="false"` hides it.

```vue
<m-badge content="0">
	<view class="child"></view>
</m-badge>
<m-badge content="0" :show-zero="false">
	<view class="child"></view>
</m-badge>
```

### Platform Note: Parent Clipping

In uni-app x, the view component's `overflow` defaults to `hidden` (unlike W3C's `visible`, see the official CSS default value table). The badge center-on-corner rendering extends about half a badge beyond the component root node; when the direct parent is a shrink-to-fit view (e.g. a flex row item), the overflowing part gets clipped. In that case, explicitly set `overflow: visible` on the parent container:

```vue
<!-- Parent shrink-to-fit the badge size requires disabling clipping -->
<view class="badge-item">
	<m-badge content="5">
		<m-icon name="chat-o" size="28" />
	</m-badge>
</view>
```

```scss
.badge-item {
	overflow: visible;
}
```

If the parent has padding or spacing buffers (the badge does not exceed its box), no extra handling is needed.

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| content | Badge content (numeric semantics expressed as string; not effective when `dot` is true) | string | - |
| dot | Whether to show as a small red dot | boolean | `false` |
| color | Badge background color, semantic color names and CSS color values supported | string | `$m-badge-bg` (danger red) |
| max | Maximum value, `{max}+` is displayed when numeric content exceeds it | string | - |
| show-zero | Whether to show the badge when content is numeric 0 | boolean | `true` |
| position | Badge position, one of `top-right` / `top-left` / `bottom-left` / `bottom-right` | string | `top-right` |
| offset-x | Horizontal offset, positive points right, pure numbers treated as `px` | string | - |
| offset-y | Vertical offset, positive points down, pure numbers treated as `px` | string | - |
| custom-class | Custom class name of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Slots

| Name | Description |
| --- | --- |
| default | Wrapped child element (badge renders standalone when absent) |
| content | Custom badge content (takes precedence over the content text) |

## Theming

The badge default styles are defined by the following variables (all `!default`); define same-name variables in the project root uni.scss to override:

| Variable | Default | Description |
| --- | --- | --- |
| $m-badge-height | 16px | Badge height |
| $m-badge-color | $m-white | Badge text color |
| $m-badge-bg | $m-color-danger | Badge background color |
| $m-badge-font-size | 12px | Badge text font size |
| $m-badge-font-weight | bold | Badge text font weight |
| $m-badge-padding | 0 3px | Badge padding |
| $m-badge-min-width | 16px | Badge min-width (single digit renders as a circle) |
| $m-badge-dot-size | 8px | Red dot size |
| $m-badge-dot-bg | $m-color-danger | Red dot background color |

See [Theming](/en/guide/theming) for all variables and how to override them.
