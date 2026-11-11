# m-tabs / m-tab 标签页组件实施方案

## 需求

对标 Vant Tab（交互与 API 主参考）与 Sard Tabs（形态参考）实现标签页组件，用于不同内容区域间切换。组件命名：`m-tabs`（容器：标签栏 + 内容区）+ `m-tab`（单个标签页：标题 + 内容）。

## 参考要点

### Vant Tab（主参考）

- 结构：`van-tabs` 容器 + `van-tab` 子项插槽式；`v-model:active` 绑定激活项（有 `name` 时按 name 匹配 string | number，否则索引 number）
- Tab Props：`title` / `name` / `disabled` / `dot` / `badge` / `title-style` / `title-class` / `show-zero-badge`
- Tabs Props：`type`（line / card）、`color`、`background`、`duration`（动画秒）、`line-width` / `line-height`（底部条尺寸）、`animated`（内容转场动画）、`border`（标签栏外边框）、`ellipsis`（标题省略）、`sticky`（吸顶）、`shrink`（左侧收缩布局）、`swipeable`（手势滑动切换）、`lazy-render`（延迟渲染）、`scrollspy`（滚动导航）、`show-header`、`offset-top`、`swipe-threshold`（滚动阈值）、`title-active-color` / `title-inactive-color`、`before-change`（切换前拦截，支持 boolean / Promise）
- 事件：`click-tab` / `change` / `scroll`；插槽：`nav-left` / `nav-right` / `nav-bottom`
- 交互：标签超过 5 个（swipe-threshold）且总宽超出时标签栏横向滚动，切换自动居中；line 底部条跟随动画移动；card 为整组卡片式

### Sard Tabs（形态参考）

- 双用法：`options` 数组驱动（纯标签栏）或 `s-tab` 子组件式
- `type`：line / **pill**（药丸：选中项填充主题色圆角块）/ card
- `scrollable` 开启后标签不平分空间、可横向滚动
- TabProps 极简：`label` / `value` / `disabled`；TabsSlots 有 `line` 自定义线条

## 需求分析

- **文件影响面**：
  - `packages/core/components/m-tabs/m-tabs.uvue` + `m-tab/m-tab.uvue`（新增）
  - `packages/core/theme/vars.scss`：新增 `$m-tabs-*` 段（含 line 底部条、card、pill、标题色等）
  - `packages/playground/pages-sub/tabs/tabs.uvue` 演示页 + `pages/index/demo-components.uts` 登记
  - `packages/docs/src/components/tabs.md` + `src/en/components/tabs.md` + 侧栏 zh.ts / en.ts
  - changelog：文档站 zh / en 与插件 KEEP 三处（按发布版本归段）
- **技术底座（uni-app x 约束下的实现路径）**：
  - 子项注册：provide/inject + reactive 注册序（m-compact / m-flex / m-space 先例），m-tab onMounted 注册 { name, title, disabled, dot, badge } 快照，标签栏据此渲染
  - active 匹配：任一 tab 有 name 时统一按 name（string | number）匹配，否则按索引；`v-model:active`
  - 底部条动画：激活标题 `UniElement.getBoundingClientRect()` 测量 + `UniElement.animate` 平移（ucss 无 @keyframes）；标签栏滚动用 scroll-left 居中
  - 内容区 animated / swipeable：swiper + m-tab 为 swiper-item（m-cascader 层级 swiper 先例），@transition 联动底部条
  - sticky：复用本库 m-sticky 包裹标签栏（offset-top 透传），不重做吸顶
  - lazy-render：未激活且从未激活的 tab 不渲染内容
  - ellipsis：单行省略（仅非滚动布局生效）
  - before-change：boolean 同步版（对齐本库 m-popup before-close 先例，不支持 Promise）
- **平台差异风险**：scroll-left 居中在 Web 端 scroll-view 行为、swiper 高度自适应（内容高度不一）需实测；App 端 ucss 不支持的属性按既有条件编译惯例处理

## 伪代码设计

