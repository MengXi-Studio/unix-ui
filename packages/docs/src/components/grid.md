---
title: Grid
subtitle: 宫格
demo: pages-sub/grid/grid
---

## 介绍

在水平方向上把页面分隔成等宽度的区块，用于展示内容或进行页面导航。由 `m-grid`（容器）与 `m-grid-item`（格子）组合使用。

## 代码演示

### 基础用法 {#demo-basic}

通过 `icon` 属性设置格子内的图标，`text` 属性设置文字内容。

```vue
<m-grid>
	<m-grid-item icon="location-o" text="文字" />
	<m-grid-item icon="like-o" text="文字" />
	<m-grid-item icon="star-o" text="文字" />
	<m-grid-item icon="phone-o" text="文字" />
</m-grid>
```

### 自定义列数 {#demo-column-num}

默认一行展示四个格子，可以通过 `column-num` 自定义列数，格子宽度按 100/列数% 自动定宽换行。

```vue
<m-grid :column-num="3">
	<m-grid-item icon="location-o" text="文字" />
	<m-grid-item icon="like-o" text="文字" />
	<m-grid-item icon="star-o" text="文字" />
	<m-grid-item icon="phone-o" text="文字" />
	<m-grid-item icon="fire-o" text="文字" />
	<m-grid-item icon="gift-o" text="文字" />
</m-grid>
```

### 自定义内容 {#demo-custom-content}

通过默认插槽可以自定义格子展示的内容（此时 `icon` / `text` 不渲染）。

```vue
<m-grid :border="false" :column-num="3">
	<m-grid-item>
		<m-image src="https://cdn.example.com/apple-1.jpeg" width="100%" height="80px" />
	</m-grid-item>
	<m-grid-item>
		<m-image src="https://cdn.example.com/apple-2.jpeg" width="100%" height="80px" />
	</m-grid-item>
	<m-grid-item>
		<m-image src="https://cdn.example.com/apple-3.jpeg" width="100%" height="80px" />
	</m-grid-item>
</m-grid>
```

### 正方形格子 {#demo-square}

设置 `square` 属性后，格子的高度会和宽度保持一致（padding-top 百分比撑高 + 内容区绝对定位铺满）。

```vue
<m-grid square>
	<m-grid-item icon="fire-o" text="文字" />
	<m-grid-item icon="gift-o" text="文字" />
	<m-grid-item icon="smile-o" text="文字" />
	<m-grid-item icon="music-o" text="文字" />
</m-grid>
```

### 格子间距 {#demo-gutter}

通过 `gutter` 属性设置格子之间的距离（行间与列间同值）。间距在行内平均分配：行首无左间距、行尾无右间距、中间各半，整行铺满。

```vue
<m-grid :gutter="10">
	<m-grid-item icon="cart-o" text="文字" />
	<m-grid-item icon="friends-o" text="文字" />
	<m-grid-item icon="coupon-o" text="文字" />
	<m-grid-item icon="setting-o" text="文字" />
</m-grid>
```

### 内容横排 {#demo-direction}

将 `direction` 属性设置为 `horizontal`，可以让宫格的内容呈横向排列；`reverse` 可以调换图标和文本的位置。

```vue
<m-grid direction="horizontal" :column-num="3">
	<m-grid-item icon="location-o" text="文字" />
	<m-grid-item icon="like-o" text="文字" />
	<m-grid-item icon="star-o" text="文字" />
</m-grid>
<m-grid direction="horizontal" reverse :column-num="3">
	<m-grid-item icon="phone-o" text="文字" />
	<m-grid-item icon="fire-o" text="文字" />
	<m-grid-item icon="gift-o" text="文字" />
</m-grid>
```

### 页面导航 {#demo-navigation}

通过 `url` 属性设置点击后跳转的应用内页面路径，`replace` 时以 `redirectTo` 替换当前页面历史。

