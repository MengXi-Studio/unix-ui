---
title: Divider
demo: pages-sub/divider/divider
---

## Introduction

Separates content into multiple areas, supporting horizontal and vertical forms, dashed lines, 0.5px hairlines and content position customization.

## Examples

### Basic Usage {#demo-basic}

Renders a horizontal divider line by default.

```vue
<m-divider />
```

### Showing Text {#demo-content}

Insert content in the middle of the divider via the default slot; text color / font size / line height are inherited from the component root (applies directly when the inner text has no explicit color).

```vue
<m-divider>Text</m-divider>
```

### Content Position {#demo-content-position}

Use `content-position` to specify where the content sits; one line is width-capped while the other fills the remaining space.

```vue
<m-divider content-position="left">Text</m-divider>
<m-divider content-position="right">Text</m-divider>
```

### Dashed {#demo-dashed}

Add the `dashed` attribute to render the divider as a dashed line.

```vue
<m-divider dashed>Text</m-divider>
```

### Hairline Comparison {#demo-hairline}

`hairline` defaults to `true` (0.5px thin line, implemented via 1px border + single-axis 0.5 scale, safe on App platforms); set it to `false` for a regular 1px line.

```vue
<m-divider :hairline="false" />
<m-divider />
```

### Vertical Divider {#demo-vertical}

`vertical` renders a vertical divider. uni-app x has no inline-block, so the vertical form is a **flex item**: the parent container needs `flex-direction: row` + `align-items: center`, with the divider placed beside texts.

```vue
<view style="flex-direction: row; align-items: center;">
	<text>Text</text>
	<m-divider vertical />
	<text>Text</text>
	<m-divider vertical dashed />
	<text>Text</text>
</view>
```

### Custom Style {#demo-style}

`style` applies to the component root; `color` / `padding` take effect via inheritance or layout. The divider line is a child node — for per-instance line color, override the `$m-divider-border-color` theme variable (see differences below).

```vue
<m-divider style="color: #1989fa; padding: 0 16px;">Text</m-divider>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| dashed | Whether to use dashed line | boolean | `false` |
| hairline | Whether to use 0.5px hairline | boolean | `true` |
| content-position | Content position, optional values `left` `right` | DividerContentPosition | `center` |
| vertical | Whether to use vertical divider | boolean | `false` |

### Slots

| Name | Description |
| --- | --- |
| default | Content |

## Theming

Divider styles can be customized via the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-divider-margin | Horizontal divider margin | 16px 0 |
| $m-divider-vertical-margin | Vertical divider margin | 0 8px |
| $m-divider-text-color | Text color | #969799 |
| $m-divider-font-size | Text font size | 14px |
| $m-divider-line-height | Text line height | 24px |
| $m-divider-border-color | Divider line color | #ebedf0 |
| $m-divider-content-padding | Padding between text and lines | 16px |
| $m-divider-content-left-width | Max width of the before line when content is left | 10% |
| $m-divider-content-right-width | Max width of the after line when content is right | 10% |

See [Theming](/en/guide/theming) for all variables and how to override them.

## Differences from Vant

- The vertical divider is a flex item: uni-app x has no inline-block, so the parent container needs `flex-direction: row` + `align-items: center`; the inline text-flow usage of Vant is not supported
- Per-instance line color via `style="{ borderColor }"` is not supported: the line is a child node and ucss has no `inherit` (Vant relies on pseudo-elements inheriting the root border-color); override the `$m-divider-border-color` theme variable instead
- The 0.5px hairline is implemented via a 1px border + `scaleY(0.5)` / `scaleX(0.5)` scale: avoiding 0.5px border rounding issues on App platforms
- Pseudo-element lines become real nodes: ucss has no `::before` / `::after`; the structure is equivalent to Vant's source but carried by in-component views
