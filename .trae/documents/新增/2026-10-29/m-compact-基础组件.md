# m-compact 基础组件 实施方案

## 需求

用户提供 Sard UI Compact（紧凑布局）组件文档：https://sard.wzt.zone/components/compact ，要求对标实现 `m-compact`。API 对齐原则：props 命名、变体、插槽语义以 Sard 为准（本组件为用户指定对标 Sard，非 Vant——Vant 无同名组件）；UTS / uvue 红线不支持的能力在双语文档中注明差异。

Sard Compact 定位：让表单组件之间紧凑连接且合并边框（相邻项圆角衔接、相邻边框去重为 1px）。

## 需求分析

Sard Compact API（官网文档已抓取）：

- Props：`block`（boolean, false，让按钮或输入框撑满父元素宽度）、`direction`（`'horizontal' | 'vertical'`，默认 `'horizontal'`）
- Slots：`default`（自定义默认内容）
- 无 Events
- 无专属 CSS 变量（圆角 / 边框全部消费子组件自身样式）

Sard 演示场景：按钮组紧凑排列（基础）、块级元素（block）、垂直排列（direction="vertical"，Sard 注明仅支持 Button 组合）、垂直块级、输入类组件混排（s-input 与 s-button 混合）。

Sard 实现方式（web CSS）：`.s-compact` 为 inline-flex 容器，靠 CSS 结构选择器（`:first-child` / `:not(:first-child)` 类）清理相邻圆角与重叠边框。

UTS / uvue 红线下的取舍：

| Sard 能力 | m-compact 方案 |
| --- | --- |
| CSS 结构选择器合并圆角 / 边框（父选中子） | ucss 仅 class 选择器，父无法修饰子 → **provide/inject 上下文 + 子组件注册**：m-compact provide 上下文，m-button 注入后按注册序自算 first / last / middle，应用对应修饰类（复用 m-cell-group / m-cell 的 `context.uts` + reactive ids 注册模式，本项目已验证可用） |
| block 按钮撑满父宽 | 由 compact 上下文注入 block 状态，m-button 据此应用：horizontal → `flex: 1` 等分撑满（uvue flex 子项默认 flex-shrink: 0，width:100% 会溢出，必须 flex: 1）；vertical → `align-self: stretch` 满宽 |
| 相邻边框合并 | 待 Q1：负 margin 重叠（Sard 原方式）vs 非首项去相邻侧边框 |
| 输入类组件混排（s-input / s-datetime-picker-input） | 本项目暂无 m-input → v1 仅支持 m-button 组合（待 Q2；Sard 垂直方向本身也仅支持 Button） |
| hover 态 z-index 提升 | 非核心视觉，v1 不做（m-button 按压态为 opacity 变化，无层叠冲突） |

m-button 需同步扩展（待 Q3）：inject compact 上下文（可选注入，不影响独立使用）；新增 compact 位置修饰类（根节点圆角 / 边框 + hairline 层同步）。

关键技术点：

1. **注册顺序即渲染顺序**：m-cell 先例——cell 在 setup 中同步 `register(id)`，onUnmounted 注销，reactive 数组驱动 computed 重算；v-if 动态增删后首 / 中 / 尾自动重排；
2. **单项特判**：compact 内仅一个按钮时不清理任何圆角（first 且 last）；
3. **hairline 按钮同步**：m-button 的 0.5px 边框由 `__hairline` 层（绝对定位 200% 缩放）承载，compact 修饰需同步清理该层的对应侧边框与两倍圆角；
4. **round 按钮覆盖顺序**：compact 清圆角类需定义在 `m-button--round` 之后（扁平类同特异性按源码顺序取胜）；
5. **四角独立圆角**：`border-top-right-radius` 等单角属性在 Web 端可用，App 原生端列为真机验证点。

