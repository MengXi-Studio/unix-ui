---
title: Fab
subtitle: 悬浮按钮
demo: pages-sub/fab/fab
added: 0.5.0
---

## Introduction

Floating action button: a round entry button pinned to a viewport corner that expands a list of action buttons on click and collapses after one is tapped. Supports four-corner positioning, custom colors, name visibility, overlay click-to-close, and dragging (axis restriction + magnet snapping + two-way position binding).

The component is split into two:

- `m-fab`: container handling positioning, expanded state and dragging
- `m-fab-item`: an action button item handling the name label and click event (must be placed in the default slot of `m-fab`)

## Usage

### Basic Usage {#demo-basic}

Pinned to the bottom-right by default; click the entry to expand the action buttons:

```vue
<m-fab>
	<m-fab-item name="Scan" @click="onClick('Scan')">
		<m-icon name="scan" size="20" />
	</m-fab-item>
	<m-fab-item name="Assign" @click="onClick('Assign')">
		<m-icon name="share" size="20" />
	</m-fab-item>
	<m-fab-item name="SOS" @click="onClick('SOS')">
		<m-icon name="bell" size="20" />
	</m-fab-item>
</m-fab>
```

### Custom Colors {#demo-color}

`background` sets the entry background (gradients supported); `background` / `color` on `m-fab-item` set item colors (inherited from `m-fab` when omitted):

```vue
<m-fab background="linear-gradient(300deg, rgb(245, 52, 35) 0%, rgb(246, 127, 72) 100%)">
	<m-fab-item name="Scan" background="rgb(59, 190, 136)" color="#ffffff">
		<m-icon name="scan" size="20" />
	</m-fab-item>
	<m-fab-item name="Assign" background="rgb(247, 149, 59)" color="#ffffff">
		<m-icon name="share" size="20" />
	</m-fab-item>
</m-fab>
```

### Hide Names {#demo-hide-name}

`hide-name` hides every item name and keeps only the round icons:

```vue
<m-fab hide-name>
	<m-fab-item name="Scan">
		<m-icon name="scan" size="20" />
	</m-fab-item>
</m-fab>
```

### Corner Positioning {#demo-position}

`top` wins over `bottom` and `left` wins over `right`; the theme default offset (24px, bottom-right) applies when omitted. The list expands downward when the entry sits in the upper half of the viewport, upward otherwise:

```vue
<!-- top-left -->
<m-fab top="80px" left="24px">
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
<!-- top-right -->
<m-fab top="80px" right="24px">
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
<!-- bottom-left -->
<m-fab left="24px">
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### Custom Entry {#demo-entry}

The `entry` slot customizes the entry content; the scoped `visible` tells the current expanded state:

```vue
<m-fab>
	<template #entry="{ visible }">
		<text>{{ visible ? 'Close' : 'More' }}</text>
	</template>
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### Custom Names {#demo-name}

The `name` slot customizes the item label (the `name` prop must still be non-empty, or hide everything with `hide-name`):

```vue
<m-fab>
	<m-fab-item name="SOS">
		<template #name>
			<text style="color: #ee0a24;">SOS (requires permission)</text>
		</template>
		<m-icon name="bell" size="20" />
	</m-fab-item>
</m-fab>
```

### Draggable {#demo-draggable}

`draggable` enables dragging, limited to the vertical axis by default (`axis` defaults to `y`); the released position is clamped inside the viewport by `margin-x` / `margin-y`:

```vue
<m-fab draggable>
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### Free Drag and Magnet {#demo-magnet}

`axis="both"` allows two-axis dragging; `magnet="x"` snaps to the nearest left / right edge on release (`magnet="y"` snaps to top / bottom):

```vue
<m-fab draggable axis="both" magnet="x">
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### Two-way Position Binding {#demo-offset}

`v-model:offset` controls the position (`{ x, y }` is the entry button center relative to the viewport top-left corner, in px) and writes back while dragging:

```vue
<m-fab draggable axis="both" v-model:offset="offset">
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
<text>x: {{ offset.x.toFixed(0) }} · y: {{ offset.y.toFixed(0) }}</text>
```

### Overlay Click-to-close {#demo-overlay}

`overlay-closable` renders an overlay while expanded and collapses the action list when the overlay is tapped:

