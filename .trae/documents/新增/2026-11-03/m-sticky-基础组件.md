# m-sticky 粘性布局组件 实施方案

## 需求

用户要求分析 Vant Sticky（`https://vant-ui.github.io/vant/#/zh-CN/sticky`）与 Sard Sticky（`https://sard.wzt.zone/components/sticky`），据此实现 unix-ui 的 `m-sticky` 组件。

目标行为：内容在可视范围内正常参与文档流；滚出可视范围时按 `offset-top` / `offset-bottom` 吸附在顶部或底部；可被指定容器约束（不超出容器范围）；吸附状态变化时可通知业务。

参考实现要点：

| 维度 | Vant Sticky | Sard Sticky |
| --- | --- | --- |
| Props | `position`（top/bottom）、`offset-top`、`offset-bottom`（px/vw/vh/rem）、`z-index`（默认 99）、`container`（DOM 节点） | `margin-top`、`margin-bottom`（px，可同时生效）、`z-index` |
| Events | `change(isFixed)`、`scroll({ scrollTop, isFixed })` | 无 |
| 容器约束 | `container` 传 Element，超出容器底部时用 `transform: translate3d` 顶住 | 配套 `StickyBox` 组件（provide/inject 传容器引用），容器内改用 `absolute` 定位 |
| 定位机制 | 外层占位节点 + 内层 `position: fixed`，监听最近滚动父级 | 外层占位 + 内层 `fixed`/`absolute`，靠 IntersectionObserver + 页面滚动触发测量 |
| 尺寸 | 固定时回填测量到的宽高 | 外层宽高取内层 `fit-content` 实测值 |
| 单位 | 支持 px/vw/vh/rem | 仅 px |

## 需求分析

| 层 | 落点 | 内容 |
| --- | --- | --- |
| core 组件 | `packages/core/components/m-sticky/m-sticky.uvue` | 粘性布局组件（可选 `m-sticky-box`，见 Q2） |
| 主题变量 | `packages/core/theme/vars.scss` | 新增 `$m-sticky-z-index: 99 !default`（对齐 Vant）；如实现 `m-sticky-box` 不新增变量 |
| 演示页 | `packages/playground/pages-sub/sticky/sticky.uvue` + `pages.json` / `router.config.uts` / `demo-components.uts` | 一页穷举吸顶、吸底、容器约束、动态内容 |
| 使用文档 | `packages/docs/src/components/sticky.md`、`src/en/components/sticky.md` | 双语文档 |
| 侧栏导航 | `packages/docs/.vitepress/config/zh.ts`、`en.ts` | 归入「布局组件」，按英文字母序排在 `status-bar` 之后（`status` < `sticky`） |
| changelog | 文档站 zh / en、`playground/uni_modules/m-ui-x/changelog.md` | 0.3.0 新条目（0.3.0 尚未发布） |

### uni-app x 技术约束（影响方案选型）

1. uvue **组件不支持页面生命周期与页面 API**（`onLoad` / `onShow` / `onPageScroll` 等），因此组件无法自行监听「页面滚动」；只能监听自己内部的滚动容器。
2. App（VDOM）页面默认不可滚动，滚动发生在页面内显式 `scroll-view` 中；组件同样拿不到该 `scroll-view` 的滚动事件，除非由页面显式传入 `scrollTop`。
3. `position` 语法支持 `static | relative | absolute | sticky | fixed`，但官方文档中 `sticky` 的 App 兼容性为空、hello 示例的 position 枚举也不含 `sticky`；官方吸顶推荐是「在滚动容器里监听滚动并设置固定 top」或 `list-view + sticky-header`（仅限列表场景）。
4. `fixed` 定位全端可用（Android 3.9 / iOS 4.11 起）；`UniElement.getBoundingClientRectAsync()`、`uni.createSelectorQuery().boundingClientRect()` 可用于测量，但均为异步，且无 `IntersectionObserver` / `ResizeObserver`。
5. 跨层传递 `UniElement` 作为 prop 不可靠；容器引用更适合用配套组件 + `provide/inject`。
6. uvue 外部 `:style` 不透传到组件根节点（LESSONS #58），尺寸/定位干预必须走组件显式 prop 或 `custom-style`。
7. 视觉单位只用 px（无 rpx / rem / vw 的等价链路），故 `offset-*` 统一为 number（px）。

