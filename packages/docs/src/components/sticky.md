---
title: Sticky
subtitle: 粘性布局
demo: pages-sub/sticky/sticky
---

## 介绍

粘性布局组件。内容在可视范围内正常参与文档流，滚出可视范围后按 `offset-top` / `offset-bottom` 吸附在顶部或底部；配合 `m-sticky-box` 可限制吸附范围不超出容器。

跨端机制：全端统一使用受控吸附。页面在滚动容器的 `@scroll` 中把 `scrollTop` 传给组件，组件自动识别最近的滚动容器并以它的可视区域作为吸附基准，吸附时让内容节点切换 `position: fixed`，同时根节点保留占位高度避免布局塌陷。

> 为什么不用原生 CSS `position: sticky`：uni-app x 的 Web 运行时会给所有 `view` 注入 `overflow: hidden`，`position: sticky` 的最近滚动容器会退化为不滚动的父级 `view`，实测完全不吸附。因此 Web 与 App / 小程序统一走受控模式，双端行为一致。

## 代码演示

### 基础用法 {#demo-basic}

页面把滚动容器的 `scrollTop` 传给组件。

```vue
<scroll-view class="page-body" :scroll-y="true" @scroll="onPageScroll">
	<m-sticky :scroll-top="pageScrollTop" :offset-top="0">
		<view class="sticky-bar">吸附内容</view>
	</m-sticky>
</scroll-view>
```

```uts
const pageScrollTop = ref(0)

function onPageScroll(e: UniScrollEvent) {
	pageScrollTop.value = e.detail.scrollTop
}
```

### 吸顶距离 {#demo-offset}

`offset-top` 为吸附时与滚动容器顶部的距离，单位 px。

```vue
<m-sticky :scroll-top="pageScrollTop" :offset-top="50">
	<view class="sticky-bar">offset-top 50</view>
</m-sticky>
```

### 吸底 {#demo-bottom}

`position` 设为 `bottom` 时吸附在底部，`offset-bottom` 为与滚动容器底部的距离。

```vue
<m-sticky :scroll-top="pageScrollTop" position="bottom" :offset-bottom="0">
	<view class="sticky-bar">吸附在底部</view>
</m-sticky>
```

### 容器边界 {#demo-container}

`m-sticky-box` 提供容器边界，容器高度显式指定即可形成吸附行程。吸附内容到达容器边缘后回顶，不会越过容器。

```vue
<m-sticky-box custom-style="height: 200px; background-color: #f7f8fa;">
	<m-sticky :scroll-top="pageScrollTop" :offset-top="0">
		<view class="sticky-bar">容器内吸顶</view>
	</m-sticky>
	<view class="box-content">容器内容</view>
</m-sticky-box>
```

容器内吸底同理，把 `position` 设为 `bottom` 并将吸附内容放在容器尾部。

### 事件监听 {#demo-events}

```vue
<m-sticky
	:scroll-top="pageScrollTop"
	:offset-top="0"
	@change="onFixedChange"
	@scroll="onStickyScroll"
>
	<view class="sticky-bar">监听事件</view>
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

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| scroll-top | 外层滚动容器的滚动距离（px），吸附与事件均依赖该值，必须由页面回传 | number | `0` |
| position | 吸附方向，可选 `top` / `bottom` | string | `top` |
| offset-top | 吸顶时与滚动容器顶部的距离（px） | number | `0` |
| offset-bottom | 吸底时与滚动容器底部的距离（px） | number | `0` |
| z-index | 吸附层级 | number | `99` |
| custom-class | 自定义内容节点类名 | string.ClassString | - |
| custom-style | 自定义内容节点内联样式（背景色、圆角等） | string | - |

### m-sticky Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 吸附状态变化时触发 | `isFixed: boolean` |
| scroll | 滚动时触发（需传入 `scroll-top`） | `{ scrollTop: number, isFixed: boolean }` |

### m-sticky Slots

| 名称 | 说明 |
| --- | --- |
| default | 吸附内容 |

### m-sticky-box Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式（建议显式 `height`） | string | - |

### m-sticky-box Slots

| 名称 | 说明 |
| --- | --- |
| default | 容器内容（内部放置 `m-sticky`） |

## 注意事项

- 必须由页面把滚动容器的 `scrollTop` 传入，否则组件不会吸附；全端一致，不存在「Web 免接线」的用法。
- 组件会沿 `parentElement` 向上自动识别最近的滚动容器（Web 端按 `uni-scroll-view` 类名，App / 小程序按滚动高度大于可视高度），并以它的可视区域为吸附基准；识别不到时回退为视口。
- `offset-top` / `offset-bottom` 以滚动容器可视区域边缘为基准，自定义导航栏场景无需再叠加导航栏高度。
- 内容尺寸变化后需重新挂载组件才能刷新测量值（本组件未提供 `refresh()` 方法），窗口尺寸变化会自动重测。
- 吸附内容通过 `custom-style` 指定背景色，避免滚动时透出下方内容。

## 主题定制

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$m-sticky-z-index` | `99` | 吸附层级 |

完整变量与覆盖方式见[主题定制](/guide/theming)。
