# m-datetime-range-picker 日期时间范围三件套 实施方案

## 需求

- 用户提供三个 Sard 文档链接（原话）：
  - `https://sard.wzt.zone/components/datetime-range-picker`
  - `https://sard.wzt.zone/components/datetime-range-picker-input`
  - `https://sard.wzt.zone/components/datetime-range-picker-popout`
- 推断意图：按既有 `m-date-picker` 三件套的拆分惯例，新增「日期（时间）范围选择」三件套，分别对标 Sard 的面板 / 输入框 / 弹出框。
- 待用户确认：推断意图是否正确、命名与时间粒度见「疑问清单」。

## 需求分析

### 对标 API（Sard）

| 组件 | 关键契约 |
| --- | --- |
| DatetimeRangePicker（面板） | 继承 `DatetimePickerProps`；新增 `tabs: string[]`（起始 / 结束标签页标题）、`model-value: (Date \| string)[]`；emits `update:modelValue` / `change`（`Date[]`）；slots `header` / `footer` |
| DatetimePickerProps（基类） | `type`（每字母一列，`y`/`M`/`d`/`h`/`m`/`s`，默认 `'yMd'`）、`calendar`（solar / lunar）、`min` / `max`（默认前后十年）、`filter(letter, value, date, index)`、`formatter(letter, option, date, index)`、`value-format` |
| DatetimeRangePickerPopout（弹出框） | 继承范围面板 props 与 `FormPopoutProps`；`v-model:visible`、`v-model`；emits `update:visible` / `update:modelValue` / `change` / `confirm` |
| DatetimeRangePickerInput（输入框） | 继承 popout 与 `PopoutInputProps`；新增 `outlet-format`（输入框展示格式，缺省按 `type` 推导）；`clearable`；slots `header` / `footer`（含快捷选项用法） |

### 交互要点

- 面板顶部为「开始 / 结束」两个标签页，切换后各自维护一个滚轮选择器；底部确认后一次性输出两端值。
- 范围语义：起始值不得晚于结束值（需确定越界时的处理策略，见 Q6）。
- 输入框：只读展示「起 - 止」，可清空；`outlet-format` 控制展示格式。
- 弹出框：`v-model:visible` 受控显隐，`confirm` 后关闭。

### 与项目现状的差距

| 项 | 现状 | 差距 |
| --- | --- | --- |
| 列粒度 | `m-date-picker` 仅 `year` / `month` / `day` 三列 | 无时 / 分 / 秒列，`h`/`m`/`s` 需新增列生成与取值收敛逻辑 |
| 列类型配置 | `columns-type: ('year'\|'month'\|'day')[]` | Sard 为 `type: string`（字母串 + 顺序），需决定是否兼容字母串 |
| 范围选择 | `m-calendar` 有 range 网格选择，`m-date-picker` 无 | 需新增「两端值 + 标签页」状态机 |
| 值口径 | `Date`（项目统一） | Sard 支持 `Date \| string` + `value-format`，需决定是否引入格式串 |
| 农历 | 未实现 | Sard 支持 `calendar='lunar'`，本项目 `utils/date` 有 lunar 模块但面板未接入 |
| 弹层命名 | `m-*-popup` | Sard 为 `popout`，需确认沿用 `popup` 还是对齐 Sard 的 `popout` |

### 影响面（预估）

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-datetime-range-picker/`（面板 + 内部滚轮/列复用）、`m-datetime-range-picker-popup/`、`m-datetime-range-picker-input/` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-datetime-range-picker-*`（`!default`） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `pages-sub/datetime-range-picker{,-popup,-input}/`，覆盖双 tab、区间校验、清空、快捷选项 |
| 演示登记 | `demo-components.uts` 表单组字母序插入 |
| 双语文档 | `docs/src/components/` + `src/en/components/` 各三篇，侧栏同序插入 |
| 发布 | `pnpm release`（由 AI 执行 bumpp，禁止手改 version） |

## 伪代码设计

### 命名与分层（待 Q1 / Q4 确认）

```
m-datetime-range-picker           面板：tabs（开始/结束）+ 两端日期滚轮 + 区间约束
   ├─ 内部复用 m-date-picker（推荐）或 m-datetime-picker（若先扩时分秒）
m-datetime-range-picker-popup     弹层：m-popup + 面板，confirm 后关闭
m-datetime-range-picker-input     输入框：m-input 触发器 + 弹层，展示「起 - 止」
```

