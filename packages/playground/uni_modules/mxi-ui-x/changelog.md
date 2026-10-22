# 未发布

- 新增 `mxi-icon` 图标组件：内置 257 个字体图标（名称与 Vant 对齐，`name` 为 `IconName` 联合类型），支持 `color` / `size` 自定义、`custom-class` / `custom-style` 标签样式直达、`icon` 插槽与 `click` 事件；字体文件随包内置（`@font-face` 声明式加载），零配置、离线可用
- `mxi-button` 新增按压反馈：按下时按钮透明度降为 0.8、松开后恢复（基于 `hover-class` 实现），可通过 `$mxi-button-active-opacity` 自定义；disabled / loading 状态不出现按压态
- `mxi-button` 新增 `loading-type` 属性：支持 `circular`（默认，圆环旋转）、`spinner`（花瓣旋转，对齐 Vant）与 `clock`（时钟指针旋转）三种加载图标形态

# 0.1.0 (2026-10-21)

- 首个版本发布
- 新增 `mxi-button` 按钮组件：支持类型（default / primary / success / warning / danger）、尺寸（large / normal / small / mini）、朴素、圆角、方形、细边框（0.5px）、块级、禁用、加载状态与自定义颜色（含渐变）
