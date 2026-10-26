---
title: Loading
subtitle: 加载
demo: pages-sub/loading/loading
---

## 介绍

加载图标用于表示页面或操作的加载状态。支持弧段圆环与花瓣两种类型。

## 代码演示

### 基础用法

```vue
<m-loading />
```

### 加载类型 {#demo-type}

支持 `circular`（弧段圆环，默认）与 `spinner`（花瓣）两种类型。

```vue
<m-loading />
<m-loading type="spinner" />
```

### 自定义颜色 {#demo-color}

通过 `color` 属性自定义加载图标的颜色，支持 CSS 色值与语义色名（`default` / `primary` / `success` / `warning` / `danger` / `white`）；语义色名编译期绑定主题变量，在 `uni.scss` 中覆盖对应 `$m-color-*` 变量即可生效。

```vue
<m-loading color="#1989fa" />
<m-loading type="spinner" color="#07c160" />
<m-loading type="spinner" color="primary" />
```

### 自定义大小 {#demo-size}

通过 `size` 属性自定义加载图标的大小，支持纯数字（自动补 `px`）、带单位字符串或 `100%`（撑满外部定尺寸容器），默认为 `30px`。

```vue
<m-loading size="16" />
<m-loading type="spinner" size="24" />
```

### 加载文案 {#demo-text}

将加载文案放在默认插槽中；`vertical` 属性可将图标与文案垂直排列。

```vue
<m-loading>加载中...</m-loading>
<m-loading type="spinner" size="24" vertical>加载中...</m-loading>
```

### 自定义文字样式 {#demo-text-style}

通过 `text-size` 与 `text-color` 属性自定义文案的字号与颜色。

```vue
<m-loading text-size="16" text-color="#1989fa">加载中...</m-loading>
```

### 自定义图标 {#demo-icon}

通过 `icon` 插槽替换默认图标，替换后的图标仍按 `type` 对应的节奏旋转。

```vue
<m-loading>
	<template #icon>
		<text style="font-size: 24px;">❀</text>
	</template>
</m-loading>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 加载类型，可选值为 `circular` `spinner` | LoadingType | `circular` |
| color | 加载图标颜色，支持 CSS 色值与语义色名（`default` `primary` `success` `warning` `danger` `white`） | string | - |
| size | 加载图标大小，支持纯数字、带单位字符串或 `100%`（撑满外部定尺寸容器） | string | - |
| vertical | 是否垂直排列图标与文字 | boolean | `false` |
| text-size | 文字字号，支持纯数字或带单位字符串 | string | - |
| text-color | 文字颜色 | string | - |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 加载文案 |
| icon | 自定义加载图标（替换默认图标） |

## 主题定制

加载样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-loading-spinner-size | 加载图标尺寸 | 30px |
| $m-loading-spinner-color | 加载图标颜色 | #c8c9cc |
| $m-loading-text-color | 文字颜色 | #646566 |
| $m-loading-text-font-size | 文字字号 | 14px |
| $m-loading-text-gap | 图标与文字间距 | 4px |

完整变量与覆盖方式见[主题定制](/guide/theming)。
