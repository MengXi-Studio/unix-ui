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
			{ text: 'Tools', link: '/en/tools/date' },
			{ text: 'Changelog v0.6.0', link: '/en/changelog' },
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
					collapsed: false,
					items: [
						{ text: 'Introduction', link: '/en/guide/introduction' },
						{ text: 'Installation', link: '/en/guide/installation' },
						{ text: 'Quick Start', link: '/en/guide/getting-started' }
					]
				},
				{
					text: 'Fundamentals',
					collapsed: false,
					items: [{ text: 'Theming', link: '/en/guide/theming' }]
				},
				{
					text: 'Advanced',
					collapsed: false,
					items: [
						{ text: 'Compatibility', link: '/en/guide/compatibility' },
						{ text: 'FAQ', link: '/en/guide/faq' }
					]
				}
			],
			'/en/components/': [
				{
					text: 'Basic Components',
					collapsed: false,
					items: [
						{ text: 'Button', link: '/en/components/button' },
						{ text: 'Icon', link: '/en/components/icon' },
						{ text: 'Image', link: '/en/components/image' },
						{ text: 'Text', link: '/en/components/text' }
					]
				},
				{
					text: 'Layout Components',
					collapsed: false,
					items: [
						{ text: 'Compact', link: '/en/components/compact' },
						{ text: 'Divider', link: '/en/components/divider' },
						{ text: 'Flex', link: '/en/components/flex' },
						{ text: 'Grid', link: '/en/components/grid' },
						{ text: 'Layout', link: '/en/components/layout' },
						{ text: 'Space', link: '/en/components/space' },
						{ text: 'StatusBar', link: '/en/components/status-bar' },
						{ text: 'Sticky', link: '/en/components/sticky' },
						{ text: 'Waterfall', link: '/en/components/waterfall' }
					]
				},
				{
					text: 'Data Entry',
					collapsed: false,
					items: [
						{ text: 'Checkbox', link: '/en/components/checkbox' },
						{ text: 'CheckboxInput', link: '/en/components/checkbox-input' },
						{ text: 'CheckboxPopup', link: '/en/components/checkbox-popup' },
						{ text: 'ColorPicker', link: '/en/components/color-picker' },
						{ text: 'ColorPickerInput', link: '/en/components/color-picker-input' },
						{ text: 'ColorPickerPopup', link: '/en/components/color-picker-popup' },
						{ text: 'Input', link: '/en/components/input' }
					]
				},
				{
					text: 'Pickers',
					collapsed: false,
					items: [
						{ text: 'Cascader', link: '/en/components/cascader' },
						{ text: 'CascaderInput', link: '/en/components/cascader-input' },
						{ text: 'CascaderPopup', link: '/en/components/cascader-popup' },
						{ text: 'Picker', link: '/en/components/picker' },
						{ text: 'PickerInput', link: '/en/components/picker-input' },
						{ text: 'PickerPopup', link: '/en/components/picker-popup' },
						{ text: 'PickerView', link: '/en/components/picker-view' }
					]
				},
				{
					text: 'Date & Time',
					collapsed: false,
					items: [
						{ text: 'Calendar', link: '/en/components/calendar' },
						{ text: 'CalendarInput', link: '/en/components/calendar-input' },
						{ text: 'CalendarPopup', link: '/en/components/calendar-popup' },
						{ text: 'DatePicker', link: '/en/components/date-picker' },
						{ text: 'DatePickerInput', link: '/en/components/date-picker-input' },
						{ text: 'DatePickerPopup', link: '/en/components/date-picker-popup' },
						{ text: 'DateRangePicker', link: '/en/components/date-range-picker' },
						{ text: 'DateRangePickerInput', link: '/en/components/date-range-picker-input' },
						{ text: 'DateRangePickerPopup', link: '/en/components/date-range-picker-popup' },
						{ text: 'DateStrip', link: '/en/components/date-strip' },
						{ text: 'LunarPicker', link: '/en/components/lunar-picker' },
						{ text: 'LunarPickerInput', link: '/en/components/lunar-picker-input' },
						{ text: 'LunarPickerPopup', link: '/en/components/lunar-picker-popup' },
						{ text: 'TimePicker', link: '/en/components/time-picker' },
						{ text: 'TimePickerInput', link: '/en/components/time-picker-input' },
						{ text: 'TimePickerPopup', link: '/en/components/time-picker-popup' },
						{ text: 'TimeRangePicker', link: '/en/components/time-range-picker' },
						{ text: 'TimeRangePickerInput', link: '/en/components/time-range-picker-input' },
						{ text: 'TimeRangePickerPopup', link: '/en/components/time-range-picker-popup' }
					]
				},
				{
					text: 'Feedback Components',
					collapsed: false,
					items: [
						{ text: 'Fab', link: '/en/components/fab' },
						{ text: 'Loading', link: '/en/components/loading' },
						{ text: 'Overlay', link: '/en/components/overlay' },
						{ text: 'Popup', link: '/en/components/popup' },
						{ text: 'Toast', link: '/en/components/toast' }
					]
				},
				{
					text: 'Data Display',
					collapsed: false,
					items: [
						{ text: 'Badge', link: '/en/components/badge' },
						{ text: 'Cell', link: '/en/components/cell' }
					]
				},
				{
					text: 'Navigation Components',
					collapsed: false,
					items: [{ text: 'Tabs', link: '/en/components/tabs' }]
				}
			],
			'/en/tools/': [
				{
					text: 'Tools',
					collapsed: false,
					items: [{ text: 'Date', link: '/en/tools/date' }]
				}
			]
		}
	}
}
