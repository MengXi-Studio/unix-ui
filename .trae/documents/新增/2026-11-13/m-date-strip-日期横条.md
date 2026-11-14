# m-date-strip 日期横条 实施方案（v2）

## 变更摘要（v1 → v2）

| 维度 | v1 | v2 |
| --- | --- | --- |
| 日期能力来源 | 需自建格式化 / 解析 / 农历数据表 | 直接复用 `packages/core/utils/date.uts`（69 个函数已交付） |
| `value-format` | 疑问 Q1（需新增工具） | 可落地：`formatDate` / `parseDate` 双向转换 |
| `show-lunar` | 疑问 Q3（需内置农历表） | 可落地：`solarToLunar` + `getLunarDateText`，零新增数据资产 |
| 默认可选范围 | 疑问 Q5 | 定稿：`addDays(currentDate, -7)` ~ `addDays(currentDate, +7)` |
| 日期序列构建 | 组件内手写循环 | `eachDayOfInterval` + `filter` |
| 演示页排序 | 误写为 `calendar-popup` 之后 | 更正：按字母序位于 `color-picker-popup` 与 `input` 之间 |
| 疑问数量 | 10 个全开放 | 6 个已被工具能力或库内约定收敛，保留 4 个产品决策 |

## 需求

- 对标设计：Sard `DateStrip`（https://sard.wzt.zone/components/date-strip）——横向条带展示一段连续日期，支持单选 / 多选 / 范围选择，点选即生效。
- 目标：新增 `m-date-strip` 组件，日期计算全部复用 `utils/date.uts`，完成主题变量、同步、演示页、双语文档与验证闭环。

## 需求分析

### 对标 API

| 项 | 内容 |
| --- | --- |
| Props | `type`（single / multiple / range）、`model-value`、`min`、`max`、`current-date`、`disabled-date`、`filter`、`max-days`、`over-max-days`、`formatter`、`allow-same-day`、`value-format`、`start-date-text`、`end-date-text`、`same-date-text`、`show-lunar` |
| Emits | `update:modelValue`、`change` |
| 默认值 | `min` = 前七天、`max` = 后七天、`maxDays` 不限、`allowSameDay=false` |
| 视觉 | 单项上下两行（周几 / 日号），选中整块高亮，范围中段连续底色带，端点显示「开始 / 结束 / 开始-结束」 |

### 与 m-calendar 的差异

| 维度 | m-calendar | m-date-strip |
| --- | --- | --- |
| 形态 | 月历网格 + 标题 / 水印 / 确认 | 一维横向条带，无标题、无确认，点选即生效 |
| 值口径 | `Date \| Date[]` | 额外支持 `value-format` 字符串绑定 |
| 默认范围 | 今天 ~ 今天 + 6 个月 | 今天 -7 天 ~ 今天 +7 天 |
| 超限反馈 | `max-range` + 内置 toast | 不弹 toast，仅 emit 超限事件 |
| 农历 | 不支持 | `show-lunar`，复用工具集 |
| 定位 | 整月滚动 | 挂载 / 外部值变更时居中选中项 |

### 日期工具复用映射（v2 核心）

组件内**只从 `../../utils/date.uts` 具名按需引入**，不引用 `utils/index.uts` 汇总入口。

