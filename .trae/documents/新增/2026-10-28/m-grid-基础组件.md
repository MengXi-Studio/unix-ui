# m-grid 基础组件 实施方案

## 需求

用户要求实现 Vant Grid 宫格（https://vant-ui.github.io/vant/#/zh-CN/grid ）的对标组件 `m-grid` + `m-grid-item`（双组件，第二组：第一组为 m-cell / m-cell-group，栅格先例为 m-row / m-col）。API 对齐原则：props 命名、变体、事件语义以 Vant 为准；UTS / uvue 红线不支持的能力在双语文档中注明差异。

## 需求分析

Vant Grid API（官网文档已抓取）：

### Grid Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| column-num | 列数 | number \| string | 4 |
| icon-size | 图标大小，默认单位 px | number \| string | 28px |
| gutter | 格子之间的间距，默认单位 px | number \| string | 0 |
| border | 是否显示边框 | boolean | true |
| center | 是否将格子内容居中显示 | boolean | true |
| square | 是否将格子固定为正方形 | boolean | false |
| clickable | 是否开启格子点击反馈 | boolean | false |
| direction | 格子内容排列方向，可选值 `horizontal` | string | vertical |
| reverse | 是否调换图标和文本的位置 | boolean | false |

### GridItem Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| text | 文字 | string | - |
| icon | 图标名称 | string | - |
| icon-prefix | 图标类名前缀 | string | van-icon |
| icon-color | 图标颜色 | string | - |
| dot | 是否显示图标右上角小红点 | boolean | false |
| badge | 图标右上角徽标的内容 | number \| string | - |
| badge-props | 自定义徽标属性透传 | BadgeProps | - |
| url | 点击后跳转的链接地址 | string | - |
| to | 点击后跳转的目标路由对象 | string \| object | - |
| replace | 是否在跳转时替换当前页面历史 | boolean | false |

### GridItem Events / Slots

- Events：`click`（点击格子时触发，回调 event: MouseEvent）
- Slots：`default`（自定义宫格全部内容）/ `icon`（自定义图标）/ `text`（自定义文字）

### CSS 变量

- grid-item-content-padding：`var(--van-padding-md) var(--van-padding-xs)`（16px 8px）
- grid-item-content-background：`var(--van-background-2)`（#ffffff）
- grid-item-content-active-color：`var(--van-active-color)`（#f2f3f5，按压反馈背景）
- grid-item-icon-size：28px
- grid-item-text-color：`var(--van-text-color)`（#323233）
- grid-item-text-font-size：`var(--van-font-size-sm)`（12px）

Vant 实现要点（源码结构）：

- Grid 为 flex row + wrap 容器，provide 自身 props 与 children；GridItem inject 后计算：`flex-basis: 100/columnNum%`；square 时 `padding-top: 同百分比` 撑出正方形 + content `position: absolute; inset: 0`；非 square 且 gutter 时 item `padding-right: gutter`、非首行（index >= columnNum）`margin-top: gutter`；square 且 gutter 时 content `padding: gutter`。
- border：GridItem content 的 `::after` hairline 承担右线 + 下线；行尾格与最后一行格的线由类修饰去除。
- clickable 按压反馈：`:active` 伪类切背景色（active-color）。
- badge/dot：icon 区域外包 Badge 组件。

UTS / uvue 红线下的取舍：

