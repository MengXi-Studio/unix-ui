<script setup lang="ts">
/** 版本号文案（如 '0.3.2'），由使用方传入，纯展示组件 */
defineProps<{
	/** 徽标展示的版本号 */
	version: string
}>()
</script>

<template>
	<!-- Props 表等行内场景的新增版本徽标：跟随参数名同行展示，配色与页头 DocHeader 徽标一致 -->
	<span class="version-badge">{{ version }}</span>
</template>

<style scoped>
.version-badge {
	display: inline-block;
	margin-left: 8px;
	padding: 1px 8px;
	border-radius: 10px;
	font-size: 12px;
	font-weight: 500;
	line-height: 16px;
	background: var(--vp-badge-tip-bg, var(--vp-c-tip-soft));
	color: var(--vp-badge-tip-text, var(--vp-c-tip-1));
	white-space: nowrap;
	vertical-align: middle;
	transform: translateY(-1px);
}
</style>
