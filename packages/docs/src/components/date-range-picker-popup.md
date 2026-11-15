---
title: DateRangePickerPopup
subtitle: 日期范围弹出框
demo: pages-sub/date-range-picker-popup/date-range-picker-popup
added: 0.6.0
---

## 介绍

日期范围选择弹出框，由 [Popup](/components/popup) 与 [DateRangePicker](/components/date-range-picker) 组合而成：弹层行为归 `m-popup`，双段标题与两端值归面板，本组件仅做组合与转发。确认或取消后自动关闭弹层。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-button @click="show = true">打开日期范围选择</m-button>
<m-date-range-picker-popup v-model:show="show" @confirm="onConfirm" @cancel="onCancel" />
```

```ts
const show = ref(false)
```

### 受控选中值 {#demo-controlled}

```vue
<m-date-range-picker-popup v-model:show="show" v-model:value="value" />
```

```ts
const value = ref<Date[] | null>(null)
```

### 列组合与自定义标题 {#demo-columns}

```vue
<m-date-range-picker-popup
	v-model:show="show"
	:columns-type="['year', 'month']"
	:tabs="['开始月份', '结束月份']"
	:min-date="minDate"
	:max-date="maxDate"
/>
```

### 插槽 {#demo-slots}

`header` / `title` / `footer` / `confirm` / `cancel` 插槽逐项透传到内部面板；未传入的插槽保持默认渲染。

```vue
<m-date-range-picker-popup v-model:show="show">
	<template #header>
		<view><text @click="setLastWeek">近一周</text></view>
	</template>
	<template #confirm>
		<text>完成</text>
	</template>
</m-date-range-picker-popup>
```

### 只读与加载态 {#demo-states}

```vue
<m-date-range-picker-popup v-model:show="show" readonly loading />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹出层（`v-model:show`） | boolean | `false` |
| value | 两端选中值（`v-model:value`） | Date[] \| null | `null` |
| tabs | 两段标题文案 | string[] \| null | `['开始日期', '结束日期']` |
| columns-type | 选项类型组合 | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | 可选最小日期 | Date \| null | `null`（十年前） |
| max-date | 可选最大日期 | Date \| null | `null`（十年后） |
| filter | 选项过滤函数 | DatePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | DatePickerFormatter \| null | `null` |
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
| update:value | 确认后回写两端值 | value: Date[] \| null |
| change | 当前端滚动切换 | value: Date[], activeIndex: number |
| confirm | 点击确认按钮（随后自动关闭） | value: Date[] |
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

弹层外观（背景、圆角、遮罩）由 [Popup](/components/popup) 主题变量控制；面板样式见 [DateRangePicker 主题定制](/components/date-range-picker#主题定制)。

## 与 Sard 的差异

- Sard 用 `DatetimeRangePickerPopout` + `v-model:visible`；本项目为 `m-date-range-picker-popup` + `v-model:show`
- 内置确认 / 取消后自动关闭；Sard 由 `FormPopout` 组合提供
- 高度由面板内容撑开（双段标题 + 滚轮 + 底部按钮区），无 `popup-height`
