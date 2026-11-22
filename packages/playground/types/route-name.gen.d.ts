/**
 * RouteNameMap 字面量类型增强（由 @meng-xi/unix-router/vite-plugin 生成）
 * 供 WEB 端 RouteName 类型推导；原生端 UTS 不支持 keyof 组合，仍为 string。
 */
import '@/uni_modules/ux-router/utssdk/index.uts'

declare module '@/uni_modules/ux-router/utssdk/index.uts' {
	interface RouteNameMap {
		/** unix-ui 组件演示 */
		home: 'pages/index/index'
		/** 按钮 Button */
		button: 'pages-sub/basic/button/button'
		/** 图标 Icon */
		icon: 'pages-sub/basic/icon/icon'
		/** 图片 Image */
		image: 'pages-sub/basic/image/image'
		/** 文本 Text */
		text: 'pages-sub/basic/text/text'
		/** 日历输入框 CalendarInput */
		'calendar-input': 'pages-sub/datetime/calendar-input/calendar-input'
		/** 日历弹出框 CalendarPopup */
		'calendar-popup': 'pages-sub/datetime/calendar-popup/calendar-popup'
		/** 日历 Calendar */
		calendar: 'pages-sub/datetime/calendar/calendar'
		/** 日期输入框 DatePickerInput */
		'date-picker-input': 'pages-sub/datetime/date-picker-input/date-picker-input'
		/** 日期选择弹出框 DatePickerPopup */
		'date-picker-popup': 'pages-sub/datetime/date-picker-popup/date-picker-popup'
		/** 日期选择 DatePicker */
		'date-picker': 'pages-sub/datetime/date-picker/date-picker'
		/** 日期范围输入框 DateRangePickerInput */
		'date-range-picker-input': 'pages-sub/datetime/date-range-picker-input/date-range-picker-input'
		/** 日期范围弹出框 DateRangePickerPopup */
		'date-range-picker-popup': 'pages-sub/datetime/date-range-picker-popup/date-range-picker-popup'
		/** 日期范围选择 DateRangePicker */
		'date-range-picker': 'pages-sub/datetime/date-range-picker/date-range-picker'
		/** 日期横条 Date Strip */
		'date-strip': 'pages-sub/datetime/date-strip/date-strip'
		/** 农历输入框 LunarPickerInput */
		'lunar-picker-input': 'pages-sub/datetime/lunar-picker-input/lunar-picker-input'
		/** 农历选择弹出框 LunarPickerPopup */
		'lunar-picker-popup': 'pages-sub/datetime/lunar-picker-popup/lunar-picker-popup'
		/** 农历选择 LunarPicker */
		'lunar-picker': 'pages-sub/datetime/lunar-picker/lunar-picker'
		/** 时间输入框 TimePickerInput */
		'time-picker-input': 'pages-sub/datetime/time-picker-input/time-picker-input'
		/** 时间弹出框 TimePickerPopup */
		'time-picker-popup': 'pages-sub/datetime/time-picker-popup/time-picker-popup'
		/** 时间选择 TimePicker */
		'time-picker': 'pages-sub/datetime/time-picker/time-picker'
		/** 时间范围输入框 TimeRangePickerInput */
		'time-range-picker-input': 'pages-sub/datetime/time-range-picker-input/time-range-picker-input'
		/** 时间范围弹出框 TimeRangePickerPopup */
		'time-range-picker-popup': 'pages-sub/datetime/time-range-picker-popup/time-range-picker-popup'
		/** 时间范围选择 TimeRangePicker */
		'time-range-picker': 'pages-sub/datetime/time-range-picker/time-range-picker'
		/** 徽标 Badge */
		badge: 'pages-sub/display/badge/badge'
		/** 单元格 Cell */
		cell: 'pages-sub/display/cell/cell'
		/** 悬浮按钮 Fab */
		fab: 'pages-sub/feedback/fab/fab'
		/** 加载 Loading */
		loading: 'pages-sub/feedback/loading/loading'
		/** 遮罩层 Overlay */
		overlay: 'pages-sub/feedback/overlay/overlay'
		/** 弹出层 Popup */
		popup: 'pages-sub/feedback/popup/popup'
		/** 轻提示 Toast */
		toast: 'pages-sub/feedback/toast/toast'
		/** 复选输入框 CheckboxInput */
		'checkbox-input': 'pages-sub/form/checkbox-input/checkbox-input'
		/** 复选弹出框 CheckboxPopup */
		'checkbox-popup': 'pages-sub/form/checkbox-popup/checkbox-popup'
		/** 复选框 Checkbox */
		checkbox: 'pages-sub/form/checkbox/checkbox'
		/** 颜色选择器输入框 ColorPickerInput */
		'color-picker-input': 'pages-sub/form/color-picker-input/color-picker-input'
		/** 颜色选择器弹出框 ColorPickerPopup */
		'color-picker-popup': 'pages-sub/form/color-picker-popup/color-picker-popup'
		/** 颜色选择器 ColorPicker */
		'color-picker': 'pages-sub/form/color-picker/color-picker'
		/** 输入框 Input */
		input: 'pages-sub/form/input/input'
		/** 数字键盘弹出框 NumberKeyboardPopup */
		'number-keyboard-popup': 'pages-sub/form/number-keyboard-popup/number-keyboard-popup'
		/** 数字键盘 NumberKeyboard */
		'number-keyboard': 'pages-sub/form/number-keyboard/number-keyboard'
		/** 密码输入弹出框 PasswordInputPopup */
		'password-input-popup': 'pages-sub/form/password-input-popup/password-input-popup'
		/** 密码输入格子 PasswordInput */
		'password-input': 'pages-sub/form/password-input/password-input'
		/** 单选输入框 RadioInput */
		'radio-input': 'pages-sub/form/radio-input/radio-input'
		/** 单选弹出框 RadioPopup */
		'radio-popup': 'pages-sub/form/radio-popup/radio-popup'
		/** 单选框 Radio */
		radio: 'pages-sub/form/radio/radio'
		/** 评分 Rate */
		rate: 'pages-sub/form/rate/rate'
		/** 搜索 Search */
		search: 'pages-sub/form/search/search'
		/** 分段控制器 Segmented */
		segmented: 'pages-sub/form/segmented/segmented'
		/** 签名 Signature */
		signature: 'pages-sub/form/signature/signature'
		/** 滑动条 Slider */
		slider: 'pages-sub/form/slider/slider'
		/** 紧凑布局 Compact */
		compact: 'pages-sub/layouts/compact/compact'
		/** 分割线 Divider */
		divider: 'pages-sub/layouts/divider/divider'
		/** 弹性布局 Flex */
		flex: 'pages-sub/layouts/flex/flex'
		/** 宫格 Grid */
		grid: 'pages-sub/layouts/grid/grid'
		/** 布局 Layout */
		layout: 'pages-sub/layouts/layout/layout'
		/** 间距 Space */
		space: 'pages-sub/layouts/space/space'
		/** 状态栏 StatusBar */
		'status-bar': 'pages-sub/layouts/status-bar/status-bar'
		/** 粘性布局 Sticky */
		sticky: 'pages-sub/layouts/sticky/sticky'
		/** 瀑布流 Waterfall */
		waterfall: 'pages-sub/layouts/waterfall/waterfall'
		/** 标签页 Tabs */
		tabs: 'pages-sub/nav/tabs/tabs'
		/** 级联输入框 CascaderInput */
		'cascader-input': 'pages-sub/pickers/cascader-input/cascader-input'
		/** 级联弹出框 CascaderPopup */
		'cascader-popup': 'pages-sub/pickers/cascader-popup/cascader-popup'
		/** 级联选择 Cascader */
		cascader: 'pages-sub/pickers/cascader/cascader'
		/** 选择器输入框 PickerInput */
		'picker-input': 'pages-sub/pickers/picker-input/picker-input'
		/** 选择器弹出框 PickerPopup */
		'picker-popup': 'pages-sub/pickers/picker-popup/picker-popup'
		/** 选择器纯视图 PickerView */
		'picker-view': 'pages-sub/pickers/picker-view/picker-view'
		/** 选择器 Picker */
		picker: 'pages-sub/pickers/picker/picker'
		/** 列表选择输入框 Select Input */
		'select-input': 'pages-sub/pickers/select-input/select-input'
		/** 列表选择弹层 Select Popup */
		'select-popup': 'pages-sub/pickers/select-popup/select-popup'
		/** 列表选择 Select */
		select: 'pages-sub/pickers/select/select'
	}
}
