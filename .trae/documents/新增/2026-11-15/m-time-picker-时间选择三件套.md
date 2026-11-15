# m-time-picker 时间选择三件套 实施方案

## 需求

- 用户原话：「日期相关组件都已经实现，但是时间的组件却没有；现在请设计时间相关的组件」。
- 推断意图：补齐与日期三件套（`m-date-picker` / `m-date-picker-popup` / `m-date-picker-input`）对称的**时间选择三件套**；是否同时包含「时间范围三件套」见疑问清单 Q1。
- 本文档只做需求分析与伪代码设计，疑问清单确认后才落码。

## 需求分析

### 现有可复用资产

| 资产 | 能力 | 时间组件的复用方式 |
| --- | --- | --- |
| `m-date-picker-column.uvue` | 通用滚轮列：`options`（value / text）、`modelValue` 下标、吸附、透明度渐隐、`readonly` | 直接相对路径导入复用（内部组件，不注册 easycom） |
| `m-date-picker` 面板 | 列构建、filter / formatter、吸附回调、顶部栏、`option` / `toolbar` / `confirm` / `cancel` 插槽 | 仅作结构与 API 参考；时间列维度不同，不直接组合 |
| `m-date-picker-popup` / `-input` | 弹层组合、只读触发器、自绘清空、展示格式派生 | 结构与样式沿用，仅替换面板 |
| `m-date-range-picker` 三件套 | 两段标题 + 两端值 + 确认升序交换 | 时间范围三件套可直接套用（若 Q1 包含） |
| `utils/date.uts` | `formatDate`、`getDayStart` 等 | 时间解析 / 格式化 |

### 与日期组件的差异

| 项 | 日期选择 | 时间选择 |
| --- | --- | --- |
| 列维度 | 年 / 月 / 日 | 时 / 分 / 秒 |
| 值语义 | 日期（零点） | 一天内时刻（可选携带日期） |
| 约束 | min / max 按日收敛 | min / max 时刻收敛，需定义跨天语义 |
| 步长 | 无 | 分钟步长（如 1 / 5 / 15 分钟）为常见诉求 |
| 制式 | 无 | 12 / 24 小时制 |
| 展示 | `YYYY-MM-DD` | `HH:mm` / `HH:mm:ss` |

### 影响面（预估）

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-time-picker/`（面板 + 复用列组件）、`m-time-picker-popup/`、`m-time-picker-input/` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-time-picker-*`（`!default`，不改旧默认值） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `pages-sub/time-picker{,-popup,-input}/`，覆盖粒度、步长、约束、制式、插槽、清空 |
| 演示登记 | `demo-components.uts` 表单组字母序插入 |
| 双语文档 | `docs/src/components/` + `src/en/components/` 各三篇，侧栏同序插入 |
| 发布 | 变更日志三处（插件 / 文档站 / versions），`version` 字段不触碰（由用户手动 release） |

## 伪代码设计

### 命名与分层

```
m-time-picker                 面板：时 / 分（/ 秒）滚轮 + 顶部栏
   └─ 复用 ../m-date-picker/m-date-picker-column.uvue（每列一个实例）
m-time-picker-popup           弹层：m-popup + 面板，确认 / 取消后关闭
m-time-picker-input           输入框：m-input 触发器 + 弹层，展示 HH:mm(:ss)
```

（若 Q1 含范围，则追加 `m-time-range-picker` / `-popup` / `-input`，复用 `m-date-range-picker` 的两段标题与升序交换模式。）

### 面板状态与列构建

```
props: columnsType('hour'|'minute'|'second')[]   // 默认 ['hour','minute']
       minTime / maxTime（HH:mm:ss 或 Date）      // 约束
       minuteStep / secondStep                    // 步长
       hourCycle: 24 | 12                         // 制式
       filter / formatter                         // 选项加工
       value（Date | string，见 Q3）

buildColumn('hour'):
  list = hourCycle == 24 ? 0..23 : 1..12（12 制另加 AM/PM 列或前缀）
buildColumn('minute' | 'second'):
  按 step 生成 0, step, 2*step ...

吸附（复用列组件）→ 更新对应分量 → 组装新值 → emit change
确认 → emit update:value / confirm；取消 → emit cancel
```

