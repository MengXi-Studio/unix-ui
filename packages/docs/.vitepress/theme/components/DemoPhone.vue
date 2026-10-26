<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { setupCodeCollapse } from '../code-collapse'

/** 构建期注入的演示页同站部署路径（开发环境直连 dev server，不消费该值） */
declare const __DEMO_BASE__: string

const props = defineProps<{
	/** playground 演示页路由路径（如 pages-sub/button/button） */
	path: string
	/** 无障碍标题，缺省取 path */
	title?: string
}>()

const { lang, page, hash } = useData()

/** 是否中文界面（控件文案区分语言） */
const isZh = computed(() => lang.value.startsWith('zh'))

/** 组件页代码演示区折叠增强（随演示页挂载注册） */
setupCodeCollapse(() => isZh.value)

/** 模拟器锚点前缀：正文 h3 以 {#demo-<id>} 声明联动锚点，其余 hash 不联动 */
const DEMO_HASH_PREFIX = '#demo-'

/** 当前路由 hash 对应的演示分节 id（非联动锚点时为 null；hash 由 useData 提供，hashchange 时响应式更新） */
const demoSectionId = computed(() => {
	const value = hash.value
	return value.startsWith(DEMO_HASH_PREFIX) ? value.slice(DEMO_HASH_PREFIX.length) : null
})

/** iframe 引用：postMessage 发送目标 */
const iframeRef = ref<HTMLIFrameElement | null>(null)

/**
 * 通知模拟器内演示页滚动到锚点分节（演示页经 demo-bridge 组件接收）
 * 调用时机：hash 变化 + iframe load（兜底从外页带锚点直达时 iframe 尚未挂载的时序）
 */
const sendDemoScroll = () => {
	const id = demoSectionId.value
	if (id != null && iframeRef.value != null) {
		iframeRef.value.contentWindow?.postMessage({ type: 'demo-scroll', id }, '*')
	}
}

watch(demoSectionId, sendDemoScroll)

/** 本地开发直连 playground dev server（manifest 固定端口 5174，router.base 与生产一致） */
const DEV_ORIGIN = 'http://localhost:5174/unix-ui/playground/'

/** 演示页地址：开发环境指向 dev server，构建产物指向同站部署路径；iframe 携带 navbar=0 隐藏演示页自绘导航 */
const src = computed(() => (import.meta.env.DEV ? DEV_ORIGIN : __DEMO_BASE__) + props.path + '?navbar=0')

/** 新窗口打开地址：不带嵌入参数，保留演示页自绘导航供独立浏览 */
const openSrc = computed(() => (import.meta.env.DEV ? DEV_ORIGIN : __DEMO_BASE__) + props.path)

/** 导航栏标题：优先页面标题（VitePress 由 h1 推导），缺省回退 props.title / path */
const navTitle = computed(() => {
	const pageTitle = page.value.title as string | undefined
	return pageTitle || props.title || props.path
})

/** 缩放下限（百分比） */
const MIN_SCALE = 50
/** 缩放上限（百分比） */
const MAX_SCALE = 150
/** 缩放步进（百分比） */
const STEP = 10

/** 当前缩放百分比：默认 85%，保证 1440px 视口下三栏不溢出 */
const scale = ref(85)

/** 缩小一档 */
const zoomOut = () => {
	scale.value = Math.max(MIN_SCALE, scale.value - STEP)
}

/** 放大一档 */
const zoomIn = () => {
	scale.value = Math.min(MAX_SCALE, scale.value + STEP)
}

/** 手机设计宽度（390px iPhone 逻辑分辨率） */
const DESIGN_W = 390
/** 手机设计高度（844px iPhone 逻辑分辨率） */
const DESIGN_H = 844

/** 外框显示尺寸：transform 不改变布局尺寸，需按比例显式设宽高避免溢出 */
const frameStyle = computed(() => ({
	width: (DESIGN_W * scale.value) / 100 + 'px',
	height: (DESIGN_H * scale.value) / 100 + 'px'
}))

/** 机身设计尺寸 + 缩放变换（原点左上，与外框对齐） */
const deviceStyle = computed(() => ({
	width: DESIGN_W + 'px',
	height: DESIGN_H + 'px',
	transform: 'scale(' + scale.value / 100 + ')'
}))

/** 打开链接的无障碍标题 */
const linkTitle = computed(() => props.title || props.path)
</script>

