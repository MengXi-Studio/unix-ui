---
title: Date
added: 0.5.0
---

## Introduction

A pure-function date toolkit shipped with the library: formatting / parsing, comparison, arithmetic and diffs, week / month / year boundaries, month grid, week and quarter numbers, and Chinese lunar calendar (1900-2100) conversion and names. It is used internally by components and also exported as a public API.

## Import

With uni_modules:

```ts
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/date.uts'
```

With npm (verify that your project resolves `.uts` modules):

```ts
import { formatDate } from '@meng-xi/unix-ui/utils/date.uts'
```

The entry file only re-exports named functions; implementations are layered under `utils/date/`, so `utils/date.uts` is the single path consumers need.

## Conventions

- **Pure and immutable**: inputs are never mutated; new `Date` instances / arrays are returned.
- **Natural-day semantics**: comparison, diffs and boundaries use local midnight; time of day does not affect results.
- **Month convention**: Gregorian `month` is 0-based (like JS `Date`); lunar `month` is 1-based, and leap months are negative (`-6` means leap June).
- **Null semantics**: parsing / conversion failures return `null` instead of throwing or returning an Invalid Date.
- **Local time zone only**: no UTC or time-zone conversion (limited native support).
- **On-device constraints**: no regular expressions, `Intl`, optional chaining or bitwise operations, so it runs on every uni-app x platform.

## API

### Primitives

| Function | Returns | Description |
| --- | --- | --- |
| `getDayStart(date)` | `Date` | Start (00:00:00.000) of the day |
| `getDayEnd(date)` | `Date` | End (23:59:59.999) of the day |
| `getDateParts(date)` | `DateParts \| null` | Year / month / day / time parts and weekday |
| `fromTimestamp(timestamp)` | `Date \| null` | Milliseconds to date |
| `toTimestamp(date)` | `number \| null` | Date to milliseconds |
| `isValidDate(date)` | `boolean` | Whether the date is valid |
| `isLeapYear(year)` | `boolean` | Whether the year is a leap year |
| `getDaysInMonth(year, month)` | `number` | Days in a month (0-based month) |
| `getDaysInYear(year)` | `number` | Days in a year (365 / 366) |
| `getDaysSinceUnixEpoch(date)` | `number` | Natural days since 1970-01-01 (local) |
| `getDayOfYear(date)` | `number` | Day of year (1-based) |

Constants `DAY_MS` and the legacy alias `CALENDAR_DAY_MS` are exported as well.

### Comparison

| Function | Returns | Description |
| --- | --- | --- |
| `isSameDay(a, b)` | `boolean` | Same calendar day |
| `isSameMonth(a, b)` | `boolean` | Same year and month |
| `isSameYear(a, b)` | `boolean` | Same year |
| `isBefore(a, b)` | `boolean` | a is before b (by day) |
| `isAfter(a, b)` | `boolean` | a is after b (by day) |
| `isBetween(date, min, max, inclusive?)` | `boolean` | Inside the range (inclusive by default) |
| `isToday(date)` | `boolean` | Is today |
| `isWeekend(date)` | `boolean` | Saturday or Sunday |

### Arithmetic and diffs

| Function | Returns | Description |
| --- | --- | --- |
| `addDays(date, n)` | `Date` | Add n days |
| `addMonths(date, n)` | `Date` | Add n months (day clamped to month end) |
| `addYears(date, n)` | `Date` | Add n years (Feb 29 clamped to Feb 28) |
| `getDayDiff(a, b)` | `number` | Day diff a - b |
| `getMonthDiff(a, b)` | `number` | Month diff a - b |
| `getYearDiff(a, b)` | `number` | Year diff a - b |

### Boundaries and intervals

| Function | Returns | Description |
| --- | --- | --- |
| `startOfWeek(date, weekStartsOn?)` | `Date` | First day of the week (Sunday by default) |
| `endOfWeek(date, weekStartsOn?)` | `Date` | Last day of the week at 23:59:59.999 |
| `startOfMonth(date)` / `endOfMonth(date)` | `Date` | Start / end of the month |
| `startOfYear(date)` / `endOfYear(date)` | `Date` | Start / end of the year |
| `minDate(a, b)` / `maxDate(a, b)` | `Date` | Earlier / later date (new instance) |
| `clampDate(date, min, max)` | `Date` | Clamp into the range |
| `eachDayOfInterval(start, end)` | `Date[]` | All days in the interval (inclusive) |
| `eachMonthOfInterval(start, end)` | `Date[]` | First day of every month in the interval |

### Month grid / week numbers / quarter

