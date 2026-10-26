---
title: Layout
demo: pages-sub/layout/layout
---

## Introduction

The layout component implements page columns through the 24-grid system of `mxi-row` and `mxi-col`, supporting column spacing, offsets, alignment and wrapping.

## Examples

### Basic Usage {#demo-basic}

`mxi-row` is a horizontal row container and `mxi-col` is a column element. Use `span` to set the column width as a share of the 24-grid.

```vue
<mxi-row>
	<mxi-col span="8"><view class="demo-block">span: 8</view></mxi-col>
	<mxi-col span="8"><view class="demo-block">span: 8</view></mxi-col>
	<mxi-col span="8"><view class="demo-block">span: 8</view></mxi-col>
</mxi-row>
```

### 24 Grid

`span` ranges from 1 to 24; columns wrap automatically when the sum of spans in a row exceeds 24. When `span` is 0 or not set, the column width is determined by its content.

```vue
<mxi-row>
	<mxi-col span="6"><view class="demo-block">span: 6</view></mxi-col>
	<mxi-col span="6"><view class="demo-block">span: 6</view></mxi-col>
	<mxi-col span="12"><view class="demo-block">span: 12</view></mxi-col>
</mxi-row>
```

### Column Spacing {#demo-gutter}

The `gutter` attribute sets the spacing between columns (px), and supports an array `[horizontal, vertical]` for the row spacing after wrapping. The column spacing is implemented with padding, so if the column content needs a background color, set it on an inner element of the Col and keep the Col itself transparent to show the gaps.

```vue
<mxi-row gutter="20">
	<mxi-col span="8"><view class="demo-block">span: 8</view></mxi-col>
	<mxi-col span="8"><view class="demo-block">span: 8</view></mxi-col>
	<mxi-col span="8"><view class="demo-block">span: 8</view></mxi-col>
</mxi-row>
```

### Offset

The `offset` attribute sets the number of offset columns to the left of a column, calculated the same way as `span`.

```vue
<mxi-row>
	<mxi-col span="8"><view class="demo-block">span: 8</view></mxi-col>
	<mxi-col span="8" offset="8"><view class="demo-block">span: 8</view></mxi-col>
</mxi-row>
```

### Alignment {#demo-align}

The `justify` attribute sets the main-axis alignment, can be set to `start` `end` `center` `space-around` `space-between`. The default is `start`. The `align` attribute sets the cross-axis alignment, can be set to `top` `center` `bottom`. The default is `top`.

```vue
<mxi-row justify="center">
	<mxi-col span="6"><view class="demo-block">span: 6</view></mxi-col>
	<mxi-col span="6"><view class="demo-block">span: 6</view></mxi-col>
</mxi-row>
<mxi-row align="bottom">
	<mxi-col span="6"><view class="demo-block">span: 6</view></mxi-col>
	<mxi-col span="6"><view class="demo-block">span: 6</view></mxi-col>
</mxi-row>
```

### Wrapping {#demo-wrap}

The `wrap` attribute is enabled by default, so columns wrap naturally when the sum of spans exceeds 24; disable it to keep one line.

```vue
<mxi-row :gutter="[10, 10]">
	<mxi-col span="6"><view class="demo-block">1</view></mxi-col>
	<mxi-col span="6"><view class="demo-block">2</view></mxi-col>
	<mxi-col span="6"><view class="demo-block">3</view></mxi-col>
	<mxi-col span="6"><view class="demo-block">4</view></mxi-col>
	<mxi-col span="6"><view class="demo-block">5</view></mxi-col>
</mxi-row>
```

## API

### Row Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| gutter | Spacing between columns (px), array `[horizontal, vertical]` for the row spacing after wrapping | number \| string \| (number \| string)[] \| null | `0` |
| justify | Main-axis alignment, can be set to `start` `end` `center` `space-around` `space-between` | RowJustify \| null | `start` |
| align | Cross-axis alignment, can be set to `top` `center` `bottom` | RowAlign \| null | `top` |
| wrap | Whether to wrap automatically | boolean | `true` |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Col Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| span | Column width share, ranging from 1 to 24; width is determined by content when 0 or not set | number \| string | `0` |
| offset | Number of offset columns to the left, calculated the same way as span | number \| string \| null | `0` |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Emitted when the Row is clicked | event: MouseEvent |
| click | Emitted when the Col is clicked | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| default | Row content (Row) |
| default | Col content (Col) |

## Theming

The Layout component has no dedicated theme variables. See [Theming](/en/guide/theming) for global variables.
