# m-waterfall 瀑布流组件 实施方案

## 需求

用户要求参考 Sard Waterfall（`https://sard.wzt.zone/components/waterfall`）实现 unix-ui 的 `m-waterfall` 瀑布流组件。

目标行为：按内容实际高度自适应排列，形成参差不齐的多列布局；可自定义列数与列 / 行间距；内容加载完成后自动重新测量并重排；全部项加载完成时可通知业务。

参考实现（Sard）要点：

| 维度 | Sard 实现 |
| --- | --- |
| 组成 | `s-waterfall` 容器 + `s-waterfall-item` 项 + `s-waterfall-load`（已知宽高 / 超时占位）|
| 定位 | 绝对定位：容器测量列宽后，逐项按「最短列优先」计算 `left/top/width` |
| 顺序 | 严格按渲染顺序排版，前一项未测量完成时后一项等待（大图会阻塞后续） |
| Props | `columns`（默认 2）、`column-gap`（默认 16）、`row-gap`（默认 16） |
| Events | `load`（所有项加载完成）、`loadstart`（某项开始加载） |
| Expose | `reflow()`（重新排版）、`onLoad(handler)`（注册全部完成回调） |
| Item 插槽 | `default` 透出 `{ onLoad, columnWidth }`，图片 `@load` / `@error` 时调用 `onLoad` |
| Load 组件 | `width`（默认 320）、`height`（默认 240）、`max-wait`（默认 0），按比例占位；插槽透出 `{ onLoad, overtime }` |

## 需求分析

| 层 | 落点 | 内容 |
| --- | --- | --- |
| core 组件 | `packages/core/components/m-waterfall/m-waterfall.uvue` | 容器：测量列宽、维护注册顺序与高度、计算绝对定位、暴露 `reflow()` |
| core 组件 | `packages/core/components/m-waterfall/m-waterfall-item.uvue` | 项：应用容器下发的宽度 / 位置，测量自身高度并上报 |
| core 组件 | `packages/core/components/m-waterfall/context.uts` | `WATERFALL_KEY` + `WaterfallContext`（注册、注销、高度上报、宽度与测量版本号） |
| 主题变量 | `packages/core/theme/vars.scss` | 纯布局组件，无颜色 / 圆角变量（`columns` 与间距是运行时数值，无法走 scss 默认值），**不新增变量** |
| 演示页 | `packages/playground/pages-sub/waterfall/waterfall.uvue` + `pages.json` / `router.config.uts` / `demo-components.uts` | 一页穷举：基础 2 列、自定义列数 / 间距、动态增删、图片 `onLoad`、`load` 事件与 `reflow()` |
| 使用文档 | `packages/docs/src/components/waterfall.md`、`src/en/components/waterfall.md` | 双语文档 |
| 侧栏导航 | `packages/docs/.vitepress/config/zh.ts`、`en.ts` | 「布局组件」按英文字母序排在 `sticky` 之后 |
| changelog | 文档站 zh / en、`playground/uni_modules/m-ui-x/changelog.md` | 0.3.0 新条目（0.3.0 尚未发布） |

### uni-app x 技术约束（影响方案选型）

1. 无 `IntersectionObserver` / `ResizeObserver`；内容尺寸变化只能靠「业务在事件回调里通知」或手动 `reflow()`。
2. 元素几何只能异步获取：`UniElement.getBoundingClientRectAsync()`（m-sticky 已验证可用）；uvue Web 端 `parentElement` 返回原生 DOM，需条件编译。
3. uvue 外部 `:style` 不透传到组件根节点，项的宽度 / 位置必须由组件内部计算并落地为内联样式。
4. 绝对定位子节点不撑开父级高度，容器必须显式回填计算出的总高度，否则页面滚动区塌陷。
5. 注册顺序即渲染顺序（与 m-space 同一机制），容器据此保证「同一批数据每次排版结果一致」。
6. 作用域插槽向使用方传「函数」在本项目尚未验证（已传过对象 / 字符串）；`onLoad` 回调节奏是主要技术风险（见 Q7）。