| Vant 能力 | m-grid 方案 |
| --- | --- |
| `::after` hairline 边框 | 真实 view 绝对定位缩放层（scale 0.5 / origin 0 0，m-cell-group 先例）；行尾无右线、最后一行无下线，由 index / columnNum / total 计算 |
| `:active` 按压反馈 | ucss 无伪类 → touchstart / touchend 切换 active 类；Web 端桌面浏览器无 touch，补 `#ifdef WEB` mousedown / mouseup（待 Q3 定案） |
| square 正方形 | A：`padding-top: 百分比`（相对父宽）+ content 绝对定位；B：`aspect-ratio: 1`（App 端 ucss 未列入支持清单）；C：JS 测量设高（待 Q1 定案） |
| gutter 间距 | A：对齐 m-row 平均分配先例（首列无左、尾列无右，整行铺满）；B：对齐 Vant（每格 padding-right + 非首行 margin-top，行尾留白）（待 Q2 定案） |
| `to`（Vue Router 路由对象） | 不做：uni-app x 无 vue-router；`url` 保留，走 `uni.navigateTo` / `replace` 时 `uni.redirectTo`，文档注明仅支持应用内页面路径 |
| icon-prefix | 不做：m-icon 为字体图标（unicode 直显），无 class-prefix 机制 |
| badge-props | 不做（过度设计）；badge 类型收 string（UTS 数字语义字符串惯例，m-badge 先例） |
| badge / dot 联动 | 复用 m-badge 包裹模式：`<m-badge :content :dot><m-icon :name :size :color /></m-badge>`，徽标默认 top-right 压角 |
| children / provide props | 双组件上下文走 `context.uts`（GRID_KEY + GridContext class，m-row / m-cell-group 先例；非蒸汽端不支持含方法的对象字面量 type）；props 快照以 computed 挂入 ctx（m-row ctx.spaces 先例），grid props 变化实时下发 |
| item 自身 index | 注册顺序即渲染顺序（setup 同步注册，LESSONS #14 首帧即正确）；`ctx.ids.indexOf(id)` 在 item computed 中求值，reactive 依赖自动随注册 / 注销重算 |

技术决策：

1. **m-grid**（纯容器）：单 view 根节点（`flex-direction: row` + `flex-wrap: wrap`），default 插槽直通，无自有视觉；columnNum / gutter 归一化、border / center / clickable / direction / reverse / iconSize 以 computed 快照挂入 GridContext 后 provide。
2. **m-grid-item**（自量宽子项）：flex-basis 百分比定宽（100/columnNum%，flex 容器内自动换行）；内容区 content 分「icon 区 + text 区」，vertical 上下排 / horizontal 左右排 / reverse 用 `row-reverse` / `column-reverse`；click 事件派发 + clickable 按压态 + url 跳转。
3. **border 计算**：item 有 hairline 右线 + 下线两层绝对定位 view；`isRowEnd = (index + 1) % columnNum == 0`（或末位）→ 隐右线；`isLastRow = index + columnNum >= total` → 隐下线。仅 border=true 且 gutter=0 时生效（Vant 同款：gutter 下 border 自动失效——等等，Vant 是 border 与 gutter 独立生效；保留独立生效，gutter 下线仍显示）。
4. **center**：content 内 flex 居中（vertical 时主轴 center + 交叉轴 center；horizontal 时仅交叉轴 center、主轴 start 且 text 左对齐，对齐 Vant 视觉）。

涉及文件（architecture.md 第 6 节唯一落点）：

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-grid/m-grid.uvue` | 容器组件源 |
| `packages/core/components/m-grid/context.uts` | GridContext（GRID_KEY + 注册表 + props computed 快照） |
| `packages/core/components/m-grid-item/m-grid-item.uvue` | 格子组件源（inject 消费） |
| `packages/core/theme/vars.scss` | 新增 `$m-grid-item-*` 段 7 变量（全 `!default`，不动既有变量） |
| `packages/playground/pages-sub/grid/grid.uvue` + `pages.json` + `router/router.config.uts` + `pages/index/demo-components.uts` | 演示页（穷举全部 props / 变体 / 事件）+ 三处注册 |
| `packages/docs/src/components/grid.md` + `src/en/components/grid.md` | 双语文档（含「与 Vant 的差异」节） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步（Divider 之后、Icon 之前） |
| `packages/docs/src/changelog.md` + `src/en/changelog.md` + `playground/uni_modules/m-ui-x/changelog.md` | 完成后回填现有 0.2.0 节（不新开版本） |

复用与依赖：m-icon（icon / iconColor / iconSize 渲染）、m-badge（dot / badge 徽标）。

验证链（workflow 第三步 DoD）：`pnpm sync:uni-modules` → `pnpm sync:uni-modules:check` → dev server 编译 → Playwright 浏览器实测全部变体（含 square 高宽比、gutter 间距、border 线显隐矩阵、horizontal / reverse 布局、badge 联动、click 事件、按压态）→ `pnpm build:docs` 死链检查 → 清理调试代码。

## 伪代码设计

### context.uts（m-grid 下，对齐 m-cell-group/context.uts 形态）

```
export const GRID_KEY: string = '__mxi_grid__'

