---
title: Image
demo: pages-sub/image/image
---

## Introduction

The image component wraps the native image with enhancements: native capabilities such as `mode` are passed through with the same names, plus loading and error placeholders, fade-in transition, border radius and round shapes.

## Examples

### Basic Usage {#demo-basic}

`src` is the required image URL. Without a size, the default width is 100% and the default height is 240px. `width` and `height` accept a string (used as is, supporting % and other units) and a number (px is appended automatically).

```vue
<mxi-image src="https://cdn.example.com/demo.jpg" />
<mxi-image src="https://cdn.example.com/demo.jpg" width="160px" height="160px" />
<mxi-image src="https://cdn.example.com/demo.jpg" :width="120" :height="120" />
```

### Fill Mode {#demo-mode}

Use the `mode` attribute to set the crop and scale mode, passed through with the same name as the native image mode. The default is `aspectFill` (crop to fill, keeping the aspect ratio).

```vue
<mxi-image src="https://cdn.example.com/demo.jpg" width="110px" height="110px" mode="scaleToFill" />
<mxi-image src="https://cdn.example.com/demo.jpg" width="110px" height="110px" mode="aspectFit" />
<mxi-image src="https://cdn.example.com/demo.jpg" width="110px" height="110px" mode="widthFix" />
```

### Border Radius and Round {#demo-radius}

Use the `radius` attribute to set the border radius, and the `round` attribute to render a circle (taking precedence over `radius`).

```vue
<mxi-image src="https://cdn.example.com/demo.jpg" width="80px" height="80px" round />
<mxi-image src="https://cdn.example.com/demo.jpg" width="80px" height="80px" radius="8" />
<mxi-image src="https://cdn.example.com/demo.jpg" width="80px" height="80px" radius="16" />
```

### Loading and Error Placeholder {#demo-loading}

A placeholder icon is shown by default while loading and on failure. Use `loading-icon` and `error-icon` to customize the placeholder icons, and `icon-size` to set their size. Use `show-loading` and `show-error` to disable the placeholders, and the `loading` and `error` slots for custom placeholder content.

```vue
<mxi-image src="https://cdn.example.com/nonexistent.jpg" width="110px" height="110px" />
<mxi-image src="https://cdn.example.com/nonexistent.jpg" width="110px" height="110px" error-icon="photo-o" />
<mxi-image src="https://cdn.example.com/nonexistent.jpg" width="110px" height="110px" :show-error="false" />
```

### Lazy Load and Fade In {#demo-lazy}

`lazy-load` is passed through to the native attribute, effective only under page and scroll-view. When `fade` is enabled, the image fades in over 300ms after loading; it is enabled by default, and switching the image resets to the loading state automatically.

```vue
<mxi-image src="https://cdn.example.com/demo.jpg" width="130px" height="130px" lazy-load />
<mxi-image src="https://cdn.example.com/demo.jpg" width="130px" height="130px" :fade="false" />
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| src | Image URL | string | - |
| mode | Crop and scale mode, passed through with the same name as the native image mode | ImageMode | `aspectFill` |
| lazy-load | Whether to lazy load, passed through to the native lazy-load attribute | boolean | `false` |
| fade | Whether to fade in after loading | boolean | `true` |
| width | Image width, px is appended for number, defaults to 100% | string \| number \| null | null |
| height | Image height, px is appended for number, defaults to 240px | string \| number \| null | null |
| radius | Border radius, px is appended for number | string \| number \| null | null |
| round | Whether to render a circle, taking precedence over radius | boolean | `false` |
| show-loading | Whether to show the loading placeholder | boolean | `true` |
| show-error | Whether to show the error placeholder | boolean | `true` |
| loading-icon | Loading placeholder icon name | IconName | `photo` |
| error-icon | Error placeholder icon name | IconName | `photo-fail` |
| icon-size | Placeholder icon size, px is appended for pure numbers | string | `32` |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Emitted when the image is clicked | event: MouseEvent |
| load | Emitted when the image loads successfully, detail contains the image size | event: UniImageLoadEvent |
| error | Emitted when the image fails to load, detail contains the error message | event: UniImageErrorEvent |

### Slots

| Name | Description |
| --- | --- |
| loading | Loading placeholder content |
| error | Error placeholder content |
| default | Custom content, rendered as the sibling node after the image |

## Theming

Image styles can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $mxi-image-background | Loading and error placeholder background color | #f7f8fa |
| $mxi-image-icon-color | Placeholder icon color | #dcdee0 |

See [Theming](/en/guide/theming) for the full variable list and override instructions.