## 伪代码设计

### 结构

```
<!-- m-waterfall -->
<view ref="rootRef" class="m-waterfall" :style="rootStyle">
  <slot></slot>
</view>

<!-- m-waterfall-item -->
<view ref="itemRef" class="m-waterfall-item" :style="itemStyle">
  <slot :on-load="handleContentLoad" :column-width="columnWidth"></slot>
</view>
```

- 容器：`position: relative; width: 100%;`，高度由内联样式回填（`height: <maxColumnBottom>px`）。
- 项：`position: absolute`，`left / top / width` 全部来自容器计算的内联样式。

### Props / Events / Slots / Expose

| 组件 | API |
| --- | --- |
| `m-waterfall` Props | `columns: number`（默认 2）、`columnGap: number`（默认 16，px）、`rowGap: number`（默认 16，px）、`customClass`、`customStyle` |
| `m-waterfall` Events | `load`（全部注册项均已测量完成）、`loadstart`（首个项开始测量，见 Q4） |
| `m-waterfall` Slots | `default` |
| `m-waterfall` Expose | `reflow()`：重测容器宽度与全部项高度并重排 |
| `m-waterfall-item` Props | `customClass`、`customStyle` |
| `m-waterfall-item` Slots | `default`，作用域参数 `{ onLoad: () => void, columnWidth: number }` |

### 排版算法（最短列优先，按注册顺序逐项落位）

```
recompute():
  acc = Array(columns).fill(0)              // 每列当前累计高度
  columnWidth = (containerWidth - (columns - 1) * columnGap) / columns
  placedAll = true
  for i in 0..ids.length-1:                 // 注册顺序，保证结果稳定
    h = heights[i]
    if h < 0:                               // 尚未测量：本项及后续项隐藏等待
      styles[i] = 隐藏占位样式（left:0; top:0; width:columnWidth px; visibility:hidden）
      placedAll = false
      continue                              // 后续项同样隐藏，等待前序测量完成（Q3 顺序策略）
    c = acc 最小值的列下标（同高取最左）
    styles[i] = absolute; left:c*(columnWidth+columnGap)px; top:acc[c]px; width:columnWidth px
    acc[c] += h + rowGap
  containerHeight = max(acc) - rowGap（不小于 0）
  if placedAll: emit('load')
```

### 测量与刷新流程

```
容器 onMounted / nextTick:
  rootRect = rootRef.getBoundingClientRectAsync()
  ctx.setContainerWidth(rect.width)        // 触发 widthVersion++，项侧开始测量
  recompute()

项 watch(widthVersion) / onMounted(nextTick):
  if ctx.columnWidth <= 0: return
  rect = itemRef.getBoundingClientRectAsync()
  ctx.updateHeight(id, rect.height)        // 容器侧 recompute()

项 onLoad（插槽回调）:
  ctx.updateHeight(id, 重新测量高度)        // 图片加载完成后修正高度并重排

容器 reflow():
  version++（触发全部项重测） + 重测自身宽度 + recompute()

容器 watch(columns / columnGap / rowGap) -> recompute()
窗口 resize -> 重测容器宽度 + 全部项重测 + recompute
```

- 项在未获得列宽前不测量（避免 0 宽度导致文本换行高度失真）。
- 高度未知的项 `visibility: hidden`，仍按正确列宽布局以便测量，但不可见、不重叠（Q6）。
- 移除项（v-if / 数据变化）走 `onUnmounted` 注销，容器自动重排。

## 疑问清单

### Q1 组件构成：两组件还是三组件？
候选：① 仅 `m-waterfall` + `m-waterfall-item`（对齐 Sard 主路径，项自动测量）；② 追加 `m-waterfall-load`（已知宽高 / `max-wait` 超时占位，第三个组件）；③ 单容器 + 数据驱动（`data` prop + 作用域插槽）。
影响：组件数量、API 面、演示页与双语文档规模、验收工作量。
回答：①②。

