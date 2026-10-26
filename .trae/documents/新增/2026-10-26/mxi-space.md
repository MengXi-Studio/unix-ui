# 新增组件：mxi-space（间距）

> 状态：**已完成**（2026-10-26 疑问闭环 Q1=A / Q2=A，实现并验证通过；docs 双语同步持续暂缓待用户通知）
> 参考：Vant Space（https://vant-ui.github.io/vant/#/zh-CN/space ），Sard 无同名组件（已探测 404），纯 Vant 对标
> 流程：本任务遵循文档驱动四步工作流，疑问闭环后才进入实施

## 一、需求背景

用户指定 Vant Space 组件（设置元素之间的间距）。该组件是**纯布局组件**：本质是「flex 容器 + gap 间距 + 排列控制」，无业务样式，API 轻量（5 个 Props / 1 个插槽）。

uni-app x 映射基础良好：ucss 的 `gap` 系属性已在库内验证可用（mxi-image 演示页 `.row-gap { gap: 12px }` 编译运行正常），Space 的核心能力（间距、方向、换行、对齐）与 CSS flex 语义一一对应，无需造轮子。

## 二、参考资料盘点

### 2.1 Vant Space API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 间距方向 | `vertical` \| `horizontal` | `horizontal` |
| size | 间距大小，如 `20px`、`2em`，默认单位 px，**支持数组形式分别设置横向和纵向间距** | `number \| string \| number[] \| string[]` | `8px` |
| align | 设置子元素的对齐方式 | `start` \| `end` \| `center` \| `baseline` | -（文档描述：**水平模式下的默认值为 `center`**） |
| wrap | 是否自动换行，仅适用于水平方向排列 | boolean | `false` |
| fill | 是否让 Space 变为一个块级元素，填充整个父元素 | boolean | `false` |

- Slots：default（间距组件内容）
- 导出类型：`SpaceProps` / `SpaceSize` / `SpaceAlign`
- 演示场景：基础用法（默认 8px）/ 垂直排列（vertical + fill）/ 自定义间距（number 20、string '2rem'）/ 对齐方式（start / center / end / baseline 对照）/ 自动换行（wrap）

### 2.2 uni-app x 映射关键点（库内已有验证）

1. **gap 已验证**：ucss 支持 `gap` 简写（mxi-image 演示页实测）；`column-gap` / `row-gap` 分写为本次实施验证点（若分写异常则退回 margin 方案，见 8.x 验证记录）；
2. **默认宽度形态**：uvue 的 view 在父 flex 容器（column）中默认交叉轴 stretch 拉满宽——与 Vant Space 的 inline-flex 收缩形态不符。库内先例 mxi-loading 用 `align-self: flex-start` 实现收缩（已被 DoD 验证），Space 需要同样处理（Q1 确认副作用接受度）；
3. **align 语义**：`start / end` 对应 CSS `flex-start / flex-end`（需映射后绑定 align-items）；Vant 源码行为为 horizontal 且未传 align 时默认 `center`，vertical 未传时不设 align-items（默认 stretch）；
4. **wrap 仅水平**：vertical 下 flex-wrap 语义为纵向换列，与 Vant 文档「仅适用于水平方向排列」不符，实现上 vertical 时忽略 wrap；
5. **size 数组语义**：Vant 文档「分别设置横向和纵向间距」→ 水平排列时 `column-gap = 第一个值`（子项横向间距）、`row-gap = 第二个值 ?? 第一个值`（wrap 换行后的行间距）；垂直排列时主轴为纵，`row-gap = 第一个值`（Q2 确认）；
6. **size 默认 8px**：走主题变量 `$mxi-space-size`（基类提供 gap 默认值，传 size 时 inline 覆盖），符合库主题覆盖契约。

## 三、能力映射与判定

