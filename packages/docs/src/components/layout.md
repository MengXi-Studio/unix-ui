---
title: Layout
subtitle: 布局
demo: pages-sub/layout/layout
---

## 介绍

布局组件通过 `m-row` 与 `m-col` 的 24 栅格体系实现页面分栏，支持列间距、左右偏移、对齐方式与自动换行。

## 代码演示

### 基础用法 {#demo-basic}

`m-row` 为横向行容器，`m-col` 为列元素，`span` 设置列宽占 24 份栅格中的份数。

```vue
<m-row>
	<m-col span="8"><view class="demo-block">span: 8</view></m-col>
	<m-col span="8"><view class="demo-block">span: 8</view></m-col>
	<m-col span="8"><view class="demo-block">span: 8</view></m-col>
</m-row>
```

### 24 栅格

`span` 取值 1~24，一行内各列份数相加超过 24 时自动换行；`span` 为 0 或未设置时列宽由内容决定。

```vue
<m-row>
	<m-col span="6"><view class="demo-block">span: 6</view></m-col>
	<m-col span="6"><view class="demo-block">span: 6</view></m-col>
	<m-col span="12"><view class="demo-block">span: 12</view></m-col>
</m-row>
```

### 分栏间隔 {#demo-gutter}

`gutter` 属性设置列元素之间的间距（px），支持数组 `[水平, 垂直]` 设置换行后的行间距。列间距基于内边距实现，列内容若需背景色应设置在 Col 内层元素上，保持 Col 自身透明以展示缝隙。

```vue
<m-row gutter="20">
	<m-col span="8"><view class="demo-block">span: 8</view></m-col>
	<m-col span="8"><view class="demo-block">span: 8</view></m-col>
	<m-col span="8"><view class="demo-block">span: 8</view></m-col>
</m-row>
```

### 左右偏移

`offset` 属性设置列左侧的偏移份数，计算方式同 `span`。

```vue
<m-row>
	<m-col span="8"><view class="demo-block">span: 8</view></m-col>
	<m-col span="8" offset="8"><view class="demo-block">span: 8</view></m-col>
</m-row>
```

### 对齐方式 {#demo-align}

`justify` 属性设置主轴对齐，可选值为 `start` `end` `center` `space-around` `space-between`，默认为 `start`；`align` 属性设置交叉轴对齐，可选值为 `top` `center` `bottom`，默认为 `top`。

```vue
<m-row justify="center">
	<m-col span="6"><view class="demo-block">span: 6</view></m-col>
	<m-col span="6"><view class="demo-block">span: 6</view></m-col>
</m-row>
<m-row align="bottom">
	<m-col span="6"><view class="demo-block">span: 6</view></m-col>
	<m-col span="6"><view class="demo-block">span: 6</view></m-col>
</m-row>
```

### 自动换行 {#demo-wrap}

`wrap` 属性默认开启，列元素份数相加超过 24 时自然换行；关闭后不换行。

```vue
<m-row :gutter="[10, 10]">
	<m-col span="6"><view class="demo-block">1</view></m-col>
	<m-col span="6"><view class="demo-block">2</view></m-col>
	<m-col span="6"><view class="demo-block">3</view></m-col>
	<m-col span="6"><view class="demo-block">4</view></m-col>
	<m-col span="6"><view class="demo-block">5</view></m-col>
</m-row>
```

## API

### Row Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 列元素之间的间距（px），数组 `[水平, 垂直]` 设置换行后的行间距 | number \| string \| (number \| string)[] \| null | `0` |
| justify | 主轴对齐方式，可选值为 `start` `end` `center` `space-around` `space-between` | RowJustify \| null | `start` |
| align | 交叉轴对齐方式，可选值为 `top` `center` `bottom` | RowAlign \| null | `top` |
| wrap | 是否自动换行 | boolean | `true` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Col Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 列元素宽度份数，取值 1~24，0 或未设置时宽度由内容决定 | number \| string | `0` |
| offset | 列左侧偏移份数，计算方式同 span | number \| string \| null | `0` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击 Row 时触发 | event: MouseEvent |
| click | 点击 Col 时触发 | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 行内容（Row） |
| default | 列内容（Col） |

## 主题定制

Layout 布局无独立主题变量，全局变量见[主题定制](/guide/theming)。
