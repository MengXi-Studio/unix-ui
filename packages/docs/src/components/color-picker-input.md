---
title: ColorPickerInput
subtitle: 颜色选择器输入框
demo: pages-sub/color-picker-input/color-picker-input
added: 0.5.0
---

## 介绍

`m-color-picker-input` 颜色选择器输入框：m-input（只读展示）+ m-color-picker-popup 组合。点击输入区打开弹层选色，确定后经 `v-model:value` 回写颜色文本；左侧色块预览当前颜色，支持字段标签与自绘清空按钮（对齐 m-cascader-input 组合先例）。

```vue
<m-color-picker-input
	v-model:value="color"
	title="选择产线颜色"
	placeholder="选择产线颜色"
	show-alpha
	show-presets
	clearable
/>
```

## API

### ColorPickerInputProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前颜色值（v-model:value） | string | `''` |
| title | 字段标签（非空时展示在输入框上方） | string | `''` |
| popup-title | 弹层标题 | string | `选择颜色` |
| placeholder | 占位符 | string | `请选择颜色` |
| disabled | 是否禁用（不响应点击） | boolean | `false` |
| clearable | 是否显示清空按钮（有值且非禁用时可见） | boolean | `false` |
| show-alpha | 是否启用透明度选择 | boolean | `false` |
| format | 输出颜色格式 | `hex` \| `rgb` \| `hsl` | `rgb` |
| show-format | 是否显示格式切换 | boolean | `false` |
| presets | 预定义颜色列表 | string[] | `null` |
| show-presets | 是否显示预定义颜色 | boolean | `false` |
| show-inputs | 是否显示 R / G / B / A 数值输入 | boolean | `false` |
| show-recent | 是否显示最近使用颜色 | boolean | `false` |
| show-eyedropper | 是否显示吸管取色入口（仅 Web 端渲染） | boolean | `false` |
| confirm-text | 确定按钮文案 | string | `确定` |
| cancel-text | 取消按钮文案 | string | `取消` |
| border | 是否显示输入框边框（透传 m-input） | boolean | `true` |
| inlaid | 嵌入式形态（透传 m-input） | boolean | `false` |
| position | 弹出方位（透传 m-popup） | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | 弹层圆角（透传 m-popup） | boolean | `true` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### ColorPickerInputEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 颜色值变化（v-model:value） | value: string |
| change | 颜色值变化 | value: string |
| confirm | 点击确定 | value: string |
| clear | 点击清空（同时回写空串） | - |
| update:show | 弹层显隐变化（v-model:show） | value: boolean |
| update:format | 格式切换（v-model:format） | format: ColorFormat |
| format-change | 格式切换 | format: ColorFormat |

## 注意事项

- 值单向受控：输入框展示的是 `value` 原始文本（不做格式转换），色块预览由 `value` 解析渲染
- 清空按钮为自绘元素（m-input 内置 clearable 图标会被透明触发层挡住）
- `disabled` 时不渲染触发层，点击不会打开弹层

## 相关组件

- [ColorPicker](/components/color-picker)：纯面板形态
- [ColorPickerPopup](/components/color-picker-popup)：弹层形态
