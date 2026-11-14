---
title: Date
subtitle: 日期工具
added: 0.5.0
---

## 介绍

与组件库同源的纯函数日期工具集：格式化 / 解析、比较、加减与差值、周月年边界、月历网格、周序号与季度、农历（1900-2100）换算与名称。既供库内组件消费，也作为公共 API 对外提供。

## 引入

uni_modules 方式（汇总入口，一次拿到全部能力）：

```ts
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/index.uts'
```

按需引入（只依赖日期模块，路径更短）：

```ts
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/date.uts'
```

npm 方式（需自行确认工程对 `.uts` 模块的解析支持）：

```ts
import { formatDate } from '@meng-xi/unix-ui/utils/index.uts'
```

入口文件仅做 re-export，内部按能力分层在 `utils/date/`：`utils/index.uts` 为全量汇总入口（`export *`，新增模块自动带出），`utils/date.uts` 为日期模块入口，两者导出完全一致，按需选择即可。

## 设计约定

- **纯函数、不可变**：不修改入参，返回新 `Date` / 新数组。
- **自然日语义**：比较、差值、边界一律按本地零点计算，时分秒不参与判定。
- **月份口径**：公历 `month` 0 起（对齐 JS `Date`）；农历 `month` 1 起（对齐历法），闰月为负数（如 `-6` 表示闰六月）。
- **空值语义**：解析 / 换算失败返回 `null`，不抛异常、不返回 Invalid Date。
- **仅本地时区**：不提供 UTC / 时区换算（原生端时区能力受限）。
- **端上约束**：实现不使用正则、`Intl`、可选链与位运算，可直接在 uni-app x 各端运行。

## API

### 基础原语

| 函数 | 返回值 | 说明 |
| --- | --- | --- |
| `getDayStart(date)` | `Date` | 归一当日零点 |
| `getDayEnd(date)` | `Date` | 归一当日 23:59:59.999 |
| `getDateParts(date)` | `DateParts \| null` | 拆解年月日时分秒毫秒与星期 |
| `fromTimestamp(timestamp)` | `Date \| null` | 毫秒时间戳转日期 |
| `toTimestamp(date)` | `number \| null` | 日期转毫秒时间戳 |
| `isValidDate(date)` | `boolean` | 判断是否合法日期 |
| `isLeapYear(year)` | `boolean` | 是否闰年 |
| `getDaysInMonth(year, month)` | `number` | 某月天数（month 0 起） |
| `getDaysInYear(year)` | `number` | 某年天数（365 / 366） |
| `getDaysSinceUnixEpoch(date)` | `number` | 自 1970-01-01 起的自然日数（本地口径） |
| `getDayOfYear(date)` | `number` | 当年第几天（1 起） |

另导出常量 `DAY_MS`（一天的毫秒数）与历史别名 `CALENDAR_DAY_MS`。

### 比较

| 函数 | 返回值 | 说明 |
| --- | --- | --- |
| `isSameDay(a, b)` | `boolean` | 是否同一自然日 |
| `isSameMonth(a, b)` | `boolean` | 是否同年同月 |
| `isSameYear(a, b)` | `boolean` | 是否同年 |
| `isBefore(a, b)` | `boolean` | a 是否早于 b（自然日） |
| `isAfter(a, b)` | `boolean` | a 是否晚于 b（自然日） |
| `isBetween(date, min, max, inclusive?)` | `boolean` | 是否落在区间内（默认含端点） |
| `isToday(date)` | `boolean` | 是否今天 |
| `isWeekend(date)` | `boolean` | 是否周六 / 周日 |

### 算术与差值

| 函数 | 返回值 | 说明 |
| --- | --- | --- |
| `addDays(date, n)` | `Date` | 加 n 天 |
| `addMonths(date, n)` | `Date` | 加 n 月（日序号超界钳制到月末） |
| `addYears(date, n)` | `Date` | 加 n 年（2-29 在平年钳制到 2-28） |
| `getDayDiff(a, b)` | `number` | 自然日差 a - b |
| `getMonthDiff(a, b)` | `number` | 自然月差 a - b |
| `getYearDiff(a, b)` | `number` | 自然年差 a - b |

### 边界与区间

| 函数 | 返回值 | 说明 |
| --- | --- | --- |
| `startOfWeek(date, weekStartsOn?)` | `Date` | 周首日零点（默认周日始） |
| `endOfWeek(date, weekStartsOn?)` | `Date` | 周末日 23:59:59.999 |
| `startOfMonth(date)` / `endOfMonth(date)` | `Date` | 月首 / 月末 |
| `startOfYear(date)` / `endOfYear(date)` | `Date` | 年首 / 年末 |
| `minDate(a, b)` / `maxDate(a, b)` | `Date` | 取较早 / 较晚者（返回新实例） |
| `clampDate(date, min, max)` | `Date` | 钳制到区间内 |
| `eachDayOfInterval(start, end)` | `Date[]` | 枚举区间内全部自然日（含首尾） |
| `eachMonthOfInterval(start, end)` | `Date[]` | 枚举区间内全部月的首日 |

### 月历网格 / 周序号 / 季度

