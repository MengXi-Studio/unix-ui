# Badge 徽标

在图标或文字的右上角展示徽标数字或小红点，也支持独立展示。API 对标 [Vant Badge](https://vant-ui.github.io/vant/#/zh-CN/badge)。

## 引入

组件遵循 easycom 规范，无需引入即可使用，详见[快速上手](/guide/getting-started)。

## 代码演示

### 基础用法

设置 `content` 属性后，徽标会在子元素的右上角显示对应内容；`dot` 属性展示为小红点（无视 content）。徽标包裹图标即与 [Icon 图标](/components/icon)组合使用。

```html
<mxi-badge content="5">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="Hot">
	<view class="child"></view>
</mxi-badge>
<mxi-badge dot>
	<view class="child"></view>
</mxi-badge>

<!-- 与图标组合 -->
<mxi-badge content="5">
	<mxi-icon name="chat-o" size="28" />
</mxi-badge>
```

### 最大值

设置 `max` 属性后，当 `content` 的数值超过最大值时，会自动显示为 `{max}+`（仅当 content 为数字时有效）。

```html
<mxi-badge content="20" max="9">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="200" max="99">
	<view class="child"></view>
</mxi-badge>
```

### 自定义颜色

通过 `color` 属性设置徽标背景色，支持语义色名（`primary` / `success` / `warning` / `danger` / `white`，映射主题变量，覆盖 uni.scss 变量即生效）与 CSS 色值；默认为 danger 红。

```html
<mxi-badge content="5" color="primary">
	<view class="child"></view>
</mxi-badge>
<mxi-badge dot color="primary">
	<view class="child"></view>
</mxi-badge>
```

### 自定义位置

通过 `position` 属性设置徽标位置，默认 `top-right`。徽标中心压角展示，观感与 Vant 一致。

```html
<mxi-badge content="10" position="top-left">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="10" position="bottom-left">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="10" position="bottom-right">
	<view class="child"></view>
</mxi-badge>
```

### 偏移量

通过 `offset-x` / `offset-y` 两个属性设置偏移量（与 Vant 的 `offset` 数组语义等价，拆分为双属性以获得最稳的 UTS 类型约束）：正值分别向右、向下，负值反向，纯数字自动补 `px`。

```html
<mxi-badge content="10" offset-x="4" offset-y="4">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="10" offset-x="-4" offset-y="-4">
	<view class="child"></view>
</mxi-badge>
```

### 独立展示

当徽标没有子元素时，会作为一个独立的元素进行展示。

```html
<mxi-badge content="20" />
<mxi-badge content="200" max="99" />
<mxi-badge dot />
```

### 自定义徽标内容

通过 `content` 插槽可以自定义徽标的内容，比如插入一个图标。

```html
<mxi-badge>
	<view class="child"></view>
	<template #content>
		<view class="badge-icon-box">
			<mxi-icon name="success" custom-style="font-size: 10px;" />
		</view>
	</template>
</mxi-badge>
```

### 数字 0 与 show-zero

`content` 为数字 0 时默认展示；设置 `:show-zero="false"` 后隐藏徽标。

```html
<mxi-badge content="0">
	<view class="child"></view>
</mxi-badge>
<mxi-badge content="0" :show-zero="false">
	<view class="child"></view>
</mxi-badge>
```

### 平台注意：父级容器裁剪

uni-app x 中 view 组件的 `overflow` 默认值为 `hidden`（与 W3C 的 `visible` 不同，见官方 CSS 默认值表）。徽标中心压角展示会超出组件根节点约半个徽标高度，当直接父级是「收缩贴合」的 view（如 flex 行内子项）时，超出部分会被裁剪。此时需给父级容器显式设置 `overflow: visible`：

```html
<!-- 父级收缩贴合徽标尺寸时，需放开裁剪 -->
<view class="badge-item">
	<mxi-badge content="5">
		<mxi-icon name="chat-o" size="28" />
	</mxi-badge>
</view>
```

```scss
.badge-item {
	overflow: visible;
}
```

父级若存在内边距或间距缓冲（徽标未超出其盒子边界），则无需额外处理。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 徽标内容（数字语义用字符串表达；`dot` 为 true 时不生效） | string | - |
| dot | 是否展示为小红点 | boolean | `false` |
| color | 徽标背景色，支持语义色名与 CSS 色值 | string | `$mxi-badge-bg`（danger 红） |
| max | 最大值，数字 content 超限时显示 `{max}+` | string | - |
| show-zero | content 为数字 0 时是否展示徽标 | boolean | `true` |
| position | 徽标位置，可选值 `top-right` / `top-left` / `bottom-left` / `bottom-right` | string | `top-right` |
| offset-x | 水平偏移量，正值向右，纯数字自动补 `px` | string | - |
| offset-y | 垂直偏移量，正值向下，纯数字自动补 `px` | string | - |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 徽标包裹的子元素（无子元素时徽标独立展示） |
| content | 自定义徽标内容（优先于 content 文本） |

## 主题定制

徽标默认样式由以下变量定义（全部 `!default`），在项目根 uni.scss 中直接定义同名变量即可覆盖：

| 变量 | 默认值 | 描述 |
| --- | --- | --- |
| $mxi-badge-height | 16px | 徽标高度 |
| $mxi-badge-color | $mxi-white | 徽标文字颜色 |
| $mxi-badge-bg | $mxi-color-danger | 徽标背景色 |
| $mxi-badge-font-size | 12px | 徽标文字字号 |
| $mxi-badge-font-weight | bold | 徽标文字字重 |
| $mxi-badge-padding | 0 3px | 徽标内边距 |
| $mxi-badge-min-width | 16px | 徽标最小宽度（单数字呈圆形） |
| $mxi-badge-dot-size | 8px | 红点尺寸 |
| $mxi-badge-dot-bg | $mxi-color-danger | 红点背景色 |

完整变量与覆盖方式见[主题定制](/guide/theming)。
