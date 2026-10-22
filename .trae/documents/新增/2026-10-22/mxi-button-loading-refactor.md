# mxi-button 加载图标重构（复用 mxi-loading）实施方案

## 需求

mxi-button 内部的加载图标实现（circular 圆环 / clock 指针 / spinner 花瓣三形态 + 动画句柄管理 + 辐条系统）与 mxi-loading 组件高度重复。用 mxi-loading 替换按钮内加载图标部分，动画实现收敛到 mxi-loading 单处维护。

## 需求分析

- **重复面**：button 内 `buildTickKeyframes` / `startLoadingAnimation` / watch×2 / `__loading(-clock)(-hand)(-spinner)(-spoke)` 样式系（约 120 行样式 + 60 行逻辑）与 mxi-loading 几乎同构，且 spinner 修复（阶梯关键帧、1.2s 节奏、居中）需双处同步——已发生两轮双改
- **替换障碍（三个关键决策）**：
  1. mxi-loading 无 clock 类型 → clock 归属问题
  2. 按钮加载图标颜色跟随按钮变体（white / 主题色 / colored-plain），UTS 运行时拿不到 SCSS 变量值 → 颜色传递机制
  3. 按钮图标尺寸是主题变量 `$mxi-button-icon-size`（20px），mxi-loading 的 size prop 传值无法引用该变量 → 尺寸传递机制
- **影响面**：mxi-loading API 扩展（向后兼容）；mxi-button 对外 API（loading / loading-text / loading-type 三形态）不变，纯内部重构；演示页 loading 页补新能力示例

## 伪代码设计

### mxi-loading 增强

- `type` 扩展 `'circular' | 'spinner' | 'clock'`：clock = 静止轨道圆环 + 指针绕圆心旋转（800ms 两帧匀速，自 button 迁移）
- `color` 扩展语义色名：`default | primary | success | warning | danger | white` → 编译期变体类（`.mxi-loading__ring--primary` 等，绑定 `$mxi-color-*` 主题变量，用户覆盖仍生效）；CSS 色值（#hex 等）维持 inline inline 机制
- `size` 支持 `'100%'`：根节点与图标容器均 100%（`addUnit` 对非纯数字原样返回，天然支持），供外部定尺寸框场景（按钮）复用
- 模板 icon 插槽 fallback 变为 clock / circular / spinner 三互斥分支；新增 `handRef`，`startAnimation` 按类型选目标（clock → 指针旋转、容器静止）

### mxi-button 重构

- 模板：加载图标区替换为 `<view class="mxi-button__loading-box"><mxi-loading :type="props.loadingType" :color="loadingColor" size="100%" /></view>`
- `loadingColor` computed：`colored-plain → props.color`（色值 inline）、`white`、其余 → 语义色名（`props.type`）
- 删除：`loadingIcon` / `loadingHand` refs、`loadingAnimation` 句柄、`buildTickKeyframes`、`startLoadingAnimation`、watch×2、`loadingVariant` / `loadingClass` / `loadingHandClass` / `loadingStyle` / `loadingHandStyle` / `spokeCount` / `loadingSpokeClass` / `loadingSpokeStyle`、`__loading(-clock)(-hand)(-spinner)(-spoke)` 全部样式（动画生命周期由 mxi-loading 内部 onMounted / watch type 自管，v-if 挂载即启动）
- 间距：加载文案节点追加 `mxi-button__text--loading`（margin-left 6px），无文案时图标单独居中不受 margin 偏移
- 保留：`$mxi-button-icon-size` 主题变量（`__loading-box` 尺寸承载，主题覆盖契约不破坏）

## 疑问清单

Q1 clock 形态归属？（影响：mxi-loading 是否新增类型）
回答：clock 类型整体移除（用户拍板「不要此类型动画了，按钮只做消费者」），loading-type 收敛为 `circular | spinner`（与 Vant 对齐，breaking change）；mxi-loading 不引入 clock。

Q2 mxi-loading color 是否扩展语义色名？（影响：新 API；按钮主题色传递的唯一干净路径）
回答：支持（2026-10-22 用户确认）——`default | primary | success | warning | danger | white` 编译期绑定 `$mxi-color-*` 主题变量，用户覆盖 uni.scss 变量即生效；CSS 色值维持 inline 机制。

Q3 size 是否支持 '100%'？（影响：新 API；按钮尺寸主题变量的保留方案）
回答：支持（2026-10-22 用户确认）——根节点与图标容器均 100%，按钮以 `$mxi-button-icon-size` 定外框，主题覆盖契约不破坏。

