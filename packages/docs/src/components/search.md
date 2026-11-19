---
title: Search
subtitle: 搜索
demo: pages-sub/form/search/search
added: 0.7.0
---

## 介绍

用于搜索场景的输入框组件。由「搜索框外观（背景 / 圆角 / 错误边框）+ m-input 输入主体」组合而成，支持圆角形态、左侧文本与图标、右侧按钮、清除、键盘搜索与错误提示。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定输入值：

```vue
<m-search v-model:value="value" />
```

```uts
const value = ref<string>('')
```

### 键盘搜索 {#demo-search}

输入后点击键盘上的搜索键（`confirm-type="search"`）触发 `search`：

```vue
<m-search v-model:value="value" confirm-type="search" @search="onSearch" />
```

### 取消按钮 {#demo-cancel}

设置 `show-action` 显示右侧按钮（默认文案「取消」），点击派发 `cancel`，**不会清空输入值**：

```vue
<m-search v-model:value="value" show-action @cancel="value = ''" />
```

### 搜索按钮 {#demo-action-search}

`action-type="search"` 让右侧按钮派发 `search`：

```vue
<m-search v-model:value="value" show-action action-text="搜索" action-type="search" @search="onSearch" />
```

### 自定义按钮 {#demo-action-slot}

`action` 插槽自定义右侧内容，此时组件不再自动派发 `cancel` / `search`：

```vue
<m-search v-model:value="value" show-action>
	<template #action>
		<view @click="onCustomSearch"><text>查询</text></view>
	</template>
</m-search>
```

### 形状与背景 {#demo-shape}

`shape="round"` 圆形输入区；`background` 设置搜索框外部背景，`input-background` 设置输入区背景：

```vue
<m-search v-model:value="value" shape="round" background="#4fc08d" input-background="#ffffff" />
```

### 内容对齐 {#demo-align}

```vue
<m-search v-model:value="value" input-align="center" />
<m-search v-model:value="value" input-align="right" />
```

### 左侧文本与图标 {#demo-label}

`label` 渲染框内左侧文本，`left-icon` 替换框内左图标（默认 `search`）：

```vue
<m-search v-model:value="value" label="地址" left-icon="location" />
```

### 右侧图标 {#demo-right-icon}

`right-icon` 渲染框内右图标，点击派发 `click-right-icon`：

```vue
<m-search v-model:value="value" right-icon="camera" @click-right-icon="onClickRightIcon" />
```

### 只读与禁用 {#demo-disabled}

```vue
<m-search value="机加工一线" readonly />
<m-search value="机加工一线" disabled />
```

### 错误提示 {#demo-error}

`error` 将输入区边框标红，`error-message` 在下方渲染提示文案：

```vue
<m-search v-model:value="value" error error-message="请输入 2-20 个字符的关键词" />
```

### 外部插槽 {#demo-outer-slot}

`left` / `action` 插槽位于搜索框外部两侧：

```vue
<m-search v-model:value="value" show-action>
	<template #left>
		<m-icon name="arrow-left" />
	</template>
</m-search>
```

### 实例方法 {#demo-methods}

```uts
const searchRef = ref<ComponentPublicInstance | null>(null)
searchRef.value?.$callMethod('focus')
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 输入值（v-model:value） | string | `''` |
| label | 框内左侧文本 | string | `''` |
| shape | 输入框形状，可选 `square` `round` | string | `square` |
| background | 搜索框外部背景色 | string | 主题值 `#f2f2f2` |
| input-background | 输入区背景色 | string | 主题值（白色） |
| placeholder | 占位提示文字 | string | `请输入搜索关键词` |
| maxlength | 最大输入长度，-1 不限制 | number | `-1` |
| clearable | 是否启用清除图标 | boolean | `true` |
| clear-trigger | 清除图标显示时机，可选 `focus` `always` | string | `focus` |
| autofocus | 是否挂载即聚焦 | boolean | `false` |
| show-action | 是否显示右侧按钮 | boolean | `false` |
| action-text | 右侧按钮文案 | string | `取消` |
| action-type | 右侧按钮语义，可选 `cancel` `search` | string | `cancel` |
| left-icon | 框内左侧图标（m-icon 字形名） | string | `search` |
| right-icon | 框内右侧图标，`null` 不显示 | string \| null | `null` |
| input-align | 输入文字对齐方式，可选 `left` `center` `right` | string | `left` |
| disabled | 是否禁用 | boolean | `false` |
| readonly | 是否只读 | boolean | `false` |
| error | 是否错误态（输入区边框标红） | boolean | `false` |
| error-message | 错误提示文案，为空不展示 | string | `''` |
| formatter | 输入内容格式化函数（透传 m-input） | (value: string) => string | `null` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 输入值变化（v-model:value） | value: string |
| change | 输入值变化（值变即派发） | value: string |
| search | 键盘确认键 / `action-type="search"` 的按钮点击 | value: string |
| cancel | `action-type="cancel"` 的按钮点击 | — |
| clear | 点击清除按钮 | — |
| focus / blur | 聚焦 / 失焦 | event: UniEvent |
| click-input | 点击输入区域 | event: MouseEvent |
| click-left-icon | 点击框内左图标 | event: MouseEvent |
| click-right-icon | 点击框内右图标 | event: MouseEvent |
| click | 点击组件 | event: MouseEvent |

