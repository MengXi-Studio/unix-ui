---
title: CascaderInput
subtitle: 级联输入框
demo: pages-sub/cascader/cascader
added: 0.3.0
---

## 介绍

级联输入框组件，基于 [Input](/components/input)（只读触发器）与 [CascaderPopup](/components/cascader-popup)（级联弹出框）组合实现：点击触发器整区打开弹层，选完最后一级后经 `v-model:value` 回写叶子值并展示；有值时展示自绘清空按钮。

值单向受控：外部 `value` 同步弹层级联面板的选中态，`finish` 后经 `update:value` 回写。展示文本由 `value` 在选项树中查找路径派生（各级文字以「/」连接，如「浙江省/杭州市/西湖区」；未找到时回退 value 字符串）。弹层未确认的选择不回写。

## 代码演示

### 基础用法 {#demo-basic}

选中后按「省/市/区」路径文字回显；`clearable` 默认 `true`，有值时显示清空按钮（触发 `clear` 事件）：

```vue
<m-cascader-input
	v-model:value="value"
	title="请选择所在地区"
	:options="options"
	placeholder="请选择地区"
	@finish="onFinish"
	@clear="onClear"
/>
```

### 禁用与形态 {#demo-state}

`disabled` 禁用（触发层不渲染，不可打开弹层）；`clearable=false` 隐藏清空按钮；`border=false` 无边框嵌入形态（透传 m-input，可与单元格组合）：

```vue
<m-cascader-input v-model:value="value" disabled />
<m-cascader-input v-model:value="value" :clearable="false" />
<m-cascader-input v-model:value="value" :border="false" />
```

### 弹层形态与主题色 {#demo-shape}

`title` 自定义弹层标题；`position` / `round` 透传弹层容器（同 [CascaderPopup](/components/cascader-popup#demo-shape)）；`active-color` 派生选中项主题色；`field-names` / `options-height` / `swipeable` 全量透传级联面板。

```vue
<m-cascader-input
	v-model:value="value"
	:options="options"
	title="请选择所在地区"
	active-color="#07c160"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中值（`v-model:value`；叶子 value，`null` 未选） | CascaderValue \| null | `null` |
| options | 级联选项树（动态类型） | UTSJSONObject[] \| null | `null` |
| placeholder | 占位符 | string | `请选择` |
| disabled | 是否禁用 | boolean | `false` |
| clearable | 是否显示清空按钮（有值且非 disabled 时可见） | boolean | `true` |
| border | 触发器是否显示边框容器（透传 m-input） | boolean | `true` |
| inlaid | 触发器嵌入式形态（透传 m-input） | boolean | `false` |
| title | 弹层常规标题 | string | `''` |
| active-color | 主题色（选中项文字 / 对勾 / tab 下划线） | string | `''` |
| field-names | 自定义选项字段名 | CascaderFieldNames \| null | `null` |
| options-height | 选项区高度 px（`0` 用主题变量） | number | `0` |
| swipeable | 是否支持手势滑动切换层级 | boolean | `true` |
| position | 弹出方位（透传 m-popup） | CascaderPopupPosition | `bottom` |
| round | 弹层圆角（透传 m-popup） | boolean | `true` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选完最后一级回写叶子值；点击清空回写 `null` | value: CascaderValue \| null |
| change | 点击选项后触发（透传弹层级联面板） | event: CascaderChangeEvent |
| finish | 选完最后一级后触发（弹层同步自动关闭） | event: CascaderChangeEvent |
| clear | 点击清空按钮后触发 | - |

## 主题定制

输入框触发层与清空按钮的层叠 / 尺寸变量（与 m-calendar-input 同构）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-cascader-input-trigger-z-index | 透明触发层层级 | 1 |
| $m-cascader-input-clear-z-index | 清空按钮层叠（高于触发层） | 2 |
| $m-cascader-input-clear-width | 清空按钮点击区宽度 | 40px |
| $m-cascader-input-clear-icon-size | 清空图标字号 | 16px |
| $m-cascader-input-clear-color | 清空图标颜色 | #c8c9cc |

弹层面板样式变量见 [Cascader 主题定制](/components/cascader#主题定制)。

## 与 Vant 的差异

- Vant 无独立 CascaderInput 组件（Field + Cascader 弹层组合由业务拼装），本项目对齐组件族先例（m-calendar-input）封装为开箱组件
- 展示文本为各级文字「/」连接（Vant Field 展示文案由业务自行拼装）；value 在选项树中找不到路径时回退展示 value 字符串（覆盖异步加载前回显的场景）
- 清空按钮为自绘实现（m-input 内置 clearable 的图标位于透明触发层之下会被挡住），触发 `clear` 事件并回写 `null`
