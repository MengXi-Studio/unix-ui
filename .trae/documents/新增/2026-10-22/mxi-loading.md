# mxi-loading 加载组件 实施方案

## 需求

新增独立加载组件 `mxi-loading`：type（circular / spinner）、color、size、vertical、text-size、text-color、default 文案插槽与 icon 自定义图标插槽。本轮仅实现组件本身；mxi-button 的加载图标改造留待下一轮会话。

## 需求分析

- 组件源：`packages/core/components/mxi-loading/mxi-loading.uvue`（新增）
- 主题变量：`vars.scss` 新增 Loading 段（`$mxi-loading-*`，全 `!default`）
- 演示页：`pages-sub/loading/loading.uvue` + `pages.json` 注册（一页穷举 props / 变体 / 插槽）
- 文档：zh/en `components/loading.md` + `zh.ts` / `en.ts` 侧栏 + changelog 未发布段
- 影响面：纯新增，无既有代码改动（mxi-button 本轮不动）

## 伪代码设计

- 类型：`type LoadingType = 'circular' | 'spinner'`，默认 `'circular'`
- 结构：根 view（flex row / vertical 时 column，`align-self: flex-start` 收缩宽度）→ 图标容器（仅承载尺寸与旋转动画，icon 插槽 fallback 内放默认图标）→ 文案 text（`useSlots` 检测默认插槽，有内容才渲染，避免空节点多余间距）
- circular：弧段圆环为绝对定位子 view（inset 10%，直径 80% 匹配 SVG 圆环的视觉占比），顶部单色弧段 + 其余透明边框，容器 2s linear 匀速旋转
- spinner：12 条辐条（2px 固定宽 / 25% 高 / 40% 圆角 / 亮度 1→0.3125 拖尾 / `steps(12)` 离散旋转 0.8s），几何与动画参数沿用 mxi-button 已验证实现
- 颜色：color 为空走 `$mxi-loading-spinner-color`（#c8c9cc），非空 inline style（弧段 border-top-color / 辐条 background-color）
- 文案：间距 4px（水平左间距 / 垂直上间距），颜色 #646566、字号 14px 走主题变量，text-size / text-color inline 覆盖；size / text-size 纯数字字符串自动补 px
- 动画：onMounted 启动常驻旋转；watch type（flush: post）重启动画（easing 与时长随类型切换）；circular 2s / spinner 0.8s 为各自类型的默认节奏

## 疑问清单

Q1 circular 的弧线伸缩动画（Vant 为 SVG stroke-dasharray 动画）如何处理？
回答：uni-app x 无 SVG stroke 动画能力，采用 border-top 单色弧段近似（固定弧长 + 匀速旋转），弧段视觉占比与 SVG 版对齐；记录为技术取舍，无需阻塞（2026-10-22 自行决策）。

Q2 circular 旋转时长取 Vant 的 2s 还是沿用 mxi-button 现有加载图标的 0.8s？
回答：取 2s（独立组件按各自类型的标准节奏，mxi-button 优化轮次再决定是否统一）（2026-10-22 自行决策）。

## 实施记录

### 改动清单（2026-10-22）

1. **组件源** `packages/core/components/mxi-loading/mxi-loading.uvue`（新增）
   - Props：type（circular / spinner，默认 circular）/ color / size / vertical / text-size / text-color / custom-class / custom-style
   - 结构：根 view（flex row，vertical 时 column，`align-self: flex-start`）→ 图标容器（尺寸与旋转动画承载）→ 文案 text（`useSlots` 检测默认插槽，有内容才渲染）
   - circular：弧段圆环子 view（inset 10%，直径 80%），border-top 单色弧 + 其余透明，容器 2s linear 旋转
   - spinner：12 条辐条（2px 固定宽 / 25% 高 / 40% 圆角 / opacity 1→0.3125 拖尾 / `steps(12)` 离散旋转 0.8s）
   - 插槽：default 文案；icon 插槽以 fallback 方式包裹默认图标，替换后容器动画节奏不变
   - 工具：`addUnit` 纯数字字符串自动补 px（size / text-size 共用）
2. **主题变量** `packages/core/theme/vars.scss`：新增 Loading 段 5 个变量（spinner-size 30px / spinner-color #c8c9cc / text-color #646566 / text-font-size 14px / text-gap 4px，全 `!default`）
3. **同步**：`pnpm sync:uni-modules` → `sync:uni-modules:check` 一致
4. **演示页** `packages/playground/pages-sub/loading/loading.uvue` + `pages.json` 注册：六大分区穷举类型 / 颜色 / 大小 / 文案（横纵）/ 文字样式 / icon 插槽
5. **文档**：zh/en `components/loading.md` 新增；`zh.ts` / `en.ts` 侧栏加入基础组件组；changelog zh/en 新增「未发布 / Unreleased」段（含本轮 mxi-loading 与此前未记录的 mxi-button 按压反馈、loading-type 条目）

### 验证记录（2026-10-22）

