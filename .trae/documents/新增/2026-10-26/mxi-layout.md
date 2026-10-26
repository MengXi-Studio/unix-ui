# 新增组件：mxi-row + mxi-col（Layout 布局）

> 状态：**已完成**（2026-10-26 疑问闭环 Q1=A / Q2=A，实现并验证通过；docs 双语同步持续暂缓待用户通知）
> 参考：Vant Layout（https://vant-ui.github.io/vant/#/zh-CN/col ，用户指定链接），Row/Col 源码（Row.tsx / Col.tsx / index.less）已核对
> 流程：本任务遵循文档驱动四步工作流，疑问闭环后才进入实施
> 说明：Row + Col 为成对组件，合档建档；组件目录 / easycom 注册仍各自独立（mxi-row / mxi-col）

## 一、需求背景

用户指定 Vant Layout 布局组件。该组件是 **24 栅格纯布局系统**：`Row` 为 flex 换行容器（justify / align / gutter / wrap），`Col` 为栅格列（span 百分比宽 + offset 偏移）。无业务视觉样式，核心难点在 **gutter 间距方案**（Vant 用 JS 聚合计算 + inject 下发 padding，而非 negative margin）与 **24 档百分比类矩阵**。

uni-app x 映射基础良好：flex 换行 / justify-content / align-items 均为 ucss 标准能力；百分比 width / margin-left web 端支持；provide/inject + reactive 数组已有库内先例（mxi-checkbox-group / mxi-radio-group）。

## 二、参考资料盘点

### 2.1 Vant Layout API

**Row Props**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 列元素之间的间距（单位 px） | `number \| string \| Array`（数组 `[水平, 垂直]`） | `0` |
| tag | 自定义元素标签 | string | `div` |
| justify | 主轴对齐方式，可选 `end` `center` `space-around` `space-between` | string | `start` |
| align | 交叉轴对齐方式，可选 `center` `bottom` | string | `top` |
| wrap | 是否自动换行 | boolean | `true` |

**Col Props**

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 列元素宽度（24 栅格份数） | `number \| string` | `0` |
| offset | 列元素偏移距离（计算方式同 span） | `number \| string` | - |
| tag | 自定义元素标签 | string | `div` |

**Events**：Row / Col 均有 `click`。**类型**：`RowAlign`（top/center/bottom）、`RowJustify`（start/end/center/space-around/space-between）、`RowProps` / `ColProps`。

- 演示场景（Vant 官方 demo）：基础用法（span 8×3 / 4+10(offset 4)+6 / offset 12+12）/ 设置列间距（gutter 20）/ 垂直间距（`:gutter="[20, 20]"`）/ 对齐方式（justify 四种）

### 2.2 Vant 源码实现要点（决定 mxi 方案）

1. **gutter 不是 negative margin**：Row 通过 `useChildren` 收集全部 Col 子组件，按 span 累加（>24 分行，offset 不计入行判定）算出 **groups 行分组**，再按「平均分配」算出每个 col 的 `{ left, right }` padding 与 `{ bottom }` 垂直间距，经 provide/inject 下发，Col 以 inline style 消费。**全程纯 padding，无负 margin**；
2. **水平间距算法**（每缝等宽、首列无左 padding、尾列无右 padding）：行内 n 个 col，`avg = gutter × (n-1) / n`；第 0 个 `{ right: avg }`；第 k 个 `left = gutter - 前一个.right`、`right = avg - left`。例：gutter 20、3 col → 13.33 / 6.67+6.67 / 13.33，每缝恰 20px；
3. **垂直间距**：gutter 数组第二值 `bottom`，仅对 **除最后一行外** 的 col 施加 marginBottom；
4. **Col 样式**：`display: block; box-sizing: border-box; min-height: 1px`（防空列塌陷）；span i → `flex: 0 0 (i×100%/24); max-width: 同值`；offset i → `margin-left: (i×100%/24)`，全部为 24 档扁平类；
5. **Row 样式**：`display: flex; flex-wrap: wrap`；justify/align 变体类（start/top 为默认值不设类）；
6. **span=0 行为**：Vant span 默认 0，0 为 falsy 不设宽度类 → col 宽度由内容决定（冷门行为，对齐保留）。

### 2.3 uni-app x 映射关键点