export class GridContext {
  // props computed 快照（grid setup 挂入，变化实时下发）
  columnNum: ComputedRef<number>
  gutter: ComputedRef<number>          // 归一化后 px
  border / center / clickable / square / reverse: ComputedRef<boolean>
  direction: ComputedRef<string>       // 'vertical' | 'horizontal'
  iconSize: ComputedRef<string>
  // item 注册表（渲染顺序即注册顺序）
  ids: string[] = reactive<string[]>([])
  register(id: string): void
  unregister(id: string): void
  indexOf(id: string): number          // item computed 内调用，自动响应增删
  total(): number
}

let gridItemIdCounter = 0
export function generateGridItemId(): string
```

### m-grid.uvue（容器）

```
type GridDirection = 'vertical' | 'horizontal'

type Props = {
  columnNum?: number | string   // 列数，默认 4
  iconSize?: string             // 图标大小，默认 '28px'
  gutter?: number | string      // 格子间距 px，默认 0（待 Q2）
  border?: boolean              // 默认 true
  center?: boolean              // 默认 true
  square?: boolean              // 默认 false（待 Q1）
  clickable?: boolean           // 默认 false（待 Q3）
  direction?: GridDirection     // 默认 'vertical'
  reverse?: boolean             // 默认 false
  customClass?: string.ClassString
  customStyle?: string
}

setup:
  const ctx = new GridContext()
  ctx.columnNum = computed(() => toNum(props.columnNum, 4))
  ctx.gutter    = computed(() => toNum(props.gutter, 0))
  ... 其余 props 快照
  provide(GRID_KEY, ctx)

模板：
  <view :class="rootClass" :style="rootStyle"><slot /></view>
  // rootClass = 'm-grid'（+ customClass）；样式仅 flex-direction: row + flex-wrap: wrap
```

### m-grid-item.uvue（格子）

```
type Props = {
  text?: string
  icon?: IconName | null
  iconColor?: string
  dot?: boolean                 // 默认 false
  badge?: string                // 徽标内容，空串不显示
  url?: string                  // 应用内页面路径
  replace?: boolean             // 默认 false
  customClass?: string.ClassString
  customStyle?: string
}

setup:
  const ctx = inject<GridContext | null>(GRID_KEY, null)
  const id = generateGridItemId()
  if (ctx != null) ctx.register(id)
  onUnmounted(() => { if (ctx != null) ctx.unregister(id) })

  index = computed(() => ctx == null ? 0 : ctx.indexOf(id))
  columnNum = computed(() => ctx == null ? 1 : ctx.columnNum.value)
  total = computed(() => ctx == null ? 1 : ctx.total())

  // 定宽与正方形
  itemStyle = computed(() => {
    let style = 'flex-basis: ' + (100 / columnNum) + '%;'
    if (square) {
      style += ' padding-top: ' + (100 / columnNum) + '%;'   // 相对父宽撑出正方形（Q1 A）
      style += ' position: relative;'
    } else if (gutter > 0) {
      style += gutterPadding                                  // Q2 分配方案
      if (index >= columnNum) style += ' margin-top: Npx;'    // 非首行
    }
    return style + customStyle
  })

  // 边框显隐（border && 非 square？Vant：border 与 square 可同时）
  showBorderRight = computed(() => border && !isRowEnd)   // (index+1) % columnNum != 0
  showBorderBottom = computed(() => border && !isLastRow) // index + columnNum < total

  // 按压态（Q3 A）：touchstart 置 active、touchend / touchcancel 复原
  // 点击：emit('click', e)；url 非空时 navigateTo / redirectTo(replace)

模板：
  <view :class="itemClass" :style="itemStyle" @click="handleClick"
        @touchstart="onTouchStart" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
    <view :class="contentClass">
      <!-- default 插槽替换全部内容 -->
      <slot>
        <!-- icon 区：m-badge 包 m-icon（或 icon 插槽） -->
        <view v-if="hasIconArea" class="m-grid-item__icon">
          <m-badge :content="badge" :dot="dot">
            <slot name="icon"><m-icon :name="icon" :size="iconSize" :color="iconColor" /></slot>
          </m-badge>
        </view>
        <!-- text 区 -->
        <view v-if="text != '' || hasTextSlot" class="m-grid-item__text">
          <slot name="text"><text class="m-grid-item__text-inner">{{ text }}</text></slot>
        </view>
      </slot>
      <!-- hairline 右线 / 下线（绝对定位缩放层，origin 0 0 / 0 100%） -->
      <view v-if="showBorderRight" class="m-grid-item__border-right" />
      <view v-if="showBorderBottom" class="m-grid-item__border-bottom" />
    </view>
  </view>

