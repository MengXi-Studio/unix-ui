---
title: Calendar
subtitle: 日历
demo: pages-sub/calendar/calendar
---

## 介绍

日历面板组件，支持单选（single）、多选（multiple）、范围选择（range）三种类型，提供年月切换导航、日期格式化、月份水印、范围超限提示等能力。

本组件为纯平铺面板：弹出层形态由 [CalendarPopup](/components/calendar-popup) 组合实现，表单触发场景由 [CalendarInput](/components/calendar-input) 组合实现。超限提示复用 [Toast](/components/toast)。

## 代码演示

### 基础用法 {#demo-basic}

直接平铺展示（默认今天起 6 个月），点击日期即触发 `select`；`show-confirm` 为 `true` 时底部渲染确认按钮，点击后触发 `confirm`。

```vue
<m-calendar @select="onSelect" @confirm="onConfirm" />
```

### 多选与超限 {#demo-multiple}

`type` 设为 `multiple` 后点击切换选中 / 取消选中（取消时先触发 `unselect` 再触发 `select`）；`max-range` 限制最多可选天数（range 与 multiple 均适用），超出时拒绝本次选择并触发 `over-range`，`show-range-prompt` 控制是否同时弹出 toast 提示。

```vue
<m-calendar
	type="multiple"
	:max-range="3"
	range-prompt="最多选择 3 天"
	@select="onSelect"
	@unselect="onUnselect"
	@over-range="onOverRange"
/>
```

### 范围选择 {#demo-range}

`type` 设为 `range` 后先点起点再点终点；`allow-same-day` 允许起止同日；`show-confirm` 设为 `false` 时选满即自动触发 `confirm`。

```vue
<m-calendar
	type="range"
	:show-confirm="false"
	:allow-same-day="true"
	@confirm="onConfirm"
/>
```

### 自定义范围与主题色 {#demo-color}

`min-date` / `max-date` 限定可选区间（界外日期置灰禁用，点击触发 `click-disabled-date`）；`default-date` 预选日期；`color` 派生选中方块与范围连接 bar 的主题色（支持 `#hex` 与渐变）。日期 prop 一律使用数值形式构造（`new Date(2026, 9, 10)`，月份从 0 开始）。

```vue
<m-calendar
	type="range"
	:min-date="minDate"
	:max-date="maxDate"
	:default-date="[new Date(2026, 9, 15), new Date(2026, 9, 18)]"
	color="#07c160"
	@click-disabled-date="onDisabled"
/>
```

### 年月切换导航 {#demo-switch-mode}

`switch-mode` 设为 `month` 显示单月视图 + 上下月导航；设为 `year-month` 增加上下年导航。导航在可选范围内自动收敛（clamp），点击当前月标题触发 `click-subtitle`，面板所在月变化触发 `panel-change`。

```vue
<m-calendar switch-mode="month" @panel-change="onPanelChange" />
<m-calendar switch-mode="year-month" @panel-change="onPanelChange" />
```

### 面板高度 {#demo-height}

默认由内容撑开（今天起 6 个月），`height` 传 px 等长度值可固定面板高度、内部滚动（配合 `max-date` 缩小范围效果更明显）。

固定高度产生内部滚动后，顶部副标题随滚动实时切换为视口所在月份（对齐 Vant）；面板由内容撑开（页面滚动）时副标题保持初始聚焦月。

```vue
<m-calendar height="400px" />
```

### 自定义日期文字 {#demo-formatter}

`formatter` 在内置标记之后统一应用，可覆盖文案、顶部 / 底部信息、禁用态与自定义类名；`row-height` 调整日格行高；`first-day-of-week` 设置周起始日（0 周日 - 6 周六）。

```vue
<m-calendar
	:row-height="56"
	:first-day-of-week="1"
	:formatter="dayFormatter"
/>
```

```ts
const dayFormatter = (day: CalendarDayItem): CalendarDayItem => {
	if (day.type == 'placeholder') {
		return day
	}
	if (getDayDiff(day.date, new Date()) == 0) {
		day.bottomInfo = '今天'
	}
	if (day.date.getFullYear() == 2026 && day.date.getMonth() == 9 && day.date.getDate() == 20) {
		day.topInfo = '约满'
		day.type = 'disabled'
	}
	return day
}
```

### 插槽 {#demo-slots}

支持 `title` / `subtitle` / `month-title` / `text` / `top-info` / `bottom-info` / `footer` 及确认按钮文字、导航图标等插槽；`text` 为作用域插槽，`day` 为该格数据。月块内标题默认不渲染（副标题随滚动切换视口月），传入 `month-title` 插槽即恢复月块标题行。