| 函数 | 返回值 | 说明 |
| --- | --- | --- |
| `getFirstDayWeekday(year, month)` | `number` | 某月 1 号星期（0 = 周日） |
| `getDaysBeforeFirstDay(year, month, weekStartsOn?)` | `number` | 网格中上月占位天数 |
| `getDaysAfterLastDay(year, month, weekStartsOn?)` | `number` | 网格中下月补齐天数 |
| `getPrevMonthTailDays(year, month, weekStartsOn?)` | `number` | 展示的上月尾部天数 |
| `getNextMonthHeadDays(year, month, weekStartsOn?)` | `number` | 展示的下月头部天数 |
| `buildMonthGrid(year, month, weekStartsOn?)` | `Date[]` | 固定 6×7 共 42 格的整月网格 |
| `getWeekOfYear(date)` | `number` | 年内周序号（周日起始） |
| `getISOWeek(date)` | `number` | ISO-8601 周序号（周一起始） |
| `getQuarter(date)` | `number` | 季度 1-4 |

### 格式化 / 解析 / 数值化

| 函数 | 返回值 | 说明 |
| --- | --- | --- |
| `formatDate(date, format?)` | `string` | 按格式串格式化，默认 `YYYY-MM-DD` |
| `parseDate(value, format?)` | `Date \| null` | 按格式串解析；`format` 为空时自动探测常见格式 |
| `toDate(date)` | `Date \| null` | 校验并返回日期副本（不接收字符串） |
| `toDateNumber(date)` | `number` | `YYYYMMDD` 整数（如 `20250701`） |
| `toDateString(date)` | `string` | `YYYYMMDD` 文本（如 `'20250701'`） |
| `toMonthNumber(date)` | `number` | `YYYYMM` 整数（如 `202507`） |
| `getPrevMonthDate(date)` / `getNextMonthDate(date)` | `Date` | 上 / 下一月同一天（超界钳制） |
| `getWeekdayName(date)` | `string` | 星期中文名（如 `'星期二'`） |
| `getMonthName(month)` | `string` | 月份中文名（month 0 起，如 `'七月'`） |
| `formatRelative(date, now)` | `string` | 相对时间（如 `'3分钟前'`） |
| `toISOString(date)` | `string` | 本地时间 ISO 风格文本（无时区后缀、不做 UTC 换算） |

### 农历

| 函数 | 返回值 | 说明 |
| --- | --- | --- |
| `solarToLunar(year, month, day)` | `LunarResult \| null` | 公历转农历（month 0 起，闰月为负月份） |
| `lunarToSolar(year, month, day)` | `SolarResult \| null` | 农历转公历（返回 month 0 起） |
| `getLunarLeapMonth(year)` | `number` | 闰月月份（0 = 无闰月） |
| `getLunarLeapMonthDays(year)` | `number` | 闰月天数（29 / 30，无闰月为 0） |
| `getLunarYearDays(year)` | `number` | 农历年总天数（含闰月） |
| `getLunarMonthDays(year, month)` | `number` | 农历某月天数（month 1 起） |
| `getLunarYearName(year)` | `string` | 干支年名（如 `'甲辰'`） |
| `getZodiac(year)` | `string` | 生肖（如 `'龙'`） |
| `getLunarMonthName(month)` | `string` | 月名（如 `'正月'` / `'闰六月'`） |
| `getLunarDayName(day)` | `string` | 日名（如 `'初八'` / `'廿三'`） |
| `getLunarHourName(hour)` | `string` | 时辰名（如 `'子初'` / `'子正'`） |
| `getLunarDateText(year, month, day)` | `string` | 组合文案（如 `'腊月初八'`） |

农历数据覆盖 1900-2100 年，超出范围返回 `null`（名称为空串）。

## 格式符号

| 符号 | 含义 | 符号 | 含义 |
| --- | --- | --- | --- |
| `YYYY` | 四位年 | `HH` / `H` | 两位 / 一位 24 时制小时 |
| `YY` | 两位年 | `hh` / `h` | 两位 / 一位 12 时制小时 |
| `MM` / `M` | 两位 / 一位月 | `mm` / `m` | 两位 / 一位分钟 |
| `DD` / `D` | 两位 / 一位日 | `ss` / `s` | 两位 / 一位秒 |
| `SSS` | 毫秒 | `A` / `a` | 上午下午 / am pm |
| `W` | 周几（中文单字） | `Q` | 季度 |

- token 按最长优先匹配；`[]` 包裹的片段原样输出；未命中 token 的字符原样保留，因此 `YYYY年M月D日` 无需转义。
- `parseDate` 与 `formatDate` 共用 token 表，`parseDate(formatDate(d, f), f)` 可往返一致；数字 token 允许 1 到最大位宽（`2025-7-1` 也能解析），解析后会回校验年月日时分秒，拦截 `2-30` 这类溢出。

## 示例

```ts
import {
	formatDate,
	parseDate,
	addDays,
	buildMonthGrid,
	solarToLunar,
	getLunarDateText
} from '@/uni_modules/m-ui-x/utils/date.uts'

const today = new Date()

formatDate(today, 'YYYY年M月D日') // '2025年7月1日'
parseDate('2025-07-01 10:20:30') // Date
formatDate(addDays(today, 7)) // 一周后

const grid = buildMonthGrid(2025, 6, 1) // 7 月（周一起始）42 格
const lunar = solarToLunar(2024, 8, 17) // { year: 2024, month: 8, day: 15 }
if (lunar != null) {
	getLunarDateText(lunar!.year, lunar!.month, lunar!.day) // '八月十五'
}
```
