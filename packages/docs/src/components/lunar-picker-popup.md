# LunarPickerPopup 农历选择弹出框

`Popup` + `LunarPicker` 的弹层组合：底部弹出农历滚轮，确认 / 取消后自动关闭。

## 介绍

- 弹层行为（显隐 / 方位 / 圆角 / 安全区 / 遮罩）由 `Popup` 承担，农历选择行为由 `LunarPicker` 承担。
- `v-model:show` 控制显隐，`v-model:value` 控制选中日期（公历 `Date`）。
- `reset-on-open` 为 `true` 时，每次打开都复位为 `value` / 今天。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<template>
  <m-button block @click="show = true">打开农历选择</m-button>
  <m-lunar-picker-popup v-model:show="show" v-model:value="value" title="选择农历日期" />
</template>

<script setup lang="uts">
  const show = ref<boolean>(false)
  const value = ref<Date>(new Date(2026, 5, 15))
</script>
```

### 闰月与限域 {#demo-leap}

```vue
<template>
  <m-lunar-picker-popup
    v-model:show="show"
    v-model:value="value"
    :min-date="minDate"
    :max-date="maxDate"
  />
</template>

<script setup lang="uts">
  const show = ref<boolean>(false)
  const value = ref<Date>(new Date(2023, 2, 22))
  const minDate = new Date(2023, 2, 1)
  const maxDate = new Date(2023, 3, 30)
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹层（v-model:show） | `boolean` | `false` |
| value | 当前选中日期（公历，v-model:value） | `Date \| null` | `null` |
| columns-type | 列类型组合 | `LunarPickerColumnType[] \| null` | `null` |
| min-date | 可选最小公历日期 | `Date \| null` | 农历表起点 |
| max-date | 可选最大公历日期 | `Date \| null` | 农历表终点 |
| show-gan-zhi | 年列是否附加干支 | `boolean` | `false` |
| show-zodiac | 年列是否附加生肖 | `boolean` | `false` |
| title | 顶部栏标题 | `string` | `''` |
| confirm-button-text | 确认按钮文字 | `string` | `确认` |
| cancel-button-text | 取消按钮文字 | `string` | `取消` |
| show-toolbar | 是否显示顶部栏 | `boolean` | `true` |
| loading | 是否显示加载状态 | `boolean` | `false` |
| readonly | 只读 | `boolean` | `false` |
| filter | 选项过滤函数 | `LunarPickerFilter \| null` | `null` |
| formatter | 选项格式化函数 | `LunarPickerFormatter \| null` | `null` |
| option-height | 选项行高 px | `number` | `0` |
| visible-option-num | 可见选项个数 | `number` | `0` |
| swipe-duration | 滚动停止判定时长 ms | `number` | `200` |
| position | 弹出方位 | `DatePickerPosition` | `bottom` |
| round | 弹层圆角 | `boolean` | `true` |
| close-on-click-overlay | 点击遮罩后是否关闭 | `boolean` | `true` |
| reset-on-open | 打开时复位为 value / 今天 | `boolean` | `false` |
| safe-area-inset-top | 顶部安全区 | `boolean` | `false` |
| safe-area-inset-bottom | 底部安全区 | `boolean` | `true` |
| z-index | 层级 | `number` | `1` |
| duration | 动画时长秒 | `number` | `0.3` |
| custom-class | 自定义面板类名 | `string` | `''` |
| custom-style | 自定义面板内联样式 | `string` | `''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐变化 | `show: boolean` |
| update:value | 确认后回写公历日期 | `date: Date` |
| change | 滚轮切换列 | `date: Date, columnIndex: number` |
| confirm | 确认（随后自动关闭） | `date: Date` |
| cancel | 取消（随后自动关闭） | — |
| open / opened / close / closed | 弹层生命周期 | — |
| click-overlay | 点击遮罩 | `event: MouseEvent` |

### Slots

与 `LunarPicker` 一致：`toolbar` / `title` / `confirm` / `cancel` / `option` / `columns-top` / `columns-bottom`。

## 主题定制

面板视觉由 `Popup` 与内部 `Picker` 提供，通过 `$m-popup-*` / `$m-picker-*` 定制；列文本沿用 `$m-date-picker-option-*`。

## 下一步

- [LunarPicker 农历选择](/components/lunar-picker)
- [LunarPickerInput 农历输入框](/components/lunar-picker-input)
- [Popup 弹出层](/components/popup)
