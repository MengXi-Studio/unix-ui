# m-date-strip 日期横条 实施方案

## 需求

- 对标设计：Sard `DateStrip`（https://sard.wzt.zone/components/date-strip）——以横向条带展示一段连续日期，支持单选 / 多选 / 范围选择。
- 目标：在 `packages/core` 新增 `m-date-strip` 组件，完成主题变量、uni_modules 同步、演示页、双语文档与验证闭环。

## 需求分析

### 对标 API

| 项 | 内容 |
| --- | --- |
| Props | `type`（single / multiple / range，默认 single）、`model-value`、`min`、`max`、`current-date`、`disabled-date`、`filter`、`max-days`、`over-max-days`、`formatter`、`allow-same-day`、`value-format`、`start-date-text`、`end-date-text`、`same-date-text`、`show-lunar` |
| Emits | `update:modelValue`、`change` |
| 类型 | `CalendarType = 'single' \| 'multiple' \| 'range'`、`CalendarDay`（与 Calendar 一致） |
| 默认值 | `min` = 前七天、`max` = 后七天、`maxDays` = `Number.MAX_SAFE_INTEGER`、`allowSameDay` = false |
| 样式变量 | 列间距、单项宽 / 内边距 / 圆角 / 边框色 / 背景、周字号、选中色、今日色、中段底色、星期序（`--s-date-strip-item-week-order`） |

视觉结构：每一项上下两行文本（周日 / 星期 + 日号），选中项为整块高亮，范围模式中间日期为连续底色带，首尾为端块并显示「开始 / 结束 / 开始-结束」文案。

### 与本库现有能力的差异（关键）

| 维度 | m-calendar（现有） | m-date-strip（新增） |
| --- | --- | --- |
| 形态 | 月历网格，纵向滚动，含标题 / 水印 / 确认按钮 | 一维横向日期条，无标题、无确认，点选即生效 |
| 值口径 | `Date \| Date[]`，无 `value-format` | 对标版支持 `value-format` 字符串绑定 |
| 默认范围 | min 今天、max 今天 + 6 个月 | 前七天 ~ 后七天 |
| 超限提示 | `max-range` + 内置 `m-toast` | `max-days` + `over-max-days` 回调（组件不弹 toast） |
| 农历 | 不支持，库内无农历数据 | 对标版支持 `show-lunar` |
| formatter | `CalendarDayItem`：`topInfo` / `bottomInfo` / `className`（无行内 style） | 对标版为 `top` / `bottom` / `style` 对象 |

可复用资产：`CalendarType`、`CalendarDayItem`、`CalendarDayType`、`getDayStart` / `getDayDiff` / `isCircularDayType` / `isEdgeDayType` 等均已在 `packages/core/components/m-calendar/calendar.uts` 导出，且 `m-calendar-popup` 已有跨目录相对导入先例；选择状态机（single / multiple / range）目前内联在 `m-calendar.uvue`，未导出。

### 影响面

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-date-strip/m-date-strip.uvue`（+ 需要时同级 `date-strip.uts`） |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-date-strip-*` 段（全 `!default`） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `packages/playground/pages-sub/date-strip/date-strip.uvue` + `demo-components.uts` 登记（表单组件组，`calendar-popup` 之后、`cascader` 之前） |
| 文档 | `packages/docs/src/components/date-strip.md` + `src/en/components/date-strip.md` + zh.ts / en.ts 侧栏（同字母序） |
| 变更登记 | 三处 changelog + 版本号（core / 插件 package.json、manifest、首页版本号） |

### 技术要点（UTS / uvue 约束）

