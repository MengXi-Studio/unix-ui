---
title: Stepper
subtitle: 步进器
demo: pages-sub/form/stepper/stepper
added: 0.8.0
---

## 介绍

通过减少按钮、输入框和增加按钮调整数值。支持范围限制、步长、小数精度、整数模式、空值回写、按钮 / 输入框独立禁用、长按连续增减、变更拦截，以及四种外观变体、两档尺寸与 round 主题。

> 值类型为 `number | null`；`null` 表示输入为空（需开启 `allow-empty`）。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定当前值，`change` 监听确认后的变化：

```vue
<m-stepper v-model:value="value" @change="onChange" />
```

```uts
const value = ref<number | null>(1)

function onChange(value: number | null) {
	console.log('stepper change: ' + (value == null ? 'null' : value.toString()))
}
```

### 最大最小值与自动校正 {#demo-range}

`min` / `max` 限制范围，`auto-fixed` 默认开启；关闭后输入与按钮都不再自动收敛：

```vue
<m-stepper v-model:value="value" :min="0" :max="5" />
<m-stepper v-model:value="value" :min="0" :max="5" :auto-fixed="false" />
```

### 步长与精度 {#demo-step}

`step` 设置每次点击的变化量，`decimal-length` 固定小数位数，`integer` 仅允许整数：

```vue
<m-stepper v-model:value="stepValue" :step="5" />
<m-stepper v-model:value="decimalValue" :step="0.1" :decimal-length="2" />
<m-stepper v-model:value="integerValue" integer />
```

### 空值与清空回写 {#demo-empty}

`allow-empty` 允许值为 `null`；`value-on-clear` 指定清空后回写值，支持 `'min'` / `'max'` / 数字 / `null`：

```vue
<m-stepper v-model:value="emptyValue" allow-empty />
<m-stepper v-model:value="clearMinValue" allow-empty value-on-clear="min" :min="3" />
```

### 只读与禁用 {#demo-status}

`readonly` 外观正常但不可修改；`disabled` 整体置灰；`disable-plus` / `disable-minus` / `disable-input` 可单独禁用某一部分：

```vue
<m-stepper :value="4" readonly />
<m-stepper :value="4" disabled />
<m-stepper v-model:value="value" disable-plus />
<m-stepper v-model:value="value" disable-input />
```

### 变体 {#demo-variant}

`variant` 可选 `solid` / `outlined` / `accent` / `ghost`：

```vue
<m-stepper v-model:value="value" variant="solid" />
<m-stepper v-model:value="value" variant="outlined" />
<m-stepper v-model:value="value" variant="accent" />
<m-stepper v-model:value="value" variant="ghost" />
```

### 尺寸与 round 主题 {#demo-size}

`size="small"` 缩小尺寸；`theme="round"` 展示主色胶囊按钮；`input-width` / `button-size` 可单独定制像素尺寸：

```vue
<m-stepper v-model:value="value" size="small" />
<m-stepper v-model:value="value" theme="round" :button-size="24" :disable-input="true" />
<m-stepper v-model:value="value" :input-width="56" :button-size="34" />
```

### 长按连续增减 {#demo-press}

`long-press` 默认开启；`press-time` 控制长按触发时间，`interval` 控制连续触发间隔：

```vue
<m-stepper v-model:value="value" />
<m-stepper v-model:value="value" :press-time="600" :interval="300" />
<m-stepper v-model:value="value" :long-press="false" />
```

### 变更拦截与事件 {#demo-before}

`before-change` 在变更前调用，返回 `false` 阻止，支持返回 `Promise<boolean>`；点击边界按钮触发 `overlimit`：

```vue
<m-stepper
	v-model:value="value"
	:min="0"
	:max="10"
	:before-change="beforeChange"
	@change="onChange"
	@overlimit="onOverlimit"
/>
```

