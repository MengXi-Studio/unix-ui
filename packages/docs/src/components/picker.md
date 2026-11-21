---
title: Picker
subtitle: 选择器
demo: pages-sub/pickers/picker/picker
added: 0.6.0
---

## 介绍

通用滚轮选择器面板：一维 / 二维列数据自动识别，支持 `children` 级联、禁用项与自定义选项内容。

本组件为纯平铺面板：弹层形态由 [PickerPopup](/components/picker-popup) 组合实现，表单触发场景由 [PickerInput](/components/picker-input) 组合实现；无工具栏的索引受控版本见 [PickerView](/components/picker-view)。

## 代码演示

### 基础用法 {#demo-basic}

`columns` 为一维数组时按单列渲染，`v-model:value` 为单列标量。

```vue
<m-picker v-model:value="value" :columns="columns" @change="onChange" @confirm="onConfirm" />
```

```ts
const columns: PickerOption[] = [
	{ label: '机加工一线', value: 'line1' },
	{ label: '注塑二线', value: 'line2' }
]
const value = ref<string | number | null>(null)
```

### 多列 {#demo-multi}

`columns` 为二维数组时按多列渲染，值为各列值组成的数组。

```vue
<m-picker v-model:value="value" :columns="yearMonthDay" />
```

```ts
const yearMonthDay: PickerOption[][] = [
	[{ label: '2025', value: 2025 }, { label: '2026', value: 2026 }],
	[{ label: '1 月', value: 1 }, { label: '2 月', value: 2 }],
	[{ label: '1 日', value: 1 }, { label: '15 日', value: 15 }]
]
```

### 级联 {#demo-cascade}

一维数据中的选项带 `children` 时走级联：切换上层后下层重建并回到首项，值为各层值数组。

```vue
<m-picker v-model:value="value" :columns="regionTree" title="选择地区" />
```

```ts
const regionTree: PickerOption[] = [
	{
		label: '华东厂区',
		value: 1000,
		children: [{ label: '机加车间', value: 1100, children: [{ label: '机加工一线', value: 1110 }] }]
	}
]
```

### 禁用项 {#demo-disabled}

`disabled: true` 的选项灰显；吸附滚动会跳过，点击不选中。

```vue
<m-picker v-model:value="value" :columns="shiftOptions" />
```

```ts
const shiftOptions: PickerOption[] = [
	{ label: '白班', value: 'day' },
	{ label: '中班（已满）', value: 'mid', disabled: true },
	{ label: '夜班', value: 'night' }
]
```

### 插槽 {#demo-slots}

- `toolbar`：整体替换顶部栏
- `title` / `confirm` / `cancel`：替换对应段
- `columns-top` / `columns-bottom`：滚轮上方 / 下方自定义区
- `option`：自定义选项内容（仅 Web 生效；作用域：`option`、`index`、`rowIndex`、`columnIndex`）

### 实例方法 {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedValue')
picker.value?.$callMethod('getSelectedIndexes')
picker.value?.$callMethod('confirm')
picker.value?.$callMethod('resetSelection')
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列数据（一维单列 / 级联；二维多列） | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | 选中值（`v-model:value`；单列标量 / 多列数组 / `null` 未选） | string \| number \| (string \| number)[] \| null | `null` |
| title | 顶部栏标题 | string | `请选择` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| show-toolbar | 是否显示顶部栏 | boolean | `true` |
| loading | 是否显示加载状态 | boolean | `false` |
| readonly | 只读 | boolean | `false` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### PickerOption

| 字段 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| label | 展示文本 | string | 是 |
| value | 业务值（字符串 / 数字，回传保留原类型） | string \| number | 是 |
| children | 级联子项 | PickerOption[] | 否 |
| disabled | 是否禁用 | boolean | 否 |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中值回写（滚动与确认后均触发） | value: string \| number \| (string \| number)[] \| null |
| change | 滚轮切换列 | value, selectedOptions: PickerOption[], indexes: number[] |
| confirm | 点击确认按钮 | value, selectedOptions: PickerOption[], indexes: number[] |
| cancel | 点击取消按钮 | - |

### Methods

| 方法名 | 说明 |
| --- | --- |
| confirm | 程序化确认 |
| resetSelection | 重置为外部 value |
| reposition | 按当前选中下标重新定位滚轮（弹层 `open` 后布局可用时由弹层自动调用） |
| getSelectedValue | 读取当前选中值 |
| getSelectedIndexes | 读取各列选中下标 |

### Slots

| 名称 | 说明 |
| --- | --- |
| toolbar | 整体替换顶部栏 |
| title | 标题内容 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |
| columns-top | 滚轮上方内容 |
| columns-bottom | 滚轮下方内容 |
| option | 选项内容（作用域：`option`、`index`、`rowIndex`、`columnIndex`；仅 Web 生效，App / 小程序端回退内置文本） |

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-picker-background | 面板背景 | #ffffff |
| $m-picker-toolbar-height | 顶部栏高度 | 44px |
| $m-picker-action-padding | 顶部栏按钮内边距 | 0 16px |
| $m-picker-action-font-size | 顶部栏按钮字号 | 14px |
| $m-picker-cancel-color | 取消按钮文字色 | #646566 |
| $m-picker-confirm-color | 确认按钮文字色 | #1989fa |
| $m-picker-title-font-size | 标题字号 | 16px |
| $m-picker-title-color | 标题文字色 | #323233 |
| $m-picker-frame-color | 选中框细线颜色 | #ebedf0 |
| $m-picker-loading-background | 加载遮罩背景 | rgba(255,255,255,0.9) |

选项文本样式沿用日期选择列变量（`$m-date-picker-option-*`）。