| Vant 能力 | mxi-space 方案 | 判定 |
| --- | --- | --- |
| direction horizontal / vertical | 变体类 `--horizontal` / `--vertical`（flex-direction row/column） | 采纳 |
| size 单值（number 补 px / string 原样） | inline `gap`；未传时基类 gap 走 `$mxi-space-size`（默认 8px） | 采纳 |
| size 数组 [横, 纵] | inline `column-gap` / `row-gap` 分写（语义见 2.2-5，Q2 确认垂直语义） | 采纳 |
| align 4 值 | 变体类 `--align-start/center/end/baseline` → align-items（start/end 映射 flex-start/flex-end）；horizontal 未传 → center，vertical 未传 → 不设 | 采纳 |
| wrap（仅水平） | 变体类 `--wrap`（flex-wrap: wrap），vertical 时忽略 | 采纳 |
| fill | 变体类 `--fill`（width: 100% 覆盖默认收缩） | 采纳 |
| default 插槽 | `<slot></slot>` 直通（子元素间距由容器 gap 天然实现，无需遍历子节点） | 采纳 |
| SpaceSize / SpaceAlign 类型 | 组件内联 type 定义（SpaceDirection / SpaceAlign / SpaceSize） | 采纳 |

## 四、布局伪代码

```html
<template>
  <!-- 单 view 根节点：flex 容器，default 插槽直通 -->
  <view :class="rootClass" :style="rootStyle">
    <slot></slot>
  </view>
</template>

<script setup lang="uts">
  type SpaceDirection = 'horizontal' | 'vertical'
  type SpaceAlign = 'start' | 'end' | 'center' | 'baseline'
  type SpaceSize = number | string

  type Props = {
    /** 间距方向 */
    direction?: SpaceDirection          // 默认 'horizontal'
    /** 间距大小：number（补 px）/ string（原样）/ 数组 [横向, 纵向]；为空走主题默认 $mxi-space-size */
    size?: SpaceSize | SpaceSize[] | null   // 默认 null
    /** 子元素对齐方式：未传时水平默认 center、垂直默认 stretch */
    align?: SpaceAlign | null           // 默认 null
    /** 是否自动换行（仅水平方向生效） */
    wrap?: boolean                      // 默认 false
    /** 是否块级填充父元素 */
    fill?: boolean                      // 默认 false
    customClass?: string.ClassString
    customStyle?: string
  }

  // rootClass = 'mxi-space'
  //   + direction 变体（' mxi-space--vertical'，horizontal 走基类默认 row）
  //   + align 变体（horizontal 未传 → ' mxi-space--align-center'；传值 → 映射变体；vertical 未传 → 无）
  //   + wrap 且 horizontal 时 ' mxi-space--wrap'
  //   + fill 时 ' mxi-space--fill'
  //   + customClass
  // rootStyle = customStyle 补分号
  //   + size 单值 → 'gap: X;'
  //   + size 数组 horizontal → 'column-gap: X; row-gap: Y;'
  //   + size 数组 vertical → 'row-gap: X;'
  //   （number 补 px、string 原样；未传时不写 gap，走基类主题默认）
</script>

<style lang="scss">
  @import '../../theme/vars.scss';

  /* 基类：横向 + 收缩贴合内容（mxi-loading 同款先例）+ 默认间距 */
  .mxi-space {
    flex-direction: row;
    align-items: center;      /* horizontal 未传 align 的默认值 */
    align-self: flex-start;   /* 收缩宽度贴内容，避免块级默认撑满父容器 */
    gap: $mxi-space-size;
  }
  .mxi-space--vertical {
    flex-direction: column;
    /* 未传 align 时不设 align-items（默认 stretch）；基类 center 由 align 类或覆盖控制，见实施细节 */
  }
  .mxi-space--wrap {
    flex-wrap: wrap;
  }
  .mxi-space--fill {
    width: 100%;
    align-self: stretch;      /* 覆盖收缩，填充父元素 */
  }
  .mxi-space--align-start { align-items: flex-start; }
  .mxi-space--align-center { align-items: center; }
  .mxi-space--align-end { align-items: flex-end; }
  .mxi-space--align-baseline { align-items: baseline; }
</style>
```

实施细节：
1. **基类 align-items 与 vertical 冲突处理**：基类 `align-items: center` 是 horizontal 的默认值；`--vertical` 类需要覆盖回默认——ucss 无 unset 保障，vertical 未传 align 时不拼 align 变体类，同时 `--vertical` 类显式写 `align-items: stretch`（覆盖基类 center），传了 align 时 align 变体类顺序在后覆盖；
2. **align 类拼接顺序**：变体类均单类选择器（扁平），优先级相同按声明顺序覆盖，align 变体类声明在基类与 direction 类之后；
3. **gap 分写支持**：`column-gap` / `row-gap` 分写若在 ucss 编译异常（未验证过），回退方案为「单值 gap + 数组场景退化为 margin」（届时回填实施记录并沉淀 LESSONS）。

