---
title: Radio
subtitle: 单选框
demo: pages-sub/radio/radio
added: 0.7.0
---

## 介绍

单选框组件：在一组备选项中进行单选。拆为四个组件：

- `m-radio-group`：单选框组容器（当前选中值 v-model:value，统一下发视觉规格）
- `m-radio`：单选框单项（组内按 name 参与单选，独立使用受控 `checked` prop）
- `m-radio-popup` / `m-radio-input`：弹层单选与单选输入框形态，见 [RadioPopup](/components/radio-popup) 与 [RadioInput](/components/radio-input)

> 值类型：UTS 无 `any`，选项标识类型为 `string | number`，当前值 `RadioValue | null`（`null` 表未选）；`'1'` 与 `1` 视为同一项（字符串化比较）。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-radio-group v-model:value="value">
	<m-radio name="a">单选框 a</m-radio>
	<m-radio name="b">单选框 b</m-radio>
</m-radio-group>
```

### 独立单选框 {#demo-independent}

不在组内时为受控形态（不持值，点击仅派发事件，由外部回写）：

```vue
<m-radio :checked="value == 'a'" @click="value = 'a'">独立 a</m-radio>
<m-radio :checked="value == 'b'" @click="value = 'b'">独立 b</m-radio>
```

### 禁用与只读 {#demo-disabled}

单项 `disabled`（外环灰底填充、选中退灰）/ `readonly`（视觉正常不可切换），组容器整体生效并与子项合并；禁用态点击仍派发 `click` 事件：

```vue
<m-radio-group v-model:value="value" disabled>
	<m-radio name="a">禁用</m-radio>
</m-radio-group>
```

### 自定义形状 / 颜色 / 大小 {#demo-shape}

组容器 `shape` / `checked-color` / `icon-size` 统一下发，子项可单独覆盖：

```vue
<m-radio-group v-model:value="value" shape="square" checked-color="#ee0a24" icon-size="24px">
	<m-radio name="a">方形红色</m-radio>
	<m-radio name="b" shape="round" checked-color="#07c160">单项覆盖</m-radio>
</m-radio-group>
```

### 文本位置与禁点 {#demo-label}

```vue
<m-radio name="a" label-position="left">文本在左</m-radio>
<m-radio name="b" label-disabled>文本不可点（图标可点）</m-radio>
```

### 排列方向 {#demo-direction}

```vue
<m-radio-group v-model:value="value" direction="horizontal">
	<m-radio name="a">横向 a</m-radio>
	<m-radio name="b">横向 b</m-radio>
</m-radio-group>
```

### 自定义图标与内容 {#demo-slots}

`icon` 插槽与 `default` 插槽均透出作用域 `{ checked, disabled }`：

```vue
<m-radio name="a">
	<template #icon="{ checked }">
		<view :class="checked ? 'on' : ''" />
	</template>
	自定义图标
</m-radio>
```

### 搭配单元格 {#demo-cell}

整行点击切换：m-cell 的 `value` 插槽放置 m-radio，点击行时直接回写组值：

```vue
<m-radio-group v-model:value="value">
	<m-cell v-for="item in list" clickable @click="value = item">
		<template #value>
			<m-radio :name="item" @click.stop />
		</template>
	</m-cell>
</m-radio-group>
```

## API

### Props（m-radio-group）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中项标识（v-model:value；null 未选） | RadioValue \| null | `null` |
| disabled | 是否禁用全部单选框 | boolean | `false` |
| readonly | 是否只读全部单选框 | boolean | `false` |
| direction | 排列方向：`vertical` / `horizontal` | RadioDirection | `vertical` |
| icon-size | 图标尺寸（number 补 px / string 原样） | string \| number | `''` |
| checked-color | 选中态颜色 | string | `''` |
| shape | 形状：`round` / `square` | RadioShape | `round` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events（m-radio-group）

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中值变化 | value: RadioValue \| null |
| change | 选中值变化 | value: RadioValue \| null |

### Props（m-radio）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 标识符（组内必填；string / number） | RadioValue | `null` |
| checked | 是否选中（独立使用受控；组内由上下文驱动） | boolean | `false` |
| shape | 形状（组内未设置时继承容器） | RadioShape | `null` |
| disabled | 是否禁用 | boolean | `false` |
| readonly | 是否只读（视觉正常但不可切换） | boolean | `false` |
| label-disabled | 是否禁用文本点击（图标可点） | boolean | `false` |
| label-position | 文本位置：`right` / `left` | RadioLabelPosition | `right` |
| icon-size | 图标尺寸 | string \| number | `''` |
| checked-color | 选中态颜色（组内未设置时继承容器） | string | `''` |
| bind-group | 是否与单选框组绑定 | boolean | `true` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Slots（m-radio）

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 自定义文本 | `{ checked, disabled }` |
| icon | 自定义图标 | `{ checked, disabled }` |

### Events（m-radio）

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| change | 选中态变化（组内与独立均派发） | checked: boolean |
| click | 点击单选框（含禁用与只读拒绝时） | event: MouseEvent |

### Methods（m-radio）

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| select | 选中本项（搭配单元格场景外部调用） | - |

## 主题定制

单选框样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-radio-padding | 单项内边距 | 10px 16px |
| $m-radio-icon-size | 图标外环尺寸 | 20px |
| $m-radio-icon-border-width | 外环线宽 | 1px |
| $m-radio-icon-border-color | 未选外环颜色 | #c8c9cc |
| $m-radio-icon-color | 选中外环与内点颜色 | #1989fa |
| $m-radio-square-radius | square 形态外环圆角 | 4px |
| $m-radio-dot-size | 内点尺寸（图标尺寸的 50%） | 10px |
| $m-radio-label-gap | 图标与文本间距 | 8px |
| $m-radio-label-font-size | 文本字号 | 14px |
| $m-radio-label-color | 文本颜色 | #323233 |
| $m-radio-label-disabled-color | 文本禁用颜色 | #c8c9cc |
| $m-radio-icon-disabled-background | 禁用态外环灰底填充色 | #ebedf0 |
| $m-radio-icon-disabled-color | 禁用选中态外环与内点颜色 | #c8c9cc |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- **值类型**：Vant 为 `any`；本项目为 `string | number`，当前值可为 `null`（未选）
- **图标形态**：Vant 默认 `round` 为「实心圆 + 白勾」；本项目 `round` 为「圆环 + 内圆点」（与 Sard 的点选心智一致），`square` 为方框 + 内圆点，不提供 Vant 的白勾形态以免与 checkbox 混淆，Vant 的 `dot` 形态与本项目默认视觉相同故不设独立值
- **readonly**：吸收 Sard，子项 / 组容器均可设置，只读视觉正常但不可切换
- **点击已选项**：不可取消（Vant 语义）；清空场景走 [RadioInput](/components/radio-input) 的 `clearable`
- **slot 语法**：uvue 无 v-slot 简写，icon / default 插槽经 `<template #icon="{ checked }">` 声明

## 注意事项

- 组内 `name` 为必填（null 时退化为独立受控形态）
- 已选中项再点不取消、不重复派发 `change`（单选刚性）
- 图标为自绘 view（外环 + 内点），icon 插槽可整体替换
