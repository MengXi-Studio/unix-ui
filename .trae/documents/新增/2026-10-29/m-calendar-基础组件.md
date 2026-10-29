# m-calendar 基础组件 实施方案

## 需求

用户提供 Vant Calendar 对标文档，要求实现日历组件 `m-calendar`：

- Vant Calendar：https://vant-ui.github.io/vant/#/zh-CN/calendar （日历组件，用于选择日期或日期区间）

对标原则（architecture.md 第 0 节）：props 命名、变体、事件语义对齐 Vant，功能与体验对齐优先于自创 API。

## 需求分析

### Vant Calendar API 盘点（v4）

| 分组 | 内容 |
| --- | --- |
| 基础 props（18） | type（single/multiple/range）、switch-mode（v4.9 none/month/year-month）、title、color、min-date、max-date、default-date、row-height、formatter、poppable、lazy-render、show-mark、show-title、show-subtitle、show-confirm、readonly、confirm-text、confirm-disabled-text、first-day-of-week |
| poppable 组（9） | v-model:show、position、round、close-on-popstate、close-on-click-overlay、safe-area-inset-top/bottom、teleport 等 |
| range 组（4） | max-range、range-prompt、show-range-prompt、allow-same-day |
| 事件（13） | select / confirm / open / close / opened / closed / unselect / month-show / over-range / click-subtitle / click-disabled-date / click-overlay / panel-change |
| 插槽（13） | title / subtitle / month-title / footer / confirm-text / top-info / bottom-info / text / prev-month / prev-year / next-month / next-year |
| 方法（3） | reset(date?)、scrollToDate(date)、getSelectedDate() |
| Day 结构 | { date: Date, type, text, topInfo, bottomInfo, className }，type 共 9 种 |

### uni-app x（uvue / ucss）红线下的取舍

| 对标能力 | m-calendar 方案 |
| --- | --- |
| 日期参数类型 | **Date 对象**（对齐 Vant API）；内部统一转 timestamp（number）运算再转回 Date 回调，规避跨端 Date 行为差异；文档注记「构造日期请用 `new Date(2026, 9, 29)` 数值形式，禁用字符串解析」（iOS 兼容，Vant FAQ 同款问题） |
| poppable 弹层形态 | 复用既有 **m-popup**（bottom + round + close-on-click-overlay + safe-area 组合，open/opened/close/closed 事件转发）；teleport / close-on-popstate 不适用注记 |
| 平铺形态 | poppable=false 直接渲染面板（根节点按 poppable 切换 m-popup / view——**m-popup 为根节点是否有 v-if 红线风险，实现时以 m-popup 源码为准核对**） |
| 月份数量 | min-date ~ max-date 区间平铺渲染全部月份；scroll-view 承载滚动；默认范围「当前日期 ~ 6 个月后」（对齐 Vant switch-mode=none 默认） |
| switch-mode | 月 / 年切换按钮组：待 Q3（涉及 header 操作区 + 单月渲染 + panel-change，独立子形态） |
| subtitle 年月标题 | 平铺模式下 Vant 随滚动更新（month-show 驱动）：待 Q3——本期可做简化版（scroll 事件 + 月份锚点计算）或固定显示首月 |
| lazy-render | poppable 时由 m-popup 既有 lazy-render 承担，不重复实现 |
| formatter | `((day: CalendarDayItem) => CalendarDayItem) | null`；Day 用 type 定义（禁 interface）；注意 UTS props 函数收窄须先取局部变量（m-input 经验） |
| month-show 事件 | 依赖 scroll 位置监听：待 Q4 |
| 范围超限提示 | range/multiple 超 max-range 时用 **m-toast 函数式**（showToast(range-prompt)）——引入对 m-toast 的组件间依赖，待 Q5 |
| 确认按钮 | 内嵌 m-button（block + color 直通），show-confirm=false 时选择完成立即 confirm |
| 月份水印 | show-mark：月份 section 绝对定位大字号水印（ucss 可实现，低层级） |
| 日期格子布局 | 7 列 flex-wrap；每格 column 布局（topInfo / text / bottomInfo）；single 用圆形，range 的 start / end 用左右半圆角横条、middle 用低透明度横条（rgba 派生） |
| 滚动定位 | scrollToDate 用 scroll-view 的 scroll-into-view（月份锚点 id）实现 |
| first-day-of-week | 0-6（周日~周六起始），表头星期文案同步偏移 |