涉及文件（architecture.md 第 6 节唯一落点）：

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-compact/m-compact.uvue` | 组件源（2 props + 默认插槽，类型与逻辑内联 SFC） |
| `packages/core/components/m-compact/context.uts` | 跨组件共享上下文（m-compact 与 m-button 相对路径导入，符合「跨组件共享拆 .uts」契约） |
| `packages/core/components/m-button/m-button.uvue` | 扩展：inject 上下文 + compact 修饰类（待 Q3） |
| `packages/core/theme/vars.scss` | 是否新增 `$m-compact-*` 段待 Q4 |
| `packages/playground/pages-sub/compact/compact.uvue` + `pages.json` + `router/router.config.uts` + `pages/index/demo-components.uts` | 演示页（穷举全部变体）+ 三处注册（demo-components.uts 按 enName 字母序插入） |
| `packages/docs/src/components/compact.md` + `src/en/components/compact.md` | 双语文档（含「与 Sard 的差异」节） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步 |
| `playground/uni_modules/m-ui-x/changelog.md` | 第四步回填（KEEP 文件） |

复用与依赖：m-button（inject 扩展，独立使用行为不变）。

验证链（workflow 第三步 DoD）：`pnpm sync:uni-modules` → `pnpm sync:uni-modules:check` → dev server 编译 → 浏览器实测全部变体（含动态增删重排、block 等分、边框合并视觉、hairline 组合）→ `pnpm build:docs` 死链检查 → 清理调试代码。

## 伪代码设计

### context.uts（对齐 m-cell-group/context.uts 模式）

```
COMPACT_KEY = '__mxi_compact__'

type CompactDirection = 'horizontal' | 'vertical'

class CompactContext {
  ids: string[] = reactive<string[]>([])
  direction: CompactDirection
  block: boolean
  register(id) / unregister(id)      // 同 m-cell-group
  indexOf(id): number                // 新增：位置计算用（-1 未注册）
}
generateCompactId(): string          // 模块级自增
```

### m-compact.uvue

Props（`type Props` + `withDefaults`）：

```
block: boolean = false                                  // 块级：子项撑满父宽
direction: CompactDirection = 'horizontal'              // 排列方向
customClass / customStyle                               // 项目惯例透传
```

上下文：`new CompactContext()` 后回填 `direction` / `block`（props 只读快照，组件不支持动态改向——文档注明），`provide(COMPACT_KEY, context)`。

模板结构（单根，无 v-if 切换根节点——规避 LESSONS attrs 透传丢事件）：

```html
<view :class="rootClass" :style="rootStyle">
  <slot></slot>
</view>
```

computed 拼接（扁平类）：

```
rootClass = 'm-compact'
  + (direction == 'vertical' ? ' m-compact--vertical' : '')
  + (block ? ' m-compact--block' : '')
```

样式要点（扁平书写）：

```
.m-compact             { flex-direction: row; align-items: stretch; }   /* horizontal：子项等高 */
.m-compact--vertical   { flex-direction: column; align-items: flex-start; }  /* 非块级：按钮收缩内容宽 */
.m-compact--block      { /* horizontal block 无需容器样式（子项 flex:1）；vertical block 由子项 stretch 承担 */ }
.m-compact--vertical.m-compact--block 形态冲突 → vertical + block 时子项类控制，容器无复合类（保持扁平，不写组合选择器）
```

注：vertical + block 的满宽行为完全由 m-button 侧 `--compact-vblock`（align-self: stretch）承担，容器 `--block` 类仅保留语义占位（或干脆不拼——实现时按最简取舍）。

### m-button.uvue 扩展（待 Q3 定案）

```
import { COMPACT_KEY, CompactContext, generateCompactId } from '../m-compact/context.uts'

const compact = inject<CompactContext | null>(COMPACT_KEY, null)   // 可选注入，独立使用为 null
const compactId = generateCompactId()
if (compact != null) {
  compact.register(compactId)
  onUnmounted(() => { compact.unregister(compactId) })
}
```

位置 computed（reactive ids 驱动自动重算）：

```
inCompact  = compact != null
idx        = inCompact ? compact.indexOf(compactId) : -1
count      = inCompact ? compact.ids.length : 0
isFirst    = idx == 0
isLast     = idx == count - 1
single     = count == 1        // 单项：不清任何圆角
```

compact 修饰类（拼入 buttonClass，仅 inCompact 时追加）：

```
horizontal（compact.direction）:
  !single && isFirst  → ' m-button--compact-h-first'    /* 清右上/右下圆角 */
  !single && isLast   → ' m-button--compact-h-last'     /* 清左上/左下圆角 */
  !single && !isFirst && !isLast → ' m-button--compact-h-middle'  /* 四角全清 */
  !isFirst            → ' m-button--compact-h-not-first' /* 去左边框（Q1-B）或负 margin（Q1-A） */