- **横向滚动**：`scroll-view` 必须用 `direction="horizontal"`（`scroll-x` 已废弃，会被内部强制 `overflow-x: hidden`），隐藏滚动条需 `show-scrollbar="false"` + Web 端条件编译 `scrollbar-width: none` / `::-webkit-scrollbar` 双覆盖（m-tabs 既有结论）。
- **项宽固定**：单项宽走主题变量（对标 64px），条带内容自然溢出触发滚动；不随屏宽伸缩，故不使用 rpx。
- **选中视觉**：选中 / 端块为圆角方块，范围中段为连续底色带——相邻项之间需靠列间距与背景层拼出连续视觉（对齐 m-calendar 的 range bar 思路，用绝对定位背景层而非逐项留缝）。
- **今日标记**：`current-date` 仅决定「今天」的判定基准与文案高亮，不改变选中态。
- **值比较**：全部日期归一到当日零点时间戳比较（沿用 `getDayStart`），避免时分秒干扰。
- **滚动定位**：挂载 / 值变更时按索引 × 项宽计算 `scroll-left` 居中到选中项（`m-tabs` 程序化滚动先例），不依赖 `scroll-into-view`（只能贴边）。
- **formatter 的样式能力**：uvue 端 `style` 对象绑定在原生端受限，需评估是否只暴露 `className` 或走条件编译。
- **农历**：需内置农历换算数据表（1900-2100 约 200 条压缩数据），属于新增数据资产，需评估体积与维护成本。

## 伪代码设计

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | `'single' \| 'multiple' \| 'range'` | `'single'` | 选择类型，决定 v-model 值形态 |
| value | `Date \| Date[] \| null` | `null` | 选中值（v-model:value；single 为 Date，multiple / range 为 Date[]） |
| minDate | `Date \| null` | `null` | 可选最小日期（null 取 currentDate - 7 天） |
| maxDate | `Date \| null` | `null` | 可选最大日期（null 取 currentDate + 7 天） |
| currentDate | `Date \| null` | `null` | 「今天」基准（null 取 `new Date()`） |
| disabledDate | `((date: Date) => boolean) \| null` | `null` | 返回 true 禁用该日（仍展示） |
| filter | `((date: Date) => boolean) \| null` | `null` | 返回 false 不展示该日 |
| maxDays | `number` | `-1` | 最多可选天数（多选 / 范围；-1 不限制） |
| formatter | `CalendarFormatter \| null` | `null` | 日期项文案 / 类名定制 |
| allowSameDay | `boolean` | `false` | 范围选择是否允许起止同日 |
| startDateText / endDateText / sameDateText | `string` | `'开始'` / `'结束'` / `'开始/结束'` | 范围端点文案 |
| customClass / customStyle | | | 根节点样式直达 |

### Emits

| 事件 | 说明 |
| --- | --- |
| `update:value` | 选中值变化（v-model:value） |
| `change` | 用户点击导致值变化 |
| `over-max-days` | 超出 maxDays 限制（不改变值） |
| `click-disabled-date` | 点击禁用日期（可选，对齐 m-calendar） |

### 模板结构

```
scroll-view.m-date-strip (horizontal, show-scrollbar=false)
 └─ view.m-date-strip__track
     ├─ view.m-date-strip__item × N  (宽度 $m-date-strip-item-width)
     │   ├─ text.m-date-strip__week   (周几 / 端点文案)
     │   ├─ text.m-date-strip__day    (日号)
     │   └─ text.m-date-strip__info   (formatter 附加文案，按需)
     └─ view.m-date-strip__range-bar  (范围中段底色带，absolute)
```

### 关键逻辑分支

1. **日期序列构建**：`min → max` 逐日生成，`filter` 剔除后得到展示序列；`disabledDate` 标记 `disabled`，不剔除。
2. **single**：点击即替换选中日期 → emit `update:value` + `change`。
3. **multiple**：点击切换该日选中态；新增前校验 `maxDays`，超限 emit `over-max-days` 且不改值。
4. **range**：首点设起点（值暂为 `[start]`），次点结束；起点 > 终点时自动交换；`maxDays` 超限 emit `over-max-days`；`allowSameDay` 为 false 时同日结束不生效。
5. **formatter**：序列构建完成后统一回调，改写 `topInfo` / `bottomInfo` / `className` / `type`（是否支持行内 `style` 见疑问 Q2）。
6. **滚动定位**：值变化后 `nextTick` → 计算目标 `scroll-left` = `index * itemWidth - (viewportWidth - itemWidth) / 2`，`#ifdef WEB` 同步测量容器宽，否则按 375 兜底。
7. **禁用态**：点击不改变值，仅按需 emit `click-disabled-date`。

