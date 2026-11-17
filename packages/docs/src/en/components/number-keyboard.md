---
title: NumberKeyboard
demo: pages-sub/number-keyboard/number-keyboard
added: 0.7.0
---

## Introduction

A virtual numeric keypad for verification codes, payment passwords, amounts and ID numbers. The component only renders keys and emits events — it **holds no input value**: you build the string yourself and control length or legality with `disabled-key`.

This is the flat panel; the popup form is provided by [NumberKeyboardPopup](/en/components/number-keyboard-popup).

## Demos

### Basic usage {#demo-basic}

`input` emits the key text while `delete` carries no payload; append and remove the value yourself.

```vue
<m-number-keyboard @input="onInput" @delete="onDelete" />
```

```ts
const value = ref('')

const onInput = (key: string) => { value.value += key }
const onDelete = () => {
	if (value.value.length > 0) {
		value.value = value.value.substring(0, value.value.length - 1)
	}
}
```

### Keyboard types {#demo-type}

`type` controls the bottom-left key: `digit` shows `.`, `idcard` shows `X`, and `random` shuffles the digits.

```vue
<m-number-keyboard type="digit" @input="onInput" @delete="onDelete" />
<m-number-keyboard type="idcard" @input="onInput" @delete="onDelete" />
```

### Random order {#demo-random}

`type="random"` shuffles once on mount; afterwards only an explicit `shuffle()` call reorders the keys, so the layout never jumps mid-typing.

```vue
<m-number-keyboard ref="keyboard" type="random" @input="onInput" @delete="onDelete" />
```

```ts
const keyboard = ref<ComponentPublicInstance | null>(null)

const shuffle = () => {
	const inst = keyboard.value
	if (inst != null) {
		inst.$callMethod('shuffle')
	}
}
```

### Side column {#demo-custom}

`theme="custom"` adds a right column: the close key on top and the delete key spanning two rows. When `close-button-text` is empty the close key is omitted and delete fills the column.

```vue
<m-number-keyboard theme="custom" close-button-text="Done" @close="onClose" />
```

### Custom extra key {#demo-extra}

`extra-keys` uses the first item as the bottom-left key, overriding the type default.

```vue
<m-number-keyboard :extra-keys="['00']" @input="onInput" @delete="onDelete" />
```

### Disabled keys {#demo-disabled}

Keys for which `disabled-key` returns `true` are dimmed and emit no `input`; the delete key is unaffected.

```vue
<m-number-keyboard :disabled-key="limitSix" @input="onInput" @delete="onDelete" />
```

```ts
const value = ref('')

const limitSix = (key: string): boolean => value.value.length >= 6
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| type | Keyboard type | `'number' \| 'digit' \| 'idcard' \| 'random'` | `'number'` |
| theme | Theme, `custom` adds the side column | `'default' \| 'custom'` | `'default'` |
| extraKeys | Extra key texts, the first item becomes the bottom-left key | `string[]` | `[]` |
| showDeleteKey | Whether to show the delete key | `boolean` | `true` |
| deleteButtonText | Delete key text; falls back to an icon when empty | `string` | `''` |
| closeButtonText | Side-column close text; hidden when empty (`custom` only) | `string` | `''` |
| disabledKey | Disable callback; `true` dims the key and blocks the event | `(key: string) => boolean \| null` | `null` |
| customClass | Custom root class | `string.ClassString` | `''` |
| customStyle | Custom root inline style | `string` | `''` |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| input | An input key was tapped | `key: string` |
| delete | The delete key was tapped | — |
| close | The side-column close key was tapped | — |

### Slots

| Name | Description |
| --- | --- |
| extra-key | Custom content for the bottom-left extra key |

### Methods

Call through the component instance:

| Name | Description | Arguments |
| --- | --- | --- |
| shuffle | Re-shuffle the digits (meaningful for `type="random"`) | — |

```ts
keyboardRef.value?.$callMethod('shuffle')
```

## Theming

The component exposes the following SCSS variables. Override them by defining the same names in your project's root `uni.scss` (never `@import vars.scss`).

| Variable | Default | Description |
| --- | --- | --- |
| `$m-number-keyboard-background` | `#f2f3f5` | Keyboard background |
| `$m-number-keyboard-padding` | `8px` | Outer padding |
| `$m-number-keyboard-key-gap` | `3px` | Cell padding; visual gap between keys is twice this value |
| `$m-number-keyboard-key-height` | `48px` | Key height |
| `$m-number-keyboard-key-radius` | `6px` | Key corner radius |
| `$m-number-keyboard-key-background` | `#ffffff` | Key background |
| `$m-number-keyboard-key-active-background` | `#e5e6eb` | Pressed background |
| `$m-number-keyboard-key-color` | `#323233` | Key text color |
| `$m-number-keyboard-key-font-size` | `24px` | Key font size |
| `$m-number-keyboard-delete-font-size` | `16px` | Delete / action key font size |
| `$m-number-keyboard-title-height` | `44px` | Popup toolbar height |
| `$m-number-keyboard-title-color` | `#323233` | Toolbar title color |
| `$m-number-keyboard-title-font-size` | `14px` | Toolbar text size |
| `$m-number-keyboard-button-color` | `#1989fa` | Confirm button text color |

## Notes

- The panel renders no `input`, so it never opens the system keyboard; draw the input display yourself above it.
- Pressed state uses `hover-class`; uvue has no `:active` pseudo-class or pseudo-elements.
- Use [NumberKeyboardPopup](/en/components/number-keyboard-popup) when you need a popup, cancel / confirm toolbar, or an input-area slot.
