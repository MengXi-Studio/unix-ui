---
title: Toast
subtitle: 轻提示
demo: pages-sub/toast/toast
---

## Introduction

Show a black semi-transparent toast in the middle of the page, for message notification, loading indication and operation feedback. Both **imperative API** and **component usage** are supported.

> **Prerequisite**: uni-app x has no runtime dynamic mounting capability (components cannot be mounted outside the page like Vant / Sard do). The imperative API is implemented via a page-level container — place one `<m-toast />` (easycom, zero import) in the page template that calls `showToast`, then the global functions work anywhere in that page.

```vue
<template>
	<view>
		<m-button @click="onClick">Show Toast</m-button>
		<!-- Preset functional container (once per page) -->
		<m-toast />
	</view>
</template>

<script setup lang="uts">
	import { showToast } from '@/uni_modules/m-ui-x/components/m-toast/toast.uts'

	function onClick() {
		showToast('Some messages')
	}
</script>
```

## Imperative API

`showToast` accepts a `string` shorthand or a `ToastOptions` object; consecutive calls are **singleton semantics** (the latter overrides the former).

```ts
import { showToast, showSuccessToast, showFailToast, showLoadingToast, closeToast } from '@/uni_modules/m-ui-x/components/m-toast/toast.uts'

showToast('Some messages')
showToast({ message: 'Custom icon', icon: 'like-o' })
showSuccessToast('Success')
showFailToast('Fail')
showLoadingToast('Loading...') // does not auto close by default, call closeToast manually
closeToast()
```

| Method | Description | Type |
| --- | --- | --- |
| showToast | Show a toast (string shorthand is treated as message) | `(options: string \| ToastOptions) => void` |
| showLoadingToast | Show a loading toast, type forced to `loading`, duration defaults to `0` (no auto close), forbidClick defaults to `true` | `(options: string \| ToastOptions) => void` |
| showSuccessToast | Show a success toast, type forced to `success` | `(message: string) => void` |
| showFailToast | Show a fail toast, type forced to `fail` | `(message: string) => void` |
| closeToast | Close the current toast | `() => void` |

## Examples

### Basic Usage

Use `showToast` to show a text toast in the middle of the screen; `message` supports `\n` line break, auto closes after 2s by default.

```ts
showToast('Some messages')
showToast('First line\nSecond line')
```

### Word Break

Control how the message wraps with `wordBreak`: `break-all` breaks at any character, `normal` wraps at word boundaries (default), `break-word` prefers whole words and only breaks a word when it cannot fit.

```ts
showToast({ message: 'abcdefghijklmnopqrstuvwxyz0123456789', wordBreak: 'break-all' })
showToast({ message: 'the quick brown fox jumps over the lazy dog', wordBreak: 'normal' })
showToast({ message: 'thisisaverylongwordwithoutspaces', wordBreak: 'break-word' })
```

> Platform note: on App platforms `word-break` only works in Vapor mode (HBuilderX 5.31+), VDOM mode is not supported; fully supported on Web.

### Success / Fail

`showSuccessToast` and `showFailToast` show result toasts with the default icons.

```ts
showSuccessToast('Success')
showFailToast('Fail')
```

### Loading

Use `showLoadingToast` to show a loading toast; `duration: 0` (no auto close) and `forbidClick: true` are the defaults, call `closeToast` to close it manually.

```ts
showLoadingToast('Loading...')
closeToast()
```

### Custom Icon

Customize the icon via the `icon` option (an m-icon name); the icon and text are arranged vertically.

```ts
showToast({ message: 'Custom icon', icon: 'like-o' })
```

### Position

Set the position via `position`, defaults to `middle`.

```ts
showToast({ message: 'Top toast', position: 'top', duration: 1000 })
showToast({ message: 'Middle toast', duration: 1000 })
showToast({ message: 'Bottom toast', position: 'bottom', duration: 1000 })
```

### Overlay and Forbid Click

Set `overlay` to show a semi-transparent overlay; `forbidClick` renders a transparent interceptor to block background clicks.

```ts
showToast({ message: 'Overlay toast', overlay: true })
showToast({ message: 'Forbid click', forbidClick: true })
```

### Close on Click

Set `closeOnClick` to close the toast when the bubble is clicked; combine with `closeOnClickOverlay` to close on overlay clicks.

```ts
showToast({ message: 'Click me to close', closeOnClick: true })
```

### Opened / Close Callback

Listen to the toast being fully shown and closed via `onOpened` and `onClose` (triggered after the transition).

```ts
showToast({
	message: 'Callback toast',
	onOpened: () => { /* fade in done */ },
	onClose: () => { /* closed */ }
})
```

