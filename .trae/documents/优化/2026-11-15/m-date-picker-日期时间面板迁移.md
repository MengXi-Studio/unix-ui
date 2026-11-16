# m-date-picker / m-time-picker 面板迁移为 Picker 组合 实施方案

## 需求

- 用户原话：「请开始日期和时间面板的迁移任务」。
- 背景任务：`.trae/documents/新增/2026-11-15/m-picker-通用选择器系列.md` 的 Q8 回答为 B——通用 Picker 落地后，另起任务把日期 / 时间面板迁移为 Picker 组合；该文档「遗留 TODO」第 2 条记录同一事项。
- 任务目标：把 `m-date-picker`、`m-time-picker` 两个面板中「顶部栏 + 选中框 + 多列滚轮容器 + 加载遮罩」的自绘实现，收敛为对 `m-picker` 的组合，消除三份重复模板、重复样式与重复常量；列数据构建（日期分量 / 时间分量 / 限域 / 步长 / filter / formatter）仍留在各自面板内。
- 本文档只做需求分析与伪代码设计，疑问清单确认后才落码。版本号字段不触碰（由用户手动 release）。

## 需求分析

### 现状对照

| 组件 | 模板自绘内容 | 复用资产 | 主题变量 | 对外契约 |
| --- | --- | --- | --- | --- |
| `m-picker/m-picker.uvue` | toolbar / frame / column-list / loading / columns-top / columns-bottom / option | `m-date-picker-column`、`m-loading` | `$m-picker-*`（10 项） | value 为 `PickerValue`；change/confirm 回传 `(value, selectedOptions, indexes)` |
| `m-date-picker/m-date-picker.uvue` | toolbar / frame / column-list / loading / columns-top / columns-bottom / option | `m-date-picker-column`、`m-loading` | `$m-date-picker-*`（13 项，含列文本 3 项） | value 为 `Date`；change `(date, columnIndex)`；confirm `(date)`；expose `confirm/resetSelection/getSelectedDate` |
| `m-time-picker/m-time-picker.uvue` | toolbar / frame / column-list / loading / option | `m-date-picker-column`、`m-loading` | `$m-time-picker-*`（10 项） | value 为 `'HH:mm'`/`'HH:mm:ss'`；change `(value, columnIndex)`；confirm `(value)`；expose `confirm/resetSelection/getSelectedValue` |

### 重复清单（迁移动机）

1. 模板重复：`toolbar`（取消 / 标题 / 确认三段）、`frame`（选中框两条细线）、`column-list`（多列横向布局）、`loading` 遮罩在 `m-picker` / `m-date-picker` / `m-time-picker` 中各写一份；`m-picker-view` 再写一份 `frame` + `column-list`。
2. 样式重复：上述选择器的规则几乎逐行相同，仅类名前缀与变量名不同。
3. 变量重复：`$m-date-picker-toolbar-height`、`$m-time-picker-toolbar-height`、`$m-picker-toolbar-height` 默认值均为 `44px`；`frame-color` 均为 `#ebedf0`；`action-padding` 均为 `0 16px`。`loading-background` 存在 `0.6` / `0.9` 两档历史差异。
4. 常量重复：`DATE_PICKER_OPTION_HEIGHT` / `TIME_PICKER_OPTION_HEIGHT` / `PICKER_OPTION_HEIGHT` 均为 `44`；`*_VISIBLE_OPTION_NUM` 均为 `6`。
5. 插槽转发重复：`option` 插槽的条件转发（`v-if="$slots.option != null"` + `#ifndef MP`）在三个面板与两个 popup 中各写一份。

### 调用方与影响面

