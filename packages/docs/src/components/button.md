---
title: Button
subtitle: 按钮
demo: pages-sub/button/button
---

## 介绍

按钮用于触发一个操作，如提交表单。支持类型、尺寸、朴素、圆形、方形、块级、禁用与加载状态等特性。

## 代码演示

### 按钮类型 {#demo-type}

支持 `default`、`primary`、`success`、`warning`、`danger` 五种类型，默认为 `default`。

```vue
<mxi-button type="primary">主要按钮</mxi-button>
<mxi-button type="success">成功按钮</mxi-button>
<mxi-button type="danger">危险按钮</mxi-button>
<mxi-button type="warning">警告按钮</mxi-button>
<mxi-button type="default">默认按钮</mxi-button>
```

### 朴素按钮 {#demo-plain}

通过 `plain` 属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。

```vue
<mxi-button type="primary" plain>朴素按钮</mxi-button>
```

### 细边框

通过 `hairline` 属性设置 0.5px 边框（基于 `scale(0.5)` 实现）。

```vue
<mxi-button type="primary" plain hairline>细边框按钮</mxi-button>
```

### 禁用状态 {#demo-disabled}

通过 `disabled` 属性禁用按钮，禁用状态下按钮不可点击。

```vue
<mxi-button type="primary" disabled>禁用状态</mxi-button>
```

### 加载状态 {#demo-loading}

通过 `loading` 属性设置按钮为加载状态，加载状态下按钮不可点击；`loading-text` 可自定义加载文字；`loading-type` 可切换加载图标形态（`circular` 圆环旋转 / `spinner` 花瓣旋转），图标由 [Loading](/components/loading) 组件承载。

```vue
<mxi-button type="primary" loading />
<mxi-button type="primary" loading loading-text="加载中..." />
<mxi-button type="primary" loading loading-type="spinner" />
```

### 按压反馈

按钮按下时整体透明度降为 0.8，松开后恢复；`disabled` 与 `loading` 状态不出现按压反馈（基于 `hover-class` 实现）。

```vue
<mxi-button type="primary">按下查看按压反馈</mxi-button>
```

### 按钮尺寸 {#demo-size}

支持 `large`、`normal`、`small`、`mini` 四种尺寸，默认为 `normal`。

```vue
<mxi-button type="primary" size="large">大号按钮</mxi-button>
<mxi-button type="primary" size="normal">普通按钮</mxi-button>
<mxi-button type="primary" size="small">小型按钮</mxi-button>
<mxi-button type="primary" size="mini">迷你按钮</mxi-button>
```

### 块级元素 {#demo-block}

`block` 属性将使按钮宽度撑满父容器。

```vue
<mxi-button type="primary" block>块级按钮</mxi-button>
```

### 自定义颜色 {#demo-color}

通过 `color` 属性自定义按钮颜色，支持 `linear-gradient` 渐变。

```vue
<mxi-button color="#7232dd">单色按钮</mxi-button>
<mxi-button color="linear-gradient(to right, #ff6034, #ee0a24)">渐变按钮</mxi-button>
<mxi-button color="#7232dd" plain>彩色按钮</mxi-button>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 类型，可选值为 `primary` `success` `warning` `danger` | ButtonType | `default` |
| size | 尺寸，可选值为 `large` `normal` `small` `mini` | ButtonSize | `normal` |
| plain | 是否为朴素按钮 | boolean | `false` |
| round | 是否为圆形按钮 | boolean | `false` |
| square | 是否为方形按钮 | boolean | `false` |
| disabled | 是否禁用按钮 | boolean | `false` |
| hairline | 是否使用 0.5px 边框 | boolean | `false` |
| block | 是否为块级元素 | boolean | `false` |
| loading | 是否显示为加载状态 | boolean | `false` |
| loading-text | 加载状态提示文字 | string | - |
| loading-type | 加载图标类型，可选值为 `circular` `spinner` | LoadingType | `circular` |
| color | 自定义按钮颜色，支持 `linear-gradient` 渐变 | string | - |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击按钮时触发（按钮处于加载或禁用状态时不触发） | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 按钮内容 |

## 主题定制

按钮样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $mxi-color-primary | 主要色 | #1989fa |
| $mxi-color-success | 成功色 | #07c160 |
| $mxi-color-warning | 警告色 | #ff976a |
| $mxi-color-danger | 危险色 | #ee0a24 |
| $mxi-button-normal-height | 常规按钮高度 | 44px |
| $mxi-button-large-height | 大号按钮高度 | 50px |
| $mxi-button-small-height | 小型按钮高度 | 32px |
| $mxi-button-mini-height | 迷你按钮高度 | 24px |
| $mxi-button-radius | 按钮圆角 | 8px |
| $mxi-button-active-opacity | 按压时透明度 | 0.8 |

完整变量与覆盖方式见[主题定制](/guide/theming)。
