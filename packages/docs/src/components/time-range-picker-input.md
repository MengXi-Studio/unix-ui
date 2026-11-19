---
title: TimeRangePickerInput
subtitle: 时间范围输入框
demo: pages-sub/datetime/time-range-picker-input/time-range-picker-input
added: 0.6.0
---

## 介绍

时间范围输入框，由 [Input](/components/input) 与 [TimeRangePickerPopup](/components/time-range-picker-popup) 组合而成：触发器只读展示「起 - 止」，点击整区打开弹层，确认后经 `v-model:value` 回写两端值。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-time-range-picker-input v-model:value="value" @confirm="onConfirm" @clear="onClear" />
```

```ts
const value = ref<string[] | null>(null)
```

### 时分秒与自定义标题 {#demo-columns}

```vue
<m-time-range-picker-input
	v-model:value="value"
	:columns-type="['hour', 'minute', 'second']"
	:tabs="['上班', '下班']"
	placeholder="请选择上下班时间"
/>
```

### 步长、区间与 12 小时制 {#demo-constraints}

```vue
<m-time-range-picker-input
	v-model:value="value"
	:minute-step="15"
	min-time="09:00"
	max-time="18:00"
/>
<m-time-range-picker-input v-model:value="value2" :hour-cycle="12" placeholder="12 小时制" />
```

### 禁用与不可清空 {#demo-disabled}

```vue
<m-time-range-picker-input :value="['09:00', '18:00']" disabled />
<m-time-range-picker-input v-model:value="value" :clearable="false" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 两端选中值（`v-model:value`） | string[] \| null | `null` |
| tabs | 两段标题文案 | string[] \| null | `['开始时间', '结束时间']` |
| columns-type | 选项类型组合 | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| placeholder | 占位符 | string | `请选择时间范围` |
| disabled | 是否禁用 | boolean | `false` |
| clearable | 是否显示清空按钮 | boolean | `true` |
| border | 触发器是否显示边框容器 | boolean | `true` |
| inlaid | 触发器嵌入式形态 | boolean | `false` |
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
| update:value | 确认后回写两端值（清空时为 `null`） | value: string[] \| null |
| confirm | 弹层确认后触发 | value: string[] |
| clear | 点击清空按钮后触发 | - |

## 主题定制

输入框外观由 [Input](/components/input) 主题变量控制；清空按钮相关变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-time-range-picker-input-trigger-z-index | 透明触发层层级 | 1 |
| $m-time-range-picker-input-clear-z-index | 清空按钮层级 | 2 |
| $m-time-range-picker-input-clear-width | 清空按钮点击区宽度 | 40px |
| $m-time-range-picker-input-clear-icon-size | 清空图标字号 | 16px |
| $m-time-range-picker-input-clear-color | 清空图标颜色 | #c8c9cc |
