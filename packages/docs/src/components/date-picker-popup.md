---
title: DatePickerPopup
subtitle: 日期选择弹出框
demo: pages-sub/date-picker-popup/date-picker-popup
added: 0.6.0
---

## 介绍

日期选择弹出框，由 [Popup](/components/popup) 与 [DatePicker](/components/date-picker) 组合而成：弹层行为（显隐 / 方位 / 圆角 / 安全区 / 遮罩）归 `m-popup`，滚轮选择行为归 `m-date-picker`，本组件仅做组合与转发。确认或取消后自动关闭弹层。

## 代码演示

### 基础用法 {#demo-basic}

`v-model:show` 控制显隐，确认 / 取消后自动关闭并回写 `update:show`；弹层生命周期事件（`open` / `opened` / `close` / `closed`）与遮罩点击事件同步透传。

```vue
<m-button @click="show = true">打开日期选择</m-button>
<m-date-picker-popup
	v-model:show="show"
	title="选择日期"
	@confirm="onConfirm"
	@cancel="onCancel"
/>
```

### 受控选中值 {#demo-controlled}

`v-model:value` 受控：确认后回写；外部赋值后再次打开弹层，滚轮选中态跟随外部值。

```vue
<m-date-picker-popup v-model:show="show" v-model:value="value" />
```

```ts
const value = ref<Date | null>(null)
```

### 列组合与区间 {#demo-columns}

`columns-type` 决定列组合，`min-date` / `max-date` 限定选项区间，其余选择类 props 与 `m-date-picker` 一致。

```vue
<m-date-picker-popup
	v-model:show="show"
	:columns-type="['year', 'month']"
	:min-date="minDate"
	:max-date="maxDate"
	title="选择年月"
/>
```

### 只读与加载态 {#demo-states}

```vue
<m-date-picker-popup v-model:show="show" readonly loading />
```

### 插槽 {#demo-slots}

`toolbar` / `title` / `confirm` / `cancel` / `option` / `columns-top` / `columns-bottom` 插槽逐项透传到内部 `m-date-picker`；未传入的插槽保持默认渲染。

```vue
<m-date-picker-popup v-model:show="show">
	<template #title>
		<text>选择账期</text>
	</template>
	<template #confirm>
		<text>完成</text>
	</template>
</m-date-picker-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹出层（`v-model:show`） | boolean | `false` |
| columns-type | 选项类型组合 | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | 可选最小日期 | Date \| null | `null`（十年前） |
| max-date | 可选最大日期 | Date \| null | `null`（十年后） |
| value | 当前选中日期（`v-model:value`） | Date \| null | `null`（今天） |
| title | 顶部栏标题 | string | `''` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| show-toolbar | 是否显示顶部栏 | boolean | `true` |
| loading | 是否显示加载状态 | boolean | `false` |
| readonly | 只读 | boolean | `false` |
| filter | 选项过滤函数 | DatePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | DatePickerFormatter \| null | `null` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| position | 弹出方位 | DatePickerPosition | `bottom` |
| round | 是否显示圆角 | boolean | `true` |
| close-on-click-overlay | 点击遮罩后是否关闭 | boolean | `true` |
| reset-on-open | 打开时是否复位选择为 value / 今天 | boolean | `false` |
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
| update:value | 确认后回写选中日期 | date: Date |
| change | 滚轮切换列 | date: Date, columnIndex: number |
| confirm | 点击确认按钮（随后自动关闭） | date: Date |
| cancel | 点击取消按钮（随后自动关闭） | - |
| open / opened / close / closed | 弹层生命周期 | - |
| click-overlay | 点击遮罩 | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| toolbar | 整体替换顶部栏 |
| title | 顶部栏标题 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |
| option | 选项内容（作用域：`option`、`index`；仅 Web 生效，App / 小程序端回退内置文本） |
| columns-top | 滚轮区上方内容 |
| columns-bottom | 滚轮区下方内容 |

## 主题定制

弹层外观（背景、圆角、遮罩）由 [Popup](/components/popup) 的主题变量控制；滚轮区样式见 [DatePicker 主题定制](/components/date-picker#主题定制)。

## 与 Vant 的差异

- 组件拆分：Vant 需自行组合 `van-popup` + `van-date-picker`，本项目直接提供 `m-date-picker-popup` 组合组件，并内置确认 / 取消后自动关闭
- `v-model:show` 受控显隐为本项目扩展：Vant 组合场景需自行维护弹层显隐
- `reset-on-open` 为本项目扩展：默认保留复开时的上次选择，开启后按 `value` / 今天复位
- 弹层高度由面板内容撑开（无 `popup-height`），日期选择面板高度固定为「顶部栏 + 行高 × 可见个数」
