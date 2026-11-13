# m-fab 悬浮按钮 实施方案

## 需求

- 对标设计：Sard `Fab`（https://sard.wzt.zone/components/fab）——悬浮按钮，点击展开扩展按钮列表。
- 目标：在 `packages/core` 新增 `m-fab` + `m-fab-item` 组件，完成主题变量、uni_modules 同步、演示页、双语文档与验证闭环。

## 需求分析

### 对标 API（Sard 原版）

| 组件 | Props | Slots | Emits |
| --- | --- | --- | --- |
| Fab | top / right / bottom / left（string）、color、background、hide-name、overlay-closable、draggable、axis（x/y/both/none，默认 y）、magnet（x/y）、margin-x / margin-y（number，默认 24）、offset（{x,y}） | default（扩展按钮容器）、entry（入口按钮，作用域 `{ visible }`） | click、update:visible、update:offset |
| FabItem | name、color、background | default（按钮内容）、name（名称文本） | click |

Sard 扩展按钮的展示顺序为「自下而上」：入口按钮固定在角落，展开时按钮项依次向上（或向下，视角落）堆叠，带 stagger 动画与名称文本（`hide-name` 可隐藏）。

### 影响面

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-fab/m-fab.uvue`、`packages/core/components/m-fab-item/m-fab-item.uvue`（+ 跨组件上下文 `m-fab/fab.uts`） |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-fab-*` 段（全 `!default`） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `packages/playground/pages-sub/fab/fab.uvue` + `demo-components.uts` 登记（分组：反馈组件） |
| 文档 | `packages/docs/src/components/fab.md` + `src/en/components/fab.md` + zh.ts / en.ts 侧栏（反馈组件组） |
| 变更登记 | `playground/uni_modules/m-ui-x/changelog.md`（0.5.0）、文档站 changelog |

### 技术要点（UTS / uvue 约束）

- **固定定位**：根节点 `position: fixed`（Web/App 走 fixed；小程序端 fixed 相对视口，可用），`z-index` 走主题变量。
- **展开动画**：ucss 无 `@keyframes`，逐个按钮 `UniElement.animate`（opacity + translateY + scale，按索引 stagger）。
- **拖拽**：入口按钮 `@touchstart/@touchmove/@touchend`，位移写入本地 offset；`uni.getWindowInfo()` 取视口尺寸做边界钳制；`touchend` 时按 `magnet` 吸附到最近边（吸附也走 animate 平滑落位）。
- **上下文**：`m-fab` provide 上下文（visible、hideName、颜色、索引分配），`m-fab-item` inject 后注册自身（复用 m-tabs / m-compact 的注册序先例）。
- **遮罩**：复用 `m-overlay`（`overlay-closable` 时点击关闭），与 m-popup 组合先例一致。
- **图标**：入口按钮默认图标走 `m-icon`（内置图标名，`plus` 展开态 `cross`），entry 插槽可完全自定义。

## 伪代码设计

### Props（m-fab）

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| top | `string` | `''` | 距视口顶部距离（设置后优先于 bottom） |
| right | `string` | `''` | 距视口右边距离 |
| bottom | `string` | `''` | 距视口底部距离（默认 24px） |
| left | `string` | `''` | 距视口左边距离（设置后优先于 right） |
| color | `string` | `''` | 入口按钮图标色（空串用主题变量） |
| background | `string` | `''` | 入口按钮背景色（空串用主题变量，支持渐变） |
| hideName | `boolean` | `false` | 隐藏按钮项名称 |
| overlayClosable | `boolean` | `false` | 点击遮罩关闭扩展按钮 |
| draggable | `boolean` | `false` | 是否可拖拽 |
| axis | `'x' \| 'y' \| 'both' \| 'none'` | `'y'` | 可拖拽方向轴 |
| magnet | `'x' \| 'y' \| ''` | `''` | 松手吸附到指定轴最近边 |
| marginX | `number` | `24` | 拖拽时距视口左右最小间距（px） |
| marginY | `number` | `24` | 拖拽时距视口上下最小间距（px） |
| offset | `{ x: number, y: number } \| null` | `null` | 受控位置（v-model:offset，按钮中心点坐标） |
| zIndex | `number` | `99` | 层级 |
| customClass / customStyle | | | 根节点样式直达 |

### Props（m-fab-item）

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | `string` | `''` | 按钮名称（hide-name 时仅作 click 语义标识） |
| color | `string` | `''` | 图标色（空串继承 Fab） |
| background | `string` | `''` | 背景色（空串继承 Fab） |

### Slots

- `m-fab`：`default`（m-fab-item 列表）、`entry`（作用域 `{ visible }`）
- `m-fab-item`：`default`（图标等内容）、`name`（名称文本）

### Emits

- `m-fab`：`click`、`update:visible`、`update:offset`
- `m-fab-item`：`click`（点击后自动收起）

### 模板结构（m-fab）

```
view.m-fab (position: fixed, style 由 top/left/right/bottom/offset 计算)
 ├─ view.m-fab__list (纵向 flex，反向排列)
 │   └─ <slot>  (m-fab-item × N)
 ├─ view.m-fab__entry (@click 切换 visible，@touch 处理拖拽)
 │   └─ slot[name=entry] 或 m-icon(visible ? cross : plus)
```

遮罩层与 m-fab 根节点平级渲染（fixed 全屏），`overlay-closable` 时点击收起。

