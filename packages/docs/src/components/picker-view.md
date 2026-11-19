---
title: PickerView
subtitle: 选择器纯视图
demo: pages-sub/pickers/picker-view/picker-view
added: 0.6.0
---

## 介绍

无工具栏、无数值语义的索引受控多列滚轮：只上报各列下标（`number[]`），适合嵌入自定义容器（底部弹层内、设置面板中）。

与 [Picker](/components/picker) 的分工：不提供顶部栏、不做单列标量 / 多列数组的值换算、不展开 `children` 级联；需要这些能力时直接用 Picker 或 PickerPopup。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-picker-view v-model:value="indexes" :columns="columns" @change="onChange" />
```

```ts
const indexes = ref<number[]>([0])
```

### 多列 {#demo-multi}

```vue
<m-picker-view v-model:value="indexes" :columns="yearMonthDay" :option-height="40" />
```

```ts
// 定位到 2025 / 2 月 / 15 日
indexes.value = [1, 1, 1]
```

### 自定义选项内容 {#demo-slots}

`option` 插槽作用域含原始选项与行列下标；仅 Web 端生效，App / 小程序端回退内置文本渲染。

```vue
<m-picker-view v-model:value="indexes" :columns="statusOptions">
	<template #option="{ option }">
		<view class="row">
			<view class="dot" :style="dotStyle(option)"></view>
			<text>{{ option.label }}</text>
		</view>
	</template>
</m-picker-view>
```

### 实例方法 {#demo-methods}

```vue
const view = ref<ComponentPublicInstance | null>(null)
view.value?.$callMethod('getSelectedIndexes')
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列数据（一维 / 二维；`children` 不展开） | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | 各列选中下标（`v-model:value`；空数组表示未选） | number[] | `null` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| readonly | 只读 | boolean | `false` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 各列下标回写 | value: number[] |
| change | 列切换（全部列下标快照） | value: number[] |

### Methods

| 方法名 | 说明 |
| --- | --- |
| getSelectedIndexes | 读取当前各列下标 |

### Slots

| 名称 | 说明 |
| --- | --- |
| option | 选项内容（作用域：`option`、`index`、`rowIndex`、`columnIndex`；仅 Web 生效，App / 小程序端回退内置文本） |

### PickerViewColumn

`m-picker-view-column` 为纯视图列，也可在业务中单独使用：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 列选项 | PickerOption[] \| null | `null` |
| index | 选中项下标（受控） | number | `0` |
| column-index | 列下标（事件回传） | number | `0` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| readonly | 只读 | boolean | `false` |

事件：`change(columnIndex, index)`；插槽：`option`。

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-picker-view-background | 视图背景 | #ffffff |
| $m-picker-view-frame-color | 选中框细线颜色 | #ebedf0 |

整体高度 = `option-height` × `visible-option-num`，可通过 `custom-style` 覆盖容器样式。选项文本样式沿用日期选择列变量（`$m-date-picker-option-*`）。
