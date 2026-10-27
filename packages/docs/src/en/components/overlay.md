---
title: Overlay
demo: pages-sub/overlay/overlay
---

## Introduction

Creates a full-screen overlay, usually used to block interaction with page content. It is the foundation of popup components (Popup, Dialog, etc. will be built on top of it).

## Examples

### Basic Usage {#demo-basic}

Control visibility with the `show` attribute. Set `show` to `false` in the `click` callback to close the overlay (it does not close automatically).

```vue
<m-button type="primary" @click="show = true">Show Overlay</m-button>
<m-overlay :show="show" @click="show = false" />
```

### Embedded Content {#demo-content}

Embed any content via the default slot; pass flex centering styles through `custom-style` to center the content block. Use `@click.stop` on the content to prevent the overlay from closing when it is clicked.

```vue
<m-overlay :show="show" custom-style="display: flex; align-items: center; justify-content: center;" @click="show = false">
	<view @click.stop>Content</view>
</m-overlay>
```

### Z-index and Light Overlay {#demo-z-index}

`z-index` controls the stacking level; `custom-style` can override the default background color (e.g. a light semi-transparent overlay).

```vue
<m-overlay :show="show" :z-index="10" custom-style="background-color: rgba(255, 255, 255, 0.6);" />
```

### Set Animation Duration {#demo-duration}

`duration` sets the fade animation duration in seconds, default `0.3`; set it to `0` to disable the animation.

```vue
<m-overlay :show="show" :duration="2" />
<m-overlay :show="show" :duration="0" />
```

### Lock Page Scroll (Web) {#demo-lock-scroll}

On the Web, body scrolling is automatically locked (`overflow: hidden`) while the overlay is visible and restored when it is closed or the component is unmounted; multiple stacked instances are counted and unlocked only when all are closed. On native App platforms the full-screen fixed overlay blocks touches naturally, so no extra handling is needed.

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show overlay | boolean | `false` |
| z-index | z-index level | number | `1` |
| duration | Animation duration in seconds, `0` disables animation | number | `0.3` |
| custom-class | Custom root node class name | string.ClassString | - |
| custom-style | Custom root node inline style | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| click | Emitted when overlay is clicked (does not close automatically; set `show` to `false` in the callback) | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| default | Overlay content |

## Theming

Overlay styles can be customized via the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-overlay-z-index | Overlay z-index | 1 |
| $m-overlay-background | Overlay background color | rgba(0, 0, 0, 0.7) |

See [Theming](/en/guide/theming) for all variables and how to override them.

## Differences from Vant

- `lock-scroll` is not exposed as a prop: body scrolling is always locked while visible on the Web (counted across instances); the full-screen fixed overlay blocks touches natively on App platforms
- `teleport` is not supported: uni-app x has no corresponding capability
- `z-index` / `duration` are narrowed to number: UTS is strongly typed, no implicit string conversion
- `class-name` is renamed to `custom-class` (library convention)
