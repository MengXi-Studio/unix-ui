---
title: NumberKeyboardPopup
demo: pages-sub/number-keyboard-popup/number-keyboard-popup
added: 0.7.0
---

## Introduction

Popup form of the numeric keypad: `m-popup` composed with [NumberKeyboard](/en/components/number-keyboard). The default slot sits above the keys for custom input areas such as code cells or amount displays; cancel and confirm close the popup automatically.

## Demos

### Basic usage {#demo-basic}

```vue
<m-button @click="show = true">Open keyboard</m-button>

<m-number-keyboard-popup
	v-model:show="show"
	title="Device number"
	@input="onInput"
	@delete="onDelete"
	@confirm="onConfirm"
>
	<view class="display">{{ value == '' ? 'Please input' : value }}</view>
</m-number-keyboard-popup>
```

### Verification code {#demo-code}

Draw divided cells in the default slot and cap the length with `disabled-key`.

```vue
<m-number-keyboard-popup v-model:show="show" title="Verification code" :disabled-key="codeLimit" @input="onInput" @delete="onDelete">
	<view class="code-row">
		<view v-for="(digit, index) in digits" :key="index" class="code-cell">{{ digit }}</view>
	</view>
</m-number-keyboard-popup>
```

```ts
const value = ref('')
const codeLimit = (key: string): boolean => value.value.length >= 6
```

### Amount input {#demo-amount}

`type="digit"` provides the decimal key; add the currency symbol in your display.

```vue
<m-number-keyboard-popup v-model:show="show" title="Amount" type="digit" @input="onInput" @delete="onDelete">
	<view class="amount-row">
		<text class="amount-symbol">¥</text>
		<text class="amount-text">{{ value == '' ? '0.00' : value }}</text>
	</view>
</m-number-keyboard-popup>
```

### Custom toolbar {#demo-toolbar}

With `show-toolbar` off, the `cancel` / `confirm` slots or the side-column close key keep the same interaction.

```vue
<m-number-keyboard-popup v-model:show="show" :show-toolbar="false" theme="custom" close-button-text="Done">
	<view class="display">{{ value }}</view>
</m-number-keyboard-popup>
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show (`v-model:show`) | `boolean` | `false` |
| type | Keyboard type | `'number' \| 'digit' \| 'idcard' \| 'random'` | `'number'` |
| theme | Theme, `custom` adds the side column | `'default' \| 'custom'` | `'default'` |
| extraKeys | Extra key texts, the first item becomes the bottom-left key | `string[]` | `[]` |
| showDeleteKey | Whether to show the delete key | `boolean` | `true` |
| deleteButtonText | Delete key text; icon when empty | `string` | `''` |
| closeButtonText | Side-column close text (`custom` only) | `string` | `''` |
| disabledKey | Disable callback | `(key: string) => boolean \| null` | `null` |
| title | Toolbar title | `string` | `''` |
| showToolbar | Whether to show the cancel / confirm toolbar | `boolean` | `true` |
| cancelButtonText | Cancel button text | `string` | `'Cancel'` |
| confirmButtonText | Confirm button text | `string` | `'Done'` |
| round | Rounded popup corners | `boolean` | `true` |
| closeOnClickOverlay | Close when the overlay is tapped | `boolean` | `true` |
| safeAreaInsetBottom | Bottom safe area | `boolean` | `true` |
| zIndex | Stacking level | `number` | `1` |
| duration | Transition duration (seconds) | `number` | `0.3` |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| update:show | Visibility update | `value: boolean` |
| input | An input key was tapped | `key: string` |
| delete | The delete key was tapped | — |
| close | The side-column close key was tapped (then closes) | — |
| cancel | Cancel tapped (then closes) | — |
| confirm | Confirm tapped (then closes) | — |
| open / opened / close / closed | Popup lifecycle | — |
| click-overlay | Overlay tapped | `event: MouseEvent` |

### Slots

| Name | Description |
| --- | --- |
| default | Input area above the keys |
| cancel / confirm | Replace the toolbar button content |
| extra-key | Custom content for the bottom-left extra key |

### Methods

| Name | Description |
| --- | --- |
| shuffle | Proxies the panel's `shuffle()` to re-randomize digits |

## Theming

Keyboard visuals reuse `$m-number-keyboard-*` and the popup reuses `$m-popup-*`; there is no dedicated variable block. See [NumberKeyboard theming](/en/components/number-keyboard#theming) for the full list.

## Notes

- The popup always rises from the bottom; the position cannot be changed.
- Overlay dismissal is handled by `m-popup`'s `close-on-click-overlay`.
- Interaction matches [PickerPopup](/en/components/picker-popup): confirm and cancel emit `update:show=false` automatically.
