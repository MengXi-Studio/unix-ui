# mxi-button loadingType 加载图标类型 实施方案

## 需求

新增 `loadingType` props：加载图标类型，默认 `'circular'`（即现有圆环样式，向后兼容）。
取值方案演进：初版按用户指令实现 `'clock' | 'circular'`；后用户对照 Vant 官方（`circular | spinner`）提出对齐诉求，经确认采用**超集方案** `'circular | clock | spinner'`（spinner 对齐 Vant 花瓣形态，clock 保留为差异化扩展）。

## 需求分析

- 组件：`packages/core/components/mxi-button/mxi-button.uvue`（Props 新增 loadingType；加载图标结构拆分；动画目标按类型切换）
- 主题变量：无新增（指针尺寸用百分比随图标尺寸缩放，颜色复用现有 6 色变体 + 自定义色 inline 机制）
- 演示页：`pages-sub/button/button.uvue` 加载状态区补 clock / circular 对比示例
- 文档：zh/en `components/button.md` Props 表 + 加载状态示例
- 影响面：默认值 circular 保持现状渲染，无 breaking change

## 伪代码设计

- 类型：`type LoadingType = 'clock' | 'circular'`；props 默认 `'circular'`
- 模板：加载图标根 view（圆环）内嵌 clock 专属指针子 view（`v-if="props.loadingType == 'clock'"`）
- 类名策略（扁平 BEM，ucss 仅单类选择器，不用复合选择器）：
  - 颜色变体收敛为 `loadingVariant` computed（white / default / primary / success / warning / danger / colored-plain，逻辑与现有 loadingClass 一致）
  - circular 圆环沿用现有 `mxi-button__loading--<variant>`（含顶部高亮）
  - clock 圆环新类 `mxi-button__loading-clock--<variant>`（均匀半透明轨道，无顶部高亮——静止圆环带高亮会很怪）
  - 指针 `mxi-button__loading-hand`：absolute 定位，`width: 10%; height: 45%; top: 5%; left: 45%`（圆心到内缘，随图标尺寸等比缩放），`transform-origin: 50% 100%`（绕圆心转）
  - colored-plain 变体走 inline style（与现有模式一致）
- 动画：`startLoadingAnimation` 按类型选目标元素（circular → 圆环整体旋转；clock → 指针旋转，圆环静止）；保存 `Animation` 句柄，切换 loadingType 时先 `cancel()` 旧动画（否则 circular 圆环会永续旋转）；watch loadingType 在 loading 中切换时重启动画

## 疑问清单

Q1 clock 的视觉形态？（影响：指针结构与动画方式）
回答：静止圆环 + 旋转指针（Quasar clock 风格，2026-10-22 用户确认）。

Q2 取值集合是否对齐 Vant（`circular | spinner`）？（影响：是否移除 clock / 新增 spinner）
回答：采用超集方案 `circular | clock | spinner`，spinner 对齐 Vant 花瓣形态、clock 作为差异化扩展保留（2026-10-22 用户确认）。

## 实施记录

### 改动清单（2026-10-22）

1. **组件源** `packages/core/components/mxi-button/mxi-button.uvue`
   - 类型：`type LoadingType = 'circular' | 'clock' | 'spinner'`，Props 新增 `loadingType`，默认 `'circular'`
   - 模板：加载图标根 view 内嵌 clock 指针子 view（`v-if="props.loadingType == 'clock'"`）+ spinner 12 条辐条（`v-for="i in spokeCount"`，非 spinner 型 spokeCount 为 0 不产生节点）
   - 逻辑：`loadingVariant` computed 收敛颜色变体（white / default / primary / success / warning / danger / colored-plain）；`startLoadingAnimation` 按类型选目标元素（circular / spinner → 容器整体旋转，clock → 指针旋转、圆环静止），`Animation` 句柄先 `cancel()` 旧动画再启动；watch `loading` 与 `loadingType`（`flush: 'post'`）在加载中重启动画；`loadingSpokeStyle(i)` 按序号每 30° 分布辐条，colored-plain 时颜色走 inline
   - 样式：新增 `.mxi-button__loading-clock--*` 6 色变体（均匀半透明轨道、无顶部高亮）与 `.mxi-button__loading-hand(-*)` 指针类（百分比定位随图标等比缩放，`transform-origin: 50% 100%` 绕圆心转）；新增 `.mxi-button__loading-spinner`（清零基础类边框、无圆环轨道）与 `.mxi-button__loading-spoke(-*)` 辐条类（`width:10%; height:25%; transform-origin: 50% 200%`——自身 200% 高度恰为容器中心）
