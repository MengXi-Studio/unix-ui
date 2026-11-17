---
title: PasswordInput
subtitle: Password Input Grid
demo: pages-sub/password-input/password-input
added: 0.7.0
---

## Introduction

Password / verification code input grid with two visual styles: `bordered` (rounded box, default) and `underlined` (bottom 1px line only). Pure display — no value held. Pair with [NumberKeyboard](/en/components/number-keyboard) or use [PasswordInputPopup](/en/components/password-input-popup) for a complete solution.

## Basic Usage

Default `bordered` style with `focused=true` shows a blinking cursor at the active position.

```vue
<m-password-input :value="value" :length="6" :focused="true" />
```

## Styles

### Underlined

```vue
<m-password-input type="underlined" :value="value" :focused="true" />
```

### Plain Text

Set `mask=false` or `plain-text` to show characters directly (SMS verification code scenario).

```vue
<m-password-input value="8865" :length="6" :mask="false" />
<m-password-input value="8865" :length="6" plain-text />
```

### Custom Gap

```vue
<m-password-input :value="value" :gap="20" />
```

### Disabled / Readonly

```vue
<m-password-input value="123456" disabled />
<m-password-input value="123456" readonly />
```

### Hint Text Below

`error-info` takes priority over `info`.

```vue
<m-password-input value="12345" info="6-digit password" />
<m-password-input value="12345" info="6-digit password" error-info="Wrong password" />
```

### Manual Combination with NumberKeyboard

```vue
<m-password-input
	:value="value"
	:length="6"
	:focused="showKeyboard"
	@focus="showKeyboard = true"
/>
<m-number-keyboard v-if="showKeyboard" @input="onInput" @delete="onDelete" />
```

```ts
const value = ref('')
const showKeyboard = ref(false)

const onInput = (key: string) => {
	if (value.value.length < 6) {
		value.value += key
	}
}
const onDelete = () => {
	value.value = value.value.substring(0, value.value.length - 1)
}
```

## API

### Props

| Param | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current password value | `string` | `''` |
| length | Number of grid cells | `number` | `6` |
| type | Style: box / underlined | `'bordered' \| 'underlined'` | `'bordered'` |
| gap | Gap between cells (px) | `number` | `8` |
| mask | Hide password as dots | `boolean` | `true` |
| plainText | Show characters directly (ignores `mask`) | `boolean` | `false` |
| focused | Show cursor and highlight active cell | `boolean` | `false` |
| disabled | Disabled state (greyed out, no `focus` dispatch) | `boolean` | `false` |
| readonly | Read-only (viewable but not clickable) | `boolean` | `false` |
| info | Hint text below | `string` | `''` |
| errorInfo | Error text below (priority over `info`) | `string` | `''` |

### Events

| Event | Description | Callback |
| --- | --- | --- |
| focus | Cell clicked (not dispatched when `disabled` / `readonly`) | — |

## Theme Customization

SCSS variables can be overridden in `uni.scss` at the project root.

| Variable | Default | Description |
| --- | --- | --- |
| `$m-password-input-height` | `50px` | Grid cell height |
| `$m-password-input-gap` | `8px` | Gap between cells |
| `$m-password-input-border-radius` | `6px` | Bordered style radius |
| `$m-password-input-border-color` | `#ebedf0` | Default border color |
| `$m-password-input-border-color-focus` | `$m-color-primary` | Focus border color |
| `$m-password-input-background` | `#ffffff` | Grid cell background |
| `$m-password-input-underline-color` | `#ebedf0` | Underline default color |
| `$m-password-input-underline-color-focus` | `$m-color-primary` | Underline focus color |
| `$m-password-input-font-size` | `20px` | Plain text font size |
| `$m-password-input-text-color` | `#323233` | Text / dot color |
| `$m-password-input-dot-size` | `10px` | Mask dot size |
| `$m-password-input-dot-color` | `#323233` | Mask dot color |
| `$m-password-input-cursor-color` | `#323233` | Cursor color |
| `$m-password-input-cursor-width` | `2px` | Cursor width |
| `$m-password-input-cursor-height` | `60%` | Cursor height |
| `$m-password-input-cursor-duration` | `1000` | Cursor blink duration (ms) |
| `$m-password-input-info-color` | `#646566` | Info text color |
| `$m-password-input-info-font-size` | `12px` | Info text font size |
| `$m-password-input-error-info-color` | `#ee0a24` | Error text color |
| `$m-password-input-disabled-opacity` | `0.5` | Disabled opacity |