## 五、主题变量草案（packages/core/theme/vars.scss 新增段）

```scss
/* ========== Space 间距 ========== */
$mxi-space-size: 8px !default;   /* 默认间距（未传 size 时），对齐 Vant 默认 8px */
```

说明：仅 1 个变量。direction / wrap / fill / align 均为布局值不绑主题变量；size 动态值走 inline。

## 六、演示页规划（pages-sub/space/space.uvue）

| 区块 | 内容 |
| --- | --- |
| 基础用法 | 4 个 mxi-button 横排，默认 8px 间距 |
| 垂直排列 | direction="vertical" + fill + 3 个块级按钮 |
| 自定义间距 | `:size="20"`（number 补 px）/ `size="12px"`（string）/ `:size="[20, 8]"`（数组，配 wrap 展示行间距） |
| 对齐方式 | 4 行静态对照：start / center / end / baseline，每行内放小按钮 + 高矮色块（或文本）对照垂直对齐差异 |
| 自动换行 | wrap + 10 个按钮 + 容器 max-width 约束，展示换行后 row-gap |
| 组合 | vertical + size 数组 + fill 组合（验收对账） |

同步登记：pages.json / router.config.uts / demo-components.uts（基础组件组）。

## 七、疑问清单（请直接在「回答：」处作答）

### Q1：Space 默认宽度形态如何处理？

uvue 的 view 默认在父容器中撑满宽，与 Vant Space（inline-flex，收缩贴合内容）形态不符。收缩方案有已知副作用：
- A. **align-self: flex-start 收缩**（推荐）：mxi-loading 同款库内惯例；副作用：Space 放在 row 方向父容器中时交叉轴对齐被固定为 flex-start（父容器设 align-items: center 时 Space 自身不再居中，需外层自行调整）；fill 时自动覆盖为 stretch，不受影响
- B. 默认撑满不收缩：行为简单无副作用，但 align="end" 等对齐演示与 Vant 观感差异明显（子项贴容器右缘而非内容右缘）

回答：A。

## 八、实施记录（2026-10-26）

### 8.1 落码清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/mxi-space/mxi-space.uvue` | 新建组件：单 view 根节点 + default 插槽直通 |
| `packages/core/theme/vars.scss` | 新增 Space 段 1 个变量（`$mxi-space-size: 8px !default`） |
| `packages/playground/uni_modules/mxi-ui-x/` | `pnpm sync:uni-modules` 同步产物 |
| `packages/playground/pages-sub/space/space.uvue` | 新建演示页（六区块：基础 / 垂直 / 自定义间距 / 对齐 / 换行 / 组合） |
| `packages/playground/pages.json` | pages-sub 注册 `space/space` |
| `packages/playground/router/router.config.uts` | 路由表登记 `space` |
| `packages/playground/pages/index/demo-components.uts` | 基础组件组登记「间距 / Space」 |

### 8.2 关键实现决策

1. **gap 实现层**：未传 size 时由基类 `gap: $mxi-space-size` 提供主题默认；传单值走 inline `gap`；数组走 inline `column-gap` / `row-gap` 分写——**实测 ucss 分写支持正常**，无需回退 margin 方案；
2. **数组语义（Q2=A）**：水平下 `column-gap = sizes[0]`、`row-gap = sizes[1] ?? sizes[0]`；垂直下 `row-gap = sizes[0]`（第二值忽略）；
3. **align 默认链**：horizontal 未传 → 拼 `--align-center` 类；vertical 未传 → 由 `--vertical` 类显式 `align-items: stretch`；传值 → align 变体类（声明顺序在最后覆盖）。基类本身不写 align-items，每个状态都有显式类来源（微调自伪代码方案，行为一致）；
4. **宽度形态（Q1=A）**：基类 `align-self: flex-start` 收缩（mxi-loading 同款），`--fill` 覆盖为 stretch + width 100%；
5. **wrap 仅水平**：`wrap && direction == 'horizontal'` 才拼 `--wrap` 类；
6. **类型签名**：`size?: SpaceSize | SpaceSize[] | null`（运行时 `Array.isArray` 收窄）、`align?: SpaceAlign | null`；align 值与变体类名同构直接拼接。