```uts
const beforeChange = (value: number | null): boolean | Promise<boolean> => {
	return value == null || value <= 8
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值（v-model:value），null 表示空输入 | number \| null | `1` |
| min | 最小值 | number | `1` |
| max | 最大值 | number | 不限制 |
| step | 步长 | number | `1` |
| decimal-length | 固定小数位数（-1 不固定） | number | `-1` |
| integer | 仅允许整数 | boolean | `false` |
| allow-empty | 允许输入为空（值为 null） | boolean | `false` |
| value-on-clear | 清空后回写值，支持 `'min'` / `'max'` | number \| string \| null | `null` |
| auto-fixed | 超出范围时自动校正（按钮与失焦） | boolean | `true` |
| disabled | 禁用整个步进器 | boolean | `false` |
| readonly | 只读（外观正常、不可修改） | boolean | `false` |
| disable-input | 禁用输入框（按钮仍可点） | boolean | `false` |
| disable-plus | 禁用增加按钮 | boolean | `false` |
| disable-minus | 禁用减少按钮 | boolean | `false` |
| show-plus | 显示增加按钮 | boolean | `true` |
| show-minus | 显示减少按钮 | boolean | `true` |
| show-input | 显示输入框 | boolean | `true` |
| long-press | 长按按钮连续增减 | boolean | `true` |
| press-time | 长按触发时间 ms | number | `350` |
| interval | 长按后连续触发间隔 ms | number | `150` |
| before-change | 变更前拦截，返回 false 阻止，支持 Promise | `(value: number \| null) => boolean \| Promise<boolean>` | - |
| input-width | 输入框宽度 px（0 用主题变量） | number | `0` |
| button-size | 按钮尺寸 / 输入框高度 px（0 用主题变量） | number | `0` |
| theme | 风格，`round` 为主色胶囊按钮 | `default` \| `round` | `default` |
| variant | 外观变体 | `solid` \| `outlined` \| `accent` \| `ghost` | `solid` |
| size | 尺寸 | `medium` \| `small` | `medium` |
| placeholder | 输入框占位文案 | string | `''` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 值变化（v-model:value） | value: number \| null |
| change | 值确认变化（点击按钮、失焦收敛后） | value: number \| null |
| plus | 点击增加按钮 | - |
| minus | 点击减少按钮 | - |
| overlimit | 点击到达边界或被禁用的按钮 | - |
| focus | 输入框聚焦 | event: UniEvent |
| blur | 输入框失焦 | event: UniEvent |

## 主题定制

步进器样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-stepper-height | 默认高度 / 按钮尺寸 | 28px |
| $m-stepper-input-width | 输入框宽度 | 32px |
| $m-stepper-input-font-size | 输入框字号 | 14px |
| $m-stepper-input-text-color | 输入框文字色 | 主题正文色 |
| $m-stepper-input-disabled-text-color | 输入框禁用文字色 | 主题三级文字色 |
| $m-stepper-background | 默认底色（solid） | #f2f3f5 |
| $m-stepper-radius | 默认圆角 | 主题中圆角 |
| $m-stepper-radius-round | round 主题圆角 | 胶囊圆角 |
| $m-stepper-button-icon-color | 按钮图标色 | 主题正文色 |
| $m-stepper-button-icon-size | 按钮图标字号 | 16px |
| $m-stepper-button-disabled-icon-color | 按钮禁用图标色 | 主题四级文字色 |
| $m-stepper-border-color | outlined 描边色 | #ebedf0 |
| $m-stepper-accent-background | accent 变体底色 | 主色 10% |
| $m-stepper-accent-color | accent 变体文字 / 图标色 | 主题主色 |
| $m-stepper-round-color | round 主题按钮底色 | 主题主色 |
| $m-stepper-round-icon-color | round 主题图标色 | #ffffff |
| $m-stepper-height-small | small 尺寸高度 | 24px |
| $m-stepper-input-width-small | small 输入框宽度 | 28px |
| $m-stepper-input-font-size-small | small 输入框字号 | 12px |
| $m-stepper-button-icon-size-small | small 图标字号 | 14px |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant / Sard 的差异

- **绑定语法**：统一 `v-model:value`，值类型为 `number | null`
- **空值**：Vant `allow-empty` 与 Sard `value-on-clear` 同时提供；清空回写支持 `'min'` / `'max'`
- **自动校正**：提供 `auto-fixed`（默认 `true`），关闭后按钮与失焦均不收敛
- **风格**：同时提供 Vant `theme="round"` 与 Sard `variant` / `size`
- **长按**：合并为 `long-press` / `press-time` / `interval` 三个属性
- **未实现**：Vant 的 `name`（change 附加标识）与 `default-value`（空值初始值），由调用方直接管理 `value` 初始值

## 注意事项

- 输入过程允许 `1.`、`-` 等中间态，失焦时才按 `auto-fixed` / `decimal-length` 收敛
- `decimal-length` 会在展示层保留尾零（如 `0.30`），事件回写的是 number
- `integer` 优先级高于 `decimal-length`，按四舍五入取整
- `theme="round"` 与 `variant` 同时传时 round 优先（无底 / 无描边 + 主色按钮）
- 小程序端输入框类型由 `integer` 决定 `number` / `digit`，负号仅当 `min < 0` 时允许输入
