---
title: Loading
demo: pages-sub/loading/loading
---

## Introduction

The loading icon indicates a loading state of a page or operation. Two types are supported: circular arc ring and spinner petals.

## Examples

### Basic Usage

```vue
<m-loading />
```

### Type {#demo-type}

Two types are supported: `circular` (arc ring, default) and `spinner` (petals).

```vue
<m-loading />
<m-loading type="spinner" />
```

### Custom Color {#demo-color}

Use the `color` prop to customize the icon color. Both CSS color values and semantic color names (`default` / `primary` / `success` / `warning` / `danger` / `white`) are supported; semantic names are bound to theme variables at compile time, so overriding the corresponding `$m-color-*` variables in `uni.scss` takes effect.

```vue
<m-loading color="#1989fa" />
<m-loading type="spinner" color="#07c160" />
<m-loading type="spinner" color="primary" />
```

### Custom Size {#demo-size}

Use the `size` prop to customize the icon size. Pure numbers (with `px` appended automatically), strings with units, or `100%` (filling an externally sized container) are supported; the default is `30px`.

```vue
<m-loading size="16" />
<m-loading type="spinner" size="24" />
```

### Loading Text {#demo-text}

Place the loading text in the default slot; use `vertical` to arrange the icon and text vertically.

```vue
<m-loading>Loading...</m-loading>
<m-loading type="spinner" size="24" vertical>Loading...</m-loading>
```

### Custom Text Style {#demo-text-style}

Use the `text-size` and `text-color` props to customize the text font size and color.

```vue
<m-loading text-size="16" text-color="#1989fa">Loading...</m-loading>
```

### Custom Icon {#demo-icon}

Use the `icon` slot to replace the default icon; the replaced icon still rotates with the rhythm of the given `type`.

```vue
<m-loading>
	<template #icon>
		<text style="font-size: 24px;">❀</text>
	</template>
</m-loading>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| type | Loading type, can be set to `circular` `spinner` | LoadingType | `circular` |
| color | Loading icon color, CSS color values or semantic names (`default` `primary` `success` `warning` `danger` `white`) | string | - |
| size | Loading icon size, pure numbers, strings with units, or `100%` (fill an externally sized container) | string | - |
| vertical | Whether to arrange icon and text vertically | boolean | `false` |
| text-size | Text font size, pure numbers or strings with units | string | - |
| text-color | Text color | string | - |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Slots

| Name | Description |
| --- | --- |
| default | Loading text |
| icon | Custom loading icon (replaces the default icon) |

## Theming

Loading styles can be customized with the following SCSS variables (define them in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-loading-spinner-size | Loading icon size | 30px |
| $m-loading-spinner-color | Loading icon color | #c8c9cc |
| $m-loading-text-color | Text color | #646566 |
| $m-loading-text-font-size | Text font size | 14px |
| $m-loading-text-gap | Gap between icon and text | 4px |

See [Theming](/en/guide/theming) for the full variable list and how to override them.
