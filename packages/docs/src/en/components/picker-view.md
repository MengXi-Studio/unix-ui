---
title: PickerView
subtitle: PickerView
demo: pages-sub/picker-view/picker-view
added: 0.6.0
---

## Introduction

Index-driven multi-column wheel view without toolbar or value semantics: it only reports column indexes (`number[]`), which makes it easy to embed in custom containers (bottom sheets, settings panels).

Compared with [Picker](/en/components/picker), it has no toolbar, does not convert scalar / array values, and does not expand `children` cascade.

## Usage

### Basic {#demo-basic}

```vue
<m-picker-view v-model:value="indexes" :columns="columns" @change="onChange" />
```

```ts
const indexes = ref<number[]>([0])
```

### Multiple columns {#demo-multi}

```vue
<m-picker-view v-model:value="indexes" :columns="yearMonthDay" :option-height="40" />
```

```ts
// 2025 / Feb / 15th
indexes.value = [1, 1, 1]
```

### Custom option content {#demo-slots}

```vue
<m-picker-view v-model:value="indexes" :columns="statusOptions">
	<template #option="{ option }">
		<view class="row">
			<view class="dot" :style="dotStyle(option)"></view>
			<text>{{ option.label }}</text>
		</view>
	</template>
</m-picker-view>
```

### Methods {#demo-methods}

```vue
const view = ref<ComponentPublicInstance | null>(null)
view.value?.$callMethod('getSelectedIndexes')
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column data (1D / 2D; `children` not expanded) | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | Selected indexes (`v-model:value`; empty array means none) | number[] | `null` |
| option-height | Option row height in px (`0` uses 44) | number | `0` |
| visible-option-num | Visible option count (`0` uses 6) | number | `0` |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| readonly | Readonly | boolean | `false` |
| custom-class | Custom class of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Selected indexes written back | value: number[] |
| change | Column changed (full index snapshot) | value: number[] |

### Methods

| Method | Description |
| --- | --- |
| getSelectedIndexes | Returns the current indexes |

### Slots

| Name | Description |
| --- | --- |
| option | Option content (scoped: `option`, `index`, `rowIndex`, `columnIndex`) |

### PickerViewColumn

`m-picker-view-column` is a standalone column that can also be used on its own:

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| options | Column options | PickerOption[] \| null | `null` |
| index | Selected index (controlled) | number | `0` |
| column-index | Column index (returned by events) | number | `0` |
| option-height | Option row height in px (`0` uses 44) | number | `0` |
| visible-option-num | Visible option count (`0` uses 6) | number | `0` |
| swipe-duration | Scroll-stop detection window in ms | number | `200` |
| readonly | Readonly | boolean | `false` |

Events: `change(columnIndex, index)`; slot: `option`.

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-picker-view-background | View background | #ffffff |
| $m-picker-view-frame-color | Selection frame line color | #ebedf0 |

The overall height equals `option-height` × `visible-option-num`; override the container style via `custom-style`. Option text styles follow the date picker column variables (`$m-date-picker-option-*`).