### 主题变量草案（`$m-date-strip-*`）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `$m-date-strip-background` | `$m-white` | 条带背景 |
| `$m-date-strip-column-gap` | `8px` | 项间距 |
| `$m-date-strip-item-width` | `64px` | 单项宽 |
| `$m-date-strip-item-padding-y` / `-x` | `9px` / `6px` | 单项内边距 |
| `$m-date-strip-item-border-radius` | `4px` | 单项圆角 |
| `$m-date-strip-item-border-color` | `transparent` | 单项边框色 |
| `$m-date-strip-item-bg` / `-bg-selected` / `-bg-middle` | `transparent` / `$m-color-primary` / `rgba($m-color-primary, 0.1)` | 常规 / 选中 / 范围中段底色 |
| `$m-date-strip-item-color` / `-color-selected` / `-color-today` / `-color-disabled` | 主文本 / 白 / 主色 / 四级文本 | 文本色 |
| `$m-date-strip-item-week-font-size` / `-day-font-size` / `-info-font-size` | `12px` / `16px` / `10px` | 字号 |

## 疑问清单

### Q1 绑定值格式（影响：`value-format` 是否首版实现、是否需要日期格式化工具）

对标版支持 `value-format`（如 `YYYY-MM-DD`），本库 `m-calendar` 目前只接受 `Date | Date[]`。若实现，需要新增一套日期格式化 / 解析工具（支持 `YYYY` `MM` `DD` 等符号），并在 Date 与 string 之间做双向转换与非法值兜底。

- 回答：

### Q2 formatter 的入参形态（影响：类型定义、跨组件耦合、原生端兼容）

对标版回调 `CalendarDay` 并允许写 `day.top` / `day.bottom` / `day.style`（行内 style 对象）；本库 `m-calendar` 的 `CalendarDayItem` 为 `topInfo` / `bottomInfo` / `className`，无行内 style（uvue 原生端 style 对象绑定受限）。

- 回答：

### Q3 `show-lunar` 农历（影响：数据表引入、包体积、首版范围）

库内目前无农历换算能力，实现需内置 1900-2100 农历数据表（压缩后约数 KB～数十 KB），并覆盖闰月、节气裁剪等边界。

- 回答：

### Q4 `maxDays` 与超限反馈（影响：命名一致性、是否内置 toast）

本库 `m-calendar` 用 `max-range` + 内置 `m-toast`；对标版用 `max-days` + `over-max-days` 回调。两者并存会造成同一库内命名/行为不一致。

- 回答：

### Q5 默认可选范围（影响：默认交互与演示效果）

对标版默认 min = 前七天、max = 后七天（共 15 天）；本库 `m-calendar` 默认今天 ~ 今天 + 6 个月。日期条范围过大时滚动成本高。

- 回答：

### Q6 选择状态机是否抽取公共实现（影响：改动面与回归风险）

single / multiple / range 的状态机目前内联在 `m-calendar.uvue`。日期条需要同一套语义：

- 方案 A：在 `calendar.uts` 中抽取可复用的纯函数（打标、超限判定），两个组件各自持有状态（改动小、需回归 m-calendar 家族）。
- 方案 B：日期条内独立实现一套（零回归风险、存在逻辑重复）。

- 回答：

### Q7 范围选择的交互细节（影响：touchend 判定、文案展示）

需明确：① 起始日期再次点击是否取消（对标版为重新开始）；② `allowSameDay=false` 时点击与起点同日是忽略还是提示；③ 范围跨过被 `filter` 剔除的日期时，中段底色是否跳过该日。 

- 回答：

### Q8 滚动定位与边缘处理（影响：测量分支与多端验证成本）

是否需要「挂载 / 值变更自动居中选中项」？是否需要左右边缘渐隐遮罩提示可滚动？两者都会引入测量 / 平台分支（Web 同步测量、小程序按 id 异步测量、App 异步测量）。

- 回答：

### Q9 插槽与自定义出口（影响：API 面与演示覆盖）

对标版无具名插槽，仅靠 `formatter`。是否额外提供 `item` 插槽（完全自定义单项内容）或 `top-info` / `bottom-info` 插槽（对齐 m-calendar）？

- 回答：

### Q10 版本归属与文档分组（影响：changelog 与版本号改动）

- 分组：默认归「表单组件」，按字母序位于 `calendar-popup` 与 `cascader` 之间。
- 版本：今日 changelog 已存在未发布的 `0.5.0`（三件套 + fab）。`m-date-strip` 是追加进 `0.5.0`，还是单开 `0.6.0`？

- 回答：
