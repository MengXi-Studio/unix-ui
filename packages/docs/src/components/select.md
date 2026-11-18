---
title: Select
subtitle: 列表选择
demo: pages-sub/select/select
added: 0.7.0
---

## 介绍

列表选择面板，用于在选项列表中单选。`options` 驱动渲染：含 `children` 的项渲染为分组标题，子项可选；选中值受控（`v-model:value`），选中项以主色文字 + 右侧勾选图标标记。支持本地 / 远程筛选、整体与单项禁用、空态文案、自定义选项插槽与列表回顶方法。

本组件为纯平铺面板：弹出层形态由 [SelectPopup](/components/select-popup) 组合实现，表单触发场景由 [SelectInput](/components/select-input) 组合实现。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定选中值，`options` 定义选项（`label` / `value`）：

```vue
<m-select v-model:value="value" :options="options" />
```

```uts
const value = ref<string | number>('line-2')
const options = ref<UTSJSONObject[]>([
	{ label: '机加工一线', value: 'line-1' },
	{ label: '注塑二线', value: 'line-2' },
	{ label: '压铸四线', value: 'line-4' }
] as UTSJSONObject[])
```

### 多选 {#demo-multiple}

设置 `multiple` 开启多选，`show-toolbar` 显示工具栏（已选 N 项 + 清空）；开启后 `value` 为数组，点击已选项取消选中，达到 `multiple-limit` 上限后点击不再生效：

```vue
<m-select v-model:value="value" :options="options" multiple show-toolbar :multiple-limit="2" />
```

```uts
const value = ref<string | number | string[] | number[]>([] as string[])
```

### 选项分组 {#demo-group}

`options` 中含 `children` 的项视为分组：该项的 `label` 渲染为分组标题，`children` 中的子项可选；分组标题本身不参与选中：

```vue
<m-select v-model:value="value" :options="groupOptions" />
```

```uts
const groupOptions = ref<UTSJSONObject[]>([
	{
		label: '华东厂区',
		children: [
			{ label: '机加工一线', value: 'e-1' },
			{ label: '注塑二线', value: 'e-2' }
		] as UTSJSONObject[]
	},
	{
		label: '华南厂区',
		children: [
			{ label: '压铸四线', value: 's-4' },
			{ label: '包装五线', value: 's-5' }
		] as UTSJSONObject[]
	}
] as UTSJSONObject[])
```

### 自定义字段名 {#demo-field-names}

`field-names` 可映射 `label` / `value` / `disabled` / `children`，未指定的键按同名兜底：

```vue
<m-select v-model:value="value" :options="options" :field-names="fieldNames" />
```

```uts
const fieldNames = ref<UTSJSONObject>({ label: 'text', value: 'code', children: 'items' })
```

### 筛选 {#demo-filter}

`filterable` 显示筛选框，本地按 `label` 包含匹配（大小写不敏感），分组保留有命中子项的分组：

```vue
<m-select v-model:value="value" :options="options" filterable filter-placeholder="输入产线名称筛选" />
```

### 远程筛选 {#demo-remote-filter}

传入 `filter-method` 后关闭本地过滤，仅回传查询值；配合 `v-model:filter-value` 可受控筛选：

```vue
<m-select
	v-model:value="value"
	v-model:filter-value="query"
	:options="options"
	filterable
	:filter-method="onFilter"
/>
```

```uts
const query = ref<string>('')
const onFilter = (q: string) => {
	// 请求远程数据后写回 options
}
```

### 禁用 {#demo-disabled}

组件级 `disabled` 灰显全部选项；选项内的 `disabled` 字段仅禁用该项：

```vue
<m-select v-model:value="value" :options="options" disabled />
<m-select v-model:value="value" :options="partialOptions" />
```

### 自定义选项 {#demo-slot}

`option` 插槽可自定义整项内容，作用域为 `{ option, index, selected, disabled }`（`option` 为原始选项对象）：

```vue
<m-select v-model:value="value" :options="colorOptions">
	<template #option="{ option, selected }">
		<view class="color-item">
			<view class="color-item__block" :style="'background-color: ' + option.getString('value')! + ';'"></view>
			<text>{{ option.getString('label') }}</text>
		</view>
	</template>
</m-select>
```

### 长列表与回到顶部 {#demo-scroll}

列表超出主题变量 `$m-select-max-height` 后内部滚动，通过实例方法 `scrollTop()` 回到顶部：

```vue
<m-select ref="selectRef" v-model:value="value" :options="longOptions" />
```

