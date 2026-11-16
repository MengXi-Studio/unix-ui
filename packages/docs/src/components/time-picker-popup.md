---
title: TimePickerPopup
subtitle: 时间弹出框
demo: pages-sub/time-picker-popup/time-picker-popup
added: 0.6.0
---

## 介绍

时间选择弹出框，由 [Popup](/components/popup) 与 [TimePicker](/components/time-picker) 组合而成：弹层行为归 `m-popup`，时间选择归面板，本组件仅做组合与转发。确认或取消后自动关闭弹层。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-button @click="show = true">打开时间选择</m-button>
<m-time-picker-popup v-model:show="show" @confirm="onConfirm" @cancel="onCancel" />
```

```ts
const show = ref(false)
```

### 受控选中值 {#demo-controlled}

```vue
<m-time-picker-popup v-model:show="show" v-model:value="value" :columns-type="['hour', 'minute', 'second']" />
```

```ts
const value = ref<string | null>('09:30')
```

### 步长、区间与 12 小时制 {#demo-columns}

```vue
<m-time-picker-popup
	v-model:show="show"
	:minute-step="15"
	min-time="09:00"
	max-time="18:00"
	title="工作时间"
/>
<m-time-picker-popup v-model:show="show2" :hour-cycle="12" />
```

### 插槽与状态 {#demo-slots}

`toolbar` / `title` / `confirm` / `cancel` / `option` 插槽逐项透传到内部面板；未传入的插槽保持默认渲染。

```vue
<m-time-picker-popup v-model:show="show" title="自定义">
	<template #confirm>
		<text>完成</text>
	</template>
</m-time-picker-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹出层（`v-model:show`） | boolean | `false` |
| value | 当前时间字符串（`v-model:value`） | string \| null | `null` |
| columns-type | 选项类型组合 | TimePickerColumnType[] \| null | `['hour', 'minute']` |
| min-time | 可选最小时刻 | string \| null | `null` |
| max-time | 可选最大时刻 | string \| null | `null` |
| minute-step | 分钟步长 | number | `1` |
| second-step | 秒步长 | number | `1` |
| hour-cycle | 小时制（24 / 12） | number | `24` |
| title | 顶部栏标题 | string | `选择时间` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| show-toolbar | 是否显示顶部栏 | boolean | `true` |
| loading | 是否显示加载状态 | boolean | `false` |
| readonly | 只读 | boolean | `false` |
| filter | 选项过滤函数 | TimePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | TimePickerFormatter \| null | `null` |
| option-height | 选项行高 px | number | `0`（44） |
| visible-option-num | 可见选项个数 | number | `0`（6） |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
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
| update:value | 确认后回写时间字符串 | value: string |
| change | 滚轮切换列 | value: string, columnIndex: number |
| confirm | 点击确认按钮（随后自动关闭） | value: string |
| cancel | 点击取消按钮（随后自动关闭） | - |
| open / opened / close / closed | 弹层生命周期 | - |
| click-overlay | 点击遮罩 | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| toolbar | 整体替换顶部栏 |
| title | 标题内容 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |
| option | 选项内容（作用域：`option`、`index`；仅 Web 生效，App / 小程序端回退内置文本） |

## 主题定制

弹层外观由 [Popup](/components/popup) 主题变量控制；面板样式见 [TimePicker 主题定制](/components/time-picker#主题定制)。
