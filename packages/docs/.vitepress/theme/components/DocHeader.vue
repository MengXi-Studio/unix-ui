<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, lang } = useData()

/** 页头主标题（frontmatter.title，组件文档页必填） */
const title = computed(() => frontmatter.value.title as string | undefined)

/** 页头副题（frontmatter.subtitle，中文组件名，缺省不渲染） */
const subtitle = computed(() => frontmatter.value.subtitle as string | undefined)

/** 新增版本号（frontmatter.added，如 '0.2.0'，缺省不渲染徽标） */
const added = computed(() => frontmatter.value.added as string | undefined)

/** 版本徽标文案：中文页「x.y.z 新增」/ 英文页「New in x.y.z」 */
const addedText = computed(() => {
	if (!added.value) {
		return ''
	}
	return lang.value.startsWith('zh') ? added.value + ' 新增' : 'New in ' + added.value
})
</script>

<template>
	<!-- 组件文档页页头：接管正文主标题，大标题 + 灰色副题 + 粗分割线；
	     frontmatter.added 声明的新增版本以行内徽标跟在副题后，与标题同行不再游离 -->
	<header v-if="title" class="doc-header">
		<h1 class="doc-header__title">
			{{ title }}
			<span v-if="subtitle" class="doc-header__subtitle">{{ subtitle }}</span>
			<span v-if="addedText" class="doc-header__badge">{{ addedText }}</span>
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

/* 版本徽标：复用默认主题 VPBadge tip 配色，跟随标题行内展示 */
.doc-header__badge {
	align-self: center;
	margin-left: 12px;
	padding: 2px 10px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
	line-height: 18px;
	background: var(--vp-badge-tip-bg, var(--vp-c-tip-soft));
	color: var(--vp-badge-tip-text, var(--vp-c-tip-1));
	white-space: nowrap;
}

@media (max-width: 767px) {
	.doc-header__title {
		font-size: 32px;
	}
}
</style>
