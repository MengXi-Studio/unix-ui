# m-popup 基础组件 实施方案

## 需求

用户要求实现 Vant Popup（https://vant-ui.github.io/vant/#/zh-CN/popup ）的对标组件 `m-popup`。API 对齐原则：props 命名、变体、事件语义以 Vant 为准；UTS / uvue 红线不支持的能力在双语文档中注明差异。m-popup 是 m-overlay 的首个上层消费者（overlay 任务文档定位「弹窗类组件基座」），后续 dialog / action-sheet 继续复用。

## 需求分析

Vant Popup API（官网文档已抓取）：

- Props：`v-model:show`（boolean, false）、`overlay`（boolean, true）、`position`（top/bottom/right/left/center，center）、`overlay-class`、`overlay-style`、`overlay-props`、`duration`（秒，0.3）、`z-index`（2000+ 动态）、`round`（false）、`destroy-on-close`（false）、`lock-scroll`（true）、`lazy-render`（true）、`close-on-popstate`（false）、`close-on-click-overlay`（true）、`closeable`（false）、`close-icon`（cross）、`close-icon-position`（top-right）、`before-close`、`icon-prefix`、`transition`、`transition-appear`、`teleport`、`safe-area-inset-top/bottom`
- Events：`click` / `click-overlay` / `click-close-icon` / `open` / `close` / `opened` / `closed`
- Slots：`default`、`overlay-content`
- CSS 变量：popup-background / round-radius(16px) / close-icon-size(22px) / close-icon-color / close-icon-margin(16px) / close-icon-z-index

UTS / uvue 红线下的取舍：

| Vant 能力 | m-popup 方案 |
| --- | --- |
| `v-model:show` | 提供（props.show + `emit('update:show')`，文档示范 `v-model:show`）——Vant 核心用法 |
| `position` 五方位 | 保留（`PopupPosition` 联合类型收窄） |
| `overlay` / `overlay-class` / `overlay-style` / `z-index` / `duration` | 保留，透传给内置 m-overlay（overlay=false 时经 customStyle 覆盖为透明背景） |
| `round` | 保留，圆角按 position 分侧（组合类实现） |
| `closeable` / `close-icon` / `close-icon-position` | 保留，图标由 m-icon（`name="cross"`）驱动 |
| `lazy-render` / `destroy-on-close` | 保留——popup 根节点是 m-overlay（DOM 常驻），面板为内部节点，v-if 切换安全（LESSONS #32 仅影响组件根节点） |
| `close-on-click-overlay` | 保留（默认 true；false 时遮罩点击只 emit 不关闭） |
| `open` / `close` / `opened` / `closed` | 保留——立即事件在 watch show 中触发；`opened` / `closed` 用 `setTimeout(duration × 1000)` 定时（uvue 无 transitionend，m-overlay 同款手法） |
| `safe-area-inset-top/bottom` | 保留（ucss 支持 `env()`，注入面板 padding） |
| `before-close` | 待疑问清单 Q2 |
| `lock-scroll` | 待疑问清单 Q1（m-overlay 已内置不可关闭的 Web 滚动锁） |
| `teleport` / `transition` / `transition-appear` / `close-on-popstate` / `overlay-props` / `icon-prefix` | 不做：teleport 无对应能力；transition 依赖 transition 组件/动画类名（ucss 无 @keyframes）；popstate 无组件级 API；overlay-props 对象展开繁琐（用 overlay-class/style 显式替代）；icon-prefix 本库 icon 体系不同。均双语文档注明 |
| `z-index` 默认值 | Vant 2000+ 动态递增 → 本库沿用 overlay 体系默认 1，文档注明差异 |

技术决策（依据 LESSONS_LEARNED 运行实测结论）：

1. 组合实现：popup 根节点即内置 `<m-overlay>`（复用遮罩、滚动锁、淡入淡出、hideTimer 可重入），面板 view 在其 slot 内按 position 绝对定位——popup 自身模板根是组件节点（m-overlay），自身不再有根节点 v-if 问题（LESSONS #32）；
2. 方位过渡：面板 `transform` 两态过渡（top/bottom 纵向平移、left/right 横向平移、center 缩放，形态待 Q3），`transition-property` 由 inline 注入 + opacity 联动；Web 端 transform 过渡标准支持，App 端 ucss transform 过渡为运行时实测项，异常则条件编译降级为 opacity-only 并在实施记录注明；
3. `opened` / `closed` 定时器可重入（快速开关防抖），Kotlin 局部函数先声明后使用（LESSONS #29）；
4. 可空 prop 一律实数/实串默认值，不引入 `| null`（LESSONS #24）；
5. `duration=0` 直切两态不走过渡时序（m-overlay 同款分支）；
6. `before-close` 若确认实现（Q2），关闭路径统一收敛到内部 `requestClose(action)` 做拦截判断（closeable / click-overlay / v-model 外部驱动三条路径共用）。

