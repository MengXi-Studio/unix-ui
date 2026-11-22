---
title: Slider
subtitle: 滑动条
demo: pages-sub/form/slider/slider
added: 0.8.0
---

## 介绍

在一个给定区间内选择单值或双值范围。支持垂直方向、方向反转、自定义步长、颜色与尺寸、值气泡、刻度以及自定义滑块插槽。

> 值类型为 `number`（单值）或 `number[]`（`range` 模式）；点击轨道会跳转到点击位置，范围模式取距离最近的滑块。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定当前值，拖动滑块或点击轨道调整：

```vue
<m-slider v-model:value="value" @change="onChange" />
```

```uts
const value = ref<number>(40)

function onChange(v: number) {
	console.log('change: ' + v.toString())
}
```

### 双滑块范围 {#demo-range}

设置 `range` 后值必须是数组（`[左值, 右值]`），两个滑块不会交叉：

```vue
<m-slider range v-model:value="value" />
```

```uts
const value = ref<number[]>([20, 60])
```

### 指定范围与步长 {#demo-min-max}

```vue
<m-slider :min="-50" :max="50" :step="10" v-model:value="value" />
```

### 自定义颜色与尺寸 {#demo-style}

`bar-height` / `button-size` 使用 px 语义，传 `0` 时使用主题变量：

```vue
<m-slider
	:bar-height="8"
	:button-size="32"
	active-color="#ee0a24"
	inactive-color="#f2f3f5"
	v-model:value="value"
/>
```

### 垂直方向 {#demo-vertical}

`vertical` 时轨道纵向铺满容器，默认高度取主题变量（也可用 `custom-style` 指定高度）：

```vue
<view style="height: 180px;">
	<m-slider vertical v-model:value="value" show-value />
</view>
```

### 值气泡与刻度 {#demo-value-scale}

`show-value` 显示当前值气泡，`value-position` 控制方位（`top` / `bottom` / `left` / `right`）；`show-scale` 显示刻度，`scale-position` 同理：

```vue
<m-slider show-value value-position="bottom" show-scale :max="10" :step="2" v-model:value="value" />
```

### 禁用与只读 {#demo-disabled}

```vue
<m-slider disabled v-model:value="value" />
<m-slider readonly v-model:value="value" />
```

### 自定义滑块 {#demo-slot}

单滑块使用 `#button`，范围模式使用 `#left-button` / `#right-button`，作用域为 `{ value, dragging }`：

```vue
<m-slider v-model:value="value" :min="0" :max="10">
	<template #button="{ value, dragging }">
		<view class="custom-button">
			<text class="custom-button-text">{{ value }}</text>
		</view>
	</template>
</m-slider>
```

### 事件 {#demo-events}

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

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值（v-model:value）；`range` 时必须为数组 | number \| number[] | `0` |
| min | 最小值 | number | `0` |
| max | 最大值 | number | `100` |
| step | 步长 | number | `1` |
| range | 双滑块范围模式 | boolean | `false` |
| disabled | 禁用（整体降透明度且不可交互） | boolean | `false` |
| readonly | 只读（不可交互） | boolean | `false` |
| vertical | 垂直方向 | boolean | `false` |
| reverse | 反转方向 | boolean | `false` |
| bar-height | 轨道高度（px，0 用主题变量） | number | `0` |
| button-size | 滑块尺寸（px，0 用主题变量） | number | `0` |
| active-color | 激活段颜色（空字符串用主题变量） | string | `''` |
| inactive-color | 轨道底色（空字符串用主题变量） | string | `''` |
| show-value | 是否显示值气泡 | boolean | `false` |
| value-position | 值气泡方位：`top` / `bottom` / `left` / `right`（空为水平 `top`、垂直 `right`） | string | `''` |
| show-scale | 是否显示刻度 | boolean | `false` |
| scale-position | 刻度方位：`top` / `bottom` / `left` / `right`（空为水平 `bottom`、垂直 `left`） | string | `''` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 值实时变化（v-model:value） | value: number \| number[] |
| change | 拖动结束且值发生变化 / 点击轨道设值 | value: number \| number[] |
| drag-start | 开始拖动滑块（触屏为 TouchEvent，Web 桌面鼠标为 MouseEvent） | event: TouchEvent \| MouseEvent |
| drag-end | 结束拖动滑块（触屏为 TouchEvent，Web 桌面鼠标为 MouseEvent） | event: TouchEvent \| MouseEvent |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| button | 单滑块自定义按钮 | `{ value, dragging }` |
| left-button | 范围模式左侧按钮 | `{ value, dragging, dragIndex }` |
| right-button | 范围模式右侧按钮 | `{ value, dragging, dragIndex }` |

## 主题定制

滑动条样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-slider-bar-height | 轨道高度 | 4px |
| $m-slider-bar-radius | 轨道圆角 | 2px |
| $m-slider-button-size | 滑块尺寸 | 24px |
| $m-slider-button-radius | 滑块圆角 | 50% |
| $m-slider-button-background | 滑块背景色 | #ffffff |
| $m-slider-button-shadow | 滑块阴影 | 0 1px 2px rgba(0, 0, 0, 0.5) |
| $m-slider-active-color | 激活段颜色 | 主题主色 |
| $m-slider-inactive-color | 轨道底色 | #ebedf0 |
| $m-slider-disabled-opacity | 禁用透明度 | 0.5 |
| $m-slider-vertical-height | 垂直模式默认高度 | 150px |
| $m-slider-value-font-size | 值气泡字号 | 12px |
| $m-slider-value-color | 值气泡文字颜色 | #ffffff |
| $m-slider-value-background | 值气泡背景 | #323233 |
| $m-slider-value-padding | 值气泡内边距 | 2px 6px |
| $m-slider-value-radius | 值气泡圆角 | 4px |
| $m-slider-value-offset | 值气泡与滑块间距 | 8px |
| $m-slider-scale-font-size | 刻度字号 | 12px |
| $m-slider-scale-color | 刻度颜色 | #969799 |
| $m-slider-scale-gap | 刻度与轨道间距 | 6px |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- **绑定语法**：Vant 为 `v-model`；本项目统一 `v-model:value`
- **尺寸类型**：Vant 的 `bar-height` / `button-size` 接受 number 或 `'4px'` 字符串；本项目只接受 number（px），主题变量负责默认值
- **新增能力**：吸收 Sard 的 `show-value` / `value-position` / `show-scale` / `scale-position`（Vant 4 无值气泡与刻度）
- **按钮插槽**：对齐 Vant 的 `button` / `left-button` / `right-button`，不使用 Sard 的 `start-thumb` / `end-thumb`
- **事件**：不提供 Sard 的 `input` 别名，`v-model:value` + `change` 足够

## 注意事项

- 值会按 `step` 对齐并按 `min` / `max` 夹取；`max <= min` 时视为区间为 0
- 范围模式左右值交叉时自动交换，保证左 ≤ 右
- 刻度数量超过 11 个时只渲染刻度线，不渲染文字，避免密集重叠
- `bar-height` / `button-size` 传 0 时几何尺寸由主题变量控制；传入正数时用内联样式覆盖
- 轨道左右（垂直为上下）会预留半个滑块尺寸的留白，保证 0% / 100% 时滑块不出界
