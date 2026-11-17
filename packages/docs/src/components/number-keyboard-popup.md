---
title: NumberKeyboardPopup
subtitle: 数字键盘弹出框
demo: pages-sub/number-keyboard-popup/number-keyboard-popup
added: 0.7.0
---

## 介绍

数字键盘弹层：`m-popup` + [NumberKeyboard](/components/number-keyboard) 的组合形态。默认插槽位于键盘上方，用于承载验证码格、金额展示等自定义输入区；取消 / 完成派发后自动关闭。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-button @click="show = true">打开数字键盘</m-button>

<m-number-keyboard-popup
	v-model:show="show"
	title="输入设备位号"
	@input="onInput"
	@delete="onDelete"
	@confirm="onConfirm"
>
	<view class="display">{{ value == '' ? '请输入' : value }}</view>
</m-number-keyboard-popup>
```

### 验证码输入 {#demo-code}

在默认插槽内绘制分格，配合 `disabled-key` 限制位数。

```vue
<m-number-keyboard-popup v-model:show="show" title="验证码" :disabled-key="codeLimit" @input="onInput" @delete="onDelete">
	<view class="code-row">
		<view v-for="(digit, index) in digits" :key="index" class="code-cell">{{ digit }}</view>
	</view>
</m-number-keyboard-popup>
```

```ts
const value = ref('')
const codeLimit = (key: string): boolean => value.value.length >= 6
```

### 金额输入 {#demo-amount}

`type="digit"` 提供小数点键，展示区自行加货币符号。

```vue
<m-number-keyboard-popup v-model:show="show" title="输入金额" type="digit" @input="onInput" @delete="onDelete">
	<view class="amount-row">
		<text class="amount-symbol">¥</text>
		<text class="amount-text">{{ value == '' ? '0.00' : value }}</text>
	</view>
</m-number-keyboard-popup>
```

### 自定义工具条 {#demo-toolbar}

`show-toolbar` 关闭工具条后，可通过 `cancel` / `confirm` 插槽或右侧栏关闭键复用同一面板交互。

```vue
<m-number-keyboard-popup v-model:show="show" :show-toolbar="false" theme="custom" close-button-text="完成">
	<view class="display">{{ value }}</view>
</m-number-keyboard-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示（`v-model:show`） | `boolean` | `false` |
| type | 键盘类型 | `'number' \| 'digit' \| 'idcard' \| 'random'` | `'number'` |
| theme | 主题，`custom` 带右侧栏 | `'default' \| 'custom'` | `'default'` |
| extraKeys | 额外键文本，取首项作为左下角按键 | `string[]` | `[]` |
| showDeleteKey | 是否显示删除键 | `boolean` | `true` |
| deleteButtonText | 删除键文字，为空时显示图标 | `string` | `''` |
| closeButtonText | 右侧栏关闭键文字（仅 `custom`） | `string` | `''` |
| disabledKey | 按键禁用回调 | `(key: string) => boolean \| null` | `null` |
| title | 工具条标题 | `string` | `''` |
| showToolbar | 是否显示取消 / 完成工具条 | `boolean` | `true` |
| cancelButtonText | 取消按钮文字 | `string` | `'取消'` |
| confirmButtonText | 完成按钮文字 | `string` | `'完成'` |
| round | 弹层圆角 | `boolean` | `true` |
| closeOnClickOverlay | 点击遮罩后是否关闭 | `boolean` | `true` |
| safeAreaInsetBottom | 底部安全区 | `boolean` | `true` |
| zIndex | 层级 | `number` | `1` |
| duration | 动画时长（秒） | `number` | `0.3` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐回写 | `value: boolean` |
| input | 点击可输入键 | `key: string` |
| delete | 点击删除键 | — |
| close-key | 点击右侧栏关闭键（随后关闭） | — |
| cancel | 点击取消（随后关闭） | — |
| confirm | 点击完成（随后关闭） | — |
| open / opened / close / closed | 弹层生命周期 | — |
| click-overlay | 点击遮罩 | `event: MouseEvent` |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 输入区，位于键盘上方 |
| cancel / confirm | 替换工具条按钮内容 |
| extra-key | 自定义左下角额外键内容 |

### Methods

| 方法名 | 说明 |
| --- | --- |
| shuffle | 透传面板的 `shuffle()`，重新打乱数字键序 |

## 主题定制

键盘视觉复用 `$m-number-keyboard-*`，弹层视觉复用 `$m-popup-*`，无独立变量段。完整列表见 [NumberKeyboard 主题定制](/components/number-keyboard#主题定制)。

## 注意事项

- 弹层固定从底部弹出，不支持切换方位。
- 点遮罩关闭由 `m-popup` 的 `close-on-click-overlay` 接管，不依赖外部点击判定。
- 与 [PickerPopup](/components/picker-popup) 的交互惯性一致：确认 / 取消后自动派发 `update:show=false`。
- `theme="custom"` 时右侧栏已有「关闭」键与「取消」按钮职责重叠，建议搭配 `show-toolbar="false"` 使用。
- `type="random"` 每次弹层打开都会重新打乱键位（与 Vant `random-key-order` 一致），需要稳定键位时用 `type="number"`。
