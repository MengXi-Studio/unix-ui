---
title: Toast
subtitle: 轻提示
demo: pages-sub/toast/toast
---

## 介绍

在页面中间弹出黑色半透明提示，用于消息通知、加载提示、操作结果提示等场景。同时支持**函数式调用**与**组件式用法**两种形态。

> **使用前提**：uni-app x 无运行时动态挂载能力（无法像 Vant / Sard 那样把组件动态挂载到页面之外），函数式调用采用「页面预置容器」实现——在使用 `showToast` 的页面模板中预置一次 `<m-toast />`（easycom 零 import），之后全局函数即可正常唤起。

```vue
<template>
	<view>
		<m-button @click="onClick">展示提示</m-button>
		<!-- 页面预置函数式容器（一次即可） -->
		<m-toast />
	</view>
</template>

<script setup lang="uts">
	import { showToast } from '@/uni_modules/m-ui-x/components/m-toast/toast.uts'

	function onClick() {
		showToast('提示内容')
	}
</script>
```

## 函数式调用

`showToast` 支持 `string` 简写与 `ToastOptions` 对象两种入参；同页连续调用为**单例语义**（后一次覆盖前一次）。

```ts
import { showToast, showSuccessToast, showFailToast, showLoadingToast, closeToast } from '@/uni_modules/m-ui-x/components/m-toast/toast.uts'

showToast('提示内容')
showToast({ message: '自定义图标', icon: 'like-o' })
showSuccessToast('成功文案')
showFailToast('失败文案')
showLoadingToast('加载中...') // 默认不自动关闭，需手动关闭
closeToast()
```

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| showToast | 展示提示（`string` 简写视为 message） | `(options: string \| ToastOptions) => void` |
| showLoadingToast | 展示加载提示，type 强制 `loading`、duration 默认 `0` 不自动关闭、forbidClick 默认 `true` | `(options: string \| ToastOptions) => void` |
| showSuccessToast | 展示成功提示，type 强制 `success` | `(message: string) => void` |
| showFailToast | 展示失败提示，type 强制 `fail` | `(message: string) => void` |
| closeToast | 关闭当前提示 | `() => void` |

## 代码演示

### 文字提示

使用 `showToast` 在屏幕中部展示一条文字提示，`message` 支持 `\n` 换行，默认 2s 自动关闭。

```ts
showToast('提示内容')
showToast('这是一条\n换行的提示')
```

### 换行控制

通过 `wordBreak` 控制 message 的换行方式：`break-all` 任意字符处截断换行、`normal` 按单词边界换行（默认）、`break-word` 整词优先换行、单词放不下时才截断。

```ts
showToast({ message: 'abcdefghijklmnopqrstuvwxyz0123456789', wordBreak: 'break-all' })
showToast({ message: 'the quick brown fox jumps over the lazy dog', wordBreak: 'normal' })
showToast({ message: 'thisisaverylongwordwithoutspaces', wordBreak: 'break-word' })
```

> 平台差异：App 端 `word-break` 仅 Vapor 模式（HBuilderX 5.31+）生效，VDOM 模式不支持；Web 端全支持。

### 成功 / 失败提示

`showSuccessToast` 与 `showFailToast` 展示对应默认图标的结果提示。

```ts
showSuccessToast('成功文案')
showFailToast('失败文案')
```

### 加载提示

使用 `showLoadingToast` 展示加载提示，默认 `duration: 0` 不自动关闭、`forbidClick: true` 禁止背景点击，需调用 `closeToast` 手动关闭。

```ts
showLoadingToast('加载中...')
closeToast()
```

### 自定义图标

通过 `icon` 选项自定义图标（传入 m-icon 图标名），图标与文字竖排展示。

```ts
showToast({ message: '自定义图标', icon: 'like-o' })
```

### 展示位置

通过 `position` 选项设置展示位置，默认 `middle`。

```ts
showToast({ message: '顶部提示', position: 'top', duration: 1000 })
showToast({ message: '中部提示', duration: 1000 })
showToast({ message: '底部提示', position: 'bottom', duration: 1000 })
```

### 遮罩与禁止点击

设置 `overlay` 显示半透明背景遮罩；`forbidClick` 渲染透明拦截层禁止背景点击。

```ts
showToast({ message: '遮罩提示', overlay: true })
showToast({ message: '禁止点击', forbidClick: true })
```

### 点击关闭

设置 `closeOnClick` 后点击气泡即关闭；搭配 `closeOnClickOverlay` 可在点击遮罩时关闭。

```ts
showToast({ message: '点击我关闭', closeOnClick: true })
```

### 展示 / 关闭回调

通过 `onOpened` 与 `onClose` 选项监听提示完全展示与关闭（在过渡完成后触发）。

```ts
showToast({
	message: '回调提示',
	onOpened: () => { /* 淡入完成 */ },
	onClose: () => { /* 关闭完成 */ }
})
```

### 组件式用法

