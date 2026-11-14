---
title: Tabs
subtitle: 标签页
demo: pages-sub/tabs/tabs
added: 0.4.0
---

## 介绍

标签页组件，用于内容区域切换。支持 `line` / `card` / `pill` 三种风格、索引与 name 混用匹配、标签栏横向滚动、底部条与内容转场动画、手势滑动切换、吸顶（复用 [Sticky](/components/sticky)）、滚动导航（scrollspy）与切换前拦截。

组件为双形态：

- **插槽式**（主形态）：`m-tabs` 容器 + `m-tab` 子组件承载内容区，标题由容器按子组件注册快照渲染
- **纯标签栏**：传入 `options` 数组时只渲染标签栏（无内容区），配合 `v-model:active` 即插即用

## 代码演示

### 基础用法 {#demo-basic}

`v-model:active` 绑定索引；`m-tab` 的 `title` 为标签标题，默认插槽为内容：

```vue
<m-tabs v-model:active="active">
	<m-tab title="标签 1">内容 1</m-tab>
	<m-tab title="标签 2">内容 2</m-tab>
	<m-tab title="标签 3">内容 3</m-tab>
</m-tabs>
```

### 通过 name 匹配 {#demo-name}

`active` 支持索引与 name 混用（先按 name 分类型全等匹配，无命中回退索引并 clamp）：

```vue
<m-tabs v-model:active="activeName">
	<m-tab title="A 组" name="a">内容 A</m-tab>
	<m-tab title="B 组" name="b">内容 B</m-tab>
	<m-tab title="C 组" name="c">内容 C</m-tab>
</m-tabs>
```

### 标签栏滚动 {#demo-scroll}

标签数超过 `swipe-threshold`（默认 5）时标签栏自动横向滚动，激活标签平滑居中；未超过时标签平分布局：

```vue
<m-tabs :active="0" :swipe-threshold="5">
	<m-tab v-for="i in 10" :key="i" :title="'标签 ' + i">第 {{ i }} 个标签的内容</m-tab>
</m-tabs>
```

### 禁用标签 {#demo-disabled}

`disabled` 标签点击不切换，`click-tab` 事件照常派发：

```vue
<m-tabs :active="0">
	<m-tab title="可选">内容 1</m-tab>
	<m-tab title="禁用" disabled>不可达</m-tab>
	<m-tab title="可选">内容 3</m-tab>
</m-tabs>
```

### 样式风格 {#demo-type}

`type="card"` 卡片风格、`type="pill"` 药丸风格（标签收缩自适应宽度，激活项填充主题色）：

```vue
<m-tabs type="card" :active="0">
	<m-tab title="卡片 A">内容 A</m-tab>
	<m-tab title="卡片 B">内容 B</m-tab>
</m-tabs>
<m-tabs type="pill" :active="0" style="margin-top: 12px;">
	<m-tab title="药丸 A">内容 A</m-tab>
	<m-tab title="药丸 B">内容 B</m-tab>
</m-tabs>
```

### 底部条定制 {#demo-line}

`color` 派生底部条与激活色；`line-width` / `line-height` 自定义底部条尺寸（number 补 px / string 原样）：

```vue
<m-tabs color="#ee0a24" :line-width="24" :active="0">
	<m-tab title="红色">内容 1</m-tab>
	<m-tab title="主题">内容 2</m-tab>
</m-tabs>
```

### 内容动画与手势切换 {#demo-animated}

`animated` 开启轨道平移转场；`swipeable` 追加手势左右滑动切换（手势切换不触发 `before-change`）：

```vue
<m-tabs animated :active="0">
	<m-tab title="动画 1">内容 1</m-tab>
	<m-tab title="动画 2">内容 2</m-tab>
</m-tabs>
<m-tabs swipeable animated :active="0" style="margin-top: 12px;">
	<m-tab title="手势 1">内容 1</m-tab>
	<m-tab title="手势 2">内容 2</m-tab>
</m-tabs>
```

### 标题徽标与插槽 {#demo-badge}

`m-tab` 支持 `dot`（红点）/ `badge`（内容）/ `show-zero-badge`（0 值隐藏，默认 `true`）；`nav-left` / `nav-right` 插槽扩展标签栏两端：

```vue
<m-tabs :active="0">
	<m-tab title="红点" dot>内容</m-tab>
	<m-tab title="徽标" badge="8">内容</m-tab>
</m-tabs>
<m-tabs :active="0" style="margin-top: 12px;">
	<template #nav-left><text>左</text></template>
	<template #nav-right><text>右</text></template>
	<m-tab title="标签 1">内容 1</m-tab>
</m-tabs>
```