- **编译**：dev server（5174）Vite 转换产物含 `steps(12)` 与 `useSlots()`，页面路由 200，无编译错误
- **浏览器实测**（127.0.0.1:5174/pages-sub/loading/loading）：
  - 实例 17 个（11 无文案 + 6 有文案），弧段 7 个，辐条 96 条（8 个 spinner × 12）
  - 动画参数：circular 型容器 `linear/2000`，spinner 型容器 `steps(12)/800`（按 DOM 序逐实例核对）
  - 文案节点仅在有默认插槽的实例渲染（`useSlots` 检测生效），内容均为「加载中...」
  - size inline 宽高 16px / 24px / 30px / 36px 逐项正确
  - 截图确认：弧段圆环 / 花瓣拖尾 / 颜色跟随 / 尺寸阶梯 / 横纵文案 / icon 插槽（❀ 替换默认图标且随容器旋转）全部符合预期
  - 控制台无报错
- **文档站**：`pnpm build:docs` 通过（死链检查包含新增双语文档与侧栏链接）

### 踩坑记录

- 演示页初版漏了演示项之间的水平间距（复用全局 `.row` 无 gap），首个 demo 项需自带 margin-right——演示页全局样式只有 page / container / card / section / row 基础类，间距类各页自理
- browser_evaluate 查询动画参数必须用极简单表达式逐条执行，组合脚本（数组方法链 + 嵌套函数）易返回空对象造成「无动画」误判；且 DOM 序与页面分区顺序一致，按序取前 N 个实例时先确认分区顺序再下期望值

### easing 类型修复（2026-10-22 第二轮）

HBuilderX 编译 warning：`Type '"steps(12)"' is not assignable to type 'UniAnimationOptionEasing'`。查官方类型定义（IUniElement.d.ts:2989）确认 `UniAnimationOptionEasing = "ease"|"ease-in"|"ease-out"|"ease-in-out"|"linear"|"cubic-bezier"`，**不含 steps()**——此前 Web 端 `getAnimations()` 返回 `steps(12)` 是 WAAPI 透传的假象，App 端原生 animate 不识别该值。用类型断言绕过会让 App 端行为不可预期，改为结构性修复：

- `startAnimation`：spinner 型改用 `buildTickKeyframes()` 生成 25 个阶梯关键帧（12 段 × 每段两帧同值夹逼 `offset: i/12` 与 `(i+0.98)/12`，末帧 360°@1）+ linear easing，段末约 2% 时长（约 1.6ms）完成过渡，视觉等效 steps(12)；circular 型保持两帧匀速
- 关键帧 `offset` 全端支持（App-Android 4.51 / App-iOS 4.53 / Web √），此方案跨端行为一致且类型合法
- 注释同步清理：steps(12) 表述改为「12 步离散旋转」，并移除「对齐 Vant」字样（mxi-button 同步处理）

验证记录（2026-10-22）：dev server 产物 easing 仅剩 `'linear'`；浏览器实测 spinner 型 `easing=linear duration=800 frames=25`（帧 0/1 为 0°@0 与 0°@0.0817，帧 2 为 30°@0.0833，末帧 360°@1），circular 型 `linear/2000/2 帧`；控制台无报错；HBuilderX 终端 warning 由用户侧确认消除。

### 动画观感修复（2026-10-22 第三轮）

用户反馈两个现象：① spinner 花瓣「卡顿 + 相对 circular 过快」；② 自定义图标不是自转而是「绕容器中心公转」。

分析（对照 Vant 源码 `Loading.tsx` + `index.less`）：

- **现象②是实现缺陷**：动画加在方形旋转容器上（Vant 同为容器转），对中心对称的默认图标（花瓣 / 弧环）公转 ≈ 自转看不出差别；但 uni-app x 的 view 默认主轴 column、交叉轴起始对齐，插槽内容（❀ 字符）渲染在容器左上角，图标中心偏离容器中心约 4px，旋转时公转轨迹肉眼可见。Vant（Web CSS inline 布局）图标基本居中故无此现象
- **现象①是 Vant 特性**：跳格感即 `steps(12)` 滴答式设计（非 bug），0.8s vs circular 2s 的 2.5 倍速差也是官方参数

改动：

- `.mxi-loading__spinner` 容器加 `justify-content: center; align-items: center`（插槽图标居中，公转 → 自转；默认图标全部绝对定位不受影响）
- spinner 型 duration 800 → **1200ms**（用户拍板「放慢到 1.2s 跳格」，保留滴答感、缓解速度差）；circular 保持 2s
- mxi-button 同款 spinner 花瓣同步 1200ms（`loadingType == 'spinner' ? 1200 : 800`），保持两组件花瓣节奏统一

验证记录（2026-10-22）：loading 演示页 spinner 型 `duration=1200`、circular 型 `duration=2000`；❀ 图标与容器中心偏差 ≈0px（computed justify-content / align-items 均为 center）；button 演示页 spinner 型 `duration=1200`、circular 型 `duration=800`；两页控制台无报错；`pnpm sync:uni-modules:check` 一致。
