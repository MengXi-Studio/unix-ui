---
title: DatePicker
subtitle: 日期选择
demo: pages-sub/datetime/date-picker/date-picker
added: 0.6.0
---

## 介绍

日期选择面板，以滚轮列选择年、月、日，支持列类型任意组合、可选区间限定、选项过滤与格式化、顶部栏自定义及只读 / 加载态。

本组件为纯平铺面板：弹出层形态由 [DatePickerPopup](/components/date-picker-popup) 组合实现，表单触发场景由 [DatePickerInput](/components/date-picker-input) 组合实现。

## 代码演示

### 基础用法 {#demo-basic}

`v-model:value` 绑定当前选中日期，`min-date` / `max-date` 限定可选区间（默认前后十年）。滚轮停止后吸附到最近选项并派发 `change`；点击确认回写 `v-model:value` 并派发 `confirm`。

```vue
<m-date-picker v-model:value="currentDate" title="选择日期" @confirm="onConfirm" />
```

```ts
const currentDate = ref<Date | null>(null)
```

### 选项类型 {#demo-columns}

`columns-type` 控制列类型，支持 `year`、`month`、`day` 任意顺序组合：

- `['year']` 只选年份
- `['month']` 只选月份
- `['year', 'month']` 选择年月（日归一为 1 号）
- `['month', 'day']` 选择月日（沿用当前年份）

```vue
<m-date-picker :columns-type="['year', 'month']" title="选择年月" />
<m-date-picker :columns-type="['month', 'day']" title="选择月日" />
```

### 可选区间 {#demo-range}

`min-date` / `max-date` 限定年界，并据已选年份 / 月份收敛月、日的取值域；越界选择自动收敛到区间内。日期一律用数值形式构造（`new Date(2026, 2, 10)`，月份从 0 开始）。

```vue
<m-date-picker :min-date="minDate" :max-date="maxDate" title="限定区间" />
```

### 过滤选项 {#demo-filter}

`filter(type, options, values)` 对列选项二次过滤，`values` 为更靠前列的已选值；返回新的选项数组（不要原地修改入参）。

```ts
const halfYearFilter = (type: string, options: DatePickerOption[], values: string[]): DatePickerOption[] => {
	if (type != 'month') {
		return options
	}
	const result: DatePickerOption[] = []
	for (let i = 0; i < options.length; i++) {
		if (options[i].value == '06' || options[i].value == '12') {
			result.push(options[i])
		}
	}
	return result
}
```

```vue
<m-date-picker :columns-type="['year', 'month']" :filter="halfYearFilter" />
```

### 格式化选项 {#demo-formatter}

`formatter(type, option)` 改写选项文案，返回同一选项对象。

```ts
const suffixFormatter = (type: string, option: DatePickerOption): DatePickerOption => {
	if (type == 'year') {
		option.text = option.text + '年'
	} else if (type == 'month') {
		option.text = option.text + '月'
	} else {
		option.text = option.text + '日'
	}
	return option
}
```

```vue
<m-date-picker :formatter="suffixFormatter" />
```

### 顶部栏与布局 {#demo-toolbar}

`show-toolbar` 控制顶部栏显隐；`option-height` / `visible-option-num` 调整行高与可视行数；`columns-top` / `columns-bottom` 插槽位于滚轮区上下。

```vue
<m-date-picker :show-toolbar="false" :visible-option-num="5" :option-height="48">
	<template #columns-top>
		<view><text>自定义上方内容</text></view>
	</template>
	<template #columns-bottom>
		<view><text>自定义下方内容</text></view>
	</template>
</m-date-picker>
```

### 插槽 {#demo-slots}

支持 `toolbar`（整体替换顶部栏）、`title` / `confirm` / `cancel`（分段替换）、`option`（仅 Web 生效；作用域：`option` 选项、`index` 下标）、`columns-top` / `columns-bottom`。

```vue
<m-date-picker :columns-type="['year', 'month']">
	<template #title>
		<text>选择账期</text>
	</template>
	<template #confirm>
		<text>完成</text>
	</template>
	<template #option="{ option }">
		<text>{{ option.text }}</text>
	</template>
</m-date-picker>
```

