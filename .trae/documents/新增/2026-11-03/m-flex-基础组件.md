# m-flex / m-flex-item 基础组件 实施方案

> 补录说明：本任务在实施期未按 `workflow.md` 第一步建档（代码先于文档产出，属流程违规），此文档为事后按固定结构补录，疑问清单无实施期答疑记录。

## 需求

新增面向 uni-app x 的弹性布局组件（布局类），对标主流 UI 库的 Flex 组件：

- 容器侧提供方向、间距、主轴 / 交叉轴对齐、自身 flex 简写、自动换行能力；
- 子项经 `m-flex-item` 包裹实现间距（App 端 ucss 不支持 flex `gap`，且无子级 / 结构选择器，容器无法给插槽直通的子元素加间距）；
- 子项 `v-if` / `v-for` 动态增删后间距轮位自动重排；
- 独立使用 `m-flex-item` 时退化为普通纵向容器（无间距语义）。

## 需求分析

| 层 | 落点 | 内容 |
| --- | --- | --- |
| core 组件 | `packages/core/components/m-flex/` | `m-flex.uvue`（容器）、`context.uts`（跨组件共享上下文） |
| core 组件 | `packages/core/components/m-flex-item/` | `m-flex-item.uvue`（子项包裹器） |
| 主题变量 | `packages/core/theme/vars.scss` | 新增 `$m-flex-gap-sm`（4px）/ `$m-flex-gap`（8px）/ `$m-flex-gap-lg`（12px），全部 `!default` |
| 演示页 | `packages/playground/pages-sub/flex/flex.uvue` + `pages.json` | 穷举全部方向 / 间距档位 / 对齐 / 换行 / flex 简写变体 |
| 使用文档 | `packages/docs/src/components/flex.md`、`packages/docs/src/en/components/flex.md` | 双语文档（Props / Events / 插槽 / 已知限制） |
| 侧栏导航 | `packages/docs/.vitepress/config/zh.ts`、`en.ts` | 布局分组新增 Flex 项 |
| changelog | 文档站 zh / en、`playground/uni_modules/m-ui-x/changelog.md` | 0.3.0 新增条目 |

影响面：纯新增组件，无破坏性变更；不触碰 playground 工程基座；同步产物经 `pnpm sync:uni-modules` 生成，不手改。

## 伪代码设计

### m-flex Props / Slots

- `direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'`，默认 `row`（uvue view 默认 column，基类须显式 `flex-direction: row`）
- `gap?: number | string`，默认 `medium`：`small` / `medium` / `large` 走主题变量类；number 补 `px`；其余 string 原样
- `align?: 'start' | 'end' | 'center' | 'baseline'`，默认 null（沿用 view 默认 stretch）
- `justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'`，默认 null（沿用 flex-start）
- `flex?: string`，默认空（容器自身 CSS 简写透传）
- `wrap?: boolean`，默认 false（仅 row / row-reverse 生效）
- `customClass?: string.ClassString` / `customStyle?: string`
- 插槽：`default`；事件：无

### m-flex-item Props / Slots

- `customClass?: string.ClassString` / `customStyle?: string`
- 插槽：`default`；事件：无

### 间距协作逻辑（context.uts）

- `FlexContext`：`ids: string[]`（reactive，注册 / 注销自动触发重算）、`direction` / `wrap`（props 只读快照）、`gap: ComputedRef<string>`（空串表示内置档位）、`gapTier`（`''` / `'-sm'` / `'-lg'`）
- `register(id)` / `unregister(id)` / `indexOf(id)`；`generateFlexId()` 模块级自增
- 容器：`provide(FLEX_KEY, ctx)`，`gapValue` 归一化、`gapTier` 推导；`rootClass` 拼方向 / 对齐 / 换行变体；`rootStyle` 拼 `customStyle` + `flex` + 水平换行时的等值负 `margin-left`
- 子项：setup 同步 `register`（注册序即渲染序，首帧即正确轮位），`onUnmounted` 注销；`itemIndex` / `itemCount` 读 reactive 数组；`gapSide` 由主轴方向决定；`gapApplies` 判断是否施加（水平换行全部施加、正向非首项、反向非末项）
- 样式：内置档位走 `$m-flex-gap*` 主题变量类（`m-flex-item--left/top/bottom` 及 `-sm` / `-lg`），自定义尺寸走内联 `margin-*`，两者互斥

