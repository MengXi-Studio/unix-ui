# 实施日志索引

> 每完成一个任务（`workflow.md` 第四步），在此追加一行：日期 · 任务文档相对链接 · 一句话结果。

| 日期 | 任务文档 | 结果 |
| --- | --- | --- |
| 2026-10-21 | [unix-ui-monorepo-mxi-button](新增/2026-10-21/unix-ui-monorepo-mxi-button.md) | monorepo 搭建 + 首个组件 mxi-button，验证零配置默认主题与覆盖机制 |
| 2026-10-22 | [mxi-button-按压状态](新增/2026-10-22/mxi-button-按压状态.md) | mxi-button 新增按压反馈（hover-class + opacity 0.8 可主题覆盖），运行实测与双语文档完成 |
| 2026-10-22 | [mxi-button-loadingType](新增/2026-10-22/mxi-button-loadingType.md) | mxi-button 新增 loading-type（circular 默认 / spinner 花瓣对齐 Vant / clock 时钟指针三形态），动画句柄管理、运行实测与双语文档完成 |
| 2026-10-22 | [mxi-button-loadingType](新增/2026-10-22/mxi-button-loadingType.md) | spinner 对齐 Vant 修复（对照官方源码）：steps(12) 离散旋转 + 辐条亮度拖尾 + 2px/40% 几何，运行实测通过 |
| 2026-10-22 | [mxi-loading](新增/2026-10-22/mxi-loading.md) | 新增独立加载组件 mxi-loading（circular 弧段圆环 / spinner 花瓣拖尾，color/size/vertical/文案/图标插槽全量 API），运行实测与双语文档完成 |
| 2026-10-22 | [mxi-loading](新增/2026-10-22/mxi-loading.md) | easing 类型修复：UniAnimationOptionEasing 不支持 steps()（App 端不识别），spinner 改 linear + 25 帧阶梯关键帧等效离散旋转，mxi-button / mxi-loading 双组件落地，运行实测通过 |
| 2026-10-22 | [mxi-loading](新增/2026-10-22/mxi-loading.md) | 动画观感修复：spinner 容器 flex 居中（自定义图标公转→自转）、spinner 节奏 800ms→1200ms 跳格（用户拍板，mxi-button 同步），运行实测通过 |
| 2026-10-22 | [mxi-button-loading-refactor](新增/2026-10-22/mxi-button-loading-refactor.md) | mxi-button 加载图标重构为复用 mxi-loading（动画单处维护）；loading-type 移除 clock（breaking），mxi-loading 新增语义色名与 size 100%，运行实测通过 |
| 2026-10-22 | [mxi-button-loading-refactor](新增/2026-10-22/mxi-button-loading-refactor.md) | LoadingType 外置到 mxi-loading 同级 loading.uts（跨组件共享），mxi-button 相对路径导入消除双份定义，运行实测通过 |
| 2026-10-22 | [mxi-icon](新增/2026-10-22/mxi-icon.md) | 新增 mxi-icon 图标组件（257 个 Vant 对齐图标，IconName 联合类型 + ttf 随包 @font-face + icon 插槽 + click），sync 脚本 INCLUDE 扩展 static，浏览器实测与双语文档完成 |
| 2026-10-22 | [mxi-badge](新增/2026-10-22/mxi-badge.md) | 新增 mxi-badge 徽标组件（包裹/独立双形态，content/dot/max 截断/语义色+色值/四角 position/offset-x·y/show-zero/content 插槽），9 变量主题段，浏览器 8 项实测与双语文档完成 |
| 2026-10-23 | [playground-ux-router](改造/2026-10-23/playground-ux-router.md) | playground 接入 ux-router（路由表 + app.use + afterEach 守卫 + 按名导航），首页重构为品牌区/搜索/分组列表（Vant demo 风），新增 demo-navbar 自绘导航骨架全端统一滚动结构，浏览器实测与文档回填完成 |
| 2026-10-23 | [mxi-cell](新增/2026-10-23/mxi-cell.md) | 新增 mxi-cell + mxi-cell-group（单元格与分组，title/value/label、四向箭头、inset 圆角卡片、provide/inject 注册自动隐藏组内末线），浏览器十二项实测与文档回填完成（双语文档按用户要求暂缓） |
| 2026-10-23 | [mxi-image](新增/2026-10-23/mxi-image.md) | 新增 mxi-image（原生 image 增强封装，参考 Sard 结合 Vant：mode 直通、加载/失败占位、ucss transition 淡入、round 圆形、lazyLoad 透传），浏览器六项实测与文档回填完成（双语文档按用户要求暂缓） |
| 2026-10-25 | [mxi-text](新增/2026-10-25/mxi-text.md) | 新增 mxi-text（文本样式快捷封装，参考 Sard：8 语义色 + CSS 色值双模式、三档字号、truncated 单行省略、line-clamp 直通原生 max-lines、user-select 透传），浏览器实测含 max-lines=0 回归确认与文档回填完成（双语文档按用户要求暂缓） |
| 2026-10-26 | [mxi-space](新增/2026-10-26/mxi-space.md) | 新增 mxi-space（纯布局间距组件，对标 Vant：direction/wrap/fill/align 变体类、size 单值 gap + 数组 column-gap/row-gap 分写实测支持、align 默认链类组合显式化、align-self 收缩形态），浏览器八项实测与文档回填完成（双语文档按用户要求暂缓） |
| 2026-10-26 | [mxi-space](新增/2026-10-26/mxi-space.md) | 验收修复：mxi-button 移除根节点 align-self: flex-start（CSS 标准中子元素 align-self 覆盖容器 align-items，导致 mxi-space 的 align 对按钮失效）并新增各尺寸 min-width（mini 50 / small 60 / normal 76 对齐 Vant，兜底短文本等宽观感），HMR 复测居中/贴底/等宽全部通过 |
| 2026-10-26 | [docs-sard-demo-refactor](改造/2026-10-26/docs-sard-demo-refactor.md) | 验收期三轮视觉优化：DemoPhone 仿真状态栏/导航标题栏/深色胶囊悬空工具栏、演示页 navbar=0 嵌入去重、大屏 !important 五处还原中屏基准取消 1440px 居中钳制、本地搜索 provider 上移顶层 themeConfig 修复按钮不渲染，dev+生产 1910px 宽视口双环境实测通过 |
| 2026-10-26 | [docs-sard-visual-align](改造/2026-10-26/docs-sard-visual-align.md) | 文档站二轮对齐 Sard：DocHeader 页头（title/subtitle 驱动删正文 h1）、18 篇文档结构改造（介绍节/删引入节/h3 {#demo-*} 锚点 100 处）、demo-bridge 演示页接收端 + DemoPhone useData().hash 联动（lazy iframe 修复），build+preview 产物校验与联动三环证据验证通过 |
| 2026-10-26 | [docs-sard-visual-align](改造/2026-10-26/docs-sard-visual-align.md) | 验收修复两轮：aside 改 flex:0 0 auto 消除宽视口右侧空白条（width:100% 参与等权收缩根因）；index.ts 顶层 themeConfig 覆盖 shared 根因修复（logo/socialLinks/footer 从未渲染）+ aside-container 整体 sticky 实现右侧随滚动固定，build+preview 产物验证与浏览器 logo 实测通过 |
| 2026-10-26 | —（core 包 README 编写，参照 unix-request 格式） | packages/core 中英双语 README（readme.md 重写 + readme.en.md 新建）：为什么/特性/安装/快速开始/组件清单/在线演示/交流支持/文档/更新日志全节对齐参考格式；修正旧版 uni.scss @import vars.scss 错误用法为直接定义 $mxi-* 变量（循环导入红线），package.json files 补 readme.en.md，sync+check 通过 |
| 2026-10-26 | [component-prefix-m](改造/2026-10-26/component-prefix-m.md) | 组件前缀全局更名 mxi- → m-（用户拍板：主题变量随改 $m-*、插件 id 随改 m-ui-x）：115 文本文件替换 + 11 组件目录/uvue/字体文件/uni_modules 目录重命名，changelog 三处登记破坏性变更，sync+check、build:demo、build:docs 与 dev 浏览器实测（button/badge 渲染无报错）全通过 |