## 伪代码设计

### 共同部分（三方案一致）

- 通用 props：`customClass?: string.ClassString`、`customStyle?: string`（本库样式直达约定）。
- 主题变量：`$m-sticky-z-index: 99 !default`；组件 style 顶层无条件 `@import '../../theme/vars.scss'`。
- 样式扁平、class 选择器、flex 布局；`z-index` 与 `top/bottom` 走内联 `:style`。
- 演示页分区：基础吸顶（offset 0 / 50）、吸底、容器约束、动态插入内容后重新测量。
- 文档注明与 Vant 的差异（无 vw/vh/rem、无 Element 类型 `container`）。

### 方案 A：纯 CSS sticky（Web 优先，最小实现）

```
<view :class="rootClass" :style="rootStyle">
  <slot />
</view>

rootStyle = customStyle + `position: sticky;`
          + (`top: offsetTop px;` 或 `bottom: offsetBottom px;`)
          + `z-index: zIndex;`
```

- 原生 sticky 自动受最近滚动祖先（页面 `scroll-view`）与父容器边界约束，无需 JS。
- 优点：代码量最小、无测量、Web 端性能最好。
- 风险：App 端 `sticky` 兼容性未证实，可能退化为普通流；无法实现 `change` / `scroll` 事件（拿不到滚动位置）。
- 已知坑：uvue Web 的 `scroll-view` 内使用 sticky，可能需要额外内容根节点（DCloud 问答提到「scroll-view 内加无样式根 view」），需实测确认。

### 方案 B：受控 `scroll-top`（跨端一致，推荐）

```
<view class="m-sticky" :style="placeholderStyle">
  <view :class="innerClass" :style="innerStyle">
    <slot />
  </view>
</view>
```

Props：

| prop | 说明 |
| --- | --- |
| `scrollTop: number` | 外层滚动容器的实时滚动距离（默认 0），页面需在 `@scroll` / `onPageScroll` 中回传 |
| `offsetTop: number` | 吸顶距离（默认 0，px） |
| `offsetBottom: number` | 吸底距离（默认 0，px） |
| `position?: 'top' | 'bottom'` | 吸附方向（Q3 决定最终形态） |
| `zIndex?: number` | 吸附层级（默认 99） |
| `customClass` / `customStyle` | 样式直达 |

逻辑（伪代码）：

```
onMounted / nextTick:
  selfRect = selfEl.getBoundingClientRectAsync()
  selfPageTop = selfRect.top + props.scrollTop
  selfPageBottom = selfPageTop + selfRect.height
  width = selfRect.width; height = selfRect.height
  if 容器存在: containerPageTop / containerPageBottom = 同理记录

watch(scrollTop) -> update():
  if position == 'top':
    fixed = (selfPageTop - scrollTop) < offsetTop
    over = containerPageBottom - scrollTop - height - offsetTop // 容器下边界溢出量
    translateY = over < 0 ? over : 0
  else:
    fixed = (selfPageBottom - scrollTop) > windowHeight - offsetBottom
    over = containerPageTop + offsetBottom - scrollTop + height - windowHeight
    translateY = over > 0 ? -over : 0
  innerStyle = fixed
    ? `position: fixed; left: <实测left>px; width/height: <实测值>; top/bottom: <offset>; transform: translateY(...)`
    : `position: relative;`
  if fixed 变化 -> emit('change', fixed)
```

- 占位层根节点保留测量到的宽高，避免固定时塌陷。
- 尺寸变化：窗口 resize 时重新测量；内容高度变化需手动刷新（Q5）。
- 优点：全端行为一致、可支持容器约束与 `change`/`scroll` 事件、可 Web 实测。
- 代价：页面必须把滚动位置传进来（与 Vant/Sard 的「自动吸顶」不同）。

### 方案 C：双模（Web 原生 sticky + App 受控）

- `#ifdef WEB`：方案 A 的 CSS sticky（零接线、零事件）。
- `#ifndef WEB`：方案 B 的受控定位（需要 `scrollTop`）。
- 优点：Web 体验最佳，App 可用。
- 代价：同一组件两套行为与两套文档说明，`change` 事件仅在 App 生效；维护与验收成本最高。

### 容器约束（Q2 落地形态）

