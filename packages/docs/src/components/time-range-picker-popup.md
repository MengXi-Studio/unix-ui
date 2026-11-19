---
title: TimeRangePickerPopup
subtitle: 时间范围弹出框
demo: pages-sub/datetime/time-range-picker-popup/time-range-picker-popup
added: 0.6.0
---

## 介绍

时间范围选择弹出框，由 [Popup](/components/popup) 与 [TimeRangePicker](/components/time-range-picker) 组合而成：确认或取消后自动关闭弹层。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-button @click="show = true">打开时间范围选择</m-button>
<m-time-range-picker-popup v-model:show="show" v-model:value="value" @confirm="onConfirm" />
```

```ts
const show = ref(false)
const value = ref<string[] | null>(null)
```

### 步长、区间与 12 小时制 {#demo-columns}

```vue
<m-time-range-picker-popup
	v-model:show="show"
	:tabs="['上班', '下班']"
	:minute-step="15"
	min-time="09:00"
	max-time="18:00"
/>
<m-time-range-picker-popup v-model:show="show2" :columns-type="['hour', 'minute', 'second']" :hour-cycle="12" />
```

### 插槽与状态 {#demo-slots}

```vue
<m-time-range-picker-popup v-model:show="show" v-model:value="value" :tabs="['上班', '下班']">
	<template #header>
		<view><text @click="setWorkTime">工作时间</text></view>
	</template>
	<template #confirm>
		<text>完成</text>
	</template>
</m-time-range-picker-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹出层（`v-model:show`） | boolean | `false` |
| value | 两端选中值（`v-model:value`） | string[] \| null | `null` |
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
| position | 弹出方位 | DatePickerPosition | `bottom` |
| round | 是否显示圆角 | boolean | `true` |
| close-on-click-overlay | 点击遮罩后是否关闭 | boolean | `true` |
| reset-on-open | 打开时是否复位为 value | boolean | `false` |
| safe-area-inset-top | 顶部安全区 | boolean | `false` |
| safe-area-inset-bottom | 底部安全区 | boolean | `true` |
| z-index | 层级 | number | `1` |
| duration | 动画时长（秒） | number | `0.3` |
| custom-class | 面板根节点自定义类名 | string.ClassString | - |
| custom-style | 面板根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐变化（确认 / 取消 / 遮罩关闭后为 `false`） | value: boolean |
| update:value | 确认后回写两端值 | value: string[] \| null |
| change | 当前端滚动切换 | value: string[], activeIndex: number |
| confirm | 点击确认按钮（随后自动关闭） | value: string[] |
| cancel | 点击取消按钮（随后自动关闭） | - |
| open / opened / close / closed | 弹层生命周期 | - |
| click-overlay | 点击遮罩 | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| header | 两段标题上方内容（快捷选项） |
| title | 整体替换两段标题（作用域：`tabs`、`activeIndex`） |
| footer | 整体替换底部按钮区 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |

## 主题定制

弹层外观由 [Popup](/components/popup) 主题变量控制；面板样式见 [TimeRangePicker 主题定制](/components/time-range-picker#主题定制)。
