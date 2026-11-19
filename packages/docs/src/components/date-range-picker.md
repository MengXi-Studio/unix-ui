---
title: DateRangePicker
subtitle: 日期范围选择
demo: pages-sub/datetime/date-range-picker/date-range-picker
added: 0.6.0
---

## 介绍

日期范围选择面板：顶部「开始 / 结束」两段标题，同一套日期滚轮分别编辑两端，确认时自动交换为升序。

本组件为纯平铺面板：弹出层形态由 [DateRangePickerPopup](/components/date-range-picker-popup) 组合实现，表单触发场景由 [DateRangePickerInput](/components/date-range-picker-input) 组合实现。滚轮复用 [DatePicker](/components/date-picker)。

## 代码演示

### 基础用法 {#demo-basic}

`v-model:value` 绑定两端值（`Date[]`，长度 0-2）。切换标题编辑不同端点，确认时若起点晚于终点自动交换为升序。

```vue
<m-date-range-picker v-model:value="value" @change="onChange" @confirm="onConfirm" />
```

```ts
const value = ref<Date[] | null>(null)
```

### 自定义标题 {#demo-tabs}

`tabs` 自定义两段标题文案。

```vue
<m-date-range-picker v-model:value="value" :tabs="['入住', '离店']" />
```

### 列组合与区间 {#demo-columns}

`columns-type` 决定列组合，`min-date` / `max-date` 限定取值域，与 `m-date-picker` 一致。

```vue
<m-date-range-picker
	v-model:value="value"
	:columns-type="['year', 'month']"
	:min-date="minDate"
	:max-date="maxDate"
	:tabs="['开始月份', '结束月份']"
/>
```

### 插槽 {#demo-slots}

- `header`：两段标题上方的快捷区（常用于「近一周 / 近一月」）
- `title`：整体替换两段标题（作用域：`tabs`、`activeIndex`）
- `footer`：整体替换底部按钮区
- `confirm` / `cancel`：底部按钮内容

```vue
<m-date-range-picker v-model:value="value">
	<template #header>
		<view><text @click="setLastWeek">近一周</text></view>
	</template>
	<template #title="{ activeIndex }">
		<view><text>当前编辑第 {{ activeIndex + 1 }} 段</text></view>
	</template>
	<template #confirm>
		<text>完成</text>
	</template>
</m-date-range-picker>
```

### 只读与加载态 {#demo-states}

```vue
<m-date-range-picker readonly />
<m-date-range-picker :loading="loading" />
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
| value | 两端选中值（`v-model:value`，长度 0-2） | Date[] \| null | `null` |
| tabs | 两段标题文案 | string[] \| null | `['开始日期', '结束日期']` |
| columns-type | 选项类型组合 | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | 可选最小日期 | Date \| null | `null`（十年前） |
| max-date | 可选最大日期 | Date \| null | `null`（十年后） |
| filter | 选项过滤函数 | DatePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | DatePickerFormatter \| null | `null` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
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
| update:value | 确认后回写两端值（自动升序；未选为 `null`） | value: Date[] \| null |
| change | 当前端滚动切换后触发 | value: Date[], activeIndex: number |
| confirm | 点击确认按钮后触发 | value: Date[] |
| cancel | 点击取消按钮后触发 | - |

### Methods

| 方法名 | 说明 |
| --- | --- |
| confirm | 程序化确认（等价点击确认按钮） |
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
| $m-date-range-picker-background | 面板背景 | #ffffff |
| $m-date-range-picker-tabs-height | 标题区高度 | 44px |
| $m-date-range-picker-tab-font-size | 标题字号 | 14px |
| $m-date-range-picker-tab-color | 未激活标题色 | #646566 |
| $m-date-range-picker-tab-active-color | 激活标题与下划线颜色 | #1989fa |
| $m-date-range-picker-tab-line-width | 激活下划线宽度 | 40px |
| $m-date-range-picker-footer-height | 底部按钮区高度 | 48px |
| $m-date-range-picker-footer-border-color | 底部分隔线颜色 | #ebedf0 |
| $m-date-range-picker-action-font-size | 底部按钮字号 | 14px |
| $m-date-range-picker-cancel-color | 取消按钮文字色 | #646566 |
| $m-date-range-picker-confirm-color | 确认按钮文字色 | #1989fa |

滚轮区变量见 [DatePicker 主题定制](/components/date-picker#主题定制)。

## 与 Sard 的差异

- 组件拆分：Sard 由面板 / Popout / Input 三组件组成，本项目对应为 `m-date-range-picker` / `m-date-range-picker-popup` / `m-date-range-picker-input`（弹层沿用项目 `popup` 命名）
- 时间粒度：首版仅支持年 / 月 / 日（不含时 / 分 / 秒），列组合通过 `columns-type` 配置，未采用 Sard 的 `type` 字母串
- 值口径：`Date[]`（长度 0-2），不提供 `value-format` 字符串输出
- 越界策略：确认时自动交换两端为升序（Sard 未定义该行为）
- 未实现农历（`calendar`）与 `outlet-format` 之外的格式化能力
