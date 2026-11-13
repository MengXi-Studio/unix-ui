---
title: Cascader
subtitle: 级联选择
demo: pages-sub/cascader/cascader
added: 0.3.0
---

## 介绍

级联选择组件，用于多级联动选择（如省市区、商品分类）。顶部 tab 展示各级已选标题（未选层显示 placeholder），点击选项进入下一级，选到最后一级（children 缺失或为空数组）触发 `finish`；层级经 swiper 承载，支持手势滑动换层。

本组件为纯平铺面板：弹出层形态由 [CascaderPopup](/components/cascader-popup) 组合实现，表单触发场景由 [CascaderInput](/components/cascader-input) 组合实现。

选项树为动态类型 `UTSJSONObject[]`（支持 `field-names` 字段名映射与异步加载），演示与文档示例统一用 `JSON.parse<UTSJSONObject[]>` 构造：

```ts
const options: UTSJSONObject[] = JSON.parse<UTSJSONObject[]>(`[
	{ "text": "浙江省", "value": "330000", "children": [
		{ "text": "杭州市", "value": "330100", "children": [
			{ "text": "西湖区", "value": "330106" }
		]}
	]}
]`) ?? []
```

## 代码演示

### 基础用法 {#demo-basic}

`v-model:value` 绑定选中的叶子 value（`string | number`），点击选项触发 `change`（含未选完的中间层），选完最后一级触发 `finish`：

```vue
<m-cascader
	v-model:value="value"
	title="请选择所在地区"
	:options="options"
	@change="onChange"
	@finish="onFinish"
/>
```

### 数字 value {#demo-number}

选项 value 支持 number 类型：内部按字符串归一化匹配路径，事件 payload 保留原值。

```vue
<m-cascader :options="numberOptions" :show-header="false" @finish="onFinish" />
```

### 自定义主题色与选项区高度 {#demo-color}

`active-color` 覆盖选中项文字 / 对勾 / tab 下划线主题色；`options-height`（px）覆盖选项区高度（`0` 时使用主题变量 `$m-cascader-options-height`，默认 384）：

```vue
<m-cascader :options="options" :options-height="200" active-color="#07c160" />
```

### 关闭手势滑动 {#demo-swipeable}

`swipeable` 设为 `false` 关闭手势滑动换层，仅可点击 tab 或选项切换层级；`placeholder` 自定义未选层 tab 文案：

```vue
<m-cascader :options="options" :swipeable="false" placeholder="请选择城市" />
```

### 异步加载 {#demo-async}

组件消费 `options` 的响应式引用：在 `change` 回调中修改对应选项的 `children`（模拟请求后填充），新层级自动渲染。children 为空数组视为叶子直接 `finish`（业务加载态请自行用 [Loading](/components/loading) / [Toast](/components/toast) 提示）：

```ts
const onChange = (event: CascaderChangeEvent) => {
	if (event.tabIndex != 0) return
	const province = event.selectedOptions[0]
	if (province.getArray('children') != null) return
	setTimeout(() => {
		province.set('children', loadedChildren) // 模拟请求填充
	}, 600)
}
```

### 自定义字段名 {#demo-field-names}

`field-names` 映射选项树的字段名；`disabled` / `color` 字段仍为固定键名：

```ts
const nameFields: CascaderFieldNames = {
	text: 'name',
	value: 'id',
	children: 'sub'
}
```

```vue
<m-cascader :options="options" :field-names="nameFields" />
```

### 插槽 {#demo-slots}

`title` / `option` / `options-top` / `options-bottom` 四插槽；`option` 插槽作用域 `{ option, selected }`：

```vue
<m-cascader :options="options">
	<template #title>
		<text>选择品类</text>
	</template>
	<template #options-top>
		<text>每周三 10 点更新库存</text>
	</template>
	<template #option="{ option, selected }">
		<text>{{ option.getString('text') }}</text>
	</template>
	<template #options-bottom>
		<text>底部扩展区</text>
	</template>
</m-cascader>
```

## API

### CascaderProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中值（`v-model:value`；叶子 value，`null` 未选） | CascaderValue \| null | `null` |
| options | 级联选项树（动态类型） | UTSJSONObject[] \| null | `null` |
| title | 常规标题 | string | `''` |
| placeholder | 未选层 tab 占位文案 | string | `请选择` |
| active-color | 主题色（选中项文字 / 对勾 / tab 下划线） | string | `''` |
| closeable | 是否显示头部关闭图标 | boolean | `true` |
| close-icon | 关闭图标名称 | IconName | `cross` |
| show-header | 是否显示头部 | boolean | `true` |
| field-names | 自定义选项字段名（`null` 用默认 text / value / children） | CascaderFieldNames \| null | `null` |
| options-height | 选项区高度 px（`0` 用主题变量） | number | `0` |
| swipeable | 是否支持手势滑动切换层级 | boolean | `true` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### CascaderFieldNames

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 选项文字字段名 | string | `text` |
| value | 选项值字段名 | string | `value` |
| children | 子级选项字段名 | string | `children` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中值变化（`v-model:value`；change 与 finish 时均回写） | value: CascaderValue |
| change | 点击选项后触发（含未选完的中间层） | event: CascaderChangeEvent |
| finish | 选完最后一级后触发（children 缺失或为空数组即叶子） | event: CascaderChangeEvent |
| close | 点击关闭图标 | - |
| click-tab | 点击 tab（滑动手势不触发） | tabIndex: number, title: string |

### CascaderChangeEvent

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| value | 本次点击选项的值（原值） | CascaderValue |
| selectedOptions | 已选层级完整路径（各级选项对象） | UTSJSONObject[] |
| tabIndex | 本次点击选项所在层级下标 | number |

### Slots

| 名称 | 说明 |
| --- | --- |
| title | 常规标题 |
| option | 选项行内容（作用域：`option` 选项对象、`selected` 是否选中） |
| options-top | 选项区上方扩展（作用域：`tabIndex` 层级下标） |
| options-bottom | 选项区下方扩展（作用域：`tabIndex` 层级下标） |

## 主题定制

级联选择样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-cascader-background | 面板背景色 | #ffffff |
| $m-cascader-header-height | 头部高度 | 48px |
| $m-cascader-header-title-font-size | 标题字号 | 16px |
| $m-cascader-header-title-font-weight | 标题字重 | bold |
| $m-cascader-header-title-color | 标题颜色 | #323233 |
| $m-cascader-close-icon-size | 关闭图标字号 | 22px |
| $m-cascader-close-icon-color | 关闭图标颜色 | #c8c9cc |
| $m-cascader-tabs-height | tabs 区高度 | 48px |
| $m-cascader-tab-max-width | 单个 tab 最大宽度（超长省略） | 100px |
| $m-cascader-tab-font-size | tab 字号 | 14px |
| $m-cascader-tab-color | tab 文字颜色 | #323233 |
| $m-cascader-tab-active-color | 激活 tab 文字与下划线颜色 | #1989fa |
| $m-cascader-tab-line-width | 下划线宽度 | 20px |
| $m-cascader-tab-line-height | 下划线高度 | 3px |
| $m-cascader-tab-line-radius | 下划线圆角 | 3px |
| $m-cascader-options-height | 选项区高度 | 384px |
| $m-cascader-option-height | 选项行高度 | 40px |
| $m-cascader-option-padding | 选项行内边距 | 0 16px |
| $m-cascader-option-font-size | 选项字号 | 14px |
| $m-cascader-option-text-color | 选项文字颜色 | #323233 |
| $m-cascader-option-active-color | 选中项文字与对勾颜色 | #1989fa |
| $m-cascader-option-disabled-color | 禁用项文字颜色 | #c8c9cc |
| $m-cascader-option-check-size | 对勾图标字号 | 16px |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- 组件拆分：Vant 为单组件双形态（`poppable` 切换弹层 / 平铺），本项目拆为三个组件——`m-cascader` 纯面板、`m-cascader-popup` 弹出层、`m-cascader-input` 表单输入框，各司其职
- options 为动态类型 `UTSJSONObject[]`（支持 field-names 运行时映射与异步填充），业务侧用 `JSON.parse<UTSJSONObject[]>` 构造；Vant 为静态对象数组
- `options-height` 为本项目扩展 prop：Vant 仅提供 CSS 变量 `--van-cascader-options-height`，本项目 prop 覆盖主题变量（`0` 时回落变量，默认 384px 同 Vant）
- tab 定宽（`$m-cascader-tab-max-width` 100px）横向滚动 + `scroll-into-view` 对齐当前 tab；Vant 为等分自适应宽度 + 选中 tab 平滑居中
- 异步加载不内置 loading：children 为空数组视为叶子直接 `finish`，加载态由业务自行 showLoadingToast 提示
- 选项 `className` 字段不支持（ucss 无自定义类注入场景），`disabled` / `color` 语义与 Vant 一致