| 组件需求 | 工具函数 | 用法要点 |
| --- | --- | --- |
| 默认 min / max | `addDays` | `addDays(currentDate, -7)` / `addDays(currentDate, 7)` |
| 可用日序列 | `eachDayOfInterval` + `filter` | 先按 min~max 生成，再剔除 `filter` 返回 false 的日期 |
| 今日判定 | `isSameDay` | 与 `currentDate` 比较，决定今日色 |
| 值归一 / 比较 | `getDayStart` | 所有选中值统一本地零点 |
| 范围天数 | `getDayDiff` | `getDayDiff(end, start) + 1`；跨夏令时安全 |
| 周几文案 | `getWeekdayName` | 返回「星期日」等中文文案；可用 `formatter` 覆盖 |
| 值格式化 | `formatDate` | `value-format` 非空时输出字符串（如 `YYYY-MM-DD`） |
| 值解析 | `parseDate` | 外部字符串值解析；失败返回 `null` 视为未选中 |
| 农历文案 | `solarToLunar` + `getLunarDateText` | 公历转农历后组合「腊月初八」；闰月为负月份 |
| 月份天数 / 闰年 | `getDaysInMonth` / `isLeapYear` | 仅演示页辅助展示用，组件主流程不直接依赖 |

农历文案组合（`solarToLunar` 入参 month 为公历 0-11，`getLunarDateText` 入参 month 为农历 1-12）：

```ts
const lunar = solarToLunar(d.getFullYear(), d.getMonth(), d.getDate())
const text = lunar != null ? getLunarDateText(lunar.year, lunar.month, lunar.day) : ''
```

### 影响面

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-date-strip/m-date-strip.uvue`（+ 需要时同级 `date-strip.uts`） |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-date-strip-*` 段（全 `!default`） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `packages/playground/pages-sub/date-strip/date-strip.uvue` + `demo-components.uts` 登记 |
| 文档 | `packages/docs/src/components/date-strip.md` + `src/en/components/date-strip.md` + zh.ts / en.ts 侧栏 |
| 变更登记 | 三处 changelog 追加到未发布的 `0.5.0` |

### 技术要点（UTS / uvue 约束）

- **横向滚动**：`scroll-view` 用 `direction="horizontal"`（`scroll-x` 已废弃），`show-scrollbar="false"` + Web 端条件编译隐藏原生滚动条。
- **项宽固定**：单项宽度走主题变量（默认 64px），内容自然溢出触发滚动；不使用 rpx。
- **选中视觉**：选中 / 端块为圆角方块；范围中段用绝对定位背景层拼连续色带（复用 m-calendar 的 range bar 思路），不逐项留缝。
- **范围跨过滤日期**：中段只在可见序列内连续着色，被 `filter` 剔除的日期不占位也不影响相邻项连续性。
- **formatter 形态**：复用 `CalendarFormatter`（`CalendarDayItem` 的 `topInfo` / `bottomInfo` / `className` / `type`），不引入行内 style 字符串（uvue 原生端受限）。
- **类型复用**：`CalendarType` / `CalendarDayItem` / `CalendarDayType` / `CalendarFormatter` 从 `../m-calendar/calendar.uts` 导入（`m-calendar-popup` 已有跨目录导入先例）。
- **滚动定位**：挂载与外部值变更后 `nextTick` 计算 `scroll-left = index × (itemWidth + gap) - (viewportWidth - itemWidth) / 2`；用户点击引起的值变更不再回滚居中，避免抖动。
- **农历**：直接调用工具集，不内置任何数据表；超出 1900-2100 时 `solarToLunar` 返回 `null`，`bottomInfo` 留空。

## 方案对比与取舍

| 议题 | 方案 | 结论 |
| --- | --- | --- |
| `value-format` | A. 首版不做 / B. 复用工具集做字符串绑定 | **B**：工具集已具备 `formatDate` / `parseDate`，实现成本低，且对齐对标 API |
| `show-lunar` | A. 引第三方农历库 / B. 复用工具集 | **B**：零新增依赖，数据表已在 `utils/date/lunar.uts` 维护 |
| 选择状态机 | A. 从 `m-calendar.uvue` 抽取公共状态机 / B. 组件内独立实现 | **B**：状态机与轮播 / 面板交互耦合，抽取收益低于回归风险；打标逻辑复用 `isCircularDayType` / `isEdgeDayType` |
| formatter | A. 新增 `top/bottom/style` 形态 / B. 复用 `CalendarDayItem` | **B**：保持库内 formatter 契约一致，原生端无 style 对象绑定风险 |
| 滚动居中 | A. `scroll-into-view` / B. 计算 `scroll-left` | **B**：`scroll-into-view` 只能贴边，无法居中 |

