# m-lunar-picker 农历选择面板 实施方案

## 需求

- 用户原话：「按方案 B 执行，先输出建档方案」。
- 背景：`packages/core/utils/date/lunar.uts` 已具备公历 ↔ 农历双向换算、闰月 / 月长 / 年长、干支 / 生肖 / 月名 / 日名（数据覆盖农历 1900–2100），但目前仅被 `m-date-strip` 的 `show-lunar` 消费（公历驱动的只读副文案），组件库没有农历**选择**能力。
- 方案 B 定案：新增独立面板组件 `m-lunar-picker`，内部组合刚迁移完成的 `m-picker`（复用顶部栏 / 选中框 / 滚轮列 / 加载遮罩），自身只负责「农历列构建 + 公历值映射 + 限域收敛 + 事件回写」。
- 本文档只做需求分析与伪代码设计；疑问清单确认后才落码。版本号字段不触碰（由用户手动 release）。

## 需求分析

### 与 `m-date-picker` 的差异（决定不能复用同一实现）

| 维度 | `m-date-picker` | `m-lunar-picker`（本方案） |
| --- | --- | --- |
| 列坐标 | 公历年 / 月 / 日 | 农历年 / 农历月（含闰月，月序非固定 12 项）/ 农历日（初一至三十） |
| 月列长度 | 固定 12 项 | 11 或 12 项（闰年 13 项） |
| 日列长度 | 28–31 项，随公历年月 | 29 或 30 项，随农历年与闰月 |
| 月文案 | `01`–`12` | `正月`…`腊月`、`闰六月` |
| 日文案 | `01`–`31` | `初一`…`初十`、`十一`…`廿九`、`三十` |
| 年列可选增强 | 无 | 干支（`丙午`）/ 生肖（`马`） |
| 约束来源 | 公历 `minDate` / `maxDate` | 同左，但列边界需用 `lunarToSolar` 反向映射 |

### 可复用资产

- `m-picker`：顶部栏、选中框、多列滚轮、加载遮罩、`option` / `toolbar` / `title` / `confirm` / `cancel` / `columns-top` / `columns-bottom` 插槽、`resetSelection` 实例方法。
- `m-date-picker-column`：唯一底层滚轮列（数据契约 `{ text, value }` + `disabledOptions`），农历列直接复用，无需改列组件。
- `lunar.uts`：`solarToLunar` / `lunarToSolar` / `getLunarLeapMonth` / `getLunarLeapMonthDays` / `getLunarMonthDays` / `getLunarYearName` / `getZodiac` / `getLunarMonthName` / `getLunarDayName` / `getLunarDateText`。
- 面板骨架：可直接复用 `m-date-picker` 迁移后的写法（`pickerColumns` / `pickerValue` / `firstDiffIndex` / `resetPickerIndexes`）。

### 能力缺口（需要在 utils 补两个导出）

| 缺口 | 现状 | 处理建议 |
| --- | --- | --- |
| 农历月序（含闰月） | `buildLunarMonthSequence` 为模块内私有函数（`lunar.uts` L181 附近） | 导出为 `getLunarMonthSequence(year): number[]`，农历面板与后续农历日历共用 |
| 数据范围常量 | `LUNAR_START_YEAR` / `LUNAR_END_YEAR` 未导出 | 导出两个常量，面板用于年列兜底与越界钳制 |

### 影响面

| 对象 | 影响 |
| --- | --- |
| `packages/core/components/m-lunar-picker/m-lunar-picker.uvue` | 新增组件 |
| `packages/core/utils/date/lunar.uts` | 新增 3 个导出（月序 + 年范围） |
| `packages/core/theme/vars.scss` | 见 Q8（建议不新增面板级变量，列文本复用 `$m-date-picker-option-*`） |
| `packages/playground/pages-sub/lunar-picker/lunar-picker.uvue` | 新增演示页（独立页面） |
| `packages/playground/pages/index/demo-components.uts` | 登记条目（按组件名字母序插入） |
| `packages/docs/src/components/lunar-picker.md` + `src/en/` 镜像 | 新增双语文档 |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏插入（字母序，三处同序） |
| `packages/docs/src/changelog.md`、`playground/uni_modules/m-ui-x/changelog.md`、`versions/0.6.0.md` | 各加一条 |
| `m-picker` / `m-date-picker` / `m-calendar` / `m-date-strip` | 不改动 |

