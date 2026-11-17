---
title: PasswordInputPopup
subtitle: 密码输入弹出框
demo: pages-sub/password-input-popup/password-input-popup
added: 0.7.0
---

## 介绍

密码 / 验证码弹层一体化组件：`m-popup` + [PasswordInput](/components/password-input) + [NumberKeyboard](/components/number-keyboard) 组合。内置 `v-model:value` 双向绑定，输入自动收敛 `maxlength=length`，弹层打开时格子自动 `focused` 并显示光标。

业务层无需手动组合，一行 `v-model:show` + `v-model:value` 即可开箱使用。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	title="请输入支付密码"
	:show-cancel="false"
	confirm-button-text="确认支付"
/>
```

```ts
const show = ref(false)
const value = ref('')

// 完成态检测：watch value.length === length
```

### 下划线 + 透明无遮罩 {#demo-underlined}

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	type="underlined"
	transparent
	show-shadow
	title="请输入验证码"
/>
```

### 随机键盘（隐私保护） {#demo-random}

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	keyboard-type="random"
	title="隐私键盘"
/>
```

### 自定义长度 + 取消/完成双按钮 {#demo-length}

```vue
<m-password-input-popup
	v-model:show="show"
	v-model:value="value"
	:length="8"
	title="请输入 8 位密码"
	cancel-button-text="取消"
	confirm-button-text="确定"
/>
```

## API

### Props

继承 [PasswordInput Props](/components/password-input#props) + [NumberKeyboardPopup Props](/components/number-keyboard-popup#props)（部分重命名为 camelCase，见下表）。

#### PasswordInput Props 透传

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 密码值（`v-model:value` / `v-model`） | `string` | `''` |
| length | 密码格子数量 | `number` | `6` |
| type | 格子风格：方框 / 下划线 | `'bordered' \| 'underlined'` | `'bordered'` |
| gap | 格子间距（px） | `number` | `8` |
| mask | 是否隐藏密码为圆点 | `boolean` | `true` |
| plainText | 明文显示 | `boolean` | `false` |
| disabled | 禁用态 | `boolean` | `false` |
| readonly | 只读态 | `boolean` | `false` |
| info | 下方文字提示 | `string` | `''` |
| errorInfo | 下方错误提示 | `string` | `''` |

#### 弹层专属 Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 弹层显隐（`v-model:show`） | `boolean` | `false` |
| keyboardType | 键盘类型 | `'number' \| 'digit' \| 'idcard' \| 'random'` | `'number'` |
| keyboardTheme | 键盘主题 | `'default' \| 'custom'` | `'default'` |
| extraKeys | 键盘额外键 | `string[]` | `[]` |
| showDeleteKey | 是否显示删除键 | `boolean` | `true` |
| deleteButtonText | 删除键文字（空则图标） | `string` | `''` |
| closeButtonText | custom 主题关闭键文字 | `string` | `''` |
| title | 工具条标题 | `string` | `''` |
| showToolbar | 是否显示取消/完成工具条 | `boolean` | `true` |
| cancelButtonText | 取消按钮文字 | `string` | `'取消'` |
| confirmButtonText | 完成按钮文字 | `string` | `'完成'` |
| round | 弹层圆角 | `boolean` | `true` |
| transparent | 遮罩透明（无黑色蒙层） | `boolean` | `false` |
| showShadow | 顶部投影条（transparent 时用于分隔） | `boolean` | `false` |
| showCancel | 是否显示取消按钮 | `boolean` | `true` |
| showConfirm | 是否显示完成按钮 | `boolean` | `true` |
| closeOnClickOverlay | 点击遮罩后关闭 | `boolean` | `true` |
| safeAreaInsetBottom | 底部安全区 | `boolean` | `true` |
| zIndex | 层级 | `number` | `1` |
| duration | 动画时长（秒） | `number` | `0.3` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐回写 | `value: boolean` |
| update:value | 密码值变化（v-model:value） | `value: string` |
| update:modelValue | 兼容 v-model 写法 | `value: string` |
| input | 可输入键点击 | `key: string` |
| delete | 删除键点击 | — |
| close-key | custom 主题关闭键点击 | — |
| cancel | 取消按钮（派发后关闭） | — |
| confirm | 完成按钮（派发后关闭） | — |
| open | 弹层开始打开 | — |
| opened | 弹层已打开 | — |
| close | 弹层开始关闭 | — |
| closed | 弹层已关闭 | — |
| click-overlay | 点击遮罩 | `event: MouseEvent` |

## 主题定制

弹层复用 `$m-number-keyboard-*`（键盘 + 工具条）与 `$m-password-input-*`（格子）两套主题变量，无需额外配置。

- 格子主题变量见 [PasswordInput 主题定制](/components/password-input#主题定制)
- 键盘主题变量见 [NumberKeyboard 主题定制](/components/number-keyboard#主题定制)

## 注意事项

- `v-model:value` 与 `v-model` 均支持；弹层 `show` 必须用 `v-model:show`（与 NumberKeyboardPopup 一致）。
- 弹层打开自动打乱 `keyboard-type="random"` 的键位（每次 `opened` 触发）。
- 弹层内置 `disabledKey` 回调：填满后数字键自动禁用、禁用态/只读态全部禁用。
- 完成态不自动关闭——需手动点完成按钮或监听 `confirm` 事件配合外部逻辑，因为密码填完通常还要校验。
