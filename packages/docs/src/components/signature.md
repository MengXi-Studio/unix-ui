---
title: Signature
subtitle: 签名
demo: pages-sub/form/signature/signature
added: 0.8.0
---

## 介绍

用于签名场景的手写签名板，基于 Canvas 实现。支持自定义笔触颜色 / 线宽 / 背景色、撤销与历史深度、清空与确认，并提供全屏签名形态。

> 确认时返回 PNG 格式的 `dataURL`；未书写或已清空时 `image` 为空字符串。

## 代码演示

### 基础用法 {#demo-basic}

书写后点击「确认」触发 `submit`，事件数据为 `{ image: string }`：

```vue
<m-signature @submit="onSubmit" @clear="onClear" />
```

```uts
const image = ref<string>('')

function onSubmit(data: any | null) {
	if (data == null) {
		return
	}
	image.value = (data as UTSJSONObject).getString('image') ?? ''
}

function onClear() {
	image.value = ''
}
```

### 自定义笔触 {#demo-pen}

`pen-color` 设置笔触颜色，`line-width` 设置线宽：

```vue
<m-signature pen-color="#ee0a24" :line-width="6" />
```

### 自定义背景 {#demo-background}

`background-color` 会绘制进导出图片；留空则导出透明背景：

```vue
<m-signature background-color="#f7f8fa" />
```

### 撤销与历史 {#demo-history}

`history-size` 控制撤销历史的最大笔画数，默认 20；操作栏内置撤销与清空：

```vue
<m-signature :history-size="3" />
```

### 实例方法 {#demo-methods}

通过 `ref` 调用 `submit` / `undo` / `clear` / `resize`：

```vue
<m-signature ref="signatureRef" />
```

```uts
const signatureRef = ref<ComponentPublicInstance | null>(null)

signatureRef.value?.$callMethod('clear')
```

### 全屏签名 {#demo-full}

`full-screen` 配合 `v-model:visible` 全屏展示，底部提示可通过 `tips` 插槽自定义：

```vue
<m-button @click="visible = true">打开全屏签名</m-button>

<m-signature full-screen v-model:visible="visible" @submit="onSubmit" @cancel="onCancel">
	<template #tips>
		<text>请在上方空白处手写您的签名</text>
	</template>
</m-signature>
```

```uts
const visible = ref<boolean>(false)
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| pen-color | 笔触颜色 | string | `#000` |
| line-width | 线条宽度 px | number | `3` |
| history-size | 撤销历史最大笔画数（`<=0` 不限制） | number | `20` |
| background-color | 导出图片背景色（空字符串为透明） | string | `''` |
| tips | Canvas 不可用时的提示文案 | string | `''`（内置兜底文案） |
| clear-button-text | 清空按钮文案 | string | `清空` |
| undo-button-text | 撤销按钮文案 | string | `撤销` |
| confirm-button-text | 确认按钮文案 | string | `确认` |
| full-screen | 是否全屏签名 | boolean | `false` |
| visible | 全屏显隐（v-model:visible，仅全屏生效） | boolean | `false` |
| cancel-button-text | 取消按钮文案（仅全屏） | string | `取消` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 点击确认（空签名为空字符串） | data: `{ image: string }` |
| clear | 点击清空 | - |
| start | 开始一笔 | - |
| signing | 书写过程中 | event: TouchEvent |
| end | 一笔结束 | - |
| cancel | 全屏模式点击取消 | - |
| update:visible | 全屏显隐回写（v-model:visible） | visible: boolean |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| tips | 画布内 / 全屏底部的提示文案 | - |

### 方法

通过组件实例调用（`ref` + `$callMethod`，或模板 ref 直接调用）：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| submit | 触发 `submit`，等价点击确认 | - |
| clear | 清空签名与历史 | - |
| undo | 撤销上一笔 | - |
| resize | 外层尺寸或显隐变化后重新测量并重绘 | - |

## 平台差异

- `submit` 只返回 `{ image }`，不返回 Canvas 元素（各端 Canvas 元素类型不一致，无法安全外抛）；
- 统一输出 PNG `dataURL`：uni-app x 的 `toDataURL()` 方法本身不接收参数，因此不提供 `type` / `quality`；
- 导出依赖 `uni.createCanvasContextAsync` 与 `CanvasContext.toDataURL()`，需 HBuilderX 4.25+（微信小程序 4.41+）。

## 主题定制

签名板样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-signature-padding | 组件内边距 | 8px |
| $m-signature-content-height | 画布高度 | 200px |
| $m-signature-content-background | 画布底色 | #ffffff |
| $m-signature-content-border-width | 画布边框宽度 | 主题细线 |
| $m-signature-content-border-color | 画布边框颜色 | #dadada |
| $m-signature-tips-font-size | 提示文案字号 | 12px |
| $m-signature-tips-color | 提示文案颜色 | 主题三级文字色 |
| $m-signature-action-height | 操作栏高度 | 44px |
| $m-signature-action-gap | 操作项左右内边距 | 12px |
| $m-signature-action-font-size | 操作文字字号 | 14px |
| $m-signature-action-color | 操作文字颜色 | 主题二级文字色 |
| $m-signature-action-confirm-color | 确认文字颜色 | 主题主色 |
| $m-signature-action-disabled-color | 禁用操作文字颜色 | 主题四级文字色 |
| $m-signature-full-z-index | 全屏层级 | 999 |
| $m-signature-full-background | 全屏背景色 | #ffffff |
| $m-signature-full-gap | 全屏内边距 | 16px |
| $m-signature-hint-font-size | 全屏底部提示字号 | 14px |
| $m-signature-hint-color | 全屏底部提示颜色 | 主题三级文字色 |