涉及文件（architecture.md 第 6 节唯一落点）：

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-popup/m-popup.uvue` | 组件源（类型与逻辑内联 SFC，easycom 零 import 消费 m-overlay / m-icon） |
| `packages/core/theme/vars.scss` | 新增 `$m-popup-*` 段（全 `!default`，不动既有变量） |
| `packages/playground/pages-sub/popup/popup.uvue` + `pages.json` + `router/router.config.uts` + `pages/index/demo-components.uts` | 演示页（穷举 position / round / closeable / overlay 开关 / 四显示事件 / duration / destroy-on-close）+ 注册 |
| `packages/docs/src/components/popup.md` + `src/en/components/popup.md` | 双语文档（含「与 Vant 的差异」节） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步 |
| `playground/uni_modules/m-ui-x/changelog.md` | 第四步回填（KEEP 文件） |
| `packages/docs/src/public/playground/` | 演示页构建产物入库（`pnpm run build:demo`） |

复用与依赖：m-overlay（内置遮罩基座）、m-icon（closeable 关闭图标）。不修改 m-overlay 源码（若 Q1 定案需要 overlay 增加滚动锁开关，另行最小扩展并在实施记录注明）。

验证链（workflow 第三步 DoD）：`pnpm sync:uni-modules` → `pnpm sync:uni-modules:check` → HBuilderX CLI `cli launch web` 编译 → 浏览器实测全部变体（position 五方位 / round / closeable 三位置 / overlay=false / 四显示事件日志 / duration=0 / destroy-on-close / 滚动锁）→ `pnpm build:docs` 死链检查 → `pnpm run build:demo` 产物入库 → 清理调试代码。

## 伪代码设计

Props（`type Props` + `withDefaults`，模式对齐 m-overlay）：

```
show: boolean = false                        // v-model:show
position: PopupPosition = 'center'           // 'top' | 'bottom' | 'left' | 'right' | 'center'
overlay: boolean = true                      // 是否显示遮罩背景（false 时透传透明背景样式）
overlayClass: string.ClassString = ''        // 遮罩自定义类名 → m-overlay customClass
overlayStyle: string = ''                    // 遮罩自定义样式 → m-overlay customStyle
zIndex: number = 1                           // → m-overlay zIndex
duration: number = 0.3                       // 秒，0 禁用动画（面板过渡与遮罩过渡共用）
round: boolean = false                       // 圆角（按 position 分侧）
closeable: boolean = false                   // 显示关闭图标
closeIcon: IconName = 'cross'                // 图标名（m-icon name）
closeIconPosition: PopupCloseIconPosition = 'top-right'  // 四角
closeOnClickOverlay: boolean = true          // 点击遮罩自动关闭
lazyRender: boolean = true                   // 首次显示才渲染面板（此后保留 DOM）
destroyOnClose: boolean = false              // 关闭后销毁面板内容
safeAreaInsetTop: boolean = false            // 顶部安全区 padding
safeAreaInsetBottom: boolean = false         // 底部安全区 padding
```

内部状态：

```
rendered: boolean = false      // lazyRender：首次 show 置 true，此后不回退
destroyed: boolean             // destroyOnClose：关闭动画结束后置 true（销毁 slot 内容）
enter / leave: boolean         // 面板过渡两态（enter 时面板在终位，否则在起始位）
timer: number = -1             // opened/closed 延时句柄（可重入）
```

模板结构（扁平类、无嵌套）：

```html
<m-overlay :show="show" :z-index="zIndex" :duration="duration"
           :custom-class="overlayClass" :custom-style="overlay ? '' : 'background-color: transparent;'"
           @click="onOverlayClick">
  <view v-if="panelMounted" :class="panelClass" :style="panelStyle"
        @transitionend→无（uvue 无此事件，opened/closed 走定时器）>
    <slot v-if="!destroyed"></slot>
    <text v-if="closeable" class="m-popup__close-icon ..." @click="onCloseIconClick">
      <m-icon :name="closeIcon" />
    </text>
  </view>