### 约束策略（待 Q6 确认）

| 方案 | 行为 |
| --- | --- |
| A 选项层收敛 | 时列按 min / max 收敛，选定小时后分列再收敛（同日约束） |
| B 确认时校验 | 允许任意选择，确认时经 m-toast 提示并拒绝 |
| C 不约束 | 首版仅提供列与步长，min / max 后续迭代 |

### 输入框展示

```
displayText = value == null ? '' : format(value, columnsType 派生格式)
  ['hour','minute']        → HH:mm
  ['hour','minute','second'] → HH:mm:ss
  12 制附加 AM / PM（若 Q7 采用）
清空 → emit update:value(null) + clear
```

## 疑问清单

### Q1 本轮范围？（影响：组件数量与工作量）
- A. 仅时间三件套（面板 / 弹层 / 输入框）
- B. 时间三件套 + 时间范围三件套（对齐日期范围的两段标题 + 升序交换）
- 回答：B

### Q2 命名方案？（影响：目录名 / 标签名 / 文档路由）
- A. `m-time-picker` / `m-time-picker-popup` / `m-time-picker-input`（若含范围：`m-time-range-picker` 三件套）
- B. 其他命名（请在回答中给出）
- 回答：A。

### Q3 值绑定类型？（影响：v-model 契约与格式化 API）
- A. `Date`（携带日期，时间分量取所选时 / 分 / 秒；对齐日期组件的 `Date` 口径）
- B. 字符串 `'HH:mm'` / `'HH:mm:ss'`（纯时间语义，不携带日期）
- C. `Date` 为主 + 可选 `value-format` 输出字符串
- 回答：B。

### Q4 粒度？（影响：列数量与展示格式）
- A. 仅时 : 分
- B. 时 : 分 : 秒
- C. `columns-type` 可配置（`['hour','minute','second']` 任意组合，默认时 : 分）
- 回答：C。

### Q5 是否需要步长？（影响：列生成与取值收敛）
- A. 需要：`minute-step`（默认 1）与 `second-step`（默认 1）
- B. 不需要，固定 1 分钟 / 1 秒
- 回答：A。

### Q6 是否需要 min-time / max-time 约束？（影响：选项收敛与跨天语义）
- A. 需要，选项层收敛（选定小时后分列随之收敛；跨天按同日处理）
- B. 需要，确认时提示并拦截
- C. 首版不做约束
- 回答：A。

### Q7 是否需要 12 小时制？（影响：列结构与展示）
- A. 需要（`hour-cycle`：24 / 12，12 制带 AM / PM）
- B. 仅 24 小时制
- 回答：A。

### Q8 插槽范围？（影响：演示页与文档规模）
- A. 对齐 `m-date-picker`：`toolbar` / `title` / `confirm` / `cancel` / `option`
- B. 仅 `confirm` / `cancel`
- C. 首版不提供插槽
- 回答：A。

## 实施记录

### 定案汇总（按回答执行）

- Q1 → B：时间三件套 + 时间范围三件套（共 6 个组件）
- Q2 → A：`m-time-picker` / `m-time-picker-popup` / `m-time-picker-input`；范围 `m-time-range-picker` / `-popup` / `-input`
- Q3 → B：值为字符串（`'HH:mm'` / `'HH:mm:ss'`），不携带日期
- Q4 → C：`columns-type` 可配置（hour / minute / second 任意顺序），默认时-分
- Q5 → A：`minute-step` / `second-step`（默认 1，限制 1-59）
- Q6 → A：选项层收敛（同日）；单端配置自动补齐另一端（min → 00:00:00，max → 23:59:59），`min-time` 晚于 `max-time` 视为跨天不约束
- Q7 → A：`hour-cycle` 24 / 12；12 制自动在时列前附加「上午 / 下午」列，值仍按 24 小时制输出
- Q8 → A：`toolbar` / `title` / `confirm` / `cancel` / `option` 插槽

