---
title: Fab
subtitle: 悬浮按钮
demo: pages-sub/fab/fab
added: 0.5.0
---

## 介绍

悬浮按钮组件：入口圆钮固定于视口指定位置，点击展开扩展按钮列表，点击扩展按钮后自动收起。支持四角定位、自定义配色、名称显隐、遮罩点击收起，以及拖拽（方向轴限制 + 松手吸附 + 位置双向绑定）。

组件拆为两个：

- `m-fab`：容器，负责定位、展开状态与拖拽
- `m-fab-item`：扩展按钮子项，负责名称展示与点击事件（需置于 `m-fab` 默认插槽内）

## 代码演示

### 基础用法 {#demo-basic}

默认固定在视口右下角，点击入口按钮展开扩展按钮：

```vue
<m-fab>
	<m-fab-item name="扫码报修" @click="onClick('扫码报修')">
		<m-icon name="scan" size="20" />
	</m-fab-item>
	<m-fab-item name="转派维修" @click="onClick('转派维修')">
		<m-icon name="share" size="20" />
	</m-fab-item>
	<m-fab-item name="急停呼叫" @click="onClick('急停呼叫')">
		<m-icon name="bell" size="20" />
	</m-fab-item>
</m-fab>
```

### 自定义颜色 {#demo-color}

`background` 设置入口按钮背景（支持渐变），`m-fab-item` 的 `background` / `color` 设置子项配色（未设置时继承 `m-fab`）：

```vue
<m-fab background="linear-gradient(300deg, rgb(245, 52, 35) 0%, rgb(246, 127, 72) 100%)">
	<m-fab-item name="扫码" background="rgb(59, 190, 136)" color="#ffffff">
		<m-icon name="scan" size="20" />
	</m-fab-item>
	<m-fab-item name="转派" background="rgb(247, 149, 59)" color="#ffffff">
		<m-icon name="share" size="20" />
	</m-fab-item>
</m-fab>
```

### 隐藏按钮名称 {#demo-hide-name}

`hide-name` 隐藏全部扩展按钮的名称，只保留圆形图标：

```vue
<m-fab hide-name>
	<m-fab-item name="扫码报修">
		<m-icon name="scan" size="20" />
	</m-fab-item>
</m-fab>
```

### 四角定位 {#demo-position}

`top` 优先于 `bottom`，`left` 优先于 `right`；未传时使用主题默认间距（右下角 24px）。入口在视口上半侧时向下展开，下半侧向上展开：

```vue
<!-- 左上角 -->
<m-fab top="80px" left="24px">
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
<!-- 右上角 -->
<m-fab top="80px" right="24px">
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
<!-- 左下角 -->
<m-fab left="24px">
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### 自定义入口 {#demo-entry}

`entry` 插槽自定义入口按钮内容，作用域参数 `visible` 为当前展开状态：

```vue
<m-fab>
	<template #entry="{ visible }">
		<text>{{ visible ? '收起' : '更多' }}</text>
	</template>
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### 自定义名称 {#demo-name}

`name` 插槽自定义扩展按钮的名称内容（`name` 属性仍需非空，或由 `hide-name` 统一隐藏）：

```vue
<m-fab>
	<m-fab-item name="急停呼叫">
		<template #name>
			<text style="color: #ee0a24;">急停呼叫（需授权）</text>
		</template>
		<m-icon name="bell" size="20" />
	</m-fab-item>
</m-fab>
```

### 可拖拽 {#demo-draggable}

`draggable` 开启拖拽，默认只允许纵向（`axis` 默认 `y`）；拖拽结束后松手位置按 `margin-x` / `margin-y` 钳制在视口内：

```vue
<m-fab draggable>
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### 自由拖拽与磁吸 {#demo-magnet}

`axis="both"` 允许双向拖拽，`magnet="x"` 松手后吸附到左右最近边（`magnet="y"` 吸附上下最近边）：

```vue
<m-fab draggable axis="both" magnet="x">
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

### 双向绑定位置 {#demo-offset}

`v-model:offset` 受控位置（`{ x, y }` 为入口按钮中心点相对视口左上角的坐标，单位 px），拖拽时回写：

```vue
<m-fab draggable axis="both" v-model:offset="offset">
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
<text>x: {{ offset.x.toFixed(0) }} · y: {{ offset.y.toFixed(0) }}</text>
```

### 遮罩可点击关闭 {#demo-overlay}

`overlay-closable` 展开期间渲染遮罩，点击遮罩收起扩展按钮：

```vue
<m-fab overlay-closable>
	<m-fab-item name="扫码报修"><m-icon name="scan" size="20" /></m-fab-item>
</m-fab>
```

## API

### FabProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| top | 距视口顶部距离（优先于 bottom；number 补 px / string 原样） | string \| number | `''` |
| right | 距视口右边距离（left 非空时以 left 为准） | string \| number | `''` |
| bottom | 距视口底部距离（未传时用主题默认间距） | string \| number | `''` |
| left | 距视口左边距离（优先于 right） | string \| number | `''` |
| color | 入口按钮图标色（空串用主题变量；entry 插槽自定义时不生效） | string | `''` |
| background | 入口按钮背景色（空串用主题变量，支持渐变；子项未设 background 时继承） | string | `''` |
| hide-name | 是否隐藏扩展按钮名称 | boolean | `false` |
| overlay-closable | 点击遮罩是否收起扩展按钮（true 时展开期间渲染遮罩） | boolean | `false` |
| draggable | 是否可拖拽（touch 手势，桌面端鼠标拖拽不生效） | boolean | `false` |
| axis | 允许拖拽的方向轴：`x` / `y` / `both` / `none` | FabAxis | `y` |
| magnet | 松手吸附到指定轴最近边：`x` / `y`（空串不吸附） | FabMagnet | `''` |
| margin-x | 拖拽时距视口左右边缘的最小间距（px） | number | `24` |
| margin-y | 拖拽时距视口上下边缘的最小间距（px） | number | `24` |
| offset | 受控位置（`v-model:offset`，入口按钮中心点相对视口左上角的坐标） | FabOffset \| null | `null` |
| z-index | 层级（非默认值时以 inline 覆盖主题类） | number | `99` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### FabSlots

| 插槽 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 扩展按钮列表（放置 `m-fab-item`） | - |
| entry | 自定义入口按钮内容 | `{ visible: boolean }` |

### FabEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击入口按钮 | event: MouseEvent |
| update:visible | 扩展按钮显隐变化（展开 true / 收起 false） | value: boolean |
| update:offset | 拖拽导致位置变化（松手时派发） | value: FabOffset |

### FabOffset

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| x | 入口按钮中心点 x 坐标（px，相对视口左边） | number |
| y | 入口按钮中心点 y 坐标（px，相对视口顶部） | number |

### FabItemProps（m-fab-item）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 按钮名称（显示在图标旁；hide-name 时隐藏，同时作为 click 的业务标识） | string | `''` |
| color | 图标颜色（空串继承 m-fab 的 color） | string | `''` |
| background | 背景色（空串继承 m-fab 的 background） | string | `''` |

### FabItemSlots

| 插槽 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 按钮内容（通常为 `m-icon`） | - |
| name | 自定义名称内容 | - |

### FabItemEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击扩展按钮（派发后自动收起列表） | event: MouseEvent |

## 主题定制

悬浮按钮样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-fab-size | 入口按钮直径 | 48px |
| $m-fab-offset | 默认角标间距 | 24px |
| $m-fab-background | 入口按钮背景色 | #1989fa |
| $m-fab-icon-color | 入口图标颜色 | #ffffff |
| $m-fab-icon-size | 入口图标字号 | 24px |
| $m-fab-shadow | 入口按钮阴影 | 0 4px 12px rgba(0, 0, 0, 0.16) |
| $m-fab-active-opacity | 按压态透明度 | 0.8 |
| $m-fab-z-index | 层级 | 99 |
| $m-fab-gap | 入口按钮与展开列表的间距 | 12px |
| $m-fab-item-size | 子项圆形按钮直径 | 40px |
| $m-fab-item-background | 子项背景色 | #ffffff |
| $m-fab-item-color | 子项图标色 | #1989fa |
| $m-fab-item-shadow | 子项阴影 | 0 2px 8px rgba(0, 0, 0, 0.12) |
| $m-fab-item-gap | 子项纵向间距 | 12px |
| $m-fab-item-name-background | 名称气泡背景色 | rgba(255, 255, 255, 0.9) |
| $m-fab-item-name-color | 名称文本色 | #323233 |
| $m-fab-item-name-font-size | 名称字号 | 12px |
| $m-fab-item-name-line-height | 名称行高 | 16px |
| $m-fab-item-name-padding | 名称内边距 | 4px 8px |
| $m-fab-item-name-radius | 名称圆角 | 8px |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Sard 的差异

- **入口图标默认值**：未使用 `entry` 插槽时，入口按钮默认显示 `plus`（收起态）/ `cross`（展开态）图标，Sard 默认不内置图标
- **拖拽为 touch 手势**：`draggable` 走 `touchstart / touchmove / touchend`（对齐本项目 m-tabs 手势切换先例），桌面浏览器暂无鼠标拖拽；`magnet` 吸附在松手时平滑落位
- **位置语义**：`offset` 为入口按钮**中心点**坐标（Sard 为容器偏移），与 `margin-x` / `margin-y` 的钳制逻辑一致，`v-model:offset` 可直接回显数值
- **展开列表**：使用视口整宽的固定层 + 单侧 padding 定位（避免绝对定位元素在组件根节点狭窄包含块内被钳宽导致名称气泡裁切），展开期间该层覆盖的条带区域不响应页面点击
- **扩展能力**：新增 `overlay-closable`（遮罩点击收起）、`z-index`、`custom-class` / `custom-style`，与库内其他组件保持一致

## 注意事项

- 组件为 `position: fixed`，固定在**视口**而非页面某个区块；同一页面放置多个实例时请用 `top` / `left` 等错开，避免重叠
- 展开列表在收起动画播完后才卸载，快速连点展开 / 收起不会残留节点
- 小程序端入口尺寸测量走 `createSelectorQuery`（组件实例作用域），多实例安全
