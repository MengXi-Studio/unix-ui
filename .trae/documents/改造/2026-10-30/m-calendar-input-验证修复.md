# m-calendar-input 验证与修复 实施方案

> 状态：已完成（2026-10-30，Q1=方案 B，DoD 全项通过，实施记录见文末）。

## 需求

用户指令：「packages/core/components/m-calendar-input 这个组件也需要验证一下并修复相关问题」，未附具体问题清单。延续 m-calendar-popup 排查模式：实测 + 静态审查 → 建档 → 确认 → 实施。

## 排查过程与结论（2026-10-30 实测）

对演示页 `pages-sub/calendar-input/calendar-input.uvue` 做 playwright 实测（25 项断言，脚本复用 verify-calpopup 基建）+ 源码静态审查（input / popup / calendar 三层对照）：

**运行时功能 25/25 PASS**（1 项初报 FAIL 经 debug 证伪为脚本滚动起点假设错误：复开时聚焦月已跟随选中值，脚本多滚一月），覆盖：

- 基础链路：初始回显、触发器开弹层、确认回填 `YYYY-MM-DD`、confirm 日志、复开选中态=确认值（聚焦月跟随）、清空回 null + clear 日志 + 清空钮 v-if 消失；
- range「起 ~ 止」回填、multiple 顿号串回填、max-range=3 超限 toast 拒绝且未确认不影响已回填值；
- limit 限定区间（min/max 界外禁用格、点击禁用格不产生选中）、disabled（无触发层 / 保留值展示 / 无清空钮）、clearable=false、center 形态（70% 面板居中、自定义 title、遮罩关闭）。

**确认问题 3 项**：

### P1（确认 bug）customClass prop 声明未生效

