# m-divider 基础组件 实施方案

## 需求

用户要求实现 Vant Divider（https://vant-ui.github.io/vant/#/zh-CN/divider ）的对标组件 `m-divider`。API 对齐原则：props 命名、变体、插槽语义以 Vant 为准；UTS / uvue 红线不支持的能力在双语文档中注明差异。divider 为纯展示组件（无事件、无显隐状态），是继 m-overlay / m-popup 后第三个基础组件。

## 需求分析

Vant Divider API（官网文档已抓取）：

- Props：`dashed`（boolean, false）、`hairline`（boolean, true，0.5px 线）、`content-position`（string, `left` / `right`，默认 `center`）、`vertical`（boolean, false，v4.4.0）
- Slots：`default`（分割线中间的内容）
- 无 Events（纯展示）
- CSS 变量：divider-margin（16px 0）/ divider-vertical-margin（0 8px）/ divider-text-color（#969799）/ divider-font-size（14px）/ divider-line-height（24px）/ divider-border-color（#ebedf0）/ divider-content-padding（16px）/ divider-content-left-width（10%）/ divider-content-right-width（10%）

Vant 实现要点（源码结构）：水平 divider 为 flex row 容器，线由 `::before` / `::after` 伪元素承担（`flex: 1`、`border-top: 1px solid`、hairline 时 `scaleY(0.5)`、dashed 时 `border-style: dashed`）；内容左右线通过 `max-width: 10%`（content-left/right-width）限制；垂直 divider 为 inline-block（`height: 32px`、`border-left`、hairline 时 `scaleX(0.5)`）。

UTS / uvue 红线下的取舍：

| Vant 能力 | m-divider 方案 |
| --- | --- |
| `::before` / `::after` 伪元素线 | 真实 view 节点 `__line--before` / `__line--after`（ucss 无伪元素） |
| hairline 0.5px | 线节点 border 1px + 单轴缩放 0.5（水平 scaleY / 垂直 scaleX，flex 内中心原点对称缩放无偏移；待 Q1 定案） |
| dashed | `border-style: dashed`（ucss / App 原生支持，作用于线节点） |
| vertical inline-block | ucss 无 inline-block → 定位为 **flex 子项**：根 view（`flex-direction: row` + `align-items: center`、height 32px、margin `0 8px`），线与 slot 内容并排；使用时外层容器需 flex row + align-center，文档注明与 Vant 文本流用法的差异（待 Q2 定案） |
| 自定义样式 `style="{ color, borderColor }"` | 根节点静态透传外部 style/class（根无 v-if，LESSONS #32 不涉及）：`color` 经继承到达 slot 内未设色的 text；`borderColor` 无法到达子节点线（Vant 靠伪元素 `border-color: inherit`，ucss 无 inherit）→ 单实例线色定制走主题变量全局覆盖，文档注明（待 Q3 定案） |
| `content-position` | 保留，`DividerContentPosition = 'left' | 'center' | 'right'` 联合类型（对齐 closeIconPosition 先例）；仅水平 + 有内容时有意义，left → before 线 max-width 10%、right → after 线 max-width 10% |
| line-height 24px / color / font-size 根级文字度量 | 设根节点，slot 内 text 未设色时继承（ucss color / font-size / line-height 可继承） |

技术决策：

1. 水平结构固定为「before 线 + slot + after 线」，线 `flex: 1` + `height: 0` + `border-top: 1px solid`；slot 为空时两线 margin 相加 32px 间隔（对齐 Vant 无内容形态）；
2. 垂直结构为「根 row 容器（height 32px）内单线 + slot」，线 `width: 0` + `border-left: 1px solid` + `height: 100%`；
3. hairline / dashed / content-position 均由 computed 拼接扁平类（`m-divider__line--hairline` / `--dashed` / `--content-left` 等），无嵌套选择器；
4. 无 Events、无显隐 watch、无定时器——纯静态渲染组件，类名全部 computed 一次成型。