除函数式调用外，也可以用组件方式使用 `m-toast`：`v-model:show` 控制显隐，默认插槽嵌入任意自定义内容。

```vue
<template>
	<m-button @click="show = true">展示提示</m-button>

	<m-toast v-model:show="show" :duration="2000" @opened="onOpened" @close="onClose">
		<m-image src="https://cdn.example.com/cat.jpeg" width="40px" height="40px" round />
	</m-toast>
</template>
```

## ToastOptions API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 提示类型，可选值 `text` `loading` `success` `fail` | `ToastType` | `text` |
| position | 展示位置，可选值 `top` `middle` `bottom` | `ToastPosition` | `middle` |
| message | 文本内容，支持 `\n` 换行 | `string` | - |
| icon | 自定义图标（IconName），success/fail 有默认图标，传入则覆盖；loading 型忽略 | `IconName` | - |
| iconSize | 图标大小，纯数字自动补 px | `number \| string` | `36px` |
| overlay | 是否显示背景遮罩层 | `boolean` | `false` |
| forbidClick | 是否禁止背景点击（loading 型默认 `true`） | `boolean` | `false` |
| closeOnClick | 是否点击提示后关闭 | `boolean` | `false` |
| closeOnClickOverlay | 是否点击遮罩层后关闭 | `boolean` | `false` |
| loadingType | 加载图标类型，可选值 `circular` `spinner`（type=loading 时生效） | `LoadingType` | `circular` |
| duration | 展示时长 (ms)，`0` 表示不自动关闭；loading 型默认 `0`，其余默认 `2000` | `number` | - |
| wordBreak | message 换行方式，可选值 `normal` `break-all` `break-word`；App 端仅 Vapor 模式生效 | `ToastWordBreak` | `normal` |
| zIndex | z-index 层级 | `number \| string` | `2000` |
| customClass | 气泡自定义类名 | `string.ClassString` | - |
| customStyle | 气泡自定义内联样式 | `string` | - |
| onOpened | 完全展示后回调 | `() => void` | - |
| onClose | 关闭后回调 | `() => void` | - |

### 与 Vant 的差异

以下选项因 uvue 能力限制暂不支持：`html` 类型（无 v-html 能力）、`transition` 动画类名（内置淡入淡出）、`teleport`（无渲染树外宿主）；`icon` 仅支持 m-icon 字体图标名，不支持图片链接。多实例（`allowMultipleToast`）暂未支持，为单例语义。`wordBreak` 已支持，取值与 Vant 一致（`normal` / `break-all` / `break-word`），但 App 端仅 Vapor 模式（HBuilderX 5.31+）生效，VDOM 模式不支持。

## 组件式 API

### Props

与 [ToastOptions](#toastoptions-api) 一致，另增：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 当前是否显示（`v-model:show`） | `boolean` | `false` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐状态变化时触发（v-model） | `boolean` |
| opened | 完全展示后触发（淡入完成） | - |
| close | 关闭后触发（淡出完成） | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 自定义提示内容（替代 message 文本） |

## 主题定制

### 样式变量

组件提供下列 CSS 变量，可在 `uni.scss` 中定义同名变量覆盖（全部 `!default`）：

| 名称 | 默认值 | 描述 |
| --- | --- | --- |
| $m-toast-z-index | 2000 | 层级 |
| $m-toast-max-width | 70% | 气泡最大宽度 |
| $m-toast-background | rgba(0, 0, 0, 0.7) | 气泡背景色 |
| $m-toast-text-color | #ffffff | 文字颜色 |
| $m-toast-font-size | 14px | 文字字号 |
| $m-toast-line-height | 20px | 文字行高 |
| $m-toast-radius | 8px | 气泡圆角 |
| $m-toast-icon-size | 36px | 图标大小 |
| $m-toast-text-min-width | 96px | 纯文字气泡最小宽度 |
| $m-toast-text-padding | 8px 12px | 纯文字气泡内边距 |
| $m-toast-default-width | 88px | 图标方形气泡宽度 |
| $m-toast-default-min-height | 88px | 图标方形气泡最小高度 |
| $m-toast-top-distance | 20% | 顶部位置偏移 |
| $m-toast-bottom-distance | 20% | 底部位置偏移 |
| $m-toast-overlay-background | rgba(0, 0, 0, 0.7) | 背景遮罩颜色 |

## 常见问题

### 为什么需要页面预置 `<m-toast />`？

Vant / Sard 的函数式调用依赖 Web 环境的运行时动态挂载（`createApp` 创建组件实例挂载到 `document.body`）。uni-app x 是编译型框架，模板在编译期确定为原生渲染代码，无法在运行时动态创建或挂载自定义组件，也没有页面之外的宿主节点。因此本组件采用「全局函数 + 页面预置容器 + 全局单例桥」方案：页面栈顶容器最后 mounted 天然持有注册，函数调用经桥直调当前容器的渲染回调，API 手感与 Vant 保持一致。