[m-calendar-input.uvue](file:///Users/queyupeng/github/MengXi-Studio/unix-ui/packages/core/components/m-calendar-input/m-calendar-input.uvue) Props 声明 `customClass?: string.ClassString`，但 `rootClass` computed 只返回固定 `'m-calendar-input'`，未拼接 props.customClass——外部传入完全无效，双语文档 Props 表已承诺该参数。

对照家族惯例：m-input 的 rootClass 按 `if (props.customClass != '') cls += ' ' + props.customClass` 拼接。

### P2（语义缺口，需决策）未确认选择残留

实测取证：打开弹层 → 点选新日期（不确认）→ 遮罩关闭 → 复开 → **显示残留的未确认选择，而非外部 value**。与组件文档「值单向受控：外部 value 经 default-date 同步日历初始选择」的承诺冲突——弹层打开态不再是「编辑当前 value」的干净现场。

根因：m-calendar-popup 复开只调 `refreshView` 复位聚焦月（上轮验收过的刻意设计），不复位选择；m-calendar-input 未监听 popup 的 `update:value`（select 不回写，确认才回写，设计正确），故弹层内选择与外部 value 脱钩后无人复位。

Vant 对照：van-calendar 每次 pop 打开都重置为 defaultDate。

### P3（演示页取值失真）预选值落在默认 min 界外

basic / disabled 块预选 `new Date(2026, 9, 29)`，而 min-date 默认今天（2026-10-30）→ 预选值为界外禁用格；实测取证界外格 text 层只有 `m-calendar__day-text--disabled` 无 `--selected`（禁用判定优先，选中态被吞），打开弹层看不到「初始预选」回显，演示意图失效。非组件 bug（m-calendar 对界外格不上选中类属正确防御），演示页预选值应改界内。

**非缺陷记录**：测试中偶发 1 次 404 资源加载失败，干净复测未复现，判定 dev server 首次编译产物竞态（与上轮 popup 页一致）。

## 需求分析

- **P1**：一行修复，对齐 m-input 惯例；演示页补 custom-class 示例（一页穷举原则本应覆盖）。
- **P2**：修复方案影响 m-calendar / m-calendar-popup / m-calendar-input 三层，属语义设计决策，见疑问清单 Q1。
- **P3**：演示页两处预选值改为界内日期（`new Date(2026, 10, 5)` 即 2026-11-05，位于默认 min/max 窗口内），同步初始日志文案。
- **影响面**：core 三组件（视 Q1 决策）、playground 演示页、docs 双语文档（input 使用须知 + popup Props 表视 Q1）、changelog。
- **限制注记**：P2 若选方案 B，popup 默认 `resetOnOpen=false` 保证上轮验收的「复开保留选择」独立使用行为不变。

## 伪代码设计

### P1 修复（m-calendar-input.uvue rootClass）

```ts
const rootClass = computed<string>(() => {
	let cls = 'm-calendar-input'
	if (props.customClass != '') cls += ' ' + props.customClass
	return cls
})
```

### P2 方案 B（若确认）：popup 增补 reset-on-open，input 启用

```ts
// m-calendar.uvue：expose 增补 resetSelection（若未暴露；复用既有私有方法）
// m-calendar-popup.uvue：
/** 弹层打开时是否重置选择为 value / default-date（默认 false 保留既有复开语义） */
resetOnOpen?: boolean   // withDefaults: false

function onPopupOpen() {
	emit('open')
	const inst = cal.value
	if (inst != null) {
		if (props.resetOnOpen) {
			inst.$callMethod('resetSelection')
		}
		inst.$callMethod('refreshView')
	}
}

// m-calendar-input.uvue：m-calendar-popup 绑定增补
:reset-on-open="true"
```

### P3 演示页（pages-sub/calendar-input/calendar-input.uvue）

```ts
// basicValue / stateValue 预选值改界内：
const basicValue = ref<Date | Date[] | null>(new Date(2026, 10, 5))   // 2026-11-05
const basicLog = ref<string>('（初始预选 2026-11-05）')
const stateValue = ref<Date | Date[] | null>(new Date(2026, 10, 5))
// 另：basic 块补 custom-class 示例（P1 配套）
```

## 实施步骤

1. core：P1 rootClass 修复；（视 Q1）P2：m-calendar expose + popup reset-on-open + input 启用；
2. `pnpm sync:uni-modules`；
3. 演示页：P3 预选值修正 + custom-class 示例；
4. docs 双语：input 使用须知（P2 行为说明或修复后语义更新）、popup Props 表（视 Q1）；changelog 三处；
5. 验证链：`pnpm sync:uni-modules:check` → dev 实测（25 项既有断言按 P3 新预选值校准 + P1 类名断言 + P2 复开断言：未确认关闭复开后选中态=外部 value 且无残留）→ `pnpm build:docs`；
6. 回填实施记录，清理 `.screenshots`。

## 疑问清单

### Q1 P2「未确认选择残留」是否修复？方案如何选？

- **方案 A（不修，文档说明）**：input 使用须知补注「弹层内未确认的选择复开时保留」，零代码改动；
- **方案 B（推荐）**：m-calendar-popup 增补 opt-in prop `reset-on-open`（默认 false 不影响 popup 独立使用的既有验收语义），m-calendar-input 传 `:reset-on-open="true"`，弹层每次打开重置选择为 value / default-date——与 Vant van-calendar「每次打开重置」语义对齐，input 获得「打开弹层 = 编辑当前 value」的干净承诺；涉及 m-calendar expose 一个既有私有方法 + popup 约 5 行 + input 1 行；
- **方案 C**：m-calendar 复开语义直接改为总重置——推翻上轮验收的「复开保留选择」设计，影响 popup / calendar 全部既有使用方，不推荐。

回答：B。

## 实施记录（2026-10-30 回填）

### 方案落地形态（与伪代码差异）

- P1 / P2 / P3 均按伪代码原样落地，无偏差。
- **一处 expose 选型细化**（实施期定案）：m-calendar expose 增补 `resetSelection` 而非复用既有 `reset`——`reset` 会额外派发 `update:value`（打开弹层即回写一次，受控用户收到噪音）并重复 `scrollToDate`（与紧随的 `refreshView` 重叠）；`resetSelection` 是纯静默重置（不回写、不滚动），语义正好匹配「打开时复位选择，聚焦月交给 refreshView」。两文档 expose 方法表同步补行。
- P2-B 生效验证：复开断言从「残留」反转为「重置为 value」（1.5 / 1.6 双断言：选中 11-05=true、11-08 残留=false）。

### 变更文件清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/m-calendar-input/m-calendar-input.uvue` | P1：rootClass 拼接 `customClass`（对齐 m-input 惯例）；P2：popup 绑定增补 `:reset-on-open="true"` |
| `packages/core/components/m-calendar/m-calendar.uvue` | P2：defineExpose 增补 `resetSelection` |
| `packages/core/components/m-calendar-popup/m-calendar-popup.uvue` | P2：Props / withDefaults 增补 `resetOnOpen`（默认 false）、`onPopupOpen` 中 resetOnOpen 时 `$callMethod('resetSelection')` 后再 `refreshView` |
| `packages/playground/uni_modules/m-ui-x/components/` | 同步产物（`pnpm sync:uni-modules`） |
| `packages/playground/pages-sub/calendar-input/calendar-input.uvue` | P3：basicValue / stateValue 预选值改 `new Date(2026, 10, 5)`（2026-11-05，界内）+ 日志文案；basic 块补 `custom-class="demo-cal-input"` 示例（P1 配套）+ 淡蓝底样式 |
| `packages/docs/src/components/calendar-input.md` / `src/en/components/calendar-input.md` | 介绍节与使用须知补「弹层打开重置」条目（zh/en） |
| `packages/docs/src/components/calendar-popup.md` / `src/en/components/calendar-popup.md` | Props 表补 `reset-on-open` 行（zh/en） |
| `packages/docs/src/components/calendar.md` / `src/en/components/calendar.md` | expose 方法表补 `resetSelection` 行（zh/en） |
| `packages/docs/src/changelog.md` / `src/en/changelog.md` | 0.2.0 日历系列句补 expose / reset-on-open / input 打开重置 |
| `packages/playground/uni_modules/m-ui-x/changelog.md` | KEEP 文件，同句同步 |

### 验证方式与结果（DoD）

1. `pnpm sync:uni-modules:check` → 「playground 插件与 core 一致」通过；
2. dev server（5174，PID 40008）实测 **28/28 断言 PASS**（原 25 项按 P3 校准 + P1 类名断言 0.1 + P2 复开重置断言 1.5/1.6）：customClass 拼接生效、界内预选选中态回显、复开重置为 value 且无残留、确认回填 / confirm 日志 / 清空链路 / range / multiple 超限 / limit / disabled / center 形态全过；
3. popup 页回归 **24/24 PASS**（m-calendar / m-calendar-popup 源码变更后，resetOnOpen 默认 false 行为无回归）；
4. 运行时错误：干净复测无 404 / 无 pageerror（全量跑动中偶发 404 为 dev server 首次编译产物竞态，非组件缺陷）；
5. `pnpm build:docs` 构建通过（VitePress 死链检查无报错）。

### 验证期测试假象补充（防重蹈，接排查节）

5. 「复开重置后选日无效」：点击目标 day8[0]（10-08 禁用格）bbox y=31 在窗口视口内、但位于滚动列表可视区上方被裁剪区域（面板顶 ≈169，列表可视顶 ≈253）——Playwright click 对它 scrollIntoViewIfNeeded 强行回滚列表并点击禁用格（无效且破坏聚焦月位置）；脚本 bbox 判定补 `y >= 170`（面板内）后通过。组件行为全程正确（LESSONS #63）。

### 遗留 TODO

无。
