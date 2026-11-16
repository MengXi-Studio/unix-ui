---
title: TimeRangePicker
subtitle: 时间范围选择
demo: pages-sub/time-range-picker/time-range-picker
added: 0.6.0
---

## 介绍

时间范围选择面板：顶部「开始时间 / 结束时间」两段标题，同一套时间滚轮分别编辑两端，确认时自动交换为升序。

弹层形态由 [TimeRangePickerPopup](/components/time-range-picker-popup) 组合实现，表单触发场景由 [TimeRangePickerInput](/components/time-range-picker-input) 组合实现；单值选择见 [TimePicker](/components/time-picker)。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-time-range-picker v-model:value="value" @change="onChange" @confirm="onConfirm" />
```

```ts
const value = ref<string[] | null>(null)
```

### 自定义标题与步长 {#demo-tabs}

```vue
<m-time-range-picker
	v-model:value="value"
	:tabs="['上班', '下班']"
	:minute-step="15"
	min-time="09:00"
	max-time="18:00"
/>
```

### 12 小时制与时分秒 {#demo-cycle}

```vue
<m-time-range-picker v-model:value="value" :columns-type="['hour', 'minute', 'second']" :hour-cycle="12" />
```

### 插槽 {#demo-slots}

- `header`：两段标题上方的快捷区（如「上午 / 工作时间」）
- `title`：整体替换两段标题（作用域：`tabs`、`activeIndex`）
- `footer`：整体替换底部按钮区
- `confirm` / `cancel`：底部按钮内容

```vue
<m-time-range-picker v-model:value="value" :tabs="['上班', '下班']">
	<template #header>
		<view><text @click="setWorkTime">工作时间</text></view>
	</template>
	<template #confirm>
		<text>完成</text>
	</template>
</m-time-range-picker>
```

### 只读、加载与实例方法 {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedValue')
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 两端选中值（`v-model:value`，长度 0-2） | string[] \| null | `null` |
| tabs | 两段标题文案 | string[] \| null | `['开始时间', '结束时间']` |
| columns-type | 选项类型组合 | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| min-time | 可选最小时刻 | string \| null | `null` |
| max-time | 可选最大时刻 | string \| null | `null` |
| minute-step | 分钟步长 | number | `1` |
| second-step | 秒步长 | number | `1` |
| hour-cycle | 小时制（24 / 12） | number | `24` |
| filter | 选项过滤函数 | TimePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | TimePickerFormatter \| null | `null` |
| option-height | 选项行高 px | number | `0`（44） |
| visible-option-num | 可见选项个数 | number | `0`（6） |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| readonly | 只读 | boolean | `false` |
| loading | 是否显示加载状态 | boolean | `false` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写两端值（自动升序；未选为 `null`） | value: string[] \| null |
| change | 当前端滚动切换后触发 | value: string[], activeIndex: number |
| confirm | 点击确认按钮 | value: string[] |
| cancel | 点击取消按钮 | - |

### Methods

| 方法名 | 说明 |
| --- | --- |
| confirm | 程序化确认 |
| resetSelection | 重置为外部 value |
| getSelectedValue | 读取升序两端值 |

### Slots

| 名称 | 说明 |
| --- | --- |
| header | 两段标题上方内容（快捷选项） |
| title | 整体替换两段标题（作用域：`tabs`、`activeIndex`） |
| footer | 整体替换底部按钮区 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-time-range-picker-background | 面板背景 | #ffffff |
| $m-time-range-picker-tabs-height | 标题区高度 | 44px |
| $m-time-range-picker-tab-font-size | 标题字号 | 14px |
| $m-time-range-picker-tab-color | 未激活标题色 | #646566 |
| $m-time-range-picker-tab-active-color | 激活标题与下划线颜色 | #1989fa |
| $m-time-range-picker-tab-line-width | 激活下划线宽度 | 40px |
| $m-time-range-picker-footer-height | 底部按钮区高度 | 48px |
| $m-time-range-picker-footer-border-color | 底部分隔线颜色 | #ebedf0 |
| $m-time-range-picker-action-font-size | 底部按钮字号 | 14px |
| $m-time-range-picker-cancel-color | 取消按钮文字色 | #646566 |
| $m-time-range-picker-confirm-color | 确认按钮文字色 | #1989fa |

滚轮区变量见 [TimePicker 主题定制](/components/time-picker#主题定制)。

## 与日期范围的差异

- 值口径：时间字符串数组（`['HH:mm', 'HH:mm']`），不携带日期
- 升序比较按等长时间格式逐字符比较；跨天范围（起点晚于终点）在确认时自动交换
- 两端共用同一套列组合、步长、区间与制式配置