</m-overlay>
```

关键逻辑分支：

1. `watch(() => props.show, flush: 'post')`：
   - `true` → 清 timer；`rendered = true`；`enter = true`；emit('open')；duration > 0 时 `timer = setTimeout(() => emit('opened'), duration × 1000)`
   - `false` → `enter = false`；emit('close')；duration > 0 时 `timer = setTimeout(() => { destroyed = true; emit('closed') }, duration × 1000)`；destroyOnClose=false 时 destroyed 恒 false（slot 保留）
2. `onOverlayClick(e)`：emit('click-overlay', e)；`closeOnClickOverlay` 为 true 时 emit('update:show', false)
3. `onCloseIconClick`：emit('click-close-icon')；（Q2 定案是否经 before-close）emit('update:show', false)
4. `panelClass`：`m-popup` + `m-popup--<position>` + round 组合 `m-popup--round-<position>` + overlayClass 面板类
5. `panelStyle`：定位由类承载；inline 注入 `transition-duration`（duration 秒）；safe-area padding（env()）；（演示场景用户传面板 style 用 default slot 外层自行包裹或后续扩展 custom-style——Vant popup 无 custom-style prop，面板样式走 slot 内容自带）
6. 方位定位类（扁平书写，ucss 类选择器）：
   - `m-popup--center`：absolute 居中（`top/left: 50%` + transform 定位，过渡形态待 Q3）
   - `m-popup--top`：`top:0 left:0 right:0`；`m-popup--bottom`：`bottom:0 left:0 right:0`（宽度撑满）
   - `m-popup--left`：`left:0 top:0 bottom:0`；`m-popup--right`：`right:0 top:0 bottom:0`（高度撑满）
   - 过渡两态类 `m-popup--in / m-popup--out`（transform 起止值 + opacity）
7. close-icon 定位类四枚：`m-popup__close-icon--top-right / --top-left / --bottom-left / --bottom-right`（absolute + margin 变量）

样式（`<style lang="scss">`，扁平类）：

```scss
@import '../../theme/vars.scss';