```vue
<m-grid clickable :column-num="2">
	<m-grid-item icon="arrow" text="跳转页面" url="/pages/index/index" />
	<m-grid-item icon="arrow" text="替换历史跳转" url="/pages/index/index" :replace="true" />
</m-grid>
```

### 徽标提示 {#demo-badge}

设置 `dot` 属性后，会在图标右上角展示一个小红点。设置 `badge` 属性后，会在图标右上角展示相应的徽标（内部由 [Badge](/components/badge) 包裹渲染）。

```vue
<m-grid :column-num="2">
	<m-grid-item icon="friends-o" text="文字" dot />
	<m-grid-item icon="comment-o" text="文字" badge="99+" />
</m-grid>
```

### 点击事件与按压反馈 {#demo-click}

设置 `clickable` 属性后开启格子按压反馈（按压期间背景色变化），`click` 事件在点击格子时派发。

```vue
<m-grid clickable :column-num="2">
	<m-grid-item icon="thumb-circle-o" text="格子 A" @click="logClick('格子 A')" />
	<m-grid-item icon="comment-circle-o" text="格子 B" @click="logClick('格子 B')" />
</m-grid>
```

## API

### Grid Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| column-num | 列数（最小 1） | number \| string | `4` |
| icon-size | 图标大小，纯数字自动补 px，默认走主题变量 | number \| string | - |
| gutter | 格子之间的间距（px），行间与列间同值 | number \| string | `0` |
| border | 是否显示边框 | boolean | `true` |
| center | 是否将格子内容居中显示 | boolean | `true` |
| square | 是否将格子固定为正方形 | boolean | `false` |
| clickable | 是否开启格子点击反馈 | boolean | `false` |
| direction | 格子内容排列的方向，可选值为 `horizontal` | GridDirection | `vertical` |
| reverse | 是否调换图标和文本的位置 | boolean | `false` |

### GridItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 文字 | string | - |
| icon | 图标名称（IconName 联合类型） | IconName | - |
| icon-color | 图标颜色，支持 CSS 色值，为空时继承内容色 | string | - |
| dot | 是否显示图标右上角小红点 | boolean | `false` |
| badge | 图标右上角徽标的内容（数字用字符串表达，如 `"99+"`） | string | - |
| url | 点击后跳转的应用内页面路径 | string | - |
| replace | 是否在跳转时替换当前页面历史 | boolean | `false` |

### GridItem Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击格子时触发 | event: MouseEvent |

### GridItem Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义宫格的所有内容 |
| icon | 自定义图标 |
| text | 自定义文字 |

## 主题定制

宫格样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-grid-item-content-padding | 格子内容区内边距 | 16px 8px |
| $m-grid-item-content-background | 格子内容区背景色 | #ffffff |
| $m-grid-item-content-active-color | 格子按压反馈背景色 | #f2f3f5 |
| $m-grid-item-icon-size | 默认图标大小（icon-size 未传时生效） | 28px |
| $m-grid-item-text-color | 文本颜色 | #323233 |
| $m-grid-item-text-font-size | 文本大小 | 12px |
| $m-grid-item-border-color | 边框线颜色 | #ebedf0 |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- `to`（Vue Router 路由对象）不支持：uni-app x 无 vue-router，`url` 仅支持应用内页面路径（`uni.navigateTo` / `uni.redirectTo`），不支持外链
- `icon-prefix` 与 `badge-props` 不支持：m-icon 为字体图标（无 class-prefix 机制）；badge 直接复用 m-badge 默认行为
- `badge` 类型收窄为 string：数字语义用字符串表达（如 `"99+"`），与 m-badge 的 content 语义一致
- 边框由「容器顶线 + 左线」与「格子右线 + 下线」两组 0.5px 缩放线拼出：ucss 无伪元素，结构与 Vant 等价但由真实 view 承担
- 按压反馈通过 view 原生 `hover-class` 实现（等价 Vant 的 `:active` 伪类，各端一致）
- gutter 间距在行内平均分配（行首无左、行尾无右），整行铺满；Vant 为每格 padding-right，行尾与右缘留白
