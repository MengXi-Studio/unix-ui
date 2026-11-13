---
title: Checkbox
subtitle: 复选框
demo: pages-sub/checkbox/checkbox
added: 0.5.0
---

## 介绍

复选框组件（对标 [Vant Checkbox](https://vant-ui.github.io/vant/#/zh-CN/checkbox)）：在一组备选项中进行多选。拆为四个组件：

- `m-checkbox-group`：复选框组容器（选中集合 v-model:value，统一下发视觉规格与 max）
- `m-checkbox`：复选框单项（组内按 name 参与勾选，独立使用 v-model 布尔自持）
- `m-checkbox-popup` / `m-checkbox-input`：弹层多选与复选输入框形态，见 [CheckboxPopup](/components/checkbox-popup) 与 [CheckboxInput](/components/checkbox-input)

> 值类型：UTS 无 `any[]`，选中集合类型为 `Array<string | number>`（联合类型数组，已实测全端编译合法）；name 仅支持 string / number，`'1'` 与 `1` 视为同一项（字符串化比较）。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-checkbox-group v-model:value="list">
	<m-checkbox name="a">复选框 a</m-checkbox>
	<m-checkbox name="b">复选框 b</m-checkbox>
</m-checkbox-group>
```

### 独立复选框 {#demo-independent}

不在组内时经 `v-model` 绑定布尔状态：

```vue
<m-checkbox v-model:modelValue="checked">独立复选框</m-checkbox>
```

### 禁用状态 {#demo-disabled}

单项 `disabled` 或组容器整体禁用；禁用态点击仍派发 `click` 事件：

```vue
<m-checkbox-group v-model:value="list" disabled>
	<m-checkbox name="a">禁用</m-checkbox>
</m-checkbox-group>
```

### 自定义形状 / 颜色 / 大小 {#demo-shape}

组容器 `shape` / `checked-color` / `icon-size` 统一下发，子项可单独覆盖：

```vue
<m-checkbox-group v-model:value="list" shape="square" checked-color="#ee0a24" icon-size="24px">
	<m-checkbox name="a">方形红色</m-checkbox>
	<m-checkbox name="b" shape="round" checked-color="#07c160">单项覆盖</m-checkbox>
</m-checkbox-group>
```

### 文本位置与禁点 {#demo-label}

```vue
<m-checkbox name="a" label-position="left">文本在左</m-checkbox>
<m-checkbox name="b" label-disabled>文本不可点（图标可点）</m-checkbox>
```

### 最大可选数 {#demo-max}

`max` 限制最大勾选数，达到上限后其余项点击仅派发 `click` 不变更：

```vue
<m-checkbox-group v-model:value="list" :max="2">
	<m-checkbox name="a">选项 a</m-checkbox>
	<m-checkbox name="b">选项 b</m-checkbox>
	<m-checkbox name="c">选项 c</m-checkbox>
</m-checkbox-group>
```

### 排列方向 {#demo-direction}

```vue
<m-checkbox-group v-model:value="list" direction="horizontal">
	<m-checkbox name="a">横向 a</m-checkbox>
	<m-checkbox name="b">横向 b</m-checkbox>
</m-checkbox-group>
```

### 自定义图标与内容 {#demo-slots}

`icon` 插槽与 `default` 插槽均透出作用域 `{ checked, disabled }`：

```vue
<m-checkbox name="a">
	<template #icon="{ checked }">
		<view :class="checked ? 'on' : ''" />
	</template>
	自定义图标
</m-checkbox>
```

### 全选与不确定状态 {#demo-indeterminate}

`indeterminate` 显示部分选中横杠；全选切换可配合组实例的 `toggleAll` 或直接操作集合：

```vue
<m-checkbox :model-value="allChecked" :indeterminate="indeterminate" @click="toggleAll">全选</m-checkbox>
<m-checkbox-group v-model:value="list" @change="onChange">
	<m-checkbox name="a">选项 a</m-checkbox>
	<m-checkbox name="b">选项 b</m-checkbox>
</m-checkbox-group>
```

### 搭配单元格 {#demo-cell}

整行点击切换：m-cell 的 `value` 插槽放置 m-checkbox，经 ref 调用 `toggle()`（或直接操作集合）：

```vue
<m-checkbox-group v-model:value="list">
	<m-cell v-for="item in list" clickable @click="toggle(item)">
		<template #value>
			<m-checkbox :name="item" @click.stop />
		</template>
	</m-cell>
</m-checkbox-group>
```

## API

### CheckboxGroupProps（m-checkbox-group）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中项标识集合（v-model:value） | CheckboxValueArray | `[]` |
| disabled | 是否禁用全部复选框 | boolean | `false` |
| max | 最大可选数（0 不限制） | number | `0` |
| direction | 排列方向：`vertical` / `horizontal` | CheckboxDirection | `vertical` |
| icon-size | 图标尺寸（number 补 px / string 原样） | string \| number | `''` |
| checked-color | 选中态颜色 | string | `''` |
| shape | 形状：`round` / `square` | CheckboxShape | `round` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### CheckboxGroupEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中集合变化 | value: CheckboxValueArray |
| change | 选中集合变化 | value: CheckboxValueArray |

### CheckboxGroupMethods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| toggleAll | 切换全部（true 全选 / false 全不选 / null 取反；受 max 约束） | checked?: boolean \| null |

### CheckboxProps（m-checkbox）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 标识符（组内必填；string / number） | CheckboxValue | `null` |
| model-value | 是否选中（独立使用 v-model:modelValue） | boolean | `false` |
| shape | 形状（组内未设置时继承容器） | CheckboxShape | `null` |
| disabled | 是否禁用 | boolean | `false` |
| label-disabled | 是否禁用文本点击（图标可点） | boolean | `false` |
| label-position | 文本位置：`right` / `left` | CheckboxLabelPosition | `right` |
| icon-size | 图标尺寸 | string \| number | `''` |
| checked-color | 选中态颜色（组内未设置时继承容器） | string | `''` |
| bind-group | 是否与复选框组绑定 | boolean | `true` |
| indeterminate | 是否为不确定状态（横杠视觉） | boolean | `false` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### CheckboxSlots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 自定义文本 | `{ checked, disabled }` |
| icon | 自定义图标 | `{ checked, disabled }` |

### CheckboxEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 独立使用勾选变化 | checked: boolean |
| change | 勾选状态变化（组内与独立均派发） | checked: boolean |
| click | 点击复选框（含禁用与 max 拒绝时） | event: MouseEvent |

### CheckboxMethods

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| toggle | 切换勾选态（搭配单元格场景外部调用） | - |

## 主题定制

复选框样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-checkbox-padding | 单项内边距 | 10px 16px |
| $m-checkbox-icon-size | 勾选图标尺寸 | 20px |
| $m-checkbox-icon-color | 未选中图标颜色 | #1989fa |
| $m-checkbox-label-gap | 图标与文本间距 | 8px |
| $m-checkbox-label-font-size | 文本字号 | 14px |
| $m-checkbox-label-color | 文本颜色 | #323233 |
| $m-checkbox-label-disabled-color | 文本禁用颜色 | #c8c9cc |
| $m-checkbox-disabled-opacity | 禁用态图标透明度 | 0.5 |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- **值类型**：Vant 为 `any[]`；本项目为 `Array<string | number>`（UTS 无 any），且 `'1'` 与 `1` 经字符串化比较视为同一项
- **组件拆分**：Vant 的 CheckboxGroup + Checkbox 之上，对齐库内三件套先例扩展 `m-checkbox-popup` / `m-checkbox-input` 弹层与输入框形态
- **toggleAll 参数**：`null` 表示取反（对齐 Vant 不传参取反），取反模式不受 max 约束
- **indeterminate**：为 true 时图标固定显示横杠（不依赖勾选态），全选切换由使用者经 `@click` / 集合操作驱动
- **slot 语法**：uvue 无 v-slot 简写，icon / default 插槽经 `<template #icon="{ checked }">` 声明

## 注意事项

- 组内 `name` 为必填（null 时退化为独立复选框自持状态）
- 禁用子项不参与 `toggleAll` 的取反（全选 / 全不选仍包含，与 Vant 行为一致）