```
m-tabs.uvue（容器）
props: active, type('line'|'card'|'pill'), color, background, lineWidth, lineHeight,
       animated, border, ellipsis, sticky, shrink, swipeable, lazyRender, scrollspy,
       showHeader, offsetTop, swipeThreshold, titleActiveColor, titleInactiveColor, beforeChange
emits: update:active, change, click-tab, scroll, disabled-click?
slots: nav-left, nav-right, nav-bottom（+ Sard 的 line 自定义底部条槽可选）
expose: resize()? / scrollTo(name)?

m-tab.uvue（子项）
props: title, name(string|number), disabled, dot, badge, showZeroBadge, titleStyle, titleClass
inject: tabs 注册上下文；内容渲染受容器 animated/lazyRender/激活态控制
slots: default（内容）, title（自定义标题）
```

## 不做的事（边界，待确认）

- scrollspy 滚动导航依赖页面级滚动回传（m-sticky 已有 scroll-top 回传先例），实现成本高——是否进首版待 Q3
- before-change 不支持 Promise 异步版（对齐本库 boolean 同步先例）
- title-style / title-class 如无强需求可裁剪为插槽覆盖

## 疑问清单

### Q1 组件形态：纯 Vant 式子组件，还是兼容 Sard 的 options 数组双形态？（影响：组件 API / 注册机制复杂度）

方案 A：仅 `m-tabs` + `m-tab` 子组件插槽式（Vant 主参考，与内容区天然配合）；方案 B：同时支持 `options` 数组（Sard 式，纯标签栏轻量用法，无内容区）；方案 C：双形态并存（子组件优先，传 options 走纯标签栏）。

回答：C。

### Q2 type 形态范围：Vant 的 line / card 之外是否增加 Sard 的 pill（药丸选中填充）？（影响：样式类与主题变量规模）

回答：是。

### Q3 首版功能范围：sticky / scrollspy / animated / swipeable / before-change 是否全量对标 Vant？（影响：实现周期与演示页规模）

方案 A：全量对标（sticky 复用 m-sticky，成本可控）；方案 B：首版砍掉 scrollspy（滚动导航复杂，依赖页面滚动回传侵入性大），其余保留。

回答：A。

### Q4 v-model 绑定值语义：统一 name 匹配（任一 tab 传了 name 则全部按 name），还是始终支持索引与 name 混用？（影响：active 类型 string | number | null）

Vant 语义：指定 name 后无法再按索引匹配。是否照搬？

回答：混用。

## 实施记录

（2026-11-10 完成）

### 落码清单

| 文件 | 内容 |
| --- | --- |
| `packages/core/components/m-tabs/tabs.uts` | 跨组件共享：`TABS_KEY` 字符串 key、`TabItem` / `TabsClickEvent` 类型、`TabsContext` class（items / activeIndex / scrollspy / trackMode / renderSet / everSet 均为 Ref 字段 + paneEls Map + seq；register / unregister / updatePane） |
| `packages/core/components/m-tabs/m-tabs.uvue` | 容器全量 props（27 项）+ 4 emits + expose `scrollTo`；sticky 分支（m-sticky 包 nav）与非 sticky 分支；animated / swipeable 自行编排 UniElement.animate 轨道平移 + touch 三事件手势（放弃 swiper：uni-app x 无法把 m-tab 放进 swiper-item）；底部条双实现（平分布局独立条 + 动画、滚动 / 收缩布局标题内嵌条静态） |
| `packages/core/components/m-tab/m-tab.uvue` | 内容子项；onMounted 注册 + 首次渲染后 updatePane 补报 pane 元素（lazyRender 协议）；v-if（everRendered）+ v-show（visible）显隐 |
| `packages/core/theme/vars.scss` | `$m-tabs-*` 段 13 个变量（全 `!default`，追加 L276-302） |
| `packages/playground/pages-sub/tabs/tabs.uvue` | 演示页 13 场景穷举（defineUniPage name: 'tabs'） |
| `packages/playground/pages/index/demo-components.uts` | 布局组件组登记 tabs |
| `packages/docs/src/components/tabs.md` + `en/components/tabs.md` | 双语文档（含「与 Vant 的差异」架构取舍说明） |
| `.vitepress/config/zh.ts` / `en.ts` | 侧栏「布局组件」组登记 |
| changelog 三处（docs zh / en + 插件 KEEP） | 0.4.0 段补 m-tabs / m-tab 条目 |

