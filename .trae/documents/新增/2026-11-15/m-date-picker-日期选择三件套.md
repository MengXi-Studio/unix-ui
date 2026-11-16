# m-date-picker 日期选择三件套 实施方案

## 需求

- 用户原话：「`https://vant-ui.github.io/vant/#/zh-CN/date-picker` 分析此组件，按照 `m-calendar` / `m-calendar-input` / `m-calendar-popup` 拆成三个组件」。
- 补充要求（任务完成后）：按项目规则补齐设计文档、升级版本号并输出版本变更日志。
- 目标：新增 `m-date-picker`（滚轮面板）、`m-date-picker-popup`（弹层）、`m-date-picker-input`（输入框），完成主题变量、同步、演示页、双语文档与验证闭环。

## 需求分析

### 对标 API（Vant DatePicker）

| 项 | 内容 |
| --- | --- |
| Props | `v-model`（string[]）、`columns-type`（year/month/day 任意组合）、`min-date`、`max-date`（默认前后十年）、`title`、`confirm-button-text`、`cancel-button-text`、`show-toolbar`、`loading`、`readonly`、`filter`、`formatter`、`option-height`、`visible-option-num`、`swipe-duration` |
| Events | `confirm`、`cancel`、`change`（含 columnIndex） |
| Slots | `toolbar`、`title`、`confirm`、`cancel`、`option`、`columns-top`、`columns-bottom` |
| Methods | `confirm`、`getSelectedDate` |
| 交互 | 三列滚轮，滚动停止吸附到最近选项；顶部栏取消 / 标题 / 确认 |

### 与 m-calendar 三件套的对应关系

| 维度 | m-calendar 三件套 | m-date-picker 三件套 |
| --- | --- | --- |
| 基础面板 | `m-calendar`（状态机宿主）+ `m-calendar-panel`（表现层） | `m-date-picker`（状态机宿主）+ `m-date-picker-column`（滚轮列） |
| 弹层组合 | `m-calendar-popup` = `m-popup` + `m-calendar` | `m-date-picker-popup` = `m-popup` + `m-date-picker` |
| 输入框组合 | `m-calendar-input` = `m-input` + `m-calendar-popup` | `m-date-picker-input` = `m-input` + `m-date-picker-popup` |
| 值口径 | `Date \| Date[]` | `Date`（单选日期语义） |
| 选择方式 | 网格点选 | 三列滚轮 + 吸附 |

### 影响面

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-date-picker/`（`m-date-picker.uvue` / `m-date-picker-column.uvue` / `date-picker.uts`）、`m-date-picker-popup/`、`m-date-picker-input/` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-date-picker-*` 与 `$m-date-picker-input-*`（全部 `!default`，不改旧默认值） |
| 同步 | `pnpm sync:uni-modules`（playground `uni_modules/m-ui-x` 为产物，禁止手改） |
| 演示页 | `packages/playground/pages-sub/date-picker/`、`date-picker-popup/`、`date-picker-input/`（`defineUniPage` 宏生成路由） |
| 演示登记 | `packages/playground/pages/index/demo-components.uts` 表单组字母序插入（`color-picker-popup` 与 `date-strip` 之间） |
| 双语文档 | `packages/docs/src/components/date-picker*.md` + `src/en/components/date-picker*.md` 各三篇 |
| 侧栏 | `packages/docs/.vitepress/config/zh.ts` / `en.ts` 表单组同序插入三项 |
| 发布 | 四份 `package.json` 版本、`versions/0.6.0.md`、插件 `changelog.md`、文档站 `changelog.md` |

## 伪代码设计

### 组件契约

**m-date-picker（面板）**

- Props：`columns-type`（`DatePickerColumnType[] | null`，默认年-月-日）、`min-date` / `max-date`（null 默认前后十年）、`value`（`Date | null`）、`title`、`confirm-button-text`、`cancel-button-text`、`show-toolbar`、`loading`、`readonly`、`filter`、`formatter`、`option-height`（0 用 44）、`visible-option-num`（0 用 6）、`swipe-duration`（滚动停止判定，默认 200）、`custom-class`、`custom-style`
- Events：`update:value(date)`、`change(date, columnIndex)`、`confirm(date)`、`cancel()`
- Methods：`confirm()`、`resetSelection()`、`getSelectedDate()`
- Slots：`toolbar` / `title` / `confirm` / `cancel` / `option(option, index)` / `columns-top` / `columns-bottom`

**m-date-picker-popup（弹层）**

- 面板全部 props + `show`、`position`、`round`、`close-on-click-overlay`、`reset-on-open`、安全区、`z-index`、`duration`
- Events：面板事件 + `update:show` + `open` / `opened` / `close` / `closed` / `click-overlay`
- `confirm` / `cancel` 后派发 `update:show=false`

**m-date-picker-input（输入框）**

- Props：`value`、`columns-type`、`placeholder`、`disabled`、`clearable`、`border`、`inlaid`、`title`、确认 / 取消文案、`min-date` / `max-date`、`filter` / `formatter`、`position`、`round`、`custom-class` / `custom-style`
- Events：`update:value(Date | null)`、`confirm(date)`、`clear()`
- 展示格式由 `columns-type` 派生：`YYYY` / `YYYY-MM` / `YYYY-MM-DD` / `MM-DD`

### 列构建算法（纯数据下发）

```
buildColumns():
  base = clamp(selectedDate, min, max)
  year = base.year；月界由 year 与 min/max 年份决定；日界由 year+month 决定
  按 columns-type 顺序逐列：
    year 列：minYear..maxYear，text = 年份字符串
    month 列：月界..，text = padTwo(m+1)
    day 列：日界..，text = padTwo(d)
    options = filter(type, options, values)（null 跳过）
    options = options.map(formatter)（null 跳过）
    index = 就近匹配当前值（完全匹配优先，缺失取不大于目标值的最近项）
```

