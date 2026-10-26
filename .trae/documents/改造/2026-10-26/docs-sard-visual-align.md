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

### 6.5 待办

- 宽视口（≥1440px）人工验收：模拟器可见状态下点击 outline 锚点的视觉联动（链路三环已客观验证，仅差视觉确认）。