1. **view 默认形态**：uvue view 默认 `flex-direction: column`，Row 必须显式 `flex-direction: row`；ucss App 端 display 无 `block` 值——Col 不写 display，靠默认 column 流式排列（与 Vant block 单列流观感一致）；
2. **百分比宽度**：ucss width/max-width 支持 percentage；flex 子项 uvue 默认 `flex: none` 不收缩，`width + max-width` 即可等价 Vant 的 `flex: 0 0 X%`（web 端 flex item 默认可收缩，max-width 封顶兜底）——flex 三值简写不做首选；
3. **margin-left 百分比**（offset）：web 端支持；App 端 yoga 布局支持 margin percentage，列入实施验证点；
4. **provide/inject 先例**：mxi-checkbox-group 已验证「provide reactive 数组 + 子组件 setup 注册取 index + onUnmounted 注销」在 uni-app x vapor 模式可用，gutter 方案直接复用该模式；
5. **tag prop 舍弃**：uni-app x 只能渲染 view，无自定义标签能力（对齐 mxi-text 舍弃 tag 先例）；
6. **click 事件**：对齐 mxi-cell 先例的实现方式，实施时读源码对齐；
7. **主题变量**：Row/Col 为纯布局组件，无默认视觉值，**不新增主题变量**（vars.scss 零改动）。

## 三、能力映射与判定

| Vant 能力 | mxi 方案 | 判定 |
| --- | --- | --- |
| Row flex 换行容器 | `.mxi-row { flex-direction: row; flex-wrap: wrap; }` | 采纳 |
| justify 5 值 | 变体类 `--justify-{center/end/space-between/space-around}`（start 默认无类）→ justify-content | 采纳 |
| align 3 值 | 变体类 `--align-{center/bottom}`（top 默认无类）→ align-items（top/bottom 映射 flex-start/flex-end） | 采纳 |
| wrap / nowrap | 基类 flex-wrap: wrap；`--nowrap` 覆盖 | 采纳 |
| gutter 水平 | Row 聚合 groups/spaces computed → provide → Col inline `padding-left/right`（方案见 Q1） | 推荐 A（Q1） |
| gutter 垂直（数组第二值） | 除最后一行外 Col inline `margin-bottom`；换行依赖 span 累加 >24 时 flex-wrap 自然换行（Vant 同款，无 DOM 分组） | 采纳（随 Q1） |
| span 1-24 | 24 档扁平类 `--{i} { width: X%; max-width: X%; }`（矩阵膨胀，允许 @for 循环生成，展开产物必须为扁平类） | 采纳 |
| offset 1-24 | 24 档扁平类 `--offset-{i} { margin-left: X%; }` | 采纳 |
| span=0 内容自适应 | 0/null 不拼 span 类 | 采纳 |
| click 事件 | 对齐 mxi-cell 先例 | 采纳 |
| tag prop | 舍弃（uni-app x 无自定义标签） | 舍弃 |
| RowAlign / RowJustify 类型 | 组件内联 type 定义 | 采纳 |

## 四、布局伪代码

### 4.1 mxi-row.uvue

```html
<template>
  <!-- 单 view 根节点：flex 换行容器，default 插槽直通 -->
  <view :class="rootClass">
    <slot></slot>
  </view>
</template>

<script setup lang="uts">
  type RowAlign = 'top' | 'center' | 'bottom'
  type RowJustify = 'start' | 'end' | 'center' | 'space-around' | 'space-between'
  type GutterValue = number | string

  type Props = {
    /** 列间距（px）；数组 [水平, 垂直]；0 不产生间距 */
    gutter?: GutterValue | GutterValue[] | null   // 默认 0
    /** 主轴对齐方式 */
    justify?: RowJustify | null                   // 默认 start（无类）
    /** 交叉轴对齐方式 */
    align?: RowAlign | null                       // 默认 top（无类）
    /** 是否自动换行 */
    wrap?: boolean                                // 默认 true
    customClass?: string.ClassString
    customStyle?: string
  }

  // ---- 下发给 Col 的上下文（机制对齐 mxi-checkbox-group 先例）----
  // const cols = reactive<number[]>([])            // 各 col 上报的 span 值
  // function registerCol(span: number): number     // push 后返回 index
  // function unregisterCol(index: number)          // onUnmounted 注销
  // gutter 解析：Array.isArray → [0] 水平 / [1] 垂直；单值 → 水平、垂直 0
  // const groups = computed(() => ...)             // span 累加 > 24 分行（Vant 同款算法）
  // const spaces = computed(() => ...)             // 水平间距：avg = g×(n-1)/n 平均分配，首列无 left、尾列无 right
  // const verticalSpaces = computed(() => ...)     // 垂直间距：除最后一行外 { bottom }
  // provide('mxiRowContext', { cols, spaces, verticalSpaces, registerCol, unregisterCol })
  // rootClass = 'mxi-row'
  //   + justify 变体（start 不拼类）
  //   + align 变体（top 不拼类）
  //   + !wrap → ' mxi-row--nowrap'
  //   + customClass
</script>

<style lang="scss">
  @import '../../theme/vars.scss';

  /* 基类：uvue view 默认 column，必须显式 row */
  .mxi-row {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .mxi-row--justify-center { justify-content: center; }
  .mxi-row--justify-end { justify-content: flex-end; }
  .mxi-row--justify-space-between { justify-content: space-between; }
  .mxi-row--justify-space-around { justify-content: space-around; }
  .mxi-row--align-center { align-items: center; }
  .mxi-row--align-bottom { align-items: flex-end; }
  .mxi-row--nowrap { flex-wrap: nowrap; }
</style>
```

