/**
 * RouteNameMap 字面量类型增强（由 @meng-xi/unix-router/vite-plugin 生成）
 * 供 WEB 端 RouteName 类型推导；原生端 UTS 不支持 keyof 组合，仍为 string。
 */
import '@/uni_modules/ux-router/utssdk/index.uts'

declare module '@/uni_modules/ux-router/utssdk/index.uts' {
	interface RouteNameMap {
		/** unix-ui 组件演示 */
		home: 'pages/index/index'
		/** 徽标 Badge */
		badge: 'pages-sub/badge/badge'
		/** 按钮 Button */
		button: 'pages-sub/button/button'
		/** 日历输入框 CalendarInput */
		'calendar-input': 'pages-sub/calendar-input/calendar-input'
		/** 日历弹出框 CalendarPopup */
		'calendar-popup': 'pages-sub/calendar-popup/calendar-popup'
		/** 日历 Calendar */
		calendar: 'pages-sub/calendar/calendar'
		/** 级联选择 Cascader */
		cascader: 'pages-sub/cascader/cascader'
		/** 单元格 Cell */
		cell: 'pages-sub/cell/cell'
		/** 紧凑布局 Compact */
		compact: 'pages-sub/compact/compact'
		/** 分割线 Divider */
		divider: 'pages-sub/divider/divider'
		/** 弹性布局 Flex */
		flex: 'pages-sub/flex/flex'
		/** 宫格 Grid */
		grid: 'pages-sub/grid/grid'
		/** 图标 Icon */
		icon: 'pages-sub/icon/icon'
		/** 图片 Image */
		image: 'pages-sub/image/image'
		/** 输入框 Input */
		input: 'pages-sub/input/input'
		/** 布局 Layout */
		layout: 'pages-sub/layout/layout'
		/** 加载 Loading */
		loading: 'pages-sub/loading/loading'
		/** 遮罩层 Overlay */
		overlay: 'pages-sub/overlay/overlay'
		/** 弹出层 Popup */
		popup: 'pages-sub/popup/popup'
		/** 间距 Space */
		space: 'pages-sub/space/space'
		/** 状态栏 StatusBar */
		'status-bar': 'pages-sub/status-bar/status-bar'
		/** 粘性布局 Sticky */
		sticky: 'pages-sub/sticky/sticky'
		/** 文本 Text */
		text: 'pages-sub/text/text'
		/** 轻提示 Toast */
		toast: 'pages-sub/toast/toast'
		/** 瀑布流 Waterfall */
		waterfall: 'pages-sub/waterfall/waterfall'
	}
}