### 面板状态机

```
state:
  activeTab: 0 | 1                 // 0 起始，1 结束
  startDate: Date | null
  endDate: Date | null

切换 tab → 仅切换当前编辑的一端，另一端保留
任一端 change → 按区间策略处理（见 Q6）→ emit update:value([start, end])
                        → emit change([start, end])
confirm → 校验两端均非空 → emit update:value / confirm
```

### 区间约束策略（候选，待 Q6）

| 方案 | 行为 |
| --- | --- |
| A 自动交换 | 起点 > 终点时交换两端，静默纠正 |
| B 越界收敛 | 起点列的可选上限收敛为终点（反之亦然），从选项层面杜绝越界 |
| C 提示拦截 | 允许越界选择，确认时经 m-toast 提示并拒绝 |

### 时分秒列（若 Q2 选择包含）

```
在 m-date-picker 的列构建基础上扩展 letter 维度：
  columns-type 由 ('year'|'month'|'day')[] 扩展为包含 'hour' | 'minute' | 'second'
  或新增 m-datetime-picker 面板承载 y/M/d/h/m/s，范围面板内部复用
  min/max 收敛从「日」细化到「秒」
```

### 输入框展示

```
displayText = start != null && end != null
  ? format(start, outletFormat) + ' - ' + format(end, outletFormat)
  : ''
outletFormat 缺省按列组合派生（YYYY-MM-DD 等）
清空 → emit update:value(null) + clear
```

## 疑问清单

### Q1 组件命名采用哪套？（影响：目录名 / 标签名 / 文档路由）
- A. `m-datetime-range-picker` 三件套（对齐 Sard 链接命名，弹层用 `-popup`）
- B. `m-date-range-picker` 三件套（强调本项目当前只有日期粒度）
- 回答：B。

### Q2 时间粒度范围？（影响：是否扩展时分秒列 / 工作量最大项）
- A. 仅年 / 月 / 日（复用现有 `m-date-picker` 能力，`type` 支持 `yMd` / `yM` / `Md` 等组合）
- B. 支持时 / 分 / 秒（新增 `h` / `m` / `s` 列与秒级收敛）
- 回答：A。

### Q3 值绑定类型？（影响：v-model 契约与格式化 API）
- A. `Date[]`（长度 2，对齐项目 `Date` 口径，不做 `value-format`）
- B. 支持 `value-format` 输出字符串（对齐 Sard，引入格式串与解析）
- 回答：A。

### Q4 面板实现方式？（影响：复用度与新组件数量）
- A. 复用 `m-date-picker`：每个标签页内嵌一个面板（隐藏顶部栏，仅保留滚轮）
- B. 新建独立内部滚轮列，避免与 `m-date-picker` 的顶部栏 / 确认语义耦合
- C. 若 Q2 选 B，则先新增 `m-datetime-picker` 面板，范围面板组合它
- 回答：A。

### Q5 标签页形态？（影响：是否引入 m-tabs 依赖）
- A. 复用项目 `m-tabs` 组件
- B. 顶部两段自绘标题（更贴近 Sard 的轻量 tab，避免嵌套滚动容器冲突）
- 回答：B。

### Q6 区间越界处理策略？（影响：交互与校验逻辑）
- A. 自动交换两端
- B. 选项层收敛（起点上限 = 终点，终点下限 = 起点）
- C. 确认时提示并拦截
- 回答：A。

### Q7 首版插槽范围？（影响：演示页与文档规模）
- A. 仅 `header` / `footer`（Sard 同款，用于快捷选项）
- B. 同时提供面板级 `title` / `confirm` / `cancel` 插槽
- C. 首版不提供插槽
- 回答：B。

## 实施记录

### 定案汇总（按回答执行）

- Q1 → B：命名 `m-date-range-picker` / `m-date-range-picker-popup` / `m-date-range-picker-input`（弹层沿用项目 `popup` 命名）
- Q2 → A：仅年 / 月 / 日，未扩展时 / 分 / 秒
- Q3 → A：`value` 为 `Date[]`（长度 0-2），不做 `value-format`
- Q4 → A：面板复用 `m-date-picker`（隐藏顶部栏，仅保留滚轮）
- Q5 → B：两段标题自绘，不引入 `m-tabs`
- Q6 → A：确认时自动交换为升序
- Q7 → B：`header` / `footer` + `title` / `confirm` / `cancel` 插槽

