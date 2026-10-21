# Button 按钮

按钮用于触发一个操作，如提交表单。API 对标 [Vant Button](https://vant-ui.github.io/vant/#/zh-CN/button)。

## 引入

组件遵循 easycom 规范，无需引入即可使用，详见[快速上手](/guide/getting-started)。

## 代码演示

### 按钮类型

支持 `default`、`primary`、`success`、`warning`、`danger` 五种类型，默认为 `default`。

```html
<mxi-button type="primary">主要按钮</mxi-button>
<mxi-button type="success">成功按钮</mxi-button>
<mxi-button type="danger">危险按钮</mxi-button>
<mxi-button type="warning">警告按钮</mxi-button>
<mxi-button type="default">默认按钮</mxi-button>
```

### 朴素按钮

通过 `plain` 属性将按钮设置为朴素按钮，朴素按钮的文字为按钮颜色，背景为白色。

```html
<mxi-button type="primary" plain>朴素按钮</mxi-button>
```

### 细边框

通过 `hairline` 属性设置 0.5px 边框（基于 `scale(0.5)` 实现）。

```html
<mxi-button type="primary" plain hairline>细边框按钮</mxi-button>
```

### 禁用状态

通过 `disabled` 属性禁用按钮，禁用状态下按钮不可点击。

```html
<mxi-button type="primary" disabled>禁用状态</mxi-button>
```

### 加载状态

通过 `loading` 属性设置按钮为加载状态，加载状态下按钮不可点击；`loading-text` 可自定义加载文字。

```html
<mxi-button type="primary" loading />
<mxi-button type="primary" loading loading-text="加载中..." />
```

### 按钮尺寸

支持 `large`、`normal`、`small`、`mini` 四种尺寸，默认为 `normal`。

```html
<mxi-button type="primary" size="large">大号按钮</mxi-button>
<mxi-button type="primary" size="normal">普通按钮</mxi-button>
<mxi-button type="primary" size="small">小型按钮</mxi-button>
<mxi-button type="primary" size="mini">迷你按钮</mxi-button>
```

### 块级元素

`block` 属性将使按钮宽度撑满父容器。

```html
<mxi-button type="primary" block>块级按钮</mxi-button>
```

### 自定义颜色

通过 `color` 属性自定义按钮颜色，支持 `linear-gradient` 渐变。

```html
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

按钮样式可通过以下 SCSS 变量定制（在 `uni.scss` 引入主题变量文件前定义）：

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

完整变量见包内 `theme/vars.scss`。
