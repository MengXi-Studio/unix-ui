---
demo: pages-sub/cell/cell
---

# Cell 单元格

单元格为列表中的每一行提供内容容器，常用于设置页、信息列表等场景，支持标题、内容、描述、图标、箭头、尺寸与分组等特性。

## 引入

组件遵循 easycom 规范，无需引入即可使用，详见[快速上手](/guide/getting-started)。

## 代码演示

### 基础用法

通过 `title` 与 `value` 设置左右两侧内容，`label` 在标题下方添加描述文字。

```vue
<mxi-cell-group>
	<mxi-cell title="单元格" value="内容" />
	<mxi-cell title="单元格" value="内容" label="描述信息" />
</mxi-cell-group>
```

### 单元格尺寸

通过 `size` 属性设置单元格尺寸，可选值为 `normal` `large`，默认为 `normal`。

```vue
<mxi-cell title="单元格" value="内容" size="large" />
<mxi-cell title="单元格" value="内容" label="描述信息" size="large" />
```

### 图标

通过 `icon` 属性在标题左侧展示图标，取值为图标名称，为 null 时不展示。

```vue
<mxi-cell title="位置" icon="location-o" />
<mxi-cell title="商店" icon="shop-o" />
```

### 链接与箭头方向

`is-link` 属性展示右侧箭头，`arrow-direction` 控制箭头方向，可选值为 `left` `up` `down` `right`，默认为 `right`；`clickable` 控制是否展示按压反馈，默认取 `is-link` 的值，显式设置后以本值为准。

```vue
<mxi-cell title="默认右箭头" is-link />
<mxi-cell title="向左箭头" is-link arrow-direction="left" />
<mxi-cell title="向上箭头" is-link arrow-direction="up" value="内容" />
<mxi-cell title="仅按压反馈" clickable />
```

### 单元格分组

`mxi-cell-group` 将多个单元格包裹为分组，`title` 属性设置分组标题；`inset` 属性将分组展示为两侧留白的圆角卡片，此时不显示外边框；组内末个单元格的分隔线自动隐藏，也可通过 `border: false` 强制关闭分隔线。

```vue
<mxi-cell-group title="分组 1">
	<mxi-cell title="单元格" value="内容" />
	<mxi-cell title="单元格" value="内容" />
</mxi-cell-group>
<mxi-cell-group inset>
	<mxi-cell title="单元格" value="内容" />
	<mxi-cell title="单元格" value="内容" />
</mxi-cell-group>
```

### 必填星号

`required` 属性在标题前展示必填星号。

```vue
<mxi-cell title="手机号" required />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 左侧标题 | string | `''` |
| value | 右侧内容 | string | `''` |
| label | 标题下方描述文字 | string | `''` |
| size | 尺寸，可选值为 `normal` `large` | CellSize | `normal` |
| icon | 左侧图标名称，为 null 时不展示 | IconName \| null | null |
| border | 是否显示分隔线，组内末线自动隐藏 | boolean | `true` |
| center | 是否使内容垂直居中 | boolean | `false` |
| clickable | 是否展示按压反馈，默认取 isLink 值 | boolean \| null | null |
| is-link | 是否展示右侧箭头 | boolean | `false` |
| arrow-direction | 箭头方向，可选值为 `left` `up` `down` `right` | CellArrowDirection | `right` |
| required | 是否展示必填星号 | boolean | `false` |
| title-style | 标题自定义内联样式 | string | - |
| title-class | 标题自定义类名 | string | - |
| value-class | 值自定义类名 | string | - |
| label-class | 描述自定义类名 | string | - |
| title | 分组标题（CellGroup） | string | `''` |
| inset | 是否为圆角卡片分组，两侧留白且无外边框（CellGroup） | boolean | `false` |
| border | 是否显示组外边框，inset 模式下无外框（CellGroup） | boolean | `true` |
| custom-class | 自定义根节点类名（Cell 与 CellGroup） | string.ClassString | - |
| custom-style | 自定义根节点内联样式（Cell 与 CellGroup） | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击单元格时触发 | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| icon | 左侧图标 |
| title | 标题内容（Cell 与 CellGroup） |
| label | 描述文字 |
| value | 右侧内容 |
| extra | 右侧扩展内容，位于 value 与箭头之间 |
| default | 单元格列表内容（CellGroup） |

## 主题定制

单元格样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $mxi-cell-font-size | 文字字号 | 14px |
| $mxi-cell-vertical-padding | 垂直内边距 | 10px |
| $mxi-cell-horizontal-padding | 水平内边距 | 16px |
| $mxi-cell-text-color | 标题文字颜色 | #323233 |
| $mxi-cell-background | 背景色 | #fff |
| $mxi-cell-border-color | 分隔线颜色 | #ebedf0 |
| $mxi-cell-active-color | 按压反馈背景色 | #f2f3f5 |
| $mxi-cell-required-color | 必填星号颜色 | #ee0a24 |
| $mxi-cell-label-color | 描述文字颜色 | #969799 |
| $mxi-cell-label-font-size | 描述文字字号 | 12px |
| $mxi-cell-value-color | 值文字颜色 | #969799 |
| $mxi-cell-icon-margin | 左侧图标右边距 | 8px |
| $mxi-cell-arrow-margin | 箭头左边距 | 4px |
| $mxi-cell-right-icon-color | 箭头颜色 | #c8c9cc |
| $mxi-cell-large-vertical-padding | 大尺寸垂直内边距 | 12px |
| $mxi-cell-large-title-font-size | 大尺寸标题字号 | 16px |
| $mxi-cell-large-label-font-size | 大尺寸描述字号 | 14px |
| $mxi-cell-group-background | 分组背景色（CellGroup） | #fff |
| $mxi-cell-group-title-color | 分组标题颜色（CellGroup） | #969799 |
| $mxi-cell-group-title-padding | 分组标题内边距（CellGroup） | 16px 16px 8px |
| $mxi-cell-group-title-font-size | 分组标题字号（CellGroup） | 14px |
| $mxi-cell-group-inset-radius | 卡片分组圆角（CellGroup） | 8px |
| $mxi-cell-group-inset-padding | 卡片分组外边距（CellGroup） | 0 16px |

完整变量与覆盖方式见[主题定制](/guide/theming)。
