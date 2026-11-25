---
title: Signature
subtitle: Signature
demo: pages-sub/form/signature/signature
added: 0.8.0
---

## Introduction

A handwriting signature pad built on Canvas. It supports custom pen color, line width and background color, undo with a configurable history depth, clear and confirm actions, plus a full-screen mode.

> Confirming returns a PNG `dataURL`; when nothing has been written or the pad has been cleared, `image` is an empty string.

## Demos

### Basic Usage {#demo-basic}

Tap the confirm button after writing to fire `submit` with `{ image: string }`:

```vue
<m-signature @submit="onSubmit" @clear="onClear" />
```

```uts
const image = ref<string>('')

function onSubmit(data: any | null) {
	if (data == null) {
		return
	}
	image.value = (data as UTSJSONObject).getString('image') ?? ''
}

function onClear() {
	image.value = ''
}
```

### Custom Pen {#demo-pen}

`pen-color` sets the ink color and `line-width` sets the stroke width:

```vue
<m-signature pen-color="#ee0a24" :line-width="6" />
```

### Custom Background {#demo-background}

`background-color` is painted into the exported image; leave it empty for a transparent result:

```vue
<m-signature background-color="#f7f8fa" />
```

### Undo and History {#demo-history}

`history-size` limits the number of strokes kept for undo (default 20). Undo and clear are built into the action bar:

```vue
<m-signature :history-size="3" />
```

### Instance Methods {#demo-methods}

Call `submit` / `undo` / `clear` / `resize` through a `ref`:

```vue
<m-signature ref="signatureRef" />
```

```uts
const signatureRef = ref<ComponentPublicInstance | null>(null)

signatureRef.value?.$callMethod('clear')
```

### Full Screen {#demo-full}

`full-screen` with `v-model:visible` shows the pad full screen; customize the bottom hint with the `tips` slot:

```vue
<m-button @click="visible = true">Open Signature</m-button>

<m-signature full-screen v-model:visible="visible" @submit="onSubmit" @cancel="onCancel">
	<template #tips>
		<text>Please sign in the blank area above</text>
	</template>
</m-signature>
```

```uts
const visible = ref<boolean>(false)
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| pen-color | Ink color | string | `#000` |
| line-width | Stroke width in px | number | `3` |
| history-size | Max strokes kept for undo (`<=0` means unlimited) | number | `20` |
| background-color | Background color of the exported image (empty for transparent) | string | `''` |
| tips | Hint shown when Canvas is unavailable | string | `''` (built-in fallback) |
| clear-button-text | Clear button text | string | `Clear` |
| undo-button-text | Undo button text | string | `Undo` |
| confirm-button-text | Confirm button text | string | `Confirm` |
| full-screen | Whether to use full-screen mode | boolean | `false` |
| visible | Full-screen visibility (v-model:visible, full-screen only) | boolean | `false` |
| cancel-button-text | Cancel button text (full-screen only) | string | `Cancel` |
| custom-class / custom-style | Direct root style hooks | - | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| submit | Confirm tapped (empty signature yields an empty string) | data: `{ image: string }` |
| clear | Clear tapped | - |
| start | A stroke starts | - |
| signing | While writing | event: TouchEvent |
| end | A stroke ends | - |
| cancel | Cancel tapped in full-screen mode | - |
| update:visible | Full-screen visibility update (v-model:visible) | visible: boolean |

### Slots

| Name | Description | Scope |
| --- | --- | --- |
| tips | Hint inside the canvas / at the bottom in full-screen mode | - |

### Methods

Call through the component instance (`ref` + `$callMethod`, or a template ref):

| Method | Description | Arguments |
| --- | --- | --- |
| submit | Fires `submit`, same as tapping confirm | - |
| clear | Clears the signature and history | - |
| undo | Removes the last stroke | - |
| resize | Re-measures and redraws after layout or visibility changes | - |

## Platform Notes

- `submit` only returns `{ image }` and does not expose the Canvas element (element types differ across platforms and cannot be safely passed out);
- Only PNG `dataURL` is produced: uni-app x `toDataURL()` takes no arguments, so `type` / `quality` are not provided;
- Export relies on `uni.createCanvasContextAsync` and `CanvasContext.toDataURL()`, which require HBuilderX 4.25+ (WeChat Mini Program 4.41+).

## Theming

Customize the signature pad with the following SCSS variables (define them in your project `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-signature-padding | Component padding | 8px |
| $m-signature-content-height | Canvas height | 200px |
| $m-signature-content-background | Canvas background | #ffffff |
| $m-signature-content-border-width | Canvas border width | theme hairline |
| $m-signature-content-border-color | Canvas border color | #dadada |
| $m-signature-tips-font-size | Hint font size | 12px |
| $m-signature-tips-color | Hint color | theme tertiary text |
| $m-signature-action-height | Action bar height | 44px |
| $m-signature-action-gap | Horizontal padding of actions | 12px |
| $m-signature-action-font-size | Action font size | 14px |
| $m-signature-action-color | Action text color | theme secondary text |
| $m-signature-action-confirm-color | Confirm text color | theme primary |
| $m-signature-action-disabled-color | Disabled action text color | theme quaternary text |
| $m-signature-full-z-index | Full-screen z-index | 999 |
| $m-signature-full-background | Full-screen background | #ffffff |
| $m-signature-full-gap | Full-screen padding | 16px |
| $m-signature-hint-font-size | Full-screen hint font size | 14px |
| $m-signature-hint-color | Full-screen hint color | theme tertiary text |