| 调用方 | 依赖点 | 迁移后是否需改 |
| --- | --- | --- |
| `m-date-picker-popup` / `m-date-picker-input` | 逐项透传 `m-date-picker` 的 props/events/slots | 否（面板契约不变） |
| `m-time-picker-popup` / `m-time-picker-input` | 逐项透传 `m-time-picker` 的 props/events/slots | 否 |
| `m-date-range-picker` | 复用 `m-date-picker`（`show-toolbar=false`），依赖 `change(date, columnIndex)` | 否 |
| `m-time-range-picker` | 复用 `m-time-picker`（`show-toolbar=false`），依赖 `change(value, columnIndex)` | 否 |
| 演示页 | `pages-sub/{date-picker,date-picker-popup,date-picker-input,date-range-picker,date-range-picker-popup,date-range-picker-input}` 与 `time-picker` / `time-range-picker` 同构 6 页；含 `#option`（取 `option.text`）、`#columns-top` / `#columns-bottom` 用法 | 契约不变则否 |
| 双语文档 | `docs/src/components/{date-picker,time-picker,...}.md` 与 `src/en/` 镜像 | 仅需补「内部实现」说明与变量归属说明 |
| 主题变量 | `packages/core/theme/vars.scss` | 面板级变量去留见 Q4 |

### 关键约束（来自规则与实现现状）

- `m-date-picker-column` 是 `m-picker` / `m-picker-view` / 日期 / 时间共用的唯一底层滚轮列，迁移后仍保持唯一，不改数据契约（`{text, value}` + `disabledOptions`）。
- `m-picker` 的 `value` 只用于「按值定位下标」，`columns` 只用于「渲染与取值」；`m-picker` 内部 `indexes` 与面板的 `selectedDate` / 时分量构成双状态，必须定义同步口径（见 Q7）。
- `m-picker` 的列数据变化监听只比对 `columns.length`（列数），列内容变化（月天数、12 制小时过滤）不会重置内部下标，需由面板的 `value` 变化兜底。
- 小程序端 `v-for` 内同名具名插槽仅第一个生效（LESSONS #17），`option` 插槽在小程序端维持现状不可用。

## 伪代码设计

### 目标形态（方案 A：面板内部组合 m-picker）

```
m-date-picker
  <view class="m-date-picker" :class="customClass" :style="customStyle">   // 仅承载根类名 / 内联样式
    <m-picker
      ref="picker"
      :columns="pickerColumns"          // PickerOption[][]，由现有 DatePickerColumn[] 转换
      :value="pickerValue"              // string[]，按列顺序取各列选中项 value
      :title / :confirm-button-text / :cancel-button-text / :show-toolbar
      :loading / :readonly / :option-height / :visible-option-num / :swipe-duration
      @change="onPickerChange" @confirm="onPickerConfirm"
      @cancel="onPickerCancel" @update:value="onPickerUpdateValue"
    >
      <slot name="toolbar|title|confirm|cancel|columns-top|columns-bottom"></slot>
      <#option 适配后转发>
    </m-picker>
  </view>

m-time-picker 同构（无 columns-top / columns-bottom 转发，见 Q8）
```

### 列数据转换（两层口径隔离）

```
// 面板内部仍产出原有列结构（DatePickerColumn[] / TimePickerColumn[]），保持 filter/formatter 契约
toPickerColumns(cols):
  result = cols.map(col => col.options.map(o => ({ label: o.text, value: o.value })))
  // label 只负责展示，value 保留原值参与定位与回写

toPickerValue(cols):
  return cols.map(col => col.options[clamp(col.index, col.options.length)].value)
```

### 日期面板事件回写

```
onPickerChange(value, selectedOptions, indexes):
  // 不以 indexes 差异定位列，直接按「列类型顺序 + selectedOptions」重建分量，避免月天数收缩时多列联动漏判
  for i, type in resolvedTypes:
     v = digitsToNumber(selectedOptions[i].value)
     type == 'year'  → year = v; day = min(day, daysInMonth)
     type == 'month' → month = v - 1; day = min(day, daysInMonth)
     type == 'day'   → day = v
  selectedDate = clampToRange(normalizeByColumns(composePickerDate(year, month, day)))
  changedColumn = firstDiffIndex(previousIndexes, indexes)   // 仅用于 change 事件的 columnIndex
  emit('change', selectedDate, changedColumn)
```

```
onPickerConfirm(value, selectedOptions, indexes):
  与现状一致：selectedDate 收敛 → emit update:value(date) + confirm(date)
```

```
resetSelection():
  selectedDate = initialDate()
  pickerRef.$callMethod('resetSelection')      // 双状态归位：外部 value 未变时仅改 selectedDate 不会让 m-picker 复位
```

### 时间面板事件回写（含 12 小时制）

