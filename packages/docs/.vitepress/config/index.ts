import { defineConfig } from 'vitepress'
import { sharedConfig } from './shared'
import { zhConfig } from './zh'
import { enConfig } from './en'

export default defineConfig({
	...sharedConfig,

	/** 文档源目录 */
	srcDir: './src',

	/**
	 * 本地搜索 provider 必须置顶层：VitePress 构建期旗标（__VP_LOCAL_SEARCH__）只读顶层
	 * themeConfig（不合并 locale 配置），写在 locale 内会导致搜索按钮整体不渲染。
	 * 按钮与弹层的多语言文案仍由各 locale 的 search.options.translations 提供。
	 */
	themeConfig: {
		search: {
			provider: 'local'
		}
	},

	/** 网站支持的语言：中文为默认（root），英语为 /en/ */
	locales: {
		root: { label: '简体中文', lang: 'zh-CN', link: '/', ...zhConfig },
		en: { label: 'English', lang: 'en-US', link: '/en/', ...enConfig }
	}
})