### 方案落地形态（与伪代码设计的差异）

- 面板采用「两段标题 + 单滚轮实例」：`v-if` 按当前标题重建 `m-date-picker`（隐藏顶部栏），切换时自动按对应端值重新定位；未选端以另一端值作初始定位，但不回写状态。
- 自动交换只在 confirm 执行（change 保持两端原顺序派发快照）：避免滚动过程中两端突然互换导致滚轮跳变；确认后内部两端同步为升序，复开顺序正确。
- `title` 插槽整体替换两段标题，作用域参数为 `tabs` 与 `activeIndex`（与面板内部状态一致）。
- 激活下划线用 `left: 50%` + `transform: translateX(-50%)` 居中，避免与变量宽度耦合的负 margin。
- 弹层不提供 `popup-height`：高度由「两段标题 + 滚轮 + 底部按钮区」自然撑开。
- 未实现 Sard 的 `type` 字母串、`value-format`、`calendar='lunar'`、`outlet-format` 之外的格式化能力；`minDate` / `maxDate` / `filter` / `formatter` 全部沿用 `m-date-picker` 契约。

### 变更文件清单

| 类型 | 文件 |
| --- | --- |
| 新增 | `packages/core/components/m-date-range-picker/m-date-range-picker.uvue` |
| 新增 | `packages/core/components/m-date-range-picker-popup/m-date-range-picker-popup.uvue` |
| 新增 | `packages/core/components/m-date-range-picker-input/m-date-range-picker-input.uvue` |
| 新增 | `packages/playground/pages-sub/{date-range-picker,date-range-picker-popup,date-range-picker-input}/*.uvue` |
| 新增 | `packages/docs/src/components/date-range-picker{,-popup,-input}.md`、`packages/docs/src/en/components/date-range-picker{,-popup,-input}.md` |
| 修改 | `packages/core/theme/vars.scss`（`$m-date-range-picker-*` 与 `$m-date-range-picker-input-*` 段） |
| 修改 | `packages/playground/pages/index/demo-components.uts`、`packages/docs/.vitepress/config/{zh,en}.ts` |
| 生成 | `packages/playground/pages.json`、`router/routes.gen.uts`、`types/route-name.gen.d.ts`、`uni_modules/m-ui-x/**`（sync） |

### 验证方式与结果

- `pnpm sync:uni-modules` + `pnpm sync:uni-modules:check`：通过，playground 与 core 一致。
- 三个组件经 Vite 模块请求编译：均返回 200（无编译错误）。
- Web 实测（dev server 5174）：
  - `date-range-picker` 页：两段标题渲染、切换编辑端、滚轮吸附、确认自动升序、`header` 快捷按钮写入两端值、`title` / `confirm` / `cancel` 插槽、`getSelectedValue` / `confirm` 实例方法，均通过；
  - `date-range-picker-popup` 页：打开 / 取消关闭 / 确认关闭、受控外部赋值后弹层回显（起始端为一个月前），通过；
  - `date-range-picker-input` 页：有值时展示「YYYY-MM-DD - YYYY-MM-DD」、清空回写 null 并派发 `clear`、禁用态展示与无清空按钮，通过；
  - 三页控制台无 error。
- `pnpm build:docs`：通过（含死链检查）。
- 说明：浏览器自动化无法滚动 uni-app x 的 `scroll-view` 滚轮列，输入框「弹层内选择后确认回填」改由「填入近一月 + 清空 + 禁用态」覆盖展示与回写链路；滚轮交互与确认已在面板页与既有 `m-date-picker` 页实测。

### 遗留 TODO

- 微信小程序 / Android / iOS 真机未实测（Web 已通过）。
- 时 / 分 / 秒粒度（Q2 选 A）与农历未纳入首版，若后续需要，建议先新增 `m-datetime-picker` 面板再让范围面板组合。
- 演示页事件日志顺序说明：`cancel` / `confirm` 之后紧跟的 `close` / `closed` 已做保留处理，避免结果被覆盖。