主题变量（`$m-calendar-*` 段，全 `!default`，对齐 Vant CSS 变量裁剪）：popup-height、header-title-height/font-size、header-subtitle-font-size、weekdays-height/font-size、month-title-font-size、month-mark-color/font-size、day-height/font-size、day-margin-bottom、day-disabled-color、range-edge-background（选中端）、range-middle-background-opacity、selected-day-size、selected-day-color、info-font-size、confirm-button-height/margin；主题色复用 `$m-color-primary`、文字色复用 `$m-text-color-*` 系。

涉及文件（architecture.md 第 6 节唯一落点）：

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-calendar/m-calendar.uvue` | 组件源（类型与逻辑内联 SFC；如月份工具函数体量过大再议同级 .uts） |
| `packages/core/theme/vars.scss` | 新增 `$m-calendar-*` 段（全 `!default`） |
| `packages/playground/pages-sub/calendar/calendar.uvue` + `pages.json` / `router/router.config.uts` / `pages/index/demo-components.uts` | 演示页 + 三处注册（数据展示组？日历属「数据展示」还是新组，按当次分组核对，倾向数据展示组 Cell / Input 附近） |
| `packages/docs/src/components/calendar.md` + `src/en/components/calendar.md` | 双语文档（含「与 Vant 的差异」节） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步 |
| `playground/uni_modules/m-ui-x/changelog.md` + 文档站 changelog 中英 | 第四步回填 |

## 伪代码设计

### 类型定义（type，禁 interface）

```
CalendarType = 'single' | 'multiple' | 'range'
CalendarDayType = 'selected' | 'start' | 'middle' | 'end' | 'disabled' | 'start-end' | 'multiple-selected' | 'multiple-middle' | 'placeholder'
CalendarDayItem = {
  date: Date
  type: CalendarDayType
  text: string          // 日数字（formatter 可改）
  topInfo: string       // 格子上方文案
  bottomInfo: string    // 格子下方文案
  className: string     // 额外类名
}
CalendarMonth = { date: Date, days: CalendarDayItem[] }
```

### Props（对齐 Vant 命名，`type Props` + `withDefaults`）

```
// 基础
type: CalendarType = 'single'
poppable: boolean = true            // 弹层形态开关
title: string = '日期选择'
color: string = ''                  // 空 = $m-color-primary；作用于选中日与确认按钮
minDate: Date | null = null         // null = 今天
maxDate: Date | null = null         // null = 今天 + 6 个月
defaultDate: Date | Date[] | null = null   // null 数组语义：type=range 时 [start, end]
rowHeight: number = 0               // 0 = $m-calendar-day-height
formatter: ((day: CalendarDayItem) => CalendarDayItem) | null = null
showMark: boolean = true
showTitle: boolean = true
showSubtitle: boolean = true
showConfirm: boolean = true
confirmText: string = '确认'
confirmDisabledText: string = '确认'
readonly: boolean = false
firstDayOfWeek: number = 0          // 0-6
customClass / customStyle
// poppable 组（待 Q1）
show: boolean = false               // v-model:show
position: PopupPosition = 'bottom'  // 直通 m-popup
round: boolean = true
closeOnClickOverlay: boolean = true
safeAreaInsetTop: boolean = false
safeAreaInsetBottom: boolean = true
// range 组（待 Q2）
maxRange: number = -1               // -1 无限制
rangePrompt: string = ''            // 空 = '最多选择 xx 天' 动态拼
allowSameDay: boolean = false
// multiple 组（待 Q2）
// multiple 同用 maxRange / rangePrompt（Vant 如此）
```

### Events（待 Q4 裁剪）

```
update:show(value: boolean)
select(value: Date | Date[])         // 点击即选
confirm(value: Date | Date[])        // show-confirm ? 点确认 : 选满即发
unselect(value: Date)                // multiple 取消选中
overRange()                          // 超过 max-range
open() / opened() / close() / closed()   // poppable 转发 m-popup
```

### Slots（待 Q4 裁剪）

```
title / subtitle / footer / top-info(day) / bottom-info(day) / text(day) / month-title(month)
```

### Methods（defineExpose）

```
reset(date?: Date | Date[] | null)   // 重置选中到指定 / 默认日期
scrollToDate(date: Date)             // scroll-into-view 月份锚点
getSelectedDate(): Date | Date[] | null
```

### 模板结构

```html
<view :class="[根类]" :style="rootStyle">
	<m-popup v-if="poppable" ...>   <!-- 或外层切换，实现时核对根节点红线 -->
		<日历面板 />
	</m-popup>
	<日历面板 v-else />
