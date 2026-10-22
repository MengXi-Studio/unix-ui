# Loading

The loading icon indicates a loading state of a page or operation. API aligned with [Vant Loading](https://vant-ui.github.io/vant/#/zh-CN/loading).

## Import

The component follows the easycom convention and can be used without importing. See [Quick Start](/en/guide/getting-started) for details.

## Usage

### Basic Usage

```html
<mxi-loading />
```

### Type

Two types are supported: `circular` (arc ring, default) and `spinner` (petals).

```html
<mxi-loading />
<mxi-loading type="spinner" />
```

### Custom Color

Use the `color` prop to customize the icon color.

```html
<mxi-loading color="#1989fa" />
<mxi-loading type="spinner" color="#07c160" />
```

### Custom Size

Use the `size` prop to customize the icon size. Pure numbers (with `px` appended automatically) or strings with units are supported; the default is `30px`.

```html
<mxi-loading size="16" />
<mxi-loading type="spinner" size="24" />
```

### Loading Text

Place the loading text in the default slot; use `vertical` to arrange the icon and text vertically.

```html
<mxi-loading>Loading...</mxi-loading>
<mxi-loading type="spinner" size="24" vertical>Loading...</mxi-loading>
```

### Custom Text Style

Use the `text-size` and `text-color` props to customize the text font size and color.

```html
<mxi-loading text-size="16" text-color="#1989fa">Loading...</mxi-loading>
```

### Custom Icon

Use the `icon` slot to replace the default icon; the replaced icon still rotates with the rhythm of the given `type`.

```html
<mxi-loading>
	<template #icon>
		<text style="font-size: 24px;">❀</text>
	</template>
</mxi-loading>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| type | Loading type, can be set to `circular` `spinner` | LoadingType | `circular` |
| color | Loading icon color | string | - |
| size | Loading icon size, pure numbers or strings with units | string | - |
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
| $mxi-loading-spinner-size | Loading icon size | 30px |
| $mxi-loading-spinner-color | Loading icon color | #c8c9cc |
| $mxi-loading-text-color | Text color | #646566 |
| $mxi-loading-text-font-size | Text font size | 14px |
| $mxi-loading-text-gap | Gap between icon and text | 4px |

See [Theming](/en/guide/theming) for the full variable list and how to override them.