### 切换前拦截 {#demo-before-change}

`before-change` 返回 `false` 阻止本次切换（boolean 同步版，对齐 `m-popup` 的 `before-close`）：

```ts
/** 拦截示例：索引 2 的标签拒绝切换 */
function onBeforeChange(name: string | number | null, index: number): boolean {
	return index != 2
}
```

```vue
<m-tabs :active="0" :before-change="onBeforeChange">
	<m-tab title="可切 1">内容 1</m-tab>
	<m-tab title="被拦 2">内容 2</m-tab>
	<m-tab title="可切 3">内容 3</m-tab>
</m-tabs>
```

### 吸顶 {#demo-sticky}

`sticky` 开启吸顶（复用 m-sticky），需页面回传 `scroll-top`；`offset-top` 设置吸顶距离：

```vue
<scroll-view scroll-y @scroll="(e: UniScrollEvent) => (scrollTop = e.detail.scrollTop)">
	<m-tabs sticky :scroll-top="scrollTop">
		<m-tab title="吸顶 1">内容 1</m-tab>
		<m-tab title="吸顶 2">内容 2</m-tab>
	</m-tabs>
</scroll-view>
```

### 滚动导航 {#demo-scrollspy}

`scrollspy` 开启滚动导航：内容平铺展示，滚动时联动激活对应标签；点击标签先直接激活再滚动定位到对应内容块。同样依赖页面回传 `scroll-top`：

```vue
<m-tabs scrollspy sticky :scroll-top="scrollTop" :active="0">
	<m-tab title="区块 1">区块 1 的长内容</m-tab>
	<m-tab title="区块 2">区块 2 的长内容</m-tab>
	<m-tab title="区块 3">区块 3 的长内容</m-tab>
</m-tabs>
```

点击定位兼容两类滚动场景：组件向上查找首个可滚容器（scroll-view 内嵌）直接平移；找不到时回退 `uni.pageScrollTo` 页面级定位（App 端页面级滚动主路径）。

### 纯标签栏 {#demo-options}

传入 `options` 数组（`UTSJSONObject[]`）时只渲染标签栏，无内容区；字段名经 `field-names` 映射：

```ts
const tabOptions: UTSJSONObject[] = [
	{ label: '全部', value: 0 },
	{ label: '进行中', value: 1 },
	{ label: '已取消', value: 3, disabled: true }
]
```

```vue
<m-tabs v-model:active="optActive" :options="tabOptions" />
```

## API

### TabsProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 当前激活标签（`v-model:active`；索引或 name 混用：先按 name 分类型匹配，无命中回退索引） | string \| number | `0` |
| type | 样式风格：`line` 底部条 / `card` 卡片 / `pill` 药丸 | TabsType | `line` |
| color | 主题色（line 底部条、card / pill 选中填充、激活标题色派生；空串用主题变量） | string | `''` |
| background | 标签栏背景色（空串用主题变量） | string | `''` |
| duration | 底部条与内容切换动画时长（秒，0 禁用动画） | number | `0.3` |
| line-width | 底部条宽度（number 补 px / string 原样） | string \| number | `''` |
| line-height | 底部条高度（number 补 px / string 原样） | string \| number | `''` |
| animated | 是否开启内容切换转场动画（轨道模式） | boolean | `false` |
| border | 是否显示标签栏外边框（仅 line 风格生效） | boolean | `false` |
| ellipsis | 是否省略过长标题文字（仅平分布局生效） | boolean | `true` |
| sticky | 是否吸顶（复用 m-sticky，需页面回传 scroll-top） | boolean | `false` |
| shrink | 是否左侧收缩布局（标签不再平分，向左排列） | boolean | `false` |
| swipeable | 是否手势左右滑动切换内容（手势切换不触发 before-change） | boolean | `false` |
| lazy-render | 是否延迟渲染（标签首次激活才渲染内容） | boolean | `true` |
| scrollspy | 是否滚动导航（内容平铺展示，滚动联动激活；需页面回传 scroll-top） | boolean | `false` |
| show-header | 是否显示标签栏 | boolean | `true` |
| offset-top | 吸顶时与滚动容器顶部的距离（px） | number | `0` |
| swipe-threshold | 滚动阈值：标签数超过该值时标签栏开始横向滚动 | number | `5` |
| title-active-color | 标题选中态颜色（空串用主题变量派生） | string | `''` |
| title-inactive-color | 标题默认态颜色（空串用主题变量） | string | `''` |
| before-change | 切换前拦截回调（返回 false 阻止；手势切换不触发） | TabsBeforeChange \| null | `null` |
| options | options 数组（纯标签栏形态：label / value / disabled / dot / badge，无内容区） | UTSJSONObject[] \| null | `null` |
| field-names | options 字段名映射（null 用默认） | TabsFieldNames \| null | `null` |
| scroll-top | 页面滚动距离 px（sticky 与 scrollspy 依赖页面 / 滚动容器回传） | number | `0` |
| custom-class | 根节点自定义类名 | string.ClassString | - |
| custom-style | 根节点自定义内联样式 | string | - |