## 伪代码设计

### 组件形态

```
m-lunar-picker
  <view class="m-lunar-picker" :class="customClass" :style="customStyle">
    <m-picker
      ref="picker"
      :columns="pickerColumns"        // PickerOption[][]（农历年 / 月 / 日）
      :value="pickerValue"            // string[]（各列已定位项的 value）
      :title / :confirm-button-text / :cancel-button-text / :show-toolbar
      :loading / :readonly / :option-height / :visible-option-num / :swipe-duration
      @change="onPickerChange" @confirm="onPickerConfirm" @cancel="onPickerCancel"
    >
      <slot toolbar / title / confirm / cancel / columns-top / columns-bottom / option>
    </m-picker>
  </view>
```

### 状态与真源

```
selectedSolar: Date     // 唯一真源，始终收敛在 [minDate, maxDate] 内
selectedLunar: LunarResult
  = solarToLunar(selectedSolar)  // null 时回退 minDate 的农历
```

### 列构建

```
buildYearOptions():
  minLunar = solarToLunar(minDate)   // 越界时钳制到 1900 / 2100
  maxLunar = solarToLunar(maxDate)
  for y in minLunar.year .. maxLunar.year:
    label = showGanZhi ? `${y} ${getLunarYearName(y)}` : `${y}`
    if showZodiac: label += ` ${getZodiac(y)}`
    options.push({ text: label, value: y.toString() })

buildMonthOptions(year):
  for m in getLunarMonthSequence(year):          // [1, 2, -2, 3, ...]，闰月紧随其月
    first = lunarToSolar(year, m, 1)
    last  = lunarToSolar(year, m, daysInLunarMonth(year, m))
    if last < minDate 或 first > maxDate: continue   // 公历比较剔除越界月
    options.push({ text: getLunarMonthName(m), value: m.toString() })  // 闰月为 "-6"

buildDayOptions(year, month):
  from = 1
  to = (month 为闰月) ? getLunarLeapMonthDays(year) : getLunarMonthDays(year, abs(month))
  if (year, month) == (minLunar.year, minLunar.month): from = minLunar.day
  if (year, month) == (maxLunar.year, maxLunar.month): to = maxLunar.day
  for d in from .. to:
    options.push({ text: getLunarDayName(d), value: d.toString() })

buildColumns():
  lunar = selectedLunar
  按 columnsType 顺序逐列构建 → filter(type, options, values) → formatter(type, option)
  index = findOptionIndex(options, currentValue)   // 完全匹配优先，缺失取最近不大于项
```

### 交互回写

```
onPickerChange(value, selectedOptions, indexes):
  lunar = { year: selectedLunar.year, month: selectedLunar.month, day: selectedLunar.day }
  按列顺序从 selectedOptions 取数值覆盖（闰月为负）
  solar = lunarToSolar(lunar.year, lunar.month, lunar.day)
  if solar == null: return
  selectedSolar = clampToRange(new Date(solar.year, solar.month, solar.day))
  changed = firstDiffIndex(lastIndexes, indexes)
  lastIndexes = indexes
  if changed < 0: return
  emit change(selectedSolar, changed)

onPickerConfirm → selectedSolar 收敛后 emit update:value + confirm
onPickerCancel  → emit cancel
resetSelection  → selectedSolar = initialSolar() + picker.$callMethod('resetSelection')
```

```
// 列内容变化（min/max/filter/formatter/columnsType）后，m-picker 只监听列数，必须显式复位
watch(minDate/maxDate/filter/formatter/columnsType) → resetPickerIndexes()
```

### 约束与边界