> **注意**：`option` 插槽仅 Web 端生效。App 端具名插槽解构出的下标为 `Any?`，传入 number 参数无法通过 Kotlin 编译；小程序端同名插槽在 `v-for` 内只生效第一个且会触发重复告警。两端均回退内置文本，请改用 `formatter` 改写选项文案。

### 只读与加载态 {#demo-states}

`readonly` 时滚动会回弹到当前值且不响应切换；`loading` 覆盖滚轮区并阻止交互。

```vue
<m-date-picker readonly />
<m-date-picker :loading="loading" />
```

### 实例方法 {#demo-methods}

```vue
const picker = ref<ComponentPublicInstance | null>(null)
picker.value?.$callMethod('getSelectedDate')
picker.value?.$callMethod('confirm')
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns-type | 选项类型组合，`year` / `month` / `day` 任意顺序 | DatePickerColumnType[] \| null | `['year', 'month', 'day']` |
| min-date | 可选最小日期 | Date \| null | `null`（十年前） |
| max-date | 可选最大日期 | Date \| null | `null`（十年后） |
| value | 当前选中日期（`v-model:value`） | Date \| null | `null`（今天） |
| title | 顶部栏标题 | string | `''` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| show-toolbar | 是否显示顶部栏 | boolean | `true` |
| loading | 是否显示加载状态 | boolean | `false` |
| readonly | 只读（滚轮回弹，不响应切换） | boolean | `false` |
| filter | 选项过滤函数 | DatePickerFilter \| null | `null` |
| formatter | 选项格式化函数 | DatePickerFormatter \| null | `null` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms（停止后延迟该时长吸附） | number | `200` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写选中日期（`v-model:value`） | date: Date |
| change | 滚轮切换列后触发 | date: Date, columnIndex: number |
| confirm | 点击确认按钮后触发 | date: Date |
| cancel | 点击取消按钮后触发 | - |

### Methods

通过模板 ref 获取组件实例后调用（uvue 组件经 `$callMethod` 调用）。

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| confirm | 程序化确认（等价点击确认按钮） | - |
| resetSelection | 重置选择为 value（null 为今天） | - |
| getSelectedDate | 读取当前选中日期 | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| toolbar | 整体替换顶部栏 |
| title | 顶部栏标题 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |
| option | 选项内容（作用域：`option` 选项、`index` 下标；仅 Web 生效，App / 小程序端回退内置文本） |
| columns-top | 滚轮区上方内容 |
| columns-bottom | 滚轮区下方内容 |

## 主题定制

日期选择样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-date-picker-option-font-size | 选项字号 | 16px |
| $m-date-picker-option-color | 选项文字色 | #323233 |
| $m-date-picker-option-selected-color | 选中项文字色 | #323233 |

> 面板容器、顶部栏、选中框与加载遮罩由内部 `m-picker` 提供，相关视觉统一通过 `$m-picker-*` 变量定制（如 `$m-picker-toolbar-height`、`$m-picker-frame-color`）。

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- 组件拆分：Vant 为单组件（`van-date-picker`），本项目拆为三个组件——`m-date-picker` 纯面板、`m-date-picker-popup` 弹出层、`m-date-picker-input` 表单输入框
- `value`（`v-model:value`）绑定 `Date` 实例而非 Vant 的 `string[]`：日期一律用数值构造（`new Date(2026, 10, 15)`），与日历三件套口径一致
- 无 `option-height` 的字符串单位形态：本项目只接受数值 px，以保证滚轮吸附的位移换算精确
- `swipe-duration` 语义调整：本项目基于原生 `scroll-view`，该值表示「滚动停止判定时长」（停止后延迟吸附），非 Vant 的惯性动画时长
- 无渐变遮罩层：uvue 无 `pointer-events`，覆盖式遮罩会拦截滚动手势，改用远处选项透明度渐隐实现同等视觉层次
- `option` 插槽仅 Web 生效（App / 小程序端不渲染），自定义选项文案请用 `formatter` 替代
- `getSelectedDate` 返回 `Date` 而非 Vant 的 `string[]`；`change` 事件参数为 `(date, columnIndex)`，Vant 为 `{ selectedValues, selectedOptions, selectedIndexes, columnIndex }`
- `filter` / `formatter` 仅支持同步函数（UTS 无 Promise 化形态）