vertical:
  对称：--compact-v-first（清右下/左下）/ --compact-v-last（清右上/左上）/ --compact-v-middle / --compact-v-not-first（去上边框）
block:
  compact.block && horizontal → ' m-button--compact-hblock'   /* flex: 1 */
  compact.block && vertical   → ' m-button--compact-vblock'   /* align-self: stretch */
```

hairline 层同步（hairlineClass 追加，几何为根节点两倍）：

```
--compact-h-not-first → __hairline 追加 ' m-button__hairline--compact-h-not-first'（border-left-width: 0）
位置清角类同理镜像（圆角 ×2 基础上对应角清零），类矩阵随位置 computed 一并拼接
```

样式要点（m-button scss 末尾追加，保证覆盖 round / square）：

```
.m-button--compact-h-first    { border-top-right-radius: 0; border-bottom-right-radius: 0; }
.m-button--compact-h-last     { border-top-left-radius: 0; border-bottom-left-radius: 0; }
.m-button--compact-h-middle   { border-radius: 0; }
.m-button--compact-h-not-first{ border-left-width: 0; }        /* Q1-B */
.m-button--compact-v-first    { border-bottom-right-radius: 0; border-bottom-left-radius: 0; }
.m-button--compact-v-last     { border-top-right-radius: 0; border-top-left-radius: 0; }
.m-button--compact-v-middle   { border-radius: 0; }
.m-button--compact-v-not-first{ border-top-width: 0; }
.m-button--compact-hblock     { flex: 1; }
.m-button--compact-vblock     { align-self: stretch; }
/* hairline 层对应镜像段（×2 圆角清零 + 对应侧边框清零） */
```

### 主题变量

待 Q4：倾向不新增 `$m-compact-*` 段（圆角 / 边框全部复用 `$m-button-*` 与 `$m-border-width`；Sard Compact 亦无专属变量）。

### 演示页规划（pages-sub/compact/compact.uvue，对齐 Sard 5 节 + 项目验收点）

1. 基础使用（default 与 plain 各一组 + 混合变体一组）
2. 块级元素（horizontal block）
3. 垂直排列（vertical）
4. 垂直排列块级元素（vertical + block）
5. 动态增删（v-if 增删按钮，验证 first / last / middle 重排）
6. hairline 组合（hairline 按钮在 compact 中的边框层同步验证）

文档规划：zh / en 双语 compact.md（介绍 / 代码演示 / Props 表 / Slots 表 / 与 Sard 的差异节——无输入类组件支持等）；侧栏 zh.ts / en.ts 按既有排序惯例插入。

## 疑问清单（回复编号即可，如「Q1 答：A」）

- **Q1 相邻边框合并策略**（影响：m-button 修饰类与 hairline 层几何）：
  - A：负 margin 重叠（Sard 原方式）——各按钮保留完整边框，非首项 `margin-left: -1px`（垂直为 top）重叠相邻边框。缺点：App 原生端负 margin 支持度未验证；与 hairline 缩放层叠加几何更绕。
  - B（推荐）：非首项去相邻侧边框——horizontal 非首项 `border-left-width: 0`（hairline 层同步清零），分隔线由前一项右边框承担。纯显式盒模型属性，无负 margin 风险，混排变体（实色 / 朴素）视觉与 A 一致。

答：B。

- **Q2 v1 支持范围**（影响：演示页与双语文档）：
  - A（推荐）：仅支持 m-button 组合——本项目暂无 m-input，Sard 垂直方向本身也仅支持 Button；文档「与 Sard 的差异」注明，后续 m-input 落地时再扩展 inject 感知。
  - B：先做 m-input 再一起交付 compact（范围扩大数倍，工期不可控）。

答：A。

- **Q3 m-button 扩展耦合**（影响：m-button 源码）：
  - A（推荐）：m-button inject compact 上下文自动感知位置（m-cell-group / m-cell 同款模式），compact 内按钮零配置生效，独立使用行为完全不变。
  - B：不扩展 m-button，m-compact 仅作排列容器——无法合并圆角与边框，组件失去核心价值（不推荐）。

答：A。

- **Q4 主题变量段**（影响：vars.scss）：
  - A（推荐）：不新增 `$m-compact-*` 段——圆角 / 边框全复用 `$m-button-*` 与 `$m-border-width`，Sard Compact 亦无专属 CSS 变量；文档「主题定制」节说明复用关系。
  - B：强制新增段（architecture 第 3 节顺序要求）——但无实际消费方变量属预留设计，违反最小实现。

答：A。

## 实施记录

### 实施时间

- 2026-10-29（第三步实现与验证、第四步回填同日完成）

### 方案落地形态（与伪代码设计的差异说明）

- m-compact 根节点未拼接 `m-compact--block` 类：水平块级撑满由子项 `m-button--compact-hblock`（flex: 1）承担、垂直块级由 `m-button--compact-vblock`（align-self: stretch）承担，容器层无块级样式需求，按伪代码预留的「最简取舍」落地
- m-button 侧位置状态收敛为两个 computed：`compactPosition`（'h-first' / 'h-last' / 'h-middle' / 'v-first' / 'v-last' / 'v-middle' / 'single'）与 `compactNotFirst`，buttonClass 与 hairlineClass 复用同一位置来源拼接前缀不同的扁平类；block 类仅作用于根节点（hairline 层为纯视觉层，无布局属性）
- 其余与伪代码一致：Q1-B 非首项清相邻侧边框、Q2-A 仅 m-button、Q3-A m-button 注入上下文注册感知、Q4-A 无专属主题变量

### 变更文件清单

组件源：

- `packages/core/components/m-compact/m-compact.uvue`（新增）
- `packages/core/components/m-compact/context.uts`（新增）
- `packages/core/components/m-button/m-button.uvue`（扩展：inject 上下文 + 位置 computed + compact 修饰类与 hairline 同步段）

演示页与注册：

- `packages/playground/pages-sub/compact/compact.uvue`（新增：基础使用 / 块级元素 / 垂直排列 / 垂直块级 / 动态增删 / 细边框按钮 6 节）
- `packages/playground/pages.json`、`router/router.config.uts`、`pages/index/demo-components.uts`（三处注册，布局组件组按 enName 字母序插入首位）

文档：

- `packages/docs/src/components/compact.md`、`src/en/components/compact.md`（新增，含「与 Sard 的差异」节）
- `packages/docs/.vitepress/config/zh.ts`、`en.ts`（布局组件侧栏插入）
- `packages/playground/uni_modules/m-ui-x/changelog.md`、`packages/docs/src/changelog.md`、`src/en/changelog.md`（0.2.0 段回填，组件数 13 → 14）

### 验证方式与结果（DoD）

- `pnpm sync:uni-modules:check` 一致性校验通过
- HBuilderX CLI `launch web` 编译通过、5174 端口归属确认（重启前次遗留 dev server 后拉起；macOS 端 CLI 真实路径 `/Applications/HBuilderX.app/Contents/MacOS/cli` 已入 LESSONS_LEARNED #44）
- 演示页 history 路由 200 可达；playwright-core + 系统 Chrome 全变体实测 31 项断言全部通过（T0 载入 / T1 基础位置类与边框合并 / T2 块级 flex:1 等分撑满 / T3 垂直位置类与边框 / T4 垂直块级满宽 / T5 追加移除后首中尾重排 / T6 hairline 缩放层位置类与边框同步 / T7 无 pageerror），顶 / 底截图人工比对通过
- `pnpm build:docs` 死链检查通过；`pnpm build:demo` 产物入库（52 → 60 文件，新增 compact 深链目录）
- 演示页与组件源无临时调试代码

### 遗留 TODO

- m-input 落地后按 Q2-A 扩展：输入类组件同样注入 compact 上下文，补齐 Sard「输入类组件」演示场景
- App 原生端（Android / iOS）未实测：四角独立圆角、flex: 1 等分与 align-self: stretch 均为标准盒模型属性，理论安全，建议首次 Android 打包验收时回归本演示页
- direction / block 动态切换不生效为已文档化设计（上下文创建时快照）；如需支持，须将上下文字段响应式化并联动子项重算