扁平类清单（computed 拼接，无嵌套选择器）：

  itemClass    = 'm-grid-item'
                 + (square ? ' m-grid-item--square' : '')
  contentClass = 'm-grid-item__content'
                 + (center ? ' m-grid-item__content--center' : '')
                 + (direction == 'horizontal' ? ' m-grid-item__content--horizontal' : '')
                 + (reverse ? ' m-grid-item__content--reverse' : '')
                 + (pressActive ? ' m-grid-item__content--active' : '')

样式要点（扁平书写，全部类选择器）：

  .m-grid-item                        { }   // 定宽 / 正方形 / gutter 全走 inline itemStyle
  .m-grid-item--square                { }   // content 绝对定位 inset:0 铺满 padding 区
  .m-grid-item__content               { position: relative; flex-direction: column; align-items: center;
                                        justify-content: center; padding: $m-grid-item-content-padding;
                                        background-color: $m-grid-item-content-background; }
  .m-grid-item__content--center       { }   // center=false 时对齐 flex-start（horizontal 主轴）
  .m-grid-item__content--horizontal   { flex-direction: row; }
  .m-grid-item__content--reverse      { flex-direction: row-reverse; }        // horizontal + reverse
  .m-grid-item__content--horizontal + --reverse 联动 column-reverse                       // vertical + reverse（组合类，待落码定形态）
  .m-grid-item__content--active       { background-color: $m-grid-item-content-active-color; }
  .m-grid-item__icon                  { margin-bottom: 8px; }                       // vertical 态
  .m-grid-item__text-inner            { color: $m-grid-item-text-color;
                                        font-size: $m-grid-item-text-font-size; }
  .m-grid-item__border-right          { position: absolute; top: 0; bottom: 0; right: 0; width: 1px;
                                        background-color: $m-grid-item-border-color;
                                        transform: scaleX(0.5); transform-origin: 0 0; }
  .m-grid-item__border-bottom         { position: absolute; left: 0; right: 0; bottom: 0; height: 1px;
                                        background-color: $m-grid-item-border-color;
                                        transform: scaleY(0.5); transform-origin: 0 0; }
