---
title: LunarPicker
subtitle: 农历选择
demo: pages-sub/datetime/lunar-picker/lunar-picker
added: 0.6.0
---

农历年 / 月（含闰月）/ 日滚轮选择面板。对外值仍是公历 `Date`，农历只体现在列与文案上，便于与 `DatePicker` 互换或同表单混用。

## 介绍

- 列数据由 `utils/date` 的农历能力派生：月列为真实的农历月序（闰月紧随其月，文本形如「闰二月」），日列按农历月长 29 / 30 生成。
- 年列可选附加干支 / 生肖；`min-date` / `max-date` 为公历日期，列边界会反向映射到农历。
- 面板视觉（顶部栏 / 选中框 / 滚轮 / 加载遮罩）由内部 `Picker` 承担，本组件只负责列构建与值映射。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<template>
  <m-lunar-picker v-model:value="value" title="选择农历日期" @confirm="onConfirm" />
</template>

<script setup lang="uts">
  const value = ref<Date>(new Date(2026, 5, 15))
  const onConfirm = (date: Date) => {
    console.log('公历日期', date)
  }
</script>
```

### 闰月与月长 {#demo-leap}

```vue
<template>
  <m-lunar-picker v-model:value="value" :min-date="minDate" :max-date="maxDate" />
</template>

<script setup lang="uts">
  // 2023 年闰二月：公历 2023-03-22 ~ 2023-04-19
  const value = ref<Date>(new Date(2023, 2, 22))
  const minDate = new Date(2023, 2, 1)
  const maxDate = new Date(2023, 3, 30)
</script>
```

### 干支与生肖 {#demo-ganzhi}

```vue
<template>
  <m-lunar-picker v-model:value="value" show-gan-zhi show-zodiac />
</template>

<script setup lang="uts">
  const value = ref<Date>(new Date(2026, 5, 15))
</script>
```

### 列组合 {#demo-columns}

```vue
<template>
  <m-lunar-picker v-model:value="value" :columns-type="columnsType" />
</template>

<script setup lang="uts">
  import { LunarPickerColumnType } from '@/uni_modules/m-ui-x/components/m-lunar-picker/lunar-picker.uts'

  const value = ref<Date>(new Date(2026, 5, 1))
  const columnsType: LunarPickerColumnType[] = ['year', 'month']
</script>
```

### 可选区间 {#demo-range}

```vue
<template>
  <m-lunar-picker v-model:value="value" :min-date="minDate" :max-date="maxDate" />
</template>

<script setup lang="uts">
  const value = ref<Date>(new Date(2026, 5, 15))
  const minDate = new Date(2026, 0, 1)
  const maxDate = new Date(2026, 11, 31)
</script>
```

### 只读与加载态 {#demo-states}

```vue
<template>
  <m-lunar-picker v-model:value="value" readonly loading />
</template>
```

### 实例方法 {#demo-methods}

```vue
<template>
  <m-lunar-picker ref="picker" v-model:value="value" />
</template>

<script setup lang="uts">
  const picker = ref<ComponentPublicInstance | null>(null)
  const value = ref<Date>(new Date(2026, 5, 15))

  const reset = () => {
    picker.value?.$callMethod('resetSelection')
  }
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中日期（公历，v-model:value） | `Date \| null` | `null` |
| columns-type | 列类型组合（year / month / day 任意顺序） | `LunarPickerColumnType[] \| null` | `null` |
| min-date | 可选最小公历日期 | `Date \| null` | 农历表起点 1900-01-31 |
| max-date | 可选最大公历日期 | `Date \| null` | 农历表终点 2100-12-31 |
| show-gan-zhi | 年列是否附加干支 | `boolean` | `false` |
| show-zodiac | 年列是否附加生肖 | `boolean` | `false` |
| title | 顶部栏标题 | `string` | `''` |
| confirm-button-text | 确认按钮文字 | `string` | `确认` |
| cancel-button-text | 取消按钮文字 | `string` | `取消` |
| show-toolbar | 是否显示顶部栏 | `boolean` | `true` |
| loading | 是否显示加载状态 | `boolean` | `false` |
| readonly | 只读，滚轮回弹不切换 | `boolean` | `false` |
| filter | 选项过滤函数 | `LunarPickerFilter \| null` | `null` |
| formatter | 选项格式化函数 | `LunarPickerFormatter \| null` | `null` |
| option-height | 选项行高 px（0 用默认 44） | `number` | `0` |
| visible-option-num | 可见选项个数（0 用默认 6） | `number` | `0` |
| swipe-duration | 滚动停止判定时长 ms | `number` | `200` |
| custom-class | 自定义根节点类名 | `string` | `''` |
| custom-style | 自定义根节点内联样式 | `string` | `''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认后回写公历日期 | `date: Date` |
| change | 滚轮切换列 | `date: Date, columnIndex: number` |
| confirm | 点击确认按钮 | `date: Date` |
| cancel | 点击取消按钮 | — |

### Methods

| 方法 | 说明 | 返回值 |
| --- | --- | --- |
| confirm() | 程序化确认 | — |
| resetSelection() | 复位为 value / 今天 | — |
| reposition() | 按当前选中值重新定位滚轮（弹层 `open` 后布局可用时由弹层自动调用） | — |
| getSelectedDate() | 读取当前公历日期 | `Date` |
| getSelectedLunarText() | 读取当前农历文案（如 2026年六月十五） | `string` |

### Slots

| 名称 | 说明 | 作用域 |
| --- | --- | --- |
| toolbar | 整体替换顶部栏 | — |
| title | 自定义标题 | — |
| confirm | 自定义确认按钮 | — |
| cancel | 自定义取消按钮 | — |
| option | 自定义选项（仅 Web 生效，App / 小程序端回退内置文本） | `option: { text, value }, index: number` |
| columns-top | 滚轮区上方内容 | — |
| columns-bottom | 滚轮区下方内容 | — |

## 主题定制

面板容器、顶部栏、选中框与加载遮罩由内部 `Picker` 提供，统一通过 `$m-picker-*` 变量定制；列文本沿用 `$m-date-picker-option-font-size` / `-color` / `-selected-color`（农历列与公历列共用同一滚轮列组件）。

```scss
// uni.scss
$m-picker-toolbar-height: 48px;
$m-date-picker-option-font-size: 15px;
```

## 与 Vant 的差异

Vant 的 `DatePicker` 只提供公历选择，农历仅用于日历副文案；本组件是新增的农历选择面板，Props / Events 命名对齐 `DatePicker`，但值口径仍为公历 `Date`，不支持 `lunar` 模式切换。