### Q2 是否在 v1 实现「已知宽高 / 最大等待时间」（`m-waterfall-load`）？
候选：① 不实现，统一靠挂载测量 + `onLoad` 修正（推荐，最小闭环）；② 实现独立 `m-waterfall-load` 组件；③ 不新增组件，改为在 `m-waterfall-item` 上加可选 `width` / `height` / `maxWait` props。
影响：是否多出第三个组件；图片比例占位能力（体验更好但改动更大）。
回答：②。

### Q3 排版策略？
候选：① 严格按注册顺序（前项未测量完成时后项隐藏等待，对齐 Sard，已显示项不跳动，但大图会阻塞后续）；② 任意项测量完成即可先落位，后续整体重排（出现更快，但已显示项会跳动）；③ 全部项测量完成后一次性出现（无跳动，但整体出现延迟）。
影响：`load` 语义、视觉稳定性、实现复杂度。
回答：①。

### Q4 事件与实例方法范围？
候选：① 完全对齐 Sard：`load` + `loadstart` + `reflow()` + `onLoad(handler)`；② 仅 `load` + `reflow()`（推荐，`onLoad` 注册回调可由 `@load` 替代）；③ 不提供事件，仅 `reflow()`。
影响：events / expose 清单、演示页交互验收项。
回答：①。

### Q5 列数响应式？
候选：① `columns` 固定，容器宽度变化（窗口 resize）时重测并重排（推荐）；② 支持 `columns` 为 `auto` + `minColumnWidth` 自动列数（超出参考 API，额外分支）；③ 仅首次测量，不支持后续尺寸变化。
影响：props 类型、resize 分支、跨端表现。
回答：①。

### Q6 未测量项如何表现？
候选：① `visibility: hidden` 并按列宽布局（不可见、不重叠，测量准确，推荐）；② 按图片比例 / 估算高度渲染骨架占位；③ 直接以高度 0 堆叠显示（会重叠，不可取）。
影响：首屏观感、测量准确性。
回答：①。

### Q7 作用域插槽回调（`#default="{ onLoad }"`）若在 App 端不成立，回退方案？
背景：向插槽传「函数」在本项目未验证；Web 端大概率可用，App（UTS）端存在编译或调用风险。实现时会先做最小验证。
候选：① 回退为「容器暴露 `reflow()`，业务在图片 `@load` / `@error` 后调用」（推荐，与 Q4 配套，零新增 API）；② 回退为「`m-waterfall-item` 增加 `refreshKey` prop，变化即重新测量」；③ 回退为「仅挂载测量，内容变化不再重排」。
影响：图片加载后的高度修正能力、文档示例写法。
回答：①。

### Q8 验收范围？
候选：① 仅 Web 浏览器实测，App / 小程序登记真机 TODO（与 m-sticky 一致，推荐）；② 必须包含 Android / iOS 真机验收（当前环境不具备）。
影响：DoD 验证方式与交付时间。
回答：①。

