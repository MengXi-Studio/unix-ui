---
title: Popup
subtitle: 弹出层
demo: pages-sub/popup/popup
---

## 介绍

弹出层容器，从五个方位（top / bottom / left / right / center）弹出面板内容，是 Dialog、ActionSheet 等弹窗类组件的基础。内部由 [m-overlay](/components/overlay) 组合实现，自带遮罩、层级与 Web 端滚动锁定。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:show` 双向绑定显示状态；点击遮罩自动关闭，点击面板内容不会误触遮罩关闭。

```vue
<m-button type="primary" @click="show = true">显示弹出层</m-button>
<m-popup v-model:show="show">
	<view>正文内容</view>
</m-popup>
```

### 弹出位置 {#demo-position}

通过 `position` 设置弹出方位，默认 `center` 居中；`top` / `bottom` 宽度撑满，`left` / `right` 高度撑满。

```vue
<m-popup v-model:show="showTop" position="top">内容</m-popup>
<m-popup v-model:show="showBottom" position="bottom">内容</m-popup>
<m-popup v-model:show="showLeft" position="left">内容</m-popup>
<m-popup v-model:show="showRight" position="right">内容</m-popup>
```

### 圆角弹窗 {#demo-round}

`round` 显示圆角，圆角按弹出方位分侧（如 `bottom` 弹出仅上侧两角圆角）。

```vue
<m-popup v-model:show="show" position="bottom" round>内容</m-popup>
```

### 关闭图标 {#demo-closeable}

`closeable` 显示关闭图标（由 [m-icon](/components/icon) 驱动），`close-icon-position` 支持四角方位，`close-icon` 可自定义图标名。点击图标触发 `click-close-icon` 事件并关闭。

```vue
<m-popup v-model:show="show" round closeable close-icon-position="top-right">内容</m-popup>
<m-popup v-model:show="show" round closeable close-icon="fail">内容</m-popup>
```

### 点击遮罩不关闭 {#demo-overlay-click}

`close-on-click-overlay` 设为 `false` 后，点击遮罩仅触发 `click-overlay` 事件、不自动关闭。

```vue
<m-popup v-model:show="show" :close-on-click-overlay="false" @click-overlay="onOverlayClick">内容</m-popup>
```

### 监听显示事件 {#demo-events}

`open` / `opened` 在开始与完成进入过渡时触发；`close` / `closed` 在开始与完成离开过渡时触发。`duration=0` 时 `opened` / `closed` 随显隐切换立即触发。

```vue
<m-popup
	v-model:show="show"
	@open="onOpen"
	@opened="onOpened"
	@close="onClose"
	@closed="onClosed"
>内容</m-popup>
```

### 无遮罩弹层 {#demo-no-overlay}

`overlay` 设为 `false` 时不显示遮罩背景（透明浮层）。

```vue
<m-popup v-model:show="show" :overlay="false">内容</m-popup>
```

### 销毁后重建 {#demo-destroy}

`destroy-on-close` 在关闭动画结束后销毁面板内容，重开时重建（内部状态复位）；默认仅隐藏、状态保留。`lazy-render` 默认首次展示才渲染面板。

```vue
<m-popup v-model:show="show" :destroy-on-close="true">内容</m-popup>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model:show | 是否显示弹出层 | boolean | `false` |
| position | 弹出方位，可选值 `top` `bottom` `left` `right` `center` | string | `center` |
| overlay | 是否显示遮罩背景（`false` 时为透明浮层） | boolean | `true` |
| overlay-class | 自定义遮罩类名（透传内置 m-overlay） | string.ClassString | - |
| overlay-style | 自定义遮罩样式（透传内置 m-overlay） | string | - |
| z-index | z-index 层级 | number | `1` |
| duration | 动画时长（秒），`0` 表示无动画 | number | `0.3` |
| round | 是否显示圆角（按弹出方位分侧） | boolean | `false` |
| closeable | 是否显示关闭图标 | boolean | `false` |
| close-icon | 关闭图标名称（m-icon 图标名） | IconName | `cross` |
| close-icon-position | 关闭图标方位，可选值 `top-left` `top-right` `bottom-left` `bottom-right` | string | `top-right` |
| close-on-click-overlay | 是否在点击遮罩后自动关闭 | boolean | `true` |
| lazy-render | 是否在首次展示时才渲染面板（此后保留 DOM） | boolean | `true` |
| destroy-on-close | 关闭后是否销毁面板内容（关闭动画结束后销毁，重开时重建） | boolean | `false` |
| safe-area-inset-top | 是否增加顶部安全区间距 | boolean | `false` |
| safe-area-inset-bottom | 是否增加底部安全区间距 | boolean | `false` |
| before-close | 关闭前的回调，返回 `false` 可阻止关闭（作用于关闭图标与遮罩点击两条关闭路径） | (action: string) => boolean | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹出层显隐变化时触发（v-model 绑定） | value: boolean |
| click | 点击面板时触发 | event: MouseEvent |
| click-overlay | 点击遮罩时触发（面板区域点击不会触发） | event: MouseEvent |
| click-close-icon | 点击关闭图标时触发 | event: MouseEvent |
| open | 打开弹出层时触发 | - |
| opened | 打开动画结束时触发（`duration=0` 时立即触发） | - |
| close | 关闭弹出层时触发 | - |
| closed | 关闭动画结束时触发（`duration=0` 时立即触发） | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 弹出层内容 |

## 主题定制

弹出层样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-popup-background | 面板背景色 | #ffffff |
| $m-popup-round-radius | 圆角半径 | 16px |
| $m-popup-close-icon-size | 关闭图标大小 | 22px |
| $m-popup-close-icon-color | 关闭图标颜色 | #c8c9cc |
| $m-popup-close-icon-margin | 关闭图标边距 | 16px |
| $m-popup-close-icon-z-index | 关闭图标层级 | 1 |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- `lock-scroll` 不作为 prop 提供：Web 端显示期间始终锁定 body 滚动（继承 m-overlay 内置滚动锁，多实例计数），App 端全屏遮罩天然拦截触摸
- `teleport` / `transition` / `transition-appear` / `close-on-popstate` / `overlay-props` / `icon-prefix` 不支持：uni-app x 无对应能力或机制不同
- `z-index` 默认值沿用 overlay 体系默认 `1`（Vant 为 2000+ 动态递增），需要页面级层级控制时显式传入
- `z-index` / `duration` 收窄为 number 类型；`close-icon` 收窄为 m-icon 的 `IconName` 类型（IDE 自动提示）
- `before-close` 仅支持 boolean 同步返回，不支持 Promise 异步形态
- `overlay=false` 时为透明浮层：浮层仍拦截其覆盖区域的点击（Vant 中无遮罩时下层页面可直接交互），点击浮层覆盖区域会触发 `click-overlay` 事件
- `duration` / `z-index` 等字符串形态不再接受：UTS 强类型，不做隐式转换
