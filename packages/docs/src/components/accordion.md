---
title: Accordion
subtitle: 手风琴
demo: pages-sub/display/accordion/accordion
added: 0.8.0
---

## 介绍

通过折叠收纳内容，允许同时展开一个或多个面板。由容器 `m-accordion` 与面板 `m-accordion-item` 组合使用，支持单选 / 多选展开、单项与全局禁用、隐藏分隔线、圆角卡片形态、展开 / 收起高度过渡动画与实例方法控制。

> 值形态统一为数组（`v-model:value`）：`multiple` 为 `false` 时容器保证最多一项；未传 `value` 时容器自持状态（非受控），传入后以外部值为准。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-accordion v-model:value="active">
	<m-accordion-item title="面板 1" name="1">面板 1 的内容</m-accordion-item>
	<m-accordion-item title="面板 2" name="2">面板 2 的内容</m-accordion-item>
</m-accordion>
```

```uts
const active = ref<AccordionValueArray>(emptyAccordionValues())
```

### 展开多个 {#demo-multiple}

```vue
<m-accordion v-model:value="active" multiple>
	<m-accordion-item title="面板 A" name="a">内容 A</m-accordion-item>
	<m-accordion-item title="面板 B" name="b">内容 B</m-accordion-item>
</m-accordion>
```

### 非受控用法 {#demo-uncontrolled}

不传 `value` 时由容器自持展开状态，`change` 事件仍照常派发：

```vue
<m-accordion @change="onChange">
	<m-accordion-item title="面板 1">内容</m-accordion-item>
</m-accordion>
```

### 禁用状态 {#demo-disabled}

```vue
<m-accordion v-model:value="active">
	<m-accordion-item title="可点击" name="1">内容</m-accordion-item>
	<m-accordion-item title="单项禁用" name="2" disabled>内容</m-accordion-item>
</m-accordion>

<m-accordion v-model:value="active" disabled>
	<m-accordion-item title="全局禁用" name="1">内容</m-accordion-item>
</m-accordion>
```

面板 `disabled` 与容器 `disabled` 取或；禁用时头部点击仍派发 `click` 事件但不切换。

### 隐藏分隔线与圆角卡片 {#demo-style}

```vue
<m-accordion hide-border>...</m-accordion>
<m-accordion inset>...</m-accordion>
```

`hide-border` 关闭全部分隔线；`inset` 追加外边距与圆角，最后一项自动隐藏分隔线。

### 插槽自定义 {#demo-slot}

```vue
<m-accordion v-model:value="active">
	<m-accordion-item name="1">
		<template #title>自定义标题</template>
		<template #extra>扩展区</template>
		内容
	</m-accordion-item>
	<m-accordion-item title="作用域箭头" name="2">
		<template #arrow="{ visible }">
			<text>{{ visible ? '−' : '+' }}</text>
		</template>
		内容
	</m-accordion-item>
</m-accordion>
```

### 实例方法 {#demo-method}

```uts
const accordionRef = ref<ComponentPublicInstance | null>(null)

function openFirst() {
	const inst = accordionRef.value
	if (inst != null) inst.$callMethod('open', '1')
}
```

### 懒渲染 {#demo-lazy}

`lazy-render` 默认 `true`，面板内容首次展开才渲染；关闭后随组件挂载即渲染。

```vue
<m-accordion :lazy-render="false">...</m-accordion>
```

## API

### Accordion Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 展开面板标识集合（v-model:value） | `AccordionValueArray` | `null` |
| multiple | 是否可同时展开多个面板 | boolean | `false` |
| disabled | 是否禁用全部面板 | boolean | `false` |
| hide-border | 是否隐藏分隔线 | boolean | `false` |
| inset | 是否为圆角卡片形态 | boolean | `false` |
| duration | 展开 / 收起动画时长，秒（0 直接显隐） | number | `0.3` |
| lazy-render | 是否首次展开才渲染内容 | boolean | `true` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Accordion Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 展开集合变化（v-model:value） | value: `AccordionValueArray` |
| change | 展开集合变化（交互路径派发） | value: `AccordionValueArray`, name: `string \| number` |

### Accordion Methods

| 方法 | 说明 |
| --- | --- |
| open(name) | 展开指定面板 |
| close(name) | 收起指定面板 |
| toggle(name) | 切换指定面板展开态 |
| closeAll() | 收起全部面板 |

### Accordion Slots

| 名称 | 说明 |
| --- | --- |
| default | 面板列表（`m-accordion-item`） |

### AccordionItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 面板标题 | string | `''` |
| extra | 标题右侧扩展文本 | string | `''` |
| name | 面板唯一标识（缺省以注册序兜底） | string \| number | `null` |
| disabled | 是否禁用本面板 | boolean | `false` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### AccordionItem Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 头部点击（含禁用态，恒派发） | event: MouseEvent |

### AccordionItem Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 面板内容 | - |
| title | 自定义标题 | - |
| extra | 自定义扩展区 | - |
| arrow | 自定义箭头 | visible: boolean |

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-accordion-background | 面板底色 | 白色 |
| $m-accordion-border-color | 分隔线颜色 | #ebedf0 |
| $m-accordion-header-padding-x | 头部水平内边距 | 16px |
| $m-accordion-header-padding-y | 头部垂直内边距 | 10px |
| $m-accordion-header-active-color | 头部按压态底色 | #f2f3f5 |
| $m-accordion-title-font-size | 标题字号 | 14px |
| $m-accordion-title-color | 标题颜色 | 主文本色 |
| $m-accordion-extra-font-size | 扩展文本字号 | 12px |
| $m-accordion-extra-color | 扩展文本颜色 | #969799 |
| $m-accordion-extra-margin | 扩展文本与箭头间距 | 8px |
| $m-accordion-arrow-color | 箭头颜色 | #c8c9cc |
| $m-accordion-arrow-size | 箭头尺寸 | 16px |
| $m-accordion-body-padding-y | 内容区垂直内边距 | 16px |
| $m-accordion-body-padding-x | 内容区水平内边距 | 16px |
| $m-accordion-disabled-opacity | 禁用态透明度 | 0.5 |
| $m-accordion-inset-margin | 圆角卡片外边距 | 12px |
| $m-accordion-inset-radius | 圆角卡片圆角 | 主题中圆角 |
