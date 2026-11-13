# 日期工具函数集 实施方案（v2）

## 变更摘要（v1 → v2）

| 维度 | v1 | v2 |
| --- | --- | --- |
| 能力范围 | 对标 30 个函数 | 分层 65 个，分 P0 / P1 / P2 三批交付 |
| 文件结构 | `utils/date.uts` + `lunar.uts` 两个文件 | `utils/date.uts` 公共入口 + `utils/date/` 七个内部分层模块 |
| 验证方式 | playground 演示页人工核对 | Node `--experimental-strip-types` 单测（含农历 7 万天全量往返）+ 端上冒烟 |
| 方案取舍 | 未论证 | 新增「方案对比与取舍」，逐条说明否决原因 |
| 与组件关系 | 待定 | Q3=A 落地细则：`calendar.uts` re-export 保持旧路径兼容 |

## 需求

- 对标设计：Sard Date 工具函数（https://sard.wzt.zone/utilities/date）——日期格式化 / 解析 / 换算 / 月历辅助 / 农历。
- 目标：在 `packages/core` 新增一套日期工具函数，**既供库内组件消费，也作为公共 API 对外导出**；配套可自动化验证的测试体系与双语文档。
- 关联：`m-date-strip` 方案的 `value-format`、`show-lunar` 两个疑问项，依赖本工具集。

## 需求分析

### 对标 API 基线（30 个）

| 分类 | 函数 | 备注 |
| --- | --- | --- |
| 判定 / 计算 | `isLeapYear` / `getDaysInMonth` / `getDayOfYear` / `getFirstDayWeekday` / `getDaysSinceUnixEpoch` | month 0 起 |
| 数值化 | `toDateNumber` / `toDateString` / `toMonthNumber` | 对标文档示例值自相矛盾（2025-07-01 → 20250601），属笔误，需自定口径 |
| 月历辅助 | `getDaysBeforeFirstDay` / `getDaysAfterLastDay` / `getPrevMonthTailDays` / `getNextMonthHeadDays` | 支持 `weekStartsOn` |
| 格式化 / 解析 | `formatDate` / `parseDate` / `toDate` / `minmaxDate` / `getPrevMonthDate` / `getNextMonthDate` | |
| 农历 | `getLunarLeapMonth` / `getLunarLeapMonthDays` / `getLunarYearDays` / `getLunarMonthDays` / `solarToLunar` / `lunarToSolar` / `getLunarYearName` / `getLunarMonthName` / `getLunarDayName` / `getLunarHourName` | 闰月以负数表示 |

### 对标能力的缺口（只对齐 30 个不够用）

| 缺口 | 典型诉求 | v2 补齐 |
| --- | --- | --- |
| 缺少日期比较 | 禁用今日之前、判断两值是否同一自然日 | `isSameDay` / `isBefore` / `isAfter` / `isBetween` / `isToday` |
| 缺少区间边界 | 周 / 月 / 年视图取首尾 | `startOfWeek` / `endOfWeek` / `startOfMonth` / `endOfMonth` / `startOfYear` / `endOfYear` |
| 缺少算术 | 翻页、快捷选项（今天 +7 天） | `addDays` / `addMonths` / `addYears` |
| 缺少差值 | 已选天数、跨月差 | `getDayDiff` / `getMonthDiff` / `getYearDiff` |
| 缺少区间枚举 | 批量生成日期序列 | `eachDayOfInterval` |
| 月历网格需二次拼装 | 日历类组件每次自己补齐 42 格 | `buildMonthGrid` 直接返回 6×7 网格 |
| 缺少周 / 季度 | 周报、季度筛选 | `getWeekOfYear` / `getISOWeek` / `getQuarter` |
| 农历缺组合文案 | 日期条底部展示「腊月初八」 | `getLunarDateText` / `getZodiac` |
| 解析失败无空值语义 | UTS 无 `undefined` | 统一返回 `null`（见 Q5） |

### 影响面

