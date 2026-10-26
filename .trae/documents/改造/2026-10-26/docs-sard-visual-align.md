# 文档站组件页视觉对齐 Sard（第二轮）

> 日期：2026-10-26 ｜ 状态：已完成（宽视口人工验收待用户确认）｜ 上轮：docs-sard-demo-refactor.md（三栏布局 + 模拟器基建）

## 1. 背景与目标

用户以 Sard 文档站（https://sard.wzt.zone/components/button，源码 sutras/sard/packages/docs）为基准反馈「实际体验区别很大」。经源码 + 线上双路调研，差异清单见第 2 节；用户选定本轮范围：**#1–#6 视觉对齐 + 模拟器锚点联动**，明确不做 #7（UTS/JS 双页签，snippet 插件 + UTS 转换高风险低收益）与 #8（侧栏自动生成，工程优化、体验感知小）。

调研要点：Sard 为「文档站 + H5 demo 应用」双站架构，正文不渲染组件，全部渲染集中于右栏 MobileEmulator（postMessage 桥：route/hashchange/theme/getUrl）；Sard 线上部署的模拟器 iframe 当前挂载失败（高度 0），我站模拟器功能反而完整。

## 2. 差异清单

| # | 差异点 | Sard | 我站现状 | 本轮 |
| --- | --- | --- | --- | --- |
| 1 | 页头标题 | 大标题 + 灰色副题 + 粗分割线（frontmatter 驱动，隐藏正文 h1） | 普通 h1 | 做 |
| 2 | API 表格 | 全网格边框 + 表头底色 + 宽松行距 | 默认细线表格 | 做 |
| 3 | 侧栏/导航 logo | 图形 + 文字 | themeConfig 已配 logo.png 但导航栏未渲染出图形 | 做（换 logo.svg 实测） |
| 4 | 导航栏右侧 | GitHub 图标 | socialLinks 已配置（≥1280 才渲染，实测视口不足所致） | 验证即可 |
| 5 | 文档结构 | 「介绍」独立小节 | 描述裸段 + 「引入」节（easycom 说明与快速上手重复） | 做 |
| 6 | 模拟器联动 | 点正文锚点 → 模拟器滚动到对应 demo（postMessage） | 无联动 | 做 |
| 7 | 代码块页签 | vue ts/js 双页签 | 单 vue 块 | 不做 |
| 8 | 侧栏生成 | frontmatter 自动生成 | zh/en 手工双份 | 不做 |

## 3. 方案与落点

| 项 | 落点 | 方案 |
| --- | --- | --- |
| 页头组件 | `packages/docs/.vitepress/theme/components/DocHeader.vue`（新建） | frontmatter.title/subtitle 驱动：title 大字 + subtitle 灰色副题 + 粗分割线；frontmatter.title 存在即渲染（zh 带 subtitle，en 仅 title） |
| 页头挂载 | `theme/index.ts` | doc-before slot 挂 DocHeader（组件内 v-if 自判）；frontmatter.subtitle 存在时根节点追加 has-doc-header 类 |
| 表格/页头样式 | `theme/styles/demo.css` | .vp-doc 表格全网格 + 表头底色 + 行距放宽 |
| logo | `config/shared.ts` | logo 换已有 logo.svg，浏览器实测导航栏渲染 |
| 文档结构调整 | `src/components/*.md` 与 `src/en/components/*.md` 共 18 文件 | 删 h1（页头接管）；frontmatter 补 title（英文名）/subtitle（zh 中文名，en 不加）；首段描述并入 `## 介绍`（en `## Introduction`）；删 `## 引入`（en `## Usage`）；h3 补 `{#demo-*}` 自定义锚点 |
| 联动协议 | `theme/components/DemoPhone.vue` | 监听 useData().hash（`#demo-` 前缀才联动）→ `iframe.contentWindow.postMessage({type:'demo-scroll', id}, '*')`；iframe @load 时补发当前锚点（解决时序）；iframe 不用 lazy（display:none 容器内永不加载） |
| 演示页接收端 | `playground/components/demo-bridge/demo-bridge.uvue`（新建，easycom） | WEB 条件编译监听 message，`document.getElementById(id).scrollIntoView({behavior:'smooth',block:'start'})`；App 端空渲染 |
| 演示页锚点 | `playground/pages-sub/*/<name>.uvue` 共 9 文件 | `<text class="section">` 加 id；模板接入 `<demo-bridge />` |

## 4. 锚点映射约定（强制）

- 文档 h3 锚点 id = `demo-` 前缀 + 演示节 id，1:1 对应；**禁止文本匹配**（zh/en 文档与演示页节标题文本不一致）。
- 演示节 id 取语义短词（type / size / plain / block / disabled / loading / color 等），由子代理读各 .uvue 的 section 顺序确定。
- 无对应演示节的 h3（如「细边框」「按压反馈」）不加自定义锚点，保持默认 slug，避免 DOM id 重复。

## 5. 验证计划

1. dev（5173）：宽视口截图核对页头/表格/logo；点击正文 h3 锚点实测模拟器滚动联动（含从外页带锚点进入的 load 补发路径）。
2. `pnpm build:docs` 死链检查 + preview（4173）复验。
3. DoD：全部项以运行时表现为准；zh/en 双语侧同步。

## 6. 实施记录（2026-10-26）

### 6.1 批量改造（27 文件，脚本化）