2. **演示页** `packages/playground/pages-sub/button/button.uvue`：加载状态区新增「时钟加载 / 圆环加载 / 花瓣加载」对比示例
3. **同步**：`pnpm sync:uni-modules` → `sync:uni-modules:check` 一致
4. **文档**：zh/en `components/button.md` 加载状态小节补 `loading-type` 说明与示例 + Props 表新增行；changelog「未发布」段追加条目

### 验证记录

- **浏览器实测**（127.0.0.1:5174/pages-sub/button/button，HMR 生效）：
  - clock：指针元素存在（`mxi-button__loading-hand mxi-button__loading-hand--white`），动画 `playState: running`、`duration: 800`，`transform-origin` 生效
  - spinner：12 条辐条渲染（inline transform 0°/30°/60°… 每 30° 均匀分布，computed transform-origin `1px 10px` 恰为容器中心），容器动画 `running` / `duration: 800`
  - circular：加载中 / 加载文字 / 圆环加载 3 个圆环动画均 running，默认渲染无回归
  - 截图：clock 图标可见指针形态、spinner 为 12 条花瓣辐条（与 Vant 视觉一致）、circular 为纯圆环
  - 控制台：无错误（仅 uni-app-x 开发模式 preload info）
- **文档站**：`pnpm build:docs` 死链检查通过（两轮均 exit 0）

### 踩坑记录

- `getTiming().iterations` 为 Infinity 时 JSON 序列化结果是 null（JSON 不支持 Infinity），并非动画未设置；`playState: running` 才是有效判据
- browser_evaluate 大型组合脚本（多 IIFE 嵌套）偶发返回 undefined，拆成小步单项求值稳定；错误未显式抛出时易误判为「无数据」

### spinner 对齐修复（2026-10-22 第二轮）

用户反馈 spinner 与 Vant 有视觉差异。拉取 Vant 官方源码（vant-ui/vant `src/loading/Loading.tsx` + `index.less`）比对，差异三点：

| 维度 | Vant 真实实现 | 本库初版 |
| --- | --- | --- |
| 容器旋转 | `animation-timing-function: steps(12)`，0.8s 离散跳 12 格（滴答式） | linear 匀速连续旋转 |
| 辐条亮度 | `opacity: 1 - (0.75/12) × (i-1)`，1.0 → 0.3125 递减（彗尾拖影） | 全部同亮度 |
| 辐条几何 | 固定 `2px` 宽、`border-radius: 40%`、水平居中圆心正上方 | 10% 宽、2px 圆角、left 45% |

改动（均在 `mxi-button.uvue`）：
- `startLoadingAnimation`：spinner 型 easing 改 `'steps(12)'`（circular / clock 保持 linear）
- `loadingSpokeStyle(i)`：追加 inline `opacity: 1 - 0.0625 × (i-1)`
- `.mxi-button__loading-spoke`：`width: 2px; left: 50%; margin-left: -1px; border-radius: 40%`（height 25% 与 `transform-origin: 50% 200%` 不变）
- 相关注释同步更新

验证记录（2026-10-22）：
- dev server 产物确认：编译后模块含 `steps(12)` / opacity 公式 / `margin-left: -1px`（HMR 生效，Vite 转换无错）
- 浏览器实测（5174/pages-sub/button/button）：`getAnimations()[0].effect.getTiming()` 返回 `{easing: 'steps(12)', duration: 800, iterations: Infinity}`；辐条 12 条、inline transform/opacity 逐条正确；截图可见彗尾拖影；控制台无报错
- `pnpm sync:uni-modules` → `sync:uni-modules:check` 一致
- 文档无需改动（「花瓣旋转」描述仍准确）
