---
title: CalendarInput
subtitle: 日历输入框
demo: pages-sub/calendar-input/calendar-input
---

## 介绍

日历输入框组件，基于 [Input](/components/input)（只读触发器）与 [CalendarPopup](/components/calendar-popup)（日历弹出框）组合实现：点击触发器整区打开弹层，确认后经 `v-model:value` 回写选中值并展示；有值时展示自绘清空按钮。

值单向受控：外部 `value` 经内部日历 `default-date` 同步初始选择，确认后经 `update:value` 回写。展示文本由 `value` 派生（single 单值 / range 区间 / multiple 顿号串）。

## 代码演示

### 基础用法 {#demo-basic}

确认后回填 `YYYY-MM-DD` 展示；`clearable` 默认 `true`，有值时显示清空按钮（触发 `clear` 事件）。

```vue
<m-calendar-input v-model:value="value" @confirm="onConfirm" @clear="onClear" />
```

### 范围与多选 {#demo-type}

`type` 设为 `range` 展示「起 ~ 止」区间；设为 `multiple` 顿号串展示。`max-range=3` 超限拒绝选择并 toast。

```vue
<m-calendar-input
	v-model:value="rangeValue"
	type="range"
	placeholder="请选择入住 / 离店日期"
	@confirm="onConfirm"
/>
<m-calendar-input
	v-model:value="multiValue"
	type="multiple"
	:max-range="3"
	placeholder="请选择多个日期（最多 3 天）"
	@confirm="onConfirm"
/>
```

### 限定范围与主题色 {#demo-limit}

`min-date` / `max-date` 限定可选区间（界外置灰不可选）；`color` 派生选中圆与范围 bar 主题色。

```vue
<m-calendar-input
	v-model:value="value"
	type="range"
	:min-date="minDate"
	:max-date="maxDate"
	color="#07c160"
/>
```

### 禁用与形态 {#demo-state}

`disabled` 禁用（触发层不渲染，不可打开弹层）；`clearable=false` 隐藏清空按钮；`border=false` 无边框嵌入形态（透传 m-input，可与单元格组合）。

```vue
<m-calendar-input v-model:value="value" disabled />
<m-calendar-input v-model:value="value" :clearable="false" />
<m-calendar-input v-model:value="value" :border="false" />
```

### 弹层形态 {#demo-shape}

`title` 自定义弹层标题；`popup-height` / `position` / `round` 透传弹层容器（同 [CalendarPopup](/components/calendar-popup#demo-shape)）。

```vue
<m-calendar-input
	v-model:value="value"
	title="选择入住日期"
	popup-height="70%"
	position="center"
	:round="false"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model:value | 选中值（single 为 Date，multiple / range 为 Date[]，null 未选） | Date \| Date[] \| null | `null` |
| type | 选择类型，可选值 `single` `multiple` `range` | CalendarType | `single` |
| placeholder | 占位符 | string | `请选择日期` |
| disabled | 是否禁用（触发层不渲染，不可打开弹层） | boolean | `false` |
| clearable | 是否显示清空按钮（有值且非 disabled 时可见） | boolean | `true` |
| border | 触发器是否显示边框容器（透传 m-input） | boolean | `true` |
| inlaid | 触发器嵌入式形态（透传 m-input） | boolean | `false` |
| title | 弹层常规标题 | string | `日期选择` |
| color | 主题色（选中圆点与范围 bar 派生色，支持 `#hex` 与渐变） | string | - |
| min-date | 最小日期 | Date \| null | `null`（今天） |
| max-date | 最大日期 | Date \| null | `null`（今天 + 6 个月） |
| max-range | 范围 / 多选最多可选天数（含两端计数；`-1` 不限制） | number | `-1` |
| allow-same-day | 范围选择是否允许起止同日 | boolean | `false` |
| popup-height | 弹层面板高度（px 原样；`%` 按窗口高换算为 px） | string | `80%` |
| position | 弹出方位（透传 m-popup） | CalendarPosition | `bottom` |
| round | 弹层圆角（透传 m-popup） | boolean | `true` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写选中值（v-model 绑定）；点击清空按钮回写 `null` | value: Date \| Date[] \| null |
| confirm | 弹层确认（按钮 / 自动确认）后触发 | value: Date \| Date[] |
| clear | 点击清空按钮后触发 | - |

### 展示格式

| type | 展示 | 示例 |
| --- | --- | --- |
| single | 单值 `YYYY-MM-DD` | `2026-10-29` |
| range | `起 ~ 止`（仅起点时展示起点） | `2026-10-15 ~ 2026-10-18` |
| multiple | 顿号串 | `2026-10-15、2026-10-18` |

## 使用须知

- **触发层实现**：m-input 的 readonly 以原生 disabled 模拟（原生 disabled 控件吞点击事件），组件以透明覆盖层接住整区点击打开弹层；`disabled` 态不渲染触发层
- **清空按钮**：m-input 内置 clearable 的图标位于触发层之下会被挡住，清空为组件自绘按钮
- **z-index 层叠**：触发层（1）< 清空钮（2）< 弹层遮罩（3，组件内部固定传 `:z-index="3"`），保证弹层打开时遮罩盖住自身浮层；外部放大 `z-index` 时注意同步检查

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-calendar-input-trigger-z-index | 透明触发层层级 | 1 |
| $m-calendar-input-clear-z-index | 清空按钮层级 | 2 |
| $m-calendar-input-clear-width | 清空按钮定宽 | 40px |
| $m-calendar-input-clear-icon-size | 清空图标尺寸 | 16px |
| $m-calendar-input-clear-color | 清空图标颜色 | #c8c9cc |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- 组件拆分：Vant 无日历输入框组合组件（弹层日历需自行配合 Field 组装回填逻辑），本项目内置「触发器 + 弹层 + 回填 + 清空」全链路
- 占位符与展示：`placeholder` 在未选值时展示；展示文本随 `type` 派生（见[展示格式](#展示格式)），与 Vant Field 手动拼文案不同
- 日期 prop 仅接受 `Date` 实例：`min-date` / `max-date` / `value` 需用数值形式构造（`new Date(2026, 9, 29)`，月份 0 基），不支持字符串日期形态
- 只读触发器为覆盖层实现（原生 readonly 不可用于触发弹层），`border` / `inlaid` 等触发器形态经 m-input 透传