```
pickerColumns = [period?] + [hour|minute|second]（按 columns-type 顺序，period 固定最前）
pickerValue   = 各列选中项 value 字符串

onPickerChange(value, selectedOptions, indexes):
  // 列类型序列与 columns-type 对齐（period 参与解析但不出现在值口径中）
  hour / minute / second 全量重建：
     period 列 → isPm；hour 列在 12 制下按 isPm 换算 24 制；其余列 digitsToNumber
  parts = clampParts({hour, minute, second})     // 约束 + 步长收敛（沿用现有实现）
  更新 selectedHour / selectedMinute / selectedSecond
  emit('change', currentText(), firstDiffIndex(previousIndexes, indexes))
```

```
onPickerConfirm → 沿用现有 clampParts + currentText + emit
resetSelection → 重置三分量 + pickerRef.$callMethod('resetSelection')
```

### 插槽适配

```
#option（非小程序端）:
  <slot name="option"
        :option="{ text: option.label, value: option.value }"   // 回退为 DatePickerOption / TimePickerOption 口径
        :index="index" />
小程序端：不转发（沿用现状，列组件内置文本渲染）
```

### 样式与变量

```
m-date-picker / m-time-picker：
  删除 toolbar / action / cancel-text / confirm-text / title / title-text / columns / frame / column-list / loading 规则
  根节点仅保留 background（或直接移除样式段）
  面板级视觉一律由 m-picker 的样式与 $m-picker-* 变量承担
列文本：仍由 m-date-picker-column 的 $m-date-picker-option-* 控制（见 Q5）
```

### 验证矩阵

| 类别 | 用例 |
| --- | --- |
| 日期功能 | 默认年月日 / `columns-type` 任意组合 / `min-date`·`max-date` 限域 / `filter` / `formatter` / `readonly` / `loading` / `show-toolbar=false` / 各插槽 / `confirm`·`resetSelection`·`getSelectedDate` |
| 时间功能 | 24 制 / 12 制（AM·PM 列）/ 时分秒组合 / `minute-step`·`second-step` / `min-time`·`max-time` 跨天不约束 / `filter`·`formatter` / 只读加载 / 各插槽 |
| 联动回归 | 日期切换月天数收缩（1/31 → 2 月）、12 制切 AM/PM 后小时列重建、外部 value 变更、弹层复开 `reset-on-open` |
| 上层回归 | `date-picker-popup` / `-input`、`time-picker-popup` / `-input`、`date-range-picker` / `time-range-picker` 三件套 |
| 工程 | `pnpm sync:uni-modules:check`、HBuilderX 编译 playground、5174 端口实测 + 截图、`pnpm build:docs` |

## 替换清单分析（逐项处置）

> 结论先行：**只替换「渲染层」**——顶部栏、选中框、列容器、加载遮罩、滚动列、行高/可见数计算、面板样式与面板级主题变量；
> **完整保留「数据层」**——日期 / 时间的列选项构建、限域、步长、filter / formatter、内部选中值状态、事件与实例方法签名。

### A. 面板模板

| # | 现有实现 | 现状位置 | 处置 | 依据 |
| --- | --- | --- | --- | --- |
| A1 | 顶部栏三段（取消 / 标题 / 确认）自绘 | `m-date-picker.uvue` L6-L24；`m-time-picker.uvue` L7-L25 | **替换**：交给 `m-picker` 的 toolbar 通道，`title` / `confirm-button-text` / `cancel-button-text` / `show-toolbar` 直接透传 | 与 `m-picker` 逐行同构 |
| A2 | 选中框 `frame`（两条细线 + 半行高上移） | date L28；time L28 | **替换**：由 `m-picker` 内部渲染 | 同构 |
| A3 | `column-list` + `v-for` 逐个渲染列组件 | date L29-L49；time L29-L49 | **替换**：改为向 `m-picker` 下发 `columns`，由它渲染列 | 列数据仍由面板派生 |
| A4 | 加载遮罩 + `m-loading` | date L50-L52；time L50-L52 | **替换**：透传 `loading` | 同构 |
| A5 | `option` 插槽条件转发（含 `#ifndef MP`） | date L44-L47；time L44-L47 | **保留能力、改写适配**：在 `m-picker` 上转发，并把 `PickerOption` 转回 `{ text, value }` | 外部插槽参数不变 |
| A6 | `columns-top` / `columns-bottom` | date L25 / L54 | **保留**：直接转发（时间面板是否补齐见 Q8） | 插槽能力不缩水 |
| A7 | 根节点 `view` + `customClass` / `customStyle` | date L4；time L5 | **保留** | 自定义样式入口不破坏（Q9） |

