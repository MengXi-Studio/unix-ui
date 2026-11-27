---
title: StatusBar
subtitle: 状态栏
demo: pages-sub/layouts/status-bar/status-bar
added: 0.3.0
---

## 介绍

状态栏占位组件，为 `Navbar`、`Notify` 等定位在页面顶部的元素预留系统状态栏高度，避免内容进入状态栏区域。

高度取值优先级：`height` prop（大于 0 时直接使用）→ `uni.getWindowInfo().statusBarHeight`；App 与微信小程序等平台该值有效，H5 没有系统状态栏、取值为 0（不占位），需要占位时显式传入 `height`。微信小程序端的系统高度读取自 `0.8.1` 起修复。

默认插槽内的内容会绝对铺满状态栏区域，可用于放置背景层或沉浸式头图，与下方头部共享同一渐变背景。

## 代码演示

### 基础用法 {#demo-basic}

不传 `height` 时自动读取系统状态栏高度（App / 微信小程序等有效，H5 为 0）。

```vue
<m-status-bar />
```

### 自定义高度 {#demo-height}

`height` 单位为 px，大于 0 时优先于系统高度，可用于 Web 端模拟、嵌套 webview 或特殊机型校准。

```vue
<m-status-bar :height="24" custom-style="background-color: #e8f3ff" />
<m-status-bar :height="44" custom-style="background-color: #e8f3ff" />
```

### 背景与自定义样式 {#demo-style}

通过 `background` 指定背景色，或经 `custom-style` / `custom-class` 设置渐变与类样式，与导航栏底色保持一致。

```vue
<m-status-bar :height="32" background="#1989fa" />
<m-status-bar :height="32" custom-style="background: linear-gradient(90deg, #1989fa, #39b54a);" />
<m-status-bar :height="32" custom-class="my-status-bar" />
```

### 默认插槽 {#demo-slot}

插槽内容绝对铺满状态栏区域、不参与高度计算，适合放置背景层或沉浸式头图；状态栏与下方头部使用同一渐变时不再需要重复拼接样式字符串。

```vue
<view class="hero">
	<m-status-bar :height="24">
		<view class="hero-bg"></view>
	</m-status-bar>
	<view class="hero-body">
		<text class="hero-title">沉浸式头图</text>
	</view>
</view>
```

### 与导航栏组合 {#demo-navbar}

状态栏占位放在导航内容之前，即构成完整的贴顶结构。

```vue
<view class="navbar">
	<m-status-bar custom-style="background-color: #ffffff" />
	<view class="navbar-body">
		<text class="navbar-title">页面标题</text>
	</view>
</view>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 状态栏高度（px）；0 表示自动读取系统状态栏高度（App / 小程序有效，H5 为 0） | number | `0` |
| background <VersionBadge version="0.8.1" /> | 根节点背景色（'' 表示不设置；渐变请用 custom-style） | string | - |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式（如背景色） | string | - |

### Events

无。

### Slots

| 名称 | 说明 |
| --- | --- |
| default <VersionBadge version="0.8.1" /> | 状态栏区域内容，绝对铺满该区域（背景层 / 沉浸式内容），不参与高度计算 |

## 主题定制

本组件无专属 `$m-*` 主题变量（纯高度占位，颜色经 `custom-style` / `custom-class` 指定）。完整变量与覆盖方式见[主题定制](/guide/theming)。
