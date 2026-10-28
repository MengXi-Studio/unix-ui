---
title: Grid
subtitle: Grid
demo: pages-sub/grid/grid
---

## Introduction

Divides the page horizontally into equal-width blocks for displaying content or page navigation. Composed of `m-grid` (container) and `m-grid-item` (cell).

## Basic Usage

### Basic Usage {#demo-basic}

Use the `icon` prop to set the icon in a cell, and the `text` prop to set the text content.

```vue
<m-grid>
	<m-grid-item icon="location-o" text="Text" />
	<m-grid-item icon="like-o" text="Text" />
	<m-grid-item icon="star-o" text="Text" />
	<m-grid-item icon="phone-o" text="Text" />
</m-grid>
```

### Custom Column Number {#demo-column-num}

Four cells are displayed in a row by default. You can customize the number of columns via `column-num`; cell width is automatically set to 100/column%.

```vue
<m-grid :column-num="3">
	<m-grid-item icon="location-o" text="Text" />
	<m-grid-item icon="like-o" text="Text" />
	<m-grid-item icon="star-o" text="Text" />
	<m-grid-item icon="phone-o" text="Text" />
	<m-grid-item icon="fire-o" text="Text" />
	<m-grid-item icon="gift-o" text="Text" />
</m-grid>
```

### Custom Content {#demo-custom-content}

Customize the content of a cell via the default slot (in this case `icon` / `text` are not rendered).

```vue
<m-grid :border="false" :column-num="3">
	<m-grid-item>
		<m-image src="https://cdn.example.com/apple-1.jpeg" width="100%" height="80px" />
	</m-grid-item>
	<m-grid-item>
		<m-image src="https://cdn.example.com/apple-2.jpeg" width="100%" height="80px" />
	</m-grid-item>
	<m-grid-item>
		<m-image src="https://cdn.example.com/apple-3.jpeg" width="100%" height="80px" />
	</m-grid-item>
</m-grid>
```

### Square Cells {#demo-square}

After setting the `square` prop, the height of the cell will remain consistent with its width (padding-top percentage + absolutely positioned content).

```vue
<m-grid square>
	<m-grid-item icon="fire-o" text="Text" />
	<m-grid-item icon="gift-o" text="Text" />
	<m-grid-item icon="smile-o" text="Text" />
	<m-grid-item icon="music-o" text="Text" />
</m-grid>
```

### Cell Spacing {#demo-gutter}

Use the `gutter` prop to set the distance between cells (same value for rows and columns). Spacing is distributed by full-row cell position: position 0 gets no left padding, the last position gets no right padding, and the middle positions get half each; an incomplete last row reuses the same per-position values (aligned left, matching the same positions of the row above, with the empty slots exposing the background).

```vue
<m-grid :gutter="10">
	<m-grid-item icon="cart-o" text="Text" />
	<m-grid-item icon="friends-o" text="Text" />
	<m-grid-item icon="coupon-o" text="Text" />
	<m-grid-item icon="setting-o" text="Text" />
</m-grid>
```

### Horizontal Content {#demo-direction}

Set the `direction` prop to `horizontal` to arrange the grid content horizontally; `reverse` swaps the positions of the icon and text.

```vue
<m-grid direction="horizontal" :column-num="3">
	<m-grid-item icon="location-o" text="Text" />
	<m-grid-item icon="like-o" text="Text" />
	<m-grid-item icon="star-o" text="Text" />
</m-grid>
<m-grid direction="horizontal" reverse :column-num="3">
	<m-grid-item icon="phone-o" text="Text" />
	<m-grid-item icon="fire-o" text="Text" />
	<m-grid-item icon="gift-o" text="Text" />
</m-grid>
```

### Page Navigation {#demo-navigation}

Use the `url` prop to set the in-app page path to navigate to on click; with `replace`, `redirectTo` replaces the current history entry.

```vue
<m-grid clickable :column-num="2">
	<m-grid-item icon="arrow" text="Navigate" url="/pages/index/index" />
	<m-grid-item icon="arrow" text="Replace history" url="/pages/index/index" :replace="true" />
</m-grid>
```

### Badge Prompt {#demo-badge}

