# m-calendar-popup 补齐 v-model:value 透传 实施方案

> 状态：已完成（2026-10-30，DoD 全项通过，实施记录见文末）。

## 需求

用户指令：「现在开始修复 m-calendar-popup 组件相关问题」，未附具体问题清单。

## 排查过程与结论（2026-10-30 实测）

对演示页 `pages-sub/calendar-popup/calendar-popup.uvue` 做 playwright 实测（19 项断言）+ 源码静态审查（popup / calendar / input 三组件对照）：

**运行时功能全部通过（19/19 PASS，无控制台报错）**，覆盖：

- 开合生命周期：标题渲染、初始聚焦月（2026年10月）、遮罩点击关闭、confirm 自动关闭、复开聚焦月经 refreshView 复位；
- single / multiple / range 三类型：select、confirm、多选超限 over-range + toast、范围选满自动确认自动关闭（show-confirm=false）；
- 居中形态（popup-position=center、无圆角）、formatter 界外禁用点击事件、12 个插槽透传。

**排查中两度疑似缺陷，均经实验证伪为测试假象**（已留痕，防重蹈）：

1. 「选中后滚动跳回首月」：实测 scrollTop 恒定落到 208 = 被点击格在滚动视口内的正中心位置，是 Playwright CDP 对点击目标自动居中（scrollIntoViewIfNeeded）所致，组件滚动逻辑无缺陷；
2. 「日期格互相遮挡」：m-calendar 月块水印文本即月份数字（如 11 月水印「11」），测试定位器误点水印中心被上层日期格拦截；真实用户点击不受影响。

**唯一确认的真实缺口（静态审查）**：m-calendar-popup 未透传 `v-model:value`——

- `m-calendar`（面板）已支持 `value` prop + `update:value` 事件（2026-10-30 早间补齐）；
- `m-calendar-input` 已支持 `v-model:value` 回填；
- `m-calendar-popup` 的 props（28 个）/ emits（14 个）/ slots（12 个）逐项比对后仅缺此一项，家族 API 不一致，外部无法对弹层日历做受控选中。

## 需求分析

- **改动定性**：纯透传补齐，m-calendar-popup 是零状态组合组件（自身无选择状态），value 语义直接对齐 m-calendar 的 `v-model:value`（single 为 Date / multiple、range 为 Date[] / null 未选）。
- **影响面**：core 的 `m-calendar-popup.uvue`（Props + emits + 模板绑定）；playground 演示页新增受控演示块；docs 双语文档（Props 表 + Events 表）；changelog；主题变量无涉及。
- **限制注记**：无（纯逻辑转发，无样式 / 平台差异）。

## 伪代码设计

### 组件（m-calendar-popup.uvue）

```ts
// Props 增补（defaultDate 之后）：
/** 选中值（v-model:value）：single 为 Date，multiple / range 为 Date[]，null 未选 */
value?: Date | Date[] | null

// withDefaults 增补：
value: null

// emits 增补（update:show 旁）：
/** 选中值变化（v-model:value；透传 m-calendar） */
'update:value': [value: Date | Date[] | null]

// 模板 m-calendar 绑定增补：
:value="value"
@update:value="onCalValueChange"

// script 增补转发：
function onCalValueChange(value: Date | Date[] | null) {
    emit('update:value', value)
}
```

### 演示页（pages-sub/calendar-popup/calendar-popup.uvue）

「基础弹层」节后新增「受控选中值（v-model:value）」演示块：页面持有 `controlledValue`，弹层绑定 `v-model:value="controlledValue"`，caption + 按钮展示当前受控值回显（select / confirm 均回写）；一页穷举原则下补齐该 prop 的可见示例。

### 文档

- `packages/docs/src/components/calendar-popup.md` 与 `src/en/components/calendar-popup.md`：Props 表新增 `v-model:value` 行（类型 / 默认值 null / 说明对齐 m-calendar）；Events 表新增 `update:value`；演示代码块与 zh/en 侧栏无变化。
- changelog：docs zh/en + 插件 KEEP（`playground/uni_modules/m-ui-x/changelog.md`）按现有未发布版本条目补一行。

## 实施步骤

1. core：`m-calendar-popup.uvue` 按伪代码增补 value prop / emit / 转发；
2. `pnpm sync:uni-modules`；
3. 演示页新增受控演示块 + pages.json 无需变更（既有页面）；
4. docs 双语文档 + changelog；
5. 验证链：`pnpm sync:uni-modules:check` → dev server 实测（既有 19 项断言 + 新增受控值断言）→ `pnpm build:docs`；
6. 回填实施记录，按项目约定清理 `.screenshots`。