### B. 面板脚本

| # | 现有实现 | 现状位置 | 处置 | 依据 |
| --- | --- | --- | --- | --- |
| B1 | `columnsStyle` / `frameStyle`（滚轮区高度、选中框行高） | date L361-L369；time L469-L477 | **删除** | `m-picker` 内部计算 |
| B2 | `optionHeightValue` / `visibleOptionNumValue`（兜底 44 / 6） | date L170-L177；time L207-L214 | **删除**：直接透传 `optionHeight` / `visibleOptionNum` | `m-picker` 用 `PICKER_OPTION_HEIGHT` / `PICKER_VISIBLE_OPTION_NUM` 兜底，默认值相同 |
| B3 | `onColumnChange`（按列类型写回分量） | date L374-L399；time L482-L517 | **替换**为 `onPickerChange`：从 `selectedOptions` 全量重建分量，用 `firstDiffIndex` 定位 `columnIndex` | `m-picker` 回传 `(value, selectedOptions, indexes)` |
| B4 | `onConfirmClick`（收敛 + 回写 + 派发） | date L404-L409；time L522-L530 | **保留逻辑**，挂到 `m-picker` 的 `confirm` | 值口径不变 |
| B5 | `onCancelClick` | date L414-L416；time L535-L537 | **改为转发** `m-picker` 的 `cancel` | — |
| B6 | 列构建（`buildColumns` / `buildDateOptions` / 时分秒选项 / `findOptionIndex`） | date L222-L349；time L290-L457 | **完整保留** | 迁移只换渲染层；`findOptionIndex` 的「未命中取最近不大于项」语义不能交给 `m-picker` 的精确匹配 |
| B7 | `selectedDate` / 时分秒 `ref`、`clamp*` / `normalize*` / `initial*` | date L183-L265；time L219-L279 | **完整保留** | 面板仍是值真源 |
| B8 | `watch(props.value / min / max)` | date L419-L437；time L540-L568 | **保留并扩展**：`min` / `max` / `filter` / `formatter` / `minuteStep` / `secondStep` / `hourCycle` 变化后补调 `pickerRef` 的 `resetSelection` | 迁移新增风险：`m-picker` 只监听列数，列内容变化不会重算下标 |
| B9 | `resetSelection` | date L442-L444；time L573-L578 | **保留 + 联动**：重置内部值后调用 `pickerRef.$callMethod('resetSelection')` | `m-picker` 内部 `indexes` 是第二份状态，必须显式复位 |
| B10 | `getSelectedDate` / `getSelectedValue` / `confirm` | date L446-L464；time L580-L598 | **完整保留** | `expose` 契约不变 |
| B11 | `update:value` 仅在确认时派发 | date L406-L408；time L527-L529 | **保留**；明确**不转发** `m-picker` 的 `update:value` | `m-picker` 滚动即派发，转发会让外部 `v-model` 随滚动变化 |
| B12 | `DatePickerColumn` / `TimePickerColumn` 中间结构 | `date-picker.uts` L31-L38；`time-picker.uts` L33-L40 | **保留** | 承载 `index`（已定位下标）与 `type`（filter / formatter 入参） |

### C. 样式与主题变量

| # | 现有实现 | 现状位置 | 处置 | 依据 |
| --- | --- | --- | --- | --- |
| C1 | `.m-date-picker__toolbar` / `__action` / `__cancel-text` / `__confirm-text` / `__title` / `__title-text` | date L481-L507 | **删除** | 由 `m-picker` 样式承担 |
| C2 | `.m-date-picker__columns` / `__frame` / `__column-list` / `__loading` | date L510-L547 | **删除** | 同上 |
| C3 | `.m-time-picker__*` 同构选择器 | time L615-L681 | **删除** | 同上 |
| C4 | 面板根节点 `background-color` | date L476-L478；time L610-L612 | **保留**（不改变外观，`m-picker` 根背景同值） | 最小改动 |
| C5 | 面板级主题变量（各 10 项：background / toolbar-height / action-padding / action-font-size / cancel-color / confirm-color / title-font-size / title-color / frame-color / loading-background） | `vars.scss` L536-L562、L612-L632 | **建议废弃**（见 Q4） | 与 `$m-picker-*` 完全重复 |
| C6 | `$m-date-picker-option-font-size` / `-color` / `-selected-color` | `vars.scss` L553-L558 | **保留** | `m-date-picker-column` 仍在使用，且被所有 Picker 共用 |
| C7 | `$m-date-picker-input-*` / `$m-time-picker-input-*` / range 系列变量 | `vars.scss` | **不动** | 不在迁移范围 |