## 实施记录

### 改动清单（2026-10-22）

1. **mxi-loading.uvue 增强**
   - `color` 语义色名机制：`semanticColors` 名单 + `colorVariant` computed，命中走变体类（`ringClass` / `spokeClass` 拼接），否则 CSS 色值走 inline（`ringStyle` / `spokeStyle` 按语义色分支跳过）
   - `size` 支持 `'100%'`：`rootStyle` 追加根节点 100% 宽高；容器侧 `addUnit('100%')` 原样返回天然支持
   - 样式新增 `.mxi-loading__ring--*` 与 `.mxi-loading__spoke--*` 各 6 个语义色扁平类（绑定 `$mxi-text-color` / `$mxi-color-primary` 等 / `$mxi-white`）
   - Props 注释同步更新
2. **mxi-button.uvue 重构**
   - 模板：加载图标区替换为 `mxi-button__loading-box` 外框 + `<mxi-loading :type :color size="100%" />`
   - `LoadingType` 收敛 `'circular' | 'spinner'`（clock 移除）；`loadingVariant` 改为 `loadingColor`（语义色名 / 色值直接传递）
   - 删除：`loadingIcon` / `loadingHand` refs、`loadingAnimation` 句柄、`buildTickKeyframes`、`startLoadingAnimation`、onMounted 动画启动、watch ×2、`loadingClass` / `loadingHandClass` / `loadingStyle` / `loadingHandStyle` / `spokeCount` / `loadingSpokeClass` / `loadingSpokeStyle`（动画生命周期由 mxi-loading 自管，v-if 挂载即启动）
   - 样式：删除 `__loading(-clock)(-hand)(-spinner)(-spoke)` 全系约 120 行，新增 `__loading-box`（`$mxi-button-icon-size` 尺寸承载）与 `__text--loading`（文案间距收在文字侧，无文案时图标不因 margin 偏离中心）
3. **演示页**：button 页删「时钟加载」示例；loading 页新增「语义色名」分区（primary / success / danger / white 蓝底反白示例）
4. **同步**：`pnpm sync:uni-modules` → `sync:uni-modules:check` 一致
5. **文档**：zh/en button.md（loading-type 两种形态 + 指向 Loading 组件链接）、zh/en loading.md（color 语义色 + size 100% 说明与 Props 表）、zh/en changelog（mxi-loading 条目扩充 + mxi-button 加载重构含 breaking 标注）

### 验证记录（2026-10-22）

- **浏览器实测**（HMR 生效）：
  - button 页：4 个加载按钮内均嵌套 mxi-loading（easycom 组件嵌套解析成功）；圆环图标 `mxi-loading__ring--white`、花瓣图标 `mxi-loading__spoke--white`（primary 实色按钮白图标变体生效）；图标容器 4 个各 1 条动画（花瓣 `duration=1200`、圆环 `duration=2000`）；「加载文字」文案含 `mxi-button__text--loading` 间距类；点击「点击模拟加载」动态挂载 mxi-loading 即启动动画、再点卸载恢复正常
  - loading 页：语义色分区 `ring--primary` / `spoke--danger` / `spoke--white` 变体类渲染正确，white 示例蓝底反白可见
  - 两页控制台无报错
- **文档站**：`pnpm build:docs` 通过（exit 0，死链检查含新增 /components/loading 交叉链接）

### 类型外置（2026-10-22 第二轮）

用户指出 `LoadingType` 在 mxi-button 与 mxi-loading 中重复定义。该类型已成跨组件共享，符合架构规则「跨组件共享的纯数据才拆同级 .uts 并用相对路径导入」的例外条款：

- 新增 `packages/core/components/mxi-loading/loading.uts`：`export type LoadingType = 'circular' | 'spinner'`（类型语义归属 loading 组件，button 为消费方）
- mxi-loading.uvue / mxi-button.uvue：删除各自内联定义，改为 `import { LoadingType } from './loading.uts'` / `'../mxi-loading/loading.uts'`
- `ButtonType` / `ButtonSize` 为 button 专属，维持内联（Props 类型须留在组件内供 defineProps 编译期解析）

验证：`sync:uni-modules:check` 一致；两演示页 HTTP 200（vite 模块解析无错）；浏览器实测两页渲染 / 嵌套 / 动画（4 容器各 1 条）/ 控制台全部正常。