## 疑问清单

### Q1 value 语义采用「真双向透传」（对齐 m-calendar 的 v-model:value，select 与 confirm 均实时回写），还是 m-calendar-input 式「default-date 单向受控 + confirm 时回写」？
当前方案倾向前者（组合组件零状态，纯转发实现最简、家族语义一致；m-calendar 内部已处理 default-date 与 value 的优先级）。回答：默认真双向透传即可，与 m-calendar 面板组件语义完全对齐，符合组合组件的定位。

## 实施记录（2026-10-30 回填）

### 方案落地形态（与伪代码差异）

- core 组件 value prop / emit / `:value` 绑定 / `onCalValueChange` 转发均按伪代码原样落地，无偏差。
- **一处文档语义修正**（验证期发现）：伪代码与文档初稿写「select / confirm 均实时回写」，实测确认 m-calendar 的 `emitConfirm()` 只发 `confirm` 不发 `update:value`（[m-calendar.uvue#L664-670](file:///Users/queyupeng/github/MengXi-Studio/unix-ui/packages/core/components/m-calendar/m-calendar.uvue)）——回写仅发生在 select；确认值以 confirm 事件参数为准。与 m-calendar 家族语义一致（其文档即「点击日期即触发 select 并同步 v-model:value」），已按实际行为修正双语文档与演示页 caption，组件代码无需改动。
- **一处断言语义修正**（验证期发现）：value=null 且 default-date 未设时，m-calendar single 类型默认选中今天（对齐 Vant Calendar default-date 默认今天语义，[m-calendar.uvue#L390-391](file:///Users/queyupeng/github/MengXi-Studio/unix-ui/packages/core/components/m-calendar/m-calendar.uvue)）——受控值数据层为 null、UI 层默认选中今天，两者并存属既定设计，测试断言按此校准。

### 变更文件清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/m-calendar-popup/m-calendar-popup.uvue` | Props 增补 `value`、withDefaults `value: null`、emits 增补 `update:value`、模板 `:value` + `@update:value` 绑定、`onCalValueChange` 转发 |
| `packages/playground/uni_modules/m-ui-x/components/m-calendar-popup/` | 同步产物（`pnpm sync:uni-modules`） |
| `packages/playground/pages-sub/calendar-popup/calendar-popup.uvue` | 新增「受控选中值」演示节（双按钮：受控回显 / 外部设值为今天并打开）+ `controlledValue` 状态与 `.demo-btn-gap` 样式 |
| `packages/docs/src/components/calendar-popup.md` | 受控演示节 + Props 表 `v-model:value` 行 + Events 表 `update:value` 行 + 日历透传列表补 `value` |
| `packages/docs/src/en/components/calendar-popup.md` | 英文镜像同步 |
| `packages/docs/src/changelog.md` / `src/en/changelog.md` | 0.2.0 条目补「`v-model:value` 受控选中值透传」 |
| `packages/playground/uni_modules/m-ui-x/changelog.md` | KEEP 文件，popup 描述句同步补充 |

### 验证方式与结果（DoD）

1. `pnpm sync:uni-modules:check` → 「playground 插件与 core 一致」通过；
2. dev server（5174，HBuilderX CLI，PID 40008）实测 24/24 断言 PASS（原 19 项 + 受控值 5 项：弹层打开 / null 未选与 single 默认选中今天 / 外部设值后选中态跟随 / select 实时回写 / 确认关闭），页面功能日志（select / confirm / over-range / click-disabled-date）均捕获且值正确；
3. 运行时错误：干净加载复测无 404 / 无 pageerror（测试中偶发 404 为 dev server 首次编译产物竞态，非组件缺陷）；
4. `pnpm build:docs` 构建通过（VitePress 死链检查无报错）。

### 验证期测试假象补充（防重蹈，接排查节）

3. 「受控选中态未跟随」：多弹层 DOM 并存时 `locator.isVisible()` 只检查首个匹配——DOM 顺序靠前的基础弹层（关闭态）选中格遮蔽了受控弹层的真实选中格；且 m-popup 关闭态面板为 `translateY(100%)` 移出视口，`isVisible` 仍为 true，需 bbox 视口内判定；
4. 「点击 29 无回写」：受控弹层未设 min-date 默认今天，10-29 为禁用格，点击不选择属组件正确行为，测试应点可选日。

### 遗留 TODO

无。