### D. 共享常量

| # | 现有实现 | 现状位置 | 处置 | 依据 |
| --- | --- | --- | --- | --- |
| D1 | `DATE_PICKER_OPTION_HEIGHT` / `DATE_PICKER_VISIBLE_OPTION_NUM` | `date-picker.uts` L47-L50 | **删除**（全库仅面板引用） | 由 `m-picker` 常量接管 |
| D2 | `TIME_PICKER_OPTION_HEIGHT` / `TIME_PICKER_VISIBLE_OPTION_NUM` | `time-picker.uts` L53-L56 | **删除**（全库仅面板引用） | 同上 |
| D3 | `optionValueToNumber` / `digitsToNumber` 重复实现 | 两个 `.uts` | **暂不合并** | 与迁移无关，避免扩大改动面 |

### E. 不改动的部分

| # | 对象 | 说明 |
| --- | --- | --- |
| E1 | `m-date-picker-popup` / `m-date-picker-input` / `m-time-picker-popup` / `m-time-picker-input` | 纯透传，面板契约不变即无需修改 |
| E2 | `m-date-range-picker` / `m-time-range-picker` 及各自 popup / input | 以 `show-toolbar=false` 复用面板，依赖 `change` 第二参数，契约不变即无需修改 |
| E3 | `m-date-picker-column` | 唯一底层滚轮列，数据契约 `{text, value}` + `disabledOptions` 保持不变 |
| E4 | `m-picker` / `m-picker-popup` / `m-picker-input` / `m-picker-view` | 本轮不修改其公开 API（Q7 选 A 时） |
| E5 | 演示页 | 契约不变则无需修改；Q8 选 B 时 `time-picker` 演示页需补插槽示例 |

### F. 迁移风险（实现时必须处理）

| # | 风险 | 处理 |
| --- | --- | --- |
| F1 | 初始定位语义差异：现状 `findOptionIndex` 精确匹配优先、未命中取「不大于目标值的最近项」；`m-picker` 的 `findIndexByValue` 未命中回退首项 | `toPickerValue` 必须输出**面板已定位下标对应的选项值**（`col.options[col.index].value`），不得直接输出原始 `value` |
| F2 | 列内容变化不触发 `m-picker` 重定位（它只监听 `columns.length`） | B8：`min` / `max` / `filter` / `formatter` / 步长 / `hourCycle` 变化后调用 `resetSelection` |
| F3 | `update:value` 语义差异：`m-picker` 滚动即派发，面板只在确认时派发 | B11：不转发 `m-picker` 的 `update:value` |
| F4 | 加载遮罩颜色差异：日期面板 `rgba(255,255,255,0.6)` → `m-picker` `0.9`（时间面板本就是 `0.9`） | 接受视觉微调并在 changelog 说明；若要完全一致需改 `m-picker` 默认值（会影响通用 Picker，需另外确认） |
| F5 | 结构类名与面板级变量变化：用户对 `.m-date-picker__*` / `$m-date-picker-toolbar-height` 等的定制会失效 | Q4 / Q9 决策 + 文档迁移说明 |
| F6 | 小程序端 `option` 插槽：现状与迁移后均不生效 | 文档维持既有说明 |
| F7 | 双状态回环：面板 `change` 收敛（如分钟步长对齐）后回写 `value`，`m-picker` 会因值不同重置滚动位置 | 属期望行为（对齐步长），需在联动回归中实测确认无抖动 |

## 疑问清单

