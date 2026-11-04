---
title: Sticky
demo: pages-sub/sticky/sticky
---

## Introduction

A sticky layout component. Content stays in the normal document flow while visible, and sticks to the top or bottom by `offset-top` / `offset-bottom` once it scrolls out of view. Wrap it with `m-sticky-box` to keep the sticky element inside a container.

Cross-platform mechanism: every platform uses controlled sticking. The page passes the scroll container's `scrollTop` from its `@scroll` event, and the component locates the nearest scroll container automatically and uses its visible area as the sticking reference — when stuck, the content node switches to `position: fixed` while the root keeps a placeholder height so the layout does not collapse.

> Why not native CSS `position: sticky`: the uni-app x Web runtime injects `overflow: hidden` into every `view`, which turns the nearest scroll container of `position: sticky` into a non-scrolling parent `view` — verified to never stick. Web and App / Mini Program therefore share the same controlled mode with identical behavior.

## Examples

### Basic Usage {#demo-basic}

The page passes the scroll container's `scrollTop` to the component.

```vue
<scroll-view class="page-body" :scroll-y="true" @scroll="onPageScroll">
	<m-sticky :scroll-top="pageScrollTop" :offset-top="0">
		<view class="sticky-bar">Sticky content</view>
	</m-sticky>
</scroll-view>
```

```uts
const pageScrollTop = ref(0)

function onPageScroll(e: UniScrollEvent) {
	pageScrollTop.value = e.detail.scrollTop
}
```

### Offset Top {#demo-offset}

`offset-top` is the distance from the scroll container's top when stuck, in px.

```vue
<m-sticky :scroll-top="pageScrollTop" :offset-top="50">
	<view class="sticky-bar">offset-top 50</view>
</m-sticky>
```

### Sticky Bottom {#demo-bottom}

Set `position` to `bottom` to stick to the bottom; `offset-bottom` is the distance from the scroll container's bottom.

```vue
<m-sticky :scroll-top="pageScrollTop" position="bottom" :offset-bottom="0">
	<view class="sticky-bar">Stick to bottom</view>
</m-sticky>
```

### Container Boundary {#demo-container}

`m-sticky-box` provides the container boundary. Give the container an explicit height to create the sticky travel range. The sticky content stops at the container edge and never overflows it.

```vue
<m-sticky-box custom-style="height: 200px; background-color: #f7f8fa;">
	<m-sticky :scroll-top="pageScrollTop" :offset-top="0">
		<view class="sticky-bar">Sticky inside container</view>
	</m-sticky>
	<view class="box-content">Container content</view>
</m-sticky-box>
```

Sticky bottom inside a container works the same way: set `position` to `bottom` and place the sticky content at the end of the container.

### Events {#demo-events}

```vue
<m-sticky
	:scroll-top="pageScrollTop"
	:offset-top="0"
	@change="onFixedChange"
	@scroll="onStickyScroll"
>
	<view class="sticky-bar">Listen to events</view>
</m-sticky>
```

```uts
function onFixedChange(isFixed: boolean) {
	console.log('isFixed', isFixed)
}

function onStickyScroll(detail: StickyScrollEvent) {
	console.log(detail.scrollTop, detail.isFixed)
}
```

## API

### m-sticky Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| scroll-top | Scroll distance of the outer scroll container (px); sticking and events both depend on it, so the page must pass it | number | `0` |
| position | Sticky direction, `top` / `bottom` | string | `top` |
| offset-top | Distance from the scroll container's top when sticking to top (px) | number | `0` |
| offset-bottom | Distance from the scroll container's bottom when sticking to bottom (px) | number | `0` |
| z-index | Sticky stacking level | number | `99` |
| custom-class | Custom class name for the content node | string.ClassString | - |
| custom-style | Custom inline style for the content node (background, radius, etc.) | string | - |

### m-sticky Events

| Event | Description | Arguments |
| --- | --- | --- |
| change | Emitted when the sticky state changes | `isFixed: boolean` |
| scroll | Emitted on scroll (requires `scroll-top`) | `{ scrollTop: number, isFixed: boolean }` |

### m-sticky Slots

| Name | Description |
| --- | --- |
| default | Sticky content |

### m-sticky-box Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| custom-class | Custom class name for the root node | string.ClassString | - |
| custom-style | Custom inline style for the root node (an explicit `height` is recommended) | string | - |

### m-sticky-box Slots

| Name | Description |
| --- | --- |
| default | Container content (place `m-sticky` inside) |

## Notes

- The page must pass the scroll container's `scrollTop`, otherwise the component does not stick. This applies to every platform — there is no "no wiring needed on Web" usage.
- The component walks up `parentElement` to locate the nearest scroll container (by the `uni-scroll-view` class on Web, and by "scroll height greater than visible height" on App / Mini Program) and uses its visible area as the reference; if none is found it falls back to the viewport.
- `offset-top` / `offset-bottom` are measured from the scroll container's visible edge, so a custom navbar needs no extra offset.
- After content size changes, re-mount the component to refresh measurements (no `refresh()` method is provided). Window resize triggers automatic re-measurement.
- Set a background color via `custom-style` on the sticky content so content underneath does not show through.

## Theming

| Variable | Default | Description |
| --- | --- | --- |
| `$m-sticky-z-index` | `99` | Sticky stacking level |

See [Theming](/en/guide/theming) for the full variable list and override approach.