<template>
	<div class="demo-phone">
		<div class="demo-phone__frame" :style="frameStyle">
			<div class="demo-phone__device" :style="deviceStyle">
				<div class="demo-phone__screen-wrap">
					<div class="demo-phone__statusbar">
						<span class="demo-phone__time">14:21</span>
						<span class="demo-phone__island" />
						<span class="demo-phone__signals">
							<!-- 蜂窝信号（四段柱状） -->
							<svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
								<rect x="0" y="7" width="3" height="4" rx="0.8" />
								<rect x="4.6" y="4.8" width="3" height="6.2" rx="0.8" />
								<rect x="9.2" y="2.4" width="3" height="8.6" rx="0.8" />
								<rect x="13.8" y="0" width="3" height="11" rx="0.8" />
							</svg>
							<!-- 无线网络（三段弧） -->
							<svg
								width="16"
								height="12"
								viewBox="0 0 16 12"
								fill="none"
								stroke="currentColor"
								stroke-width="1.7"
								stroke-linecap="round"
								aria-hidden="true"
							>
								<path d="M1.6 4.1a10 10 0 0 1 12.8 0" />
								<path d="M3.9 6.7a6.6 6.6 0 0 1 8.2 0" />
								<path d="M6.2 9.2a3.2 3.2 0 0 1 3.6 0" />
							</svg>
							<!-- 电池 -->
							<svg width="23" height="11" viewBox="0 0 23 11" fill="none" aria-hidden="true">
								<rect x="0.5" y="0.5" width="19" height="10" rx="3" stroke="currentColor" opacity="0.4" />
								<rect x="2" y="2" width="16" height="7" rx="1.6" fill="currentColor" />
								<path d="M21 3.6v3.8a2 2 0 0 0 0-3.8Z" fill="currentColor" opacity="0.4" />
							</svg>
						</span>
					</div>
					<div class="demo-phone__navbar">
						<span class="demo-phone__nav-arrow" aria-hidden="true">
							<svg
								width="11"
								height="18"
								viewBox="0 0 11 18"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M9.3 1.6 2 9l7.3 7.4" />
							</svg>
						</span>
						<span class="demo-phone__nav-title">{{ navTitle }}</span>
						<span class="demo-phone__nav-spacer" />
					</div>
					<iframe ref="iframeRef" class="demo-phone__screen" :src="src" :title="linkTitle" @load="sendDemoScroll" />
				</div>
			</div>
		</div>
		<div class="demo-phone__toolbar">
			<button
				class="demo-phone__btn"
				type="button"
				:aria-label="isZh ? '缩小' : 'Zoom out'"
				@click="zoomOut"
			>
				−
			</button>
			<span class="demo-phone__scale">{{ scale }}%</span>
			<button
				class="demo-phone__btn"
				type="button"
				:aria-label="isZh ? '放大' : 'Zoom in'"
				@click="zoomIn"
			>
				+
			</button>
			<a class="demo-phone__open" :href="openSrc" target="_blank" rel="noopener">
				{{ isZh ? '在新窗口打开' : 'Open in new window' }}
				<svg
					width="10"
					height="10"
					viewBox="0 0 10 10"
					fill="none"
					stroke="currentColor"
					stroke-width="1.3"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M4 1.5H1.5v7h7V6" />
					<path d="M6 1h3v3M9 1 5 5" />
				</svg>
			</a>
		</div>
	</div>
</template>

<style scoped>
.demo-phone {
	position: relative;
}

/* 工具栏：深色胶囊悬空于机身上方（不叠压机身，不随缩放） */
.demo-phone__toolbar {
	position: absolute;
	bottom: calc(100% + 8px);
	left: 50%;
	z-index: 2;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 7px 16px;
	border-radius: 999px;
	background: #111318;
	color: #fff;
	font-size: 12px;
	line-height: 1;
	white-space: nowrap;
	transform: translateX(-50%);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.demo-phone__btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 18px;
	height: 18px;
	padding: 0;
	border: 0;
	background: transparent;
	color: inherit;
	font-size: 14px;
	line-height: 1;
	cursor: pointer;
	transition: color 0.25s;
}

.demo-phone__btn:hover {
	color: var(--vp-c-brand-1);
}

.demo-phone__scale {
	min-width: 34px;
	text-align: center;
	font-variant-numeric: tabular-nums;
}

.demo-phone__open {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	color: inherit;
	font-size: 12px;
	text-decoration: none;
	transition: color 0.25s;
}

.demo-phone__open:hover {
	color: var(--vp-c-brand-1);
}

/* 机身 */
.demo-phone__device {
	box-sizing: border-box;
	position: relative;
	padding: 8px;
	border-radius: 54px;
	background: #111318;
	box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
	overflow: hidden;
	transform-origin: top left;
}

/* 屏幕：状态栏 + 导航栏 + 演示内容纵向排布 */
.demo-phone__screen-wrap {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	border-radius: 46px;
	overflow: hidden;
	background: var(--vp-c-bg);
}

/* 状态栏：时间 + 灵动岛 + 信号/网络/电池 */
.demo-phone__statusbar {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex: none;
	height: 50px;
	padding: 0 24px 0 30px;
	color: var(--vp-c-text-1);
}

.demo-phone__time {
	font-size: 15px;
	font-weight: 600;
	letter-spacing: 0.2px;
}

.demo-phone__island {
	position: absolute;
	top: 12px;
	left: 50%;
	width: 96px;
	height: 27px;
	margin-left: -48px;
	border-radius: 15px;
	background: #111318;
}

.demo-phone__signals {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

/* 导航栏：返回箭头 + 居中标题 */
.demo-phone__navbar {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex: none;
	height: 44px;
	padding: 0 14px;
	border-bottom: 1px solid var(--vp-c-divider);
	color: var(--vp-c-text-1);
}

.demo-phone__nav-arrow {
	display: inline-flex;
	color: var(--vp-c-text-1);
}

.demo-phone__nav-title {
	position: absolute;
	left: 50%;
	max-width: 62%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 15px;
	font-weight: 600;
	transform: translateX(-50%);
}

.demo-phone__nav-spacer {
	width: 11px;
}

/* 演示内容区：填充状态栏与导航栏以下剩余空间 */
.demo-phone__screen {
	display: block;
	flex: 1;
	width: 100%;
	min-height: 0;
	border: 0;
	background: var(--vp-c-bg);
}
</style>
