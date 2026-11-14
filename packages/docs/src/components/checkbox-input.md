---
title: CheckboxInput
subtitle: 复选输入框
demo: pages-sub/checkbox-input/checkbox-input
added: 0.5.0
---

## 介绍

`m-checkbox-input` 复选输入框：m-input（只读触发器）+ m-checkbox-popup 组合。触发器点击整区打开弹层，选中项 label「、」连接回显（超 2 项截断为「前两项 等 N 项」），自绘清空按钮（m-input 内置 clearable 的图标位于触发层之下会被挡住），`v-model:value` 受控（空数组为未选）。

```vue
<m-checkbox-input v-model:value="list" :options="options" title="选择城市" />
```

## API

### CheckboxInputProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中项标识集合（v-model:value；空数组为未选） | CheckboxValueArray | `[]` |
| options | 选项数组（label / value / disabled 字段） | UTSJSONObject[] | `null` |
| placeholder | 占位符 | string | `请选择` |
| disabled | 是否禁用 | boolean | `false` |
| clearable | 是否显示清空按钮（有值且非 disabled 时可见） | boolean | `true` |
| border | 触发器是否显示边框容器（透传 m-input） | boolean | `true` |
| inlaid | 触发器嵌入式形态（透传 m-input） | boolean | `false` |
| title | 弹层标题 | string | `''` |
| max | 最大可选数（0 不限制） | number | `0` |
| direction | 排列方向 | CheckboxDirection | `vertical` |
| shape | 形状 | CheckboxShape | `round` |
| icon-size | 图标尺寸 | string \| number | `''` |
| checked-color | 选中态颜色 | string | `''` |
| label-position | 文本位置 | CheckboxLabelPosition | `right` |
| field-names | 选项字段名映射（默认 label / value / disabled） | CheckboxFieldNames | `null` |
| options-height | 选项区高度 px（0 用主题变量） | number | `0` |
| position | 弹出方位（透传 m-popup，默认底部） | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | 弹层圆角（透传 m-popup） | boolean | `true` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### CheckboxInputEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中集合变化（v-model:value） | value: CheckboxValueArray |
| change | 选中集合变化 | value: CheckboxValueArray |
| click-item | 点击选项（透传弹层选项） | index: number |
| clear | 点击清空按钮（回写空集合） | - |

## 注意事项

- 值类型为 `Array<string | number>`；options 中 value 支持 number（演示数据混用 110000 等数字编码）
- 清空按钮回写空数组（非 null），判断「是否已选」用 `value.length > 0`
- 展示文本：选中项 label「、」连接；选项中找不到的值回退值文本；超 2 项截断为「前两项 等 N 项」
