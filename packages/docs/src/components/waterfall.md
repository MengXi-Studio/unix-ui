---
title: Waterfall
subtitle: 瀑布流
demo: pages-sub/waterfall/waterfall
---

## 介绍

瀑布流组件。按内容实际高度自适应排列，形成参差不齐的多列布局；支持自定义列数与列 / 行间距、已知宽高占位、动态增删与手动重新排版。

跨端机制：容器测量自身可用宽度后等分出列宽，把列宽下发给每个 `m-waterfall-item`；项在正确列宽下实测自身高度并上报，容器按「注册顺序 → 最短列优先」计算绝对定位（`left` / `top` / `width`），并回填容器总高度。严格按顺序排版：前一项未加载完成时，后续项保持隐藏等待，保证已显示项位置稳定。

> 为什么不用 CSS 多列 / `column-count`：uni-app x 的 App 端对多列布局支持不稳定，且列序与数据顺序不一致；绝对定位方案在 Web / App / 小程序三端表现一致，也是 Sard / Vant 生态的通行做法。

## 代码演示

### 基础用法 {#demo-basic}

内容必须包在 `m-waterfall-item` 中；图片等带异步高度的内容在加载完成后调用插槽的 `onLoad`，触发高度重测与重排。

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

### 列数与间距 {#demo-columns}

`columns` 为列数（默认 2），`column-gap` / `row-gap` 为列间距 / 行间距，单位 px（默认 16）。

```vue
<m-waterfall :columns="3" :column-gap="8" :row-gap="8">
	<m-waterfall-item v-for="item in list" :key="item.id" #default="{ onLoad }">
		<view class="wf-item">
			<image class="wf-img" mode="widthFix" :src="item.url" @load="onLoad" @error="onLoad" />
		</view>
	</m-waterfall-item>
</m-waterfall>
```

### 已知宽高 {#demo-known-size}

`m-waterfall-load` 按 `width` / `height` 的比例用 `padding-top` 预先撑出高度，可在图片加载完成前就参与排版。`max-wait` 内加载完成时采用图片真实宽高（`onLoad` 传入图片 load 事件），超时后按自定义比例排版并通过插槽的 `overtime` 标记。

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
			<text v-if="overtime" class="wf-overtime">超时</text>
		</m-waterfall-load>
	</view>
</m-waterfall-item>
```

`max-wait` 为 `0`（默认）时立即按自定义比例排版，不再等待图片真实尺寸，适合固定比例的封面图。

### 动态增删与重新排版 {#demo-dynamic}

`v-for` 数据变化时项自动注册 / 注销并重排；内容在框架外发生变化时可调用实例方法 `reflow()` 强制重测。

```vue
<m-waterfall ref="waterfallRef" :columns="2">
	<m-waterfall-item v-for="item in list" :key="item.id" #default="{ onLoad }">
		<!-- 内容 -->
	</m-waterfall-item>
</m-waterfall>
```

```uts
const waterfallRef = ref<ComponentPublicInstance | null>(null)

function callReflow() {
	waterfallRef.value?.$callMethod('reflow')
}
```

### 事件与实例方法 {#demo-events}

```vue
<m-waterfall @loadstart="onLoadStart" @load="onLoad">
	<!-- 项 -->
</m-waterfall>
```

```uts
const waterfallRef = ref<ComponentPublicInstance | null>(null)

function onLoadStart() {
	console.log('新一轮加载开始')
}

function onLoad() {
	console.log('全部项加载完成')
}

function onAllLoaded() {
	waterfallRef.value?.$callMethod('onLoad', () => {
		console.log('onLoad 回调执行')
	})
}
```

## API

### m-waterfall Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列数 | number | `2` |
| column-gap | 列间距（px） | number | `16` |
| row-gap | 行间距（px） | number | `16` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式（左右内边距会挤占列宽，建议用外层容器控制） | string | - |

### m-waterfall Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| loadstart | 出现未加载完成的项（新一轮加载开始）时触发 | - |
| load | 全部项加载完成（首轮排版结束）时触发 | - |

### m-waterfall Slots

| 名称 | 说明 |
| --- | --- |
| default | 瀑布流项（`m-waterfall-item`） |

### m-waterfall 实例方法

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| reflow | 重测容器宽度与全部项高度并重排 | - |
| onLoad | 注册「全部加载完成」回调；当前空闲则下一帧立即执行 | `handler: () => void` |

### m-waterfall-item Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式（margin 不计入排版高度，间距请用内部 padding） | string | - |

### m-waterfall-item Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 项内容 | `onLoad: () => void`（内容加载完成后调用，触发重测与重排）；`columnWidth: number`（当前列宽 px） |

### m-waterfall-load Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 自定义宽度（仅用于计算宽高比，非最终展示尺寸） | number | `320` |
| height | 自定义高度（仅用于计算宽高比，非最终展示尺寸） | number | `240` |
| max-wait | 最大等待时间（ms）；`0` 表示立即按自定义比例排版 | number | `0` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### m-waterfall-load Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 比例盒内容（通常为图片） | `onLoad: (event: UniImageLoadEvent \| null) => void`（`max-wait` 内加载完成时传入图片 load 事件，取其真实宽高；失败 / 无尺寸信息传 `null`）；`overtime: boolean`（是否已超时） |

### m-waterfall-load Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| load | 加载完成或超时时触发（只触发一次），接 `m-waterfall-item` 插槽的 `onLoad` | - |

## 注意事项

- 每项都必须在内容加载完成后调用插槽的 `onLoad`（图片用 `@load` / `@error`；纯静态内容可在挂载后手动调用），否则该项不会被排版；使用 `m-waterfall-load` 时把它的 `@load` 接到 `onLoad` 即可。
- 项的高度只统计自身盒子，`margin` 不计入；需要外部间距请改用内部 `padding` 或 `row-gap`。
- 容器无内边距假设：给容器设置左右 `padding` 会使列宽与内联定位错位，页面留白请放在外层容器上。
- 未加载完成的项以 `visibility: hidden` 隐藏，但仍按正确列宽布局，因此测量文本换行高度是准确的。
- 无 `ResizeObserver` / `IntersectionObserver`：容器宽度在挂载、窗口尺寸变化与 `reflow()` 时测量；内容尺寸在框架外变化（如字体加载、动态文本）后需手动 `reflow()`。
- 顺序排版语义：前一项未调用 `onLoad` 时后续项会一直等待；大图建议配合 `m-waterfall-load` 先占位。

## 主题定制

本组件为纯布局组件，无专属主题变量（列数与间距是运行时数值，无法通过 SCSS 默认值配置），通过 props 控制。
