---
title: LunarPickerInput
subtitle: 农历输入框
demo: pages-sub/lunar-picker-input/lunar-picker-input
added: 0.6.0
---

`Input` + `LunarPickerPopup` 的表单组合：点击整区打开农历弹层，确认后按农历文案回填。

## 介绍

- 值为公历 `Date`（`v-model:value`），展示文本按列组合输出农历文案（如 `2026年六月十五`）。
- 支持清空、禁用、列组合、干支年展示与限域。
- 弹层每次打开都复位为当前 `value`（内部固定 `reset-on-open`）。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<template>
  <m-lunar-picker-input v-model:value="value" title="选择农历日期" />
</template>

<script setup lang="uts">
  const value = ref<Date | null>(null)
</script>
```

### 列组合 {#demo-columns}

```vue
<template>
  <m-lunar-picker-input v-model:value="value" :columns-type="columnsType" placeholder="请选择农历年月" />
</template>

<script setup lang="uts">
  import { LunarPickerColumnType } from '@/uni_modules/m-ui-x/components/m-lunar-picker/lunar-picker.uts'

  const value = ref<Date | null>(null)
  const columnsType: LunarPickerColumnType[] = ['year', 'month']
</script>
```

### 干支年展示 {#demo-ganzhi}

```vue
<template>
  <m-lunar-picker-input v-model:value="value" show-gan-zhi />
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中日期（公历，v-model:value） | `Date \| null` | `null` |
| columns-type | 列类型组合 | `LunarPickerColumnType[] \| null` | `null` |
| placeholder | 占位符 | `string` | `请选择农历日期` |
| disabled | 是否禁用 | `boolean` | `false` |
| clearable | 是否显示清空按钮 | `boolean` | `true` |
| border | 触发器是否显示边框容器 | `boolean` | `true` |
| inlaid | 触发器嵌入式形态 | `boolean` | `false` |
| show-gan-zhi | 年列是否附加干支 | `boolean` | `false` |
| show-zodiac | 年列是否附加生肖 | `boolean` | `false` |
| title | 弹层顶部栏标题 | `string` | `''` |
| confirm-button-text | 确认按钮文字 | `string` | `确认` |
| cancel-button-text | 取消按钮文字 | `string` | `取消` |
| min-date | 可选最小公历日期 | `Date \| null` | 农历表起点 |
| max-date | 可选最大公历日期 | `Date \| null` | 农历表终点 |
| filter | 选项过滤函数 | `LunarPickerFilter \| null` | `null` |
| formatter | 选项格式化函数 | `LunarPickerFormatter \| null` | `null` |
| position | 弹出方位 | `DatePickerPosition` | `bottom` |
| round | 弹层圆角 | `boolean` | `true` |
| custom-class | 自定义根节点类名 | `string` | `''` |
| custom-style | 自定义根节点内联样式 | `string` | `''` |

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 确认回写（清空为 null） | `date: Date \| null` |
| confirm | 弹层确认后触发 | `date: Date` |
| clear | 点击清空按钮 | — |

## 主题定制

- 输入框本体样式由 `Input` 提供，通过 `$m-input-*` 定制。
- 触发层与清空按钮：`$m-lunar-picker-input-trigger-z-index` / `-clear-z-index` / `-clear-width` / `-clear-icon-size` / `-clear-color`。
