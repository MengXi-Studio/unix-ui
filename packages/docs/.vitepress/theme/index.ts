import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomeBadges from './components/HomeBadges.vue'

// 默认主题扩展：首页 hero 下方挂载徽章组件
export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			'home-hero-after': () => h(HomeBadges)
		})
	}
} satisfies Theme
