# m-overlay 基础组件 实施方案

## 需求

用户要求按项目规则实现 Vant Overlay（https://vant-ui.github.io/vant/#/zh-CN/overlay ）的对标组件 `m-overlay`。API 对齐原则：props 命名、变体、事件语义以 Vant 为准；UTS / uvue 红线不支持的能力在双语文档中注明差异。m-overlay 定位为弹层类组件基座，后续 m-popup / dialog / action-sheet 依赖它。

## 需求分析

Vant Overlay API（官网文档已抓取）：

- Props：`show`（boolean, false）、`z-index`（number|string, 1）、`duration`（number|string, 0.3 秒，0 禁用动画）、`class-name`、`custom-style`、`lock-scroll`（boolean, true）、`lazy-render`（boolean, true）、`teleport`
- Events：`click`
- Slots：`default`
- CSS 变量：`--van-overlay-z-index: 1`、`--van-overlay-background: rgba(0, 0, 0, 0.7)`

UTS / uvue 红线下的取舍：

| Vant 能力 | m-overlay 方案 |
| --- | --- |
| `show`、`z-index`、`duration`、`custom-style`、`lazy-render`、`click`、`default` 插槽 | 保留 |
| `lock-scroll` | 待疑问清单 Q1 确认范围 |
| `class-name` | 改为 `custom-class`（本库 m-icon / m-loading 已确立的惯例） |
| `z-index` / `duration` 的 string 类型 | 收窄为 number（UTS 强类型，不做隐式转换） |
| `teleport` | 不做（Web/Vue 专属，uni-app x 无对应能力，文档注明） |

技术决策（依据 LESSONS_LEARNED 运行实测结论）：

1. 淡入淡出为 opacity 单属性两态过渡 → 走 ucss `transition-property: opacity`（LESSONS #16），不使用 UniElement.animate；
2. uvue 无 transitionend 事件 → 关闭时 `setTimeout(duration * 1000)` 后解除挂载，timer 可重入（快速连续开关防抖）；
3. `duration` prop 为秒（对齐 Vant），内部 ×1000 转 ms；`transition-duration` 由 inline style 注入实现动态时长；
4. 定位 `position: fixed` 全屏（Web 端原生支持；App 端编译运行时验证，异常则降级为页面根 absolute 方案并在实施记录注明）；
5. 可空 prop 会触发 TS2769 编译警告噪音（LESSONS #24）→ `zIndex` / `duration` 全部实数默认值，不引入 `| null`；
6. Kotlin 局部函数顺序红线（LESSONS #29）→ helper 函数一律先声明后使用；
7. `lazyRender` 默认 true：首次 `show=true` 才挂载节点，关闭后保留 DOM 不销毁（对齐 Vant）；初始渲染即 `show=true` 时直接可见、无过渡（对齐 Vant 无 appear 过渡）；
8. 淡入时序：先以 `opacity: 0` 挂载，`nextTick` 后置 1 触发过渡（首帧即终值不会产生过渡）。

涉及文件（architecture.md 第 6 节唯一落点）：

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-overlay/m-overlay.uvue` | 组件源（类型与逻辑内联 SFC） |
| `packages/core/theme/vars.scss` | 新增 `$m-overlay-z-index`、`$m-overlay-background`（全 `!default`，不动既有变量） |
| `packages/playground/pages-sub/overlay/overlay.uvue` + `pages.json` | 演示页（穷举 props / 变体 / 事件）+ 注册 |
| `packages/docs/src/components/overlay.md` + `src/en/components/overlay.md` | 双语文档（结构对齐既有组件文档） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏导航两侧同步 |
| `playground/uni_modules/m-ui-x/changelog.md` | 第四步回填（KEEP 文件） |
| `packages/docs/src/public/playground/` | 演示页构建产物入库（LESSONS #25，`pnpm run build:demo`） |

验证链（workflow 第三步 DoD）：`pnpm sync:uni-modules:check` → HBuilderX CLI `cli launch web` 编译 → 浏览器真实点击实测全部变体（LESSONS #12：合成事件不触发组件事件）→ `pnpm build:docs` 死链检查 → 清理调试代码。

## 伪代码设计

Props（`type Props` + `withDefaults`，模式对齐 m-loading）：

```
show: boolean = false          // 是否展示遮罩层
zIndex: number = 1             // z-index 层级（编译期默认 $m-overlay-z-index，inline 覆盖）
duration: number = 0.3         // 动画时长（秒），0 禁用动画
customClass: string.ClassString = ''
customStyle: string = ''
lockScroll: boolean = true     // 范围待 Q1
lazyRender: boolean = true     // 首次显示才渲染节点
```

内部状态：

```
mounted: boolean = false       // lazyRender 挂载标记（首次 show=true 置 true，此后不回退）
visible: boolean = false       // 根节点 v-show（关闭过渡期间保持 true）
opacity: number = 0            // inline 过渡态（0 隐藏 / 1 显示）
hideTimer: number | null       // 关闭延时句柄（可重入）
```

模板结构（扁平类、无嵌套）：

```html
<view v-if="mounted" v-show="visible" :class="rootClass" :style="rootStyle"
      @click="onClick">
  <slot></slot>