.m-popup {
  position: absolute;
  background-color: $m-popup-background;
  transition-property: transform, opacity;   /* inline 注入 duration */
  transition-timing-function: ease;
}
/* 五方位定位类 + 起止两态类 + round 分侧圆角类 + close-icon 四角定位类，全部扁平 */
```

主题变量（vars.scss 新增段，全 `!default`）：

```scss
/* ========== Popup 弹出层 ========== */
$m-popup-background: #ffffff !default;
$m-popup-round-radius: 16px !default;
$m-popup-close-icon-size: 22px !default;
$m-popup-close-icon-color: #c8c9cc !default;
$m-popup-close-icon-margin: 16px !default;
$m-popup-close-icon-z-index: 1 !default;
```

演示页规划（`pages-sub/popup/popup.uvue`，一页穷举）：

1. 基础用法：`v-model:show` + 中央面板（padding 内容）
2. 弹出位置：top / bottom / left / right / center 五卡片（方位面板内示例内容）
3. 圆角弹窗：center / bottom round
4. 关闭图标：closeable + position 四角变体 + 自定义 closeIcon
5. 点击遮罩：close-on-click-overlay=false 对比（遮罩点击仅 emit 事件不关闭）
6. 监听显示事件：open / opened / close / closed 四日志（演示页 console）
7. 无遮罩弹层：overlay=false（透明背景浮层）
8. duration=0：无动画直切
9. destroy-on-close：开关对比（关闭后重开内容状态复位）

双语文档：对齐既有组件文档结构（Props / Events / Slots 表格 + 示例 + 主题变量表 + 差异说明：teleport / transition / close-on-popstate / overlay-props / lock-scroll 不做，z-index 默认值差异）。

## 疑问清单

### Q1 lock-scroll 的 v1 实现范围（影响：props 清单与 m-overlay 是否扩展）

背景：m-overlay 已内置 Web 端 body 滚动锁（Q1 定案：不提供 prop、不可关闭）。Vant Popup 提供 `lock-scroll`（默认 true）。

候选方案：

- 方案 A：m-popup 不提供 `lock-scroll` prop，行为与 m-overlay 一致（永远锁定），文档注明「与 Vant 的差异」
- 方案 B：给 m-overlay 增加 `lockScroll` prop（默认 true），popup 透传——overlay API 面扩展，需回归 overlay 已验收行为

答：A。

### Q2 before-close 是否在 v1 实现（影响：关闭路径复杂度）

背景：Vant 的 before-close 返回 false / Promise<false> 可阻止关闭，作用于所有关闭路径。UTS 函数类型 prop 写法可行（`(action: string) => boolean`），但 Promise 形态在 UTS 中受限。

候选方案：

- 方案 A：v1 实现 boolean 同步版（忽略 Promise 形态，文档注明）
- 方案 B：v1 不做，后置到 dialog / action-sheet 阶段（它们的「确认前校验」场景更刚需）

答：A。

### Q3 center 弹出的过渡形态（影响：动画实现与 App 端风险）

背景：Vant center 弹出为 opacity + scale 缩放淡入，四方位为 translate 平移。ucss 的 transform 过渡在 App 端原生渲染的支持度需要运行实测。

候选方案：

- 方案 A：对齐 Vant——center 用 scale(0.8→1) + opacity，四方位用 translate 平移；App 端若 transform 过渡异常，条件编译降级并在实施记录注明
- 方案 B：全形态统一 opacity-only（全端观感一致、零平台风险，但 center 与 Vant 观感有差异）

答：A。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- **组合架构落实**：根节点即内置 `<m-overlay>`（复用遮罩 / Web 滚动锁 / 淡入淡出 / hideTimer 可重入），面板 view 在其 slot 内按 position 绝对定位。因面板非组件根节点，`v-if` 切换安全（规避 LESSONS #32 的根节点 attrs 透传丢失），lazyRender 的初始不渲染得以保留（Vant Popup 本就有 lazy-render，此处与 overlay 不同）
- **面板点击冒泡隔离（组合实现的必需设计）**：Vant 中遮罩与弹层是兄弟节点，组合实现下面板位于遮罩内部——面板必须 `@click.stop`，否则点击面板会冒泡到遮罩根节点误触 click-overlay / 关闭；面板 `@click` 同时 emit popup 自身的 `click` 事件（对齐 Vant 语义）
- **requestClose(action) 收敛**：closeable / click-overlay 两条内部关闭路径经 before-close 拦截后统一 `emit('update:show', false)`；v-model 外部驱动 show=false 不经拦截（父级显式决策）
- **Q1 落实**：不提供 lock-scroll prop，Web 端滚动锁定随 m-overlay 内置（多实例计数），文档「与 Vant 的差异」注明
- **Q2 落实**：before-close 为 boolean 同步版（`((action: string) => boolean) | null`），Promise 形态忽略并文档注明
- **Q3 落实**：center 用 scale(0.8→1)+opacity、四方位纯 translate（±100%），Web 实测过渡正常；App 端未实测（无真机环境），如异常再条件编译降级（遗留 TODO 见下）
- **position×state 扁平类**：10 个 `m-popup--<position>-in/out` 类（center 带居中位移并入 transform 组）+ 5 个方位定位类 + 5 个 round 分侧圆角类，全部扁平书写
- **triggerPanelIn 双重 rAF**：面板可能随首开新挂载，先以 out 态完成一帧渲染再切 in（Web 双重 rAF / 非 Web nextTick）；watch(true) 中先 `enter.value = false` 兜底复位防极端时序残留
- **UTS 红线落地**：timer 哨兵值 -1、Kotlin 局部函数先声明后用（clearTimer/triggerPanelIn/requestClose 声明在使用点之前）、演示页 18 个实例全部静态字面量 prop（规避 ref:string 不可赋给联合类型的名义类型问题）

### 变更文件清单

| 类别 | 文件 |
| --- | --- |
| 组件源 | `packages/core/components/m-popup/m-popup.uvue`（新建） |
| 主题变量 | `packages/core/theme/vars.scss`（追加 `$m-popup-*` 段 6 变量，全 `!default`） |
| 同步产物 | `pnpm sync:uni-modules`（uni_modules/m-ui-x 自动生成） |
| 演示页 | `packages/playground/pages-sub/popup/popup.uvue`（新建，9 节 18 实例）+ `pages.json` / `router/router.config.uts` / `pages/index/demo-components.uts` 三处注册 |
| 文档 | `packages/docs/src/components/popup.md` + `src/en/components/popup.md`（新建双语）+ `.vitepress/config/zh.ts` / `en.ts` 侧栏 |
| 更新日志 | `packages/docs/src/changelog.md` / `src/en/changelog.md`（m-popup 条目 + 补登 m-overlay 漏项）/ `playground/uni_modules/m-ui-x/changelog.md`（KEEP） |
| 经验 | `.claude/rules/LESSONS_LEARNED.md` #34 / #35 |

### 验证方式与结果

1. `pnpm sync:uni-modules:check` → 「playground 插件与 core 一致」
2. dev server（5174，HBuilderX 运行中）+ Playwright（playwright-core + 系统 Chrome，CDP 真实输入点击，CSS 选择器定位绕开 a11y 快照限制）九场景矩阵实测：**61 项断言 PASS / 0 FAIL**
   - T1 基础用法：center-in + opacity 1 + bodyOv hidden；面板点击 `.stop` 隔离（未触发 click-overlay）；关闭后 overlay display none + bodyOv 还原 baseline（`hidden auto` 为页面自身样式）
   - T2 四方位：in/out class 切换 + in 态 transform 归位（identity）+ 各方位遮罩坐标点击关闭
   - T3 圆角：round-center 四角 16px、round-bottom 上圆下方（`16px 16px 0px 0px`）
   - T4 关闭图标：四角 + 自定义 close-icon=fail 存在；color rgb(200,201,204) / font-size 22px；点图标关闭
   - T5 禁遮罩关闭：遮罩点击后仍 center-in + click-overlay 日志 + 面板按钮可关
   - T6 事件：open → opened → close → closed 日志序列完整
   - T7 无遮罩：overlay 背景 rgba(0,0,0,0)
   - T8 duration=0：立即两态直切
   - T9 destroy-on-close：关闭后 slot 连同面板内组件实例一起从 DOM 移除、重开内容重建且组件内部状态复位（计数归零）；默认保留：关闭后 slot 内容保留、状态保留
   - T10 收尾：bodyOv 还原、全程无 pageerror / console error
3. `pnpm build:docs` → 通过（VitePress 死链检查，4.2s）
4. `pnpm run build:demo` → 编译成功（50 文件）
5. `git diff manifest.json` → 无遗留改动；组件源无调试代码残留（演示页 POPUP-EVENT 为业务演示日志）

### 排查插曲（已定性为脚本缺陷，非组件缺陷）

浏览器自动化 agent（browser_use）四轮无法触达按钮（uni-app x 页面 a11y 快照仅 3 节点、browser_click 强制要求 ref、无坐标点击能力），切换 playwright-core + 系统 Chrome 后一次通过。初期 T3/T4 两项 FAIL 经 dump elementFromPoint 定性为**验证脚本探针未刷新**（check 引用点击前的旧快照），修正断言时序后全绿——教训记入 LESSONS #34 / #35。

### 用户验证反馈修正（destroy-on-close 演示语义）

用户人工验证发现「销毁后重建」演示效果不符：按钮文案为「重开计数归零」，但重开后仍显示关闭前的数。根因是演示素材设计缺陷——计数 ref 定义在父页面 script setup，slot 销毁只卸载面板内容，不会重置父页面 ref（组件行为本身正确，T9 早期探针已证实 slot 移除/重建）。修正：新增演示辅助组件 `packages/playground/components/demo-popup-counter/demo-popup-counter.uvue`（计数状态在组件内部），destroy 面板 slot 销毁时组件实例随之卸载、重开计数归零；keep 面板实例常驻、计数保留。重跑矩阵 61 PASS / 0 FAIL（T9 七项断言含「重开计数归零」全过）。经验：destroy-on-close 类演示的状态必须放在 slot 内部（子组件实例状态），放父页面 ref 无法体现销毁语义。

### 遗留 TODO

- App 端 transform 过渡实测：Q3 的 scale/translate 过渡仅在 Web 端实测，App 端（Kotlin/Swift 原生渲染）待真机验证；如异常，在 m-popup 样式段按条件编译降级为 opacity-only（位置：`packages/core/components/m-popup/m-popup.uvue` style 段）
- App 端 `env(safe-area-inset-*)` 生效性验证（safe-area-inset-top / bottom prop 的实际表现），待真机
