import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const META_URL = 'https://mengxi-studio.github.io/unix-ui/'
export const META_DESCRIPTION = '为 uni-app x 提供功能完善的 UI 组件库'

export const zhConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
	/** 网站配置 描述 */
	description: META_DESCRIPTION,

	/** 网站配置 头信息 */
	head: [
		['meta', { property: 'og:url', content: META_URL }],
		['meta', { property: 'og:description', content: META_DESCRIPTION }],
		['meta', { property: 'twitter:url', content: META_URL }],
		['meta', { property: 'twitter:title', content: 'unix-ui' }],
		['meta', { property: 'twitter:description', content: META_DESCRIPTION }]
	],

	/** 网站主题配置 */
	themeConfig: {
		/** 本地搜索（中文翻译） */
		search: {
			provider: 'local',
			options: {
				translations: {
					button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
					modal: {
						noResultsText: '未找到相关结果',
						resetButtonTitle: '清除查询条件',
						displayDetails: '显示详细列表',
						footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
					}
				}
			}
		},

		/** 编辑链接 */
		editLink: {
			pattern: 'https://github.com/MengXi-Studio/unix-ui/edit/master/packages/docs/:path',
			text: '对本页提出修改建议'
		},

		/** 大纲标题与层级 */
		outline: [2, 3],
		outlineTitle: '本页内容',

		/** 导航栏 */
		nav: [
			{ text: '指南', link: '/guide/introduction' },
			{ text: '组件', link: '/components/button' },
			{ text: '更新日志', link: '/changelog' },
			{
				text: '相关链接',
				items: [
					{ text: 'Discussions', link: 'https://github.com/MengXi-Studio/unix-ui/discussions' },
					{ text: 'Releases', link: 'https://github.com/MengXi-Studio/unix-ui/releases' }
				]
			}
		],

		sidebar: {
			'/guide/': [
				{
					text: '入门',
					items: [
						{ text: '介绍', link: '/guide/introduction' },
						{ text: '安装', link: '/guide/installation' },
						{ text: '快速上手', link: '/guide/getting-started' }
					]
				},
				{
					text: '基础',
					items: [{ text: '主题定制', link: '/guide/theming' }]
				},
				{
					text: '进阶',
					items: [
						{ text: '平台兼容性', link: '/guide/compatibility' },
						{ text: '常见问题', link: '/guide/faq' }
					]
				}
			],
			'/components/': [
				{
					text: '基础组件',
					items: [
						{ text: 'Button 按钮', link: '/components/button' },
						{ text: 'Loading 加载', link: '/components/loading' }
					]
				}
			]
		}
	}
}