</view>

日历面板：
<view class="m-calendar">
	<view class="m-calendar__header">
		<text v-if="showTitle" class="__title">{{ title }}</text>   <!-- title 插槽 -->
		<text v-if="showSubtitle" class="__subtitle">{{ 当前年月 }}</text>  <!-- subtitle 插槽 -->
		<view class="__weekdays">7 个星期文案（firstDayOfWeek 偏移）</view>
	</view>
	<scroll-view class="__body" :scroll-into-view="锚点">
		<view v-for="month in months" :id="'m-calendar-month-' + 序号" class="__month">
			<text class="__month-title">2026年10月</text>
			<view v-if="showMark" class="__month-mark">10</view>
			<view class="__days">   <!-- 7 列 flex-wrap -->
				<view v-for="day in month.days" class="格子类（按 type 拼接 + className）">
					<text topInfo /><text text /><text bottomInfo />
				</view>
			</view>
		</view>
	</scroll-view>
	<view v-if="showConfirm" class="__footer">   <!-- footer 插槽 -->
		<m-button block :type="primary" :custom-style="{ background: color }">确认</m-button>
	</view>
</view>
```

### 核心逻辑

```
1. 初始化：minDate/maxDate 兜底（今天 ~ +6 个月）→ 枚举月份 getMonths() → 每月枚举日
   （前置 placeholder 格 = (当月 1 号星期 - firstDayOfWeek + 7) % 7）→ type/disabled 标记
   （disabled = 时间戳 < minTs || > maxTs）→ defaultDate 初始化选中
2. 点击格子（!readonly && !disabled）：
   - single：替换选中 → emit select → showConfirm=false 时直接 confirm+关弹层
   - multiple：toggle 选中（超 maxRange → overRange + toast，待 Q5）
   - range：状态机（无 start → 设 start；有 start 无 end → end=点击值，
     end<start 时以新值为 start 重选；allowSameDay / maxRange 校验；
     showConfirm=false 且选满 → confirm+关弹层）