### Slots

| 名称 | 位置 | 说明 |
| --- | --- | --- |
| left | 搜索框外左侧 | 对应 Sard 的 `prepend` |
| action | 搜索框外右侧 | 自定义后不再自动派发 `cancel` / `search` |
| label | 框内最左侧 | 覆盖 `label` 文本 |
| left-icon | 框内左图标位 | 覆盖 `left-icon` |
| right-icon | 框内右图标位 | 覆盖 `right-icon` |

### Methods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| focus | 聚焦输入框 | — |
| blur | 取消输入框焦点 | — |

## 主题定制

搜索框样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-search-padding-y | 搜索框上下内边距 | 10px |
| $m-search-padding-x | 搜索框左右内边距 | 12px |
| $m-search-background | 搜索框外部背景色 | #f2f2f2 |
| $m-search-field-height | 输入区高度 | 34px |
| $m-search-field-padding | 输入区左右内边距 | 0 8px |
| $m-search-field-background | 输入区背景色 | 白色 |
| $m-search-field-radius | 输入区方形圆角 | $m-radius-md |
| $m-search-field-radius-round | 输入区圆形圆角 | $m-radius-max |
| $m-search-label-gap | 左侧文本与图标间距 | 4px |
| $m-search-label-color | 左侧文本颜色 | $m-text-color |
| $m-search-label-font-size | 左侧文本字号 | 14px |
| $m-search-icon-color | 框内图标颜色 | $m-text-color-fourth |
| $m-search-icon-size | 框内图标字号 | 16px |
| $m-search-icon-padding | 框内图标内边距 | 0 2px |
| $m-search-action-gap | 左侧插槽与输入区间距 | 8px |
| $m-search-action-padding | 右侧按钮内边距 | 0 8px |
| $m-search-action-color | 右侧按钮文字颜色 | $m-text-color |
| $m-search-action-font-size | 右侧按钮文字字号 | 14px |
| $m-search-error-color | 错误提示与错误态边框色 | $m-color-danger |
| $m-search-error-font-size | 错误提示字号 | 12px |
| $m-search-error-padding | 错误提示内边距 | 0 12px 8px |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- **绑定语法**：Vant 为 `v-model`；本项目统一 `v-model:value`
- **右侧按钮**：Vant 的按钮只派发 `cancel`；本项目用 `action-type` 在 `cancel` / `search` 之间切换，统一一个按钮
- **取消行为**：两者都不清空输入（Sard 会清空，本项目不采用）
- **输入区背景**：额外提供 `input-background`（对齐 Sard），文本色由主题变量覆盖
- **change 语义**：值变即派发（与 Sard 一致），而非 m-input 的失焦语义
- **实现方式**：内部组合 `m-input`（inlaid 形态），输入行为能力与 m-input 保持一致

## 注意事项

- 搜索组件为受控组件，不持有内部值；`cancel` 不清空，如需清空请在 `@cancel` 中自行置空
- `change` 与 `update:value` 同参同发，适用于实时联动列表过滤
- `maxlength` / `formatter` 透传 `m-input`；数值输入类能力（precision / min / max 等）不透出
- `action` 插槽存在时，右侧按钮点击不再自动派发 `cancel` / `search`