```
clampToRange(date):
  // minDate 默认 / 最大日期默认见 Q4；农历表范围 1900-2100 为硬边界
  return clampDate(getDayStart(date), minDate, maxDate)

initialSolar():
  base = value != null ? getDayStart(value) : getDayStart(new Date())
  solar = clampToRange(base)
  if solarToLunar(solar) == null:
    // 公历日期超出农历表范围：钳制到 1900-01-31 / 2100-12-31 对应值
    solar = 表范围边界
  return solar
```

### 验证矩阵

| 类别 | 用例 |
| --- | --- |
| 基础 | 默认三列（年 / 月 / 日）滚轮切换、确认回写、取消关闭 |
| 闰月 | 闰年（如 2020 闰四月、2023 闰二月）月列出现「闰X月」且日列长度正确（29/30） |
| 边界 | `minDate` / `maxDate` 落在农历月中（日列部分显示）、跨农历年、落在闰月 |
| 列组合 | `columns-type` 任意组合（年 / 年月 / 月日 / 单列） |
| 增强 | 干支 / 生肖开关、`filter` / `formatter`、只读、加载、`show-toolbar=false` |
| 超界 | 公历日期早于 1900-01-31 或晚于 2100-12-31 时的钳制行为 |
| 回归 | `m-picker` / `m-date-picker` / `m-date-strip` 不受影响 |
| 工程 | `pnpm sync:uni-modules:check`、HBuilderX 编译 playground、5174 实测截图、`pnpm build:docs` |

## 疑问清单

### Q1 对外值口径用哪种？
- A. 公历 `Date`（与 `m-date-picker` 完全一致，`v-model:value` 为 `Date`；农历只体现在列上）
- B. 农历三元组对象（`{ year, month, day }`，闰月为负；公历需调用方自行 `lunarToSolar`）
- C. 农历字符串（如 `'2026-06-15'`，闰月用 `'2026--6-15'` 之类的自定义编码）
- 建议：A。复用同一套 v-model 心智与 `change(date, columnIndex)` 契约，弹层 / 表单 / 与公历选择器互换都不需要额外转换；B 会让同一表单里出现两种值类型。
- 回答：A。

### Q2 本次交付范围？
- A. 仅面板 `m-lunar-picker`（popup / input 三件套后续按需另起任务）
- B. 面板 + `m-lunar-picker-popup` + `m-lunar-picker-input` 三件套一次交付
- 建议：A。先把列构建与值映射验证扎实，三件套是纯组合层（照抄 date-picker 三件套），可在面板稳定后低成本补齐。
- 回答：B。

### Q3 年列展示什么？
- A. 纯年份数字（`2026`）
- B. 年份 + 干支（`2026 丙午`）
- C. 年份 + 干支 + 生肖（`2026 丙午 马`）
- D. 由两个开关控制（`show-gan-zhi` / `show-zodiac`，默认关闭）
- 建议：D。默认与 `m-date-picker` 的纯数字列宽一致，需要时再打开；A/B/C 单选会限制场景。
- 回答：D。

### Q4 默认可选范围？
- A. 公历今天前后 10 年（与 `m-date-picker` 一致）
- B. 农历表全量 1900–2100（约 200 个年选项）
- C. 公历今天前后 100 年（覆盖生日场景，约 200 项）
- D. 不设默认（`minDate` / `maxDate` 为 null 时取 1900-01-31 / 2100-12-31）
- 建议：D，但面板内对年列做 200 项上限保护；农历选择最常见场景是生日 / 纪念日，前后 10 年会直接选不到，「全量 + 用户传 min/max 收窄」更实用。
- 回答：D。

### Q5 是否支持 `columns-type` 任意组合？
- A. 支持（`'year' | 'month' | 'day'` 任意顺序与子集，与 `m-date-picker` 同名同义）
- B. 固定三列（年-月-日）
- 建议：A。列构建已经按列循环实现，支持组合几乎零成本，且与既有日期组件契约一致。
- 回答：A。

### Q6 农历月 / 日文案是否可被 `formatter` 改写？
- A. 默认使用 `getLunarMonthName` / `getLunarDayName`，`formatter(type, option)` 可改写 `text` 与 `value`
- B. 文案固定，`formatter` 只能改 `text`
- C. 不提供 `formatter`（只提供 `filter`）
- 建议：A。与 `m-date-picker` 的 `formatter` 语义完全一致（可改 text / value），列组件与插槽适配逻辑可直接复用。
- 回答：A。