```vue
<m-calendar :show-mark="false" :max-date="maxDate">
	<template #title>
		<text>选择入住日期</text>
	</template>
	<template #subtitle>
		<text>本月特价</text>
	</template>
	<template #month-title="{ text }">
		<text>{{ text }}</text>
	</template>
	<template #text="{ day }">
		<text>{{ day.text }}</text>
	</template>
	<template #footer>
		<view><text>自定义 footer 区域</text></view>
	</template>
</m-calendar>
```

### 实例方法 {#demo-methods}

```vue
const cal = ref<ComponentPublicInstance | null>(null)
cal.value?.$callMethod('scrollToDate', new Date(2026, 10, 15))
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 选择类型，可选值 `single` `multiple` `range` | CalendarType | `single` |
| title | 常规标题 | string | `日期选择` |
| color | 主题色（选中方块与范围 bar 派生色，支持 `#hex` 与渐变） | string | - |
| min-date | 最小日期 | Date \| null | `null`（今天） |
| max-date | 最大日期 | Date \| null | `null`（今天 + 6 个月） |
| default-date | 默认选中日期（单值或数组，随 type 语义消费） | Date \| Date[] \| null | `null` |
| row-height | 日格行高 px（`0` 用默认变量值） | number | `0` |
| formatter | 日期格格式化函数（最后统一应用，可覆盖内置标记与文案） | CalendarFormatter \| null | `null` |
| show-mark | 是否显示月份背景水印 | boolean | `true` |
| show-title | 是否显示标题 | boolean | `true` |
| show-subtitle | 是否显示副标题 | boolean | `true` |
| show-confirm | 是否显示确认按钮（`false` 时选满自动确认） | boolean | `true` |
| confirm-text | 确认按钮文字 | string | `确认` |
| confirm-disabled-text | 确认按钮禁用态文字（范围未选满时） | string | `确认` |
| readonly | 只读模式（不响应日期点击） | boolean | `false` |
| first-day-of-week | 周起始日（0 周日 - 6 周六） | number | `0` |
| switch-mode | 面板切换模式，可选值 `none`（常规滚动列表） `month`（单月 + 月导航） `year-month`（单月 + 年月导航） | CalendarSwitchMode | `none` |
| height | 面板高度（px 等长度单位原样；空串由内容撑开） | string | - |
| max-range | 范围 / 多选最多可选天数（含两端计数；`-1` 不限制） | number | `-1` |
| range-prompt | 超限提示文案（空串用默认「最多选择 N 天」） | string | - |
| show-range-prompt | 超限时是否经 m-toast 提示 | boolean | `true` |
| allow-same-day | 范围选择是否允许起止同日 | boolean | `false` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| select | 点击日期格后触发（每次点击均触发，取消选中后也会触发；值形态随 type） | value: Date \| Date[] |
| confirm | 点击确认按钮 / 选满自动确认后触发 | value: Date \| Date[] |
| unselect | 多选取消选中某日时触发（先于同次 select） | date: Date |
| over-range | 选择超出 max-range 限制被拒绝时触发 | - |
| month-show | 聚焦月进入视口时触发（挂载时触发一次，参数为当月 1 号；面板滚动不重复触发） | date: Date |
| panel-change | switch-mode 面板所在月变化时触发 | date: Date |
| click-subtitle | 点击副标题 / 导航行当前月标题时触发 | - |
| click-disabled-date | 点击禁用日期时触发 | date: Date |

### Methods

通过模板 ref 获取组件实例后调用（uvue 组件经 `$callMethod` 调用）。

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| reset | 清空选择并回到聚焦月 | - |
| scrollToDate | 滚动定位到指定日期所在月（即时定位，无滚动动画） | date: Date |
| getSelectedDate | 读取当前选择（single 为单值，multiple / range 为数组） | - |
| refreshView | 重算尺寸并复位聚焦月（弹层组合组件复开时调用） | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| title | 常规标题 |
| subtitle | 副标题 / 导航行当前月标题（none 模式副标题随内部滚动切换为视口月份） |
| month-title | 月块内标题（默认不渲染，传入即恢复；作用域：`month` 该月首日 Date、`text` 标题文案） |
| text | 日期文字（作用域：`day` 该格数据） |
| top-info | 日期顶部信息（作用域：`day`） |
| bottom-info | 日期底部信息（作用域：`day`） |
| footer | 底部区域（默认为确认按钮） |
| confirm-text | 确认按钮文字 |
| prev-year / prev-month / next-month / next-year | switch-mode 导航图标 |

