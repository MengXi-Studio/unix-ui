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
			{ text: '工具', link: '/tools/date' },
			{ text: '更新日志 v0.6.0', link: '/changelog' },
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
					collapsed: false,
					items: [
						{ text: '介绍', link: '/guide/introduction' },
						{ text: '安装', link: '/guide/installation' },
						{ text: '快速上手', link: '/guide/getting-started' }
					]
				},
				{
					text: '基础',
					collapsed: false,
					items: [{ text: '主题定制', link: '/guide/theming' }]
				},
				{
					text: '进阶',
					collapsed: false,
					items: [
						{ text: '平台兼容性', link: '/guide/compatibility' },
						{ text: '常见问题', link: '/guide/faq' }
					]
				}
			],
			'/components/': [
				{
					text: '基础组件',
					collapsed: false,
					items: [
						{ text: 'Button 按钮', link: '/components/button' },
						{ text: 'Icon 图标', link: '/components/icon' },
						{ text: 'Image 图片', link: '/components/image' },
						{ text: 'Text 文本', link: '/components/text' }
					]
				},
				{
					text: '布局组件',
					collapsed: false,
					items: [
						{ text: 'Compact 紧凑布局', link: '/components/compact' },
						{ text: 'Divider 分割线', link: '/components/divider' },
						{ text: 'Flex 弹性布局', link: '/components/flex' },
						{ text: 'Grid 宫格', link: '/components/grid' },
						{ text: 'Layout 布局', link: '/components/layout' },
						{ text: 'Space 间距', link: '/components/space' },
						{ text: 'StatusBar 状态栏', link: '/components/status-bar' },
						{ text: 'Sticky 粘性布局', link: '/components/sticky' },
						{ text: 'Waterfall 瀑布流', link: '/components/waterfall' }
					]
				},
				{
					text: '数据录入',
					collapsed: false,
					items: [
						{ text: 'Checkbox 复选框', link: '/components/checkbox' },
						{ text: 'CheckboxInput 复选输入框', link: '/components/checkbox-input' },
						{ text: 'CheckboxPopup 复选弹出框', link: '/components/checkbox-popup' },
						{ text: 'ColorPicker 颜色选择器', link: '/components/color-picker' },
						{ text: 'ColorPickerInput 颜色选择器输入框', link: '/components/color-picker-input' },
						{ text: 'ColorPickerPopup 颜色选择器弹出框', link: '/components/color-picker-popup' },
						{ text: 'Input 输入框', link: '/components/input' }
					]
				},
				{
					text: '选择器',
					collapsed: false,
					items: [
						{ text: 'Cascader 级联选择', link: '/components/cascader' },
						{ text: 'CascaderInput 级联输入框', link: '/components/cascader-input' },
						{ text: 'CascaderPopup 级联弹出框', link: '/components/cascader-popup' },
						{ text: 'Picker 选择器', link: '/components/picker' },
						{ text: 'PickerInput 选择器输入框', link: '/components/picker-input' },
						{ text: 'PickerPopup 选择器弹出框', link: '/components/picker-popup' },
						{ text: 'PickerView 选择器纯视图', link: '/components/picker-view' }
					]
				},
				{
					text: '日期时间',
					collapsed: false,
					items: [
						{ text: 'Calendar 日历', link: '/components/calendar' },
						{ text: 'CalendarInput 日历输入框', link: '/components/calendar-input' },
						{ text: 'CalendarPopup 日历弹出框', link: '/components/calendar-popup' },
						{ text: 'DatePicker 日期选择', link: '/components/date-picker' },
						{ text: 'DatePickerInput 日期输入框', link: '/components/date-picker-input' },
						{ text: 'DatePickerPopup 日期选择弹出框', link: '/components/date-picker-popup' },
						{ text: 'DateRangePicker 日期范围选择', link: '/components/date-range-picker' },
						{ text: 'DateRangePickerInput 日期范围输入框', link: '/components/date-range-picker-input' },
						{ text: 'DateRangePickerPopup 日期范围弹出框', link: '/components/date-range-picker-popup' },
						{ text: 'DateStrip 日期横条', link: '/components/date-strip' },
						{ text: 'LunarPicker 农历选择', link: '/components/lunar-picker' },
						{ text: 'LunarPickerInput 农历输入框', link: '/components/lunar-picker-input' },
						{ text: 'LunarPickerPopup 农历选择弹出框', link: '/components/lunar-picker-popup' },
						{ text: 'TimePicker 时间选择', link: '/components/time-picker' },
						{ text: 'TimePickerInput 时间输入框', link: '/components/time-picker-input' },
						{ text: 'TimePickerPopup 时间弹出框', link: '/components/time-picker-popup' },
						{ text: 'TimeRangePicker 时间范围选择', link: '/components/time-range-picker' },
						{ text: 'TimeRangePickerInput 时间范围输入框', link: '/components/time-range-picker-input' },
						{ text: 'TimeRangePickerPopup 时间范围弹出框', link: '/components/time-range-picker-popup' }
					]
				},
				{
					text: '反馈组件',
					collapsed: false,
					items: [
						{ text: 'Fab 悬浮按钮', link: '/components/fab' },
						{ text: 'Loading 加载', link: '/components/loading' },
						{ text: 'Overlay 遮罩层', link: '/components/overlay' },
						{ text: 'Popup 弹出层', link: '/components/popup' },
						{ text: 'Toast 轻提示', link: '/components/toast' }
					]
				},
				{
					text: '数据展示',
					collapsed: false,
					items: [
						{ text: 'Badge 徽标', link: '/components/badge' },
						{ text: 'Cell 单元格', link: '/components/cell' }
					]
				},
				{
					text: '导航组件',
					collapsed: false,
					items: [{ text: 'Tabs 标签页', link: '/components/tabs' }]
				}
			],
			'/tools/': [
				{
					text: '工具',
					collapsed: false,
					items: [{ text: 'Date 日期工具', link: '/tools/date' }]
				}
			]
		}
	}
}