After setting the `dot` prop, a small red dot will be displayed in the upper right corner of the icon. After setting the `badge` prop, the corresponding badge will be displayed in the upper right corner of the icon (rendered by [Badge](/en/components/badge) internally).

```vue
<m-grid :column-num="2">
	<m-grid-item icon="friends-o" text="Text" dot />
	<m-grid-item icon="comment-o" text="Text" badge="99+" />
</m-grid>
```

### Click Event and Press Feedback {#demo-click}

Set the `clickable` prop to enable press feedback on cells (background color changes while pressed); the `click` event is emitted when a cell is clicked.

```vue
<m-grid clickable :column-num="2">
	<m-grid-item icon="thumb-circle-o" text="Cell A" @click="logClick('Cell A')" />
	<m-grid-item icon="comment-circle-o" text="Cell B" @click="logClick('Cell B')" />
</m-grid>
```

## API

### Grid Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| column-num | Number of columns (minimum 1) | number \| string | `4` |
| icon-size | Icon size, pure numbers get `px` appended, defaults to theme variable | number \| string | - |
| gutter | Spacing between cells (px), same value for rows and columns | number \| string | `0` |
| border | Whether to show the border | boolean | `true` |
| center | Whether to center the cell content | boolean | `true` |
| square | Whether to fix the cell as a square | boolean | `false` |
| clickable | Whether to enable click feedback on cells | boolean | `false` |
| direction | Direction of cell content, optional value is `horizontal` | GridDirection | `vertical` |
| reverse | Whether to swap the positions of the icon and text | boolean | `false` |

### GridItem Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| text | Text | string | - |
| icon | Icon name (IconName union type) | IconName | - |
| icon-color | Icon color, supports CSS color values, inherits content color when empty | string | - |
| dot | Whether to show a small red dot in the upper right corner of the icon | boolean | `false` |
| badge | Content of the badge in the upper right corner of the icon (numeric semantics as string, e.g. `"99+"`) | string | - |
| url | In-app page path to navigate to on click | string | - |
| replace | Whether to replace the current page history when navigating | boolean | `false` |

### GridItem Events

| Event | Description | Arguments |
| --- | --- | --- |
| click | Emitted when a cell is clicked | event: MouseEvent |

### GridItem Slots

| Name | Description |
| --- | --- |
| default | Customize all content of the grid |
| icon | Custom icon |
| text | Custom text |

## Theming

Grid styles can be customized through the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-grid-item-content-padding | Content padding of the cell | 16px 8px |
| $m-grid-item-content-background | Background color of the cell content | #ffffff |
| $m-grid-item-content-active-color | Press feedback background color of the cell | #f2f3f5 |
| $m-grid-item-icon-size | Default icon size (effective when icon-size is not set) | 28px |
| $m-grid-item-text-color | Text color | #323233 |
| $m-grid-item-text-font-size | Text font size | 12px |
| $m-grid-item-border-color | Border line color | #ebedf0 |

See [Theming](/en/guide/theming) for the full variable list and override instructions.

## Differences from Vant

- `to` (Vue Router route object) is not supported: uni-app x has no vue-router, `url` only supports in-app page paths (`uni.navigateTo` / `uni.redirectTo`), external links are not supported
- `icon-prefix` and `badge-props` are not supported: m-icon is a font icon (no class-prefix mechanism); badge reuses the default m-badge behavior
- `badge` type is narrowed to string: numeric semantics are expressed as strings (e.g. `"99+"`), consistent with m-badge's content semantics
- The border is composed of two groups of 0.5px scaled lines: "container top + left lines" and "cell right + bottom lines": ucss has no pseudo-elements, the structure is equivalent to Vant but carried by real views
- Press feedback is implemented via the native `hover-class` of view (equivalent to Vant's `:active` pseudo-class, consistent across platforms)
- gutter spacing is distributed by full-row cell position (no left padding on position 0, none on the right of the last position), the row fills the full width, and an incomplete last row reuses the same per-position values so rows stay aligned; Vant applies padding-right to every cell (whitespace at row end and right edge) and averages by each row's actual column count, so its last row drifts out of alignment