## 主题定制

日历样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-calendar-background | 面板背景色 | #ffffff |
| $m-calendar-header-title-height | 标题区高度 | 44px |
| $m-calendar-header-title-font-size | 标题字号 | 16px |
| $m-calendar-header-title-color | 标题颜色 | #323233 |
| $m-calendar-header-subtitle-height | 副标题区高度 | 32px |
| $m-calendar-header-subtitle-font-size | 副标题字号 | 14px |
| $m-calendar-header-subtitle-color | 副标题颜色 | #323233 |
| $m-calendar-weekdays-height | 星期表头高度 | 30px |
| $m-calendar-weekdays-font-size | 星期表头字号 | 12px |
| $m-calendar-weekdays-color | 星期表头颜色 | #969799 |
| $m-calendar-nav-icon-size | 导航图标大小 | 20px |
| $m-calendar-nav-icon-color | 导航图标颜色 | #969799 |
| $m-calendar-month-title-height | 月块内标题高度（默认不渲染，仅 month-title 插槽生效） | 24px |
| $m-calendar-month-title-font-size | 月标题字号 | 14px |
| $m-calendar-month-mark-color | 月水印颜色 | rgba(50, 50, 51, 0.06) |
| $m-calendar-month-mark-font-size | 月水印字号 | 160px |
| $m-calendar-day-height | 日格高度 | 64px |
| $m-calendar-day-font-size | 日格字号 | 16px |
| $m-calendar-day-margin-bottom | 日格纵向间距 | 4px |
| $m-calendar-day-disabled-color | 禁用日文字色 | #c8c9cc |
| $m-calendar-info-font-size | 日期上下信息字号 | 10px |
| $m-calendar-info-color | 日期上下信息颜色 | #969799 |
| $m-calendar-day-radius | 选中方块圆角（范围端点单侧直角衔接 bar） | 4px |
| $m-calendar-selected-day-color | 选中日文字色 | #ffffff |
| $m-calendar-selected-day-background | 选中日背景色（主色） | #1989fa |
| $m-calendar-range-middle-background | 范围中段底色 | rgba(25, 137, 250, 0.1) |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- 组件拆分：Vant 为单组件双形态（`poppable` 切换弹层 / 平铺），本项目拆为三个组件——`m-calendar` 纯面板、`m-calendar-popup` 弹出层、`m-calendar-input` 表单输入框，各司其职
- `height` 为本项目扩展 prop：Vant 平铺面板由内容撑开，本项目可传 px 等长度值固定面板高度、内部滚动（弹层场景由 `m-calendar-popup` 的 `popup-height` 接管）
- `max-range` 扩展至 multiple 类型：Vant 中仅 range 生效，本项目 range 与 multiple 均适用；超限语义为「拒绝本次选择 + over-range 事件 +（可选）toast 提示」
- `allow-same-day` 为扩展 prop：Vant range 不支持起止同日，本项目可配置开启，起止同日时两端各半连接 bar
- multiple 取消选中为「unselect 后紧跟 select」的事件序列：`select` 在每次点击均派发（含取消选中后，Vant 同语义），`unselect` 为本项目扩展事件用于区分取消动作
- 副标题滚动切换基于月高估算（行数 × 日格高 + 间距），用户覆盖 `$m-calendar-day-height` / `$m-calendar-day-margin-bottom` 变量时切换时机存在月粒度偏差；scrollToDate 仍为即时定位无动画（Vant 为平滑滚动）
- 日期 prop 仅接受 `Date` 实例：`min-date` / `max-date` / `default-date` 等需用数值形式构造（`new Date(2026, 9, 29)`，月份 0 基），不支持 Vant 的字符串日期形态
- `formatter` 仅支持同步函数（UTS 无 Promise 化 formatter），不支持返回 Promise 的异步形态
- `min-date` / `max-date` 默认值收窄为「今天 ~ 今天 + 6 个月」（Vant 同为今天起 6 个月）
- 星期表头与月标题文案内置中文（月标题「2026年10月」格式），无 Vant 的 locale 国际化机制；月块标题默认不渲染（对齐 Vant），可经 `month-title` 插槽恢复，星期表头暂无插槽
- `color` 传渐变等非 `#hex` 值时选中方块跟随渐变、范围 bar 底色回退默认主题色（派生透明度仅支持 `#hex`）
