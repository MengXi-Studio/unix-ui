# Badge

Display a badge number or a red dot at the top-right corner of an icon or text, or standalone. The API mirrors [Vant Badge](https://vant-ui.github.io/vant/#/en-US/badge).

## Import

Components follow the easycom convention and can be used without import. See [Getting Started](/en/guide/getting-started) for details.

## Usage

### Basic Usage

After setting the `content` prop, the badge is displayed at the top-right corner of the wrapped child; the `dot` prop renders a small red dot (ignores content). Wrapping an icon composes with the [Icon](/en/components/icon) component.

```html
<mxi-badge content="5">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="Hot">
	<view class="child"></view>
</mxi-badge>
<mxi-badge dot>
	<view class="child"></view>
</mxi-badge>

<!-- Composed with an icon -->
<mxi-badge content="5">
	<mxi-icon name="chat-o" size="28" />
</mxi-badge>
```

### Max

After setting the `max` prop, when the numeric `content` exceeds the maximum, `{max}+` is displayed (only effective when content is a number).

```html
<mxi-badge content="20" max="9">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="200" max="99">
	<view class="child"></view>
</mxi-badge>
```

### Custom Color

Use the `color` prop to set the badge background. Semantic color names (`primary` / `success` / `warning` / `danger` / `white`, mapped to theme variables — overriding uni.scss variables takes effect immediately) and CSS color values are supported; defaults to danger red.

```html
<mxi-badge content="5" color="primary">
	<view class="child"></view>
</mxi-badge>
<mxi-badge dot color="primary">
	<view class="child"></view>
</mxi-badge>
```

### Custom Position

Use the `position` prop to set the badge position, defaulting to `top-right`. The badge center sits on the corner, matching Vant's look.

```html
<mxi-badge content="10" position="top-left">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="10" position="bottom-left">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="10" position="bottom-right">
	<view class="child"></view>
</mxi-badge>
```

### Offset

Use the `offset-x` / `offset-y` props to set the offset (semantically equivalent to Vant's `offset` array, split into two props for the most solid UTS type constraints): positive values point right / down respectively, negative values reverse, pure numbers are treated as `px`.

```html
<mxi-badge content="10" offset-x="4" offset-y="4">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="10" offset-x="-4" offset-y="-4">
	<view class="child"></view>
</mxi-badge>
```

### Standalone

When the badge has no child element, it renders as a standalone element.

```html
<mxi-badge content="20" />
<mxi-badge content="200" max="99" />
<mxi-badge dot />
```

### Custom Badge Content

Use the `content` slot to customize the badge content, such as inserting an icon.

```html
<mxi-badge>
	<view class="child"></view>
	<template #content>
		<view class="badge-icon-box">
			<mxi-icon name="success" custom-style="font-size: 10px;" />
		</view>
	</template>
</mxi-badge>
```

### Zero and show-zero

When `content` is numeric 0, the badge is displayed by default; setting `:show-zero="false"` hides it.

```html
<mxi-badge content="0">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="0" :show-zero="false">
	<view class="child"></view>
</mxi-badge>
```

### Platform Note: Parent Clipping

In uni-app x, the view component's `overflow` defaults to `hidden` (unlike W3C's `visible`, see the official CSS default value table). The badge center-on-corner rendering extends about half a badge beyond the component root node; when the direct parent is a shrink-to-fit view (e.g. a flex row item), the overflowing part gets clipped. In that case, explicitly set `overflow: visible` on the parent container:

```html
<!-- Parent shrink-to-fit the badge size requires disabling clipping -->
<view class="badge-item">
	<mxi-badge content="5">
		<mxi-icon name="chat-o" size="28" />
	</mxi-badge>
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
| color | Badge background color, semantic color names and CSS color values supported | string | `$mxi-badge-bg` (danger red) |
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
| $mxi-badge-height | 16px | Badge height |
| $mxi-badge-color | $mxi-white | Badge text color |
| $mxi-badge-bg | $mxi-color-danger | Badge background color |
| $mxi-badge-font-size | 12px | Badge text font size |
| $mxi-badge-font-weight | bold | Badge text font weight |
| $mxi-badge-padding | 0 3px | Badge padding |
| $mxi-badge-min-width | 16px | Badge min-width (single digit renders as a circle) |
| $mxi-badge-dot-size | 8px | Red dot size |
| $mxi-badge-dot-bg | $mxi-color-danger | Red dot background color |

See [Theming](/en/guide/theming) for all variables and how to override them.