| Function | Returns | Description |
| --- | --- | --- |
| `getFirstDayWeekday(year, month)` | `number` | Weekday of the 1st (0 = Sunday) |
| `getDaysBeforeFirstDay(year, month, weekStartsOn?)` | `number` | Leading days from the previous month |
| `getDaysAfterLastDay(year, month, weekStartsOn?)` | `number` | Trailing days to complete the row |
| `getPrevMonthTailDays(year, month, weekStartsOn?)` | `number` | Previous-month days shown |
| `getNextMonthHeadDays(year, month, weekStartsOn?)` | `number` | Next-month days shown |
| `buildMonthGrid(year, month, weekStartsOn?)` | `Date[]` | Fixed 6×7 (42 cells) month grid |
| `getWeekOfYear(date)` | `number` | Week of year (Sunday start) |
| `getISOWeek(date)` | `number` | ISO-8601 week number (Monday start) |
| `getQuarter(date)` | `number` | Quarter 1-4 |

### Format / parse / numeric

| Function | Returns | Description |
| --- | --- | --- |
| `formatDate(date, format?)` | `string` | Format with a pattern, default `YYYY-MM-DD` |
| `parseDate(value, format?)` | `Date \| null` | Parse with a pattern; auto-detects when `format` is empty |
| `toDate(date)` | `Date \| null` | Validate and return a copy (no strings) |
| `toDateNumber(date)` | `number` | `YYYYMMDD` integer (e.g. `20250701`) |
| `toDateString(date)` | `string` | `YYYYMMDD` string (e.g. `'20250701'`) |
| `toMonthNumber(date)` | `number` | `YYYYMM` integer (e.g. `202507`) |
| `getPrevMonthDate(date)` / `getNextMonthDate(date)` | `Date` | Same day in the previous / next month (clamped) |
| `getWeekdayName(date)` | `string` | Chinese weekday name (e.g. `'星期二'`) |
| `getMonthName(month)` | `string` | Chinese month name (0-based, e.g. `'七月'`) |
| `formatRelative(date, now)` | `string` | Relative time (e.g. `'3分钟前'`) |
| `toISOString(date)` | `string` | Local ISO-style text (no zone suffix, no UTC conversion) |

### Lunar calendar

| Function | Returns | Description |
| --- | --- | --- |
| `solarToLunar(year, month, day)` | `LunarResult \| null` | Gregorian to lunar (0-based month, negative leap month) |
| `lunarToSolar(year, month, day)` | `SolarResult \| null` | Lunar to Gregorian (0-based month) |
| `getLunarLeapMonth(year)` | `number` | Leap month (0 = none) |
| `getLunarLeapMonthDays(year)` | `number` | Leap month length (29 / 30, 0 if none) |
| `getLunarYearDays(year)` | `number` | Lunar year length (including leap month) |
| `getLunarMonthDays(year, month)` | `number` | Length of a lunar month (1-based) |
| `getLunarYearName(year)` | `string` | Sexagenary name (e.g. `'甲辰'`) |
| `getZodiac(year)` | `string` | Zodiac animal (e.g. `'龙'`) |
| `getLunarMonthName(month)` | `string` | Month name (e.g. `'正月'` / `'闰六月'`) |
| `getLunarDayName(day)` | `string` | Day name (e.g. `'初八'` / `'廿三'`) |
| `getLunarHourName(hour)` | `string` | Traditional hour name (e.g. `'子初'` / `'子正'`) |
| `getLunarDateText(year, month, day)` | `string` | Combined text (e.g. `'腊月初八'`) |

Lunar data covers 1900-2100; out-of-range conversions return `null` (names return an empty string).

## Format tokens

| Token | Meaning | Token | Meaning |
| --- | --- | --- | --- |
| `YYYY` | 4-digit year | `HH` / `H` | 2-digit / 1-digit 24-hour |
| `YY` | 2-digit year | `hh` / `h` | 2-digit / 1-digit 12-hour |
| `MM` / `M` | 2-digit / 1-digit month | `mm` / `m` | 2-digit / 1-digit minute |
| `DD` / `D` | 2-digit / 1-digit day | `ss` / `s` | 2-digit / 1-digit second |
| `SSS` | Milliseconds | `A` / `a` | AM/PM in Chinese / `am` / `pm` |
| `W` | Weekday (Chinese char) | `Q` | Quarter |

- Tokens match longest-first; `[...]` is emitted verbatim; unmatched characters are kept, so `YYYY年M月D日` needs no escaping.
- `parseDate` shares the token table with `formatDate`, so `parseDate(formatDate(d, f), f)` round-trips; numeric tokens accept 1 to max digits (`2025-7-1` works), and the result is validated to reject overflow such as `2-30`.

## Example

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
formatDate(addDays(today, 7)) // one week later

const grid = buildMonthGrid(2025, 6, 1) // July, Monday start, 42 cells
const lunar = solarToLunar(2024, 8, 17) // { year: 2024, month: 8, day: 15 }
if (lunar != null) {
	getLunarDateText(lunar!.year, lunar!.month, lunar!.day) // '八月十五'
}
```