| 落点 | 文件 | 说明 |
| --- | --- | --- |
| 工具源码（公共入口） | `packages/core/utils/date.uts` | 显式具名 re-export，使用者唯一 import 路径 |
| 工具源码（内部分层） | `packages/core/utils/date/{core,compare,arith,boundary,grid,format,lunar}.uts` | 按能力拆分 |
| 包发布白名单 | `packages/core/package.json` → `files` 增加 `utils` | 否则 npm 包不含工具集 |
| 插件同步 | `scripts/sync-uni-modules.mjs` → `INCLUDE` 增加 `utils` | 否则 playground / 插件市场无此目录 |
| 库内收敛 | `packages/core/components/m-calendar/calendar.uts` | 通用函数改由 utils 提供并 re-export（Q3=A） |
| 单元测试 | `tests/date/*.test.ts` + `scripts/test-date-utils.mjs` | 不进入 npm 包与 uni_modules |
| 端上冒烟 | `packages/playground/pages-sub/utils-date/utils-date.uvue` | 编译链验证 + 少量断言 |
| 文档 | `packages/docs/src/utilities/date.md` + `src/en/utilities/date.md` | 新增「工具函数」导航 |
| 安装文档 | `src/guide/installation.md`（中英） | 补充 `utils/` 目录树与 import 路径 |
| 规则契约 | `.trae/rules/engineering-conventions.md` | 目录契约表新增 `utils`，并约束「工具层禁止反向依赖组件」 |
| 变更登记 | 三处 changelog + 版本号 | 见 Q10 |

### 技术要点（UTS / uni-app x 约束）

1. **无 `undefined`**：解析 / 换算失败只能返回 `null`，签名需为 `Date | null`，与对标版不同（必要偏差）。
2. **返回对象必须是 `type`**：`LunarResult` / `SolarResult` 用 `type`，禁止 interface。
3. **禁止可选链 / 解构默认值**；`weekStartsOn` 缺省在函数体内 `if (weekStartsOn == null)` 处理。
4. **时区口径**：统一按本地零点，`getDaysSinceUnixEpoch` 也不走 UTC，避免跨时区 ±1 天。
5. **农历数据表**：1900-2100 经典压缩表（约 201 个十六进制整数 + 位运算），需确认 UTS `Int` 位运算行为；数据表独立在 `lunar.uts`。
6. **import 路径**：uni_modules 为 `@/uni_modules/m-ui-x/utils/date.uts`（已有 components 先例）；npm 方式 `@meng-xi/unix-ui/utils/date.uts` 需实测（easycom 只覆盖组件）。
7. **导出方式**：入口用显式具名 `export { ... } from './date/xxx.uts'`；`export {} from` 在 uni_modules 插件中已有先例（ux-router utssdk），仍需 HBuilderX 实测，失败降级为单文件。

## 方案对比与取舍

| 方案 | 结论 | 原因 |
| --- | --- | --- |
| 单文件（v1） | 否决 | 65 个函数 + 农历表超 1200 行，测试与维护粒度差 |
| 类 / 链式 API（dayjs 风格） | 否决 | UTS 禁止函数声明作值传递、对象字面量受限，原生端不可行 |
| 命名空间对象（`DateUtils.format()`） | 否决 | 同上，函数不能作为对象属性值导出 |
| 依赖 dayjs / date-fns | 否决 | 依赖正则、原型扩展与 `Intl`，uni-app x 原生端不可用 |
| 挂在 `components/m-calendar/` 下 | 否决 | 通用工具反向塞进组件目录，外部消费路径语义错乱 |
| **模块化 + 单一公共入口 + 分层交付** | **采纳** | 内部可拆、外部路径稳定、可按批交付、可单测 |

## 目标架构

### 目录结构

```
packages/core/
├── utils/
│   ├── date.uts                 # 公共入口：显式具名 re-export（使用者只认这个路径）
│   └── date/
│       ├── core.uts             # 常量、归一、校验、时间戳、一年中的第几天
│       ├── compare.uts          # 同日 / 同月 / 同年 / 先后 / 区间 / 今天
│       ├── arith.uts            # 加减、差值
│       ├── boundary.uts         # 周 / 月 / 年边界、钳制、区间枚举
│       ├── grid.uts             # 月历网格、周序号、季度
│       ├── format.uts           # 格式化、解析、数值化
│       └── lunar.uts            # 农历换算 + 数据表 + 名称
├── components/...
└── theme/...
```

