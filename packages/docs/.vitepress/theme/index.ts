import { computed, defineComponent, h } from 'vue'
import { useData } from 'vitepress'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeBadges from './components/HomeBadges.vue'
import DemoPhone from './components/DemoPhone.vue'
import './styles/demo.css'

/**
 * 站点根布局组件：默认主题扩展
 *
 * 1. 首页 hero 下方挂载徽章组件
 * 2. frontmatter.demo 声明的组件页在 aside 顶部挂载手机模拟器，
 *    并为根节点追加 has-doc-demo 类启用三栏演示布局
 */
const UnixLayout = defineComponent({
	name: 'UnixLayout',
	setup() {
		const { page } = useData()

		/** 组件页演示路由（frontmatter.demo），非演示页为空 */
		const demoPath = computed(() => page.value.frontmatter.demo as string | undefined)

		return () =>
			h(
				'div',
				{ class: ['unix-layout', demoPath.value ? 'has-doc-demo' : ''] },
				[
					h(DefaultTheme.Layout, null, {
						'home-hero-after': () => h(HomeBadges),
						...(demoPath.value
							? { 'aside-top': () => h(DemoPhone, { path: demoPath.value as string }) }
							: {})
					})
				]
			)
	}
})

/**
 * 主题入口：VitePress 将 default export 作为 Theme 对象消费，
 * Layout 键为根布局组件，extends 保留默认主题其余能力
 */
export default {
	extends: DefaultTheme,
	Layout: UnixLayout
} satisfies Theme
