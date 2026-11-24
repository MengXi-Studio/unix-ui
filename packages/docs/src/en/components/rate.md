---
title: Rate
subtitle: 评分
demo: pages-sub/form/rate/rate
added: 0.7.0
---

## Introduction

Used to rate items. Supports half stars, drag-to-rate, custom icon / color / size / count, clearable, arbitrary decimal display in readonly mode and disabled state.

> The value is a `number`, where `0` means not rated; interactive selection snaps to the `0.5` grid.

## Demos

### Basic usage {#demo-basic}

Bind the current score with `v-model:value`, then tap or drag to select:

```vue
<m-rate v-model:value="value" />
```

```uts
const value = ref<number>(3)
```

### Half star {#demo-half}

Set `allow-half` to allow half stars (tapping the left half of an icon selects a half star):

```vue
<m-rate v-model:value="value" allow-half />
```

### Custom icon {#demo-icon}

`icon` / `void-icon` accept m-icon glyph names:

```vue
<m-rate v-model:value="value" icon="like" void-icon="like-o" />
```

### Custom style {#demo-style}

`color` / `void-color` set the active and void colors, `size` / `gap` set the icon size and spacing:

```vue
<m-rate v-model:value="value" color="#ffd21e" void-color="#eeeeee" :size="28" :gap="10" />
```

### Custom count {#demo-count}

```vue
<m-rate v-model:value="value" :count="7" allow-half />
```

### Clearable {#demo-clearable}

With `clearable`, tapping the current score again resets it to 0:

```vue
<m-rate v-model:value="value" clearable />
```

### Readonly and disabled {#demo-disabled}

```vue
<m-rate :value="3" readonly />
<m-rate :value="3" disabled />
```

### Decimal readonly {#demo-decimal}

`readonly` + `allow-half` can display arbitrary decimals (e.g. an average score of 3.3):

```vue
<m-rate :value="3.3" allow-half readonly />
```

### Drag to rate {#demo-touchable}

`touchable` is enabled by default; hold and drag horizontally to pick a score continuously. Set it to `false` to react to taps only:

```vue
<m-rate v-model:value="value" allow-half />
<m-rate v-model:value="value" :touchable="false" allow-half />
```

### Custom icon slots {#demo-slot}

The `icon` / `void-icon` slots expose `{ index, active }`, and their content is also clipped for half stars:

```vue
<m-rate v-model:value="value" allow-half>
	<template #void-icon="{ index }">
		<text class="slot">{{ index + 1 }}</text>
	</template>
	<template #icon="{ index }">
		<text class="slot slot--on">{{ index + 1 }}</text>
	</template>
</m-rate>
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current score (v-model:value), 0 means not rated | number | `0` |
| count | Total number of icons | number | `5` |
| size | Icon size (numbers get a px unit) | string \| number | `''` (empty uses theme `20px`) |
| gap | Icon spacing (numbers get a px unit; equivalent to Vant's gutter) | string \| number | `''` (empty uses theme `4px`) |
| color | Active color | string | `''` (empty uses theme `#ee0a24`) |
| void-color | Void color | string | `''` (empty uses theme `#c8c9cc`) |
| disabled-color | Disabled color (applies to both active and void icons) | string | `''` (empty uses theme `#c8c9cc`) |
| icon | Active glyph (m-icon name) | string | `star` |
| void-icon | Void glyph | string | `star-o` |
| allow-half | Whether half stars are allowed | boolean | `false` |
| clearable | Whether tapping the current score again resets it to 0 | boolean | `false` |
| readonly | Readonly (normal visuals, no interaction) | boolean | `false` |
| disabled | Disabled (greyed out, no interaction) | boolean | `false` |
| touchable | Whether drag-to-rate is allowed | boolean | `true` |
| custom-class / custom-style | Pass-through classes / styles on the root node | - | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:value | Score changed (v-model:value) | value: number |
| change | Score changed | value: number |
| click | The rate is clicked (including rejected taps when disabled / readonly) | event: MouseEvent |

### Slots

| Name | Description | Slot scope |
| --- | --- | --- |
| icon | Custom active icon content | `{ index, active }` |
| void-icon | Custom void icon content | `{ index, active }` |

## Theming

The rate can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-rate-icon-size | Default icon size | 20px |
| $m-rate-gap | Default icon spacing | 4px |
| $m-rate-icon-color | Active icon color | #ee0a24 |
| $m-rate-icon-void-color | Void icon color | #c8c9cc |
| $m-rate-icon-disabled-color | Disabled icon color | #c8c9cc |

See [Theming](/en/guide/theming) for the full variable list and override instructions.

## Differences from Vant

- **Binding syntax**: Vant uses `v-model`; this project uses `v-model:value` consistently
- **Spacing prop**: Vant uses `gutter`; this project uses `gap` (consistent with flex / space / password-input)
- **Text rating**: Sard's `text` / `void-text` is not provided; use the `icon` / `void-icon` slots for arbitrary content
- **Disabled colors**: `disabled-color` applies explicitly to both active and void icons instead of stacking opacity
- **Half-star rendering**: the icon set has no half-star glyph, so a width-percentage clipping layer is stacked over the void glyph; readonly mode clips by the decimal ratio

## Notes

- Values above `count` are clipped visually only and never written back
- `size` / `gap` use px semantics; with non-px units the drag math falls back to the theme step (tap selection is unaffected)
- With `touchable=false` only taps change the score
- The `icon` / `void-icon` slots are unavailable on Mini Program (repeated slot names inside `v-for`), where built-in glyphs are used
- Half stars rely on clipping, so the glyph clipping result on App should be verified on a real device
