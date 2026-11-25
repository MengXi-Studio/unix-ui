---
title: SelectPopup
subtitle: 列表选择弹层
demo: pages-sub/pickers/select-popup/select-popup
added: 0.7.0
---

## 介绍

列表选择弹层，由 [Popup](/components/popup) 与 [Select](/components/select) 组合而成：弹层行为归 `m-popup`，列表选择归面板，本组件仅做组合与转发。顶部可选标题，选中后按 `confirm-on-select`（默认 `true`）自动关闭弹层。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:show` 控制显隐、`v-model:value` 绑定选中值，`title` 渲染顶部标题：

```vue
<m-select-popup v-model:show="show" v-model:value="value" :options="options" title="选择产线" />
```

```uts
const show = ref<boolean>(false)
const value = ref<string | number>('line-2')
const options = ref<UTSJSONObject[]>([
	{ label: '机加工一线', value: 'line-1' },
	{ label: '注塑二线', value: 'line-2' },
	{ label: '压铸四线', value: 'line-4' }
] as UTSJSONObject[])
```

### 多选 {#demo-multiple}

`multiple` 开启多选，`show-toolbar` 显示工具栏；多选下弹层不会自动关闭，可通过点击遮罩或 `bottom` 插槽内的按钮关闭：

```vue
<m-select-popup v-model:show="show" v-model:value="value" :options="options" title="选择产线" multiple show-toolbar>
	<template #bottom>
		<view class="footer-btn" @click="show = false"><text>完成</text></view>
	</template>
</m-select-popup>
```

```uts
const show = ref<boolean>(false)
const value = ref<string | number | string[] | number[]>([] as string[])
```

### 标题与筛选 {#demo-filter}

`filterable` 在弹层内显示筛选框，筛选行为与 [Select](/components/select) 一致：

```vue
<m-select-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	title="选择产线"
	filterable
	filter-placeholder="输入关键字"
/>
```

### 选中不关闭 {#demo-keep-open}

`confirm-on-select` 设为 `false` 后，选中选项不关闭弹层，便于连续操作：

```vue
<m-select-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	title="连续选择"
	:confirm-on-select="false"
/>
```

### 自定义选项 {#demo-slot}

`option` 插槽透传到内部面板，作用域为 `{ option, index, selected, disabled }`：

```vue
<m-select-popup v-model:show="show" v-model:value="value" :options="colorOptions" title="选择颜色">
	<template #option="{ option, selected }">
		<view class="color-item">
			<view class="color-item__block" :style="'background-color: ' + option.getString('value')! + ';'"></view>
			<text>{{ option.getString('label') }}</text>
		</view>
	</template>
</m-select-popup>
```

### 底部插槽 {#demo-bottom-slot}

`bottom` 插槽位于列表底部，可放加载更多或说明文案：

```vue
<m-select-popup v-model:show="show" v-model:value="value" :options="options" title="带底部操作">
	<template #bottom>
		<view class="bottom-tip"><text>底部插槽：可放加载更多 / 说明文案</text></view>
	</template>
</m-select-popup>
```

### 弹层生命周期 {#demo-lifecycle}

`open` / `opened` / `close` / `closed` 逐项透传 `m-popup` 的生命周期事件：

```vue
<m-select-popup
	v-model:show="show"
	:options="options"
	@open="onOpen"
	@opened="onOpened"
	@close="onClose"
	@closed="onClosed"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹层（`v-model:show`） | boolean | `false` |
