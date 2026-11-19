---
title: DatePickerInput
subtitle: 日期输入框
demo: pages-sub/datetime/date-picker-input/date-picker-input
added: 0.6.0
---

## 介绍

日期输入框，由 [Input](/components/input) 与 [DatePickerPopup](/components/date-picker-popup) 组合而成：触发器只读展示当前日期，点击整区打开弹层，确认后经 `v-model:value` 回写并按列组合格式化展示。

## 代码演示

### 基础用法 {#demo-basic}

确认后按 `YYYY-MM-DD` 回填；有值时显示清空按钮，清空回写 `null` 并派发 `clear`。

```vue
<m-date-picker-input v-model:value="value" title="选择日期" @confirm="onConfirm" @clear="onClear" />
```

```ts
const value = ref<Date | null>(null)
```

### 列组合 {#demo-columns}

展示格式随 `columns-type` 派生：`['year']` → `YYYY`，`['year', 'month']` → `YYYY-MM`，`['month', 'day']` → `MM-DD`；缺失的日期分量按 1 月 1 日归一。

```vue
<m-date-picker-input v-model:value="yearMonth" :columns-type="['year', 'month']" placeholder="请选择年月" />
<m-date-picker-input v-model:value="year" :columns-type="['year']" placeholder="请选择年份" />
<m-date-picker-input v-model:value="monthDay" :columns-type="['month', 'day']" placeholder="请选择月日" />
```

### 可选区间 {#demo-range}

```vue
<m-date-picker-input v-model:value="value" :min-date="minDate" :max-date="maxDate" placeholder="限定区间" />
```

### 禁用与不可清空 {#demo-disabled}

`disabled` 关闭触发层且不显示清空按钮；`clearable` 设为 `false` 可单独隐藏清空按钮。

```vue
<m-date-picker-input :value="value" disabled />
<m-date-picker-input v-model:value="value" :clearable="false" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中日期（`v-model:value`） | Date \| null | `null` |
| columns-type | 选项类型组合 | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| placeholder | 占位符 | string | `请选择日期` |
| disabled | 是否禁用 | boolean | `false` |
| clearable | 是否显示清空按钮（有值且非 disabled 时可见） | boolean | `true` |
| border | 触发器是否显示边框容器 | boolean | `true` |
| inlaid | 触发器嵌入式形态 | boolean | `false` |
| title | 弹层顶部栏标题 | string | `''` |
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
| update:value | 确认后回写选中日期（清空时为 `null`） | date: Date \| null |
| confirm | 弹层确认后触发 | date: Date |
| clear | 点击清空按钮后触发 | - |

## 主题定制

输入框外观（边框、背景、文字、占位色）由 [Input](/components/input) 的主题变量控制；清空按钮相关变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-date-picker-input-trigger-z-index | 透明触发层层级 | 1 |
| $m-date-picker-input-clear-z-index | 清空按钮层级 | 2 |
| $m-date-picker-input-clear-width | 清空按钮点击区宽度 | 40px |
| $m-date-picker-input-clear-icon-size | 清空图标字号 | 16px |
| $m-date-picker-input-clear-color | 清空图标颜色 | #c8c9cc |

## 与 Vant 的差异

- Vant 无日期输入框组件，本项目参照日历 / 级联三件套的既有约定提供 `m-date-picker-input`
- 展示格式由 `columns-type` 自动派生（年月日按 `-` 连接），不提供独立的 `format` prop
- 清空为自绘按钮（`m-input` 内置 clearable 图标会被透明触发层遮挡）
