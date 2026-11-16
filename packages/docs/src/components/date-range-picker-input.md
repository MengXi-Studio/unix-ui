---
title: DateRangePickerInput
subtitle: 日期范围输入框
demo: pages-sub/date-range-picker-input/date-range-picker-input
added: 0.6.0
---

## 介绍

日期范围输入框，由 [Input](/components/input) 与 [DateRangePickerPopup](/components/date-range-picker-popup) 组合而成：触发器只读展示「起 - 止」，点击整区打开弹层，确认后经 `v-model:value` 回写两端值。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-date-range-picker-input v-model:value="value" @confirm="onConfirm" @clear="onClear" />
```

```ts
const value = ref<Date[] | null>(null)
```

### 展示格式 {#demo-format}

`outlet-format` 自定义输入框展示格式；不指定时按 `columns-type` 派生（如 `YYYY-MM-DD`）。

```vue
<m-date-range-picker-input v-model:value="value" outlet-format="YYYY年MM月DD日" />
<m-date-range-picker-input v-model:value="value" outlet-format="YYYY/MM/DD" />
```

### 列组合与区间 {#demo-columns}

```vue
<m-date-range-picker-input
	v-model:value="value"
	:columns-type="['year', 'month']"
	:tabs="['开始月份', '结束月份']"
	:min-date="minDate"
	:max-date="maxDate"
/>
```

### 禁用与不可清空 {#demo-disabled}

```vue
<m-date-range-picker-input :value="value" disabled />
<m-date-range-picker-input v-model:value="value" :clearable="false" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 两端选中值（`v-model:value`） | Date[] \| null | `null` |
| tabs | 两段标题文案 | string[] \| null | `['开始日期', '结束日期']` |
| columns-type | 选项类型组合 | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| placeholder | 占位符 | string | `请选择日期范围` |
| disabled | 是否禁用 | boolean | `false` |
| clearable | 是否显示清空按钮 | boolean | `true` |
| border | 触发器是否显示边框容器 | boolean | `true` |
| inlaid | 触发器嵌入式形态 | boolean | `false` |
| outlet-format | 输入框展示格式（缺省按列组合派生） | string | `''` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| min-date | 可选最小日期 | Date \| null | `null`（十年前） |
| max-date | 可选最大日期 | Date \| null | `null`（十年后） |
| filter | 选项过滤函数 | DatePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | DatePickerFormatter \| null | `null` |
| position | 弹出方位 | DatePickerPosition | `bottom` |
| round | 弹层圆角 | boolean | `true` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写两端值（清空时为 `null`） | value: Date[] \| null |
| confirm | 弹层确认后触发 | value: Date[] |
| clear | 点击清空按钮后触发 | - |

## 主题定制

输入框外观（边框、背景、文字、占位色）由 [Input](/components/input) 主题变量控制；清空按钮相关变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-date-range-picker-input-trigger-z-index | 透明触发层层级 | 1 |
| $m-date-range-picker-input-clear-z-index | 清空按钮层级 | 2 |
| $m-date-range-picker-input-clear-width | 清空按钮点击区宽度 | 40px |
| $m-date-range-picker-input-clear-icon-size | 清空图标字号 | 16px |
| $m-date-range-picker-input-clear-color | 清空图标颜色 | #c8c9cc |

## 与 Sard 的差异

- Sard 的 `outlet-format` 缺省按 `type` 推导；本项目按 `columns-type` 推导，且仅作用于输入框展示，不改变绑定值
- 不提供 `value-format`：`v-model:value` 始终为 `Date[]`
- 清空为自绘按钮（`m-input` 内置 clearable 图标会被透明触发层遮挡）
