# Button

Buttons are used to trigger an action, such as submitting a form. The API follows [Vant Button](https://vant-ui.github.io/vant/#/en-US/button).

## Usage

Components follow the easycom convention and can be used without being imported. See [Getting Started](/en/guide/getting-started) for details.

## Examples

### Button Type

Five types are supported: `default`, `primary`, `success`, `warning` and `danger`. The default is `default`.

```html
<mxi-button type="primary">Primary</mxi-button>
<mxi-button type="success">Success</mxi-button>
<mxi-button type="danger">Danger</mxi-button>
<mxi-button type="warning">Warning</mxi-button>
<mxi-button type="default">Default</mxi-button>
```

### Plain Button

Set a button as plain with the `plain` attribute: the text takes the button color and the background becomes white.

```html
<mxi-button type="primary" plain>Plain</mxi-button>
```

### Hairline Border

Use the `hairline` attribute for a 0.5px border (implemented via `scale(0.5)`).

```html
<mxi-button type="primary" plain hairline>Hairline</mxi-button>
```

### Disabled

Disable a button with the `disabled` attribute; disabled buttons cannot be clicked.

```html
<mxi-button type="primary" disabled>Disabled</mxi-button>
```

### Loading

Set a button to the loading state with the `loading` attribute; loading buttons cannot be clicked. Use `loading-text` to customize the loading label. Use `loading-type` to switch the loading icon style (`circular` spinning ring / `spinner` spinning petals); the icon is powered by the [Loading](/en/components/loading) component.

```html
<mxi-button type="primary" loading />
<mxi-button type="primary" loading loading-text="Loading..." />
<mxi-button type="primary" loading loading-type="spinner" />
```

### Press Feedback

The button's overall opacity drops to 0.8 while pressed and restores on release; no press feedback is shown in `disabled` or `loading` state (implemented via `hover-class`).

```html
<mxi-button type="primary">Press to see feedback</mxi-button>
```

### Button Size

Four sizes are supported: `large`, `normal`, `small` and `mini`. The default is `normal`.

```html
<mxi-button type="primary" size="large">Large</mxi-button>
<mxi-button type="primary" size="normal">Normal</mxi-button>
<mxi-button type="primary" size="small">Small</mxi-button>
<mxi-button type="primary" size="mini">Mini</mxi-button>
```

### Block Element

The `block` attribute makes the button fill its parent container's width.

```html
<mxi-button type="primary" block>Block</mxi-button>
```

### Custom Color

Customize the button color with the `color` attribute; `linear-gradient` is supported.

```html
<mxi-button color="#7232dd">Solid</mxi-button>
<mxi-button color="linear-gradient(to right, #ff6034, #ee0a24)">Gradient</mxi-button>
<mxi-button color="#7232dd" plain>Plain Color</mxi-button>
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
| $mxi-color-primary | Primary color | #1989fa |
| $mxi-color-success | Success color | #07c160 |
| $mxi-color-warning | Warning color | #ff976a |
| $mxi-color-danger | Danger color | #ee0a24 |
| $mxi-button-normal-height | Normal button height | 44px |
| $mxi-button-large-height | Large button height | 50px |
| $mxi-button-small-height | Small button height | 32px |
| $mxi-button-mini-height | Mini button height | 24px |
| $mxi-button-radius | Button border radius | 8px |
| $mxi-button-active-opacity | Opacity while pressed | 0.8 |

See [Theming](/en/guide/theming) for the full variable list and override instructions.
