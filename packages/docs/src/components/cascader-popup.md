---
title: CascaderPopup
subtitle: 级联弹出框
demo: pages-sub/cascader-popup/cascader-popup
added: 0.3.0
---

## 介绍

级联弹出框组件，基于 [Popup](/components/popup)（底部弹出层）与 [Cascader](/components/cascader)（级联面板）组合实现，负责弹层显隐、方位 / 圆角 / 层级等容器能力；级联的选择能力（选项树 / field-names / 手势滑动 / 插槽等）全量透传。

选完最后一级触发 `finish` 后弹层自动关闭。表单触发场景（输入框回填）直接使用 [CascaderInput](/components/cascader-input)。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:show` 控制显隐；选完最后一级派发 `finish` 并自动关闭。弹层全生命周期事件（open / opened / close / closed / click-overlay）一应俱全：

```vue
<m-button block @click="show = true">打开级联弹层</m-button>
<m-cascader-popup
	v-model:show="show"
	title="请选择所在地区"
	:options="options"
	@change="onChange"
	@finish="onFinish"
	@closed="onClosed"
/>
```

### 受控选中值 {#demo-controlled}

通过 `v-model:value` 受控选中值（叶子 value）：`change` 与 `finish` 时实时回写；外部赋值后打开弹层，层级 tab 与选中态跟随受控值（组件内部对已匹配路径做了防循环守卫）：

```vue
<m-cascader-popup v-model:show="show" v-model:value="value" :options="options" />
```

### 方位 / 圆角 {#demo-shape}

弹层容器 props 透传 [Popup](/components/popup)：`position` 方位、`round` 圆角、`z-index` 层级、`close-on-click-overlay` 遮罩点击关闭、`safe-area-inset-bottom` 底部安全区等：

```vue
<m-cascader-popup
	v-model:show="show"
	position="bottom"
	:round="true"
	:options="options"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹出层（`v-model:show`） | boolean | `false` |
| value | 选中值（`v-model:value`；叶子 value，`null` 未选） | CascaderValue \| null | `null` |
| options | 级联选项树（动态类型） | UTSJSONObject[] \| null | `null` |
| title | 常规标题 | string | `''` |
| placeholder | 未选层 tab 占位文案 | string | `请选择` |
| active-color | 主题色（选中项文字 / 对勾 / tab 下划线） | string | `''` |
| closeable | 是否显示头部关闭图标 | boolean | `true` |
| close-icon | 关闭图标名称 | IconName | `cross` |
| show-header | 是否显示头部 | boolean | `true` |
| field-names | 自定义选项字段名 | CascaderFieldNames \| null | `null` |
| options-height | 选项区高度 px（`0` 用主题变量） | number | `0` |
| swipeable | 是否支持手势滑动切换层级 | boolean | `true` |
| position | 弹出方位，可选值 `top` `bottom` `left` `right` `center`（透传 m-popup） | CascaderPopupPosition | `bottom` |
| round | 弹层圆角（透传 m-popup） | boolean | `true` |
| close-on-click-overlay | 点击遮罩后是否关闭（透传 m-popup） | boolean | `true` |
| safe-area-inset-top | 顶部安全区（透传 m-popup） | boolean | `false` |
| safe-area-inset-bottom | 底部安全区（透传 m-popup） | boolean | `true` |
| z-index | z-index 层级（透传 m-popup） | number | `1` |
| duration | 动画时长秒（透传 m-popup） | number | `0.3` |
| custom-class | 级联面板根节点自定义类名 | string.ClassString | - |
| custom-style | 级联面板根节点自定义内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐变化（`v-model:show`） | value: boolean |
| update:value | 选中值变化（`v-model:value`；change 与 finish 均回写） | value: CascaderValue |
| change | 点击选项后触发（含未选完的中间层） | event: CascaderChangeEvent |
| finish | 选完最后一级后触发（弹层同步自动关闭） | event: CascaderChangeEvent |
| click-tab | 点击 tab | tabIndex: number, title: string |
| open | 弹层开始打开 | - |
| opened | 弹层打开动画结束 | - |
| close | 弹层开始关闭 | - |
| closed | 弹层关闭动画结束 | - |
| click-overlay | 点击遮罩 | event: MouseEvent |

### Slots

级联面板四插槽条件转发（仅业务传入时覆盖面板默认渲染）：

| 名称 | 说明 |
| --- | --- |
| title | 常规标题 |
| option | 选项行内容（作用域：`option`、`selected`） |
| options-top | 选项区上方扩展（作用域：`tabIndex`） |
| options-bottom | 选项区下方扩展（作用域：`tabIndex`） |

## 与 Vant 的差异

- Vant Cascader 经 `poppable` 属性切换弹层形态，本项目拆为独立组合组件；弹层行为归 [Popup](/components/popup)，级联行为归 [Cascader](/components/cascader)，本组件仅做组合与转发
- `finish` 后自动关闭弹层：Vant 选完最后一级不自动关闭（需业务控制 `poppable` 场景的关闭），本项目对齐 m-calendar-popup「确认后自动关」的组件族先例
- 头部关闭图标点击统一走 `update:show(false)` 关闭弹层，`close` 事件由弹层关闭过程派发（与遮罩关闭同一路径，不重复派发）