涉及文件（architecture.md 第 6 节唯一落点）：

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-divider/m-divider.uvue` | 组件源（类型与逻辑内联 SFC） |
| `packages/core/theme/vars.scss` | 新增 `$m-divider-*` 段 9 变量（全 `!default`，不动既有变量） |
| `packages/playground/pages-sub/divider/divider.uvue` + `pages.json` + `router/router.config.uts` + `pages/index/demo-components.uts` | 演示页（穷举 dashed / hairline / content-position / vertical 及组合）+ 注册 |
| `packages/docs/src/components/divider.md` + `src/en/components/divider.md` | 双语文档（含「与 Vant 的差异」节） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步 |
| `playground/uni_modules/m-ui-x/changelog.md` | 第四步回填（KEEP 文件） |

复用与依赖：无（不依赖其他 m- 组件）。

验证链（workflow 第三步 DoD）：`pnpm sync:uni-modules` → `pnpm sync:uni-modules:check` → dev server 编译 → Playwright 浏览器实测全部变体（含 hairline 视觉高度、dashed 样式、content-position 布局、垂直形态）→ `pnpm build:docs` 死链检查 → `pnpm run build:demo` 产物入库 → 清理调试代码。

## 伪代码设计

Props（`type Props` + `withDefaults`，模式对齐 m-popup）：

```
dashed: boolean = false                     // 虚线
hairline: boolean = true                    // 0.5px 线（缩放实现，待 Q1）
contentPosition: DividerContentPosition = 'center'  // 'left' | 'center' | 'right'
vertical: boolean = false                   // 垂直分割线（flex 子项形态，待 Q2）
```

类型：

```
type DividerContentPosition = 'left' | 'center' | 'right'
```

模板结构（扁平类、无嵌套）：

```html
<!-- 水平 -->
<view v-if="!props.vertical" :class="rootClass">
  <view :class="lineBeforeClass" />
  <slot />
  <view :class="lineAfterClass" />
</view>
<!-- 垂直 -->
<view v-else :class="rootClass">
  <view :class="vlineClass" />
  <slot />
</view>
```

computed 拼接（扁平类清单）：

```
rootClass = 'm-divider'
  + (vertical ? ' m-divider--vertical' : '')

lineBeforeClass = 'm-divider__line'
  + (hairline ? ' m-divider__line--hairline' : '')      // transform: scaleY(0.5)
  + (dashed ? ' m-divider__line--dashed' : '')          // border-style: dashed
  + (contentPosition == 'left' ? ' m-divider__line--content-left' : '')   // max-width: 10%

lineAfterClass = 'm-divider__line'
  + (hairline ? ' m-divider__line--hairline' : '')
  + (dashed ? ' m-divider__line--dashed' : '')
  + (contentPosition == 'right' ? ' m-divider__line--content-right' : '') // max-width: 10%

vlineClass = 'm-divider__vline'
  + (hairline ? ' m-divider__vline--hairline' : '')     // transform: scaleX(0.5)
  + (dashed ? ' m-divider__vline--dashed' : '')
```

样式要点（扁平书写，全部类选择器）：

```
.m-divider            { flex-direction: row; align-items: center; margin: $m-divider-margin;
                        color: $m-divider-text-color; font-size: $m-divider-font-size; line-height: $m-divider-line-height; }