## 落盘清单（待回答后执行）

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/m-waterfall/m-waterfall.uvue` | 新增，容器（测量、排版、事件、`reflow`） |
| `packages/core/components/m-waterfall/m-waterfall-item.uvue` | 新增，项（定位样式、高度测量、插槽回调） |
| `packages/core/components/m-waterfall/context.uts` | 新增，`WATERFALL_KEY` + `WaterfallContext` |
| `packages/playground/pages-sub/waterfall/waterfall.uvue` | 新增演示页（基础 / 列数与间距 / 动态增删 / 图片 onLoad / 事件 + reflow） |
| `packages/playground/pages.json`、`router/router.config.uts`、`pages/index/demo-components.uts` | 注册演示页（布局组，`sticky` 之后） |
| `packages/docs/src/components/waterfall.md`、`src/en/components/waterfall.md` | 新增双语文档 |
| `packages/docs/.vitepress/config/zh.ts`、`en.ts` | 侧栏新增 Waterfall |
| 三处 changelog（docs zh / en、`m-ui-x/changelog.md`） | 0.3.0 新增条目 |
| `packages/core/theme/vars.scss` | 不改（无视觉变量） |

## 实施记录

### 实际落盘（与清单差异）

| 文件 | 实际变更 |
| --- | --- |
| `packages/core/components/m-waterfall/m-waterfall.uvue` | 新增容器：测量宽度 / 等分列宽 / 顺序阻塞 + 最短列优先排版 / 回填总高度 / `loadstart`·`load` / `reflow()`·`onLoad(handler)` |
| `packages/core/components/m-waterfall/context.uts` | 新增 `WATERFALL_KEY` + `WaterfallContext`（`ids` / `heights` / `loaded` / `styles` 四个 reactive 数组 + `revision` / `layoutVersion` / `measureVersion` 三个版本号） |
| `packages/core/components/m-waterfall-item/m-waterfall-item.uvue` | 新增（**独立顶层目录**，非清单中的 `m-waterfall/` 目录内）：注册 / 注销、按列宽测量高度上报、插槽透出 `onLoad` / `columnWidth` |
| `packages/core/components/m-waterfall-load/m-waterfall-load.uvue` | 新增（清单外，按 Q2 ② 追加）：`padding-top` 比例预占、`max-wait` 超时、透出 `onLoad` / `overtime` |
| `packages/playground/pages-sub/waterfall/waterfall.uvue` | 新增演示页：基础（2 列）/ 列数与间距（3 列 gap 8）/ 已知宽高（`m-waterfall-load`）/ 动态增删 + `reflow()` / 事件与方法（`onLoad(handler)`） |
| `pages.json` / `router/router.config.uts` / `pages/index/demo-components.uts` | 注册演示页与首页入口（布局组，Sticky 之后） |
| `packages/docs/src/components/waterfall.md`、`src/en/components/waterfall.md` | 新增双语文档 |
| `.vitepress/config/zh.ts`、`en.ts` 与三处 changelog | 侧栏 + 0.3.0 条目 |
| `packages/core/theme/vars.scss` | 不改（无视觉变量） |

### 实现要点

- **多组件家族目录**：`m-waterfall-item` / `m-waterfall-load` 必须各自独立顶层目录，easycom 只识别 `components/<tag>/<tag>.uvue`；放在 `m-waterfall/` 内会报 `Failed to resolve component`。
- **时序**：容器挂载 → 测宽度得列宽 → `provide` 下发 → 项在正确列宽下 `getBoundingClientRectAsync()` 测高上报 → 容器 `recompute()` 计算绝对定位并内联回填总高度（绝对定位不撑开父级）。
- **延迟一帧补测**：`<image mode="widthFix">` 的 `@load` 回调时刻，图片自身尺寸更新尚未落地，只测一次会得到偏小高度且此后不再重测；`onLoad` 回调内「立即测一次 + `setTimeout(0)` 再测一次」后各容器 `containerH === maxBottom` 且重叠数为 0。

### 验证（DoD）

- `pnpm sync:uni-modules:check` → playground 插件与 core 一致。
- `pnpm build:docs` → build complete in 7.81s（死链检查通过）。
- Web 实测（`http://localhost:5174/unix-ui/playground/pages-sub/waterfall/waterfall`）：
  - 四个区块图片全部渲染，无重叠 / 错位，容器底部无异常空白，控制台无 error；
  - 「已知宽高」区块 `max-wait=300` 内正常取真实比例，未出现红色「超时」角标；
  - 动态区块点击「添加 2 项」后项数增加且两两对比重叠数 0；
  - `reflow()` → 「最近事件：reflow 已调用」；`onLoad(handler)` → 「最近事件：onLoad 回调执行（全部项已加载）」。
- 排查记录：外链 GitHub raw 图片曾出现「浏览器零请求、容器高度 0」的假阳性，`curl` 该 URL 耗时 9.3s（网络慢），并非组件缺陷；多等一会即恢复渲染。
- App / 小程序按 Q8 ① 登记真机 TODO，未在本次验收范围内。
