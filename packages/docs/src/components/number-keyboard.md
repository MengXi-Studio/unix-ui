---
title: NumberKeyboard
subtitle: 数字键盘
demo: pages-sub/form/number-keyboard/number-keyboard
added: 0.7.0
---

## 介绍

虚拟数字键盘面板，用于验证码、支付密码、金额、身份证号等输入场景。组件只渲染按键并派发事件，**不持有输入值**：值由业务拼接，长度与合法性通过 `disabled-key` 回调控制。

面板为纯平铺形态；弹层形态由 [NumberKeyboardPopup](/components/number-keyboard-popup) 组合实现。

## 代码演示

### 基础用法 {#demo-basic}

`input` 派发按键文本，`delete` 无参数；业务自行拼接与删除。

```vue
<m-number-keyboard @input="onInput" @delete="onDelete" />
```

```ts
const value = ref('')

const onInput = (key: string) => { value.value += key }
const onDelete = () => {
	if (value.value.length > 0) {
		value.value = value.value.substring(0, value.value.length - 1)
	}
}
```

### 键盘类型 {#demo-type}

`type` 控制左下角额外键：`digit` 为 `.`，`idcard` 为 `X`，`random` 为乱序数字。

```vue
<m-number-keyboard type="digit" @input="onInput" @delete="onDelete" />
<m-number-keyboard type="idcard" @input="onInput" @delete="onDelete" />
```

### 随机排序 {#demo-random}

`type="random"` 在挂载时打乱一次，之后只有调用 `shuffle()` 才重排，避免输入过程中键位跳动。

```vue
<m-number-keyboard ref="keyboard" type="random" @input="onInput" @delete="onDelete" />
```

```ts
const keyboard = ref<ComponentPublicInstance | null>(null)

const shuffle = () => {
	const inst = keyboard.value
	if (inst != null) {
		inst.$callMethod('shuffle')
	}
}
```

### 右侧栏 {#demo-custom}

`theme="custom"` 在主键区右侧增加一列：关闭键在上、删除键跨两行。`close-button-text` 为空时不渲染关闭键，删除键占满整列。

```vue
<m-number-keyboard theme="custom" close-button-text="完成" @close="onClose" />
```

### 自定义额外键 {#demo-extra}

`extra-keys` 取首项作为左下角按键，覆盖类型内置值。

```vue
<m-number-keyboard :extra-keys="['00']" @input="onInput" @delete="onDelete" />
```

### 禁用按键 {#demo-disabled}

`disabled-key` 返回 `true` 的键灰显且不派发 `input`；删除键不受影响。

```vue
<m-number-keyboard :disabled-key="limitSix" @input="onInput" @delete="onDelete" />
```

```ts
const value = ref('')

const limitSix = (key: string): boolean => value.value.length >= 6
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 键盘类型 | `'number' \| 'digit' \| 'idcard' \| 'random'` | `'number'` |
| theme | 主题，`custom` 带右侧栏 | `'default' \| 'custom'` | `'default'` |
| extraKeys | 额外键文本，取首项作为左下角按键 | `string[] \| null` | `null` |
| showDeleteKey | 是否显示删除键 | `boolean` | `true` |
| deleteButtonText | 删除键文字，为空时显示图标 | `string` | `''` |
| closeButtonText | 右侧栏关闭键文字，为空时不渲染（仅 `custom`） | `string` | `''` |
| disabledKey | 按键禁用回调，返回 `true` 时灰显且不派发事件 | `(key: string) => boolean \| null` | `null` |
| customClass | 自定义根节点类名 | `string.ClassString` | `''` |
| customStyle | 自定义根节点内联样式 | `string` | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| input | 点击可输入键 | `key: string` |
| delete | 点击删除键 | — |
| close | 点击右侧栏关闭键 | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| extra-key | 自定义左下角额外键内容 |

### Methods

通过组件实例调用：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| shuffle | 重新打乱数字键序（仅 `type="random"` 有意义） | — |

```ts
keyboardRef.value?.$callMethod('shuffle')
```

## 主题定制

组件提供下列 SCSS 变量，在项目根 `uni.scss` 中直接定义同名变量即可覆盖（禁止 `@import vars.scss`）。

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$m-number-keyboard-background` | `#f2f3f5` | 键盘底色 |
| `$m-number-keyboard-padding` | `6px` | 四周内边距 |
| `$m-number-keyboard-key-gap` | `3px` | 单侧键缝宽度，相邻键之间为两倍 |
| `$m-number-keyboard-key-height` | `48px` | 单键高度 |
| `$m-number-keyboard-key-radius` | `6px` | 键圆角 |
| `$m-number-keyboard-key-background` | `#ffffff` | 键底色 |
| `$m-number-keyboard-key-active-background` | `#e5e6eb` | 按压态底色 |
| `$m-number-keyboard-key-color` | `#323233` | 键文字色 |
| `$m-number-keyboard-key-font-size` | `24px` | 键文字字号 |
| `$m-number-keyboard-delete-font-size` | `16px` | 删除键与动作键字号 |
| `$m-number-keyboard-close-background` | `#1989fa` | 右侧栏关闭键底色 |
| `$m-number-keyboard-close-color` | `#ffffff` | 右侧栏关闭键文字色 |
| `$m-number-keyboard-title-height` | `44px` | 弹层工具条高度 |
| `$m-number-keyboard-title-padding` | `0 16px` | 工具条水平内边距 |
| `$m-number-keyboard-title-color` | `#323233` | 工具条标题色 |
| `$m-number-keyboard-title-font-size` | `16px` | 工具条文字字号 |
| `$m-number-keyboard-title-font-weight` | `600` | 工具条标题字重 |
| `$m-number-keyboard-action-font-size` | `14px` | 工具条左右按钮字号 |
| `$m-number-keyboard-button-color` | `#1989fa` | 完成按钮文字色 |

## 注意事项

- 面板不渲染任何 `input`，不会唤起系统键盘；输入展示由业务自己在面板上方绘制。
- 按键按压态使用 `hover-class` 实现，uvue 无 `:active` 伪类与伪元素。
- 需要弹层、取消 / 完成工具条或输入区插槽时，使用 [NumberKeyboardPopup](/components/number-keyboard-popup)。