```uts
const selectRef = ref<ComponentPublicInstance | null>(null)
const backToTop = () => {
	const inst = selectRef.value
	if (inst != null) inst.$callMethod('scrollTop')
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中值（`v-model:value`；`multiple` 时为数组） | string \| number \| string[] \| number[] | `''` |
| multiple | 是否多选 | boolean | `false` |
| multiple-limit | 多选最大可选个数（`0` 不限） | number | `0` |
| show-toolbar | 多选时是否显示工具栏（已选数量 + 清空） | boolean | `false` |
| options | 选项数组；含 `children` 的项视为分组 | UTSJSONObject[] | `[]` |
| field-names | 字段映射（label / value / disabled / children） | UTSJSONObject \| null | `null` |
| filterable | 是否显示筛选框 | boolean | `false` |
| filter-placeholder | 筛选框占位文案 | string | `请输入关键词` |
| filter-value | 筛选值（`v-model:filter-value`） | string | `''` |
| filter-method | 远程筛选回调；存在时关闭本地过滤 | (query: string) => void \| null | `null` |
| disabled | 是否禁用整个面板 | boolean | `false` |
| empty-text | 空列表文案 | string | `暂无选项` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中值变化（`v-model:value`；多选时为数组） | value: string \| number \| string[] \| number[] |
| change | 选中值变化（多选时为数组） | value: string \| number \| string[] \| number[] |
| select | 点击选项时触发（回传原始选项对象） | option: UTSJSONObject |
| update:filterValue | 筛选值变化（`v-model:filter-value`） | query: string |

### Methods

| 方法名 | 说明 |
| --- | --- |
| scrollTop | 列表滚动回顶部 |

### Slots

| 名称 | 作用域 | 说明 |
| --- | --- | --- |
| option | `{ option, index, selected, disabled }` | 自定义选项内容；`option` 为原始选项对象（UTSJSONObject） |
| bottom | - | 列表底部内容（远程加载更多 / 说明文案） |

## 主题定制

在项目根 `uni.scss` 中直接定义以下变量即可覆盖默认值：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-select-max-height | 面板最大高度 | 320px |
| $m-select-bg | 面板背景色 | $m-white |
| $m-select-filter-padding | 筛选区内边距 | 8px 12px |
| $m-select-toolbar-padding | 多选工具栏内边距 | 8px 12px |
| $m-select-toolbar-font-size | 多选工具栏字号 | 12px |
| $m-select-toolbar-text-color | 多选工具栏文字色 | $m-text-color-tertiary |
| $m-select-toolbar-clear-color | 多选工具栏清空按钮色 | $m-color-primary |
| $m-select-option-min-height | 选项最小高度 | 44px |
| $m-select-option-padding | 选项内边距 | 0 12px |
| $m-select-option-color | 选项文字色 | $m-text-color |
| $m-select-option-color-selected | 选中项文字色 | $m-color-primary |
| $m-select-option-color-disabled | 禁用项文字色 | $m-text-color-fourth |
| $m-select-option-font-size | 选项文字字号 | 14px |
| $m-select-check-color | 勾选图标颜色 | $m-color-primary |
| $m-select-check-size | 勾选图标字号 | 16px |
| $m-select-group-label-padding | 分组标题内边距 | 8px 12px |
| $m-select-group-label-font-size | 分组标题字号 | 12px |
| $m-select-group-label-color | 分组标题颜色 | $m-text-color-tertiary |
| $m-select-group-label-bg | 分组标题背景色 | #f2f3f5 |
| $m-select-empty-padding | 空态内边距 | 32px 0 |
| $m-select-empty-color | 空态文字色 | $m-text-color-fourth |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Sard 的差异

- **绑定语法**：Sard 为 `v-model`；本项目统一 `v-model:value`
- **选择模式**：支持单选与多选（`multiple` + `multiple-limit`）；多选工具栏为固定的「已选 N 项 + 清空」，不提供 Sard 的可配置工具栏
- **选项声明**：Sard 用 `SelectOption` / `SelectOptionGroup` 子组件；本项目为对象数组，含 `children` 的项即分组
- **自定义内容**：用 `option` 作用域插槽替代 Sard 的 `SelectOption` 默认插槽与 `label` 插槽两级定制
- **值类型**：元素仅支持 `string | number`，多选时为对应数组，不提供 `any`

## 注意事项

- 组件为受控组件，不持内部值；单选点击当前已选项不派发任何事件，多选点击已选项会取消选中并派发新数组
- 多选达到 `multiple-limit` 后点击未选项不再生效；`multiple-limit` 为 0 表示不限
- 传入 `filter-method` 时不执行本地过滤，仅派发 `update:filter-value` 并调用该回调，远程数据请自行写回 `options`
- 分组标题（含 `children` 的项）不可选中；筛选时仅保留有命中子项的分组
- 组件级 `disabled` 优先于选项级 `disabled`，两者均阻止点击派发
- 长列表防止误操作时可在数据更新后调用 `scrollTop()` 复位

更多案例见 [SelectPopup](/components/select-popup) 与 [SelectInput](/components/select-input)。
