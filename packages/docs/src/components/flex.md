---
title: Flex
subtitle: 弹性布局
demo: pages-sub/flex/flex
---

## 介绍

弹性布局组件用于统一设置子元素的排列方向、间距与对齐方式，等价于对一个 flex 容器设置 `flex-direction` / `align-items` / `justify-content` / `flex-wrap` / `flex`。

间距由子组件 **m-flex-item** 的 margin 实现（App 端 ucss 不支持 flex `gap`），因此每个子元素需用 `<m-flex-item>` 包裹；未包裹的子元素不参与间距计算。m-flex-item 独立使用时退化为普通纵向容器。

## 代码演示

### 基础用法 {#demo-basic}

默认为水平排列、间距 `medium`（主题默认 8px）。

```vue
<m-flex>
	<m-flex-item><m-button type="primary">按钮</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">按钮</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">按钮</m-button></m-flex-item>
</m-flex>
```

### 排列方向 {#demo-direction}

`direction` 等价 `flex-direction`，可选值为 `row` `row-reverse` `column` `column-reverse`，默认为 `row`。反向排列下视觉首项为最后一个子元素，间距仍由轮位准确注入，首尾不会多出留白。

```vue
<m-flex direction="column" gap="medium">
	<m-flex-item><m-button type="primary" block>按钮一</m-button></m-flex-item>
	<m-flex-item><m-button type="primary" block>按钮二</m-button></m-flex-item>
</m-flex>
<m-flex direction="row-reverse" gap="medium">
	<m-flex-item><m-button type="primary">一</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">二</m-button></m-flex-item>
</m-flex>
```

### 间距大小 {#demo-gap}

`gap` 内置三档：`small`（`$m-flex-gap-sm`）、`medium`（`$m-flex-gap`，默认）、`large`（`$m-flex-gap-lg`）。

```vue
<m-flex gap="small">
	<m-flex-item><m-button type="primary">small</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">small</m-button></m-flex-item>
</m-flex>
<m-flex gap="large">
	<m-flex-item><m-button type="primary">large</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">large</m-button></m-flex-item>
</m-flex>
```

### 自定义间距 {#demo-custom}

`gap` 支持自定义尺寸：number 自动补 px、string 原样使用（如 `'30px'`）。

```vue
<m-flex :gap="20">
	<m-flex-item><m-button type="primary">20px</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">20px</m-button></m-flex-item>
</m-flex>
<m-flex gap="30px">
	<m-flex-item><m-button type="primary">30px</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">30px</m-button></m-flex-item>
</m-flex>
```

### 主轴对齐 {#demo-justify}

`justify` 等价 `justify-content`，可选值为 `start` `end` `center` `between` `around` `evenly`；未传时沿用默认 `start`。

```vue
<m-flex justify="center">
	<m-flex-item><m-button size="small">center</m-button></m-flex-item>
	<m-flex-item><m-button size="small">按钮</m-button></m-flex-item>
</m-flex>
<m-flex justify="between">
	<m-flex-item><m-button size="small">between</m-button></m-flex-item>
	<m-flex-item><m-button size="small">按钮</m-button></m-flex-item>
</m-flex>
```

### 交叉轴对齐 {#demo-align}

`align` 等价 `align-items`，可选值为 `start` `end` `center` `baseline`；未传时沿用 view 默认 `stretch`。App 端不支持 `baseline`，降级为首行起点对齐。

```vue
<m-flex align="start" gap="medium">
	<m-flex-item><m-button size="small" type="primary">start</m-button></m-flex-item>
	<m-flex-item><view class="box"></view></m-flex-item>
</m-flex>
<m-flex align="center" gap="medium">
	<m-flex-item><m-button size="small" type="primary">center</m-button></m-flex-item>
	<m-flex-item><view class="box"></view></m-flex-item>
</m-flex>
```

### 自动换行 {#demo-wrap}

`wrap` 开启后子元素超出宽度自动换行，仅 `row` / `row-reverse` 方向生效。主轴间距由全部子项 margin-left 与容器等值负 margin 补偿实现（换行后各行行首与首行顶格），行间距为子项 margin-bottom——末行底部会多出一段间距（子组件无法感知换行位置，为已知限制）。

```vue
<m-flex wrap gap="medium">
	<m-flex-item><m-button type="primary">按钮 1</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">按钮 2</m-button></m-flex-item>
	<m-flex-item><m-button type="primary">按钮 3</m-button></m-flex-item>
</m-flex>
```

### flex 简写 {#demo-flex}

`flex` 透传 CSS `flex` 简写属性，作用于容器自身（如作为父容器的 flex 子项等分空间）。

```vue
<view class="row">
	<m-flex flex="1" gap="small">
		<m-flex-item><m-button size="small">左</m-button></m-flex-item>
	</m-flex>
	<m-flex flex="1" justify="end" gap="small">
		<m-flex-item><m-button size="small">右</m-button></m-flex-item>
	</m-flex>
</view>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向，可选值为 `row` `row-reverse` `column` `column-reverse` | FlexDirection | `row` |
| gap | 间隔大小，内置 `small` `medium` `large`，或 number（自动补 px）/ string（原样）自定义尺寸 | FlexGap | `medium` |
| align | 交叉轴对齐方式，可选值为 `start` `end` `center` `baseline` | FlexAlign \| null | null |
| justify | 主轴对齐方式，可选值为 `start` `end` `center` `between` `around` `evenly` | FlexJustify \| null | null |
| flex | flex CSS 简写属性（作用于容器自身） | string | - |
| wrap | 是否自动换行，仅 `row` / `row-reverse` 方向生效 | boolean | `false` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 子元素内容（子元素需用 m-flex-item 包裹） |

### FlexItem Props（m-flex-item）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

## 主题定制

间距样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-flex-gap-sm | `gap="small"` 档间距 | 4px |
| $m-flex-gap | `gap="medium"` 档间距（默认） | 8px |
| $m-flex-gap-lg | `gap="large"` 档间距 | 12px |

完整变量与覆盖方式见[主题定制](/guide/theming)。
