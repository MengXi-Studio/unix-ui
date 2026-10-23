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