### Q1 迁移范围包含哪些组件？（影响：改动文件与验证规模）
- A. 仅 `m-date-picker`、`m-time-picker` 两个面板（popup / input / range 系列因契约不变自动受益，不改代码）
- B. 面板 + range 系列（`m-date-range-picker`、`m-time-range-picker` 的内部实现也改为直接组合 `m-picker`，不再嵌套面板）
- C. 面板 + view 系列（同时评估 `m-picker-view` 是否也改用面板的同款结构）
- 建议：A。range 系列与 popup / input 均按契约复用面板，改面板即自动受益；扩大到 range 会让「两端值状态机」与「列渲染替换」两件事混在一起，验证成本翻倍。
- 回答：按建议执行（A）。

### Q2 对外契约是否保持完全不变？（影响：是否属于破坏性变更）
- A. 完全保持不变：props / events / slots / expose / 值类型（`Date`、`'HH:mm'`）与 `change` 的 `columnIndex` 语义全部沿用，仅替换内部实现
- B. 允许收敛为 Picker 口径（`value` 改 `PickerValue`、`change` 回传 `selectedOptions` / `indexes`、`option` 插槽改 `PickerOption`），文档标注 BREAKING
- 建议：A。`m-date-range-picker` / `m-time-range-picker`、6 个 popup / input、12 个演示页与双语文档都依赖现有契约；保持契约可把改动面锁定在两个 `.uvue` 文件内，且能让 `change(date, columnIndex)` 的既有语义继续成立。
- 回答：按建议执行（A）。

### Q3 面板组合的目标组件？（影响：模板与样式结构）
- A. 组合 `m-picker`（复用工具栏、选中框、加载遮罩、插槽透传；面板只保留列构建与事件回写）
- B. 组合 `m-picker-view`（复用选中框与列容器，工具栏 / 加载态 / 插槽仍由面板自绘）
- 建议：A。工具栏、加载遮罩、`show-toolbar` 与 6 个插槽都由 `m-picker` 现成提供；组合 `m-picker-view` 只能省掉选中框与列容器，工具栏与加载态仍需自绘，重复代码减不掉一半，还会引入一层不必要的嵌套。
- 回答：按建议执行（A）。

### Q4 面板级主题变量如何处理？（影响：用户既有覆盖是否失效）
- A. 废弃 `$m-date-picker-*` / `$m-time-picker-*` 的面板级变量（background / toolbar-height / action-padding / action-font-size / cancel-color / confirm-color / title-font-size / title-color / frame-color / loading-background），统一由 `$m-picker-*` 接管，文档标注迁移指引
- B. 保留这些变量定义，并让 `$m-picker-*` 的默认值引用它们（如 `$m-picker-toolbar-height: $m-date-picker-toolbar-height`）；代价是日期 / 时间 / 通用选择器三类变量默认值互相牵连
- C. 保留变量定义但不再生效（仅避免用户 `uni.scss` 引用报错，文档标注「已失效」）
- 建议：A。面板级 10 项与 `$m-picker-*` 逐项同义（仅 `loading-background` 日期面板是 `0.6`、`m-picker` 是 `0.9`），保留会让同一视觉出现两套可覆盖变量；废弃后文档变量表收敛为一张，迁移指引逐项给出对照。
- 回答：按建议执行（A）。

### Q5 列文本（选项字号 / 颜色 / 选中色）变量归属？（影响：`m-date-picker-column` 的样式契约）
- A. 维持现状：列组件统一使用 `$m-date-picker-option-font-size` / `-color` / `-selected-color`，通用 Picker 也受其控制
- B. 新增 `$m-picker-option-*` 并让列组件按上下文切换（需给列组件加 prop 或拆两套列组件，改动面扩大）
- 建议：A。`m-date-picker-column` 是被 `m-picker` / `m-picker-view` / 日期 / 时间共用的唯一列，B 方案必须给列组件加「样式上下文」或复制列组件，正好破坏本轮「收敛」的目标；列文本变量沿用现状即可。
- 回答：按建议执行（A）。

