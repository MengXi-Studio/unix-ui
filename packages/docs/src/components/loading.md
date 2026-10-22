# Loading 加载

加载图标用于表示页面或操作的加载状态。API 对标 [Vant Loading](https://vant-ui.github.io/vant/#/zh-CN/loading)。

## 引入

组件遵循 easycom 规范，无需引入即可使用，详见[快速上手](/guide/getting-started)。

## 代码演示

### 基础用法

```html
<mxi-loading />
```

### 加载类型

支持 `circular`（弧段圆环，默认）与 `spinner`（花瓣）两种类型。

```html
<mxi-loading />
<mxi-loading type="spinner" />
```

### 自定义颜色

通过 `color` 属性自定义加载图标的颜色，支持 CSS 色值与语义色名（`default` / `primary` / `success` / `warning` / `danger` / `white`）；语义色名编译期绑定主题变量，在 `uni.scss` 中覆盖对应 `$mxi-color-*` 变量即可生效。

```html
<mxi-loading color="#1989fa" />
<mxi-loading type="spinner" color="#07c160" />
<mxi-loading type="spinner" color="primary" />
```

### 自定义大小

通过 `size` 属性自定义加载图标的大小，支持纯数字（自动补 `px`）、带单位字符串或 `100%`（撑满外部定尺寸容器），默认为 `30px`。

```html
<mxi-loading size="16" />
<mxi-loading type="spinner" size="24" />
```

### 加载文案

将加载文案放在默认插槽中；`vertical` 属性可将图标与文案垂直排列。

```html
<mxi-loading>加载中...</mxi-loading>
<mxi-loading type="spinner" size="24" vertical>加载中...</mxi-loading>
```

### 自定义文字样式

通过 `text-size` 与 `text-color` 属性自定义文案的字号与颜色。

```html
<mxi-loading text-size="16" text-color="#1989fa">加载中...</mxi-loading>
```

### 自定义图标

通过 `icon` 插槽替换默认图标，替换后的图标仍按 `type` 对应的节奏旋转。

```html
<mxi-loading>
	<template #icon>
		<text style="font-size: 24px;">❀</text>
	</template>
</mxi-loading>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 加载类型，可选值为 `circular` `spinner` | LoadingType | `circular` |
| color | 加载图标颜色，支持 CSS 色值与语义色名（`default` `primary` `success` `warning` `danger` `white`） | string | - |
| size | 加载图标大小，支持纯数字、带单位字符串或 `100%`（撑满外部定尺寸容器） | string | - |
| vertical | 是否垂直排列图标与文字 | boolean | `false` |
| text-size | 文字字号，支持纯数字或带单位字符串 | string | - |
| text-color | 文字颜色 | string | - |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 加载文案 |
| icon | 自定义加载图标（替换默认图标） |

## 主题定制

加载样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $mxi-loading-spinner-size | 加载图标尺寸 | 30px |
| $mxi-loading-spinner-color | 加载图标颜色 | #c8c9cc |
| $mxi-loading-text-color | 文字颜色 | #646566 |
| $mxi-loading-text-font-size | 文字字号 | 14px |
| $mxi-loading-text-gap | 图标与文字间距 | 4px |

完整变量与覆盖方式见[主题定制](/guide/theming)。
