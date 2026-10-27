---
title: Overlay
subtitle: 遮罩层
demo: pages-sub/overlay/overlay
---

## 介绍

创建一个全屏遮罩层，通常用于阻断用户与页面内容的交互，是弹窗类组件的基础（后续 Popup、Dialog 等组件基于它实现）。

## 代码演示

### 基础用法 {#demo-basic}

通过 `show` 属性控制显示，点击遮罩后在 `click` 回调中将 `show` 置为 `false` 关闭（遮罩不会自动关闭）。

```vue
<m-button type="primary" @click="show = true">显示遮罩</m-button>
<m-overlay :show="show" @click="show = false" />
```

### 嵌入内容 {#demo-content}

通过默认插槽在遮罩层内嵌入任意内容；配合 `custom-style` 传入 flex 居中样式可使内容块居中。点击内容时通过 `@click.stop` 阻止冒泡，避免误触遮罩关闭。

```vue
<m-overlay :show="show" custom-style="display: flex; align-items: center; justify-content: center;" @click="show = false">
	<view @click.stop>内容</view>
</m-overlay>
```

### 指定挂载层级与浅色遮罩 {#demo-z-index}

`z-index` 控制遮罩层级；`custom-style` 可覆盖默认背景色（如浅色半透明遮罩）。

```vue
<m-overlay :show="show" :z-index="10" custom-style="background-color: rgba(255, 255, 255, 0.6);" />
```

### 设置动画时长 {#demo-duration}

`duration` 设置淡入淡出动画时长（单位：秒），默认 `0.3`；设置为 `0` 表示无动画。

```vue
<m-overlay :show="show" :duration="2" />
<m-overlay :show="show" :duration="0" />
```

### 滚动锁定（Web 端） {#demo-lock-scroll}

Web 端遮罩显示期间自动锁定 `body` 滚动（`overflow: hidden`），关闭或组件卸载后还原；多实例堆叠时按计数锁定，全部关闭后才解锁。App 端全屏 fixed 遮罩天然拦截触摸，无需处理。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示遮罩层 | boolean | `false` |
| z-index | z-index 层级 | number | `1` |
| duration | 动画时长（秒），`0` 表示无动画 | number | `0.3` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击遮罩时触发（不自动关闭，需在回调中置 `show` 为 `false`） | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 遮罩层内容 |

## 主题定制

遮罩层样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-overlay-z-index | 遮罩层 z-index | 1 |
| $m-overlay-background | 遮罩层背景色 | rgba(0, 0, 0, 0.7) |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- `lock-scroll` 不作为 prop 提供：Web 端显示期间始终锁定 body 滚动（多实例计数），App 端全屏遮罩天然拦截触摸
- `teleport` 不支持：uni-app x 无对应能力
- `z-index` / `duration` 收窄为 number 类型：UTS 强类型，不做 string 隐式转换
- `class-name` 命名调整为 `custom-class`（本库惯例）
