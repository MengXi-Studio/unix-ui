---
title: PasswordInputPopup
subtitle: Password Input Popup
demo: pages-sub/form/password-input-popup/password-input-popup
added: 0.7.0
---

## Introduction

An all-in-one password / verification code popup: `m-popup` + [PasswordInput](/en/components/password-input) + [NumberKeyboard](/en/components/number-keyboard). Provides built-in `v-model:value` two-way binding, auto `maxlength=length` enforcement, and auto `focused` state on open.

## Basic Usage

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	title="Enter payment password"
	:show-cancel="false"
	confirm-button-text="Confirm"
/>
```

```ts
const show = ref(false)
const value = ref('')
```

### Underlined + Transparent Overlay

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	type="underlined"
	transparent
	show-shadow
	title="Enter verification code"
/>
```

### Random Keyboard (Privacy)

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	keyboard-type="random"
	title="Privacy Keyboard"
/>
```

### Custom Length + Cancel/Confirm Buttons

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	:length="8"
	title="Enter 8-digit password"
	cancel-button-text="Cancel"
	confirm-button-text="OK"
/>
```

## API

### Props

Inherits [PasswordInput Props](/en/components/password-input#props) plus popup-specific props.

| Param | Description | Type | Default |
| --- | --- | --- | --- |
| show | Popup visibility (`v-model:show`) | `boolean` | `false` |
| keyboardType | Keyboard type | `'number' \| 'digit' \| 'idcard' \| 'random'` | `'number'` |
| keyboardTheme | Keyboard theme | `'default' \| 'custom'` | `'default'` |
| extraKeys | Extra keys | `string[]` | `[]` |
| showDeleteKey | Show delete key | `boolean` | `true` |
| deleteButtonText | Delete button text (icon if empty) | `string` | `''` |
| closeButtonText | Custom theme close key text | `string` | `''` |
| title | Toolbar title | `string` | `''` |
| showToolbar | Show cancel/confirm toolbar | `boolean` | `true` |
| cancelButtonText | Cancel button text | `string` | `'Cancel'` |
| confirmButtonText | Confirm button text | `string` | `'OK'` |
| round | Popup rounded corners | `boolean` | `true` |
| transparent | No dark overlay | `boolean` | `false` |
| showShadow | Top shadow bar (for `transparent`) | `boolean` | `false` |
| showCancel | Show cancel button | `boolean` | `true` |
| showConfirm | Show confirm button | `boolean` | `true` |
| closeOnClickOverlay | Close on overlay click | `boolean` | `true` |
| safeAreaInsetBottom | Bottom safe area | `boolean` | `true` |
| zIndex | Z-index | `number` | `1` |
| duration | Animation duration (s) | `number` | `0.3` |

### Events

| Event | Description | Callback |
| --- | --- | --- |
| update:show | Popup visibility update | `value: boolean` |
| update:value | Password value change | `value: string` |
| update:modelValue | Alias for `v-model` | `value: string` |
| input | Key tapped | `key: string` |
| delete | Delete tapped | — |
| close-key | Custom theme close key tapped | — |
| cancel | Cancel button (closes popup) | — |
| confirm | Confirm button (closes popup) | — |
| open | Popup opening | — |
| opened | Popup fully open | — |
| close | Popup closing | — |
| closed | Popup fully closed | — |
| click-overlay | Overlay clicked | `event: MouseEvent` |

## Theme Customization

Reuses `$m-number-keyboard-*` (keyboard + toolbar) and `$m-password-input-*` (grid) theme variables.

- Grid variables: [PasswordInput Theme Customization](/en/components/password-input#theme-customization)
- Keyboard variables: [NumberKeyboard Theme Customization](/en/components/number-keyboard#theme-customization)