3. type 重算：watch 选中值重算 days[].type（selected/start/middle/end/...）
4. formatter：重算后逐 day 调用（若传），结果回写渲染数据
5. confirm：emit confirm(getSelectedDate())；poppable 时关弹层
6. reset / scrollToDate / getSelectedDate 按 expose 语义实现
7. poppable：show 变化转发 m-popup open/opened/close/closed
```

### 主题变量（`$m-calendar-*` 段草案，全 `!default`）

```
popup-height: 80%（scroll 面板高度基准，用 % 实现）
header-title-height 44px / header-title-font-size 16px
header-subtitle-font-size 14px
weekdays-height 30px / weekdays-font-size 12px
month-title-font-size 14px
month-mark-color（rgba 派生）/ month-mark-font-size 160px
day-height 64px（rowHeight 覆盖）/ day-font-size 16px / day-margin-bottom 4px
day-disabled-color（复用 $m-text-color-tertiary 或独立变量）
selected-day-size 54px / selected-day-color $m-white / selected-day-background $m-color-primary
range-middle-background（rgba($m-color-primary, 0.1) 派生）
info-font-size 10px
confirm-button-height 36px
```

## 疑问清单

### Q1 形态范围：poppable 弹层形态是否本期实现？（影响：组件结构、m-popup 依赖）

Vant 默认 `poppable=true`（弹层，内嵌 m-popup bottom + round + safe-area），`poppable=false` 平铺在页面内。

- A. 双形态都做（对齐 Vant；poppable 复用既有 m-popup，成本可控）
- B. 本期只做平铺面板，弹层由用户自己套 m-popup（组件更纯粹，但与 Vant 默认用法不一致）

回答：A。

### Q2 type 范围：三种选择类型是否全做？（影响：选中状态机复杂度）

- A. 全做：single / multiple / range（对齐 Vant；range 与 multiple 状态机各自独立）
- B. 本期先 single + range（最常用），multiple 留 TODO
- C. 本期只做 single

回答：A。

### Q3 滚动增强项：switch-mode（月 / 年切换按钮）与 subtitle 随滚动动态更新，本期取舍？（影响：header 结构与滚动监听复杂度）

- A. 本期都不做：只做平铺全月份 + subtitle 固定显示首月（switch-mode 列入遗留 TODO）
- B. subtitle 动态跟随滚动做（scroll 事件 + 月份锚点计算），switch-mode 留 TODO
- C. 都做（含 switch-mode none/month/year-month 三档）

回答：C。

### Q4 事件与插槽裁剪：以下 Vant 边缘项是否保留？（影响：API 面）

建议保留：select / confirm / unselect / over-range / open / opened / close / closed；插槽 title / subtitle / month-title / footer / top-info / bottom-info / text。

待定项（逐项 A 保留 / B 裁剪）：

| 项 | 说明 | 建议 |
| --- | --- | --- |
| month-show 事件 | 月份进入可视区域触发（需 scroll 监听） | 裁剪 |
| click-subtitle 事件 | 点副标题 | 保留成本低 |
| click-disabled-date 事件 | 点禁用日期 | 保留成本低 |
| click-overlay / panel-change 事件 | click-overlay 由 m-popup 既有事件覆盖；panel-change 依赖 switch-mode | 裁剪 |
| confirm-text 插槽 | 自定义确认按钮内容 | 裁剪（confirm-text / confirm-disabled-text props 已够） |
| prev-month / prev-year / next-month / next-year 插槽 | 依赖 switch-mode | 随 Q3 |

回答：A。

### Q5 范围超限提示：是否引入 m-toast 函数式依赖？（影响：组件间依赖）

range / multiple 超 max-range 时提示 range-prompt：Vant 用自身 Toast。

- A. 引入 m-toast（showToast），体验对齐 Vant
- B. 不引入，仅 emit overRange，提示由用户自己接

回答：A。

## 实施记录

### 方案落地形态（与伪代码设计的差异说明）

1. **组件拆为三层**（伪代码为单 SFC）：`m-calendar.uvue`（状态机宿主，easycom）+ `m-calendar-panel.uvue`（表现层子组件，不注册 easycom，相对路径导入）+ `calendar.uts`（跨组件共享类型与纯函数）。拆分原因：双形态（poppable / flat）各需一份插槽转发，抽 panel 后宿主仅负责状态与事件，渲染参数经 `CalendarPanelConfig` 纯数据下发、交互经事件上抛。
2. **月份水印落在 `.m-calendar__days` 内**（伪代码草案放在 month 标题旁）：绝对定位右上角（top: 2px / right: 12px），层级由 DOM 顺序保证（水印在日格之前）。`.m-calendar__days` 禁止加 z-index——曾以 `z-index: 1` 与弹层 overlay 同级压层，导致弹层确认按钮被平铺日格拦截点击（Playwright click 报 intercepted pointer events）。
3. **popup-height 由宿主换算**：m-popup 面板高度 auto，`%` 值无法直接生效；宿主按窗口高换算为 px 下发 panel（`height: {px}px`），平铺形态空串自然生长。
4. **month-show 采用纯前端偏移估算**：月偏移累计表 `monthOffsets`（月标题高 + 行数 × (行高 + 间距)，常量与主题变量注释互指同步），无 DOM 测量依赖；仅弹层 + none 模式驱动上报，switch-mode 面板月变化走 `panel-change`。
5. **switch-mode 年导航图标**：prev-year / next-year 用两个 m-icon arrow-left/right 并排（双箭头语义），四个方向均为插槽可覆盖。
6. **reset() 不带参数**（伪代码为 `reset(date?)`）：清空选择回到 defaultDate 初始选择并定位聚焦月；指定日期重置可由用户重设 default-date 后 reset（未做参数化，保持 API 最小面）。
7. **超限语义**：range / multiple 超 max-range 时拒绝本次选择 + emit `over-range` +（show-range-prompt 时）`showToast(rangePrompt 兜底「最多选择 N 天」)`；maxRange 对 multiple 同样生效（Vant 仅 range）。
8. **multiple 取消选中事件序列**：先 emit `unselect(date)` 再 emitSelect()（select 每次点击均派发，Vant 同语义）；演示页日志保留事件序列以便验收两类事件。
9. **Web 端弹层绘制错乱修复（重要踩坑）**：弹层（fixed 面板）内的合成滚动区在 Chrome 下绘制溢出裁剪区（月份行重复绘制 + 136px 偏移鬼影 + 数字压到确认按钮），DOM 几何与滚动状态均正确；逐一排除 scroll-into-view / 面板 transform / 月水印 / scrollTop 振荡 / headless 伪影后，收敛为「fixed 面板 + 限高裁剪可滚动 scroll-view」的 Chrome 合成层问题。修复：`.m-calendar__body { isolation: isolate; }` 建立独立层叠上下文封闭绘制（`/* #ifdef WEB */` 条件编译隔离，原生端 scroll-view 无此问题）。平铺形态（无限高裁剪）从不复现。

### 变更文件清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/m-calendar/m-calendar.uvue` | 新增：状态机宿主（27 props / 15 events / 3 methods / 12 插槽转发 ×2） |
| `packages/core/components/m-calendar/m-calendar-panel.uvue` | 新增：表现层面板（header / 导航行 / 星期 / 月份滚动区 / 水印 / footer） |
| `packages/core/components/m-calendar/calendar.uts` | 新增：CalendarType / CalendarDayType / CalendarDayItem / CalendarMonth / CalendarPanelConfig / 纯函数（getDayStart、addMonths、getDayDiff、getMonthTitle、hexToRgba 等） |
| `packages/core/theme/vars.scss` | 新增 `$m-calendar-*` 段 26 个变量（全 `!default`） |
| `packages/playground/pages-sub/calendar/calendar.uvue` + `pages.json` / `router/router.config.uts` / `pages/index/demo-components.uts` | 演示页（9 张卡片穷举）+ 三处注册（数据展示组） |
| `packages/docs/src/components/calendar.md` + `src/en/components/calendar.md` | 双语文档（含「与 Vant 的差异」节） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏数据展示组 Badge 后新增 Calendar 项 |

### 验证方式与结果

| 项 | 结果 |
| --- | --- |
| `pnpm sync:uni-modules` + `:check` | 通过（playground 插件与 core 一致） |
| HBuilderX CLI 编译运行（dev server 5174） | 编译通过，无报错 |
| Playwright 全变体实测（T0-T13：结构 / single / 弹层全流程 / range+allow-same-day / multiple+超限+toast / switch-mode+clamp / formatter / 实例方法 / 插槽 / 界外禁用+主题色 / 无运行时错误） | **76 PASS / 0 FAIL** |
| 截图比对 | 平铺 + 弹层均正常（鬼影修复后月份按序、无重复绘制、确认按钮干净、水印正常） |
| `pnpm build:docs` | 通过（死链检查无报错） |

### 遗留 TODO

- 无功能性遗留。注记项（文档差异节已覆盖）：星期表头无国际化插槽（文案内置中文）；`scrollToDate` 即时定位无动画；Web 端弹层依赖 `isolation: isolate` 规避 Chrome 合成层绘制缺陷（uni-app x h5 scroll-view 已知渲染限制，原生端不受影响）。
