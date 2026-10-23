# mxi-badge 徽标组件 实施方案

> 状态：**已完成**（2026-10-22，四项疑问闭环后实现，验证链全过）

## 需求

- 用户原话：「请开始实现 mxi-badge 组件」。
- 背景：mxi-icon 任务遗留 TODO——dot / badge 能力「等 mxi-badge 组件建立后按 Vant 结构（Icon 包 Badge）扩展」，本任务即建立该基座组件。
- 对标：[Vant Badge](https://vant-ui.github.io/vant/#/zh-CN/badge)（API 已于 2026-10-22 核对官方文档，见下方需求分析）。

## 需求分析

- **影响面**：core 新增组件与主题变量段 → sync 到 playground → 演示页 → 双语文档 + 侧栏 + changelog；标准六步落码。
- **Vant Badge API 全貌（官方文档核对）**：
  - Props：`content`（number | string，dot=false 时生效）、`color`（背景色，默认 `#ee0a24` danger 红）、`dot`（boolean，默认 false，8px 小红点）、`max`（number | string，仅数字 content 生效，超限显示 `{max}+`）、`offset`（[x, y] 数组，水平向右 / 垂直向下，默认 px）、`show-zero`（boolean，默认 true，content 为 0 时是否展示）、`position`（默认 `top-right`，可选 top-left / bottom-left / bottom-right）。
  - Slots：`default`（被包裹子元素）、`content`（自定义徽标内容，如插入图标）。
  - 行为：无 default 子元素时独立展示为独立元素；dot=true 时 content 不生效。
  - 样式规格（Vant CSS 变量默认值）：徽标高 16px、文字白色、内边距 `0 3px`、字号 sm（12px）、字重 bold、背景 danger、红点 8px。
- **UTS / uvue 实现要点**：
  - 根节点结构两种形态：有 default 子元素 → `view` 根（`position: relative`、行内收缩）包 `<slot/>` + 绝对定位徽标层；无子元素 → 独立徽标元素（行内收缩）。
  - 徽标层：`view`（背景 / 圆角）+ 内部 `text`（文字样式只设 text），四角位置由 `position` 类切换（transform translate 半宽偏移，对齐 Vant「徽标中心压角」观感）。
  - 判断 default 插槽是否传入：`useSlots()` 判 `slots.default` 存在性（实施时编译验证，web 与 App 端行为一致性关注点）。
  - 类型约束按本库先例：`content` / `max` 用 `string`（数字语义由使用方以字符串传入，与 mxi-loading 的 size / mxi-icon 的 size 同款约定，避免 UTS `number | string` 联合 props 的编译不确定性）；数字判断（max 截断 / show-zero）用 `Number()` 转换 + `NaN` 防御。
  - 位置类名扁平四组（`mxi-badge--top-right` 等），禁止嵌套选择器。
- **主题变量**：`vars.scss` 新增 `$mxi-badge-*` 段（全部 `!default`）：背景色、红点色、红点尺寸、文字色、字号、字重、内边距、最小宽度、高度等；颜色规格复用既有 `$mxi-color-*`（danger）。

## 伪代码设计

### Props 清单

| prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| content | string | '' | 徽标内容（数字语义用字符串表达；dot=true 时不生效） |
| dot | boolean | false | 是否展示为小红点 |
| color | string | （默认主题 danger） | 徽标背景色（取值域见疑问 Q3） |
| max | string | '' | 最大值，数字 content 超限时显示 `{max}+` |
| showZero | boolean | true | content 为 0 时是否展示 |
| position | BadgePosition | 'top-right' | 徽标位置：'top-right' \| 'top-left' \| 'bottom-left' \| 'bottom-right' |
| offset（形态见疑问 Q2） | — | — | 徽标偏移量，水平向右 / 垂直向下，纯数字补 px |
| customClass / customStyle | string.ClassString / string | '' | 透传根节点（对齐本库惯例） |

### 显示逻辑（徽标层 v-if）

```
dot = true                          → 渲染小红点（8px 圆点，无视 content）
否则 content 显示计算：
  raw = content
  若 Number(raw) 可解析：
    若 raw 为 0 且 !showZero        → 不渲染
    若 max 可解析且 Number(raw) > Number(max) → 显示 '{max}+'
    否则显示 raw
  否则显示 raw（字符串直接展示，如 'Hot'）
content 为空且无 content 插槽        → 不渲染徽标
```

### 模板结构（示意）

```
有 default 子元素（包裹模式）：
<view 根（relative / inline 收缩 / custom-class / custom-style）>
  <slot/>
  <view 徽标层 v-if=显示逻辑 class="mxi-badge__badge mxi-badge--{position}" :style=徽标样式>
    <slot name="content"> 或 <text>{{ badgeText }}</text> 或 dot 圆点形态
  </view>
</view>
无 default 子元素（独立展示模式）：
<view/text 独立徽标（行内）>同上内容</...>
```

### Events

- 无（Vant Badge 无事件；点击行为由包裹的子元素自行承担）。

### Slots

- `default`：被包裹子元素（mxi-icon 组合即 `<mxi-badge :content="5"><mxi-icon name="chat-o"/></mxi-badge>`）。
- 徽标内容插槽：命名见疑问 Q4。

### 主题变量段（vars.scss 新增，全部 !default）

```
$mxi-badge-height / $mxi-badge-color（文字白）/ $mxi-badge-bg（danger）
$mxi-badge-font-size / $mxi-badge-font-weight / $mxi-badge-padding
$mxi-badge-min-width / $mxi-badge-dot-size / $mxi-badge-dot-bg / $mxi-badge-z-index?
```

### 演示页规划

pages-sub/badge/badge.uvue：基础（数字 / 文案 / 红点）· max 截断 · 自定义颜色 · 独立展示 · 四角 position · 偏移（若 Q2 支持）· content 插槽（内嵌 mxi-icon）· 与 mxi-icon 组合 · 边界（content=0 与 showZero）。

## 疑问清单

### Q1 mxi-icon 联动范围（影响：本轮改动面与结构）

Vant 结构是「Icon 内部包 Badge」；本库已定按组合表达。本轮范围：

- 方案 A：仅新建独立 mxi-badge 组件；mxi-icon 的徽标用法即 `<mxi-badge><mxi-icon/></mxi-badge>`（与 Vant 观感一致、零重复实现）
- 方案 B：同时给 mxi-icon 增加 dot prop（图标内嵌红点逻辑，实现双份、后续维护成本高）

回答：A。

### Q2 offset 偏移的 API 形态（影响：props 设计与 UTS 类型稳定性）

Vant 为单 prop 元组 `[number | string, number | string]`；UTS 对联合元素数组的编译支持不确定，且数字 / 字符串混传有类型摩擦：

- 方案 A（推荐）：拆为 `offsetX` / `offsetY` 两个独立 string props（纯数字补 px，正负号即方向；UTS 最稳、IDE 提示最清晰，与 Vant 语义等价但形态不同）
- 方案 B：单 prop `offset: Array<string>`（形态对齐 Vant，但传参须全字符串数组 `:offset="['2', '-3px']"`）
- 方案 C：本轮不做偏移，留 TODO

回答：A。

### Q3 color 取值域（影响：color prop 实现与默认值）

- 方案 A：对齐 mxi-loading 先例——支持语义色名（primary / success / danger / warning / info 等，映射既有 `$mxi-color-*`）+ CSS 色值；默认走 `$mxi-badge-bg`（danger 红）
- 方案 B：仅支持 CSS 色值，默认 danger 红

回答：A。

### Q4 徽标内容插槽命名（影响：slots API 稳定性）

- 方案 A（推荐）：对齐 Vant 命名 `content`（徽标内容不限于图标，语义准确）
- 方案 B：命名 `icon`（与本库 icon 系组件插槽名一致，但徽标内容可能是任意内容）

回答：A。

## 实施记录

**完成（2026-10-22）**，按已答疑问（Q1=A / Q2=A / Q3=A / Q4=A）全量落地，与伪代码设计无结构偏离。

### 方案落地形态

- **组件结构**：包裹 / 独立双模式（`hasDefaultSlot` 判 `slots.default != null`，沿用 mxi-loading 已验证的 useSlots 先例）；徽标层 `view` + 内部 `text`，四角位置由 `mxi-badge--top-right` 等四个扁平类定位（`transform: translateY(±50%) translateX(±50%)` 中心压角，对齐 Vant 观感），独立模式不拼位置类（无 CSS 覆盖冲突）。
- **offset 实现**（Q2=A）：`offsetX` / `offsetY` 双 string props，以 `margin-left` / `margin-top` 运行时 inline 叠加——绝对定位与独立常规流下方向语义一致（正值向右 / 向下），负 margin 偏移 web 实测有效。
- **color 语义色**（Q3=A）：对齐 mxi-loading 先例的变体类方案；语义名单取 `primary / success / warning / danger / white`（不含 default——徽标默认背景即 danger，无「default 灰」场景；info 因 vars.scss 无 `$mxi-color-info` 未纳入）；CSS 色值走 inline background-color，dot 与语义色同传时语义类源码后置生效。
- **content 插槽**（Q4=A）：`<template v-if>` 包 `<slot name="content">` 分支优先，fallback `text` 仅在非 dot 时渲染（v-else-if）。
- **显示逻辑**：`parseFloat` + `isNaN` 防御（UTS 全局函数），showZero 隐藏、max 截断 `{max}+` 均按伪代码实现；content / max 均为 string（数字语义字符串表达）。
- **主题变量**：vars.scss 新增 `$mxi-badge-*` 段 9 个变量（全部 `!default`，颜色规格复用 `$mxi-color-danger` / `$mxi-white`，圆角复用 `$mxi-radius-max`）。

### 变更文件清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/mxi-badge/mxi-badge.uvue` | 新增（组件实现） |
| `packages/core/theme/vars.scss` | 新增 Badge 变量段（9 变量） |
| `packages/playground/uni_modules/mxi-ui-x/**` | `pnpm sync:uni-modules` 同步产物 |
| `packages/playground/pages-sub/badge/badge.uvue` + `pages.json` | 演示页（9 区块穷举）+ 路由注册 |
| `packages/playground/pages/index/index.uvue` | 首页 Badge 入口卡片 + 跳转函数 |
| `packages/docs/src/components/badge.md` + `src/en/components/badge.md` | 双语文档（Props / Slots / 主题变量表） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏登记 |
| `packages/playground/uni_modules/mxi-ui-x/changelog.md` | 未发布段登记（KEEP 手工维护） |
| `.trae/documents/implementation-log.md` | 索引追加 |

### 验证方式与结果

1. `pnpm sync:uni-modules:check` 一致性通过。
2. HBuilderX web dev server（5174）编译成功，badge 演示页路由 200，无编译错误 overlay。
3. 浏览器实测 8 项全 PASS：基础（数字 / 文案 / 红点）；max 截断 9+ / 20+ / 99+；语义色（蓝 / 绿 / 橙）+ CSS 色值（紫）+ 蓝点；四角位置压角正确；偏移正负双向可见位移；独立展示行内渲染；content 插槽白色图标（success / cross）；icon 组合与 0 / show-zero 边界行为正确；console 无 error。
4. `pnpm build:docs` 构建通过（死链检查）。
5. 无临时调试代码残留。

### 遗留 TODO

- App-Android / App-iOS 端负 margin 偏移与四角 transform 平移待真机 / 基座实测（web 已验证；ucss 支持 transform 与 margin，风险低）。
- vars.scss 暂无 `$mxi-color-info`，语义色名单未含 info；将来补充该色后同步扩展徽标语义类。

### 追加修复：父级容器裁剪（2026-10-23）

- **现象**：徽标压角只显示左下四分之一（用户截图反馈）。
- **根因**（官方文档核实：[uni-app x CSS overflow](https://doc.dcloud.net.cn/uni-app-x/css/overflow.html) 默认值表）：**uvue 平台 overflow 默认 `hidden`**（W3C 默认 visible），全端一致；徽标压角超出组件根各半高，被「收缩贴合」的直接父级（演示页 col-gap / row，computed hidden）裁剪。
- **修复**：组件根 `.mxi-badge` 显式 `overflow: visible`（组件层自愈）+ 演示页 `.row` / `.col-gap` 显式 visible；双语文档新增「平台注意：父级容器裁剪」节说明使用约束；经验沉淀至 LESSONS_LEARNED 第 11 条。
- **验证**：浏览器复测 6 项全 PASS（基础 / 四角位置 / 插槽 / 独立 / icon 组合 / rect 对比无裁剪、console 无 error）。