### 4.2 mxi-col.uvue

```html
<template>
  <!-- 单 view 根节点：栅格列，宽度/偏移走类，gutter 间距走 inline -->
  <view :class="rootClass" :style="rootStyle">
    <slot></slot>
  </view>
</template>

<script setup lang="uts">
  type Props = {
    /** 列元素宽度（24 栅格份数）；0/未设置时宽度由内容决定 */
    span?: number | string                // 默认 0
    /** 左侧偏移份数（计算方式同 span） */
    offset?: number | string | null       // 默认 null（0 不设类）
    customClass?: string.ClassString
    customStyle?: string
  }

  // const ctx = inject rowContext（可空：独立使用时无 row 父级，仅类生效、无 gutter）
  // index = ctx ? ctx.register(Number(span)) : -1
  // watch span → ctx.cols[index] 更新上报（flush: 'post'，动态 span 场景）
  // onUnmounted → ctx.unregister(index)
  // spanNum / offsetNum = Number() 归一；越界值（<0 或 >24）钳制不拼类
  // rootClass = 'mxi-col'
  //   + spanNum 1-24 → ' mxi-col--{spanNum}'（0 不拼，对齐 Vant falsy 行为）
  //   + offsetNum 1-24 → ' mxi-col--offset-{offsetNum}'
  //   + customClass
  // rootStyle = customStyle 补分号
  //   + ctx.spaces[index] → padding-left / padding-right px（0 值省略）
  //   + ctx.verticalSpaces[index] → margin-bottom px（0 值省略）
</script>

<style lang="scss">
  @import '../../theme/vars.scss';

  .mxi-col {
    box-sizing: border-box;
    min-height: 1px;   /* 防空列塌陷，对齐 Vant */
  }
  /* 24 档 span 扁平类（矩阵膨胀，允许 @for 生成，展开产物为扁平类）：
     .mxi-col--{i}  { width: (i×100/24)%; max-width: (i×100/24)%; }   i = 1...24
     .mxi-col--24 即 100% */
  /* 24 档 offset 扁平类：
     .mxi-col--offset-{i}  { margin-left: (i×100/24)%; }              i = 1...24 */
</style>
```

实施细节：

1. **百分比精度**：`i × 100/24` 写足 8 位小数（如 4.16666667%），24 档合计 100% 不溢出；
2. **rowContext 的响应性**：spaces/verticalSpaces 为 Row 内 computed，provide 的是 reactive 引用，Col 的 inline style computed 依赖收集正常（checkbox-group 同款链路）；
3. **gutter=0 快路径**：spaces 计算遇 gutter 为 0 时返回空数组，Col 不拼任何 padding/margin inline（与「零通信」等价的开销）；
4. **click 事件与 onUnmounted 注销细节**：实施时对齐 mxi-cell / mxi-checkbox-group 源码先例，不在本档展开。

## 五、主题变量草案（packages/core/theme/vars.scss）

**无新增**。Row/Col 为纯布局组件，全部尺寸由 span/offset 百分比与 gutter 动态值决定，无默认视觉值。遵守库契约「已有变量禁止改默认值」——本次 vars.scss 零改动。

## 六、演示页规划（pages-sub/layout/layout.uvue）

演示 col 用浅蓝底 + 白字色块（对齐 Vant demo 观感，样式写在演示页局部）。

