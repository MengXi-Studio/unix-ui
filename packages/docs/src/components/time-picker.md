---
title: TimePicker
subtitle: 时间选择
demo: pages-sub/time-picker/time-picker
added: 0.6.0
---

## 介绍

时间选择面板：时 / 分 / 秒滚轮列，支持列组合、步长、时刻区间收敛与 12 / 24 小时制。

本组件为纯平铺面板：弹层形态由 [TimePickerPopup](/components/time-picker-popup) 组合实现，表单触发场景由 [TimePickerInput](/components/time-picker-input) 组合实现；范围选择见 [TimeRangePicker](/components/time-range-picker)。滚轮复用日期选择的列子组件。

## 代码演示

### 基础用法 {#demo-basic}

`v-model:value` 绑定时间字符串，默认列组合为「时 : 分」，输出 `HH:mm`。

```vue
<m-time-picker v-model:value="value" @change="onChange" @confirm="onConfirm" />
```

```ts
const value = ref<string | null>(null)
```

### 时分秒 {#demo-columns}

```vue
<m-time-picker v-model:value="value" :columns-type="['hour', 'minute', 'second']" />
```

### 步长与区间 {#demo-step}

`minute-step` / `second-step` 控制步长；`min-time` / `max-time` 按同日收敛时列，边界小时再收敛分 / 秒列。

```vue
<m-time-picker
	v-model:value="value"
	:minute-step="15"
	min-time="09:00"
	max-time="18:00"
	title="工作时间"
/>
```

### 12 小时制 {#demo-cycle}

`hour-cycle="12"` 时在时列前附加「上午 / 下午」列；绑定值仍以 24 小时制输出。

```vue
<m-time-picker v-model:value="value" :hour-cycle="12" />
```

### 插槽 {#demo-slots}

`toolbar` 整体替换顶部栏；`title` / `confirm` / `cancel` 替换对应段；`option` 作用于时 / 分 / 秒与上午下午列。

```vue
<m-time-picker v-model:value="value">
	<template #confirm>
		<text>完成</text>
	</template>
	<template #option="{ option }">
		<text>{{ option.text }}</text>
	</template>
</m-time-picker>
```

### 实例方法 {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedValue')
picker.value?.$callMethod('confirm')
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前时间字符串（`v-model:value`，`'HH:mm'` / `'HH:mm:ss'`） | string \| null | `null`（当前时间） |
| columns-type | 选项类型组合（hour / minute / second） | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| min-time | 可选最小时刻（同日） | string \| null | `null` |
| max-time | 可选最大时刻（同日） | string \| null | `null` |
| minute-step | 分钟步长（1-59） | number | `1` |
| second-step | 秒步长（1-59） | number | `1` |
| hour-cycle | 小时制（24 / 12） | number | `24` |
| title | 顶部栏标题 | string | `选择时间` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| show-toolbar | 是否显示顶部栏 | boolean | `true` |
| loading | 是否显示加载状态 | boolean | `false` |
| readonly | 只读 | boolean | `false` |
| filter | 选项过滤函数 `(type, options, values) => options` | TimePickerFilter \| null | `null` |
| formatter | 选项格式化函数 `(type, option) => option` | TimePickerFormatter \| null | `null` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写时间字符串 | value: string |
| change | 滚轮切换列 | value: string, columnIndex: number |
| confirm | 点击确认按钮 | value: string |
| cancel | 点击取消按钮 | - |

### Methods

| 方法名 | 说明 |
| --- | --- |
| confirm | 程序化确认 |
| resetSelection | 重置为外部 value / 当前时间 |
| getSelectedValue | 读取当前时间字符串 |

### Slots

| 名称 | 说明 |
| --- | --- |
| toolbar | 整体替换顶部栏 |
| title | 标题内容 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |
| option | 选项内容（作用域：`option`、`index`） |

## 主题定制

时间面板容器、顶部栏、选中框、加载遮罩与选项文本由内部 `m-picker` 及共用滚轮列提供，统一通过 `$m-picker-*` 与 `$m-date-picker-option-*` 变量定制（如 `$m-picker-toolbar-height`、`$m-picker-frame-color`、`$m-date-picker-option-font-size`）。

## 与日期选择的差异

- 值口径：时间为字符串（`'HH:mm'` / `'HH:mm:ss'`），不携带日期；日期选择为 `Date`
- 约束：`min-time` / `max-time` 按同日收敛，跨天配置（min 晚于 max）视为不约束
- 12 小时制仅影响列展示，绑定值始终为 24 小时制
- 12 小时制的「上午 / 下午」列不在 `columns-type` 中声明，由 `hour-cycle` 自动附加
