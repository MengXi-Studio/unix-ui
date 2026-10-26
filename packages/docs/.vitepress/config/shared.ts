import { defineConfig } from 'vitepress'

/** 网站部署基础路径（CI 可经 DOCS_BASE 注入，本地默认 /unix-ui/） */
const base = process.env.DOCS_BASE || '/unix-ui/'

/** 将根路径资源拼接到当前 base 下，避免 favicon 等资源 404 */
const asset = (p: string) => base + p.replace(/^\//, '')

/** 组件演示（playground）同站部署路径：CI 可经 DEMO_BASE 注入，本地默认子路径 */
const demoBase = (process.env.DEMO_BASE || '/unix-ui/playground/').replace(/\/?$/, '/')

export const sharedConfig = defineConfig({
	/** 构建期常量：注入演示页部署路径供 DemoPhone 组件消费 */
	vite: {
		define: {
			__DEMO_BASE__: JSON.stringify(demoBase)
		}
	},

	/** 网站标题 */
	title: 'unix-ui',

	/** 网站部署基础路径 */
	base,

	lastUpdated: true,

	markdown: {
		/** 代码块高亮主题 */
		theme: {
			dark: 'one-dark-pro',
			light: 'github-light'
		},
		/** UTS 是 TypeScript 的超集，按 TypeScript 高亮 */
		languageAlias: { uts: 'typescript' }
	},

	/** 网站头标签 */
	head: [
		['link', { rel: 'icon', type: 'image/png', href: asset('logo.png') }],
		['link', { rel: 'icon', href: asset('favicon.ico') }],

		['meta', { property: 'og:type', content: 'website' }],
		['meta', { property: 'og:title', content: 'unix-ui' }],

		['meta', { property: 'twitter:card', content: 'summary' }],
		['meta', { property: 'twitter:title', content: 'unix-ui' }],
		['meta', { property: 'twitter:description', content: 'A full-featured UI component library for uni-app x' }]
	],

	/** 网站主题配置 */
	themeConfig: {
		/** 主题 logo（VitePress 自动拼 base） */
		logo: '/logo.png',

		/** 社交链接 */
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/MengXi-Studio/unix-ui' },
			{ icon: 'npm', link: 'https://www.npmjs.com/package/@meng-xi/unix-ui' }
		],

		/** 页脚 */
		footer: {
			copyright: 'Copyright © 2026-present 梦曦工作室',
			message: 'Released under the MIT License.'
		}
	}
})
