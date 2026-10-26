---
title: Text
subtitle: 文本
demo: pages-sub/text/text
---

## 介绍

文本组件是页面文字排版的基础组件，提供语义色、字号档位、单行与多行省略、文本可选等能力。

## 代码演示

### 基础用法 {#demo-basic}

默认展示主题正文色与中号字号。

```vue
<mxi-text>这是一段默认样式的文本。</mxi-text>
```

### 文本颜色 {#demo-color}

`color` 支持语义色名 `default` `secondary` `tertiary` `fourth` `primary` `success` `warning` `danger`，也支持任意 CSS 色值（如 `#7232dd`）。

```vue
<mxi-text color="secondary">次要文本颜色</mxi-text>
<mxi-text color="tertiary">三级文本颜色</mxi-text>
<mxi-text color="primary">主题文本颜色</mxi-text>
<mxi-text color="danger">危险文本颜色</mxi-text>
<mxi-text color="#7232dd">自定义色值</mxi-text>
```

### 字号档位 {#demo-size}

通过 `size` 属性设置字号档位，可选值为 `small` `medium` `large`，默认为 `medium`。

```vue
<mxi-text size="small">小号文本</mxi-text>
<mxi-text size="medium">中号文本</mxi-text>
<mxi-text size="large">大号文本</mxi-text>
```

### 单行省略 {#demo-ellipsis}

`truncated` 属性在文本超出宽度约束时显示省略号，需配合外部宽度约束使用；与 `line-clamp` 同传时本属性不生效。

```vue
<mxi-text truncated custom-style="max-width: 200px;">
	这是一段很长的文本，设置 truncated 后超出宽度显示省略号。
</mxi-text>
```

### 多行省略 {#demo-ellipsis-multi}

`line-clamp` 属性限制文本最大行数，超出部分显示省略号，为空时不限制。

```vue
<mxi-text :line-clamp="2" custom-style="max-width: 300px;">
	这是一段长文本，设置 line-clamp 为 2 后超出两行显示省略号。
</mxi-text>
```

### 文本可选 {#demo-selectable}

`user-select` 属性使文本可选中复制（web 端拖选，App 端长按）。

```vue
<mxi-text :user-select="true">这段文本可以选中复制。</mxi-text>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 文本颜色，可选值为 `default` `secondary` `tertiary` `fourth` `primary` `success` `warning` `danger` 或任意 CSS 色值 | string | `default` |
| size | 字号档位，可选值为 `small` `medium` `large` | TextSize | `medium` |
| truncated | 是否单行省略，与 line-clamp 同传时不生效 | boolean | `false` |
| line-clamp | 多行省略行数，为空不限制 | number \| null | null |
| user-select | 文本是否可选 | boolean | `false` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 文本内容 |

## 主题定制

文本样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $mxi-text-font-size-sm | small 档字号 | 12px |
| $mxi-text-font-size-md | medium 档字号 | 14px |
| $mxi-text-font-size-lg | large 档字号 | 16px |
| $mxi-text-color-secondary | secondary 次要文本色 | #646566 |
| $mxi-text-color-tertiary | tertiary 三级文本色 | #969799 |
| $mxi-text-color-fourth | fourth 四级文本色 | #c8c9cc |

完整变量与覆盖方式见[主题定制](/guide/theming)。
