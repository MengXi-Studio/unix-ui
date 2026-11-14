---
title: ColorPickerPopup
subtitle: 颜色选择器弹出框
demo: pages-sub/color-picker-popup/color-picker-popup
added: 0.5.0
---

## 介绍

`m-color-picker-popup` 颜色选择器弹出框：m-popup + m-color-picker 组合。头部为「取消 / 标题 / 确定」三栏，选择过程只改内部草稿，点确定才回写 `v-model:value` 并关闭；取消或遮罩关闭丢弃本次改动。弹层 props 全透传（对齐 m-calendar-popup 组合先例）。

```vue
<m-color-picker-popup
	v-model:show="visible"
	v-model:value="color"
	title="选择颜色"
	show-alpha
	show-presets
/>
```

## API

### ColorPickerPopupProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹层（v-model:show） | boolean | `false` |
| value | 当前颜色值（v-model:value，确认后回写） | string | `''` |
| title | 弹层标题 | string | `选择颜色` |
| show-header | 是否显示头部（取消 / 标题 / 确定） | boolean | `true` |
| show-confirm | 是否显示确定按钮（false 时选择即生效） | boolean | `true` |
| confirm-text | 确定按钮文案 | string | `确定` |
| cancel-text | 取消按钮文案 | string | `取消` |
| show-alpha | 是否启用透明度选择 | boolean | `false` |
| format | 输出颜色格式 | `hex` \| `rgb` \| `hsl` | `rgb` |
| show-format | 是否显示格式切换 | boolean | `false` |
| presets | 预定义颜色列表 | string[] | `null` |
| show-presets | 是否显示预定义颜色 | boolean | `false` |
| show-inputs | 是否显示 R / G / B / A 数值输入 | boolean | `false` |
| show-recent | 是否显示最近使用颜色 | boolean | `false` |
| show-eyedropper | 是否显示吸管取色入口（仅 Web 端渲染） | boolean | `false` |
| panel-height | 面板高度 px（0 用主题变量） | number | `0` |
| disabled | 是否禁用（不响应交互，确定无效） | boolean | `false` |
| readonly | 是否只读（不响应交互） | boolean | `false` |
| position | 弹出方位（透传 m-popup） | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | 弹层圆角（透传 m-popup） | boolean | `true` |
| close-on-click-overlay | 点击遮罩关闭（透传 m-popup） | boolean | `true` |
| safe-area-inset-bottom | 底部安全区适配（透传 m-popup） | boolean | `true` |
| z-index | 层级（透传 m-popup） | number | `100` |
| duration | 动画时长秒（透传 m-popup） | number | `0.3` |
| custom-class / custom-style | 内容根节点样式直达 | - | - |

### ColorPickerPopupEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐变化（v-model:show） | value: boolean |
| update:value | 确认后回写颜色（v-model:value） | value: string |
| change | 颜色变化（确认或 show-confirm=false 的实时回写） | value: string |
| confirm | 点击确定 | value: string |
| cancel | 点击取消（丢弃本次改动） | - |
| update:format | 格式切换（v-model:format） | format: ColorFormat |
| format-change | 格式切换 | format: ColorFormat |
| open / opened | 弹层打开 / 打开动画结束 | - |
| close / closed | 弹层关闭 / 关闭动画结束 | - |
| click-overlay | 点击遮罩 | event: MouseEvent |

## 注意事项

- 每次打开都会把草稿重置为当前 `value`，未确认的改动不会保留
- `show-confirm=false` 时选择过程实时回写 `update:value` / `change`，遮罩关闭不丢弃
- 弹层打开动画结束后会重新测量面板节点，保证触摸坐标换算准确（动画期间 rect 带位移）

## 相关组件

- [ColorPicker](/components/color-picker)：纯面板形态
- [ColorPickerInput](/components/color-picker-input)：表单输入框形态