### Component Usage

Besides the imperative API, `m-toast` can be used as a component: control visibility via `v-model:show`, and put arbitrary content into the default slot.

```vue
<template>
	<m-button @click="show = true">Show Toast</m-button>

	<m-toast v-model:show="show" :duration="2000" @opened="onOpened" @close="onClose">
		<m-image src="https://cdn.example.com/cat.jpeg" width="40px" height="40px" round />
	</m-toast>
</template>
```

## ToastOptions API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| type | Toast type, one of `text` `loading` `success` `fail` | `ToastType` | `text` |
| position | Position, one of `top` `middle` `bottom` | `ToastPosition` | `middle` |
| message | Text content, supports `\n` line break | `string` | - |
| icon | Custom icon (IconName); success/fail have default icons, passing overrides them; ignored for loading type | `IconName` | - |
| iconSize | Icon size, plain number gets px appended | `number \| string` | `36px` |
| overlay | Whether to show the background overlay | `boolean` | `false` |
| forbidClick | Whether to forbid background clicks (defaults to `true` for loading type) | `boolean` | `false` |
| closeOnClick | Whether to close on bubble click | `boolean` | `false` |
| closeOnClickOverlay | Whether to close on overlay click | `boolean` | `false` |
| loadingType | Loading icon type, one of `circular` `spinner` (effective when type=loading) | `LoadingType` | `circular` |
| duration | Display duration (ms), `0` means no auto close; defaults to `0` for loading, `2000` otherwise | `number` | - |
| wordBreak | How the message wraps, one of `normal` `break-all` `break-word`; App platforms require Vapor mode | `ToastWordBreak` | `normal` |
| zIndex | z-index level | `number \| string` | `2000` |
| customClass | Custom bubble class name | `string.ClassString` | - |
| customStyle | Custom bubble inline style | `string` | - |
| onOpened | Callback after fully shown | `() => void` | - |
| onClose | Callback after closed | `() => void` | - |

### Differences from Vant

The following options are not supported due to uvue limitations: `html` type (no v-html), `transition` animation class names (built-in fade in/out), `teleport` (no host outside the render tree); `icon` only accepts m-icon font names, image URLs are not supported. Multiple instances (`allowMultipleToast`) are not supported yet — singleton semantics only. `wordBreak` is supported with the same values as Vant (`normal` / `break-all` / `break-word`), but on App platforms it only works in Vapor mode (HBuilderX 5.31+), VDOM mode is not supported.

## Component API

### Props

Same as [ToastOptions](#toastoptions-api), plus:

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether the toast is visible (`v-model:show`) | `boolean` | `false` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Emitted when visibility changes (v-model) | `boolean` |
| opened | Emitted after fully shown (fade in done) | - |
| close | Emitted after closed (fade out done) | - |

### Slots

| Name | Description |
| --- | --- |
| default | Custom toast content (replaces the message text) |

## Theme Customization

### Style Variables

The component provides the following CSS variables, which can be overridden by defining the same names in `uni.scss` (all `!default`):

| Name | Default | Description |
| --- | --- | --- |
| $m-toast-z-index | 2000 | z-index level |
| $m-toast-max-width | 70% | Max bubble width |
| $m-toast-background | rgba(0, 0, 0, 0.7) | Bubble background color |
| $m-toast-text-color | #ffffff | Text color |
| $m-toast-font-size | 14px | Text font size |
| $m-toast-line-height | 20px | Text line height |
| $m-toast-radius | 8px | Bubble border radius |
| $m-toast-icon-size | 36px | Icon size |
| $m-toast-text-min-width | 96px | Min width of text-only bubble |
| $m-toast-text-padding | 8px 12px | Padding of text-only bubble |
| $m-toast-default-width | 88px | Width of icon bubble |
| $m-toast-default-min-height | 88px | Min height of icon bubble |
| $m-toast-top-distance | 20% | Top position offset |
| $m-toast-bottom-distance | 20% | Bottom position offset |
| $m-toast-overlay-background | rgba(0, 0, 0, 0.7) | Overlay background color |

## FAQ

### Why does the page need a preset `<m-toast />`?

Vant / Sard imperative calls rely on Web runtime dynamic mounting (creating a component instance via `createApp` and attaching it to `document.body`). uni-app x is a compile-time framework: templates are compiled to native rendering code, custom components cannot be created or mounted at runtime, and there is no host node outside the page. Therefore this component adopts the "global functions + page-level container + global singleton bridge" approach: the top-of-stack container is mounted last and naturally holds the registration, and imperative calls go through the bridge directly into the current container's render callback — keeping the API feel consistent with Vant.
