---
title: Compact
subtitle: 紧凑布局
demo: pages-sub/compact/compact
---

## 介绍

让按钮等组件紧凑连接且合并边框。`m-compact` 包裹 `m-button` 后，组内按钮自动感知自身位置：相邻项圆角衔接、相邻边框合并为 1px，支持水平 / 垂直方向与块级撑满。

## 代码演示

### 基础使用 {#demo-basic}

使用 `m-compact` 包裹按钮组件，即可将按钮变成紧凑布局，支持变体混排。

```vue
<m-compact>
	<m-button>按钮一</m-button>
	<m-button>按钮二</m-button>
	<m-button>按钮三</m-button>
</m-compact>
<m-compact>
	<m-button type="primary">主要</m-button>
	<m-button plain type="primary">朴素</m-button>
	<m-button type="danger">危险</m-button>
	<m-button plain type="danger">朴素</m-button>
</m-compact>
```

### 块级元素 {#demo-block}

设置 `block` 属性，组内按钮撑满父元素宽度：水平方向 `flex: 1` 等分，子按钮无需逐个设置 `block`。

```vue
<m-compact block>
	<m-button>按钮一</m-button>
	<m-button>按钮二</m-button>
	<m-button>按钮三</m-button>
</m-compact>
```

### 垂直排列 {#demo-vertical}

设置 `direction="vertical"` 可变成垂直方向的紧凑布局，非块级时按钮收缩内容宽。目前仅支持 `Button` 组合。

```vue
<m-compact direction="vertical">
	<m-button>按钮一</m-button>
	<m-button>按钮二</m-button>
	<m-button>按钮三</m-button>
</m-compact>
```

### 垂直排列块级元素 {#demo-vertical-block}

可同时设置 `direction="vertical"` 和 `block` 属性，按钮满宽排列，圆角与边框沿纵向衔接合并。

```vue
<m-compact direction="vertical" block>
	<m-button>按钮一</m-button>
	<m-button>按钮二</m-button>
	<m-button>按钮三</m-button>
</m-compact>
```

### 动态增删 {#demo-dynamic}

组内子项通过 `v-if` / `v-for` 动态增删时，首、中、尾位置自动重排，圆角与边框衔接实时更新。

```vue
<m-compact>
	<m-button v-for="item in list" :key="item">第{{ item }}项</m-button>
</m-compact>
```

### 细边框按钮 {#demo-hairline}

0.5px 细边框按钮（`hairline`）在紧凑布局中同步清理对应侧圆角与边框，合并效果与常规 1px 边框按钮一致。

```vue
<m-compact>
	<m-button plain :hairline="true">按钮一</m-button>
	<m-button plain :hairline="true">按钮二</m-button>
	<m-button plain :hairline="true">按钮三</m-button>
</m-compact>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| block | 变成块级元素，让组内按钮撑满父元素宽度 | boolean | `false` |
| direction | 排列的方向，可选值为 `horizontal` `vertical` | CompactDirection | `horizontal` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义默认内容（当前仅支持 m-button 组合） |

## 主题定制

紧凑布局自身无专属 SCSS 变量：圆角、边框样式全部由组内 `m-button` 自身承担，覆盖 `$m-button-*` 系列变量（如 `$m-button-radius`、`$m-border-width`）即可同步作用于紧凑布局形态。

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Sard 的差异

- 当前仅支持 `m-button` 组合：uni-app x 无法像 Web 端用 CSS 结构选择器（`:first-child` 等）修饰任意子项，改为 m-compact 提供注入上下文、m-button 注册感知位置并自动应用修饰类；输入类组件待 m-input 落地后扩展
- `direction` / `block` 为创建时快照：运行时动态切换不生效，需重建组件
- 边框合并策略：非首项清相邻侧边框、由前一项边框承担分隔线，视觉效果与 Sard 的负 margin 重叠方式一致
