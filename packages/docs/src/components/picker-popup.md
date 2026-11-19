---
title: PickerPopup
subtitle: 选择器弹出框
demo: pages-sub/pickers/picker-popup/picker-popup
added: 0.6.0
---

## 介绍

选择器弹出框，由 [Popup](/components/popup) 与 [Picker](/components/picker) 组合而成：弹层行为归 `m-popup`，选择行为归面板，本组件仅做组合与转发。确认或取消后自动关闭弹层。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-button @click="show = true">打开选择器</m-button>
<m-picker-popup v-model:show="show" :columns="columns" title="选择产线" @confirm="onConfirm" />
```

```ts
const show = ref(false)
```

### 受控选中值 {#demo-controlled}

```vue
<m-picker-popup v-model:show="show" v-model:value="value" :columns="columns" />
```

```ts
const value = ref<string | number | null>('包装五线')
```

### 多列与级联 {#demo-columns}

```vue
<m-picker-popup v-model:show="show" v-model:value="value" :columns="yearMonthDay" title="年月日" />
<m-picker-popup v-model:show="show2" v-model:value="value2" :columns="regionTree" title="选择地区" />
```

### 插槽与状态 {#demo-slots}

`toolbar` / `title` / `confirm` / `cancel` / `option` / `columns-top` / `columns-bottom` 插槽逐项透传到内部面板。

```vue
<m-picker-popup v-model:show="show" :columns="columns" title="产线">
	<template #columns-top>
		<view><text>提示：上下滑动选择</text></view>
	</template>
	<template #confirm>
		<text>完成</text>
	</template>
</m-picker-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹出层（`v-model:show`） | boolean | `false` |
| columns | 列数据（一维 / 二维） | PickerOption[] \| PickerOption[][] \| null | `null` |
| value | 选中值（`v-model:value`） | string \| number \| (string \| number)[] \| null | `null` |
| title | 顶部栏标题 | string | `请选择` |
| confirm-button-text | 确认按钮文字 | string | `确认` |
| cancel-button-text | 取消按钮文字 | string | `取消` |
| show-toolbar | 是否显示顶部栏 | boolean | `true` |
| loading | 是否显示加载状态 | boolean | `false` |
| readonly | 只读 | boolean | `false` |
| option-height | 选项行高 px（`0` 用默认 44） | number | `0` |
| visible-option-num | 可见选项个数（`0` 用默认 6） | number | `0` |
| swipe-duration | 滚动停止判定时长 ms | number | `200` |
| position | 弹出方位 | DatePickerPosition | `bottom` |
| round | 是否显示圆角 | boolean | `true` |
| close-on-click-overlay | 点击遮罩后是否关闭 | boolean | `true` |
| reset-on-open | 打开时是否复位为 value | boolean | `false` |
| safe-area-inset-top | 顶部安全区 | boolean | `false` |
| safe-area-inset-bottom | 底部安全区 | boolean | `true` |
| z-index | 层级 | number | `1` |
| duration | 动画时长（秒） | number | `0.3` |
| custom-class | 面板根节点自定义类名 | string.ClassString | - |
| custom-style | 面板根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 显隐变化（确认 / 取消 / 遮罩关闭后为 `false`） | value: boolean |
| update:value | 选中值回写 | value: string \| number \| (string \| number)[] \| null |
| change | 滚轮切换列 | value, selectedOptions: PickerOption[], indexes: number[] |
| confirm | 点击确认按钮（随后自动关闭） | value, selectedOptions, indexes |
| cancel | 点击取消按钮（随后自动关闭） | - |
| open / opened / close / closed | 弹层生命周期 | - |
| click-overlay | 点击遮罩 | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| toolbar | 整体替换顶部栏 |
| title | 标题内容 |
| confirm | 确认按钮内容 |
| cancel | 取消按钮内容 |
| columns-top | 滚轮上方内容 |
| columns-bottom | 滚轮下方内容 |
| option | 选项内容（作用域：`option`、`index`、`rowIndex`、`columnIndex`；仅 Web 生效，App / 小程序端回退内置文本） |

## 主题定制

弹层外观由 [Popup](/components/popup) 主题变量控制；面板样式见 [Picker 主题定制](/components/picker#主题定制)。