### 方案落地形态（与伪代码设计的差异）

- 滚轮列直接复用 `m-date-picker-column.uvue`（跨目录相对路径导入，不注册 easycom），时间面板只负责列选项生成与状态换算。
- 12 制的「上午 / 下午」列类型为 `'period'`（选项值 01 = 上午、02 = 下午），不写入 `columns-type`；`filter` / `formatter` 同样作用于该列。
- 约束收敛：时列按 `floor(min/3600)..floor(max/3600)` 圈定；分列保留与区间有交集的分钟；秒列逐秒比对区间；初始化与切换后统一经 `clampParts`（区间 + 步长对齐）回写。
- 步长对齐可能落到区间外，`findOptionIndex` 以「完全匹配优先、缺失取不大于目标值的最近项」兜底。
- 时间范围面板沿用日期范围的两段标题结构；升序比较用逐字符 `isAfter`（避免字符串比较算子在原生端的差异）。
- 时间范围输入框直接展示两端字符串（不加 `outlet-format`），格式由 `columns-type` 决定。

### 变更文件清单

| 类型 | 文件 |
| --- | --- |
| 新增 | `packages/core/components/m-time-picker/{time-picker.uts, m-time-picker.uvue}` |
| 新增 | `packages/core/components/m-time-picker-popup/m-time-picker-popup.uvue`、`m-time-picker-input/m-time-picker-input.uvue` |
| 新增 | `packages/core/components/m-time-range-picker/m-time-range-picker.uvue`、`m-time-range-picker-popup/m-time-range-picker-popup.uvue`、`m-time-range-picker-input/m-time-range-picker-input.uvue` |
| 新增 | `packages/playground/pages-sub/{time-picker,time-picker-popup,time-picker-input,time-range-picker,time-range-picker-popup,time-range-picker-input}/*.uvue` |
| 新增 | `packages/docs/src/components/time-{picker,picker-popup,picker-input,range-picker,range-picker-popup,range-picker-input}.md` 及 `src/en/components/` 同名 6 篇 |
| 修改 | `packages/core/theme/vars.scss`（`$m-time-picker-*` / `$m-time-picker-input-*` / `$m-time-range-picker-*` / `$m-time-range-picker-input-*`） |
| 修改 | `packages/playground/pages/index/demo-components.uts`、`packages/docs/.vitepress/config/{zh,en}.ts` |
| 生成 | `packages/playground/pages.json`、`router/routes.gen.uts`、`types/route-name.gen.d.ts`、`uni_modules/m-ui-x/**`（sync） |

### 验证方式与结果

- `pnpm sync:uni-modules` + `pnpm sync:uni-modules:check`：通过。
- 六个组件经 Vite 模块请求编译：均返回 200。
- 六个演示页 HTTP：均返回 200，`pages.json` 路由已生成。
- Web 实测（dev server 5174）：
  - `time-picker` 页：时 / 分两列与顶部栏、步长 15 + 09:00-18:00 时列收敛、12 制「上午 / 下午」列、确认输出 `HH:mm`、`getSelectedValue` 返回时间字符串，均通过；
  - `time-range-picker-input` 页：点击弹层出现两段标题、填入后展示「09:00 - 18:00」、清空回写 null 并派发 `clear`、禁用态展示且无清空按钮，均通过；
  - 两页控制台无 error。
- `pnpm build:docs`：通过（含死链检查）。

### 遗留 TODO

- 滚轮拖拽 / 吸附交互未由浏览器自动化覆盖（`scroll-view` 滚轮不可程序化滚动），已由既有 `m-date-picker` 同款列组件与结构验证承接；真机（微信小程序 / Android / iOS）待复测。
- 时间范围跨天语义未支持（按同日比较与升序交换）。
- 首版未做「日期 + 时间」组合组件（`m-datetime-picker`），如需要建议复用本面板与日期面板组合。
