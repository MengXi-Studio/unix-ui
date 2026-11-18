---
title: SelectInput
subtitle: 列表选择输入框
demo: pages-sub/select-input/select-input
added: 0.7.0
---

## 介绍

列表选择输入框，由 [Input](/components/input)（只读展示当前值标签）与 [SelectPopup](/components/select-popup) 组合而成：点击整区打开弹层，选中后经 `v-model:value` 回写；`clearable` 提供清空按钮。展示标签按「`options` 递归查找 → `map-label` → 值字符串」顺序解析，便于远程数据场景兜底。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-select-input v-model:value="value" :options="options" title="选择产线" placeholder="请选择产线" />
```

```uts
const value = ref<string | number>('line-2')
const options = ref<UTSJSONObject[]>([
	{ label: '机加工一线', value: 'line-1' },
	{ label: '注塑二线', value: 'line-2' },
	{ label: '压铸四线', value: 'line-4' }
] as UTSJSONObject[])
```

### 清空 {#demo-clearable}

`clearable` 默认为 `true`，有值时显示清空按钮，点击后回写空串并触发 `change`；设为 `false` 隐藏按钮：

```vue
<m-select-input v-model:value="value" :options="options" />
<m-select-input v-model:value="value" :options="options" :clearable="false" />
```

### 只读与禁用 {#demo-disabled}

`readonly` 保留展示但不响应点击与清空；`disabled` 灰显且不可打开：

```vue
<m-select-input v-model:value="value" :options="options" readonly />
<m-select-input v-model:value="value" :options="options" disabled />
```

### 标签映射 {#demo-map-label}

远程场景下当前值可能不在 `options` 中，可用 `map-label` 以「值 → 展示文案」兜底：

```vue
<m-select-input v-model:value="value" :options="options" :map-label="mapLabel" />
```

```uts
const mapLabel = ref<UTSJSONObject>({ 'line-9': '远程产线九' })
```

### 筛选 {#demo-filter}

`filterable` 在弹层内显示筛选框，`filter-method` 时关闭本地过滤：

```vue
<m-select-input
	v-model:value="value"
	:options="options"
	title="选择产线"
	filterable
	filter-placeholder="输入关键字"
/>
```

### 受控显隐与方位 {#demo-show-position}

通过 `v-model:show` 受控弹层显隐，`position` 指定弹出方位：

```vue
<m-select-input v-model:value="value" v-model:show="show" :options="options" position="center" />
```

```uts
const show = ref<boolean>(false)
```

### 自定义选项 {#demo-slot}

`option` / `bottom` 插槽透传到内部面板：

```vue
<m-select-input v-model:value="value" :options="options" title="选择颜色">
	<template #option="{ option, selected }">
		<view class="color-item">
			<view class="color-item__block" :style="'background-color: ' + option.getString('value')! + ';'"></view>
			<text>{{ option.getString('label') }}</text>
		</view>
	</template>
</m-select-input>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值（`v-model:value`） | string \| number | `''` |
| options | 选项数组；含 `children` 的项视为分组 | UTSJSONObject[] | `[]` |
| field-names | 字段映射（label / value / disabled / children） | UTSJSONObject \| null | `null` |
| placeholder | 占位文案 | string | `请选择` |
| title | 弹层标题 | string | `''` |
| clearable | 是否显示清空按钮 | boolean | `true` |
| disabled | 是否禁用（灰显且不可打开） | boolean | `false` |
| readonly | 是否只读（保留展示，不响应点击与清空） | boolean | `false` |
| filterable | 是否显示筛选框 | boolean | `false` |
| filter-placeholder | 筛选框占位文案 | string | `请输入关键词` |
| filter-value | 筛选值（`v-model:filter-value`） | string | `''` |
| filter-method | 远程筛选回调；存在时关闭本地过滤 | (query: string) => void \| null | `null` |
| empty-text | 空列表文案 | string | `暂无选项` |
| confirm-on-select | 选中后是否自动关闭弹层 | boolean | `true` |
| map-label | 标签映射表（`值 → 文案`，远程场景兜底） | UTSJSONObject \| null | `null` |
| input-align | 输入文字对齐，可选 `left` `center` `right` | string | `left` |
| show | 是否显示弹层（`v-model:show`） | boolean | `false` |
| position | 弹出方位，可选 `top` `bottom` `left` `right` `center` | string | `bottom` |
| round | 弹层圆角 | boolean | `true` |
| close-on-click-overlay | 点击遮罩是否关闭 | boolean | `true` |
| safe-area-inset-top | 顶部安全区 | boolean | `false` |
| safe-area-inset-bottom | 底部安全区 | boolean | `true` |
| duration | 动画时长（秒） | number | `0.3` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 值变化（`v-model:value`；清空时为空串） | value: string \| number |
| change | 值变化（清空时同样触发） | value: string \| number |
| select | 选中项变化（回传原始选项对象） | option: UTSJSONObject |
| update:filterValue | 筛选值变化（`v-model:filter-value`） | query: string |
| update:show | 弹层显隐变化（`v-model:show`） | show: boolean |

### Slots

| 名称 | 作用域 | 说明 |
| --- | --- | --- |
| option | `{ option, index, selected, disabled }` | 自定义选项内容；`option` 为原始选项对象（UTSJSONObject） |
| bottom | - | 列表底部内容（远程加载更多 / 说明文案） |

## 主题定制

输入框外观由 [Input](/components/input) 主题变量控制；列表与标题由 [SelectPopup 主题定制](/components/select-popup) 控制。清空按钮相关变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-select-input-clear-right | 清空按钮右侧偏移 | 12px |
| $m-select-input-clear-size | 清空图标字号 | 16px |
| $m-select-input-clear-color | 清空图标颜色 | $m-text-color-fourth |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Sard 的差异

- **绑定语法**：Sard 为 `v-model`；本项目统一 `v-model:value`
- **选择模式**：首版仅支持单选，多选与多标签展示列入后续规划
- **选项声明**：Sard 用选项子组件；本项目为对象数组，含 `children` 的项即分组
- **自定义内容**：用 `option` 作用域插槽替代 Sard 的 `SelectOption` 默认插槽与 `label` 插槽
- **值类型**：仅支持 `string | number`，不提供 `any`
- **清空按钮**：为组件自绘按钮（`m-input` 只读态的清除图标不可用），非 Sard 的 `clearable` 内置实现

## 注意事项

- 点击当前已选项不派发任何事件，弹层也不会自动关闭（无 `change` 可触发关闭）
- 传入 `filter-method` 时不执行本地过滤，仅回传查询值，远程数据请自行写回 `options`
- 展示标签依次取 `options`（含一层 `children`）命中项、`map-label` 中 `value.toString()` 对应文案，最后回退为值的字符串形式
- 清空按钮为自绘按钮，`readonly` / `disabled` 或无值时隐藏；`readonly` 下整区点击也不会打开弹层
- 内部弹层层级固定为 `3`（需覆盖输入框上的触发层与清空按钮），不提供 `z-index` prop

更多案例见 [Select](/components/select) 与 [SelectPopup](/components/select-popup)。