- `m-sticky-box`（对齐 Sard）：

```
<view class="m-sticky-box" ref="boxRef">
  <slot />
</view>
provide('m-sticky-box', boxRef) // 子 m-sticky 测量 boxRef 的上下边界
```

- 或 `containerId: string`：组件内 `uni.getElementById(containerId)` 取容器（跨端可获取，但依赖全局 id 约定，不如 provider 内聚）。

### 事件（Q4）

```
emit('change', isFixed: boolean)
emit('scroll', { scrollTop: number, isFixed: boolean }) // 仅受控模式可行
```

## 疑问清单

### Q1 定位机制选型：方案 A（纯 CSS sticky）/ 方案 B（受控 scrollTop）/ 方案 C（双模）？
影响：组件骨架、props 清单、演示页接线方式、App 端可用性、双语文档用法示例；是本次实现最大的分叉点。
回答：C。

### Q2 容器边界是否实现，采用哪种形态？
候选：① v1 不实现（仅页面内吸顶/吸底）；② 新增配套 `m-sticky-box`（provide/inject，对齐 Sard，需同步注册演示页/文档/侧栏）；③ `containerId: string` prop + `uni.getElementById`（单组件、依赖全局 id）。
影响：是否多出一个组件、props/文档结构、同步与验收范围。
回答：②。

### Q3 API 风格对齐哪一方？
候选：① Vant：`position: 'top' | 'bottom'` + `offset-top` / `offset-bottom` 互斥；② Sard：`offset-top` / `offset-bottom` 可同时生效（上下双向吸附）。
影响：props 命名、状态计算分支、文档对照表。
回答：①。

### Q4 是否提供事件？
候选：① 不提供；② 仅 `change(isFixed)`；③ `change` + `scroll({ scrollTop, isFixed })`（仅方案 B/C 非 Web 分支可行）。
影响：组件 events 清单、演示页交互验收项；方案 A 无法实现任何滚动事件。
回答：③。

### Q5 受控模式下动态内容尺寸变化如何刷新？
候选：① 暴露 `refresh()` 方法供业务在内容变化后手动调用；② 仅首次测量 + 窗口 resize 自动重测，内容变化需重建组件；③ 定时轮询（不推荐）。
影响：是否新增实例方法、文档「动态内容」示例与演示页形态。
回答：②。

### Q6 验收范围：仅 Web 浏览器实测并登记 App 真机 TODO，还是必须包含 App 真机验收？
影响：DoD 验证方式；当前环境只能编译并跑 Web（HBuilderX VDOM），无 Android / iOS 运行时。
回答：仅 Web 浏览器实测并登记 App 真机 TODO。

### Q7（实现中新增）Web 端 CSS sticky 被框架默认样式阻断，如何处理？
发现：uni-app x Web 运行时给所有 `view` 注入 `overflow: hidden`（`@dcloudio/uni-h5/style/framework/uvue.css` 中 `uni-app uni-view { overflow: hidden; }`），`position: sticky` 的最近滚动容器因此退化为不滚动的父级 `view`。实测：m-sticky 根节点 computed `position: sticky / top: 0px`，页面滚到 `scrollTop=400` 时 `rect.top=-198`，完全不吸附；控制台无报错。即方案 C 的 Web 分支（Q1 的回答）实际不可成立。
候选：① 全端受控 + 自动测滚动容器（沿 `parentElement` 找最近滚动容器，以其可视区为吸附基准）；② 全端受控 + 视口为基准（自定义导航栏需自行叠加导航栏高度）；③ 保留 CSS sticky 并声明「必须是 scroll-view 直接子节点」（实测嵌套即失效，不可用）。
影响：Web 是否也需页面回传 `scroll-top`、offset 基准定义、演示页与文档用法。
回答：①。

## 实施记录