### 滚轮吸附算法（m-date-picker-column）

```
平铺结构：上占位 (visibleNum - 1) / 2 * optionHeight + 选项行 + 下占位
@scroll  → 镜像 actualTop，activeIndex = round(top / optionHeight)（驱动透明度渐隐）
停止判定 → setTimeout(swipeDuration) 后：
  readonly → 回弹到 modelValue
  否则吸附到最近 index 并 emit change(columnIndex, index)
程序化定位 → :scroll-top 写入 target；同值时先写 target + 0.5 再 nextTick 归位（强制属性下发）
```

### 关键分支与平台差异

- `columns-type` 缺失列：输出日期按默认分量归一（月 = 1 月、日 = 1）
- 无 `pointer-events`：不做覆盖式渐变遮罩，选中框细线置于列层之下，远处选项按距离分档 opacity
- 小程序端：`option` 插槽在 `v-for` 内重复声明，按 LESSONS #17 走 `#ifndef MP` / `#ifdef MP` 分叉，小程序回退内置文本

## 疑问清单

### Q1 三个组件的命名方案？（影响：目录名 / 标签名 / 文档路由）
回答：`m-date-picker` / `m-date-picker-popup` / `m-date-picker-input`（与 m-calendar 三件套对称）。

### Q2 滚轮列的实现方式？（影响：是否新增对外组件契约）
回答：内部列子组件 `m-date-picker-column.uvue`，不注册 easycom，仿 `m-calendar-panel`，不新增公共 `m-picker`。

### Q3 功能范围对齐到什么程度？（影响：props / 插槽 / 演示页规模）
回答：完整对齐 Vant——`columns-type`、`min-date` / `max-date`、`filter`、`formatter`、顶部栏、`show-toolbar`、`readonly`、`loading`、`option-height`、`visible-option-num`、`swipe-duration`。

### Q4 选中值的绑定类型？（影响：v-model 契约 / 与日历口径一致性）
回答：`Date`（对齐 m-calendar 三件套），不采用 Vant 的 `string[]`。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- 列构建在面板 `buildColumns()` 内完成，`date-picker.uts` 只承载三件套共享类型与纯工具（`DatePickerColumnType` / `DatePickerOption` / `DatePickerFilter` / `DatePickerFormatter` / `DatePickerColumn` / `padTwo` / `optionValueToNumber` / `getDatePickerDisplayFormat` / `composePickerDate`），避免跨端导入循环。
- 无覆盖式遮罩（uvue 无 `pointer-events`）：改为选项按与激活项距离分三档 `opacity`，选中框两条细线放在列层 `z-index: 0`、列层 `z-index: 1`，不拦截滚动手势。
- `swipe-duration` 语义落地为「滚动停止判定时长」（原生 `scroll-view` 无惯性动画可控），文档「与 Vant 的差异」已显式说明。
- 弹层不提供 `popup-height`：面板高度由「顶部栏 + 行高 × 可见个数」天然撑开，无 `%` 换算需求。
- 输入框展示格式由 `columns-type` 派生，未额外提供 `format` prop。

### 变更文件清单

| 类型 | 文件 |
| --- | --- |
| 新增 | `packages/core/components/m-date-picker/{date-picker.uts, m-date-picker.uvue, m-date-picker-column.uvue}` |
| 新增 | `packages/core/components/m-date-picker-popup/m-date-picker-popup.uvue` |
| 新增 | `packages/core/components/m-date-picker-input/m-date-picker-input.uvue` |
| 新增 | `packages/playground/pages-sub/{date-picker,date-picker-popup,date-picker-input}/*.uvue` |
| 新增 | `packages/docs/src/components/date-picker{,-popup,-input}.md`、`packages/docs/src/en/components/date-picker{,-popup,-input}.md` |
| 修改 | `packages/core/theme/vars.scss`（`$m-date-picker-*` 段） |
| 修改 | `packages/playground/pages/index/demo-components.uts`、`packages/docs/.vitepress/config/{zh,en}.ts` |
| 生成 | `packages/playground/pages.json`、`router/routes.gen.uts`、`types/route-name.gen.d.ts`、`uni_modules/m-ui-x/**`（sync） |

### 验证方式与结果

- `pnpm sync:uni-modules` + `pnpm sync:uni-modules:check`：通过，playground 与 core 一致。
- 四个组件经 Vite 模块请求编译：均返回 200（无编译错误）。
- Web 实测（dev server 5174）：
  - `date-picker` 页：三列渲染、滚动吸附与 `change`、`confirm`、年月组合确认日归一为 1 号、`filter` / `formatter`、`option` 插槽与自定义顶部栏、`getSelectedDate` / `confirm` 实例方法，均通过；
  - `date-picker-popup` 页：打开 / 确认自动关闭 / 取消自动关闭 / 生命周期事件，通过；
  - `date-picker-input` 页：点击弹层、确认回填 `YYYY-MM-DD`、清空回写 null 并派发 `clear`，通过；
  - 三页控制台无 error / warning。
- `pnpm build:docs`：通过（含死链检查）。
- 经验沉淀：`LESSONS_LEARNED.md` #88（`scroll-top` 同值补丁与无 `pointer-events` 的渐隐替代）。

### 遗留 TODO

- 微信小程序 / Android / iOS 真机未实测（Web 已通过；`option` 插槽与滚轮吸附在原生端的行为待复测）。
- 暂无代码级 TODO。