| 区块 | 内容 |
| --- | --- |
| 基础用法 | 3 行对照：span 8×3 / span 4 + span 10 offset 4 + span 6 / offset 12 + span 12 |
| 设置列元素间距 | `gutter="20"`，span 8×3，观察首尾贴边、每缝 20px |
| 垂直间距 | `:gutter="[20, 20]"`，span 12×4（自然换行两行），行距 20px |
| 主轴对齐 | justify center / end / space-between / space-around 四行（各 span 6×3） |
| 交叉轴对齐 | align top / center / bottom 三行，col 内放高矮不一色块对照 |
| 换行与组合 | wrap + 8 个 span 6 + `:gutter="[10, 10]"`（超 24 自然换行，水平垂直间距组合验收） |
| 点击事件 | row / col @click，toast 或 console 提示（对齐库内演示风格） |

同步登记：pages.json（`layout/layout`）/ router.config.uts（`layout`）/ demo-components.uts（基础组件组「布局 / Layout」）。

## 七、疑问清单（请直接在「回答：」处作答）

### Q1：gutter 间距实现方案？

- A. **Vant 同款：inject 聚合 + 平均分配 padding**（推荐）：Row 收集各 Col 的 span → groups 行分组 → 平均分配算出每列 `{ left, right }` padding 与垂直 `bottom`，provide 下发，Col inline 消费。优点：效果与 Vant 完全一致（首尾边缘精确对齐）、纯 padding 无负值风险、垂直间距行分组自然获得；成本：Row/Col 间 provide/inject 注册链路（库内已有先例，风险低）
- B. Element 同款：Row 负 margin `0 -gutter/2` 补偿 + 每 Col 左右 padding `gutter/2`。零通信实现极简，但依赖 App 端负 margin 支持（未验证），且垂直间距需另做补偿逻辑，row 溢出父容器的裁剪边界需逐处确认
- C. 每 Col 左右各半 padding 不补偿：实现最简，但首列多出 gutter/2 左边距、尾列多出右缩进，色块演示下与 Vant 观感差异明显

回答：A。

### Q2：文档与演示页组织方式？

- A. **单文档单页**（推荐）：文档 `components/layout.md`（Layout 布局，Row/Col API 同页分表，对齐 Vant 官方「Layout 布局」页），演示页 `pages-sub/layout/layout.uvue` 单页覆盖全部区块
- B. 双文档双页：`row.md` + `col.md` 各自成页（easycom 组件一一对应），演示页同步拆分

回答：A。

## 八、实施记录（2026-10-26）

### 8.1 落码清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/mxi-row/context.uts` | 新建栅格上下文：ROW_KEY 字符串 key + RowContext class（reactive col 注册表 + spaces / verticalSpaces ComputedRef 字段 + register / unregister / indexOfCol / setSpan）+ generateColId |
| `packages/core/components/mxi-row/mxi-row.uvue` | 新建组件：flex 换行容器，gutter 解析（数组 [水平, 垂直]）→ groups 行分组 → spaces 平均分配 / verticalSpaces 三个 computed（Vant 同款算法），provide 下发；justify / align / wrap 变体类 |
| `packages/core/components/mxi-col/mxi-col.uvue` | 新建组件：inject 注册（setup 同步 / onUnmounted 注销 / watch span 动态上报），span / offset 档位类 + gutter 间距 inline 消费；@for 生成 24 档百分比矩阵 |
| `packages/core/theme/vars.scss` | 零改动（纯布局组件无默认视觉值，见第五节） |
| `packages/playground/uni_modules/mxi-ui-x/` | `pnpm sync:uni-modules` 同步产物 |
| `packages/playground/pages-sub/layout/layout.uvue` | 新建演示页（七区块：基础 / 列间距 / 垂直间距 / 主轴对齐 / 交叉轴对齐 / 换行组合 / 点击事件） |
| `packages/playground/pages.json` | pages-sub 注册 `layout/layout` |
| `packages/playground/router/router.config.uts` | 路由表登记 `layout` |
| `packages/playground/pages/index/demo-components.uts` | 基础组件组登记「布局 / Layout」 |

### 8.2 关键实现决策

