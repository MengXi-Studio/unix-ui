<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

/** 页头主标题（frontmatter.title，组件文档页必填） */
const title = computed(() => frontmatter.value.title as string | undefined)

/** 页头副题（frontmatter.subtitle，中文组件名，缺省不渲染） */
const subtitle = computed(() => frontmatter.value.subtitle as string | undefined)
</script>

<template>
	<!-- 组件文档页页头：接管正文主标题，大标题 + 灰色副题 + 粗分割线 -->
	<header v-if="title" class="doc-header">
		<h1 class="doc-header__title">
			{{ title }}
			<span v-if="subtitle" class="doc-header__subtitle">{{ subtitle }}</span>
		</h1>
	</header>
</template>

<style scoped>
.doc-header {
	padding-bottom: 20px;
	margin-bottom: 8px;
	border-bottom: 1px solid var(--vp-c-divider);
}

.doc-header__title {
	display: flex;
	align-items: baseline;
	margin: 0;
	font-size: 40px;
	font-weight: 700;
	line-height: 1.25;
	color: var(--vp-c-text-1);
}

.doc-header__subtitle {
	margin-left: 12px;
	font-size: 20px;
	font-weight: 500;
	color: var(--vp-c-text-3);
}

@media (max-width: 767px) {
	.doc-header__title {
		font-size: 32px;
	}
}
</style>
