---
title: Waterfall
demo: pages-sub/waterfall/waterfall
added: 0.3.0
---

## Introduction

A waterfall component that arranges content by its real height into staggered columns. It supports configurable column count and gaps, known-size placeholders, dynamic add / remove and manual reflow.

Cross-platform mechanism: the container measures its own available width, divides it into columns and passes each column width to every `m-waterfall-item`. Each item measures its own height at the correct width and reports it back. The container then computes absolute positions (`left` / `top` / `width`) using "registration order → shortest column first" and writes back the total container height. Rendering is strictly sequential: while an earlier item is still loading, later items stay hidden so placed items never jump.

> Why not CSS multi-column / `column-count`: multi-column layout is unstable on App in uni-app x and its column order differs from data order. Absolute positioning behaves identically on Web / App / Mini Program and is the common approach used by Sard / Vant ecosystems.

## Examples

### Basic Usage {#demo-basic}

Content must be wrapped in `m-waterfall-item`. Content with async height (images, etc.) must call the slot's `onLoad` when it finishes loading so the height is re-measured and the layout recomputed.

```vue
<m-waterfall>
	<m-waterfall-item v-for="item in list" :key="item.id" #default="{ onLoad }">
		<view class="wf-item">
			<image class="wf-img" mode="widthFix" :src="item.url" @load="onLoad" @error="onLoad" />
			<text class="wf-title">{{ item.title }}</text>
		</view>
	</m-waterfall-item>
</m-waterfall>
```

```uts
type WaterfallItem = {
	id: number
	title: string
	url: string
}
```

### Columns and Gaps {#demo-columns}

`columns` is the column count (default 2); `column-gap` / `row-gap` are the column / row gaps in px (default 16).

```vue
<m-waterfall :columns="3" :column-gap="8" :row-gap="8">
	<m-waterfall-item v-for="item in list" :key="item.id" #default="{ onLoad }">
		<view class="wf-item">
			<image class="wf-img" mode="widthFix" :src="item.url" @load="onLoad" @error="onLoad" />
		</view>
	</m-waterfall-item>
</m-waterfall>
```

### Known Size {#demo-known-size}

`m-waterfall-load` reserves height in advance from the `width` / `height` ratio via `padding-top`, so it can join the layout before the image finishes loading. If the image loads within `max-wait`, its natural size (from the image load event passed to `onLoad`) is used; after the timeout the custom ratio is kept and the slot's `overtime` flag turns `true`.

```vue
<m-waterfall-item v-for="item in list" :key="item.id" #default="{ onLoad }">
	<view class="wf-item">
		<m-waterfall-load
			:width="item.width"
			:height="item.height"
			:max-wait="300"
			@load="onLoad"
			#default="{ onLoad: onImageLoad, overtime }"
		>
			<image class="wf-img" mode="aspectFill" :src="item.url" @load="(e) => onImageLoad(e)" @error="() => onImageLoad(null)" />
			<text v-if="overtime" class="wf-overtime">Overtime</text>
		</m-waterfall-load>
	</view>
</m-waterfall-item>
```

When `max-wait` is `0` (default), the custom ratio is used immediately without waiting for the natural size — suitable for fixed-ratio covers.

### Dynamic Add / Remove and Reflow {#demo-dynamic}

When the `v-for` data changes, items register / unregister automatically and the layout is recomputed. If content changes outside the framework, call the instance method `reflow()` to force a re-measure.

```vue
<m-waterfall ref="waterfallRef" :columns="2">
	<m-waterfall-item v-for="item in list" :key="item.id" #default="{ onLoad }">
		<!-- content -->
	</m-waterfall-item>
</m-waterfall>
```

```uts
const waterfallRef = ref<ComponentPublicInstance | null>(null)

function callReflow() {
	waterfallRef.value?.$callMethod('reflow')
}
```

### Events and Instance Methods {#demo-events}

```vue
<m-waterfall @loadstart="onLoadStart" @load="onLoad">
	<!-- items -->
</m-waterfall>
```

```uts
const waterfallRef = ref<ComponentPublicInstance | null>(null)

function onLoadStart() {
	console.log('a new loading round started')
}

function onLoad() {
	console.log('all items loaded')
}

function onAllLoaded() {
	waterfallRef.value?.$callMethod('onLoad', () => {
		console.log('onLoad handler executed')
	})
}
```

## API

### m-waterfall Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column count | number | `2` |
| column-gap | Column gap in px | number | `16` |
| row-gap | Row gap in px | number | `16` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node (horizontal padding eats into column width; use an outer wrapper instead) | string | - |

### m-waterfall Events

| Event | Description | Arguments |
| --- | --- | --- |
| loadstart | Emitted when an item is not loaded yet (a new loading round starts) | - |
| load | Emitted when all items are loaded (first layout pass finished) | - |

### m-waterfall Slots

| Name | Description |
| --- | --- |
| default | Waterfall items (`m-waterfall-item`) |

### m-waterfall Instance Methods

| Method | Description | Arguments |
| --- | --- | --- |
| reflow | Re-measure the container width and all item heights, then re-layout | - |
| onLoad | Register an "all loaded" callback; runs on the next tick when currently idle | `handler: () => void` |

### m-waterfall-item Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node (margin is not counted in layout height; use inner padding instead) | string | - |

### m-waterfall-item Slots

| Name | Description | Slot props |
| --- | --- | --- |
| default | Item content | `onLoad: () => void` (call when content finishes loading to trigger re-measure); `columnWidth: number` (current column width in px) |

### m-waterfall-load Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| width | Custom width (only used for the aspect ratio, not the final display size) | number | `320` |
| height | Custom height (only used for the aspect ratio, not the final display size) | number | `240` |
| max-wait | Maximum wait time in ms; `0` means "use the custom ratio immediately" | number | `0` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### m-waterfall-load Slots

| Name | Description | Slot props |
| --- | --- | --- |
| default | Content inside the ratio box (usually an image) | `onLoad: (event: UniImageLoadEvent \| null) => void` (pass the image load event when loaded within `max-wait` to use its natural size; pass `null` on failure); `overtime: boolean` (whether it has timed out) |

### m-waterfall-load Events

| Event | Description | Arguments |
| --- | --- | --- |
| load | Emitted once when loaded or timed out; wire it to the item's `onLoad` slot prop | - |

## Notes

- Every item must call the slot's `onLoad` once its content has loaded (use `@load` / `@error` for images; for purely static content call it manually after mount), otherwise the item is never laid out. With `m-waterfall-load`, simply wire its `@load` to `onLoad`.
- Only the item's own box is measured; `margin` is not counted. Use inner `padding` or `row-gap` for external spacing.
- The container assumes no horizontal padding: horizontal `padding` on the container offsets the column width from the inline positions, so keep page gutters on an outer wrapper.
- Items that are not loaded yet are hidden with `visibility: hidden` while still laid out at the correct width, so text wrapping heights are measured accurately.
- There is no `ResizeObserver` / `IntersectionObserver`: the container width is measured on mount, on window resize and on `reflow()`. Call `reflow()` manually when content size changes outside the framework (font loading, dynamic text, etc.).
- Sequential semantics: later items keep waiting while an earlier item has not called `onLoad`. Use `m-waterfall-load` to reserve space for large images.

## Theming

This is a pure layout component with no dedicated theme variables (columns and gaps are runtime values, which cannot be configured through SCSS defaults). Use props instead.