1. **上下文复用 cell-group 模式**：字符串 key（App 原生端无 Symbol）+ class 实现（非蒸汽端不支持含方法的对象字面量 type）；col 以唯一 id 注册而非 index 注册——v-for 动态删列后其余 col 的下标经 `indexOfCol` 自动前移重算；
2. **spaces 下发结构**：spaces / verticalSpaces 为 Row 内 computed（依赖 reactive 注册表 + gutter props），赋给 RowContext 的 ComputedRef 字段后 provide；Col 的 rootStyle computed 消费 `spaces.value[index]`，响应链贯通（改 gutter / 动态增删 col / 动态 span 均自动重算）；
3. **水平间距算法照抄 Vant**：行内 n 列 `avg = gutter×(n-1)/n`，首列无 left、尾列无 right，实测 gutter 20 三列缝隙恰 20px 且首尾贴边（浏览器实测 PASS）；
4. **24 档矩阵生成**：`@for $i from 1 through 24` 乘常数 `4.16666666667%`（避开 scss `/` 除法弃用警告与 `@use` 顶部注入顺序风险），展开产物为扁平类；`width + max-width` 等价 Vant 的 `flex: 0 0 X%`（uvue flex 子项默认 `flex: none` 不收缩）；
5. **档位类拼接守卫**：span / offset 归一后须为 1-24 整数才拼类（0 对齐 Vant falsy 行为 = 内容自适应，小数无对应档位）；
6. **gutter=0 快路径**：spaces 计算遇 g≤0 返回空数组，Col 不拼任何间距 inline。

### 8.3 验证记录

| 项目 | 结果 |
| --- | --- |
| `pnpm sync:uni-modules:check` | PASS |
| HMR 编译 | PASS（mxi-row / mxi-col 仅 TS2769 类型 warning，与既有 cell / image / space 同源的联合含 null props 噪音，不阻断编译） |
| 页面加载与 console | PASS（无 JS 运行时错误） |
| 基础用法：8×3 / 4+10(offset 4)+6 / 12(offset 12) | PASS |
| **gutter 20**：缝隙 20px、首尾列贴容器边缘 | PASS（平均分配算法关键验证点） |
| 垂直间距 [20, 20]：两行列距 / 列距各 20px | PASS |
| justify center / end / space-between / space-around | PASS |
| align top / center / bottom（高矮色块） | PASS |
| 换行组合：10 个 span 6 分 3 行（4+4+2）+ gutter [10, 10] | PASS |
| 点击事件：col click / row click toast | PASS（col 回调 stopPropagation 隔离冒泡后独立验证，见 8.5） |
| 首页「基础组件」分组「布局 / Layout」 | PASS |

### 8.4 遗留

- App 端真机验证：offset 的 margin-left 百分比、span 的 width/max-width 百分比、provide/inject 注册链在 App-Android / iOS 的原生渲染表现（web 端已验收）；
- TS2769 类型 warning 为全库既有模式，治理建议单独立项（与 space 8.4 同一条目合并处理）；
- 动态 span / v-for 动态增删 col 的间距重算仅静态路径验收（reactive 链路成立），如需可加交互演示；
- docs 双语文档同步持续暂缓（mxi-cell / mxi-image / mxi-text / mxi-space / mxi-layout 五轮，待用户通知）。

### 8.5 实施问题修复（均已闭环）

**问题 1：mxi-col 编译报 `Failed to resolve import "./context"`。**

- 根因：context.uts 落在 mxi-row/ 目录，mxi-col.uvue 导入路径误写为 `./context.uts`（应为 `../mxi-row/context.uts` 跨组件目录导入，mxi-cell → mxi-cell-group 同款先例）；
- 修复：改跨目录导入，重新 sync 后 TS2307 消除。

**问题 2：点击「点击 col」色块后 toast 显示「row click」而非「col click」。**

- 根因：col 点击事件冒泡到 row，row 的 toast 后触发将 col 的 toast 覆盖（uni.showToast 单例），col 的 emit 链路本身正常；
- 修复：演示页 col 回调内 `event.stopPropagation()` 隔离冒泡（组件行为不变，冒泡触发 row 为 Vant 同款语义，caption 已说明），复测 col click / row click 均独立正确。

**问题 3：演示页初版写了 `.col-dark .col-text` 后代选择器。**

- 根因：违规 ucss「仅 class 选择器」红线（自查发现，未等编译报错）；
- 修复：改为独立扁平类 `.col-text--light`。

**问题 4：用户回验提出「列元素间距未生效」（2026-10-26）。**

- 取证：browser_evaluate 实测 gutter 区块 col 的 inline padding 已正确应用（13.3333 / 6.66667+6.66667 / 13.3333 px，Vant 平均分配算法精确执行），col 盒子紧贴（差值 0，padding 方案的设计行为）；
- 根因：演示页把背景色 `custom-class="col-block"` 直接挂在 col 本身——gutter 的 padding 区域被背景色填满，视觉上色块连成一片；Vant demo 的色块是 col 内层元素，col 的 padding 保持透明显示缝隙；
- 修复：演示页全部区块色块内移为 `<mxi-col><view class="col-block">` 结构（col 样式仅背景透明容器），组件零改动；复测缝隙精确 20.0px、首尾贴边 0.0px，其余区块回归 PASS。