### TabsFieldNames

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签文字字段名 | string | `label` |
| value | 标签值字段名（作为 name） | string | `value` |
| disabled | 禁用字段名 | string | `disabled` |
| dot | 红点字段名 | string | `dot` |
| badge | 徽标字段名 | string | `badge` |

### TabProps（m-tab）

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标签标题文本 | string | `''` |
| name | 标签标识（null 按索引匹配） | string \| number \| null | `null` |
| disabled | 是否禁用 | boolean | `false` |
| dot | 是否展示红点 | boolean | `false` |
| badge | 徽标内容文本 | string | `''` |
| show-zero-badge | 徽标为 0 时是否展示 | boolean | `true` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:active | 激活标签变化（`v-model:active`；值为标签 name，未指定 name 时为索引） | name: string \| number |
| change | 激活标签变化（交互路径派发；scrollspy 滚动联动与外部回灌不派发） | name: string \| number \| null, index: number |
| click-tab | 点击标签（含禁用标签） | event: TabsClickEvent |
| sticky-change | 吸顶状态变化（sticky 模式透传 m-sticky） | isFixed: boolean |

### TabsClickEvent

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| index | 注册序 | number |
| name | 标签标识（未指定 name 时为 null） | string \| number \| null |
| title | 标签标题文本 | string |
| disabled | 是否禁用 | boolean |

### Methods

通过 [ref](https://cn.vuejs.org/guide/essentials/template-refs.html) 获取组件实例调用：

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| scrollTo | 滚动定位到指定标签（scrollspy 模式） | target: string \| number（name 或索引） | - |

### Slots

| 名称 | 说明 |
| --- | --- |
| 默认 | `m-tab` 子组件列表（options 模式忽略） |
| nav-left | 标签栏左侧扩展 |
| nav-right | 标签栏右侧扩展 |

## 主题定制

标签页样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-tabs-background | 标签页背景色 | #ffffff |
| $m-tabs-tab-height | 标签高度 | 44px |
| $m-tabs-tab-font-size | 标签字号 | 14px |
| $m-tabs-tab-color | 标签文字颜色 | #323233 |
| $m-tabs-tab-active-color | 激活标签文字颜色 | #1989fa |
| $m-tabs-line-width | 底部条宽度 | 40px |
| $m-tabs-line-height | 底部条高度 | 3px |
| $m-tabs-line-radius | 底部条圆角 | 3px |
| $m-tabs-card-height | card 风格标签高度 | 30px |
| $m-tabs-card-radius | card 风格圆角 | 8px |
| $m-tabs-pill-height | pill 风格标签高度 | 30px |
| $m-tabs-pill-radius | pill 风格圆角 | 999px |
| $m-tabs-border-color | 标签栏外边框颜色 | #ebedf0 |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- 组件拆分：Vant 为单组件（Tab 由 Tabs 容器解析插槽），本项目拆为 `m-tabs` 容器 + `m-tab` 子项；uni-app x 无 VNode 移动能力，标题栏由容器按子组件注册快照渲染，因此**不支持 `title` 插槽与标题样式自定义**（内容在 `m-tab` 默认插槽自渲染）
- `options` 数组形态为本项目扩展：纯标签栏无内容区，`label / value / disabled / dot / badge` 字段经 `field-names` 映射
- `swipe-threshold` 为本项目扩展 prop：Vant 由 CSS 变量控制滚动布局，本项目以标签数阈值切换平分 / 滚动布局
- `before-change` 为 boolean 同步版（对齐 `m-popup` 的 `before-close`），Vant 支持 Promise 异步拦截
- 吸顶与滚动导航依赖页面回传 `scroll-top`（受控协议，对齐 m-sticky），Vant 自行监听页面滚动
- swipeable 手势切换为自行编排的轨道平移 + touch 手势（uni-app x 无法将子组件放入 swiper-item），手势切换不触发 `before-change`；真机手势体验以 App 端为准
- 标签 `render` 自定义渲染函数不支持（UTS 无 VNode），`badge` 以文本形式呈现
