---
title: PasswordInput
subtitle: 密码输入格子
demo: pages-sub/password-input/password-input
added: 0.7.0
---

## 介绍

密码 / 验证码格子面板，支持两种视觉风格：`bordered`（圆角方框，默认）与 `underlined`（仅底部 1px 底线）。组件纯展示不持值，配合 [NumberKeyboard](/components/number-keyboard) 或 [PasswordInputPopup](/components/password-input-popup) 使用。

典型场景：支付密码 6 格、短信验证码 4/6 格、PIN 码输入。

## 代码演示

### 基础用法 {#demo-basic}

默认 `bordered` 风格 + `focused=true` 时当前位闪烁光标。

```vue
<m-password-input :value="value" :length="6" :focused="true" />
```

```ts
const value = ref('')
```

### 下划线风格 {#demo-underlined}

```vue
<m-password-input type="underlined" :value="value" :focused="true" />
```

### 明文显示 {#demo-plaintext}

`mask=false` 或 `plain-text` 均可明文展示，适用于短信验证码等场景。

```vue
<m-password-input value="8865" :length="6" :mask="false" />
<m-password-input value="8865" :length="6" plain-text />
```

### 自定义间距 {#demo-gap}

```vue
<m-password-input :value="value" :gap="20" />
```

### 禁用 / 只读 {#demo-disabled}

```vue
<m-password-input value="123456" disabled />
<m-password-input value="123456" readonly />
```

### 下方提示文字 {#demo-tips}

`error-info` 优先于 `info`。

```vue
<m-password-input value="12345" info="密码为 6 位数字" />
<m-password-input value="12345" info="密码为 6 位数字" error-info="密码错误" />
```

### 与 NumberKeyboard 手动组合 {#demo-manual}

```vue
<m-password-input
	:value="value"
	:length="6"
	:focused="showKeyboard"
	@focus="showKeyboard = true"
/>
<m-number-keyboard v-if="showKeyboard" @input="onInput" @delete="onDelete" />
```

```ts
const value = ref('')
const showKeyboard = ref(false)

const onInput = (key: string) => {
	if (value.value.length < 6) {
		value.value += key
	}
}
const onDelete = () => {
	value.value = value.value.substring(0, value.value.length - 1)
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前密码值 | `string` | `''` |
| length | 密码格子数量 | `number` | `6` |
| type | 风格：方框 / 下划线 | `'bordered' \| 'underlined'` | `'bordered'` |
| gap | 格子间距（px） | `number` | `8` |
| mask | 是否隐藏密码为圆点 | `boolean` | `true` |
| plainText | 明文显示（互斥：`plainText=true` 时 `mask` 忽略） | `boolean` | `false` |
| focused | 聚焦态：当前位显示光标、聚焦位高亮 | `boolean` | `false` |
| disabled | 禁用态（灰显 + 不派发 `focus`） | `boolean` | `false` |
| readonly | 只读（可查看但不可点击聚焦） | `boolean` | `false` |
| info | 下方文字提示 | `string` | `''` |
| errorInfo | 下方错误提示（优先级高于 `info`） | `string` | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| focus | 格子点击时触发（`disabled` / `readonly` 时不派发） | — |

## 主题定制

组件提供下列 SCSS 变量，在项目根 `uni.scss` 中直接定义同名变量即可覆盖（禁止 `@import vars.scss`）。

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$m-password-input-height` | `50px` | 格子容器高度 |
| `$m-password-input-gap` | `8px` | 格子间距（px） |
| `$m-password-input-border-radius` | `6px` | bordered 风格圆角 |
| `$m-password-input-border-color` | `#ebedf0` | bordered 常态边框色 |
| `$m-password-input-border-color-focus` | `$m-color-primary` | bordered 聚焦边框色 |
| `$m-password-input-background` | `#ffffff` | bordered 格子底色 |
| `$m-password-input-underline-color` | `#ebedf0` | underlined 底线常态色 |
| `$m-password-input-underline-color-focus` | `$m-color-primary` | underlined 聚焦底线色 |
| `$m-password-input-font-size` | `20px` | 明文展示字号 |
| `$m-password-input-text-color` | `#323233` | 明文 / 圆点文字色 |
| `$m-password-input-dot-size` | `10px` | mask 圆点尺寸 |
| `$m-password-input-dot-color` | `#323233` | mask 圆点颜色 |
| `$m-password-input-cursor-color` | `#323233` | 光标颜色 |
| `$m-password-input-cursor-width` | `2px` | 光标宽度 |
| `$m-password-input-cursor-height` | `60%` | 光标高度 |
| `$m-password-input-cursor-duration` | `1000` | 光标闪烁动画时长（毫秒） |
| `$m-password-input-info-color` | `#646566` | info 提示文字颜色 |
| `$m-password-input-info-font-size` | `12px` | info 提示字号 |
| `$m-password-input-error-info-color` | `#ee0a24` | errorInfo 颜色 |
| `$m-password-input-disabled-opacity` | `0.5` | 禁用态透明度 |

## 注意事项

- 格子为纯 `view` 渲染，不使用原生 `input`，不会唤起系统键盘——这是配合自定义键盘的前提。
- 光标闪烁用 `setInterval` 半周期切换响应式 class（不依赖 `el.animate`——web 端不存在该 API，`el.style.setProperty` 在 web 端 UniElement 代理上也无效），全平台实现一致。
- 需要开箱即用的弹层键盘一体化组件，使用 [PasswordInputPopup](/components/password-input-popup)。
- `gap` 只支持 `number`（px），不支持 `string`（em / rem）——UTS 联合类型会让 Kotlin 产物退化为 `Any?`。
