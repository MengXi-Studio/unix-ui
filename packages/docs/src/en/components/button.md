---
title: Button
demo: pages-sub/button/button
---

## Introduction

Buttons are used to trigger an action, such as submitting a form. Supports types, sizes, plain, round, square, block, disabled and loading states.

## Examples

### Button Type {#demo-type}

Five types are supported: `default`, `primary`, `success`, `warning` and `danger`. The default is `default`.

```vue
<m-button type="primary">Primary</m-button>
<m-button type="success">Success</m-button>
<m-button type="danger">Danger</m-button>
<m-button type="warning">Warning</m-button>
<m-button type="default">Default</m-button>
```

### Plain Button {#demo-plain}

Set a button as plain with the `plain` attribute: the text takes the button color and the background becomes white.

```vue
<m-button type="primary" plain>Plain</m-button>
```

### Hairline Border

Use the `hairline` attribute for a 0.5px border (implemented via `scale(0.5)`).

```vue
<m-button type="primary" plain hairline>Hairline</m-button>
```

### Disabled {#demo-disabled}

Disable a button with the `disabled` attribute; disabled buttons cannot be clicked.

```vue
<m-button type="primary" disabled>Disabled</m-button>
```

### Loading {#demo-loading}

Set a button to the loading state with the `loading` attribute; loading buttons cannot be clicked. Use `loading-text` to customize the loading label. Use `loading-type` to switch the loading icon style (`circular` spinning ring / `spinner` spinning petals); the icon is powered by the [Loading](/en/components/loading) component.

```vue
<m-button type="primary" loading />
<m-button type="primary" loading loading-text="Loading..." />
<m-button type="primary" loading loading-type="spinner" />
```

### Press Feedback

The button's overall opacity drops to 0.8 while pressed and restores on release; no press feedback is shown in `disabled` or `loading` state (implemented via `hover-class`).

```vue
<m-button type="primary">Press to see feedback</m-button>
```

### Button Size {#demo-size}

Four sizes are supported: `large`, `normal`, `small` and `mini`. The default is `normal`.

```vue
<m-button type="primary" size="large">Large</m-button>
<m-button type="primary" size="normal">Normal</m-button>
<m-button type="primary" size="small">Small</m-button>
<m-button type="primary" size="mini">Mini</m-button>
```

### Block Element {#demo-block}

The `block` attribute makes the button fill its parent container's width.

```vue
<m-button type="primary" block>Block</m-button>
```

### Custom Color {#demo-color}

Customize the button color with the `color` attribute; `linear-gradient` is supported.

```vue
<m-button color="#7232dd">Solid</m-button>
<m-button color="linear-gradient(to right, #ff6034, #ee0a24)">Gradient</m-button>
<m-button color="#7232dd" plain>Plain Color</m-button>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| type | Type, can be set to `primary` `success` `warning` `danger` | ButtonType | `default` |
| size | Size, can be set to `large` `normal` `small` `mini` | ButtonSize | `normal` |
| plain | Whether to be a plain button | boolean | `false` |
| round | Whether to be a round button | boolean | `false` |
| square | Whether to be a square button | boolean | `false` |
| disabled | Whether to disable the button | boolean | `false` |
| hairline | Whether to use a 0.5px border | boolean | `false` |
| block | Whether to be a block element | boolean | `false` |
| loading | Whether to show the loading state | boolean | `false` |
| loading-text | Loading state label | string | - |
| loading-type | Loading icon type, can be set to `circular` `spinner` | LoadingType | `circular` |
| color | Custom button color, supports `linear-gradient` | string | - |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| click | Emitted when the button is clicked (not emitted while loading or disabled) | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| default | Button content |

## Theming

Button styles can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-color-primary | Primary color | #1989fa |
| $m-color-success | Success color | #07c160 |
| $m-color-warning | Warning color | #ff976a |
| $m-color-danger | Danger color | #ee0a24 |
| $m-button-normal-height | Normal button height | 44px |
| $m-button-large-height | Large button height | 50px |
| $m-button-small-height | Small button height | 32px |
| $m-button-mini-height | Mini button height | 24px |
| $m-button-radius | Button border radius | 8px |
| $m-button-active-opacity | Opacity while pressed | 0.8 |

See [Theming](/en/guide/theming) for the full variable list and override instructions.