### 落盘清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/m-sticky/m-sticky.uvue` | 新增，受控吸附主组件 |
| `packages/core/components/m-sticky/context.uts` | 新增，`STICKY_BOX_KEY` + `StickyBoxContext` |
| `packages/core/components/m-sticky-box/m-sticky-box.uvue` | 新增，容器边界组件 |
| `packages/core/theme/vars.scss` | 新增 `$m-sticky-z-index: 99 !default` |
| `packages/playground/pages-sub/sticky/sticky.uvue` | 新增演示页（吸顶 0 / 吸顶 50 / 吸底 / 容器边界 ×2 / 事件 + 600px 尾部留白） |
| `packages/playground/pages.json`、`router/router.config.uts`、`pages/index/demo-components.uts` | 注册演示页（布局组，`status-bar` 之后） |
| `packages/docs/src/components/sticky.md`、`src/en/components/sticky.md` | 新增双语文档 |
| `packages/docs/.vitepress/config/zh.ts`、`en.ts` | 侧栏新增 Sticky |
| 三处 changelog（docs zh / en、`m-ui-x/changelog.md`） | 0.3.0 新增条目 |

### 关键实现决定

1. **放弃 CSS sticky**：Q7 实测后改为全端受控模式；`position: sticky` 分支代码与样式条件编译全部移除。
2. **吸附基准 = 最近滚动容器可视区**：`findScrollParent()` 沿 `parentElement` 向上找候选（Web 判 class 含 `uni-scroll-view`；App / 小程序判 `scrollHeight > offsetHeight`），最多 32 层；找不到时回退视口。
3. **Web 端测量走同步 DOM API**：`parentElement` 返回原生 DOM 节点，没有 `getBoundingClientRectAsync`（实测报 `TypeError`），故 `#ifdef WEB` 内用 `(parent as any).getBoundingClientRect()`，`#ifndef WEB` 保持 UniElement 异步接口。
4. **根节点始终留在文档流**：吸附时固定的是内容节点，根节点回填实测高度；因此测量与窗口 resize 重测都不会漂移，不再需要「Web 已吸附时跳过重测」的分支。
5. **函数声明顺序按 Kotlin 约束排布**（被调函数必须先声明）：`readWindowHeight → isScrollCandidate → findScrollParent → updatePosition → measureScrollParent → measureSelf → measureBox → handleWindowResize → computed → watch / 生命周期`。
6. **演示页尾部留白 600px**：最后一个事件演示块下方原来没有内容，滚到底也无法把它推到吸附线，加上留白后才能验收事件。

### 运行验证（Web，HBuilderX dev server `http://localhost:5174/unix-ui/playground/`）

| 场景 | 结果 | 证据 |
| --- | --- | --- |
| 吸顶 offset 0 | PASS | `scrollTop=400`，inner `position: fixed`、`rect.top=44`（= 滚动容器顶边） |
| 吸顶 offset-top 50 | PASS | `scrollTop=500`，inner `position: fixed`、`rect.top=94`（44+50） |
| 吸底 offset-bottom 0 | PASS | `scrollTop=0`，inner `position: fixed`、`rect.bottom=663` = 容器底边 |
| 容器内吸顶回顶 | PASS | `scrollTop=1401`，inner `position: fixed`、`rect.bottom=66` = `m-sticky-box` 底边 66（不再上移） |
| change / scroll 事件 | PASS | 事件块吸附后页面文案 `isFixed: true`、`scrollTop` 与容器 scrollTop 一致（1959） |
| 控制台 | PASS | 0 error / 0 warning（仅 1 条 info 预加载日志） |
| `pnpm sync:uni-modules:check` | PASS | 「playground 插件与 core 一致」 |
| `pnpm build:docs` | PASS | 5.71s 完成，无死链 |

### 已知限制

- 内容尺寸变化需重建组件（Q5 回答②），不提供 `refresh()`。
- App / 小程序端依赖 `UniElement.parentElement` / `scrollHeight` / `offsetHeight`，均为官方 4.0 起能力，待真机验证。
- Web 端识别滚动容器依赖框架内部类名 `uni-scroll-view`；框架若改名，会回退到 `scrollHeight > offsetHeight` 判据（仍可用，但可能误判含溢出内容的 `overflow: hidden` 祖先）。

### App 真机 TODO（Q6 回答）

- Android / iOS：验证 `parentElement` 向上遍历能命中 `scroll-view`，以及 `getBoundingClientRectAsync` 在组件根节点上的返回值。
- Android / iOS：验证 `position: fixed` + `left` / `width` 内联后，吸附条宽度与横向位置是否与占位层一致（尤其页面存在自定义导航栏时）。
- 小程序：验证 `scrollHeight` / `offsetHeight` 可读性与固定定位表现。