## API 设计

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `CalendarType` | `'single'` | 选择类型 |
| value | `Date \| Date[] \| string \| string[] \| null` | `null` | v-model:value；`valueFormat` 为空时用 Date 口径 |
| valueFormat | `string` | `''` | 值格式（如 `YYYY-MM-DD`）；非空时绑定值为字符串 |
| minDate | `Date \| null` | `null` | 最小可选日；null 取 `addDays(currentDate, -7)` |
| maxDate | `Date \| null` | `null` | 最大可选日；null 取 `addDays(currentDate, 7)` |
| currentDate | `Date \| null` | `null` | 「今天」基准；null 取当前时间归一零点 |
| disabledDate | `((date: Date) => boolean) \| null` | `null` | true 禁用（仍展示，灰显不可点） |
| filter | `((date: Date) => boolean) \| null` | `null` | false 不展示 |
| maxRange | `number` | `-1` | 最多可选天数；-1 不限制 |
| allowSameDay | `boolean` | `false` | 范围模式是否允许起止同日 |
| formatter | `CalendarFormatter \| null` | `null` | 日期项文案 / 类名 / 标记定制 |
| showLunar | `boolean` | `false` | 底部展示农历文案 |
| startDateText / endDateText / sameDateText | `string` | `'开始'` / `'结束'` / `'开始/结束'` | 范围端点文案 |
| customStyle | `string` | `''` | 根节点样式直达 |

### Emits

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `Date \| Date[] \| string \| string[] \| null` | v-model:value |
| `change` | 同上 | 用户点击导致值变化 |
| `over-range` | — | 超出 `maxRange`，值不变 |
| `click-disabled-date` | `date: Date` | 点击禁用日期 |

### Slots

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| `item` | `item: CalendarDayItem` | 完全接管单项内容渲染 |
| `top-info` | `day: CalendarDayItem` | 日号上方的附加内容（替代 formatter 的 topInfo 文本） |
| `bottom-info` | `day: CalendarDayItem` | 日号下方的附加内容（替代农历 / formatter 的 bottomInfo 文本） |

### 模板结构

```
scroll-view.m-date-strip (horizontal, show-scrollbar=false)
 └─ view.m-date-strip__track
     ├─ view.m-date-strip__item × N（宽度 $m-date-strip-item-width）
     │   ├─ text.m-date-strip__week   周几 / 端点文案
     │   ├─ text.m-date-strip__day    日号
     │   └─ text.m-date-strip__info   农历 / formatter 附加文案
     └─ view.m-date-strip__range-bar   范围中段色带（absolute）
```

### 关键逻辑

1. **序列构建**

```ts
const current = currentDate != null ? getDayStart(currentDate) : getDayStart(new Date())
const min = minDate != null ? getDayStart(minDate) : addDays(current, -7)
const max = maxDate != null ? getDayStart(maxDate) : addDays(current, 7)
const all = eachDayOfInterval(min, max)
// filter 剔除不展示项；disabledDate 只打标不剔除
```

2. **single**：点击即替换选中并 emit；点击已选中项保持原值（不取消，对齐日历单选）。

3. **multiple**：点击切换；新增前用当前长度与 `maxRange` 比较，超限 emit `over-range` 且不改值。

4. **range**：首点设起点（值暂为 `[start]`）；次点时若早于起点则交换；`getDayDiff(end, start) + 1 > maxRange` 时 emit 超限；`allowSameDay=false` 且同日时忽略第二次点击（不 emit）。起点再次点击视为重新开始（值重置为 `[该日]`）。

5. **value-format 双向转换**