```

注：reverse 与 direction 组合的两条规则需展开为独立扁平类（`--reverse` 在 horizontal 下 row-reverse、vertical 下 column-reverse）——落码时按「content--reverse 仅在 vertical 下拼 / horizontal+reverse 拼独立组合类」处理，保证展开后仍是扁平类。

主题变量（`packages/core/theme/vars.scss` 追加，全 `!default`）：

```
$m-grid-item-content-padding: 16px 8px;
$m-grid-item-content-background: $m-white;
$m-grid-item-content-active-color: #f2f3f5;
$m-grid-item-icon-size: 28px;
$m-grid-item-text-color: #323233;
$m-grid-item-text-font-size: 12px;
$m-grid-item-border-color: #ebedf0;
```

演示页规划（`pages-sub/grid/grid.uvue`，对齐 Vant 文档 9 节 + 事件）：

1. 基础用法（icon + text，默认 4 列）
2. 自定义列数（column-num 3，6 格）
3. 自定义内容（default 插槽配 m-image，border=false）
4. 正方形格子（square，8 格）
5. 格子间距（gutter 10）
6. 内容横排（direction=horizontal 3 列）+ reverse 变体
7. 页面导航（clickable + url 跳转演示）
8. 徽标提示（dot / badge="99+"）
9. 边框对比（border true / false）
10. 点击事件（click 日志区，验证事件派发与按压反馈）

文档规划：zh / en 双语 grid.md（介绍 / 代码演示 10 节 / Grid Props / GridItem Props / Events / Slots / 主题定制 7 变量表 / 与 Vant 的差异节：icon-prefix、badge-props、to、url 仅应用内路径、按压反馈实现机制）；侧栏 zh.ts / en.ts 在 Divider 之后、Icon 之前插入 Grid。

## 疑问清单（回复编号即可，如「Q1 答：A」）

- **Q1 square 正方形实现**：
  - A（推荐）：`padding-top: 百分比`（相对父宽，与 flex-basis 同值）撑出正方形 + content 绝对定位 inset 0。Web 端经典方案；uni-app x App 端基于 yoga 布局，padding 百分比相对父宽理论可用，**以实测为准**，若 App 端失效再回退 C。
  - B：`aspect-ratio: 1 / 1` 一行解决，但 App 端 ucss 支持清单未列 aspect-ratio，风险最高。
  - C：onMounted 后 JS 测量宽度设高度（UniElement rect），需额外监听宽度变化，复杂度最高、首帧可能闪跳。

答：A。

- **Q2 gutter 间距分配**：
  - A（推荐）：对齐 m-row 先例——平均分配（首列无左、尾列无右，相邻格 padding 之和恰为 gutter），整行铺满、视觉对称。
  - B：对齐 Vant——每格 padding-right + 非首行 margin-top，行尾与右缘留白一格 gutter 宽，与 Vant 视觉一致但整行不铺满。

答：A。

- **Q3 clickable 按压反馈实现**：
  - A（推荐）：touchstart / touchend / touchcancel 切换 active 背景类；Web 端补 `#ifdef WEB` mousedown / mouseup（桌面浏览器无 touch）。还原 Vant :active 视觉，事件最多但均为标准事件。
  - B：不做按压态，仅派发 click 事件，文档注明差异。
  - C：UniElement.animate 做短暂背景过渡动画——点击后才有动画，无「按住未松开」的即时反馈，语义不贴。

答：A。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- **Q1 square（定案 A）**：`padding-top: 百分比` + content 绝对定位落地，Web 端实测格子高宽相等；与伪代码 else-if 互斥分支的差异——square 与 gutter 改为**独立叠加**（Q2 定案 A 统一平均分配后两者正交）：square 管撑高、gutter 管间距，同时开启各自生效
- **Q2 gutter（定案 A）**：对齐 m-row 平均分配——行首格无左距、行尾格无右距、中间格左右各 gutter/2，非首行 margin-top gutter；整行铺满，与 Vant「每格 padding-right + 行尾留白」不同，双语文档已注明差异
- **Q3 clickable（定案 A，实现升级）**：承诺的 touchstart / touchend / mousedown 切类升级为 view 原生 `:hover-class`（m-cell / m-button 先例，声明式，App / Web 双端免事件监听），意图不变——还原 Vant `:active` 按压背景（`$m-grid-item-content-active-color`）
- **边框方案修正（首跑 FAIL）**：伪代码沿用 Vant 的「行尾隐右线、最后一行隐下线」，单行 / 单格 grid 下外框右边与底边无线可承担；修正为拼线方案——容器无条件画 top + left，全部格子无条件画 right + bottom（border=true 即显示），内线相邻格共享、外框由行尾 / 末行格承担（记 LESSONS #38）
- **icon 字号修正（首跑 FAIL）**：icon 区 view 上的 font-size 被截断（Web 端 uni-text 默认 16px 不吃继承），m-icon 改传 `custom-class="m-grid-item__icon-text"`（类内 `font-size: $m-grid-item-icon-size`）+ `:size="iconSizeResolved"`（icon-size prop 显式时 inline 覆盖主题类）（记 LESSONS #37）
- **定宽形态**：flex-basis 百分比落地为 inline `width` 百分比（App 端 width 百分比可靠、max-width 百分比打包 ERROR，m-col 先例）；UTS inline 序列化 `(100/n)` 为 4 位小数（如 `width: 33.3333%`）
- **reverse 组合**：vertical+reverse → `--reverse-vertical`（column-reverse）、horizontal+reverse → `--reverse-horizontal`（row-reverse），展开为两个独立扁平类
- **context.uts**：与伪代码一致（GRID_KEY + reactive ids 注册表 + 9 props computed 快照 + generateGridItemId），注册在 setup 同步执行（LESSONS #14 首帧即正确），onUnmounted 注销

