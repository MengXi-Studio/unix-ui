---
title: Space
subtitle: 间距
demo: pages-sub/space/space
---

## 介绍

间距组件用于在子元素之间统一设置间距，基于 flex gap 实现，支持水平与垂直方向、自定义间距大小、对齐方式、自动换行与块级填充。

## 代码演示

### 基础用法 {#demo-basic}

默认水平排列，子元素之间保持主题默认间距（8px）。

```vue
<mxi-space>
	<mxi-button type="primary">按钮</mxi-button>
	<mxi-button type="primary">按钮</mxi-button>
	<mxi-button type="primary">按钮</mxi-button>
</mxi-space>
```

### 垂直间距 {#demo-vertical}

`direction` 属性设置间距方向，可选值为 `horizontal` `vertical`，默认为 `horizontal`。

```vue
<mxi-space direction="vertical">
	<mxi-button type="primary" block>按钮</mxi-button>
	<mxi-button type="primary" block>按钮</mxi-button>
</mxi-space>
```

### 自定义间距 {#demo-custom}

`size` 支持数字（自动补 px）、字符串（原样使用）与数组 `[横向, 纵向]`；未传时取主题默认间距，垂直方向取数组第一个值作主轴间距。

```vue
<mxi-space :size="20">按钮 20px 间距</mxi-space>
<mxi-space size="12px">按钮 12px 间距</mxi-space>
<mxi-space :size="[20, 8]" wrap>横向 20 / 换行后纵向 8</mxi-space>
```

### 对齐方式 {#demo-align}

`align` 属性设置子元素对齐方式，可选值为 `start` `end` `center` `baseline`；未传时水平方向默认 `center`，垂直方向默认 `stretch`。

```vue
<mxi-space align="start">顶端对齐</mxi-space>
<mxi-space align="center">居中对齐</mxi-space>
<mxi-space align="end">末端对齐</mxi-space>
<mxi-space align="baseline">基线对齐</mxi-space>
```

### 自动换行 {#demo-wrap}

`wrap` 属性开启后子元素超出宽度自动换行，仅水平方向生效。

```vue
<mxi-space wrap>
	<mxi-button type="primary">按钮 1</mxi-button>
	<mxi-button type="primary">按钮 2</mxi-button>
	<mxi-button type="primary">按钮 3</mxi-button>
</mxi-space>
```

### 块级填充

`fill` 属性使组件块级填充父元素宽度，默认宽度收缩贴合内容。

```vue
<mxi-space direction="vertical" fill>
	<mxi-button type="primary" block>按钮</mxi-button>
	<mxi-button type="primary" block>按钮</mxi-button>
</mxi-space>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 间距方向，可选值为 `horizontal` `vertical` | SpaceDirection | `horizontal` |
| size | 间距大小，number 自动补 px、string 原样、数组 `[横向, 纵向]`，未传时取主题默认间距 | SpaceSize \| SpaceSize[] \| null | null |
| align | 对齐方式，可选值为 `start` `end` `center` `baseline`，未传时水平默认 `center`、垂直默认 `stretch` | SpaceAlign \| null | null |
| wrap | 是否自动换行，仅水平方向生效 | boolean | `false` |
| fill | 是否块级填充父元素 | boolean | `false` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 子元素内容 |

## 主题定制

间距样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $mxi-space-size | 默认间距（未传 size 时） | 8px |

完整变量与覆盖方式见[主题定制](/guide/theming)。
