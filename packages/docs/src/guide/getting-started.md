# 快速上手

## 前置条件

已完成[安装](/guide/installation)（uni_modules 或 npm 方式二选一），并能在页面中渲染出 `<m-button>`。

## 1. 在模板中使用组件

组件遵循 easycom 规范，无需 import 与注册，直接在模板中使用：

```html
<template>
	<m-button type="primary" @click="onClick">主要按钮</m-button>
</template>

<script setup lang="uts">
	function onClick(event: MouseEvent) {
		console.log('clicked')
	}
</script>
```

## 2. 属性绑定

props 与原生属性写法一致，布尔属性可直接书写或使用 `:` 绑定表达式：

```html
<!-- 类型与尺寸 -->
<m-button type="primary">主要按钮</m-button>
<m-button type="danger" size="large">危险大按钮</m-button>
<m-button type="success" size="small">成功小按钮</m-button>

<!-- 加载中：点击不触发，图标自动旋转 -->
<m-button type="primary" loading loading-text="提交中..." />

<!-- 禁用：点击不触发 -->
<m-button type="primary" disabled>禁用状态</m-button>
```

完整的属性列表见各组件文档的「Props」小节，例如 [Button 按钮](/components/button)。

## 3. 事件处理

事件通过 `@事件名` 绑定，处理函数按 UTS 类型标注参数：

```html
<template>
	<m-button type="primary" :loading="loading" @click="submit">
		提交
	</m-button>
</template>

<script setup lang="uts">
	const loading = ref(false)

	function submit() {
		loading.value = true
		// 模拟异步任务
		setTimeout(() => {
			loading.value = false
		}, 2000)
	}
</script>
```

::: tip
按钮处于 `loading` 或 `disabled` 状态时不会触发 `click`，因此异步提交期间无需额外做防重复点击处理。
:::

## 4. 双向绑定

表单类组件通过 `v-model` 双向绑定值：

```html
<template>
	<m-input v-model="value" :clearable="true" placeholder="请输入内容" />
</template>

<script setup lang="uts">
	const value = ref('')
</script>
```

## 5. 组合使用

容器类组件通过插槽组合子组件，例如用 `m-cell-group` 组织一组单元格：

```html
<m-cell-group inset>
	<m-cell title="单元格" value="内容" is-link />
	<m-cell title="带图标" icon="setting" is-link />
</m-cell-group>
```

按钮 / 输入框需要紧凑连接时，用 `m-compact` 包裹即可自动衔接圆角与边框：

```html
<m-compact>
	<m-button type="primary">确定</m-button>
	<m-button type="primary">取消</m-button>
</m-compact>
```

## 下一步

- [主题定制](/guide/theming)：覆盖默认主题变量，打造专属视觉
- [组件参考](/components/button)：查看全部组件的 Props 与事件
- [常见问题](/guide/faq)：编译与运行的高频问题
