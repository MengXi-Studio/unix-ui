---
title: TimePickerInput
subtitle: 时间输入框
demo: pages-sub/datetime/time-picker-input/time-picker-input
added: 0.6.0
---

## 介绍

时间输入框，由 [Input](/components/input) 与 [TimePickerPopup](/components/time-picker-popup) 组合而成：触发器只读展示时间字符串，点击整区打开弹层，确认后经 `v-model:value` 回写。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-time-picker-input v-model:value="value" @confirm="onConfirm" @clear="onClear" />
```

```ts
const value = ref<string | null>(null)
```

### 时分秒 {#demo-columns}

```vue
<m-time-picker-input
	v-model:value="value"
	:columns-type="['hour', 'minute', 'second']"
	placeholder="请选择时分秒"
/>
```

### 步长与区间 {#demo-constraints}

```vue
<m-time-picker-input
	v-model:value="value"
	:minute-step="15"
	min-time="09:00"
	max-time="18:00"
	title="工作时间"
/>
<m-time-picker-input v-model:value="value2" :hour-cycle="12" placeholder="12 小时制" />
```

### 禁用与不可清空 {#demo-disabled}

```vue
<m-time-picker-input :value="'10:30'" disabled />
<m-time-picker-input v-model:value="value" :clearable="false" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前时间字符串（`v-model:value`） | string \| null | `null` |
| columns-type | 选项类型组合 | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| placeholder | 占位符 | string | `请选择时间` |
| disabled | 是否禁用 | boolean | `false` |
| clearable | 是否显示清空按钮 | boolean | `true` |
| border | 触发器是否显示边框容器 | boolean | `true` |
| inlaid | 触发器嵌入式形态 | boolean | `false` |
| title | 弹层顶部栏标题 | string | `选择时间` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| min-time | 可选最小时刻 | string \| null | `null` |
| max-time | 可选最大时刻 | string \| null | `null` |
| minute-step | 分钟步长 | number | `1` |
| second-step | 秒步长 | number | `1` |
| hour-cycle | 小时制（24 / 12） | number | `24` |
| filter | 选项过滤函数 | TimePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | TimePickerFormatter \| null | `null` |
| position | 弹出方位 | DatePickerPosition | `bottom` |
| round | 弹层圆角 | boolean | `true` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写时间字符串（清空时为 `null`） | value: string \| null |
| confirm | 弹层确认后触发 | value: string |
| clear | 点击清空按钮后触发 | - |

## 主题定制

输入框外观由 [Input](/components/input) 主题变量控制；清空按钮相关变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-time-picker-input-trigger-z-index | 透明触发层层级 | 1 |
| $m-time-picker-input-clear-z-index | 清空按钮层级 | 2 |
| $m-time-picker-input-clear-width | 清空按钮点击区宽度 | 40px |
| $m-time-picker-input-clear-icon-size | 清空图标字号 | 16px |
| $m-time-picker-input-clear-color | 清空图标颜色 | #c8c9cc |