### Q6 `change` 事件的 `columnIndex` 如何确定？（影响：事件契约与联动判断）
- A. 比较本次与上次各列选中项，取第一个变化的列下标（多列联动时取最小下标；无变化时不派发）
- B. 扩展 `change` 事件追加第二个参数（如 `indexes`），`columnIndex` 语义保持不变
- C. 不再区分列，`columnIndex` 固定传 `-1`（range 系列不使用该参数，但属契约弱化）
- 建议：A。现有 `columnIndex` 是文档化契约，A 能用「前后 `indexes` 对比」无损还原；B 属于扩参，C 属于契约削弱，均无必要。
- 回答：按建议执行（A）。

### Q7 面板与 `m-picker` 的内部下标如何同步？（影响：是否给 `m-picker` 扩 API）
- A. 双状态方案：面板以 `selectedDate` / 时分为真源，向 `m-picker` 传派生 `value`；滚动时由 `change` 回写面板状态，`m-picker` 内部保留 `indexes` 镜像；`resetSelection` 时额外调用 `pickerRef.$callMethod('resetSelection')`
- B. 单一状态方案：给 `m-picker` 新增受控 `indexes` prop 或 `setSelectedIndexes` 实例方法，面板完全受控（`m-picker` 公开 API 扩大）
- 建议：A。`m-picker` 已有「`value` 同值跳过重置」的定位逻辑，双状态在正常滚动路径下不会回环；仅在 `resetSelection` 与「列内容变化」两个边界补一次显式复位即可，不必为内部重构扩大 `m-picker` 的公开 API。
- 回答：按建议执行（A）。

### Q8 是否补齐 `m-time-picker` 的 `columns-top` / `columns-bottom` 插槽？（影响：能力口径统一）
- A. 不补（保持现状：时间面板无这两个插槽；组合 `m-picker` 后也不转发）
- B. 补齐（借用 `m-picker` 同款插槽，与日期面板对齐；文档与演示页同步增加示例）
- 建议：A。补齐属于新增能力，与「迁移只换渲染层」的目标无关；组合 `m-picker` 后若将来需要补齐，只需加两行转发，不构成后续障碍。
- 回答：按建议执行（A）。

### Q9 迁移后是否保留 `m-date-picker` / `m-time-picker` 的根节点样式类名（`m-date-picker`、`m-time-picker`）？（影响：用户自定义样式选择器）
- A. 保留根节点类名（`customClass` / `customStyle` 语义不变），内部结构类名改为 `m-picker__*`
- B. 完全透传 `customClass` / `customStyle` 给 `m-picker`，面板不再有独立根节点
- 建议：A。保留根节点可让 `customClass` / `customStyle` 的既有语义（作用于面板最外层）不变；B 会让自定义类名挂到内层，且与 popup / input 组合时的定位包含块关系发生变化。
- 回答：按建议执行（A）。

### Q10 文档与变更日志的更新口径？（影响：交付物范围）
- A. 三件套文档 API 表格不变，仅在各面板文档补「内部实现基于 m-picker」与主题变量迁移说明；changelog 三处记一条「内部重构，无 API 变更」
- B. 全面改写文档（补充组合关系图、变量对照表），changelog 三处记一条详细条目
- 建议：A。API 表格与示例全部不变，只有主题变量表需要删除面板级 10 项并给出对照；changelog 记「内部实现迁移至 m-picker，无 API 变更，主题变量收敛」即可，避免文档大规模返工。
- 回答：按建议执行（A）。

## 实施记录

### 定案汇总（按回答执行）

- Q1 → A：仅迁移 `m-date-picker` / `m-time-picker` 两个面板。
- Q2 → A：对外 props / events / slots / expose / 值类型与 `change` 的 `columnIndex` 语义全部保持。
- Q3 → A：面板内部组合 `m-picker`。
- Q4 → A：面板级主题变量废弃，统一由 `$m-picker-*` 接管。
- Q5 → A：列文本沿用 `$m-date-picker-option-*`。
- Q6 → A：`change` 的 `columnIndex` 由前后 `indexes` 差异反推。
- Q7 → A：双状态 + `resetSelection` 显式复位。
- Q8 → A：不补时间面板的 `columns-top` / `columns-bottom`。
- Q9 → A：保留面板根节点与 `customClass` / `customStyle`。
- Q10 → A：文档局部更新 + changelog 一条。

### 方案落地形态（与伪代码设计的差异）

