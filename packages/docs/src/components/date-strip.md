---
title: DateStrip
subtitle: 日期横条
demo: pages-sub/date-strip/date-strip
added: 0.5.0
---

## 介绍

横向日期条，在一段连续日期中完成单选（single）、多选（multiple）或范围（range）选择，点选即生效，无确认按钮。默认展示「今天前 7 天 ~ 今天后 7 天」，支持值格式转换、农历文案、禁用 / 过滤与插槽定制。

内部日期计算全部复用 [日期工具](/tools/date)：`addDays` 生成默认范围、`eachDayOfInterval` 生成序列、`getDayStart` 归一比较、`getDayDiff` 计算范围天数、`formatDate` / `parseDate` 处理 `value-format`、`solarToLunar` + `getLunarDateText` 生成农历文案。

## 代码演示

### 基础用法 {#demo-basic}

点击日期即选中并同步 `v-model:value`，同时派发 `change`。

```vue
<m-date-strip v-model:value="value" @change="onChange" />
```

### 多选与超限 {#demo-multiple}

`type="multiple"` 点击切换选中；`max-range` 限制最多可选天数，超出时拒绝本次选择并派发 `over-range`（值不变）。

```vue
<m-date-strip type="multiple" :max-range="3" @over-range="onOverRange" />
```

### 范围选择 {#demo-range}

`type="range"` 先点起点再点终点，早于起点时自动交换；`allow-same-day` 允许起止同日；端点顶行文案由 `start-date-text` / `end-date-text` / `same-date-text` 控制。

```vue
<m-date-strip
	type="range"
	:allow-same-day="true"
	start-date-text="入住"
	end-date-text="离店"
	same-date-text="当天"
/>
```

### 值格式 {#demo-value-format}

`value-format` 非空时 `v-model` 使用字符串（内部经 `parseDate` 解析、`formatDate` 输出，非法字符串按未选中处理）。

```vue
<m-date-strip v-model:value="dateText" value-format="YYYY-MM-DD" />
```

### 农历 {#demo-lunar}

`show-lunar` 在日号下方展示农历文案，闰月带「闰」前缀；超出 1900-2100 范围时留空。

```vue
<m-date-strip show-lunar />
```

### 过滤与禁用 {#demo-filter}

`filter` 返回 `false` 的日期不渲染；`disabled-date` 返回 `true` 的日期灰显禁用，点击派发 `click-disabled-date`。

```vue
<m-date-strip :filter="hideSunday" :disabled-date="disableTomorrow" />
```

### 插槽 {#demo-slots}

`item` 插槽完全接管单项内容；`top-info` / `bottom-info` 插槽替换日号上下的附加内容。

```vue
<m-date-strip>
	<template #item="{ item }">
		<text>{{ item.text }}</text>
	</template>
</m-date-strip>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 选择类型，可选值 `single` `multiple` `range` | CalendarType | `single` |
| value | 选中值（`v-model:value`） | Date \| Date[] \| string \| string[] \| null | `null` |
| value-format | 值格式（如 `YYYY-MM-DD`）；非空时绑定值为字符串 | string | - |
| min-date | 最小可选日 | Date \| null | `null`（今天 - 7 天） |
| max-date | 最大可选日 | Date \| null | `null`（今天 + 7 天） |
| current-date | 「今天」判定基准 | Date \| null | `null`（当前时间） |
| disabled-date | 禁用判定，`true` 禁用并灰显（仍展示） | (date: Date) => boolean | - |
| filter | 过滤判定，`false` 不展示 | (date: Date) => boolean | - |
| max-range | 范围 / 多选最多可选天数（含两端计数；`-1` 不限制） | number | `-1` |
| allow-same-day | 范围选择是否允许起止同日 | boolean | `false` |
| formatter | 日期项格式化（可覆盖文案 / 类名 / 标记） | CalendarFormatter | - |
| show-lunar | 是否在日号下方展示农历 | boolean | `false` |
| start-date-text | 范围起点文案 | string | `开始` |
| end-date-text | 范围终点文案 | string | `结束` |
| same-date-text | 起止同日文案 | string | `开始/结束` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中值变化（`v-model:value`） | value: Date \| Date[] \| string \| string[] \| null |
| change | 用户点击导致值变化 | 同上 |
| over-range | 超出 `max-range`，值不变 | - |
| click-disabled-date | 点击禁用日期 | date: Date |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| item | 完全自定义单项内容 | item: CalendarDayItem |
| top-info | 日号上方的附加内容 | day: CalendarDayItem |
| bottom-info | 日号下方的附加内容 | day: CalendarDayItem |

## 主题定制

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$m-date-strip-background` | `$m-white` | 条带背景 |
| `$m-date-strip-track-padding` | `4px` | 轨道上下内边距 |
| `$m-date-strip-item-width` | `64px` | 单项宽度 |
| `$m-date-strip-item-padding-y` | `8px` | 单项上下内边距 |
| `$m-date-strip-item-border-radius` | `4px` | 单项圆角 |
| `$m-date-strip-item-bg-selected` | `$m-color-primary` | 选中 / 范围端点底色 |
| `$m-date-strip-item-bg-middle` | `rgba($m-color-primary, 0.1)` | 范围中段底色 |
| `$m-date-strip-item-week-font-size` | `12px` | 周几文案字号 |
| `$m-date-strip-item-week-color` | `$m-text-color-tertiary` | 周几文案颜色 |
| `$m-date-strip-item-day-font-size` | `16px` | 日号字号 |
| `$m-date-strip-item-color` | `$m-text-color` | 日号颜色 |
| `$m-date-strip-item-color-selected` | `$m-white` | 选中态文本色 |
| `$m-date-strip-item-color-disabled` | `$m-text-color-fourth` | 禁用日文本色 |
| `$m-date-strip-item-info-font-size` | `10px` | 农历 / 附加文案字号 |
| `$m-date-strip-item-info-color` | `$m-text-color-tertiary` | 农历 / 附加文案颜色 |

## 与 Sard DateStrip 的差异

- 超限命名对齐本库 m-calendar：`max-range` + `over-range`（Sard 为 `max-days` + `over-max-days`），且不内置 toast。
- `formatter` 复用 `CalendarDayItem`（`topInfo` / `bottomInfo` / `className`），不支持行内 `style` 对象（原生端受限）。
- 日期 prop 一律使用数值形式构造（`new Date(2026, 10, 14)`，月份从 0 开始）。
