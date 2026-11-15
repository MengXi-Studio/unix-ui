---
title: PickerInput
subtitle: 选择器输入框
demo: pages-sub/picker-input/picker-input
added: 0.6.0
---

## 介绍

选择器输入框，由 [Input](/components/input) 与 [PickerPopup](/components/picker-popup) 组合而成：触发器只读展示各列选中项文本，点击整区打开弹层，确认后经 `v-model:value` 回写。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-picker-input
	v-model:value="value"
	:columns="columns"
	title="选择产线"
	placeholder="请选择产线"
	@confirm="onConfirm"
	@clear="onClear"
/>
```

### 多列 {#demo-multi}

```vue
<m-picker-input v-model:value="value" :columns="yearMonthDay" title="选择日期" />
```

多列展示各列 label 以「 / 」连接。

### 级联 {#demo-cascade}

```vue
<m-picker-input v-model:value="value" :columns="regionTree" title="选择地区" />
```

```ts
// 外部赋值时按层级值定位各列选中态
value.value = [1000, 1100, 1110]
```

### 禁用与不可清空 {#demo-disabled}

```vue
<m-picker-input :columns="columns" :value="'注塑二线'" disabled />
<m-picker-input v-model:value="value" :columns="columns" :clearable="false" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列数据（一维 / 二维） | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | 选中值（`v-model:value`） | string \| number \| (string \| number)[] \| null | `null` |
| placeholder | 占位符 | string | `请选择` |
| disabled | 是否禁用 | boolean | `false` |
| clearable | 是否显示清空按钮 | boolean | `true` |
| border | 触发器是否显示边框容器 | boolean | `true` |
| inlaid | 触发器嵌入式形态 | boolean | `false` |
| title | 弹层顶部栏标题 | string | `请选择` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| position | 弹出方位 | DatePickerPosition | `bottom` |
| round | 弹层圆角 | boolean | `true` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写选中值（清空时为 `null`） | value: string \| number \| (string \| number)[] \| null |
| confirm | 弹层确认后触发 | value, selectedOptions: PickerOption[], indexes: number[] |
| clear | 点击清空按钮后触发 | - |

## 主题定制

输入框外观由 [Input](/components/input) 主题变量控制；清空按钮相关变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-picker-input-trigger-z-index | 透明触发层层级 | 1 |
| $m-picker-input-clear-z-index | 清空按钮层级 | 2 |
| $m-picker-input-clear-width | 清空按钮点击区宽度 | 40px |
| $m-picker-input-clear-icon-size | 清空图标字号 | 16px |
| $m-picker-input-clear-color | 清空图标颜色 | #c8c9cc |