```vue
<m-fab overlay-closable>
	<m-fab-item name="Scan"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

## API

### FabProps

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| top | Distance from the viewport top (wins over bottom; number gets px appended) | string \| number | `''` |
| right | Distance from the viewport right (ignored when left is set) | string \| number | `''` |
| bottom | Distance from the viewport bottom (theme default when omitted) | string \| number | `''` |
| left | Distance from the viewport left (wins over right) | string \| number | `''` |
| color | Entry icon color (theme variable when empty; ignored with a custom `entry` slot) | string | `''` |
| background | Entry background (theme variable when empty, gradients supported; inherited by items without their own background) | string | `''` |
| hide-name | Whether to hide every item name | boolean | `false` |
| overlay-closable | Whether tapping the overlay collapses the list (overlay is rendered while expanded only when true) | boolean | `false` |
| draggable | Whether dragging is enabled (touch gestures; mouse dragging is not supported on desktop) | boolean | `false` |
| axis | Draggable axes: `x` / `y` / `both` / `none` | FabAxis | `y` |
| magnet | Snap to the nearest edge of the given axis on release: `x` / `y` (empty string disables) | FabMagnet | `''` |
| margin-x | Minimum distance to the viewport left / right edges while dragging (px) | number | `24` |
| margin-y | Minimum distance to the viewport top / bottom edges while dragging (px) | number | `24` |
| offset | Controlled position (`v-model:offset`, entry center relative to the viewport top-left) | FabOffset \| null | `null` |
| z-index | Stacking level (inline override when not the theme default) | number | `99` |
| custom-class | Custom class name on the root node | string.ClassString | - |
| custom-style | Custom inline style on the root node | string | - |

### FabSlots

| Slot | Description | Scoped props |
| --- | --- | --- |
| default | Action button list (put `m-fab-item` here) | - |
| entry | Custom entry button content | `{ visible: boolean }` |

### FabEvents

| Event | Description | Parameters |
| --- | --- | --- |
| click | Entry button clicked | event: MouseEvent |
| update:visible | Expanded state changed (true expanded / false collapsed) | value: boolean |
| update:offset | Position changed by dragging (emitted on release) | value: FabOffset |

### FabOffset

| Field | Description | Type |
| --- | --- | --- |
| x | Entry center x (px, relative to the viewport left) | number |
| y | Entry center y (px, relative to the viewport top) | number |

### FabItemProps (m-fab-item)

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| name | Item name (shown next to the icon; hidden by hide-name, also the business identifier of click) | string | `''` |
| color | Icon color (inherits m-fab color when empty) | string | `''` |
| background | Background color (inherits m-fab background when empty) | string | `''` |

### FabItemSlots

| Slot | Description | Scoped props |
| --- | --- | --- |
| default | Button content (usually an `m-icon`) | - |
| name | Custom name content | - |

### FabItemEvents

| Event | Description | Parameters |
| --- | --- | --- |
| click | Action button clicked (the list collapses right after) | event: MouseEvent |

## Theming

Customize the fab with the following SCSS variables (define them in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-fab-size | Entry button diameter | 48px |
| $m-fab-offset | Default corner offset | 24px |
| $m-fab-background | Entry background color | #1989fa |
| $m-fab-icon-color | Entry icon color | #ffffff |
| $m-fab-icon-size | Entry icon font size | 24px |
| $m-fab-shadow | Entry shadow | 0 4px 12px rgba(0, 0, 0, 0.16) |
| $m-fab-active-opacity | Pressed opacity | 0.8 |
| $m-fab-z-index | Stacking level | 99 |
| $m-fab-gap | Gap between the entry and the expanded list | 12px |
| $m-fab-item-size | Item circle diameter | 40px |
| $m-fab-item-background | Item background color | #ffffff |
| $m-fab-item-color | Item icon color | #1989fa |
| $m-fab-item-shadow | Item shadow | 0 2px 8px rgba(0, 0, 0, 0.12) |
| $m-fab-item-gap | Vertical gap between items | 12px |
| $m-fab-item-name-background | Name bubble background | rgba(255, 255, 255, 0.9) |
| $m-fab-item-name-color | Name text color | #323233 |
| $m-fab-item-name-font-size | Name font size | 12px |
| $m-fab-item-name-line-height | Name line height | 16px |
| $m-fab-item-name-padding | Name padding | 4px 8px |
| $m-fab-item-name-radius | Name border radius | 8px |

See [Theming](/en/guide/theming) for the full variable list and override rules.

## Differences from Sard

- **Default entry icon**: without the `entry` slot the entry shows `plus` (collapsed) / `cross` (expanded); Sard ships no default icon
- **Dragging is touch-based**: `draggable` relies on `touchstart / touchmove / touchend` (following the m-tabs gesture precedent in this library); mouse dragging on desktop is not available, and `magnet` snapping animates the final landing
- **Position semantics**: `offset` is the entry button **center** (Sard uses a container offset), consistent with the `margin-x` / `margin-y` clamping and directly readable from `v-model:offset`
- **Expanded list**: a full-viewport-width fixed layer with one-sided padding (an absolutely positioned element inside the narrow component root would be width-clamped and clip the name bubbles); the band it covers does not respond to page taps while expanded
- **Extra capabilities**: `overlay-closable`, `z-index`, `custom-class` / `custom-style`, consistent with the rest of the library

## Notes

- The component is `position: fixed` to the **viewport**, not to a page section; place multiple instances with distinct `top` / `left` values to avoid overlapping
- The expanded list unmounts after the collapse transition finishes, so rapid toggling leaves no stray nodes
- On Mini Program the entry size is measured through `createSelectorQuery` scoped to the component instance, which is multi-instance safe
