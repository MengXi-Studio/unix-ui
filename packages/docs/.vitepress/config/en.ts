import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const META_URL = 'https://mengxi-studio.github.io/unix-ui/en/'
export const META_DESCRIPTION = 'A full-featured UI component library for uni-app x'

export const enConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
	/** Site description */
	description: META_DESCRIPTION,

	/** Site head tags */
	head: [
		['meta', { property: 'og:url', content: META_URL }],
		['meta', { property: 'og:description', content: META_DESCRIPTION }],
		['meta', { property: 'twitter:url', content: META_URL }],
		['meta', { property: 'twitter:title', content: 'unix-ui' }],
		['meta', { property: 'twitter:description', content: META_DESCRIPTION }]
	],

	/** Theme config */
	themeConfig: {
		/** Local search (English is the default, no translations needed) */
		search: { provider: 'local' },

		/** Edit link */
		editLink: {
			pattern: 'https://github.com/MengXi-Studio/unix-ui/edit/master/packages/docs/:path',
			text: 'Edit this page on GitHub'
		},

		/** Outline */
		outline: [2, 3],
		outlineTitle: 'On this page',

		/** Nav bar */
		nav: [
			{ text: 'Guide', link: '/en/guide/introduction' },
			{ text: 'Components', link: '/en/components/button' },
			{ text: 'Changelog', link: '/en/changelog' },
			{
				text: 'Links',
				items: [
					{ text: 'Discussions', link: 'https://github.com/MengXi-Studio/unix-ui/discussions' },
					{ text: 'Releases', link: 'https://github.com/MengXi-Studio/unix-ui/releases' }
				]
			}
		],

		sidebar: {
			'/en/guide/': [
				{
					text: 'Getting Started',
					items: [
						{ text: 'Introduction', link: '/en/guide/introduction' },
						{ text: 'Installation', link: '/en/guide/installation' },
						{ text: 'Quick Start', link: '/en/guide/getting-started' }
					]
				},
				{
					text: 'Fundamentals',
					items: [{ text: 'Theming', link: '/en/guide/theming' }]
				},
				{
					text: 'Advanced',
					items: [
						{ text: 'Compatibility', link: '/en/guide/compatibility' },
						{ text: 'FAQ', link: '/en/guide/faq' }
					]
				}
			],
			'/en/components/': [
				{
					text: 'Basic Components',
					items: [
						{ text: 'Button', link: '/en/components/button' },
						{ text: 'Icon', link: '/en/components/icon' },
						{ text: 'Image', link: '/en/components/image' },
						{ text: 'Text', link: '/en/components/text' }
					]
				},
				{
					text: 'Feedback Components',
					items: [
						{ text: 'Loading', link: '/en/components/loading' },
						{ text: 'Overlay', link: '/en/components/overlay' },
						{ text: 'Popup', link: '/en/components/popup' },
						{ text: 'Toast', link: '/en/components/toast' }
					]
				},
				{
					text: 'Layout Components',
					items: [
						{ text: 'Compact', link: '/en/components/compact' },
						{ text: 'Divider', link: '/en/components/divider' },
						{ text: 'Grid', link: '/en/components/grid' },
						{ text: 'Layout', link: '/en/components/layout' },
						{ text: 'Space', link: '/en/components/space' }
					]
				},
				{
					text: 'Data Display',
					items: [
						{ text: 'Badge', link: '/en/components/badge' },
						{ text: 'Cell', link: '/en/components/cell' }
					]
				}
			]
		}
	}
}
