# docs 文档站改造：对齐 Sard 组件演示区域

- 日期：2026-10-26
- 范围：`packages/docs`（VitePress 双语站）+ 少量 `packages/playground` 配合（仅部署形态，不改组件代码）
- 参考：[Sard UI Button 页](https://sard.wzt.zone/components/button)（含用户截图）

---

## 一、需求

参考 Sard UI 文档站重构 `packages/docs`，重点是**组件描述中的演示区域**。Sard 页面形态（截图 + 页面抓取双重确认）：

```
┌──────────┬────────────────────────────┬──────────────┬─────────────┐
│ 左侧导航  │  内容主列                   │ 手机模拟器    │ 页面导航     │
│          │  # Button 按钮             │ ┌──────────┐ │ 介绍         │
│ 基础组件  │  ## 介绍                   │ │ - + 100% │ │ 代码演示      │
│  Button  │  按钮用于开始一个即时操作。   │ │┌────────┐│ │  颜色与变体   │
│  Icon    │  ## 代码演示                │ ││ iframe ││ │  圆形按钮…    │
│  …       │  ### 颜色与变体             │ ││ 演示页  ││ │ API          │
│ 布局      │  `variant` 属性用于配置变体  │ │└────────┘│ │  ButtonProps │
│ …        │  ```vue 代码块 ```          │ └──────────┘ │ 主题定制      │
└──────────┴────────────────────────────┴──────────────┴─────────────┘
```

核心差异点（本项目现状 → Sard 形态）：

| # | 差异点 | 本项目现状 | Sard 形态 |
| --- | --- | --- | --- |
| 1 | 演示区域 | 纯代码块，无实时预览 | 右侧固定手机模拟器 iframe，实时渲染 playground 演示页，带缩放控件（-/+、百分比）与「在新窗口打开」 |
| 2 | 内容结构 | 介绍/代码演示/API/主题定制 | 相同（已对齐，无需大改） |
| 3 | 页面导航 | VitePress outline [2,3] | 相同（可能需扩展到 h3 小节，现有已支持） |
| 4 | 代码演示小节 | 标题 + 说明 + ```html 代码块 | 标题 + 说明（行内代码高亮）+ ```vue 代码块（形态一致） |

**结论：重构主战场 = 手机模拟器演示容器 + 文档接入方式 + demo 部署链路。**

---

## 二、现状盘点

### 2.1 docs 侧（可复用资产）

- `theme/index.ts` 已有自定义 Layout 扩展点（`home-hero-after` 槽先例），可继续挂自定义组件
- `shared.ts`：`base = process.env.DOCS_BASE || '/unix-ui/'`，已有 CI 环境变量注入先例，DEMO 地址可用同机制
- 组件文档 4 篇 ×双语：`badge.md` / `button.md` / `icon.md` / `loading.md`，结构已含 介绍 → 代码演示（分小节）→ API → 主题定制
- `zh.ts` / `en.ts` 侧栏分组与 playground 首页分组一致

### 2.2 playground 侧（iframe 目标）

- uni-app x web 端，**history 路由**（ux-router），演示页直链形态：`http://localhost:5174/pages-sub/button/button`（dev 端口 5174 在 manifest 显式指定）
- 演示页一页穷举组件全部变体，自带 `demo-navbar`（标题/副标题），正是 iframe 内渲染的理想单元
- `cli build web` 可产出静态构建产物，可随 docs 同站部署（待定，见 Q2）

### 2.3 VitePress 关键技术事实

- md 中可直接使用 Vue 组件（需在主题 `enhanceApp` 全局注册或 md 内 import）
- iframe 仅浏览器可渲染，SSR 阶段需 `client:only` 或纯静态标签规避
- 默认主题无「内容右侧独立栏」槽：三栏（内容 | 模拟器 | outline）需 CSS grid 改造

---

## 三、技术方案（伪代码级）

### 3.1 DemoPhone 演示容器组件（新增 `.vitepress/theme/components/DemoPhone.vue`）

```ts
// props
{
  path: string        // playground 演示页路由，如 'pages-sub/button/button'
  title?: string      // 无障碍标题，默认取 path
}
// 内部状态
scale = ref(100)                       // 缩放百分比，50~150，步进 10
src = computed(() =>
  (import.meta.env.DEV ? 'http://localhost:5174/' : DEMO_BASE) + props.path
)                                      // DEMO_BASE 由构建环境变量注入（复用 DOCS_BASE 模式）
```

```html
<template>
  <div class="demo-phone">
    <div class="demo-phone__toolbar">
      <button @click="scale -= 10">−</button>
      <span>{{ scale }}%</span>
      <button @click="scale += 10">+</button>
      <a :href="src" target="_blank">在新窗口打开</a>
    </div>
    <div class="demo-phone__frame">
      <!-- iPhone 造型外框：深色圆角壳 + 顶部刘海 -->
      <iframe :src="src" :title="title" :style="{ transform: 'scale(' + scale / 100 + ')' }" />
    </div>
  </div>
</template>
```

- iframe 固定设计尺寸（如 390×844 的 iPhone 逻辑分辨率），外框裁剪圆角
- 缩放用 `transform: scale()` + `transform-origin: top center`，外框尺寸不变
- `import.meta.env.DEV` 判断环境，SSR 安全（构建期常量替换，无 window 访问）

### 3.2 布局接入（两案并存，Q1 定夺）

- **方案 A（对齐 Sard 三栏）**：改造 Layout，`.VPContent` 内为组件页启用 grid：内容列 + 右侧 sticky 模拟器列（outline 保持最右或并入）。md 顶部声明 `demo: pages-sub/button/button`（frontmatter），Layout 读取 `useData().page.value.frontmatter.demo` 决定是否渲染模拟器栏
- **方案 B（轻量内嵌）**：md 正文顶部直接写 `<DemoPhone path="pages-sub/button/button" />`，CSS 让其浮动/sticky 靠右，不改造 Layout

### 3.3 文档接入

- 主题 `enhanceApp` 注册 `<DemoPhone>`（或 frontmatter 驱动，随 Q1 方案）
- 组件 md 顶部接入；双语 8 文件同步（zh/en 指向同一中文演示页，Sard 亦同构）

### 3.4 部署链路（Q2 定夺）

- 生产 DEMO_BASE 候选：playground `cli build web` 产物随 docs 同站部署（如 `/unix-ui/playground/`），CI 注入 `DEMO_BASE` 环境变量
- 仅 dev：iframe 指向 `http://localhost:5174/`，生产暂不部署 demo

---

## 四、实施顺序（确认后执行）

1. `DemoPhone.vue` 组件 + 主题注册 + CSS
2. 布局接入（按 Q1 定案）
3. button.md（zh/en）试点接入 → 浏览器实测 iframe 渲染/缩放/新窗口
4. 其余组件文档批量接入（按 Q3 定案范围）
5. `pnpm build:docs` 死链检查 + HBuilderX 构建验证（若 Q2 选同站部署）

---

## 五、疑问清单（请在「回答：」处作答）

### Q1 演示容器布局

- **A（推荐）**：方案 A，对齐 Sard 三栏（内容右新增独立模拟器栏，sticky 跟随滚动，改造 Layout + CSS grid）
- **B**：方案 B，md 内嵌浮动容器（改动最小，视觉不完全对齐截图）

回答：A。

### Q2 生产环境 demo 来源

- **A**：playground 构建产物与 docs 同站部署（新增构建脚本与 CI 步骤，`DEMO_BASE` 环境变量注入）
- **B**：本期仅 dev 环境生效（localhost:5174），生产演示区域暂渲染占位提示
- **C**：其他（请说明）

回答：A。

### Q3 覆盖范围

- **A**：现有 4 篇组件文档（button/icon/badge/loading 双语 8 文件）先接入验证模板
- **B**：4 篇 + 补齐 cell/image/text/space/layout 5 个新组件的双语文档并一并接入（注：新组件双语文档此前约定暂缓待通知——借本次一并放开？）

回答：B。

### Q4 代码块形态

- **A**：保持 VitePress 默认（自带语言标签 + 复制按钮 + 高亮），仅把 ```` ```html ```` 换 ```` ```vue ```` 与 Sard 观感对齐
- **B**：额外做「代码/预览折叠切换」等自定义增强（Sard 无此能力，不建议）

回答：B。

---

## 六、实施记录（2026-10-26 完成回填）

### 6.1 交付清单

| 模块 | 文件 | 说明 |
| --- | --- | --- |
| 主题入口 | `packages/docs/.vitepress/theme/index.ts` | Theme 对象 + `extends` + `Layout: UnixLayout`；UnixLayout 包裹默认主题，按 `frontmatter.demo` 决定三栏类与 aside-top 槽 |
| 演示容器 | `.vitepress/theme/components/DemoPhone.vue` | 390×844 iPhone 壳 + 刘海；scale 默认 85%（50~150 步进 10）；DEV 直连 5174 dev server，PROD 用 `__DEMO_BASE__`；外框按缩放显式设宽高（transform 不改布局尺寸） |
| 代码折叠 | `.vitepress/theme/code-collapse.ts` | onContentUpdated 定位「代码演示/Examples」h2 → API h2 区间注入折叠按钮；标题比较剥离 header-anchor 与零宽字符 |
| 全局样式 | `.vitepress/theme/styles/demo.css` | 折叠按钮 + collapsed；≥1440px 启用三栏：aside-top 的 DemoPhone sticky、aside-container fixed→static、VPDocAside 双列网格（max-content + 200px）双 sticky |
| 类型声明 | `.vitepress/env.d.ts` | ImportMetaEnv.DEV 声明（docs 包不开放 vite/client 类型） |
| 构建常量 | `.vitepress/config/shared.ts` | `vite.define.__DEMO_BASE__`，默认 `/unix-ui/playground/`，CI 可 `DEMO_BASE` 覆盖 |
| 部署脚本 | `scripts/build-demo.mjs`（新增） | `cli publish web` → 拷贝至 `packages/docs/src/public/playground` → 资源前缀兜底 → 生成 `pages-sub/<name>/<name>/index.html` 深链静态目录 → 复制 404.html |
| 部署 base | `packages/playground/manifest.json` | `web.router.base = '/unix-ui/playground/'`（同时解决 dev/prod 资源 base、vite preload 辅助函数、运行时路由） |
| 文档接入 | 组件文档 18 文件 | 既有 4 组件双语 8 文件 + 新撰写 cell/image/text/space/layout 双语 10 文件，全部 frontmatter `demo:` + ```` ```vue ```` fence；侧栏 zh.ts/en.ts 登记为 基础/反馈/展示 三组（字母序） |

### 6.2 踩坑记录

1. **VitePress 主题入口形态**：客户端把 default export 当 Theme 对象消费（`h(Theme.Layout)`），裸 defineComponent 会导致 `Theme.Layout === undefined` → 渲染崩溃（Invalid vnode type，#app 空）；正确形态 `{ extends: DefaultTheme, Layout: 组件 }`。
2. **onContentUpdated 标题匹配**：VitePress 标题内含 `header-anchor`（# 与零宽字符 U+200B），`textContent.trim()` 永远匹配失败，需克隆节点剥离锚点后再比较。
3. **publicDir 随 srcDir**：docs `srcDir: './src'` 时 publicDir 实为 `src/public` 而非根 `public/`，build-demo 拷错目录导致 dist 缺 playground（根 public 已删除）。
4. **纯 SPA 深链**：playground 产物深链依赖 404 兜底，但 vitepress preview（sirv）与 GitHub Pages 均无子目录 404 能力 → build-demo 为每个演示页生成真实 `index.html` 目录（SPA 入口 + base 绝对路径资源，任何静态托管直命中）。
5. **preview 缓存**：vitepress preview（sirv 生产模式）启动即建文件索引，dist 重建后需重启 preview 才可见新文件。
6. **uni-app x web base**：部署子路径必须走 manifest `web.router.base`（工具链会改写全部资源与 preload 逻辑），自建 vite.config 设 base 会导致 `Rollup failed to resolve import "/main"`。
7. **HBuilderX CLI 发行命令**：为 `cli publish web --project <绝对路径>`（`cli build web` 不存在）。
8. **dev-only 警告**：`Invalid vnode type: undefined at <VitePressApp>` 为 VitePress 1.6.4 + Vue 3.5.44 在本工程 dev 模式固有噪音——经排除实验（最简 `Layout: () => h(DefaultTheme.Layout)` 写法同样触发）证实与本次改造无关，渲染为 Comment 占位、无功能影响、PROD 构建物理上不含该 warn 分支。

### 6.3 验证结果（DoD）

- dev 双服务（docs 5173 / playground 5174，均带子路径 base）浏览器实测：三栏布局（1500px 模拟视口）、demo-phone 展示与 85% 缩放、playground iframe 正确 src、代码折叠中英交互（9/9 按钮、文案与 aria 切换）、API 区间无侵入、首页与普通页回归——全部通过，截图留档。
- `pnpm build:docs` 两次通过，无死链；zh/en 各 9 组件页齐全。
- `pnpm build:demo` 全流程通过（42 文件 + 深链目录 + 404.html）。
- vitepress preview 回归：zh/en 组件页 200、playground 真实资源 200、深链 `pages-sub/button/button` 200；生产环境 iframe src 为同站静态路径且内容真实渲染（标题「按钮 Button」）。

### 6.4 遗留事项

- 项目仓库公开后截图/图片外链可恢复（此前 404）。
- App 端真机验证（组件层既有遗留，与本次改造无关）。
- dev-only 的 Invalid vnode 警告为上游噪音，若后续升级 VitePress/Vue 版本可复测是否消除。

### 6.5 验收期增量：三轮视觉优化（2026-10-26 补充）

**问题**（用户三轮截图反馈）：轮 1 手机壳内缺仿真状态栏/导航标题栏且工具栏浅色异常；轮 2 机身顶部白条与双导航栏；轮 3 大屏三栏左右空白列、导航栏 logo 与菜单之间缺搜索框。

**修复**：

- 轮 1：重写 DemoPhone——工具栏改深色胶囊 `bottom: calc(100% + 8px)` 悬空分离于机身；壳内新增仿真状态栏（时间 + 灵动岛 + 信号/wifi/电池内联 SVG）与导航标题栏（返回箭头 + `page.title` 居中标题，badge 等无 frontmatter 标题页面回退 path）。
- 轮 2：白条源于旧工具栏叠压机身露出下方白色状态栏，随轮 1 悬空化消除；双导航栏真身为演示页自绘 demo-navbar 组件——组件加 WEB 端 `location.search.indexOf('navbar=0')` 自隐藏分支，文档站 iframe src 携带 `?navbar=0`，新窗口链接不带参数保留独立浏览页头。
- 轮 3：
  1. **左右空白列**：根因为默认主题 ≥1440px 居中钳制——`VPSidebar`、`VPNavBar.has-sidebar .title/.content/.divider`、`VPContent.has-sidebar` 五处 padding/width 按 `(100vw - --vp-layout-max-width)/2` 公式放大，且组件样式带 scoped 属性选择器。demo.css 以 `!important` 按 960–1440px 中屏基准值逐一还原；选择器形态必须与主题一致（`has-sidebar` 挂在 `.VPNavBar` 根节点而非 `.content` 上），且 `.VPSidebar` 的 width 钳制必须与 padding 一并覆盖（只改 padding 会出现 500px+ 宽侧栏压住内容）——首版两次未生效即败于选择器写错与漏项。
  2. **搜索框不渲染**：VitePress 构建期旗标 `__VP_LOCAL_SEARCH__` 只读顶层 `themeConfig`（`resolveSiteData` 不做 locale 合并），search 配置写在 zh locale 内导致编译期 `provider === ''`、`.VPNavBarSearch` 壳内无任何内容（height=0、无 console 报错）。修复：config/index.ts 顶层 themeConfig 补 `search.provider: 'local'`（仅喂构建旗标），各 locale 保留 translations 供运行时 useData 合并出中文文案；按钮渲染后天然位于 logo 与菜单之间（flex-grow:1 撑开），无需额外移位。
  3. 排查教训：`curl` 直取 `/@fs/` 模块产物不能作为 define 是否生效的判据（其替换结果与浏览器实际加载路径不一致，后者经优化/模块图转换）；旗标类问题必须以页面运行时表现（组件是否渲染、行为是否正确）判定。

**验证**：dev（5173）与生产 preview（4173）双环境、1910×1000 宽视口实测——搜索按钮 40px 高（「搜索文档」+ ⌘K 角标）位于 logo 右缘（272px）与菜单左缘（788px）之间；`.VPSidebar` padding-left 32px / width 272px，`.VPContent.has-sidebar` padding-left 272px / padding-right 0，导航 content padding-right 32px——三处全部命中预期，控制台无报错。`pnpm build:docs` 通过（无死链）；preview 重启后文档页与演示页深链均 200。
