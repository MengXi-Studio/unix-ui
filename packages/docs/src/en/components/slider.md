---
title: Slider
subtitle: Slider
demo: pages-sub/form/slider/slider
added: 0.8.0
---

## Introduction

Select a single value or a range within a given interval. Supports vertical orientation, reverse direction, custom step, colors and sizes, value bubbles, scales and custom thumb slots.

> The value type is `number` (single) or `number[]` (in `range` mode). Tapping the track jumps to that position; in range mode the nearest thumb is moved.

## Demos

### Basic usage {#demo-basic}

Bind the current value with `v-model:value`, then drag the thumb or tap the track:

```vue
<m-slider v-model:value="value" @change="onChange" />
```

```uts
const value = ref<number>(40)

function onChange(v: number) {
	console.log('change: ' + v.toString())
}
```

### Range {#demo-range}

With `range`, the value must be an array (`[left, right]`). Thumbs never cross:

```vue
<m-slider range v-model:value="value" />
```

```uts
const value = ref<number[]>([20, 60])
```

### Min, max and step {#demo-min-max}

```vue
<m-slider :min="-50" :max="50" :step="10" v-model:value="value" />
```

### Custom colors and sizes {#demo-style}

`bar-height` / `button-size` are px-based; pass `0` to use theme variables:

```vue
<m-slider
	:bar-height="8"
	:button-size="32"
	active-color="#ee0a24"
	inactive-color="#f2f3f5"
	v-model:value="value"
/>
```

### Vertical {#demo-vertical}

In `vertical` mode the track fills the container height; the default height comes from a theme variable (override with `custom-style`):

```vue
<view style="height: 180px;">
	<m-slider vertical v-model:value="value" show-value />
</view>
```

### Value bubble and scale {#demo-value-scale}

`show-value` renders the current value bubble, positioned by `value-position` (`top` / `bottom` / `left` / `right`). `show-scale` renders ticks positioned by `scale-position`:

```vue
<m-slider show-value value-position="bottom" show-scale :max="10" :step="2" v-model:value="value" />
```

### Disabled and readonly {#demo-disabled}

```vue
<m-slider disabled v-model:value="value" />
<m-slider readonly v-model:value="value" />
```

### Custom thumb {#demo-slot}

Use `#button` for a single thumb, `#left-button` / `#right-button` in range mode. The slot scope is `{ value, dragging }`:

```vue
<m-slider v-model:value="value" :min="0" :max="10">
	<template #button="{ value, dragging }">
		<view class="custom-button">
			<text class="custom-button-text">{{ value }}</text>
		</view>
	</template>
</m-slider>
```

### Events {#demo-events}

```vue
<m-slider
	range
	v-model:value="value"
	@drag-start="onDragStart"
	@drag-end="onDragEnd"
	@change="onChange"
/>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current value (`v-model:value`); must be an array with `range` | number \| number[] | `0` |
| min | Minimum value | number | `0` |
| max | Maximum value | number | `100` |
| step | Step size | number | `1` |
| range | Enable range (dual thumbs) | boolean | `false` |
| disabled | Disable the slider (dimmed, no interaction) | boolean | `false` |
| readonly | Readonly (no interaction) | boolean | `false` |
| vertical | Vertical orientation | boolean | `false` |
| reverse | Reverse the direction | boolean | `false` |
| bar-height | Track height in px (`0` uses theme value) | number | `0` |
| button-size | Thumb size in px (`0` uses theme value) | number | `0` |
| active-color | Active segment color (empty uses theme value) | string | `''` |
| inactive-color | Track color (empty uses theme value) | string | `''` |
| show-value | Show value bubble | boolean | `false` |
| value-position | Bubble position: `top` / `bottom` / `left` / `right` (empty: `top` horizontal, `right` vertical) | string | `''` |
| show-scale | Show scale ticks | boolean | `false` |
| scale-position | Scale position: `top` / `bottom` / `left` / `right` (empty: `bottom` horizontal, `left` vertical) | string | `''` |
| custom-class / custom-style | Pass-through styles for the root node | - | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Value changes in real time (`v-model:value`) | value: number \| number[] |
| change | Fired after dragging ends with a changed value, or after tapping the track | value: number \| number[] |
| drag-start | Fired when thumb dragging starts (TouchEvent on touch screens, MouseEvent on desktop web) | event: TouchEvent \| MouseEvent |
| drag-end | Fired when thumb dragging ends (TouchEvent on touch screens, MouseEvent on desktop web) | event: TouchEvent \| MouseEvent |

### Slots

| Name | Description | Slot props |
| --- | --- | --- |
| button | Custom thumb for single mode | `{ value, dragging }` |
| left-button | Custom left thumb in range mode | `{ value, dragging, dragIndex }` |
| right-button | Custom right thumb in range mode | `{ value, dragging, dragIndex }` |

## Theming

Customize the slider with the following SCSS variables (define them in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-slider-bar-height | Track height | 4px |
| $m-slider-bar-radius | Track border radius | 2px |
| $m-slider-button-size | Thumb size | 24px |
| $m-slider-button-radius | Thumb border radius | 50% |
| $m-slider-button-background | Thumb background | #ffffff |
| $m-slider-button-shadow | Thumb shadow | 0 1px 2px rgba(0, 0, 0, 0.5) |
| $m-slider-active-color | Active segment color | theme primary |
| $m-slider-inactive-color | Track color | #ebedf0 |
| $m-slider-disabled-opacity | Disabled opacity | 0.5 |
| $m-slider-vertical-height | Default height in vertical mode | 150px |
| $m-slider-value-font-size | Value bubble font size | 12px |
| $m-slider-value-color | Value bubble text color | #ffffff |
| $m-slider-value-background | Value bubble background | #323233 |
| $m-slider-value-padding | Value bubble padding | 2px 6px |
| $m-slider-value-radius | Value bubble border radius | 4px |
| $m-slider-value-offset | Gap between bubble and thumb | 8px |
| $m-slider-scale-font-size | Scale font size | 12px |
| $m-slider-scale-color | Scale color | #969799 |
| $m-slider-scale-gap | Gap between scale and track | 6px |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Vant

- **Binding syntax**: Vant uses `v-model`; this project uses `v-model:value`
- **Size types**: Vant accepts number or `'4px'` strings for `bar-height` / `button-size`; this project accepts numbers (px) only, with theme variables providing defaults
- **Extra features**: adopted Sard's `show-value` / `value-position` / `show-scale` / `scale-position` (Vant 4 has no value bubble or scale)
- **Thumb slots**: follows Vant's `button` / `left-button` / `right-button` instead of Sard's `start-thumb` / `end-thumb`
- **Events**: no Sard `input` alias; `v-model:value` + `change` is sufficient

## Notes

- Values are snapped to `step` and clamped to `min` / `max`; `max <= min` is treated as a zero-length interval
- In range mode, crossed values are swapped so that left <= right
- When there are more than 11 ticks, only tick lines are rendered (no text) to avoid overlap
- Passing `0` for `bar-height` / `button-size` makes geometry follow theme variables; positive values override with inline styles
- The track reserves half a thumb size on both ends so thumbs never overflow at 0% / 100%
