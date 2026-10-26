# 快速上手

## 前置条件

完成[安装](/guide/installation)（uni_modules 或 npm 方式二选一）。

## 使用组件

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

## 常用示例

### 按钮类型与尺寸

```html
<m-button type="primary">主要按钮</m-button>
<m-button type="danger" size="large">危险大按钮</m-button>
<m-button type="success" size="small">成功小按钮</m-button>
```

### 状态控制

```html
<!-- 加载中：点击不触发，图标自动旋转 -->
<m-button type="primary" loading loading-text="提交中..." />

<!-- 禁用：点击不触发 -->
<m-button type="primary" disabled>禁用状态</m-button>
```

### 动态加载

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

完整属性与事件见 [Button 按钮](/components/button)。

## 下一步

- [主题定制](/guide/theming)：覆盖默认主题变量，打造专属视觉
- [Button 按钮](/components/button)：查看全部 Props 与事件
- [常见问题](/guide/faq)：编译与运行的高频问题
