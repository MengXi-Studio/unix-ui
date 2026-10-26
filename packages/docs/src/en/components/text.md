---
title: Text
demo: pages-sub/text/text
---

## Introduction

The text component is the basic component for text layout, providing semantic colors, font size tiers, single-line and multi-line truncation, and selectable text.

## Examples

### Basic Usage {#demo-basic}

Displays the theme body color and the medium font size by default.

```vue
<m-text>This is a text with the default style.</m-text>
```

### Text Color {#demo-color}

`color` supports semantic color names `default` `secondary` `tertiary` `fourth` `primary` `success` `warning` `danger`, as well as any CSS color value (such as `#7232dd`).

```vue
<m-text color="secondary">Secondary text color</m-text>
<m-text color="tertiary">Tertiary text color</m-text>
<m-text color="primary">Primary text color</m-text>
<m-text color="danger">Danger text color</m-text>
<m-text color="#7232dd">Custom color value</m-text>
```

### Font Size Tier {#demo-size}

Use the `size` attribute to set the font size tier, can be set to `small` `medium` `large`. The default is `medium`.

```vue
<m-text size="small">Small text</m-text>
<m-text size="medium">Medium text</m-text>
<m-text size="large">Large text</m-text>
```

### Single-line Truncation {#demo-ellipsis}

The `truncated` attribute shows an ellipsis when the text exceeds the width constraint, which requires an external width constraint; it does not take effect when both `truncated` and `line-clamp` are set.

```vue
<m-text truncated custom-style="max-width: 200px;">
	This is a long text, showing an ellipsis when truncated exceeds the width.
</m-text>
```

### Multi-line Truncation {#demo-ellipsis-multi}

The `line-clamp` attribute limits the maximum number of lines, showing an ellipsis for the overflow; unlimited when not set.

```vue
<m-text :line-clamp="2" custom-style="max-width: 300px;">
	This is a long text, showing an ellipsis beyond two lines when line-clamp is set to 2.
</m-text>
```

### Selectable Text {#demo-selectable}

The `user-select` attribute makes the text selectable and copyable (drag to select on web, long press on App).

```vue
<m-text :user-select="true">This text can be selected and copied.</m-text>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| color | Text color, can be set to `default` `secondary` `tertiary` `fourth` `primary` `success` `warning` `danger` or any CSS color value | string | `default` |
| size | Font size tier, can be set to `small` `medium` `large` | TextSize | `medium` |
| truncated | Whether to truncate to a single line, not effective when set with line-clamp | boolean | `false` |
| line-clamp | Number of lines for multi-line truncation, unlimited when not set | number \| null | null |
| user-select | Whether the text is selectable | boolean | `false` |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Slots

| Name | Description |
| --- | --- |
| default | Text content |

## Theming

Text styles can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-text-font-size-sm | small tier font size | 12px |
| $m-text-font-size-md | medium tier font size | 14px |
| $m-text-font-size-lg | large tier font size | 16px |
| $m-text-color-secondary | secondary text color | #646566 |
| $m-text-color-tertiary | tertiary text color | #969799 |
| $m-text-color-fourth | fourth text color | #c8c9cc |

See [Theming](/en/guide/theming) for the full variable list and override instructions.