- `utils/date.uts` 仅做 re-export，不写实现。
- `utils` 目录内**禁止** import `components/`、`theme/`、平台 API（`uni.*`），保持纯函数与可测试性。
- 依赖方向固定 `components → utils`，禁止反向。

### 分层 API 体系（65 个，分三批）

图例：P0 = 首批必交付；P1 = 第二批；P2 = 可选增强。

| 组 | 函数 | 批次 |
| --- | --- | --- |
| 基础原语 | `getDayStart` · `getDayEnd` · `getDateParts` · `fromTimestamp` · `toTimestamp` · `isValidDate` · `isLeapYear` · `getDaysInMonth` · `getDaysInYear` · `getDaysSinceUnixEpoch` · `getDayOfYear` | P0 |
| 比较 | `isSameDay` · `isSameMonth` · `isSameYear` · `isBefore` · `isAfter` · `isBetween` · `isToday` · `isWeekend` | P0 |
| 算术 / 差值 | `addDays` · `addMonths` · `addYears` · `getDayDiff` · `getMonthDiff` · `getYearDiff` | P0 |
| 边界 / 区间 | `startOfWeek` · `endOfWeek` · `startOfMonth` · `endOfMonth` · `startOfYear` · `endOfYear` · `minDate` · `maxDate` · `clampDate` · `eachDayOfInterval` | P0 |
| 月历网格 | `getFirstDayWeekday` · `getDaysBeforeFirstDay` · `getDaysAfterLastDay` · `getPrevMonthTailDays` · `getNextMonthHeadDays` · `buildMonthGrid` | P0 |
| 格式化 / 解析 | `formatDate` · `parseDate` · `toDate` · `toDateNumber` · `toDateString` · `toMonthNumber` · `getPrevMonthDate` · `getNextMonthDate` | P0 |
| 周 / 季度 | `getWeekOfYear` · `getISOWeek` · `getQuarter` | P1 |
| 周 / 月名称 | `getWeekdayName` · `getMonthName`（中文固定文案，不做 i18n） | P1 |
| 农历换算 | `solarToLunar` · `lunarToSolar` · `getLunarLeapMonth` · `getLunarLeapMonthDays` · `getLunarYearDays` · `getLunarMonthDays` | P1 |
| 农历名称 | `getLunarYearName` · `getZodiac` · `getLunarMonthName` · `getLunarDayName` · `getLunarHourName` · `getLunarDateText` | P1 |
| 增强 | `eachMonthOfInterval` · `formatRelative`（需 `now` 入参） · `toISOString` | P2 |

### 统一语义（全库强制）

1. **纯函数、不可变**：不修改入参，返回新 `Date` / 新数组。
2. **自然日语义**：差值 / 比较 / 边界一律按本地零点，避免夏令时与时分秒干扰。
3. **月份口径**：公历 `month` 0 起（对齐 JS `Date`）；农历 `month` 1 起（对齐历法），闰月为负。函数注释与文档双重标注。
4. **空值语义**：失败返回 `null`，不抛异常、不返回 `Invalid Date`。
5. **编译约束**：不用正则、不用 `Intl`、不用可选链、不用 `undefined`、不用 `interface`；解析走手写字符扫描。
6. **命名**：不加前缀，冲突由使用者 `import { formatDate as myFormat }` 解决。
7. **时区**：仅本地时区，不提供 UTC / 时区换算（原生端能力受限，文档明示）。

### 格式符号表（v2）

| 符号 | 含义 | 符号 | 含义 |
| --- | --- | --- | --- |
| `YYYY` | 四位年 | `HH` / `H` | 两位 / 一位 24 时制小时 |
| `YY` | 两位年 | `hh` / `h` | 两位 / 一位 12 时制小时 |
| `MM` / `M` | 两位 / 一位月 | `mm` / `m` | 两位 / 一位分钟 |
| `DD` / `D` | 两位 / 一位日 | `ss` / `s` | 两位 / 一位秒 |
| `SSS` | 毫秒 | `A` / `a` | 上午 / 下午（P2） |
| `W` | 周几（中文单字，P1） | `Q` | 季度（P1） |