| title | 顶部标题（空串不展示） | string | `''` |
| value | 当前选中值（`v-model:value`；`multiple` 时为数组） | string \| number \| string[] \| number[] | `''` |
| multiple | 是否多选 | boolean | `false` |
| multiple-limit | 多选最大可选个数（`0` 不限） | number | `0` |
| show-toolbar | 多选时是否显示工具栏（已选数量 + 清空） | boolean | `false` |
| options | 选项数组；含 `children` 的项视为分组 | UTSJSONObject[] | `[]` |
| field-names | 字段映射（label / value / disabled / children） | UTSJSONObject \| null | `null` |
| filterable | 是否显示筛选框 | boolean | `false` |
| filter-placeholder | 筛选框占位文案 | string | `请输入关键词` |
| filter-value | 筛选值（`v-model:filter-value`） | string | `''` |
| filter-method | 远程筛选回调；存在时关闭本地过滤 | (query: string) => void | - |
| disabled | 是否禁用列表 | boolean | `false` |
| empty-text | 空列表文案 | string | `暂无选项` |
| confirm-on-select | 选中后是否自动关闭弹层 | boolean | `true` |
| position | 弹出方位，可选 `top` `bottom` `left` `right` `center` | string | `bottom` |
| round | 是否显示圆角 | boolean | `true` |
| close-on-click-overlay | 点击遮罩是否关闭 | boolean | `true` |
| safe-area-inset-top | 顶部安全区 | boolean | `false` |
| safe-area-inset-bottom | 底部安全区 | boolean | `true` |
| z-index | 弹层层级 | number | `100` |
| duration | 动画时长（秒） | number | `0.3` |
| custom-class / custom-style | 作用于内部列表根节点 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐变化（`v-model:show`） | show: boolean |
| update:value | 选中值变化（`v-model:value`；多选时为数组） | value: string \| number \| string[] \| number[] |
| change | 选中值变化（多选时为数组；单选按 `confirm-on-select` 关闭） | value: string \| number \| string[] \| number[] |
| select | 点击选项时触发（回传原始选项对象） | option: UTSJSONObject |
| update:filterValue | 筛选值变化（`v-model:filter-value`） | query: string |
| open / opened | 弹层打开中 / 打开完成 | - |
| close / closed | 弹层关闭中 / 关闭完成 | - |
| click-overlay | 点击遮罩 | - |

### Methods

| 方法名 | 说明 |
| --- | --- |
| scrollTop | 列表滚动回顶部（转发内部 Select） |

### Slots

| 名称 | 作用域 | 说明 |
| --- | --- | --- |
| option | `{ option, index, selected, disabled }` | 自定义选项内容；`option` 为原始选项对象（UTSJSONObject） |
| bottom | - | 列表底部内容（远程加载更多 / 说明文案） |

## 主题定制

弹层遮罩、圆角与动效由 [Popup](/components/popup) 主题变量控制；列表外观由 [Select 主题定制](/components/select) 控制。顶部标题相关变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-select-header-padding | 标题内边距 | 14px 12px 8px 12px |
| $m-select-header-font-size | 标题字号 | 16px |
| $m-select-header-color | 标题颜色 | $m-text-color |
| $m-select-bg | 弹层内容背景色 | $m-white |
| $m-select-toolbar-padding | 多选工具栏内边距 | 8px 12px |
| $m-select-toolbar-font-size | 多选工具栏字号 | 12px |
| $m-select-toolbar-text-color | 多选工具栏文字色 | $m-text-color-tertiary |
| $m-select-toolbar-clear-color | 多选工具栏清空按钮色 | $m-color-primary |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Sard 的差异

- **显隐绑定**：Sard 为 `v-model:visible`；本项目统一 `v-model:show`
- **选中值绑定**：Sard 为 `v-model`；本项目统一 `v-model:value`
- **选择模式**：支持单选与多选（`multiple` + `multiple-limit`）；多选工具栏为固定的「已选 N 项 + 清空」，不提供 Sard 的可配置工具栏
- **选项声明**：Sard 用 `SelectOption` / `SelectOptionGroup` 子组件；本项目为对象数组，含 `children` 的项即分组
- **自定义内容**：用 `option` 作用域插槽替代 Sard 的 `SelectOption` 默认插槽与 `label` 插槽
- **值类型**：元素仅支持 `string | number`，多选时为对应数组，不提供 `any`

## 注意事项

- 单选选中后默认自动关闭（`confirm-on-select: true`）；多选下无论 `confirm-on-select` 如何都不会自动关闭，请在 `bottom` 插槽放「完成」按钮或依赖点击遮罩关闭
- 单选点击当前已选项不派发 `change`；多选点击已选项会取消选中并派发新数组
- 传入 `filter-method` 时不执行本地过滤，仅回传查询值，远程数据请自行写回 `options`
- `custom-class` / `custom-style` 作用于内部列表根节点，而非弹层容器；弹层外观请用 `position` / `round` 等 props 调整
- 弹层层级默认 `100`，可与页面内其他浮层配合调整 `z-index`

更多案例见 [Select](/components/select) 与 [SelectInput](/components/select-input)。