### 8.3 验证记录

| 项目 | 结果 |
| --- | --- |
| `pnpm sync:uni-modules:check` | PASS |
| HBuilderX CLI 重启编译 | PASS（编译成功；mxi-space.uvue 有 2 条 TS2769 类型 warning，与既有 mxi-cell / mxi-image 同源——联合含 null 的 props 转换噪音，不阻断编译、运行行为全部正确） |
| 页面加载与 console | PASS（无 JS 运行时错误） |
| 基础用法 8px / 垂直 + fill / size 20 / size '12px' | PASS |
| **gap 分写**：size [20, 8] + wrap（横向 20、换行行距 8） | PASS（column-gap / row-gap 分写生效，关键验证点通过） |
| 对齐 4 行（start/center/end/baseline + 收缩形态） | PASS |
| 自动换行（260px 容器） | PASS |
| 组合：vertical + [4, 12] + fill（行距 4px，第二值忽略） | PASS（Q2=A 行为确认） |
| 首页「基础组件」分组登记 | PASS |

### 8.4 遗留

- App 端真机验证：flex gap / column-gap / row-gap 分写在 App-Android / iOS ucss 的原生渲染支持度（web 端已验收）；
- TS2769 类型 warning 为全库既有模式（cell / image / space 均有），如需治理建议单独立项统一处理；
- docs 双语文档同步持续暂缓（mxi-cell / mxi-image / mxi-text / mxi-space 四轮，待用户通知）。

### 8.5 验收问题修复（2026-10-26 用户回验提出，均已闭环）

**问题 1：对齐演示 `align="center"` 按钮没有垂直居中。**

- 根因：`.mxi-button` 根节点声明了 `align-self: flex-start`（当初为 column 父容器中收缩宽度），CSS 标准中子元素显式 align-self 优先于容器 align-items，导致 mxi-space 的 align 变体类对按钮子元素失效（8.3 的「对齐 4 行 PASS」当时仅 tall-block / text 表现正常，按钮场景验收遗漏）；
- 修复：移除 mxi-button 根节点 `align-self: flex-start`，回归标准 flex 行为（容器 align-items 生效；column 父容器中按钮恢复平台默认 stretch 全宽，与 Vant 按钮在 flex column 中的表现一致；`width: fit-content` 替代方案因 ucss 文档「值限制」仅 length/percentage 存在矛盾表述而放弃）；
- 影响面排查：mxi-button 全部消费场景（button / cell / space 演示页）均为横排或显式 block，无观感变化。

**问题 2：自动换行区块「按钮10」比其他按钮宽 8.9px。**

- 取证：flex-wrap / flex-shrink / padding / fontSize / min-width 全部一致，容器布局无异常；81.8px − 72.9px = 8.9px 恰为多一位数字的文本渲染宽度——属内容差异的正常表现，非 Space 布局 bug（flex 语义下 item 宽度 = 内容宽度，Vant demo 等宽来自 `van-button` 的 `min-width: 76px` 兜底，与 Space 无关）；
- 修复（用户拍板：补 min-width 对齐 Vant）：vars.scss 按钮段新增 `$mxi-button-mini-min-width: 50px` / `$mxi-button-small-min-width: 60px` / `$mxi-button-normal-min-width: 76px`（均 `!default`，对齐 Vant 官方数值）；mxi-button 根类与 mini / small 变体类应用（large 无独立变量，其全宽语义由 block 承担，共用 normal 兜底）；残留：按钮10（81.8px）仍宽于其他按钮 5.8px，为 min-width 无法覆盖的内容超限差异。

**复测记录**（HMR 热更后，browser 实测）：center 按钮垂直居中（按钮中心线与容器中心线重合）/ end 贴底 / start 贴顶对照正常；换行区块按钮 1-9 等宽 76px；button / cell 演示页回归正常；console 无运行时报错；`pnpm sync:uni-modules:check` 通过。
