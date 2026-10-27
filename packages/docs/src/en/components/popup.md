---
title: Popup
demo: pages-sub/popup/popup
---

## Introduction

A popup container that slides out panel content from five positions (top / bottom / left / right / center). It is the foundation of popup-style components such as Dialog and ActionSheet. It is composed on top of [m-overlay](/en/components/overlay) with built-in mask, stacking level and Web-side scroll locking.

## Examples

### Basic Usage {#demo-basic}

Bind visibility with `v-model:show`; clicking the mask closes the popup automatically, while clicks inside the panel do not trigger the mask.

```vue
<m-button type="primary" @click="show = true">Show Popup</m-button>
<m-popup v-model:show="show">
	<view>Content</view>
</m-popup>
```

### Position {#demo-position}

Set the popup position with `position`, default `center`; `top` / `bottom` fill the full width, `left` / `right` fill the full height.

```vue
<m-popup v-model:show="showTop" position="top">Content</m-popup>
<m-popup v-model:show="showBottom" position="bottom">Content</m-popup>
<m-popup v-model:show="showLeft" position="left">Content</m-popup>
<m-popup v-model:show="showRight" position="right">Content</m-popup>
```

### Rounded Corner {#demo-round}

`round` shows rounded corners on the sides facing the content area (e.g. a `bottom` popup only rounds its top corners).

```vue
<m-popup v-model:show="show" position="bottom" round>Content</m-popup>
```

### Close Icon {#demo-closeable}

`closeable` shows a close icon (driven by [m-icon](/en/components/icon)), `close-icon-position` supports four corners and `close-icon` customizes the icon name. Clicking the icon emits `click-close-icon` and closes the popup.

```vue
<m-popup v-model:show="show" round closeable close-icon-position="top-right">Content</m-popup>
<m-popup v-model:show="show" round closeable close-icon="fail">Content</m-popup>
```

### Disable Closing via Overlay {#demo-overlay-click}

With `close-on-click-overlay` set to `false`, clicking the mask only emits the `click-overlay` event without closing.

```vue
<m-popup v-model:show="show" :close-on-click-overlay="false" @click-overlay="onOverlayClick">Content</m-popup>
```

### Display Events {#demo-events}

`open` / `opened` fire when the enter transition starts and finishes; `close` / `closed` fire when the leave transition starts and finishes. With `duration=0`, `opened` / `closed` fire immediately on toggle.

```vue
<m-popup
	v-model:show="show"
	@open="onOpen"
	@opened="onOpened"
	@close="onClose"
	@closed="onClosed"
>Content</m-popup>
```

### No Overlay {#demo-no-overlay}

With `overlay` set to `false`, the mask background is hidden (transparent floating layer).

```vue
<m-popup v-model:show="show" :overlay="false">Content</m-popup>
```

### Destroy on Close {#demo-destroy}

`destroy-on-close` destroys the panel content after the closing animation finishes and rebuilds it on reopen (internal state resets). By default the content is only hidden and its state preserved. `lazy-render` renders the panel on first display.

```vue
<m-popup v-model:show="show" :destroy-on-close="true">Content</m-popup>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| v-model:show | Whether to show the popup | boolean | `false` |
| position | Popup position, one of `top` `bottom` `left` `right` `center` | string | `center` |
| overlay | Whether to show the mask background (`false` for a transparent floating layer) | boolean | `true` |
| overlay-class | Custom mask class (passed through to the built-in m-overlay) | string.ClassString | - |
| overlay-style | Custom mask style (passed through to the built-in m-overlay) | string | - |
| z-index | z-index level | number | `1` |
| duration | Transition duration (seconds), `0` disables animation | number | `0.3` |
| round | Whether to show rounded corners (per position) | boolean | `false` |
| closeable | Whether to show the close icon | boolean | `false` |
| close-icon | Close icon name (m-icon name) | IconName | `cross` |
| close-icon-position | Close icon position, one of `top-left` `top-right` `bottom-left` `bottom-right` | string | `top-right` |
| close-on-click-overlay | Whether to close when the mask is clicked | boolean | `true` |
| lazy-render | Whether to render the panel on first display (DOM kept afterwards) | boolean | `true` |
| destroy-on-close | Whether to destroy the panel content on close (destroyed after the closing animation, rebuilt on reopen) | boolean | `false` |
| safe-area-inset-top | Whether to add top safe area padding | boolean | `false` |
| safe-area-inset-bottom | Whether to add bottom safe area padding | boolean | `false` |
| before-close | Callback before closing, return `false` to prevent it (applies to the close icon and mask click paths) | (action: string) => boolean | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Emitted when visibility changes (v-model binding) | value: boolean |
| click | Emitted when the panel is clicked | event: MouseEvent |
| click-overlay | Emitted when the mask is clicked (panel clicks do not trigger it) | event: MouseEvent |
| click-close-icon | Emitted when the close icon is clicked | event: MouseEvent |
| open | Emitted when the popup opens | - |
| opened | Emitted when the opening transition finishes (immediately when `duration=0`) | - |
| close | Emitted when the popup closes | - |
| closed | Emitted when the closing transition finishes (immediately when `duration=0`) | - |

### Slots

| Name | Description |
| --- | --- |
| default | Popup content |

## Theming

Popup styles can be customized via the following SCSS variables (define them in the project root `uni.scss` to override defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-popup-background | Panel background color | #ffffff |
| $m-popup-round-radius | Round corner radius | 16px |
| $m-popup-close-icon-size | Close icon size | 22px |
| $m-popup-close-icon-color | Close icon color | #c8c9cc |
| $m-popup-close-icon-margin | Close icon margin | 16px |
| $m-popup-close-icon-z-index | Close icon z-index | 1 |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Vant

- `lock-scroll` is not provided as a prop: body scrolling is always locked on Web while shown (inherited from the built-in m-overlay scroll lock with multi-instance counting); the full-screen mask naturally blocks touches on App
- `teleport` / `transition` / `transition-appear` / `close-on-popstate` / `overlay-props` / `icon-prefix` are not supported: no equivalent capability in uni-app x
- `z-index` defaults to `1` (overlay system default; Vant uses 2000+ dynamic increment) — pass it explicitly for page-level stacking control
- `z-index` / `duration` are narrowed to number; `close-icon` is narrowed to m-icon's `IconName` union type (IDE auto-completion)
- `before-close` only supports synchronous boolean returns; the Promise form is not supported
- With `overlay=false` the popup becomes a transparent floating layer that still intercepts clicks within its area (in Vant, the page below stays interactive without a mask); clicks on the floating layer area emit `click-overlay`
- String forms of `duration` / `z-index` are not accepted: UTS strong typing, no implicit conversion