.m-divider__line      { flex: 1; height: 0; border-top: 1px solid $m-divider-border-color; }
.m-divider__line--hairline { transform: scaleY(0.5); }        // 中心原点，水平线对称无偏移
.m-divider__line--dashed   { border-style: dashed; }
.m-divider__line--before   { margin-right: $m-divider-content-padding; }
.m-divider__line--after    { margin-left: $m-divider-content-padding; }
.m-divider__line--content-left  { max-width: $m-divider-content-left-width; }
.m-divider__line--content-right { max-width: $m-divider-content-right-width; }
.m-divider--vertical       { margin: $m-divider-vertical-margin; height: 32px; }   // 根 row 已有，加高与水平 margin
.m-divider__vline          { width: 0; height: 100%; border-left: 1px solid $m-divider-border-color; }
.m-divider__vline--hairline { transform: scaleX(0.5); }
.m-divider__vline--dashed   { border-style: dashed; }
```

注：before / after margin 类并入 lineBeforeClass / lineAfterClass 拼接（水平形态才有 margin，垂直单线无）。

主题变量（`packages/core/theme/vars.scss` 追加，全 `!default`）：

```
$m-divider-margin: 16px 0;
$m-divider-vertical-margin: 0 8px;
$m-divider-text-color: #969799;
$m-divider-font-size: 14px;
$m-divider-line-height: 24px;
$m-divider-border-color: #ebedf0;
$m-divider-content-padding: 16px;
$m-divider-content-left-width: 10%;
$m-divider-content-right-width: 10%;
```

演示页规划（`pages-sub/divider/divider.uvue`，7 节对齐 Vant 文档）：

1. 基础用法（无内容纯线）
2. 展示文本（slot 内容，验证 color / font-size / line-height 继承）
3. 内容位置（left / right / center 三态）
4. 虚线（dashed，有内容与无内容）
5. hairline 对比（true 0.5px vs false 1px）
6. 垂直分割线（外层 flex row + align-center：vertical / vertical dashed / vertical hairline=false）
7. 自定义样式（根 style 透传：文本色生效演示 + 线色差异注明）

文档规划：zh / en 双语 divider.md（介绍 / 代码演示 7 节 / Props 表 / Slots 表 / 主题定制 9 变量表 / 与 Vant 的差异节）；侧栏 zh.ts / en.ts 基础组件组插入（Image 之后、Layout 之前按组件英文字母序 Divider 排 Cell 后——参照现有排序惯例实际按组内清单顺序插入）。

## 疑问清单（回复编号即可，如「Q1 答：A」）

- **Q1 hairline 0.5px 实现**：
  - A（推荐）：线节点 border 1px + 中心原点单轴缩放 0.5（水平 scaleY / 垂直 scaleX）。flex 布局内的线居中缩放对称、无偏移；App 端规避 0.5px 取整风险。与 LESSONS 贴边线规约（绝对定位 + origin 0 0）不冲突——那是防贴边线偏移的场景，divider 线在 flex 流内。
  - B：直接 `border-top-width: 0.5px`（实现最简，Web 端可行，App 端原生渲染可能取整为 0 或 1px，hairline 失效）。

答：A。

- **Q2 垂直分割线形态**：
  - A（推荐）：flex 子项形态（根 row 容器 height 32px 内单线 + slot 内容并排），文档注明外层容器需 flex row + align-center，与 Vant inline-block 文本流用法存在用法差异。
  - B：仅纯线（垂直形态忽略 slot 内容），用法约束更强但语义最简。

答：A。

- **Q3 单实例线色定制**：
  - A（推荐）：接受差异——`color` / `font-size` 经根继承生效，线色定制走 `$m-divider-border-color` 主题变量全局覆盖，文档「与 Vant 的差异」注明（Vant 靠伪元素 inherit，ucss 不支持）。
  - B：自造 `custom-style` prop 作用于线节点（突破 Vant API 面，换取单实例线色能力）。

答：A。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- **伪元素线 → 真实节点**：Vant 用 `::before` / `::after` 伪元素画线，ucss 无伪元素；before / after 线为根容器内的真实 view 子节点。与伪代码的差异：`v-if` 从根节点移到子线节点上（根节点无 v-if，外部 style / class 透传直达根，文本色继承可用）
- **hairline 单轴缩放（Q1 定案 A）**：border 1px + 中心原点单轴缩放——水平 `scaleY(0.5)`、垂直 `scaleX(0.5)`。线在 flex 流内居中对称，缩放无偏移，不涉及 LESSONS 贴边线规约（绝对定位 + origin 0 0）的偏移场景；实测 Web 端 `matrix(1, 0, 0, 0.5, 0, 0)` / `matrix(0.5, 0, 0, 1, 0, 0)`，视觉盒 0.5px
- **垂直形态（Q2 定案 A）**：flex 子项形态——根 row 容器（height 32px、margin 0 8px）内「单线 + slot」并排；演示页「垂直分割线」节的三个变体为文本与 divider 平级布局（对齐 Vant inline 视觉，外层需 `flex-direction: row` + `align-items: center`），另补一个 slot 并排变体 `<m-divider vertical>插槽并排</m-divider>` 覆盖真实插槽用法
- **线色（Q3 定案 A）**：走 `$m-divider-border-color` 主题变量；线是子节点不吃继承（ucss 无 inherit），单实例线色定制走主题变量全局覆盖，文档「与 Vant 的差异」注明
- **dashed**：`border-style: dashed` 直接作用于线节点（ucss / App 原生支持）

### 变更文件清单

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-divider/m-divider.uvue` | 组件源（4 props + 默认插槽，4 个 computed 拼接扁平类，纯静态渲染无事件无 watch） |
| `packages/core/theme/vars.scss` | `$m-divider-*` 9 变量（全 `!default`） |
| `packages/playground/pages-sub/divider/divider.uvue` + `pages.json` + `router/router.config.uts` + `pages/index/demo-components.uts` | 演示页 7 节（基础 / 展示文本 / 内容位置 / 虚线 / 细线对比 / 垂直 / 自定义样式）+ 三处注册 |
| `packages/docs/src/components/divider.md` + `src/en/components/divider.md` | 双语文档（Props 4 项 / Slots / 主题 9 变量 / 与 Vant 的差异 4 条） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步（Cell 与 Icon 之间） |
| `packages/docs/src/changelog.md` + `src/en/changelog.md` + `playground/uni_modules/m-ui-x/changelog.md` | 三处 changelog 回填 |
| `packages/playground/uni_modules/m-ui-x/` 的 components / theme | `pnpm sync:uni-modules` 同步产物（非手改） |