### 关键架构决策（与伪代码的差异）

1. **标题栏由容器按注册快照渲染**：uni-app x 无 VNode 移动能力，`m-tab` 的插槽内容无法上提到容器渲染，标题不能由 m-tab 自渲染再移动；因此 `title` 插槽 / `title-style` / `title-class` 裁剪（文档已注明）
2. **animated / swipeable 放弃 swiper**：无法将 m-tab 放进 swiper-item，改为自行编排 viewport（touch 三事件）+ track（renderSet 过渡期 [旧, 新] 两可见项并排 + UniElement.animate 平移 + setTimeout 收缩）
3. **scrollspy 点击定位双路径**：优先向上查找首个可滚容器（`scrollHeight > clientHeight + 4` 判定，scroll-view 内嵌场景）直接平移；找不到回退 `uni.pageScrollTo`（回调风格，避免 web 端对象传参的 unhandled rejection）

### 实测暴露并修复的问题（浏览器实测）

1. **scrollspy 协议未下发**：TabsContext 的 `scrollspy` / `trackMode` 字段从未被赋值（恒 false），m-tab 判定失效——修复：setup 中 `ctx.scrollspy.value = props.scrollspy`、`ctx.trackMode.value = trackMode.value`（两 prop 声明期静态，一次性赋值）
2. **scrollspy 判定基准线错误**：原用 `track.getBoundingClientRect().top`（随内容滚动移动，判定恒为第 1 项）——修复：基准线改为视口固定线（`props.offsetTop`）
3. **paneEls 全空**：m-tab onMounted 注册时内容因 lazyRender 未渲染，paneRef 为 null，scrollspy 测量与定位失效——修复：`TabsContext.updatePane` + m-tab `watch(everRendered, flush: 'post')` 首次渲染后补报
4. **演示页样式编译错误**：演示页 `@import '../../theme/vars.scss'` 路径深度不对（架构规则的「写死两级」仅指组件源目录），删除改字面色值（对齐全部既有演示页惯例）
5. **VDOM 发布构建 TS 诊断（0.3.0 清理先例的补漏）**：可空 union 标注生成 `type: [..., null]` props（m-tab `name` / m-tabs `options` / `fieldNames` / `beforeChange`）触发 TS2769；`UniElement` 类型无 `clientHeight`（isScrollCandidate 改 `offsetHeight`）——四处按先例清理：去掉类型标注 `| null` 保留 `default: null`，运行时语义不变

### 验证结论（DoD）

- 编译：HBuilderX CLI `cli launch web` 成功，routeGen 28 pages，无编译错误
- 浏览器实测（Web 端，12/13 场景通过）：基础切换 ✓ / name 匹配（lazyRender 生效：未激活项从未渲染）✓ / 标签栏滚动（>5 平分→滚动）✓ / 禁用拦截（click-tab 照常派发）✓ / card ✓ / pill ✓ / color 派生底部条（rgb(238,10,36) + width 24px + translateX 平移）✓ / animated 转场（renderSet [旧, 新] 并排 → setTimeout 收缩归零位）✓ / 徽标（红点 + badge 8 + 零值隐藏）✓ / before-change 拦截 ✓ / options 禁用拦截 ✓ / scrollspy 平铺 + 滚动联动（2941→区块 2、3041→区块 3）+ 点击激活 ✓
- 未实测：swipeable 手势跟手切换（浏览器无 touch 输入通道，真机验证）；pageScrollTo 页面级定位（演示页为 scroll-view 滚动结构，App 端页面级滚动场景生效）
- 控制台：修复后无运行时报错（原 pageScrollTo unhandled rejection 已由回调风格消除）
- `pnpm sync:uni-modules:check` ✓；`pnpm build:docs` ✓（VitePress 死链检查通过）