### 关键分支

- 水平换行：全部子项 `margin-left` + 容器等值负 margin 补偿（各行行首顶格），行间距为子项 `margin-bottom`
- `align: baseline`：App 端 `align-items` 不支持 baseline，条件编译降级 `flex-start`，Web 端保留 baseline
- 反向方向：间距施加的 margin 边只由主轴方向决定（row / row-reverse 用 `margin-left`，column 用 `margin-top`，column-reverse 用 `margin-bottom`），反向语义由轮位判断承担，避免负 margin 位移

## 疑问清单

本任务实施期未建档，无「回答：」记录。实施中形成的行为规约已沉淀至 `.claude/rules/LESSONS_LEARNED.md` #74（反向方向轮位换边、wrap 负 margin 补偿的边角取舍、Web 实测证据）。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- 反向方向间距：伪代码初案为「全部子项 `margin-left` + 容器负 margin 补偿」直接套用，实测该方案在 `row-reverse` 不换行时会把内容整体左移一个 gap 宽（justify center / end 下右边缘偏移），故改为**轮位换边**——margin 边只由主轴方向决定，反向方向以「非末项」判断替代「非首项」（#74）。
- 水平换行仍保留「全部子项 `margin-left` + 容器等值负 margin」；此时 justify + wrap 组合会整体偏一个 gap 宽，属可接受边角（无 wrap 时 justify 精确）。
- 内置档位 / 自定义尺寸双通道落地：`gap` 为 number 或非档位 string 时走内联 `margin`，档位走 `$m-flex-gap*` 主题变量类，`gapTier` 负责后缀拼接。
- 其余按设计落地，无其它偏差。

### 变更文件清单

- `packages/core/components/m-flex/m-flex.uvue`（新增）
- `packages/core/components/m-flex/context.uts`（新增）
- `packages/core/components/m-flex-item/m-flex-item.uvue`（新增）
- `packages/core/theme/vars.scss`（新增 Flex 主题段 3 变量）
- `packages/playground/pages-sub/flex/flex.uvue`（新增）、`pages.json`（注册）
- `packages/playground/uni_modules/m-ui-x/**`（`pnpm sync:uni-modules` 同步产物）
- `packages/docs/src/components/flex.md`、`packages/docs/src/en/components/flex.md`（新增）
- `packages/docs/.vitepress/config/zh.ts`、`en.ts`（侧栏）
- `packages/docs/src/changelog.md`、`packages/docs/src/en/changelog.md`、`packages/playground/uni_modules/m-ui-x/changelog.md`（0.3.0 登记）
- `.claude/rules/LESSONS_LEARNED.md`（#74）

### 验证方式与结果

- `pnpm sync:uni-modules:check`：通过（playground 插件与 core 一致，2026-11-03 复验）。
- Web 演示页实测（记录于 LESSONS #74）：`row-reverse` 视觉顺序为三 / 二 / 一（首项 left 1048、末项 880），`column-reverse` 自上而下三 / 二 / 一；`wrap` 10 项换 4 行（3/3/3/1），各行行首 left 均等于 24px；9 个区块控制台无报错。
- 双语文档与侧栏同步完成；changelog 三处登记完成。

### 遗留 TODO

- 水平换行末行底部多出一段 `margin-bottom` 间距（margin 方案的已知限制，已在双语文档注明）。
- App（Android / iOS）端未在本次任务中做真机实测（与 0.1.0 起的平台支持声明一致）。
