---
title: ColorPicker
subtitle: 颜色选择器
demo: pages-sub/color-picker/color-picker
added: 0.5.0
---

## 介绍

`m-color-picker` 颜色选择器：饱和度-明度面板搭配色相滑块，开启 `show-alpha` 后可继续调节透明度。颜色值以字符串受控（`v-model:value`），输出格式支持 `hex` / `rgb` / `hsl`；可选格式切换、预设色、R/G/B/A 数值输入、最近使用颜色，以及 Web 端吸管取色。

```vue
<m-color-picker v-model:value="color" show-alpha />
```

## API

### ColorPickerProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前颜色值（v-model:value） | string | `#1989FA` |
| show-alpha | 是否启用透明度选择（透明度条 + A 分量） | boolean | `false` |
| format | 输出颜色格式 | `hex` \| `rgb` \| `hsl` | `rgb` |
| show-format | 是否显示格式切换（hex / rgb / hsl）与当前值 | boolean | `false` |
| presets | 预定义颜色列表（空或未传时使用内置常用色） | string[] | `null` |
| show-presets | 是否显示预定义颜色 | boolean | `false` |
| show-inputs | 是否显示 R / G / B / A 数值输入 | boolean | `false` |
| show-recent | 是否显示最近使用颜色（最多 8 个） | boolean | `false` |
| show-eyedropper | 是否显示吸管取色入口（仅 Web 端渲染） | boolean | `false` |
| panel-height | 面板高度 px（0 用主题变量） | number | `0` |
| disabled | 是否禁用（不响应交互） | boolean | `false` |
| readonly | 是否只读（不响应交互，无禁用视觉） | boolean | `false` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### ColorPickerEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 颜色变化（v-model:value） | value: string |
| change | 颜色变化 | value: string |
| update:format | 格式切换（v-model:format） | format: ColorFormat |
| format-change | 格式切换 | format: ColorFormat |

## 颜色格式

- `hex`：默认输出 `#RRGGBB`；开启 `show-alpha` 输出 8 位 `#RRGGBBAA`
- `rgb`：`rgb(r, g, b)` / `rgba(r, g, b, a)`
- `hsl`：`hsl(h, s%, l%)` / `hsla(h, s%, l%, a)`
- 传入值兼容 `#RGB` / `#RGBA` / `#RRGGBB` / `#RRGGBBAA` / `rgb()` / `rgba()` / `hsl()` / `hsla()`，非法或空串回退默认色

## 注意事项

- 面板与滑块通过 `touchstart` / `touchmove` 换算坐标，桌面端需以触摸或指针模拟操作
- 渐变分层实现：App 端 `background-image` 仅支持单层 `linear-gradient`，因此饱和度面板由 3 个绝对定位层叠加（纯色相 + 横向白 + 纵向黑），不使用多重背景
- 吸管取色依赖 Chromium 的 `EyeDropper` API，使用 `#ifdef WEB` 条件编译：App / 鸿蒙 / 小程序端不渲染入口；Web 非 Chromium 浏览器点击时 toast 提示不支持
- `show-recent` 的最近色为组件内部状态（不持久化、实例间不共享），在手势结束或选择预设色后记录
- 数值输入失焦或回车提交，超出范围自动钳制（RGB 0-255、A 0-100）

## 相关组件

- [ColorPickerPopup](/components/color-picker-popup)：弹层形态（确定后回写）
- [ColorPickerInput](/components/color-picker-input)：表单输入框形态