```ts
// 外部值 → 内部 Date（valueFormat 非空）
const parsed = parseDate(str, valueFormat)   // 失败 null，按未选中处理
// 内部 Date → 对外值
const out = formatDate(date, valueFormat)
```

6. **展示文案**：`week` 取 `getWeekdayName(date)`（范围端点上替换为端点文案）；`day` 取 `getDate().toString()`；`showLunar` 时 `info` 取农历组合文案；最后统一过 `formatter`（农历可被 `bottomInfo` 覆盖）。

7. **滚动定位**：仅挂载与外部值变更时执行；多选 / 范围取第一个选中项索引居中，无选中则回到 min 端。

### 主题变量（`$m-date-strip-*`）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$m-date-strip-background` | `$m-white` | 条带背景 |
| `$m-date-strip-track-padding` | `4px` | 轨道上下内边距 |
| `$m-date-strip-item-width` | `64px` | 单项宽 |
| `$m-date-strip-item-padding-y` / `-x` | `9px` / `6px` | 单项内边距 |
| `$m-date-strip-item-border-radius` | `4px` | 单项圆角 |
| `$m-date-strip-item-border-color` | `transparent` | 单项边框色 |
| `$m-date-strip-item-bg` / `-bg-selected` / `-bg-middle` | `transparent` / `$m-color-primary` / `rgba($m-color-primary, 0.1)` | 常规 / 选中 / 中段底色 |
| `$m-date-strip-item-color` / `-color-selected` / `-color-today` / `-color-disabled` | 主文本 / 白 / 主色 / 四级文本 | 文本色 |
| `$m-date-strip-item-week-font-size` / `-day-font-size` / `-info-font-size` | `12px` / `16px` / `10px` | 字号 |

## 交付清单

1. `packages/core/components/m-date-strip/m-date-strip.uvue`
2. `packages/core/theme/vars.scss` 新增 `$m-date-strip-*`
3. `pnpm sync:uni-modules`
4. `packages/playground/pages-sub/date-strip/date-strip.uvue`（`defineUniPage({ title: '日期横条 Date Strip', name: 'date-strip' })`）+ `demo-components.uts` 登记（表单组件组，`color-picker-popup` 之后、`input` 之前）
5. `packages/docs/src/components/date-strip.md` + `src/en/components/date-strip.md` + 侧栏同序插入
6. 三处 changelog 追加至 `0.5.0`

## 验证计划（DoD）

- 演示页穷举：single / multiple / range、`max-days` 超限、`allow-same-day`、`disabled-date`、`filter`、`value-format`、`show-lunar`、`formatter`。
- 浏览器实测：点选生效、范围色带连续、端点文案正确、农历文案与公历对应（抽查 2024-09-17 = 八月十五）。
- `pnpm sync:uni-modules:check` 通过；`pnpm build:docs` 通过。
- 控制台无报错。

## 待确认疑问（4 项）

### Q1 超限命名：`max-days` 还是对齐 m-calendar 的 `max-range`？

- 建议：对齐 m-calendar 用 `max-range` + `over-max-range`，减少同一库内两套命名。若更看重与 Sard 对标一致性则保留 `max-days` + `over-max-days`。
- 回答：对齐 m-calendar 的 `max-range` + `over-max-range`。

### Q2 默认范围是否取 ±7 天？

- 建议：是。15 天在 64px 项宽下约 1080px，需横向滚动一次即可看全，兼顾「条带」语义与可选跨度。
- 回答：是。

### Q3 是否需要 `item` 插槽或 `top-info` / `bottom-info` 插槽？

- 建议：首版不提供，`formatter` 已能覆盖文案与类名定制；插槽会显著增加模板与编译分支，等有真实诉求再加。
- 回答：需要。

### Q4 版本归属：追加 `0.5.0` 还是新开 `0.6.0`？

- 建议：追加 `0.5.0`（当前仍未发布，且日期工具集也在该版本）。
- 回答：追加 `0.5.0`。