- 转义：`[]` 包裹片段原样输出；未命中 token 的字符原样保留，因此 `YYYY年M月D日` 无需转义即可工作。
- `formatDate` 与 `parseDate` 共用 token 表，保证 `parseDate(formatDate(d, f), f)` 往返一致。

### 可测试性（v2 核心升级）

问题：`.uts` 无法在 Node 直接运行，v1 只能靠演示页人工核对；农历 7 万天边界无法人工覆盖。

方案：纯函数模块写成 **TypeScript 严格子集**（仅类型注解、无 UTS 专属语法），由脚本搬运后直接跑 Node 单测。

```
scripts/test-date-utils.mjs
  1. 复制 packages/core/utils/date/ → .tmp/date-utils/（.uts → .ts）
  2. 改写 import 后缀 './x.uts' → './x.ts'
  3. node --experimental-strip-types --test tests/date/*.test.ts
```

- 本机 Node `v22.14.0` 已确认支持 `--experimental-strip-types`，零新增依赖。
- 测试重点：格式化 / 解析往返、跨月跨年、闰年、夏令时、`weekStartsOn` 全取值、`buildMonthGrid` 固定 42 格、农历 1900-2100 全量往返一致性。
- `.tmp` 与 `tests` 不在 `files` 白名单与 `INCLUDE` 内，不会进包。
- 端上仍需 playground 演示页做编译 + 运行时冒烟（验证 UTS 编译链与原生端 `Date` 行为）。

### 与 `m-calendar` 的收敛（Q3=A 执行细则）

1. `calendar.uts` 保留组件专属内容：`CalendarDayItem` / `CalendarMonth` / `CalendarPanelConfig` / `isCircularDayType` / `isEdgeDayType` / `dayTextClass` / `hexToRgba` / `getMonthTitle`。
2. 通用日期函数（`getDayStart` / `isSameMonth` / `addMonths` / `getDayDiff` / `CALENDAR_DAY_MS`）迁入 `utils/date/*`。
3. `calendar.uts` 通过 `export { ... } from '../../utils/date.uts'` 保持旧导入路径可用——`m-calendar-popup`、`m-calendar-input` 与演示页无需改 import。
4. 回归范围：`m-calendar` / `m-calendar-popup` / `m-calendar-input` 三个演示页 + 演示首页分组。

## 伪代码设计

### 入口文件

```uts
// packages/core/utils/date.uts —— 公共入口，仅导出不实现
export {
	getDayStart, getDayEnd, getDateParts, fromTimestamp, toTimestamp, isValidDate,
	isLeapYear, getDaysInMonth, getDaysInYear, getDaysSinceUnixEpoch, getDayOfYear
} from './date/core.uts'

export {
	isSameDay, isSameMonth, isSameYear, isBefore, isAfter, isBetween, isToday, isWeekend
} from './date/compare.uts'

export { addDays, addMonths, addYears, getDayDiff, getMonthDiff, getYearDiff } from './date/arith.uts'

export {
	startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear,
	minDate, maxDate, clampDate, eachDayOfInterval
} from './date/boundary.uts'

export {
	getFirstDayWeekday, getDaysBeforeFirstDay, getDaysAfterLastDay,
	getPrevMonthTailDays, getNextMonthHeadDays, buildMonthGrid
} from './date/grid.uts'

export {
	formatDate, parseDate, toDate, toDateNumber, toDateString, toMonthNumber,
	getPrevMonthDate, getNextMonthDate
} from './date/format.uts'

export {
	solarToLunar, lunarToSolar, getLunarLeapMonth, getLunarLeapMonthDays,
	getLunarYearDays, getLunarMonthDays, getLunarYearName, getZodiac,
	getLunarMonthName, getLunarDayName, getLunarHourName, getLunarDateText
} from './date/lunar.uts'
```

### 核心函数伪代码

