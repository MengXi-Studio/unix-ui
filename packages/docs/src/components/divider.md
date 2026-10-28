---
title: Divider
subtitle: 分割线
demo: pages-sub/divider/divider
---

## 介绍

分隔内容为多个区域，支持水平与垂直两种形态、虚线、0.5px 细线与内容位置定制。

## 代码演示

### 基础用法 {#demo-basic}

默认渲染一条水平分割线。

```vue
<m-divider />
```

### 展示文本 {#demo-content}

通过默认插槽在分割线中间插入内容，文本颜色 / 字号 / 行高继承组件根设置（插槽内的 text 未单独设色时直接生效）。

```vue
<m-divider>文本</m-divider>
```

### 内容位置 {#demo-content-position}

通过 `content-position` 指定内容所在位置，一侧线限宽、另一侧撑满剩余空间。

```vue
<m-divider content-position="left">文本</m-divider>
<m-divider content-position="right">文本</m-divider>
```

### 虚线 {#demo-dashed}

添加 `dashed` 属性使分割线渲染为虚线。

```vue
<m-divider dashed>文本</m-divider>
```

### 细线对比 {#demo-hairline}

`hairline` 默认 `true`（0.5px 细线，通过 border 1px + 单轴缩放 0.5 实现，App 端安全）；设为 `false` 渲染 1px 常规线。

```vue
<m-divider :hairline="false" />
<m-divider />
```

### 垂直分割线 {#demo-vertical}

`vertical` 渲染垂直分割线。uni-app x 无 inline-block，垂直形态为 **flex 子项**：外层容器需设置 `flex-direction: row` + `align-items: center`，分割线与文本并排。

```vue
<view style="flex-direction: row; align-items: center;">
	<text>文本</text>
	<m-divider vertical />
	<text>文本</text>
	<m-divider vertical dashed />
	<text>文本</text>
</view>
```

### 自定义样式 {#demo-style}

`style` 直达组件根节点，`color` / `padding` 经继承或布局生效；分割线颜色为子节点，单实例定制请覆盖 `$m-divider-border-color` 主题变量（见下方差异说明）。

```vue
<m-divider style="color: #1989fa; padding: 0 16px;">文本</m-divider>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| dashed | 是否使用虚线 | boolean | `false` |
| hairline | 是否使用 0.5px 细线 | boolean | `true` |
| content-position | 内容位置，可选值为 `left` `right` | DividerContentPosition | `center` |
| vertical | 是否使用垂直分割线 | boolean | `false` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 内容 |

## 主题定制

分割线样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-divider-margin | 水平分割线外边距 | 16px 0 |
| $m-divider-vertical-margin | 垂直分割线外边距 | 0 8px |
| $m-divider-text-color | 文本颜色 | #969799 |
| $m-divider-font-size | 文本大小 | 14px |
| $m-divider-line-height | 文本行高 | 24px |
| $m-divider-border-color | 分割线颜色 | #ebedf0 |
| $m-divider-content-padding | 文本与线之间的间距 | 16px |
| $m-divider-content-left-width | 内容居左时前置线最大宽度 | 10% |
| $m-divider-content-right-width | 内容居右时后置线最大宽度 | 10% |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- 垂直分割线为 flex 子项形态：uni-app x 无 inline-block，外层容器需 `flex-direction: row` + `align-items: center`，不支持 Vant 的文本流内联用法
- 单实例线色不支持 `style="{ borderColor }"`：分割线是子节点且 ucss 无 `inherit`（Vant 靠伪元素继承根节点 border-color），线色定制请覆盖 `$m-divider-border-color` 主题变量
- 0.5px 细线通过 border 1px + `scaleY(0.5)` / `scaleX(0.5)` 缩放实现：规避 App 端 0.5px 边框取整问题
- 伪元素线改为真实节点：ucss 无 `::before` / `::after`，结构与 Vant 源码等价但由组件内 view 承担