- 面板模板改为单个 `<m-picker>`，插槽全部按 `$slots[name] != null` 条件转发；`option` 插槽经 `toDatePickerOption` / `toTimePickerOption` 把 `PickerOption` 转回 `{ text, value }`，外部口径不变。
- 面板不再引用 `m-loading` / `m-date-picker-column`，改为引用 `m-picker`；`columnsStyle` / `frameStyle` / `optionHeightValue` / `visibleOptionNumValue` 全部删除。
- 事件回写：`onPickerChange` 用 `selectedOptions` 按列类型全量重建分量，用 `firstDiffIndex(lastIndexes, indexes)` 反推 `columnIndex`；无差异时不派发 `change`。时间面板先解析 `period` 列再换算小时。
- 新增 `resetPickerIndexes()`（`nextTick` + `picker.$callMethod('resetSelection')`），在 `resetSelection` / `min` / `max` / `filter` / `formatter` / `minuteStep` / `secondStep` / `hourCycle` 变化时调用，解决「`m-picker` 只监听列数、列内容变化不重算下标」。
- 面板不转发 `m-picker` 的 `update:value`，`v-model:value` 仍只在确认时回写。
- 根节点保留背景规则，引用 `$m-picker-background`（与伪代码「删除或仅保留 background」一致）。
- 删除 `DATE_PICKER_OPTION_HEIGHT` / `DATE_PICKER_VISIBLE_OPTION_NUM` / `TIME_PICKER_OPTION_HEIGHT` / `TIME_PICKER_VISIBLE_OPTION_NUM` 四个常量（全库仅面板引用）。

### 变更文件清单

| 类型 | 文件 |
| --- | --- |
| 修改 | `packages/core/components/m-date-picker/m-date-picker.uvue` |
| 修改 | `packages/core/components/m-time-picker/m-time-picker.uvue` |
| 修改 | `packages/core/components/m-date-picker/date-picker.uts`（删除 2 个常量） |
| 修改 | `packages/core/components/m-time-picker/time-picker.uts`（删除 2 个常量） |
| 修改 | `packages/core/theme/vars.scss`（日期面板级 10 项收敛为 3 项列文本变量；删除时间面板级 10 项） |
| 生成 | `packages/playground/uni_modules/m-ui-x/**`（`pnpm sync:uni-modules`） |
| 修改 | `packages/docs/src/components/date-picker.md`、`time-picker.md` 及 `src/en/` 镜像 |
| 修改 | `packages/docs/src/changelog.md`、`packages/playground/uni_modules/m-ui-x/changelog.md`、`versions/0.6.0.md` |

### 验证方式与结果

- `pnpm sync:uni-modules` / `pnpm sync:uni-modules:check`：通过（`[sync] playground 插件与 core 一致`）。
- `pnpm build:docs`：通过（8.35s，无死链）。
- Web 实测（dev server 5174，base `/unix-ui/playground/`）：
  - `date-picker`：年 / 月 / 日三列渲染正常；滚动月份后 `change → 2026-6-15（第 2 列）`（`columnIndex=1` 经演示页 +1 展示）；确认后 `confirm → 2026-6-15`；`#option` 自定义样式（绿标题 / 红完成 / 灰返回 / 蓝绿选项）渲染正常；
  - `time-picker`（含弹层页）：时 / 分列渲染正常；12 小时制示例含「上午 / 下午」列，切换为「下午 05:57」确认后输出 `17:57`；
  - `date-range-picker`：两段标题 + 三列滚轮，`show-toolbar=false` 时无面板顶部栏，底部独立取消 / 确认按钮正常；
  - 三页控制台均无 error，无 Vite 错误遮罩。
- 未覆盖：真机（微信小程序 / Android / iOS）滚动吸附与小程序插槽分叉；`date-picker-popup` / `-input`、`time-picker-input` 未逐页截图（契约未变，弹层路径已由时间 12 制示例覆盖）。

### 遗留 TODO

- 真机复测面板迁移后的滚动吸附、`option` 插槽小程序端回退行为。
- 旧日期面板加载遮罩 `0.6` 与 `$m-picker-loading-background` `0.9` 的视觉差异已在 changelog 说明，如需完全一致需单独调整通用 Picker 默认值。
- `optionValueToNumber` / `digitsToNumber` 重复实现未合并（与本迁移无关）。