- 后台子代理执行失败（completed 但零改动），改为 /tmp 一次性 node 脚本（映射表内置、错误先汇总、零错误才写盘）：18 md + 9 uvue 一次执行成功。
- en 侧结构不统一在脚本首跑暴露：button 等 6 篇为「## Usage(引入) + ## Examples(示例)」，icon/badge/loading 3 篇为「## Import(引入) + ## Usage(示例)」——脚本改为按「先出现的引入节」整节删除 + 示例节统一改名 `## Examples` 后通过。
- grep 自检全绿：h1 残留 0、`{#demo-` 锚点 100（zh/en 各 50）、title 18 / subtitle 9、`## Examples` 9、demo-bridge 9 页、section id 50。

### 6.2 联动机制两处修正

- **useData().hash 才是响应式 hash**：PageData 无 hash 字段，DemoPhone 初版 `route.data.hash` 为 undefined（computed 求值即抛 TypeError），改从 useData() 解构 hash。
- **iframe 去掉 loading="lazy"**：窄视口下模拟器被媒体查询 display:none，lazy iframe 永不加载（0×0 视口），postMessage 全部丢失——首轮联测全 FAIL 的根因；模拟器是组件页核心交互元素，lazy 无收益纯风险。

### 6.3 联动验证（三环证据链）

测试代理视口固定 1134px（<1440 三栏不渲染、模拟器 display:none），宽视口端到端无法直接测，改用证据链组合：

1. 发送端：hash 变化触发发送日志（watch + iframeRef 就绪）。
2. 消息传递：iframe 内 `[demo-bridge] recv {"type":"demo-scroll","id":"size"}`（跨端口 postMessage 到达）。
3. 接收端滚动：5174 顶层创建与模拟器等尺寸 iframe（331×623，同源可读内部），postMessage 后 page-body scrollTop=594、滚到 text 页「多行省略」节（ellipsis-multi）。
4. 探针曾报 viewport 0 0 / 全链 clientHeight=0——即 display:none iframe 的布局塌缩态，证实根因而非代码缺陷。临时探针日志已全部清理。

### 6.4 生产构建

- `pnpm build:docs` 5.23s 通过、无死链；preview(4173) 产物校验：doc-header 渲染、介绍节在、引入节 0、正文 h1 0、en Introduction/Examples 结构正确、18 页锚点数与映射表逐一吻合（button 7/7、cell 5/5、icon 4/4、image 5/5、layout 4/4、text 6/6、space 5/5、loading 6/6、badge 8/8，zh/en 对称）。

### 6.5 右侧空白条修复（用户验收反馈）

- 现象：宽视口下 aside（模拟器 + 页面导航）右侧残留 ≈267px 空白竖条，Sard 中模拟器贴右缘与头部对齐。
- 根因：demo.css 对 aside 只写了 `flex-grow: 0; max-width: none`，但主题默认 `.aside { width: 100% }` 仍作为 flex-basis 参与——aside 与 content 两个 `width: 100%` 子项等权收缩、各占一半容器宽，aside 内部网格仅 ~551px，余量全部变成项内右侧空白（≈267px 与截图吻合）。
- 修复：aside 改 `flex: 0 0 auto; width: auto; max-width: none`——宽度完全由内部网格（模拟器 331 + gap 20 + 导航 200）决定并贴靠右缘，content 自动占满剩余宽度。
- 验证：`pnpm build:docs` 4.25s 通过；产物 CSS 确认 `flex:0 0 auto` 进入构建；preview(4173) 重启 200。宽视口视觉由用户复核（测试代理视口 1134px 物理放不下三栏，无法直测）。

### 6.6 导航栏 logo 与右侧固定修复（用户验收反馈，推翻「base 路径」误判）

- **logo 缺失根因**：`config/index.ts` 顶层 `themeConfig: { search }` 字面量整体覆盖了 `...sharedConfig` 带入的 themeConfig（对象展开只合并顶层键，嵌套对象直接替换）——logo、socialLinks、footer 从未进入最终配置，产物 HTML 中 `<img>` 为 0（socialLinks/footer 同此根因，一并修复）。VPImage 源码证实本就对 logo 做 withBase，`logo: '/logo.svg'` 写法正确；此前 curl `/logo.svg` 404 与此无关（该 URL 本就无人请求）。修复：index.ts themeConfig 先展开 `...sharedConfig.themeConfig` 再补 search（search provider 置顶层的要求保持不变）。
- **右侧固定**：原方案把 sticky 放在 demo-phone / outline 内部子项上，sticky 吸附范围由父容器高度决定，aside-container 改 static 后只有 aside 内容高（~850px），正文几千 px 滚过即整块滚出视野。修复：吸附点上移到 `.aside-container` 整体 `position: sticky; top: calc(var(--vp-nav-height) + 48px)`（48px 为悬空工具栏留位），其父 `.aside` 被 flex 拉伸至正文高度、吸附范围覆盖整个滚动过程；移除内部子项 sticky，outline 仅保留 max-height 内滚（上限同步改 `100vh - nav - 48px` 与容器 top 对齐）。
- 验证：`pnpm build:docs` 3.98s 通过、无死链；产物确认 `<img class="VPImage logo" src="/unix-ui/logo.svg">`、VPNavBarExtra/github 社交图标、footer Copyright、`.aside-container{position:sticky;...}` 全部进构建；preview(4173) 重启后 curl 200；浏览器实测导航栏 logo 图标可见（img naturalWidth 126、渲染 21.9×24、console 无报错）。宽视口 sticky 效果待用户复核。

### 6.7 待办

- 宽视口（≥1440px）人工验收：右侧空白条消失、模拟器 + 页面导航随滚动固定（Sard「相对于头部固定」效果）、logo 图标显示、outline 锚点联动视觉确认（链路三环已客观验证，仅差视觉确认）。
