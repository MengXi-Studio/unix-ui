---
title: RadioPopup
subtitle: 单选弹出框
demo: pages-sub/radio-popup/radio-popup
added: 0.7.0
---

## 介绍

单选弹出框：`m-popup` + `m-radio-group` 组合的弹层单选形态组件。选项由 `options` 数组驱动渲染（不要求使用者写子组件模板），当前选中值 `v-model:value` 受控；点选后弹层不自动关闭，经头部关闭钮 / 遮罩 / footer 关闭。

> 值类型：选项标识 `string | number`，当前值 `RadioValue | null`（`null` 未选）。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-radio-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	title="选择产线"
>
	<template #footer>
		<m-button block type="primary" @click="show = false">确定</m-button>
	</template>
</m-radio-popup>
```

### 自定义字段名 {#demo-field-names}

```vue
<m-radio-popup
	v-model:show="show"
	v-model:value="value"
	:options="options"
	:field-names="{ label: 'text', value: 'code', disabled: 'off' }"
	title="选择渠道"
/>
```

### 禁用与只读 {#demo-disabled}

选项数据中的 `disabled` 字段禁用单项；组件 `readonly` 使弹层整体只读：

```vue
<m-radio-popup v-model:show="show" v-model:value="value" :options="options" readonly />
```

### 排列方向 / 自定义高度 {#demo-layout}

```vue
<m-radio-popup v-model:show="show" v-model:value="value" :options="options" direction="horizontal" />
<m-radio-popup v-model:show="show" v-model:value="value" :options="options" :options-height="200" />
```

## API

### Props

透传 `m-radio-group` 全部规格 props（value / disabled / readonly / direction / icon-size / checked-color / shape），另加：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹出层（v-model:show） | boolean | `false` |
| options | 选项数组（label / value / disabled 字段） | UTSJSONObject[] | `null` |
| title | 弹层标题 | string | `''` |
| show-header | 是否显示头部（标题 + 关闭按钮） | boolean | `true` |
| closeable | 是否显示关闭图标 | boolean | `true` |
| close-icon | 关闭图标名（m-icon 图标名） | IconName | `cross` |
| label-position | 文本位置：`right` / `left` | RadioLabelPosition | `right` |
| field-names | 自定义选项字段名 | RadioFieldNames | `null` |
| options-height | 选项区高度 px（0 用主题变量） | number | `0` |
| position | 弹出方位：`top` / `bottom` / `left` / `right` / `center` | RadioPopupPosition | `bottom` |
| round | 是否显示圆角 | boolean | `true` |
| close-on-click-overlay | 点击遮罩是否关闭 | boolean | `true` |
| safe-area-inset-bottom | 底部安全区适配 | boolean | `true` |
| z-index | 层级 | number | `99` |
| duration | 动画时长（秒） | number | `0.3` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐变化 | show: boolean |
| update:value | 选中值变化 | value: RadioValue \| null |
| change | 选中值变化 | value: RadioValue \| null |
| click-item | 点击选项（含禁用态） | index: number |
| close | 点击关闭图标 | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| footer | 弹层底部自定义区域（如确定按钮） |

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-radio-popup-background | 弹层背景色 | #ffffff |
| $m-radio-popup-header-padding | 头部内边距 | 14px 16px |
| $m-radio-popup-title-font-size | 标题字号 | 16px |
| $m-radio-popup-title-color | 标题颜色 | #323233 |
| $m-radio-popup-close-icon-size | 关闭图标字号 | 18px |
| $m-radio-popup-close-icon-color | 关闭图标颜色 | #c8c9cc |
| $m-radio-popup-options-height | 选项区高度 | 278px |

选项视觉复用 `$m-radio-*` 段。

## 注意事项

- 点选后弹层不自动关闭（与 `v-model:show` 受控模型一致；需要即选即关可监听 `change` 后自行置 `show = false`）
- options 中 `value` 为 null / 缺失的项跳过渲染（无法参与单选）
- value 与选项值经字符串化比对，`'1'` 与 `1` 视为同一项
