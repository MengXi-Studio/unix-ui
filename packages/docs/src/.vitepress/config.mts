import { defineConfig } from 'vitepress'

// VitePress 文档站配置：srcDir 为 src（scripts 中以参数传入）
export default defineConfig({
	lang: 'zh-CN',
	title: 'unix-ui',
	description: '为 uni-app x 提供功能完善的 UI 组件库',
	themeConfig: {
		nav: [
			{ text: '指南', link: '/guide/getting-started' },
			{ text: '组件', link: '/components/button' },
			{ text: 'GitHub', link: 'https://github.com/MengXi-Studio/unix-ui' }
		],
		sidebar: {
			'/guide/': [
				{
					text: '指南',
					items: [{ text: '快速上手', link: '/guide/getting-started' }]
				}
			],
			'/components/': [
				{
					text: '基础组件',
					items: [{ text: 'Button 按钮', link: '/components/button' }]
				}
			]
		},
		socialLinks: [{ icon: 'github', link: 'https://github.com/MengXi-Studio/unix-ui' }],
		outline: [2, 3],
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
		}
	}
})
