---
title: Cell
demo: pages-sub/cell/cell
---

## Introduction

The cell provides a content container for each row of a list, commonly used in settings pages and info lists. It supports title, value, label, icon, arrow, size and grouping.

## Examples

### Basic Usage {#demo-basic}

Use `title` and `value` to set the left and right content, and `label` to add a description below the title.

```vue
<m-cell-group>
	<m-cell title="Cell" value="Content" />
	<m-cell title="Cell" value="Content" label="Description" />
</m-cell-group>
```

### Cell Size {#demo-size}

Use the `size` attribute to set the cell size, can be set to `normal` `large`. The default is `normal`.

```vue
<m-cell title="Cell" value="Content" size="large" />
<m-cell title="Cell" value="Content" label="Description" size="large" />
```

### Left Icon {#demo-icon}

Use the `icon` attribute to show an icon to the left of the title. Set it to an icon name; no icon is shown when it is null.

```vue
<m-cell title="Location" icon="location-o" />
<m-cell title="Shop" icon="shop-o" />
```

### Link and Arrow Direction {#demo-arrow}

The `is-link` attribute shows a right arrow, and `arrow-direction` controls the arrow direction, can be set to `left` `up` `down` `right`. The default is `right`. The `clickable` attribute controls whether press feedback is shown; it defaults to the value of `is-link`, and takes precedence once set explicitly.

```vue
<m-cell title="Default right arrow" is-link />
<m-cell title="Left arrow" is-link arrow-direction="left" />
<m-cell title="Up arrow" is-link arrow-direction="up" value="Content" />
<m-cell title="Press feedback only" clickable />
```

### Cell Group {#demo-group}

`m-cell-group` wraps multiple cells into a group, and the `title` attribute sets the group title. The `inset` attribute renders the group as a rounded card with side margins, in which case no outer border is shown. The divider of the last cell in a group is hidden automatically, and can also be forced off with `border: false`.

```vue
<m-cell-group title="Group 1">
	<m-cell title="Cell" value="Content" />
	<m-cell title="Cell" value="Content" />
</m-cell-group>
<m-cell-group inset>
	<m-cell title="Cell" value="Content" />
	<m-cell title="Cell" value="Content" />
</m-cell-group>
```

### Required Star

The `required` attribute shows a required star before the title.

```vue
<m-cell title="Phone" required />
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Left title | string | `''` |
| value | Right value | string | `''` |
| label | Description below the title | string | `''` |
| size | Size, can be set to `normal` `large` | CellSize | `normal` |
| icon | Left icon name, no icon shown when null | IconName \| null | null |
| border | Whether to show the divider, hidden automatically for the last cell in a group | boolean | `true` |
| center | Whether to center content vertically | boolean | `false` |
| clickable | Whether to show press feedback, defaults to the value of isLink | boolean \| null | null |
| is-link | Whether to show the right arrow | boolean | `false` |
| arrow-direction | Arrow direction, can be set to `left` `up` `down` `right` | CellArrowDirection | `right` |
| required | Whether to show the required star | boolean | `false` |
| title-style | Custom inline style of the title | string | - |
| title-class | Custom class name of the title | string | - |
| value-class | Custom class name of the value | string | - |
| label-class | Custom class name of the label | string | - |
| title | Group title (CellGroup) | string | `''` |
| inset | Whether to be a rounded card group with side margins and no outer border (CellGroup) | boolean | `false` |
| border | Whether to show the outer border, not shown in inset mode (CellGroup) | boolean | `true` |
| custom-class | Custom root node class name (Cell and CellGroup) | string.ClassString | - |
| custom-style | Custom root node inline style (Cell and CellGroup) | string | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Emitted when the cell is clicked | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| icon | Left icon |
| title | Title content (Cell and CellGroup) |
| label | Description text |
| value | Right value |
| extra | Extra content on the right, between the value and the arrow |
| default | Cell list content (CellGroup) |

## Theming

Cell styles can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-cell-font-size | Text font size | 14px |
| $m-cell-vertical-padding | Vertical padding | 10px |
| $m-cell-horizontal-padding | Horizontal padding | 16px |
| $m-cell-text-color | Title text color | #323233 |
| $m-cell-background | Background color | #fff |
| $m-cell-border-color | Divider color | #ebedf0 |
| $m-cell-active-color | Press feedback background color | #f2f3f5 |
| $m-cell-required-color | Required star color | #ee0a24 |
| $m-cell-label-color | Label text color | #969799 |
| $m-cell-label-font-size | Label font size | 12px |
| $m-cell-value-color | Value text color | #969799 |
| $m-cell-icon-margin | Right margin of the left icon | 8px |
| $m-cell-arrow-margin | Left margin of the arrow | 4px |
| $m-cell-right-icon-color | Arrow color | #c8c9cc |
| $m-cell-large-vertical-padding | Vertical padding of the large size | 12px |
| $m-cell-large-title-font-size | Title font size of the large size | 16px |
| $m-cell-large-label-font-size | Label font size of the large size | 14px |
| $m-cell-group-background | Group background color (CellGroup) | #fff |
| $m-cell-group-title-color | Group title color (CellGroup) | #969799 |
| $m-cell-group-title-padding | Group title padding (CellGroup) | 16px 16px 8px |
| $m-cell-group-title-font-size | Group title font size (CellGroup) | 14px |
| $m-cell-group-inset-radius | Inset group border radius (CellGroup) | 8px |
| $m-cell-group-inset-padding | Inset group margin (CellGroup) | 0 16px |

See [Theming](/en/guide/theming) for the full variable list and override instructions.
