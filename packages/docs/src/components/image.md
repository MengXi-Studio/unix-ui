---
title: Image
subtitle: 图片
demo: pages-sub/image/image
---

## 介绍

图片组件对原生 image 进行增强封装，`mode` 等原生能力同名直通透传，并扩展加载中与加载失败占位、淡入过渡、圆角与圆形等特性。

## 代码演示

### 基础用法 {#demo-basic}

`src` 为必填的图片地址，未传尺寸时默认宽度 100%、高度 240px；`width` 与 `height` 支持字符串（原样使用，支持 % 等单位）与数字（自动补 px）。

```vue
<m-image src="https://cdn.example.com/demo.jpg" />
<m-image src="https://cdn.example.com/demo.jpg" width="160px" height="160px" />
<m-image src="https://cdn.example.com/demo.jpg" :width="120" :height="120" />
```

### 填充模式 {#demo-mode}

通过 `mode` 属性设置裁剪缩放模式，与原生 image 的 mode 同名直通，默认为 `aspectFill`（裁剪填满、比例不变形）。

```vue
<m-image src="https://cdn.example.com/demo.jpg" width="110px" height="110px" mode="scaleToFill" />
<m-image src="https://cdn.example.com/demo.jpg" width="110px" height="110px" mode="aspectFit" />
<m-image src="https://cdn.example.com/demo.jpg" width="110px" height="110px" mode="widthFix" />
```

### 圆角与圆形 {#demo-radius}

通过 `radius` 属性设置圆角，`round` 属性展示为圆形（优先于 `radius`）。

```vue
<m-image src="https://cdn.example.com/demo.jpg" width="80px" height="80px" round />
<m-image src="https://cdn.example.com/demo.jpg" width="80px" height="80px" radius="8" />
<m-image src="https://cdn.example.com/demo.jpg" width="80px" height="80px" radius="16" />
```

### 加载与失败占位 {#demo-loading}

加载中与加载失败时默认展示占位图标，`loading-icon` 与 `error-icon` 可自定义占位图标，`icon-size` 设置占位图标大小；`show-loading` 与 `show-error` 可关闭占位；`loading` 与 `error` 插槽可自定义占位内容。

```vue
<m-image src="https://cdn.example.com/nonexistent.jpg" width="110px" height="110px" />
<m-image src="https://cdn.example.com/nonexistent.jpg" width="110px" height="110px" error-icon="photo-o" />
<m-image src="https://cdn.example.com/nonexistent.jpg" width="110px" height="110px" :show-error="false" />
```

### 懒加载与淡入 {#demo-lazy}

`lazy-load` 懒加载透传原生属性，限 page 与 scroll-view 下生效；`fade` 开启后图片加载完成时以 300ms 淡入显示，默认开启，换图时自动重置回加载态。

```vue
<m-image src="https://cdn.example.com/demo.jpg" width="130px" height="130px" lazy-load />
<m-image src="https://cdn.example.com/demo.jpg" width="130px" height="130px" :fade="false" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片资源地址 | string | - |
| mode | 裁剪缩放模式，与原生 image mode 同名直通 | ImageMode | `aspectFill` |
| lazy-load | 是否懒加载，透传原生 lazy-load 属性 | boolean | `false` |
| fade | 加载完成后是否淡入显示 | boolean | `true` |
| width | 图片宽度，number 自动补 px，未传默认 100% | string \| number \| null | null |
| height | 图片高度，number 自动补 px，未传默认 240px | string \| number \| null | null |
| radius | 圆角值，number 自动补 px | string \| number \| null | null |
| round | 是否展示为圆形，优先于 radius | boolean | `false` |
| show-loading | 是否显示加载中占位 | boolean | `true` |
| show-error | 是否显示加载失败占位 | boolean | `true` |
| loading-icon | 加载中占位图标名称 | IconName | `photo` |
| error-icon | 加载失败占位图标名称 | IconName | `photo-fail` |
| icon-size | 占位图标大小，纯数字自动补 px | string | `32` |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击图片时触发 | event: MouseEvent |
| load | 图片加载成功时触发，detail 含图片宽高 | event: UniImageLoadEvent |
| error | 图片加载失败时触发，detail 含错误信息 | event: UniImageErrorEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| loading | 加载中占位内容 |
| error | 加载失败占位内容 |
| default | 自定义内容，渲染为图片之后的兄弟节点 |

## 主题定制

图片样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-image-background | 加载中与失败占位背景色 | #f7f8fa |
| $m-image-icon-color | 占位图标颜色 | #dcdee0 |

完整变量与覆盖方式见[主题定制](/guide/theming)。