### Q7 `filter` / `formatter` 的 `type` 与选项值口径？
- A. `type` 为 `'year' | 'month' | 'day'`，`option.value` 为字符串（闰月 `'-6'`、日 `'15'`、年 `'2026'`），与 `m-date-picker` 的 `DatePickerOption` 结构一致
- B. 新增 `'lunar-year' | 'lunar-month' | 'lunar-day'` 类型名以区分公历面板
- 建议：A。组件名已经区分农历场景，`type` 再分叉只会让同一份 filter 代码无法在两种面板间复用。
- 回答：A。

### Q8 主题变量如何归属？
- A. 不新增面板级变量：面板视觉用 `$m-picker-*`，列文本用 `$m-date-picker-option-*`（与农历列共用的底层列一致）
- B. 新增 `$m-lunar-picker-*` 面板级变量，并在列组件上做上下文切换（需扩列组件 prop）
- 建议：A。刚完成的迁移已经把面板视觉收敛到 `$m-picker-*`；农历列与公历列是同一个 `m-date-picker-column`，再开一套变量会出现两套可覆盖入口。
- 回答：A。

### Q9 utils 是否新增 3 个导出？
- A. 新增 `getLunarMonthSequence(year)`、导出 `LUNAR_START_YEAR` / `LUNAR_END_YEAR`
- B. 面板内私有实现月序与范围常量（不改 utils）
- 建议：A。月序（含闰月）是农历领域的基础能力，农历日历 / 农历选择都会复用；常量导出避免 1900/2100 魔法值散落。
- 回答：A。

### Q10 默认选中与越界处理？
- A. `value` 为空时用今天；公历日期超出 1900–2100 时静默钳制到表边界
- B. 超出范围时抛错或显示空列
- 建议：A。钳制与 `m-date-picker` 的 `clampToRange` 行为一致；空列会让面板直接不可用。
- 回答：A。

### Q11 `change` 事件语义？
- A. `change(date: Date, columnIndex: number)`，与 `m-date-picker` 完全一致（公历日期 + 变化列下标）
- B. `change(lunar: LunarResult, columnIndex: number)`
- 建议：A。Q1 选 A 后自然成立；`columnIndex` 仍用前后 `indexes` 差异反推。
- 回答：A。

### Q12 演示页与文档的扩展项？
- A. 一页穷举：基础三列、闰月、干支 / 生肖、列组合、限域、只读加载、插槽、实例方法
- B. 基础 + 闰月两段即可
- 建议：A。农历的边界（闰月、月长、限域）必须在演示页可见，否则验收无法覆盖。
- 回答：A。

## 实施记录

### 定案汇总（按回答执行）

- Q1 → A：对外值口径为公历 `Date`。
- Q2 → B：一次交付面板 + popup + input 三件套。
- Q3 → D：`show-gan-zhi` / `show-zodiac` 两个开关，默认关闭。
- Q4 → D：默认覆盖农历表全量 1900–2100。
- Q5 → A：支持 `columns-type` 任意组合。
- Q6 → A：月 / 日文案默认为农历名称，`formatter` 可改写 `text` / `value`。
- Q7 → A：`type` 为 `year` / `month` / `day`，`option.value` 为字符串（闰月负数）。
- Q8 → A：不新增面板级主题变量。
- Q9 → A：utils 新增 3 个导出。
- Q10 → A：`value` 为空用今天，超出农历表范围静默钳制。
- Q11 → A：`change(date: Date, columnIndex: number)`。
- Q12 → A：演示页穷举全部边界。

### 方案落地形态