### 关键逻辑分支

1. `positionStyle` computed：offset 非空 → `left/top` 取 offset 换算值（减去自身半宽 / 半高）；否则按 top/right/bottom/left 决定角标（左右决定 list 的 align 与展开方向）。
2. `toggle()`：切 visible → emit `update:visible` → `nextTick`/`flush post` 后逐个 item `animate`（stagger 40ms）。
3. 拖拽：`touchstart` 记录起点与当前 offset；`touchmove` 按 axis 计算新 offset 并 clamp（marginX/marginY）；`touchend` 若 magnet 非空则吸附最近边，emit `update:offset`。
4. 点击与拖拽区分：位移超过阈值（6px）视为拖拽，不触发 visible 切换。

## 疑问清单（已闭环）

### Q1 组件拆分形态（影响：文件结构 / 文档 / API 手感）

回答：方案 A —— `m-fab` + `m-fab-item` 两个组件，对齐 Sard。

### Q2 拖拽能力首版范围（影响：实现复杂度 / 多端验证成本）

回答：方案 A —— 完整实现 `draggable` / `axis` / `magnet` / `margin-x` / `margin-y` / `v-model:offset`。

### Q3 `offset` 坐标语义（影响：拖拽算法与演示页展示）

回答：方案 A —— `{ x, y }` 为入口按钮**中心点**相对视口左上角的坐标。

### Q4 默认图标与遮罩默认值（影响：视觉默认值）

回答：入口默认图标 `plus`（收起）→ `cross`（展开）；`overlayClosable` 默认 `false`。

### Q5 文档与演示归组（影响：侧栏与首页分组）

回答：归入「反馈组件」组（与 Loading / Overlay / Popup / Toast 同组）。

## 实施记录

### 落码

| 落点 | 文件 |
| --- | --- |
| 上下文与共享类型 | `packages/core/components/m-fab/fab.uts`（FabContext 类 + FabOffset / FabAxis / FabMagnet 类型 + 注册序 id 生成） |
| 容器组件 | `packages/core/components/m-fab/m-fab.uvue` |
| 子项组件 | `packages/core/components/m-fab-item/m-fab-item.uvue` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-fab-*` 20 个变量（全 `!default`） |
| 演示页 | `packages/playground/pages-sub/fab/fab.uvue`（10 实例穷举全部 props / 插槽 / 事件）+ `demo-components.uts` 反馈组件组登记 |
| 文档 | `packages/docs/src/components/fab.md` + `src/en/components/fab.md` + zh.ts / en.ts 侧栏 |
| 变更登记 | docs changelog（中英）+ 插件 changelog 0.5.0；版本号三处升 0.5.0（core / 插件 package.json、manifest versionName 0.5.0 / versionCode 050） |

### 实现期关键决策

1. **展开列表定位改为「视口整宽固定层 + 单侧 padding」**：首版用 `position: absolute; right: 0; bottom: 100%` 挂在根节点（宽高 = 入口按钮 48px）下，实测列表被包含块钳宽到 76px，圆形按钮被挤到 x=-12、名称气泡被裁——绝对 / 固定定位元素 auto 宽会被包含块宽度钳制。改为 `position: fixed; left: 0; right: 0` 取整宽，再用 inline `padding-right / padding-left` 把内容顶到入口边缘，名称气泡可自由向外伸展；实测右对齐实例 circle.right = 366（视口 390 - 24）无裁切。
2. **逐项过渡用 inline transition 而非 animate**：按注册序计算 `transition-delay`（入场顺序 / 收场逆序），配合首帧 `entered` 置位让挂载瞬间的初始态先绘制，过渡才有起点；列表在退场总时长播完后 `v-if` 卸载，快速连点不残留节点。
3. **拖拽判定与点击抑制**：位移平方 > 36（6px）判定为拖拽，touchend 置 `suppressClick`，入口 click 首帧消费后忽略，避免拖动误触发展开。
4. **测量三分支**：Web 同步 `getBoundingClientRect` / 小程序 `createSelectorQuery().in(instance.proxy)` 按 id 查询 / App `getBoundingClientRectAsync`（沿用 m-tabs 0.4.2 的多实例安全方案）。
5. **声明序**：`watch(ctx.collapseTick)` 依赖 `setVisible`，按 VDOM 产物规则（函数 val 声明前引用即 Unresolved）置于 `setVisible` 之后。

### 验证（Web 实测）

- 10 实例渲染、默认右下角与四角定位位置正确（首个实例实测 left=24 / top=56）
- 展开：3 项按序渐显（opacity 0→1、translateY 8→0、scale 0.8→1），点击子项后列表在退场时长后卸载
- 拖拽（axis=y）：x 保持 110、y 320→240（40px 位移不再生效于 x 轴）
- 拖拽 + magnet=x（axis=both）：x 吸附 318（= 390 - 24 - 48）、y 随拖动变化
- v-model:offset：拖动后页面回显 x 48 / y 60，与钳制结果一致
- overlay-closable：展开时渲染遮罩，点击遮罩收起且列表卸载
- 控制台零报错（仅 favicon 404 噪声），`pnpm sync:uni-modules:check` 通过，`pnpm build:docs` 通过

### 遗留

- App / 小程序端仅做产物级静态核对（条件编译分支），未做真机与开发者工具实测——拖拽手感与动画帧率建议发布前在真机复测