</view>
```

关键逻辑分支：

1. `watch(() => props.show, flush: 'post')`：
   - `true` → 清 hideTimer；`mounted = true`；`visible = true`；nextTick 后 `opacity = 1`（触发 transition 淡入）
   - `false` → `opacity = 0`（淡出）→ `hideTimer = setTimeout(() => visible = false, duration * 1000)`
2. 初始 `show = true`（onMounted）：直接 `mounted / visible / opacity = 1`，无过渡
3. `duration == 0`：跳过 nextTick 时序与延时，直接同步切换 `opacity` / `visible`
4. `onClick`：`emit('click')`（对齐 Vant：遮罩不自动关闭，由调用方在 click 中置 show=false）
5. `rootStyle`：`opacity` + `z-index` + `transition-duration` + `customStyle` 拼接（customStyle 补分号后拼接，m-loading 同款）
6. `rootClass`：`m-overlay` + `customClass` 非空拼接

样式（`<style lang="scss">`，扁平类）：

```scss
@import '../../theme/vars.scss';

.m-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: $m-overlay-background;
  z-index: $m-overlay-z-index;      /* zIndex prop 非 1 时 inline 覆盖 */
  transition-property: opacity;
  transition-timing-function: ease;
}
```

主题变量（vars.scss 新增段，全 `!default`）：

```scss
/* ========== Overlay 遮罩层 ========== */
$m-overlay-z-index: 1 !default;
$m-overlay-background: rgba(0, 0, 0, 0.7) !default;
```

演示页规划（`pages-sub/overlay/overlay.uvue`，一页穷举）：

1. 基础用法：按钮开遮罩，遮罩 `@click="show = false"` 关闭（对齐 Vant 基础用法）
2. 嵌入内容：slot + flex 居中白色块，块内点击 `stopPropagation` 隔离冒泡（LESSONS #18 toast 单例验证手法）
3. 自定义 z-index（与浅色遮罩 custom-style 组合演示层级）
4. duration 对比（0.3s vs 0 禁用动画）
5. lazy-render / lock-scroll 差异说明条目（文档面）

双语文档：对齐既有组件文档结构（Props / Events / Slots 表格 + 示例 + 主题变量表 + 差异说明：teleport 不支持、duration 收窄为秒 number）。

## 疑问清单

### Q1 lock-scroll 的 v1 实现范围（影响：props 清单与交互语义）

背景：Vant 的 lock-scroll 默认 true，Web 端通过锁定 body 滚动实现。uni-app x 中全屏 fixed 遮罩的触摸事件天然落在遮罩层上（App 端背景不会被触摸滚动）；差异主要在 Web 端滚轮滚动穿透（遮罩存在时页面仍可被滚轮滚动）。

候选方案：

- 方案 A（推荐）：保留 `lock-scroll` prop（默认 true），v1 遮罩根节点 `@touchmove.stop` 拦截触摸穿透；Web 端滚轮穿透锁定（操作 body overflow）不做，双语文档注明该差异
- 方案 B：v1 不提供 `lock-scroll`，prop 与语义整体后置到 m-popup 阶段一并设计

回答：不提供 `lock-scroll` prop，但是需要在web端锁定body滚动。

## 实施记录

（2026-10-27 实现完成）

### 与伪代码设计的差异

| 项 | 伪代码设计 | 落地形态 | 原因 |
| --- | --- | --- | --- |
| `lazyRender` prop | 保留（默认 true，根节点 `v-if="mounted"` + `v-show="visible"` 双层） | **删除**；根节点仅 `v-show="visible"`，DOM 常驻 | ① 查证 Vant Overlay 本无 lazy-render（属 popup 的 prop），系自造 API；② Web 端根节点 v-if 从注释节点切换创建后 attrs 透传的 click **永久丢失**（运行实测定位，见 LESSONS #32），DOM 常驻是事件可靠的前提 |
| `lockScroll` prop | 方案 A/B 待 Q1 | 不提供 prop（Q1 结论）；Web 端 body 滚动锁落在同级 `overlay-lock.uts`（模块级计数，多实例堆叠全关才还原 `body.style.overflow`） | Q1 用户作答 |
| 淡入时序 | `nextTick` 后置 1 | **Web 端双重 rAF**（`#ifdef WEB`），非 Web 端 `nextTick` | Web 端 nextTick 后同帧仍在首帧绘制前，无样式差值不产生过渡；双重 rAF 与 Vue Transition 同款时序，实测过渡中间值（2s 场景 opacity=0.998 过渡中）证实有效 |
| hideTimer | number \| null | `let hideTimer = -1`（UTS 无 undefined，可空一律哨兵值） | LESSONS 红线 |
| 初始 show=true | onMounted 直接三态置真 | 一致（额外持锁 `lockBodyScroll`） | 初始显示也要锁滚动 |