### 变更文件清单

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-grid/context.uts` | GridContext（GRID_KEY + reactive 注册表 + props computed 快照 + generateGridItemId） |
| `packages/core/components/m-grid/m-grid.uvue` | 容器源（9 props + provide + 顶 / 左 0.5px 线） |
| `packages/core/components/m-grid-item/m-grid-item.uvue` | 格子源（inject 消费；text / icon / icon-color / dot / badge / url / replace 7 props + click 事件 + default / icon / text 三插槽） |
| `packages/core/theme/vars.scss` | `$m-grid-item-*` 7 变量（全 `!default`） |
| `packages/playground/pages-sub/grid/grid.uvue` + `pages.json` + `router/router.config.uts` + `pages/index/demo-components.uts` | 演示页 12 节 + 三处注册 |
| `packages/docs/src/components/grid.md` + `src/en/components/grid.md` | 双语文档（Grid Props / GridItem Props / Events / Slots / 主题 7 变量 / 与 Vant 的差异） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步（Divider 与 Icon 之间） |
| `packages/docs/src/changelog.md` + `src/en/changelog.md` + `playground/uni_modules/m-ui-x/changelog.md` | 三处 changelog 0.2.0 节回填 |
| `packages/playground/uni_modules/m-ui-x/` 的 components / theme | `pnpm sync:uni-modules` 同步产物（非手改） |

### 验证结果

- Playwright 全变体实测：**53 PASS / 0 FAIL**（脚本 `/tmp/pw-popup-verify/verify-grid.cjs`，playwright-core + 系统 Chrome headless 1134×900；dev server 5175 实例——5174 被旧实例占用）
  - T0 载入：演示页可达（history 路由须带 `/unix-ui/playground/` base 前缀，不带前缀 404）；12 grid / 49 item 实例计数正确
  - 定宽：inline `width: 33.3333%`（4 位小数）命中；square 高宽相等；gutter 平均分配精确（行首无左 / 行尾无右 / 中间各半）+ 10px 行距
  - 布局：横排 / 反向 flex-direction 断言通过；hover-class 属性存在
  - 交互：真实点击跳转 divider 页成功（url + uni.navigateTo）；badge 99+ / 8 / dot / 无徽标四态正确；click 事件日志置顶
  - 全程无 pageerror
- 截图核对（grid-full / grid-basic / grid-gutter / grid-badge，/tmp 下）：完整表格边框、gutter 分离间距正常；自定义内容节灰块为 GitHub raw 示例图未加载的 m-image 占位（非缺陷）
- 验证链：`pnpm sync:uni-modules:check` 一致；`pnpm build:docs` 通过（4.11s 无死链）；`pnpm run build:demo` 56 文件产物入库；组件无调试代码

### 验收修复（用户反馈「格子间距示例效果不对」）

- 排查：Playwright 实测布局数据精确（相邻白盒间隙 10.0px、padding 平均分配、无 pageerror），组件行为与 Vant 语义一致（Vant 格子 `::after` 在 gutter 下同样无条件画右+下线）；根因是**演示载体**——演示页 card 与格子 content 同为纯白（#ffffff），10px 间隙透出的仍是白色，视觉上完全不可见，只剩每格右/下 hairline 悬在空白里像断线；Vant 官网 demo 观感依赖其页面灰底衬托
- 修复：演示页 gutter 节包 `.gutter-stage` 浅灰内衬（#f7f8fa + 圆角 + 12px 内距，与 log-area 底色一致），间隙透灰、白块分离观感成立；**组件零改动**
- 二轮修复（用户红框反馈第二行空位）：原 6 格排 4 列，第二行仅 2 格，右侧两个格位露出大片灰底像布局断裂（白底时期该空位不可见，灰内衬后暴露；Vant 官网 gutter demo 为满行无此问题）——演示数据补至 8 格（4×2 满两行）消除空位
- 复测：截图确认 8 格排满两行、列间 / 行间 10px 间隙清晰可见、描边自然；`pnpm run build:demo` 56 文件重新入库

### 遗留 TODO

- [ ] App 端（Android / iOS）真机实测：square 的 padding-top 百分比撑高、gutter 半值间距、hover-class 按压反馈与 0.5px 拼线缩放表现（Web 端已实测通过）
