---
title: Segmented
subtitle: 分段控制器
demo: pages-sub/form/segmented/segmented
added: 0.7.0
---

## 介绍

用于在多个选项中单选的分段控制器。所有选项等分容器宽度，选中项由白色滑块标记，切换时滑块平滑平移。支持三档尺寸、胶囊形状、纵向排列、自定义内容插槽、溢出省略、整体 / 单项禁用与只读。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定选中值，`options` 定义选项：

```vue
<m-segmented v-model:value="value" :options="options" />
```

```uts
const value = ref<string | number>('早班')
const options = ref<UTSJSONObject[]>([
	{ label: '早班', value: '早班' },
	{ label: '中班', value: '中班' },
	{ label: '晚班', value: '晚班' }
] as UTSJSONObject[])
```

### 尺寸 {#demo-size}

`size` 可选 `small` / `medium`（默认）/ `large`，高度、字号与内边距同步变化：

```vue
<m-segmented v-model:value="value" :options="options" size="small" />
<m-segmented v-model:value="value" :options="options" />
<m-segmented v-model:value="value" :options="options" size="large" />
```

### 胶囊形状 {#demo-shape}

```vue
<m-segmented v-model:value="value" :options="options" shape="round" />
```

### 纵向方向 {#demo-vertical}

```vue
<m-segmented v-model:value="value" :options="options" direction="vertical" />
```

### 自定义内容 {#demo-custom}

`item` 插槽可渲染图标 + 文本等自定义内容，作用域为 `{ option, index, active, disabled }`：

```vue
<m-segmented v-model:value="value" :options="options" size="large">
	<template #item="{ option, active }">
		<view class="custom-item">
			<m-icon :name="option.getString('icon')!" :custom-class="active ? 'custom-item__icon custom-item__icon--active' : 'custom-item__icon'" />
			<text :class="active ? 'custom-item__text custom-item__text--active' : 'custom-item__text'">{{ option.getString('label') }}</text>
		</view>
	</template>
</m-segmented>
```

### 仅图标 {#demo-icon-only}

插槽内只放图标时，选项仍等分并居中：

```vue
<m-segmented v-model:value="value" :options="options" size="large">
	<template #item="{ option, active }">
		<m-icon :name="option.getString('icon')!" :custom-class="active ? 'custom-item__icon custom-item__icon--active' : 'custom-item__icon'" />
	</template>
</m-segmented>
```

### 溢出省略 {#demo-ellipsis}

`ellipsis` 默认 `true`，长文本单行省略；设为 `false` 允许换行撑高：

```vue
<m-segmented v-model:value="value" :options="options" />
<m-segmented v-model:value="value" :options="options" :ellipsis="false" />
```

### 禁用与只读 {#demo-disabled}

组件级 `disabled` 灰显全部选项；选项内的 `disabled` 字段仅禁用该项；`readonly` 保留选中态但禁止切换：

```vue
<m-segmented v-model:value="value" :options="options" disabled />
<m-segmented v-model:value="value" :options="options" readonly />
```

### 自定义字段名 {#demo-field-names}

`fieldNames` 映射 `label` / `value` / `disabled` 三个字段，未指定的键按同名兜底：

```vue
<m-segmented v-model:value="value" :options="options" :field-names="fieldNames" />
```

```uts
const fieldNames = ref<UTSJSONObject>({ label: 'text', value: 'code', disabled: 'off' })
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中值（v-model:value） | string \| number | `''` |
| options | 选项数组 | UTSJSONObject[] | `[]` |
| field-names | 字段映射（label / value / disabled） | UTSJSONObject \| null | `null` |
| size | 尺寸，可选 `small` `medium` `large` | string | `medium` |
| shape | 形状，可选 `square` `round` | string | `square` |
| direction | 排列方向，可选 `horizontal` `vertical` | string | `horizontal` |
| disabled | 是否禁用全部选项 | boolean | `false` |
| readonly | 是否只读（展示选中态，不可切换） | boolean | `false` |
| ellipsis | 文本是否单行省略 | boolean | `true` |
| duration | 滑块动画时长（秒），0 关闭 | number | `0.2` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中值变化（v-model:value） | value: string \| number |
| change | 选中值变化 | value: string \| number |

### Slots

| 名称 | 作用域 | 说明 |
| --- | --- | --- |
| item | `{ option, index, active, disabled }` | 自定义单项内容；`option` 为原始选项对象（UTSJSONObject） |

## 主题定制

在项目根 `uni.scss` 中直接定义以下变量即可覆盖默认值：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-segmented-padding | 容器内边距 | 2px |
| $m-segmented-bg | 容器背景色 | #f2f3f5 |
| $m-segmented-radius | 方形圆角 | $m-radius-md |
| $m-segmented-radius-round | 胶囊圆角 | $m-radius-max |
| $m-segmented-thumb-bg | 滑块背景色 | 白色 |
| $m-segmented-thumb-radius | 滑块圆角 | 4px |
| $m-segmented-thumb-radius-round | 胶囊形状下滑块圆角 | $m-radius-max |
| $m-segmented-thumb-shadow | 滑块阴影 | 0 2px 4px rgba(0, 0, 0, 0.08) |
| $m-segmented-height-sm | small 高度 | 28px |
| $m-segmented-height | medium 高度 | 32px |
| $m-segmented-height-lg | large 高度 | 40px |
| $m-segmented-font-size | medium 字号 | 14px |
| $m-segmented-font-size-sm | small 字号 | 12px |
| $m-segmented-font-size-lg | large 字号 | 16px |
| $m-segmented-item-padding | medium 单项内边距 | 0 12px |
| $m-segmented-item-padding-sm | small 单项内边距 | 0 8px |
| $m-segmented-item-padding-lg | large 单项内边距 | 0 16px |
| $m-segmented-item-padding-vertical | 纵向单项内边距 | 8px 12px |
| $m-segmented-item-padding-vertical-sm | 纵向 small 单项内边距 | 6px 8px |
| $m-segmented-item-padding-vertical-lg | 纵向 large 单项内边距 | 10px 16px |
| $m-segmented-item-color | 未选中文字色 | $m-text-color-tertiary |
| $m-segmented-item-color-active | 选中文字色 | $m-text-color |
| $m-segmented-item-color-disabled | 禁用文字色 | $m-text-color-fourth |

## 与 Sard 的差异

- **绑定语法**：Sard 为 `v-model`；本项目统一 `v-model:value`
- **值类型**：仅支持 `string | number`，不提供 `any`
- **选项形态**：只接受对象数组；原始值数组需自行 `map` 为 `{ label, value }`
- **自定义内容**：用 `item` 作用域插槽替代 `segmented-item` 子组件
- **宽度**：所有选项等分容器，不随内容自适应
- **同值点击**：不派发事件，也不支持取消选中

## 注意事项

- 组件为受控组件，不持内部值；`value` 无匹配项时滑块隐藏，选项均为未选中态
- 组件级 `disabled` 优先于选项级 `disabled`；`readonly` 仅禁止切换，不影响外观
- 滑块动画走 `UniElement.animate`；小程序端回退为直接落位，`duration` 设为 0 可全局关闭