```uts
/** 格式化：最长 token 优先（YYYY > YY、SSS > SS），未命中字符原样输出，[] 内为字面量 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string

/** 解析：按 format 逐 token 提取数字 → 构造 Date → 回校验年月日是否与输入一致（拦截 2-30 等溢出），失败返回 null */
export function parseDate(value: string, format: string = ''): Date | null

/** 保证 Date 入参：非法 / NaN 返回 null（不接收字符串，避免联合类型收窄风险，见 Q8） */
export function toDate(date: Date | null): Date | null

/** 自然日差值（本地零点），Math.round 消除夏令时漂移 */
export function getDayDiff(a: Date, b: Date): number

/** 月历网格：固定 6 行 × 7 列，上月尾 + 本月 + 下月头 */
export function buildMonthGrid(year: number, month: number, weekStartsOn: number = 0): Date[]

/** 公历转农历：闰月以负数返回，超出数据表范围返回 null */
export type LunarResult = { year: number, month: number, day: number }
export function solarToLunar(year: number, month: number, day: number): LunarResult | null
```

### 农历实现要点

- `LUNAR_INFO: number[]`（1900-2100，约 201 项）：低 4 位闰月月份、`0x10000` 位闰月天数、其余 12 位各月天数。
- `lunarToSolar`：自 1900-01-31 起累加农历年 / 月天数。
- `solarToLunar`：按天差逐年逐月递减，闰月命中返回负月份。
- 名称表：干支、生肖、月份名（正月…腊月）、日名（初一…三十）、时辰名（子初 / 子正…）。
- 全量往返测试兜住 7 万天边界，避免手工抽样遗漏。

## 疑问清单

> 已答：Q1 = A（新增顶层 `utils` 目录；v2 在该落点内把 `date.uts` 作为公共入口、内部再拆 7 个模块）、Q2 = A（农历 1900-2100 全量实现）、Q3 = A（通用函数迁入 utils，`calendar.uts` re-export 保持旧路径兼容）。

### Q4 交付批次（影响：一次性工作量）

- 方案 A：按 P0（约 40 个）→ P1（周 / 季度 / 农历）→ P2（增强）三批交付，每批单独验证（v2 推荐）。
- 方案 B：一次性交付 P0 + P1（不含 P2）。
- 方案 C：只交付 P0 + 农历（跳过周 / 季度与名称类）。

- 回答：A。

### Q5 解析失败返回口径（影响：调用方判空逻辑）

- 方案 A：返回 `Date | null`，调用方判空（v2 推荐，UTS 无 `undefined`）。
- 方案 B：返回 `new Date()` 兜底（静默错误，排查困难）。
- 方案 C：抛异常（原生端 try/catch 支持有限，不推荐）。

- 回答：A。

### Q6 格式化 token 扩展与转义（影响：实现与文档）

- 方案 A：基线 13 个 token + `[]` 字面量转义；`W` / `Q` / `A` 放 P1 / P2（v2 推荐）。
- 方案 B：严格只做对标 13 个 token，不做转义。
- 方案 C：一次性做全（含 `W` / `Q` / `A` / `a` 与转义）。

- 回答：A。

### Q7 导出命名与冲突（影响：公共 API 手感）

- 方案 A：原样通用名（`formatDate` / `parseDate` / `toDate`），冲突由使用者重命名（v2 推荐）。
- 方案 B：统一加前缀（`mFormatDate`），零冲突但冗长。
- 方案 C：入口同时导出两种命名（重复 API，不推荐）。

- 回答：A。

### Q8 `toDate` 是否接受字符串（影响：类型稳定性）

- 方案 A：只接受 `Date | null`，字符串解析交给 `parseDate`（v2 推荐，规避联合类型收窄风险）。
- 方案 B：`Date | string` 联合入参 + 运行时判断（与对标一致，编译链风险需实测）。

- 回答：A。

### Q9 验证体系（影响：DoD 与维护成本）

- 方案 A：Node `--experimental-strip-types` 单测 + playground 端上冒烟（v2 推荐，零新增依赖）。
- 方案 B：仅 playground 演示页人工核对（v1 方案，农历无法覆盖）。
- 方案 C：引入正式测试框架（Vitest），需新增 devDependency 与配置。

- 回答：A。

### Q10 文档位置与版本归属（影响：导航与 changelog）

- 文档：顶部导航新增「工具函数」+ `/utilities/date`（对标做法）；或收进指南 `/guide/utilities/date`。
- 版本：工具集属新增公共 API 且涉及 `m-calendar` 内部收敛，建议新开 `0.6.0`；也可追加进未发布的 `0.5.0`。

- 回答：顶部导航新增「工具函数」+ `/utilities/date`；不新开版本。