- 新增 `m-lunar-picker`：内部组合 `m-picker`，模板 / 事件 / `resetPickerIndexes` / 插槽适配与 `m-date-picker` 迁移后的写法保持一致；`selectedSolar` 为唯一真源，`selectedLunar` 由 `solarToLunar` 派生。
- 列构建：年列按 `min/max` 所在农历年生成（可附加干支 / 生肖）；月列遍历 `getLunarMonthSequence(year)` 并按公历交集剔除；日列按 `getLunarDaysInMonth` 生成、首尾按 `min/max` 裁剪。
- 滚动回写：按列组合读取 `selectedOptions` → `normalizeLunarParts`（年份变化后修正非法闰月、日收敛到当月长度）→ `lunarToSolar` → 截断到 `min/max`；`columnIndex` 仍由 `firstDiffIndex` 反推。
- 新增 `lunar-picker.uts`：三件套共享的列类型、`LunarPickerOption`、filter / formatter 签名、列组合归一、农历月天数、`formatLunarPickerText`（input 展示）。
- 新增 `$m-lunar-picker-input-*` 5 项变量（触发层 / 清空按钮）；面板不新增变量（Q8-A）。
- `utils/date/lunar.uts` 导出 `LUNAR_START_YEAR` / `LUNAR_END_YEAR`，并把私有 `buildLunarMonthSequence` 更名为对外 `getLunarMonthSequence`。

### 变更文件清单

| 类型 | 文件 |
| --- | --- |
| 新增 | `packages/core/components/m-lunar-picker/lunar-picker.uts` |
| 新增 | `packages/core/components/m-lunar-picker/m-lunar-picker.uvue` |
| 新增 | `packages/core/components/m-lunar-picker-popup/m-lunar-picker-popup.uvue` |
| 新增 | `packages/core/components/m-lunar-picker-input/m-lunar-picker-input.uvue` |
| 修改 | `packages/core/utils/date/lunar.uts`（3 个导出） |
| 修改 | `packages/core/theme/vars.scss`（新增 `$m-lunar-picker-input-*`） |
| 新增 | `packages/playground/pages-sub/{lunar-picker,lunar-picker-popup,lunar-picker-input}/` |
| 修改 | `packages/playground/pages/index/demo-components.uts`（三条，按字母序） |
| 新增 | `packages/docs/src/components/{lunar-picker,lunar-picker-popup,lunar-picker-input}.md` 与 `src/en/` 镜像 |
| 修改 | `packages/docs/.vitepress/config/zh.ts` / `en.ts`（侧栏同序插入） |
| 修改 | `packages/docs/src/tools/date.md` / `src/en/tools/date.md`（新增导出与常量说明） |
| 修改 | `packages/docs/src/changelog.md`、`playground/uni_modules/m-ui-x/changelog.md`、`versions/0.6.0.md` |
| 生成 | `packages/playground/uni_modules/m-ui-x/**`（`pnpm sync:uni-modules`） |

### 验证方式与结果

- `pnpm sync:uni-modules:check`：通过（`[sync] playground 插件与 core 一致`）。
- `pnpm build:docs`：通过（8.35s，无死链）。
- Web 实测（5174，base `/unix-ui/playground/`）：
  - `lunar-picker`：三列农历文本（1900–2100 / 正月…腊月 / 初一…廿九）渲染正常；`change → 2026-06-22（第 3 列）`、`confirm → 2026-06-22`；闰月区域月列出现「闰二月」，切到闰二月确认输出 `2023-03-22（农历 闰二月初一）`；干支生肖年列显示「2026 丙午 马」；
  - `lunar-picker-input`：展示 `2026年五月初一`，点击打开农历弹层，确认回填并关闭，清空后显示占位符且日志为 `clear`；
  - 真实鼠标点击全流程 console 无 error / warn（此前 JS 强制触发出现的 uni-h5 报错与组件无关）。
- 未覆盖：真机（小程序 / Android / iOS）复测；`lunar-picker-popup` 独立页未单独截图（其能力已在 input 页覆盖）。

### 遗留 TODO

- 真机复测农历滚动吸附、日期表边界（1900 / 2100）与低端机 201 项年列滚动性能。
- `m-lunar-picker` 的 `getSelectedLunarText` 为演示与回显补充的实例方法，未纳入原提案，已在文档 Methods 中说明。
- 农历面板未提供 `disabled` 日期（如忌日 / 节气）能力，后续可按需扩展 `disabledDate`。