### 验证结果

- Playwright 全变体实测：**40 PASS / 0 FAIL**（脚本 `/tmp/pw-popup-verify/verify-divider.cjs`，playwright-core + 系统 Chrome headless，1134×900）
  - T0 载入：演示页可达、组件实例数正确
  - T1 基础 + hairline：`matrix(1, 0, 0, 0.5, 0, 0)`、视觉盒高 0.5px；hairline=false 时 1px
  - T2 文本继承：根 computed color `rgb(150, 151, 153)`、slot 裸文本节点计数正确
  - T3 内容位置：left / right 一侧线宽 ≈ rootW×0.1（±2px）且对侧线更宽
  - T4 虚线：线节点 `border-top-style: dashed`
  - T5 垂直：4 实例（3 平级 + 1 slot 并排）、height 32px、`scaleX(0.5)` matrix、视觉宽 0.5px、slot 并排裸文本计数 1
  - T6 style 透传：外部 `:style` 色值 `rgb(25, 137, 250)` 直达根且文本继承
  - T7 全程无 pageerror
- 验证链：`pnpm sync:uni-modules:check` 一致；`pnpm build:docs` 通过（3.56s 无死链）；`pnpm run build:demo` 52 文件产物入库；组件无调试代码

### 排查插曲（均为探针缺陷，组件实现无误）

1. **T2 texts=[]**：slot 内无样式 `<text>` 在 Web 端编译为纯文本节点（非 uni-text 元素），元素选择器探针扑空；改用根 computed 断言 + `childNodes` 过滤 `nodeType === 3` 计数（记入 LESSONS #36）
2. **T6 色值不命中**：`:style` 的 `#1989fa` 写入 style attr 时被浏览器规范化为 `rgb(25, 137, 250)`，`includes('1989fa')` 永不命中；改 rgb 形式匹配（记入 LESSONS #36）

### 遗留 TODO

- [ ] App 端（Android / iOS）真机实测 `dashed` 虚线渲染与 `scaleY` / `scaleX` 单轴缩放表现（Web 端已实测通过，ucss transform 原生渲染支持度待真机验证）