### 变更文件清单

- 新增 `packages/core/components/m-overlay/m-overlay.uvue`（组件源，类型与逻辑内联 SFC；Props：show / zIndex / duration / customClass / customStyle；Event：click；Slot：default）
- 新增 `packages/core/components/m-overlay/overlay-lock.uts`（Web 端 body 滚动锁：模块级 lockCount 计数，首个实例置 `overflow: hidden`、最后一个释放还原 `''`；非 Web 端空实现，条件编译隔离）
- `packages/core/theme/vars.scss`：新增 `$m-overlay-z-index: 1 !default`、`$m-overlay-background: rgba(0, 0, 0, 0.7) !default`
- 同步产物：`pnpm sync:uni-modules` → `playground/uni_modules/m-ui-x/`
- 新增 `packages/playground/pages-sub/overlay/overlay.uvue` + `pages.json` 注册 + `router/router.config.uts` + `pages/index/demo-components.uts`（基础组件分组）
- 新增 `packages/docs/src/components/overlay.md` + `src/en/components/overlay.md`（双语，含「与 Vant 的差异」节：teleport 不支持、lock-scroll 由内置滚动锁替代、duration 收窄秒 number）
- `packages/docs/.vitepress/config/zh.ts` + `en.ts`：侧栏基础组件 Layout 后插入 Overlay

### 验证方式与结果（DoD）

1. `pnpm sync:uni-modules:check` 一致性通过；
2. HBuilderX CLI `cli launch web` 编译运行成功（dev server :5174）；
3. 浏览器实测六场景（组件实例状态 `setupState` + computed 双向断言，全程无 error 日志）：
   - 基础用法：点击打开 opacity 0→1 淡入、点击遮罩关闭 opacity→0 / display=none；
   - 嵌入内容：卡片内点击不关闭（`@click.stop` 冒泡隔离）、卡片内「关闭」文字可关闭；
   - 自定义 z-index：computed `z-index: 10`、`rgba(255, 255, 255, 0.6)` 浅色遮罩、可关闭；
   - duration=2：打开立即读 opacity=0.998（过渡中）→ 2.2s 后 =1；关闭立即读过渡中 → 2.2s 后 display=none；
   - duration=0：立即 opacity=1、立即关闭 display=none（无动画）；
   - Web 端滚动锁：打开 `body.style.overflow='hidden'` → 关闭还原 `''`，重复开关节奏稳定（锁计数配对释放）；
4. `pnpm build:docs` 通过（VitePress 死链检查）；
5. `pnpm run build:demo` 产物入库 `packages/docs/src/public/playground/`（46 文件）；`git diff packages/playground/manifest.json` 确认 CLI 未改写；
6. 全部临时调试代码（DEBUG 日志 / 临时 lazy-render 绑定）已清理；调试期踩坑与判别法记入 `.claude/rules/LESSONS_LEARNED.md`（#32 v-if 根节点事件丢失、#33 浏览器自动化验收规约）。

### 遗留 TODO

- 无。App 端（Android/iOS）真机表现待后续云打包批次随其他组件一并回归（fixed 定位与 nextTick 时序为全端通用写法，风险低）。
