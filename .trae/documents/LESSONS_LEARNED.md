# LESSONS_LEARNED

> 仅记录"只有运行起来才知道"的坑。前提：经验已通过运行验证（DoD 达成）。
> 路径说明：原位于 `.claude/rules/LESSONS_LEARNED.md`，2026-11-09 迁移至 `.trae/documents/`（历史任务文档中的旧路径引用以本文件为准）。

## 2026-10-21 unix-ui monorepo 搭建 + mxi-button（HBuilderX 5.26 / uni-app x VDOM + vapor 配置）

### 1. uni-app x web 编译必须有 index.html
- 现象：`cli launch web` 报「请确认您的项目模板是否支持vue3：根目录缺少 index.html」
- 原因：web 端是 vite 编译，index.html 是入口模板（内含 `<script type="module" src="/main">`）
- 结论：uni-app x CLI 工程根必须有 index.html（参照 hello uni-app x / unix-request 模板）

### 2. manifest.json 的 DCloud appid 与 CLI 校验
- 已被占用的 appid → 报「您不是这个应用的项目成员」
- 随意编造的未注册 appid → 报「appid 不存在，请在 manifest.json 中重新获取」，publish/launch 均中止
- **空字符串 `""` 可通过 launch web 编译**（新项目未获取 appid 时的正确形态）
- App 云打包仍需在 dev.dcloud.net.cn 正式获取 appid

### 3. uni.scss 的 @import 必须用 @/ 别名，不能用相对路径
- 现象：`@import './uni_modules/mxi-ui-x/theme/vars.scss'` 报 Can't find stylesheet
- 原因：uni.scss 会被注入到**每个组件**的 style 中编译，相对路径按各组件所在目录解析而非 uni.scss 所在目录
- 结论：uni.scss 中引用任何文件一律 `@import '@/xxx.scss'`

### 4. 组件 style 顶层 @import 主题变量 + 用户侧禁止引入（Vant 式默认主题，2026-10-21 实验修订）
- ~~旧结论「主题变量只能通过 uni.scss 注入」已被实验推翻~~
- 正确机制：组件 style **顶层无条件** `@import '../../theme/vars.scss'`（全 `!default`）→ 用户零配置即有默认主题
- 覆盖方式：用户在根 uni.scss **直接定义** `$mxi-*` 变量（**禁止**在 uni.scss 中 @import vars.scss——注入 + 组件内 import 同一文件会报循环 `[sass] This file is already being loaded.`）
- `!default` 语义与注入先后顺序无关：先定义后注入 → !default 跳过；先注入后定义 → 用户值覆盖
- 实验证据：零接入场景默认主题色渲染全部 PASS（rgb 精确比对）；覆盖场景编译产物中 5 处 `$mxi-color-primary` 全部穿透为覆盖值

### 7. @import 不能嵌套在 @if/@else 内（条件导入方案不可行）
- 现象：`@if variable-exists('x') { } @else { @import 'vars.scss'; }` 报 `This at-rule is not allowed here`（HBuilderX 5.26 web 编译链）
- 结论：uni-app x 的 sass 处理不支持 @import 位于控制指令内，也不要指望 variable-exists 做双保险；需要"默认值 + 可覆盖"直接用组件顶层无条件 @import（见第 4 条）

### 5. 本机多项目 dev server 端口冲突的隐蔽表现
- 现象：5173 被另一项目的 vitepress 占用后，本项目的 vite 仍日志输出 5173 且 lsof 显示两个进程都绑 5173（IPv6 双栈语义），但 localhost 实际响应被抢占，页面内容是另一个项目
- 结论：共用开发机时在 manifest.json `web.devServer.port` 显式指定端口（如 5174）；验收前先 `lsof -i :端口` 确认进程归属
- 另：修改 uni.scss 后必须重启 dev server（编译期注入不热更新）

### 6. UniElement.animate 关键帧写法（loading 旋转）
- 签名：`el.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 800, iterations: Infinity, easing: 'linear' })`
- `iterations: Infinity` 表示无限循环（官方文档确认）；ucss 无 @keyframes、无伪元素，动画一律走 animate API，0.5px 细边框用绝对定位 view + `transform: scale(0.5)`
- watch 监听 props 切换启动动画时用 `{ flush: 'post' }`，确保 v-if 渲染后再取 ref

### 8. scale(0.5) 细边框层的两个致命细节（2026-10-21 运行实测）
- **transform-origin 必须显式设 `0 0`**：默认中心原点下，200% 元素 scale(0.5) 后缩为中心对齐的半尺寸框，视觉上偏移半个按钮宽高（110×44 按钮偏移 55px/22px，getBoundingClientRect 实测），边框悬浮在按钮右下而非贴边；加 `transform-origin: 0 0` 后 rect 差值归零。该属性全端支持（Web 4.0 / Android 3.9 / iOS 4.11 / HarmonyOS 4.61），playground 要求的 ^5.08 无兼容顾虑
- **根节点 border-width 必须清零**：hairline 按钮若保留根节点 1px 实色边框，会与 0.5px 细边框层叠加出双线；用 `--hairline` 变体类 `border-width: 0` 只保留缩放层
- **hairline 层圆角要 ×2**：元素是父容器两倍大，`border-radius` 不同步两倍的话缩放后视觉圆角只有根节点一半
- 排查手法：临时把 border-width 改粗（如 10px）截图，偏移一目了然；getBoundingClientRect 对比 root 与 hairline 层的视觉 box 是决定性数据

### 9. Vant spinner 对齐三要素（2026-10-22 运行实测，steps 结论已修正）
- Vant 花瓣加载的真实观感来自三件事叠加：容器 12 步离散旋转（滴答感）+ 辐条 opacity 按 `1 - 0.0625 × (i-1)` 递减（彗尾拖影，首条 1.0 → 末条 0.3125）+ 2px 固定宽 / 40% 圆角辐条（细花瓣）；缺任何一步就是"风扇花"
- 30° 均布 + 离散旋转是自相似设计：每跳一格亮部前移一瓣而拖尾图案不变，这是离散旋转与亮度梯度必须配合使用的原因，亮度梯度单独存在只是静止渐变图案
- **UniElement.animate 的 easing 不支持 steps()**：官方类型 `UniAnimationOptionEasing = "ease"|"ease-in"|"ease-out"|"ease-in-out"|"linear"|"cubic-bezier"`（IUniElement.d.ts:2989），传 'steps(12)' 产生类型 warning 且 App 端原生不识别，Web 端生效只是 WAAPI 透传的假象——**跨端实现离散旋转必须用 linear + 阶梯关键帧**：每段两帧同值夹逼（`offset: i/12` 与 `(i+0.98)/12`），段末约 2% 时长（约 1.6ms）完成过渡，视觉即硬切
- 关键帧 `offset` 全端支持（App-Android 4.51 / App-iOS 4.53 / Web），`UniAnimationKeyframe` 数组可由运行时循环构造（25 帧 = 12 段 × 2 + 收尾帧）

### 10. 插槽能力边界（mxi-loading 运行实测，2026-10-22）
- `useSlots()` 在组件内可用，`slots.default != null` 能正确检测默认插槽是否传内容（17 实例实测：11 无文案不渲染 text 节点、6 有文案渲染）——这是避免空插槽节点产生多余 margin 的唯一手段
- 具名插槽 fallback 可用：`<slot name="icon">默认图标</slot>` 未传插槽时渲染 fallback，传入时整体替换；fallback 内的 v-if/v-for 与 ref 工作正常（ref 仍属组件自身作用域）
- 组件根节点用 `align-self: flex-start` 收缩宽度贴内容，否则块级 view 默认撑满父容器导致图标与文案布局失控

### 11. uvue 中 view 的 overflow 默认值是 hidden（2026-10-23 运行实测）
- 现象：mxi-badge 徽标中心压角（`transform: translateY(-50%) translateX(50%)`）只显示左下四分之一，其余被裁
- 根因：官方 CSS 文档默认值表明示 **uvue 平台 overflow 默认 `hidden`**（W3C 默认为 visible），且该默认全端一致（Web 端同样生效）；playground 全局/演示页无任何显式 hidden 声明，computed 值仍全为 hidden
- 修复：悬浮/压角式组件自身根节点必须显式 `overflow: visible`；且**直接外层的「收缩贴合」容器**（如 flex 行内子项包裹徽标）会继续裁剪超出组件根的部分，也需要显式 visible——外层若有 padding/间距缓冲（徽标未超出其盒子）则天然安全
- 排查手法：browser_evaluate 对目标元素及其祖先链取 getComputedStyle(el).overflow，定位真实裁剪层（并非每层 hidden 都裁，只有徽标矩形真正超出其盒子的层才裁）

## 2026-10-23 mxi-cell + mxi-cell-group（运行实测）

### 12. uni-app x web 端合成事件不触发 uvue 组件事件
- 现象：`el.click()` 与 `dispatchEvent(new MouseEvent('click', {bubbles: true}))` 对 `.mxi-cell` 根节点执行后组件 click 回调无输出，而真实鼠标点击同一元素正常触发
- 结论：uni-app x web 端组件事件系统只响应真实用户交互（trusted event），**自动化测试不能用合成事件验证组件事件回调**；元素定位可用 `document.querySelectorAll('.mxi-cell')`（类名原样保留），但事件验证必须走真实点击
- Playwright 快照（accessibility tree）对 uni-app x 自定义元素不可靠（仅返回 3 个节点 0 交互元素），带事件验证的实测优先依赖真实点击可达的页面结构

### 13. mxi-icon 的 color / size prop 无法接 SCSS 变量，组件内主题色联动走 custom-class
- 原因：color / size 是运行时字符串 prop，SCSS 变量是编译期替换，两者无法打通；硬编码色值会绕过 `$mxi-*` 覆盖契约
- 方案：宿主组件样式表定义色类（如 `.mxi-cell__arrow-text { color: $mxi-cell-right-icon-color }`），经 `custom-class` 挂到 mxi-icon 根 text——文字样式合规落在 text 类上，用户覆盖 uni.scss 变量即生效（mxi-cell 已验证）

### 14. provide/inject + reactive 数组实现「组内末位感知」可行（首帧即正确）
- `reactive<string[]>([])` 在 uni-app x 编译下 push / splice 正常触发 computed 重算（Web 端动态增删实测末线自动重算 PASS）；class 字段持 reactive 数组、inject 泛型 `inject<CellGroupContext | null>(KEY, null)` 均可用（ux-router 先例同构）
- **注册必须放 setup 同步执行而非 onMounted**：子组件 setup 先于父渲染完成，首帧即为正确末位；onMounted 注册会有一帧末线闪现
- 注销挂 onUnmounted，v-for pop / v-if 增删后末位自动重算

### 15. 单线 hairline 用 scaleY(0.5) 而非 scale(0.5)
- 整圈边框（button）用 200% 尺寸 + `scale(0.5)` + origin `0 0`；单条分隔线若照搬会 x 轴减半
- 正确写法：绝对定位 + `height: 1px` + `transform: scaleY(0.5)`；origin `0 100%` 贴底、`0 0` 贴顶（单轴缩放，宽度不受影响）

### 16. 组件淡入优先 ucss transition 而非 UniElement.animate（2026-10-23 运行实测）
- ucss 支持 `transition-property / transition-duration / transition-timing-function`，opacity 过渡跨端可用（mxi-image 淡入 web 端实测正常）
- 模式：状态驱动 inline style（loading 态 `opacity: 0`，成功后移除）+ 过渡类，比 animate 关键帧少两类风险——App 端 UniAnimationKeyframe 对 opacity 字段的兼容性、加载完成瞬间到动画启动之间的首帧闪烁窗口（transition 随样式变更自动触发，无 JS 时序问题）
- 适用边界：单属性两态过渡用 transition；多关键帧离散动画（如 spinner 12 步旋转）仍走 animate API

## 2026-10-26 mxi-row + mxi-col（Layout 栅格，运行实测）

### 17. scss 批量生成百分比档位类用「@for + 乘常数」而非 `/` 除法或 @use（mxi-col 24 档矩阵实测）
- 场景：24 栅格需要 `.mxi-col--1` ~ `--24` 与 `--offset-1` ~ `--24` 共 48 个百分比档位类，手写不可维护
- 三个坑：scss `/` 除法触发 dart-sass deprecation warning（slash-div 弃用）；`@use 'sass:math'` 必须位于文件最顶，但 uni-app x 编译链会把 uni.scss 内容 prepend 到组件 style 头部，@use 位置不可控有编译风险；手写 8 位小数（4.16666667%）不可维护
- 验证通过的写法：`@for $i from 1 through 24 { .mxi-col--#{$i} { width: $i * 4.16666666667%; } }`——类名插值 `--#{$i}` 在 uni-app x 编译链正常展开为扁平类，乘法无弃用警告，24 档合计 100.0000000001% 在亚像素容差内不触发换行（flex-wrap 场景实测 PASS）
- 精度来源：100/24 = 4.166666666666667，取 11 位有效数字即可

### 18. uni.showToast 单例覆盖会让「组件事件验证」误判（layout 演示页实测）
- 现象：点击 mxi-col 色块后 toast 显示「row click」而非「col click」，疑似 col 的 emit 未触发；实际 col 与 row（冒泡）都触发了，row 的 toast 后触发覆盖了 col 的（toast 单例），从最终 toast 无法区分
- 验证手法：在子元素回调内 `event.stopPropagation()`（uni-app x web 端事件对象支持）隔离冒泡后再 toast，col / row 两个点击行为即可独立观测；组件本身不加 stopPropagation——「子触发后父也触发」是 Vant 同款语义
- 关联第 12 条：uni-app x web 端组件事件只认真实点击，toast 验证必须与冒泡链路一起分析

## 2026-10-26 文档站模拟器联动（运行实测）

### 19. VitePress 同页 hash 联动只能用 useData().hash（route.data 无 hash 字段）
- PageData 类型没有 hash 字段，`useRoute().data.hash` 恒为 undefined——在 computed 里 `.startsWith()` 直接抛 TypeError；响应式 hash 在 `useData()` 返回值上（data.js 监听 hashchange 更新）
- 点击 outline 锚点 → router pushState + dispatchEvent(HashChangeEvent) → hashRef 更新，同页 hash 变化全程响应式可达；`location.hash = '...'` 赋值走同一事件链，可与点击互换

### 20. display:none 容器里的 iframe 视口为 0×0，lazy iframe 永不加载
- 模拟器 iframe 挂在媒体查询 display:none 的容器里：`loading="lazy"` 使 iframe 永不加载（无可见性触发），postMessage 全部发进 about:blank；即使去掉 lazy，display:none 下 window.innerWidth/innerHeight=0、全链 clientHeight=0，scrollIntoView 无效
- 排查手法：接收端探针 `console.log(window.innerWidth, window.innerHeight)` 一行定位；跨域 iframe 内部状态不可读时，在顶层页面创建「等尺寸同源 iframe」复现（同源可直读 contentDocument scrollTop），用数据替代截图判定

### 21. 浏览器自动化代理视口受限时的验证策略
- browser_use 代理无法设置 viewport（实测默认 1134px），window.open 被序列化错误拦截；≥1440 媒体查询样式无法直接观测
- 替代策略：①hash 驱动交互用 `location.hash` 赋值代替 outline 点击（DOM 点击在代理环境易因快照 ref 失效而抖动，两者走同一响应链）；②跨端消息链路按「发送端日志 → 消息到达日志 → 同源等尺寸 iframe 内 scrollTop」三环拆分验证；③console 采集能捕获跨域 iframe 内 frame 的日志，接收端打点可见

### 22. VitePress config 对象展开只合并顶层键，嵌套 themeConfig 字面量会静默覆盖 shared
- `defineConfig({ ...sharedConfig, themeConfig: { search } })` 中顶层 themeConfig 字面量整体替换 sharedConfig.themeConfig——logo/socialLinks/footer 静默丢失，症状是产物 HTML 中 `<img>` 计数为 0 且无报错
- 继承写法：`themeConfig: { ...sharedConfig.themeConfig, search: {...} }`；判别手法：产物 HTML grep 预期元素计数，配置「写了但没渲染」先查顶层键覆盖再查组件条件

### 23. sticky 吸附范围由包含块高度决定，全程固定要把 sticky 上移到容器层
- aside 内部子项（模拟器/大纲）sticky 的吸附范围只有 aside 内容高（~850px），正文几千 px 滚过即整块滚出视野
- 正确做法：把 sticky 放到 aside-container 上（其父 .aside 被 flex stretch 拉至正文高度，吸附范围覆盖整个滚动），内部子项回归 static；等价地，grid 布局中 sticky 项的约束矩形是其 grid area，行高 auto 时 sticky 无行程

## 2026-10-26 工作流适配与编译器警告

### 24. 可空 prop（`T | null`）触发 TS2769 编译警告，属 uni-app x 编译器生成代码缺陷（HBuilderX 5.26）
- 现象：类型式 `defineProps<Props>()` 中 `width?: string | number | null` + withDefaults 默认 `null` 的可空 prop，dev 编译逐个报 `TS2769: No overload matches this call`（全库 11 处全报：m-cell ×2、m-image ×3、m-space ×2、m-row ×3、m-col ×1）；build 模式仅显示首处（m-cell clickable 60:4），勿据 build 日志误判「只有单类型联合触发」
- 根因链：UTS 编译器把可空 prop 转换为运行时声明 `{ type: [String, Number, null], required: false, default: null }`——把 null 塞进 type 数组；Web 端 TS 检查依据标准 @vue/runtime-core.d.ts（`PropConstructor[]` 不允许含 null），生成代码不满足其依赖的类型定义。原生端（Kotlin/Swift）不走此 TS 检查，不受影响
- 处置：源码不改——三态语义（null = 未设置）是合理 API 设计，改两态/哨兵值/全库运行时声明均属扭曲；Vue 运行时对 type 数组含 null 实际宽容（页面渲染与交互实测正常），warning 仅控制台噪音。升级 HBuilderX 后若编译器修复则自动消失，届时复查即可

## 2026-10-26 演示页产物部署链路（线上预览 404 修复，运行实测）

### 25. 演示页产物必须本机 build:demo 后入库，CI 不会构建 playground
- 根因：deploy-docs.yml 只跑 `build:docs`，HBuilderX 无 Linux 版导致 CI 无法构建 playground，线上 `/unix-ui/playground/**` 深链全 404（文档站手机预览 iframe 显示 uni-app x 404 页）
- 约定：playground 演示页变更后必须 `pnpm run build:demo` 重新产出并提交 `packages/docs/src/public/playground/`（产物 gitignore 已移除），push 后 CI 随文档一起部署
- 产物自检：`pages-sub/<分类>/<name>/<name>/index.html` 深链目录 + 根 404.html 必须存在；构建日志「资源路径补前缀：0 个文件」属正常（vite base 已生效，rewriteBase 是兜底）
- 本地验收链路：`node packages/docs/node_modules/vitepress/bin/vitepress.js preview` → curl 深链/docs 页/资源均 200 → browser_evaluate 读 iframe 内文本确认渲染按钮演示而非 404

### 26. HBuilderX CLI publish 会静默改写 manifest.json（appid 重置 + vapor 配置移除）
- `cli publish web` 构建后 manifest.json 被自动改写：appid `__UNI__1927897` → `__UNI__F1AA560`，`"vapor": true` 与 `"vapor-render-target": "bytecode"` 被删除，编译退回 VDOM 模式（日志「VDOM模式」可证）
- 处置：build:demo 后必须 `git diff packages/playground/manifest.json` 检查并还原基座配置；该文件属工程基座，改动需向用户说明
- 本机 CLI 位置：`D:\HBuilderX\cli.exe`，不在 PATH，需设 `HBUILDERX_CLI` 环境变量供 build-demo.mjs 的 resolveCli() 解析

### 27. 本机运行环境的两个拦截：沙箱临时目录与 Device Guard
- HBuilderX CLI 编译需在 `E:\_tmp_*` 等工作区外路径写临时文件，沙箱内直接失败（TRAE Sandbox Error: hit restricted），须沙箱外执行
- Windows Device Guard 拦截 pnpm 自管理 exe（`AppData\Local\pnpm\package-manager-store\**\@pnpm\exe\pnpm.exe`），`pnpm` 命令无法启动；替代：`npx -y pnpm@10.31.0 <script>`（node 入口不受限）或对 vitepress 等直接 `node <bin>.js`
- 永久修复（2026-10-26 实测通过）：exe 形态全局 pnpm（`@pnpm/exe`，shim 直接跑 pnpm.exe）是拦截根因——`npm rm -g pnpm` 后 `npm i -g pnpm@10.31.0` 换成 JS 形态（shim 走 node + pnpm.cjs），并 `pnpm config set -g manage-package-manager-versions false` 防止自切换回 store exe；残留被锁临时目录无害

### 28. 绝对定位操作条 + 容器高度塌缩 = 按钮"消失"（折叠代码块实测）
- 现象：代码块收起后「展开代码」按钮不可见不可点，看似功能丢失只能刷新
- 根因链：折叠按钮绝对定位不占流式高度 → pre 隐藏后容器无流式内容高度塌缩为 0 → 容器 `overflow-x: auto` 使 overflow-y 计算为 auto，绝对定位子元素被裁剪
- 修复：collapsed 态补 `min-height: 36px`（按钮 top 8px + 行高 20px + 下留 8px）；同类"绝对定位工具条"组件必须核查宿主塌缩场景

## 2026-10-26 云打包 Android Kotlin 编译失败（运行实测）

### 29. UTS→Kotlin 局部函数按源码顺序生成，"先用后声明"在 App 端编译失败
- 现象：云打包报 `Unresolved reference 'addUnit' / 'sizeValue'`，Web 端编译运行完全正常
- 根因：script setup 内的 `function` 声明生成 Kotlin 局部函数（`fun gen_xxx_fn` + `val xxx = ::gen_xxx_fn`），Kotlin 局部函数不允许前向引用；JS 函数提升掩盖了声明顺序问题
- 判别法：本地生成的 `.kt`（unpackage/resources/app-android）中声明行号 > 使用行号即中招；m-badge 的 addUnit 先声明后使用故未报错，m-icon / m-loading / m-image 均先用后声明全报
- 修复：helper 函数声明移到首次使用之前（仅调整顺序，Web 行为不变）
- 判别法补充（2026-11-01 m-calendar 案例）：**watch / onMounted 等回调也是局部函数**，回调体内调用后声明的函数同样报 `Unresolved reference`（m-calendar 的 watch 调 getSelectedDate）；watch 整体移到全部被调函数之后即可。同批案例：m-input 四个原生事件桥接函数先于 handleFocus/handleBlur、m-toast 的 setTimeout 回调调 closeToastInternal、演示页 fmtValue 调 fmtDate
- 关联：本地 `.kt` 与云端报错行号逐行吻合（m-badge.kt:35、demo-navbar.kt:30 精确命中），可把云端错误直接映射回本地生成产物定位

### 64. 云端「生态标准写法全挂」是基座不配套的判别特征，勿改源码（2026-11-01 云打包复盘）
- 现象：云端报 9 处 `watch` 源 lambda `Return type mismatch: expected 'Unit', actual X`（X = Date?/String/Boolean/Any 各不相同），另有大面积 slot 名 unresolved、`Animation`/`cancel` unresolved、`Function invocation 'onXxx(...)' expected`
- 决定性证据：本地产物中**全部 10 处** `watch(fun(){ return props.X }, cb)` 在云端无一幸免、零对照组——`watch(() => props.xxx, cb)` 是 uni-app x 官方标准写法（生态通用），若基座配套不可能全挂；报错 actual 类型五花八门与写法无关，恰是运行时 watch 签名与生成代码不匹配的表现
- 结论：与 slot unresolved、Animation/cancel 同根因——云端基座 SDK 版本与本机编译器（5.34 alpha）产物不配套，云打包勾选配套 alpha 基座即消除；**不要把 watch 源改写成 Ref 传参等「兼容形态」**（LESSONS #31 同则）

### 65. String.charCodeAt 返回可空 Number?，App 端参与运算必须先空安全短路（2026-11-01 云打包实测）
- 现象：`ch.charCodeAt(0)` 直接参与 `>=` 与 `-` 运算，云端 kotlinc 报 `Operator call is prohibited on a nullable receiver of type 'Number?'`（一处源码炸出 9 条错误）；Web 端 JS 语义无感，编译运行全正常
- 修复：紧跟 `if (code == null) { return -1 }` 短路，后续运算自动非空；语义上空串/越界取码本就应归入「非法字符」分支
- 关联：hexToRgba 的十六进制解析链（calendar.uts hexDigitValue）

### 66. 两个 UTS→Kotlin 泛型/类型坑：嵌套数组字面量与 ClassString 传参（2026-11-01 云打包实测）
- `[[]]` 嵌套字面量：`const result: number[][] = [[]]` 编译为 `_uA(_uA()) as UTSArray<UTSArray<Number>>`，`as` 只作用外层，内层空 `_uA()` 无类型上下文报 `Not enough information to infer type argument for 'E'`；修复：内层数组先声明带注解变量再入数组（`const firstRow: number[] = []` → `[firstRow]`，产物生成 `val firstRow: UTSArray<Number> = _uA()` 推断即有依据）
- `string.ClassString` prop 不能隐式传给 type 定义的 `string` 字段：Kotlin 端两者类型不同（actual Any vs expected String?），报 `Argument type mismatch`；修复：显式 `props.customClass as string`（判 null 后转换）。仅当 ClassString 值流入 UTS type 结构体字段才需要，拼 class 字符串场景无此问题

### 30. UTS 接口方法参数不支持默认值，可选参数生成必填 Kotlin 参数
- 现象：`router.back()` 报 `No value passed for parameter 'delta'`（ux-router 接口声明 `back(delta?: number | null)`，实现 `back(delta: number | null)` 无默认值）
- 实测约束：UTS 接口方法签名不支持初始值（`delta?: T = 1` 报 "Parameter cannot have question mark and initializer"，`delta: T = 1` 报 "Expected '{', got ')'")；实现带默认值则生成 `override fun back(delta: Number? = 1)`，违反 Kotlin「override 不允许自带默认值」
- 修复：调用端显式传参（`router.back(1)`）——跨版本唯一可靠写法；第三方 UTS 插件的可省略参数一律显式传值

### 31. 云打包/基座 SDK 版本必须与生成端 HBuilderX 版本配套
- 现象：本地 5.26 生成的 Kotlin 在云端 kotlinc 报 Unresolved reference（`slots.default`、`Animation`、`watch` 泛型 getter、`_uA` 空数组推断）——代码生成一致而运行时 SDK 旧
- 依据：HBuilderX 导出日志明示「wgt 文件由 HBuilderX 5.26 版本生成，运行的基座 sdk 也需配套相同版本」（ask.dcloud.net.cn/article/35627）
- 处置：确认本地 HBuilderX 渠道（alpha / 正式），云打包与离线打包基座用同版本；本地源码侧不做旧 SDK 兼容改写（slots 检测、Animation 句柄、watch getter 均为官方新 API，改写即失配）

## 2026-10-27 m-overlay（Overlay 遮罩层，运行实测）

### 32. Web 端组件根节点用 v-if，从注释节点切换创建后 attrs 透传事件丢失
- 现象：m-overlay 根节点 `<view v-if="mounted" @click="onClick">`，lazyRender 默认 true 时初始不渲染；点击打开后遮罩显示正常，但**根元素的 click 永不触发**（子元素 click 正常、同页面 m-button 根 view 的 click 正常）
- 根因：uni-app x web 端（uni-h5-vue 魔改 runtime），组件模板根节点从注释 vnode 切换为元素 vnode 后，模板编译的 `onClick` 依赖组件 attrs 透传（uni-h5 内置 View 组件渲染函数不直接绑定用户事件，全靠 fallthrough）链路在动态创建分支上丢失；根节点 DOM 常驻（初始就渲染）则透传正常
- 修复：根节点改 `v-show`（DOM 常驻，显隐由 visible ref 控制），自造的 lazyRender prop 直接删除——查证 Vant Overlay 本无 lazy-render（那是 popup 的 prop），属于过度设计且正是事故根因
- 诊断路径（可复用）：① curl `组件路径?import` 看编译产物 patchFlag/事件绑定 → ② grep `uni-h5-vue/dist-x/vue.runtime.esm.js` 的 patchEvent/_vei → ③ 浏览器 `Object.getOwnPropertySymbols(el)` 找 `Symbol("_vei")` 检查 onClick invoker（**`el._vei` 字符串访问恒为 undefined，veiKey 是 Symbol**）→ ④ elementFromPoint 命中测试 → ⑤ 逐层挂 capture/bubble 探针看事件传播在哪层中断
- 对照判别：合成点击（`el.click()` / `dispatchEvent`）与真实点击在 DOM 层等价（uni-h5 不检查 isTrusted）；合成点击能完整触发 invoker→emit→页面回调即链路健康

### 33. 浏览器自动化 agent 的验收报告必须带原始数据，否则默认存疑
- 教训：本次排查中 browser agent 多轮「PASS/FAIL」结论与事实相反（误报遮罩已关闭、误报 _vei 不存在、点击方式不透明），浪费多轮排查方向
- 规约：给 agent 的指令必须要求「每步返回原始输出（computed 值 / 日志原文 / 断言值），禁止臆测」；关键判断用可复核数据（console.log 输出 + browser_console_messages 原样取回，agent 的 evaluate 返回值可能被丢弃）
- 工具坑：browser_evaluate 的返回字符串可能不回传（写入 `window.__x` 再单独读取可绕过）；browser_click 需要 snapshot 的元素 ref，坐标点击与 ref+offset 点击行为不一致；「真实输入 vs 合成点击」在该环境下不可靠，DoD 的人工点击验收应交给用户完成

## 2026-10-27 m-popup（Popup 弹出层，运行实测）

### 34. 自动化验收脚本的「探针-断言时序错位」会制造组件假 FAIL
- 现象：Playwright 九场景矩阵中 T3/T4 两项稳定 FAIL（visOvCount=1，弹层"关不掉"），但单场景复现脚本全部通过，一度怀疑 hideTimer 竞争 / 多实例状态污染
- 根因：check 断言引用的快照变量 s 是「点击前」probe 的结果，执行关闭点击后未重新取快照——点击后 700ms 组件实际早已关闭，FAIL 是脚本引用了过期数据；dump elementFromPoint + 全 overlay computed display 一锤定音（`visOvs: []`）
- 规约：每次交互（click / 等待）之后、断言之前必须重新取快照，断言变量与其数据时刻一一对应；「单场景过、全流程挂」优先怀疑脚本自身状态管理而非被测组件
- 排查利器：在 FAIL 断言前临时 dump `elementFromPoint` 命中链 + 全部目标节点 computed display/opacity，一次运行即可定性「组件没关」还是「快照过期」

### 35. browser_use 无法交互 uni-app x Web 页面，playwright-core + 系统 Chrome 是可靠替代
- 现象：browser_use 四轮无法触发任何弹层——browser_snapshot 对 uni-app x 页面仅返回 3 个文本节点（无交互元素 ref）；browser_click 强制要求 ref 且无坐标点击能力；elementFromPoint 证实按钮中心可点（命中 SPAN）但自动化就是触达不了
- 替代方案（/tmp 下建独立 npm 工程即可，复用系统 Chrome 免下浏览器）：
  ```bash
  npm i playwright-core
  ```
  ```js
  const { chromium } = require('playwright-core')
  const browser = await chromium.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  })
  ```
- 关键优势：`locator.click` 走 CDP 真实输入（trusted event，等价人工点击）；CSS 选择器 + hasText 文案定位不依赖 a11y 快照；`page.mouse.click(x, y)` 坐标点击可测遮罩空白区；`page.evaluate` 全量探针（computed 样式 / borderRadius / elementFromPoint）原始数据可复核；`page.on('console' / 'pageerror')` 捕获运行日志与业务日志（POPUP-EVENT）
- 断言细节：uni-app x Web 端页面 body 的 overflow 基线可能是 `hidden auto`（页面自身样式），滚动锁断言必须与 T0 基线对比，不能硬编码 `''` / `'visible'`；transition 后的断言等待 ≥ 2×duration（本例 300ms 动画等 600–700ms）

## 2026-10-28 m-divider（Divider 分割线，运行实测）

### 36. Web 端 slot 裸 text 编译为纯文本节点 + style attr 色值规范化（自动化探针两连坑）
- 现象 1：slot 内无样式 `<text>文本</text>` 在 Web 端编译产物中不是 uni-text 元素，而是**纯文本节点**（DOM 形如 `</uni-view>文本<uni-view>`）——querySelector('uni-text') / 类选择器探针扑空，texts=[]
- 断言方案：文本继承样式（color / font-size / line-height）断言落在**父元素** getComputedStyle 上（继承在父级 computed 可见）；「slot 是否有内容」用 `childNodes` 过滤 `nodeType === 3` 计数（bareTextCount）
- 现象 2：外部 `:style="'color: #1989fa'"` 透传到组件根节点后，style attribute 中色值被规范化为 `rgb(25, 137, 250)`——`styleAttr.includes('#1989fa')` / `includes('1989fa')` 永不命中，改用 rgb 形式匹配
- 推论（style / class 透传）：组件根节点无 v-if 时外部 style 直达根（LESSONS #32 仅覆盖根节点 v-if 场景），`color` / `font-size` / `line-height` 经继承到达 slot 裸文本——m-divider 单实例文本色定制可用；但线是子节点不吃继承，单实例线色走 `$m-divider-border-color` 主题变量（ucss 无 inherit）

## 2026-10-28 m-grid（Grid 宫格，运行实测）

### 37. uni text Web 端默认 16px 截断 font-size 继承链，跨组件字号 / 颜色联动必须走 custom-class 落类
- 现象：m-grid-item 在 icon 区外层 view 上设 font-size，内部 m-icon 字号不跟随——Web 端 uni-text 元素自带 16px 默认字号，继承链在 text 节点被截断
- 根因：m-icon 基类无 font-size 声明，浏览器对 uni-text 的 UA / 默认样式（16px）直接生效，优先于继承（继承只在无任何声明时兜底）
- 修复：宿主组件定义字号类（`.m-grid-item__icon-text { font-size: $m-grid-item-icon-size }`）经 `custom-class` 挂到 m-icon 根 text；m-cell__icon-text 先例同构。字号 prop 显式传入时再以 `:size` inline 覆盖主题类
- 规约：凡「宿主组件包 m-icon 且想用 `$m-*` 变量控制其字号 / 颜色」的场景一律 custom-class 落类（关联 #13：color / size 是运行时字符串 prop，SCSS 变量是编译期替换，两者打不通）

### 38. 容器 + 格子拼完整表格边框：外框线必须有人承担，「行尾 / 末行去线」逻辑反而漏边
- 场景：宫格 border 需要「格子间内线 + 外框整圈」。Vant 靠格子 `::after` 画右线 + 下线、行尾格去右线 / 末行格去下线；照搬去线逻辑在**单行 / 单格** grid 下会把外框右边与底边全部去掉（每格都是行尾 + 末行），无线可承担——首跑截图定性
- 正确方案：**去线改拼线**——容器无条件画 top + left 两条线，全部格子无条件画 right + bottom（border=true 即显示）：内线由相邻格共享，外框由行尾格 / 末行格承担，任意行列数下完整表格自然拼出
- 规约：拼线类方案的显隐矩阵必须包含「单行 / 单格」边界用例；「某侧线由谁承担」先列出全部线段归属表再写显隐条件，禁止只对齐参照实现的去线规则

### 39. gutter 按各行实际列数平均会导致不满行与上方行错位，必须按满行格位分配
- 现象：m-row / m-grid-item 的 gutter 分配按「行内实际列数」平均（avg = gutter×(n-1)/n，n 取每行实际格数），末行不满时分配漂移——首行 4 列首格白盒 25%-7.5px、末行 2 列首格白盒 25%-5px，同格位上下行错位；用户实测投诉「个数没凑齐时对不齐、宽度不对」
- 根因：平均分配的分母依赖运行时行结构，同一容器不同行列数不同 → 同格位 padding 不同。Vant Row 源码同构（lib/row/Row.js 的 averagePadding 分母取 group.length），Vant 同样错位——**对齐参照实现不等于行为正确**
- 修复（满行格位制）：分配只看格位（index % columnNum / 行内序号对照首行），不满行沿用首行同格位分配、空位承担行尾收边——相同 span 组合时上下行同位同宽；m-row 不满行直接复制 result[firstGroup[index]]，m-grid-item 用 pos = selfIndex % columnNum 替代 rowLen 判定（rowInfo / selfTotal 随之精简删除）
- 规约：拼缝类间距的分母禁止依赖运行时行结构；「对齐参照实现」前先推演不满行 / 单行 / 单格边界，行级分配一律格位制——与 #38 拼线方案同源：空位也必须有归属

## 2026-10-28 m-toast（Toast 轻提示，运行实测）

### 40. 跨 .uts 导入类型必须从「类型自身的导出文件」导入，不能借道其它文件
- 现象：m-toast.uvue 从 `./toast.uts` 导入 `LoadingType`（toast.uts 顶部有 import 该类型），页面报 `SyntaxError: The requested module does not provide an export named 'LoadingType'`，页面 404「连接服务器超时」——**编译错误的页面表现是路由 404 / 超时，不是报错弹窗**，先 curl / 看终端编译日志再排查路由
- 根因：ESM 的 import 只绑定目标模块**自身 export 的符号**，A 文件 import 进来的类型不会随 A 的其它导出一起被再导出（无 re-export 语句时）
- 规约：纯类型共享文件（如 loading.uts 只 `export type`）跨组件消费一律 `import { LoadingType } from '../m-loading/loading.uts'`（m-button / m-toast 先例）；或在中间文件显式 `export { X } from '../x.uts'` 再消费，禁止「顺路借道」

### 41. 无 pointer-events 环境：全屏透明层天然拦截点击，「是否渲染」比「是否可见」更本质
- 现象：m-toast 的 mask 层只写 `v-show="visible"`，overlay=false 的普通提示显示期间，点击气泡外任意按钮全部无响应——透明 mask 是真实节点且铺满全屏，uvue 无 pointer-events: none，天然吃掉全部点击；Playwright 点击 30s 超时暴露
- 修复：显隐条件叠加语义条件 `v-show="visible && maskVisible"`（maskVisible = overlay || forbidClick），普通提示彻底不渲染拦截层；气泡本体 `fixed + left:50% + translate(-50%,-50%)` 独立定位（不用全屏 flex 容器居中），仅气泡矩形区域参与点击（closeOnClick）
- 规约：无 pointer-events 的环境里，「透明可穿透」不存在——凡是铺满视口的层都必须用条件渲染控制存在性；禁用点击类需求（forbidClick）反而要利用这个特性渲染透明层；自动化测试对拦截语义用限时点击 `.catch()` 断言（点了=穿透失败）

### 42. dev 环境自动化三噪音：favicon 404 / networkidle 不可达 / 页面双实例
- favicon 404：uni-app x dev 环境浏览器内核自动请求 favicon.ico 且工程未提供，`page.on('response')` 不触发（内核级请求）、console error 文本不含 URL——过滤方式：console 按固定文本 `'Failed to load resource: the server responded with a status of 404 (Not Found)'` 剔除 + response 监听按 `url().indexOf('favicon')` 兜底，真实 404 仍会被捕获
- networkidle：dev server 存在 HMR 长连接 / 挂起请求时 `waitUntil: 'networkidle'` 可能 30s 永不达成——页面就绪判定改 `waitUntil: 'load'` + `waitForSelector(业务选择器)`，自动化脚本一律用后者
- 页面双实例：演示页常同时存在「组件式演示实例 + 函数式容器实例」两个 `<m-toast>`，`waitForSelector('.m-toast__bubble')` 会命中隐藏实例导致状态断言错乱——定位器一律加 `:visible` 后缀（`.m-toast__bubble:visible`）

### 43. uvue 的 flex-shrink 默认值是 0（异于 W3C 的 1）：文本子项不收缩，软换行永不触发
- 现象：m-toast message 落了 `white-space: pre-line` + `word-break` 三值（computed 断言全过），但长文本单行溢出气泡被裁——text 宽 277px > 父气泡 195px；`\n` 硬换行却正常（pre-line 保留换行符，不依赖收缩）
- 根因：uvue 规范 `flex-shrink` 默认 **0**（对齐原生渲染端，与标准 CSS 的 1 不同）——flex 子项文本永远保持内容单行宽度，不会被父容器压窄，软换行（自动 wrap）的前提「元素宽度受限」不成立
- 修复：文本子项显式 `flex-shrink: 1`，实测收缩到父宽内、clientHeight 20→40 两行
- 规约：**任何「希望文本在 flex 子项内自动换行」的场景必须显式 `flex-shrink: 1`**（m-toast message 先例）；审查存量组件时凡 flex row 内放文本且依赖换行的都要核对。断言方法论：`white-space` / `word-break` 的 computed 值断言 ≠ 换行行为——**必须断言 clientHeight 跨行**（≥ 2×line-height）或 scrollWidth ≤ clientWidth

### 44. macOS 端 HBuilderX CLI 可执行文件在 Contents/MacOS/cli，不在 Contents/HBuilderX/cli
- 现象：`/Applications/HBuilderX.app/Contents/HBuilderX/cli launch web` 报 `no such file or directory`（exit 127）——按 Windows 端目录结构（`D:\HBuilderX\cli.exe`）直觉推断的路径不存在
- 实测：macOS 端真实位置为 `/Applications/HBuilderX.app/Contents/MacOS/cli`（应用主可执行目录），调用形如 `/Applications/HBuilderX.app/Contents/MacOS/cli launch web --project <playground 绝对路径>`
- 规约：先 `find /Applications/HBuilderX.app -maxdepth 3 -name "cli*"` 定位再调用，勿按记忆拼路径；dev server 遗留进程（node uni.js -p h5）占用 5174 时先 kill 再 CLI 拉起，pages.json 新增页面必须重启 dev server

## 2026-10-29 m-calendar（Calendar 日历，运行实测）

### 45. Props 类型漏声明的 prop 在 Web 端静默 undefined：模板分支恒走错误路径，无任何报错
- 现象：`switchMode` 只写在模板与逻辑里、漏了 Props type 与 withDefaults 声明，Web 端运行时恒为 undefined——`switchMode != 'none'` 恒 true，所有日历走 switch-mode 渲染（只渲染 1 个月、year-month 只有 2 钮、无 header-title），无编译报错无控制台警告，Playwright 断言月份数量时才暴露
- 根因：uvue 编译器对「模板引用了但类型未声明」的 prop 不报错（Web 端运行时按 undefined 传播）；UTS 红线「不支持 undefined」在 prop 传递这条路径上没有静态检查兜底
- 规约：**新增 prop 必须三处同步——Props type 声明、withDefaults 默认值、模板/逻辑消费**；code review 清单项：grep 模板中所有 `xxx.` / `cfg.xxx` 引用回溯到类型声明；凡「结构分支全错但无报错」的现象优先怀疑 prop 静默 undefined

### 46. relative + z-index:1 的内容层会压过 fixed + z-index:1 的弹层 overlay：同层级下 DOM 序靠后者绘制在上
- 现象：平铺日历的 `.m-calendar__days` 带 `z-index: 1`，与 fixed 弹层 overlay（z-index: 1）处于同一层叠层级；同页面平铺内容 DOM 顺序更靠后，绘制压过弹层——Playwright 点击弹层确认按钮超时，报 `.m-calendar__day intercepts pointer events`
- 修复：删除 `.m-calendar__days` 的 z-index（水印与日格的层级靠 DOM 顺序保证，水印节点放在日格之前）；`.m-calendar__days` 仅保留 `position: relative` 承载水印与格内绝对定位
- 规约：**内容层一律不加 z-index**——层叠上下文一旦建立就参与全局比较；弹层类组件 z-index 收敛为 1（overlay/panel 同值，层级靠 DOM 树序），页面内容与弹层同屏时前者必须保持 auto

### 47. NodeList 没有 indexOf 方法：browser evaluate 里对 NodeList 直接调 indexOf 恒 TypeError → 走 fallback 分支静默返回 -1
- 现象：验证脚本 `all.indexOf ? Array.prototype.indexOf.call(all, el) : -1` 的存在性判断恒 falsy（NodeList 原型上无 indexOf），点击定位永远返回 -1、脚本从未真正点击，全部断言在「未点击」状态下假 PASS
- 修复：无条件 `return Array.prototype.indexOf.call(all, cells[i])`（类数组转借 Array 方法）
- 规约：浏览器 evaluate 内对类数组（NodeList / HTMLCollection）一律直接 `Array.prototype.indexOf.call` / `Array.from`，不要做方法存在性探测；**点击类断言必须先断言「点击确实发生」**（如点击后日志文本变化），否则定位失败会让整组交互断言空转

### 48. Chrome 在 fixed 弹层面板内的合成滚动区会绘制溢出裁剪区（鬼影）：isolation: isolate 建立层叠上下文即愈
- 现象：m-calendar 弹层截图（headless / headed、dsf 1/2 均复现）中月份网格出现第二份偏移 136px（恰 2 行）的重复绘制、小号数字鬼影、内容溢出裁剪区压到 footer 确认按钮、月标题与日行乱序；DOM 几何完全正确（offsetTop / 间距 / 唯一归属全对），scrollTop 恒 0 无振荡；平铺形态（body 高=内容高、无实际裁剪滚动）从不复现
- 排除项（均无效）：清除 scroll-into-view 属性 / 源码移除绑定、禁面板 transform、隐藏月水印（addStyleTag）、排除 headless 伪影、隐藏平铺日历排除透出、确认无 DOM 重复渲染——差异收敛为「fixed 面板 + 限高裁剪的可滚动 scroll-view」的 Chrome 合成层绘制缺陷
- 修复：`.m-calendar__body { isolation: isolate; }`（`/* #ifdef WEB */` 条件编译隔离，原生端 scroll-view 无此问题、也避免 ucss 引入未知属性），滚动内容被封闭进独立层叠上下文后鬼影消失；`contain: paint` 同样有效（备选）
- 规约：**fixed 弹层内放可滚动 scroll-view 的组件，Web 端截图出现「DOM 对但画错」的鬼影/溢出，首选给滚动区加 `isolation: isolate`**（层叠上下文封闭绘制，无布局副作用）；排查顺序：先验 DOM 几何（offsetTop/唯一性）→ 再验滚动状态 → 最后收敛合成层，每项排除实验单独截图留证

## 2026-10-29 m-calendar 拆三组件（纯面板化 + popup / input 组合）

### 49. 根节点 @click 开弹层 + 遮罩点击冒泡 = 关闭即重开：开逻辑必须挂在内层触发层
- 现象：m-calendar-input 点遮罩关闭弹层后立即重开（视觉上弹层关不掉）。根因：弹层遮罩点击关闭的事件沿 DOM 冒泡经过组合组件根节点，根节点 `@click` 处理器在同一事件派发内把 show 先由 close 置 false、又置回 true——`show=false` 与 `show=true` 同帧完成，弹层永不关闭
- 修复：开启逻辑从根节点移到内层「透明触发层」（覆盖 m-input 整区的绝对定位 view）；遮罩点击冒泡到根时无监听器，链路断开
- 规约：**组合「触发器 + 弹层」的组件，触发监听挂在与弹层 DOM 无祖先后代歧义的专门层，不挂根节点**；验收必测「点遮罩关闭后弹层确实关掉」而不只是「能打开」

### 50. 同层叠上下文内 z-index 必须留差值：tie-break 掩盖层叠 bug，修复 z 后旧 bug 才暴露
- 现象一：m-calendar-input 清空钮（z2）压过弹层遮罩（z1），弹层打开时清空钮在遮罩之上可点击穿透。现象二：修复 z=3 后暴露「关闭即重开」——z=1 时代遮罩与后续实例浮层同 z，浏览器按 DOM 序后者居上（tie-break），后续卡片的触发层穿透早先卡片的遮罩反而掩盖了本组件内的问题
- 修复：m-calendar-input 内部固定传 `:z-index="3"` 给 m-calendar-popup，层叠链触发层 1 < 清空钮 2 < 弹层遮罩 3（vars.scss 注释互指说明硬编码依据）
- 规约：**同组件内自绘浮层（触发层/清空钮）与组合弹层的 z-index 必须显式分档留差值，且弹层取最大**；层叠修复可能连锁暴露被 tie-break 掩盖的相邻 bug，修完 z 要重跑全交互断言

### 51. 弹层组件的瞬态日志存活不足一帧，Playwright 断言必须锚定终态
- 现象：m-calendar-popup confirm 派发的 `confirm → ...` 日志在同一事件派发内被后续 close → closed 日志覆盖（存活 <1 帧），`waitForFunction` 永远观测不到，断言假超时；DOM 事件链实际完美（btnBub=1/panelBub=1/overlayBub=0，9 个探针验证）
- 修复：断言改锚定终态——弹层 `closed` 类出现 + 面板 `--bottom-out` 定位类，另加「确认前面板仍在」排除误触遮罩
- 规约：**自动化断言事件派发时，优先断言事件引发的最终状态（类名/DOM/值），而非断言中间态日志**；确需验事件序列才上探针，且区分「断言失败」与「日志被覆盖」

### 52. 类名断言与样式落点以真实渲染 DOM 为准：禁用类可能在文本子元素而非格容器
- 现象：m-calendar 禁用日的 `--disabled` 类在**文本子元素** `m-calendar__day-text--disabled` 上，不在格容器上；断言数格容器 disabled 数恒 0，6 个用例假失败
- 规约：**写断言/样式前先 dump 真实 DOM 确认类名挂载层**（文字样式只能设在 text/button 上，天然把文字态类推向子元素），不要按组件源码的容器结构凭记忆写

### 53. 演示页漏写 prop 是型别静默降级高发区：props 穷举即型别对账清单
- 现象：calendar-input 演示 card2 漏写 `type="range"`，组件按默认 single 消费区间数组取首日展示（「2026-10-15 ~ 2026-10-18」变成只有首日），无任何报错与警告——组件对「数组按 single 取首日」是合法静默行为
- 修复：演示页补 `type="range"` 后展示与 confirm 日志恢复区间语义
- 规约：**演示页每张卡片写完先对照组件 Props 清单核对型别关键 prop（type / multiple 语义开关类），再进浏览器验证**；组合组件（value 数组 + type 默认值）这类「合法但语义错」的静默降级不会报错，只能靠穷举演示页对账

## 2026-10-30 m-calendar 平铺形态对齐 Vant（月标题去重 + 滚动驱动副标题 + 方块选中态）

### 54. uvue Web 页面 window.scrollY 恒 0：页面滚动都在 scroll-view 内部容器，交互验证必须走 scrollIntoView(ref)
- 现象：browser_scroll 页面级滚动后 window.scrollY 仍 0、元素 click 报坐标在视口外；uvue 页面结构是外层 scroll-view.page-body 承载滚动，window/文档级滚动不存在
- 有效做法：browser_scroll({ ref: 目标元素ref, scrollIntoView: true }) 定位后点击；无文本的 uvue view 拿不到 snapshot ref，对有文本的父容器（如 uni-view.card）做 snapshot + includeIgnored: true 可拿到 textbox 类 ref，或用结构选择器 `标签.class:nth-of-type(n) .子类:nth-child(m)` 直达深层格子拿 ref（注意 :has-text 不被 snapshot 引擎支持，报 renderer 错误）
- 规约：**uvue 页面的浏览器交互验证，定位一律 scrollIntoView(ref) + 结构选择器拿 ref，不要尝试页面级滚动或坐标偏移点击**（ref+offset 语义在 uvue 自定义元素上不可靠）

### 55. 跨样式/脚本的「同一数值」双源维护：SCSS 变量与 UTS 常量互指注释 + 运行时估算只做月粒度
- 背景：滚动驱动副标题需要 UTS 侧知道日格行高（SCSS 变量运行时不可读），新增 CALENDAR_DEFAULT_DAY_HEIGHT / CALENDAR_DAY_MARGIN_BOTTOM 常量与 $m-calendar-day-height / $m-calendar-day-margin-bottom 双源同步；用户覆盖变量时估算漂移
- 规约：**双源数值在两侧注释互指对方文件与常量名**；估算逻辑（视口月定位）只做到「月粒度」消费（定位所在月），不做像素级依赖，把漂移影响压到最小并写入文档差异节

### 56. uni-app x 组件样式隔离下，slot 转发链的 fallback 内容渲染在定义它的组件 scope：跨组件转发默认内容必然样式不命中
- 现象：m-calendar（宿主）把 title/subtitle/text 等十个 slot 无条件转发给 m-calendar-panel（表现层）且宿主模板写 fallback（如 `<slot name="text"><text class="m-calendar__day-text">…`），用户未传插槽时渲染宿主 fallback——编译产物 `.m-calendar__day-text[data-v-panel] { font-size: 16px; color: #323233 }` 规则正确，但 DOM 节点只有宿主 data-v 无 panel data-v，全部文字样式失效（16px/400/纯黑变默认）
- 根因：uvue 编译样式带 `[data-v-xxx]` scope 属性选择器；slot 内容的 scope id 归属**定义它的模板**，转发节点不携带目标组件的 data-v。宿主 fallback 的类规则写在 panel 样式表 → 永不命中
- 修复模式（与 m-calendar-popup 既有模式对齐）：**默认内容全部内置到渲染层组件自身**（panel 内每个 slot 写 fallback，与样式同 scope），宿主改条件转发 `<template v-if="$slots.xxx != null" #xxx><slot name="xxx"></slot></template>` 删除自身 fallback——用户未传时 panel 的 slot 为空走自身 fallback（命中），传了经条件链转发（用户内容自担样式）
- 附带修正：footer wrapper 的 `.m-calendar__footer` 类同理随渲染节点迁回宿主 style 段（panel scope 的同名定义删除）；作用域插槽转发保留参数（`#month-title="{ month, text }"` → `<slot name="month-title" :month="month" :text="text">`）
- 规约：**「宿主模板 + 子组件样式表」的类名组合天然 scope 错位**，写转发 slot 前先问「这个 fallback 的类规则在哪份样式表」；默认内容一律放样式所在组件，宿主只条件转发
- 排查手法：编译产物 grep 类名规则看 data-v 归属 → DOM 对比节点的 data-v 属性 → 二者不一致即 scope 错位（勿先怀疑热更新）

### 57. 本库 m-icon 无 arrow-right 图标：右箭头用 arrow（Vant 同款命名）
- 现象：`[m-icon] 无效的图标名：arrow-right` 运行时警告，图标不渲染；icons.uts 类型与 codepoints 只有 `arrow`（朝右）、`arrow-left` / `arrow-up` / `arrow-down`
- 规约：**用 m-icon 前先查 icons.uts 的类型清单**，右向箭头一律 `arrow`；console_messages 返回 tab 全程累积日志，破缓存刷新后仍见旧 warn 时用「dev server 模块内容（curl）+ 运行时 DOM 图标 codepoint」双重证据判定是否历史残留

### 58. uvue Web 端外部 :style 绑定不透传到组件根节点：限高/限位一律走显式 prop 或 custom-style
- 现象：演示页 `<m-calendar :style="{ height: '500px' }" />` 后组件根节点 getAttribute('style') 为 null、按内容自然生长（2738px），根 overflow:hidden 裁剪出「限高但不滚动」的假象；Vant（标准 Vue 组件）同写法直接落 DOM 可行，造成对齐错觉
- 对照证据：组件 height prop（panelStyle → panel 根 inline height）同场景 rootStyle "height: 500px"、body flex:1 受限、scrollHeight > clientHeight 可滚动——组件内部滚动链（flex:1 + scroll-view content 层 overflow hidden auto）本身正常
- 规约：**uvue 组件的尺寸/定位干预不要依赖外部 :style 透传**（框架行为不保证落 DOM），用组件显式 API（height prop / custom-style prop）；文档对 Vant 用户需显式标注此差异

## 2026-10-30 m-calendar-popup 补齐 v-model:value 透传（受控链路实测 + 测试假象四连）

### 59. Playwright CDP 点击自动居中被点元素：scrollTop「跳变」是工具行为不是组件 bug
- 现象：m-calendar 点击日格后内层 scroll-view scrollTop 恒定落到某值（如 208 = 目标格在 505px 视口内的正中心），疑似「选中后滚动跳回首月」bug；五组实验（节点身份探针 / overflow-anchor:none / scrollTop setter 劫持（uni 实例属性不可重定义，`Cannot redefine property`）/ 逐帧采样）证明是 CDP scrollIntoViewIfNeeded 的点击前自动居中
- 规约：**滚动容器内点击后断言滚动位置时，坐标基准要算「目标格居中」的期望值**；验证滚动逻辑本身用 mouse.wheel 真实滚动 + 逐帧采样，不要用 click 后的 scrollTop 反推组件滚动行为

### 60. 日历月块水印文本即月份数字：getByText(月日) 会先命中水印被日格拦截
- 现象：点 11 月 11 日，`getByText('11', exact).first()` 命中 DOM 序靠前的月块水印「11」，点击其中心被上层日格（如 18）拦截，日格「互相遮挡」假象；真实用户点击不受影响
- 规约：**日历类组件的日格点击定位必须在月块作用域内匹配 `.m-calendar__day` 格子容器**（`month.filter({ hasText: 月标题 }).locator('.m-calendar__day').filter({ has: getByText(日) })`），不能裸 getByText 数字——水印、序号、其他月份同数字都会抢匹配

### 61. 多弹层 DOM 并存时 isVisible 只查首个匹配 + translateY 关闭态 isVisible 仍 true：可见性断言须逐个 bbox 视口判定
- 现象一：验证受控选中态，`locator.filter().isVisible()` 恒 false——演示页 7 个弹层 DOM 常驻（v-show），DOM 序靠前的关闭态弹层的同名选中格抢了「首个匹配」；现象二：改逐个 isVisible 后仍误报——m-popup 关闭态面板是 `translateY(100%)` 移出视口而非 display:none，isVisible 仍 true（box 在视口外 y≈844+）
- 修复：`anyVisibleSelected` 逐个 isVisible + boundingBox 视口内（0 ≤ y ≤ 844）双重判定
- 规约：**演示页多实例并存是本库既定形态，弹层内元素的可见性断言一律「逐个 isVisible + bbox 视口内」**，禁止单 locator.isVisible 一票定夺；m-popup 系组件的关闭态判定看类名（--bottom-out / --bottom-in）比看 isVisible 更可靠

### 62. min-date 默认今天：点击「今天之前」日格无 select 是组件正确行为，测试选日必须避开禁用格
- 现象：受控弹层点击 10-29 无回写（受控值不变），误判 v-model:value 断链；实际组件未设 min-date 默认今天（对齐 Vant），10-29 是禁用格，点击只派发 click-disabled-date 不选择。同族语义：value/default-date 均未设时 single 默认选中今天（数据层 value 仍 null 不回写，confirm 值经 confirm 参数给出）
- 规约：**日历弹层测试的「再点一格验证回写」必须选 min/max 区间内的可选日**（今天之后）；「未选状态」断言区分数据层（绑定值为 null）与 UI 层（single 默认选中今天），两者并存是既定设计不是 bug

## 2026-10-30 m-calendar-input 验证修复（customClass / reset-on-open / 界外预选）

### 63. 滚动列表裁剪区元素 bbox 在窗口视口内：Playwright 会强行回滚列表点击之并破坏聚焦位置
- 现象：弹层日历复开聚焦 11 月后点击「8」，confirm 值仍是 11-05——点击目标实为 10-08 禁用格（位于滚动列表可视区上方被裁剪，bbox y=31 在窗口视口内但 < 面板可视顶 ≈253）；Playwright click 对裁剪区元素 scrollIntoViewIfNeeded 把列表回滚到顶部并点击禁用格（无效果），同时聚焦月位置被破坏（选中格 y 从 336 漂移到 656）
- 规约：**日历类点击断言的 bbox 判定须限「面板可视区内」而非仅窗口视口内**（bottom 弹层 `y >= 170`，center 弹层以面板顶为准）——裁剪区元素 isVisible=true + bbox 在窗口内，但点击会触发工具级滚动污染现场；「选日无效」排查先核对被点格的身份（class 含 --disabled 即禁用格）

## 2026-11-01 Android 云打包闭环（vapor 模式错配定性，三轮云打包复盘）

### 67. 云打包 A 类报错的真根因：manifest 未显式声明 vapor，云端按 VDOM 编译 vapor 产物（运行定性）
- 现象：本地 CLI 导出恒显示「蒸汽模式」编译成功，云打包日志却显示「VDOM模式」，云端 kotlinc 报三类错误：watch 源 lambda `Return type mismatch: expected 'Unit'`（10 处全挂零对照组）、`$slots.xxx` 成员 unresolved（default/content/prepend/append/title/subtitle/text/footer/icon）、`Animation`/`cancel` unresolved、事件回调 `Function invocation 'onXxx(...)' expected`——全是 vapor/VDOM 两套 Vue 实现的 API 分裂点
- 定性证据链：①本机 HBuilderX runtime 分双套——`uniapp-runextension/libVapor/`（`io.dcloud.uniappxv.*`，kotlin-stdlib 2.2.10）与 `lib2/`（VDOM，`io.dcloud.uniapp.*`）；②官方文档 manifest.json `uni-app-x.vapor` 默认 **false**；③本项目 manifest 一直没写 `vapor: true`，本地蒸汽只是 alpha 编译器默认行为，云打包编译流程按 manifest 默认走 VDOM；④云端 SDK 版本与本机同为 5.34 仍报错 → 不是版本不配套，是**产物模式与云端 runtime 模式错配**
- 修复：manifest.json `"uni-app-x"` 节点显式加 `"vapor": true`（本地导出验证编译器接受、仍蒸汽模式）
- 教训：**「本地编译成功」≠「Kotlin 编译成功」**——`cli publish app-android --type appResource` 只生成 .kt 不跑 kotlinc，全工程第一次真正过 kotlinc 是在云端；判别「SDK 不配套」前先核对两端渲染模式声明是否一致；早期把它归为「基座不配套」是不完整结论（云打包日志的「VDOM模式」行才是铁证）
- 关联：LESSONS #64 的「生态标准写法全挂 = 基座不配套」判别法方向正确（确实是环境错配而非源码 bug），但归因层级差一层——根因是模式错配，watch 源 lambda 全挂仍是有效的判别特征

### 68. appResource 导出的 .kt 路径与云打包报错路径的映射（定位用）
- 本地导出：`unpackage/resources/app-android/uniappx/app-android/src/`（wgt 资源在同目录 `www/`）
- 云端报错路径：`[PackagePath]/wgtRoot/__UNI__F1AA560/.uniappx/android/src/`——两侧行号逐行吻合（±1 行，VDOM/vapor 模板层细微差异所致），可直接映射定位

## 2026-11-01 VDOM 模式兼容修复（双模式可编译，源码级适配实证）

### 69. 双模式兼容的六类源码写法（本地 VDOM 导出产物逐条实证）
- 背景：用户要求蒸汽 / 非蒸汽（VDOM）双模式都能打包。manifest `"vapor": false` 显式声明使本地 CLI 走 VDOM 编译（输出「VDOM模式」），`cli publish app-android --type appResource` 的 .kt 产物与云端报错逐行对应，可本地复现全部云端错误
- 实证有效的写法（均以生成 .kt 为准验证）：
  1. **watch 源加显式返回类型**：`watch((): T => props.x, cb)` → 生成 `watch(fun(): IconName { return props.name }, ...)`，消解 `Return type mismatch: expected 'Unit'`（裸 `() => props.x` 会被强转 Function0<Unit>）
  2. **useSlots 返回 Map**：VDOM runtime `useSlots()` 返回 `Map<String, Object>`，slot 检测必须索引访问 `slots['default'] != null`（点形式 `slots.default` 报 Unresolved）；模板 `$slots.title` 同理改 `$slots['title']`
  3. **Animation → UniAnimation**：VDOM runtime 类型是 `io.dcloud.uniapp.runtime.UniAnimation`（`Animation` unresolved）
  4. **模板调用导入函数会被 unref() 包裹不可调用**（Function invocation expected）→ setup 内建本地 const 箭头函数桥接转发（m-calendar-panel 的 monthTitleText / dayTextCls / dayInfoTextCls）
  5. **作用域插槽参数是 Any?**：模板 `#text="{ day }"` 中 `day.type` 直接属性访问报 Unresolved → 本地桥接函数 `(day: any) => (day as CalendarDayItem).type` 显式强转
  6. **function 声明的模板事件处理函数不一定会挂**：function 声明实际生成 `val onXxx = ::gen_onXxx_fn`（Kotlin 可调用引用，合法）——此前「裸名传递必报错」的判断过宽；const 箭头函数生成 `val onXxx = fun(){}` 同样合法，两种写法 VDOM 均可编译（箭头函数仍是更稳的统一写法）
- 回归：修复后蒸汽（`vapor: true`）与 VDOM（`vapor: false`）两模式本地导出均编译成功；`sync:uni-modules:check` 一致；Web 演示页 200 + text 插槽渲染实测正常
- 关联：LESSONS #67 的定性（云端 VDOM 编译 vapor 产物）在用户明确要求双模式兼容后，转化为源码级适配完成收敛

### 70. 本地 CLI 编译模式开关的真相：无键 ≠ 蒸汽（5.34 实测）
- 现象：5.34 alpha 下 manifest 删除 `vapor` 键后本地导出显示「VDOM模式」（与早前「alpha 默认蒸汽」的观察不符——编译器行为随版本漂移）；`"vapor": true` 显式声明才走蒸汽，`"vapor": false` 显式走 VDOM
- 规约：**验证打包链路前先看导出日志首行的「蒸汽模式 / VDOM模式」字样**，不要依赖「默认行为」的记忆；云打包模式由打包界面的「蒸汽模式」勾选框控制（与 manifest 键无关），本地想复现云端某种模式就用 `vapor` 键显式对齐
- 判别：`cli publish app-android --type appResource` 不跑 kotlinc（只生成 .kt），「编译成功」仅代表代码生成成功；真正过 kotlinc 在云端 Gradle 环节

### 71. ucss ERROR 清理的两种适配模式（2026-11-01 双模式导出实证）
- **样式替换**：max-width 百分比 App 端不支持（number|pixel）——空内容 flex:1 侧线改 `flex: none` + `width: 10%`（width 百分比受支持），视觉等价（flex:1 恒增长至 max-width 上限）
- **条件编译拆分**：非标准属性值（`word-break: break-word`）用 `/* #ifndef APP */ ... /* #endif */` 排除 App（回退 normal，与原「属性被丢弃」的实际效果一致）；百分比 max-width（m-toast 气泡）App 端改运行时 `uni.getWindowInfo().windowWidth * 比例` 换算 px 注入内联样式，Web/小程序保留 scss 变量契约（注意与 `$m-toast-max-width` 同步的比例常量加注释互链）
- 内联样式在类样式之后拼接 → 用户 customStyle 可覆盖组件注入的 max-width
- ~~`gap` / `lines` 的 WARNING 是 lint 通用提示，保留即可~~（已被推翻，见 #72）
- **warn 但必须处理的三段证据链**（定位「WARNING 会不会真丢样式」的通用方法）：① 编译器 lint 层 `HBuilderX.app/Contents/HBuilderX/plugins/uniapp-cli-vite/node_modules/@dcloudio/uni-nvue-styler.cjs.js` 的 `normalizeDecl`——属性表外属性仅 WARNING 且保留值；② 官方文档 CSS 属性清单（doc.dcloud.net.cn/uni-app-x/css/）——有 `lines` 无 `gap`；③ 原生运行时属性表——libVapor/app-runtime-release.jar 的 `io/dcloud/uniappxv/runtime/UniCSSPropertyID.class` 常量池（python3 zipfile + regex 可解）有 `lines` / `flex-direction` 而无任何 gap 系列。三段对齐后定性：`lines` 是官方属性（WARNING 纯 lint 噪音，保留），`gap` 是 App 端真不支持（声明被静默丢弃 → 间距失效，必须重构）

### 72. flex gap 在 App 端的替代方案：m-space-item 包裹重构（2026-11-02 运行验证）
- **结论**：App 端 ucss 不支持 `gap` / `row-gap` / `column-gap`，声明被静默丢弃（不报错、间距失效），组件库内一律禁用 gap
- **结构选择器替代思路**：ucss 无 `:first-child`，间距类（如 `margin-left`）只能加在非首项上——「首个子项不加类、其余加类」是演示页静态布局的通用模式；但 wrap 场景下该模式有副作用——换行后每行行首项仍是注册序非首项，会带 margin-left 导致各行整体缩进 8px（浏览器实测各行 +8px 一致偏移）
- **wrap 缩进修复（经典 gutter 负 margin 技法）**：horizontal 改为**全部**子项 margin-left + 容器等值负 margin-left（默认间距走 `margin-left: -$m-space-size` 补偿类，size 传入走内联等值负值，负值 size 不二次取负）→ 换行各行行首与首行顶格（Web 实测 4 行行首 x 完全相等）；注意主轴 margin 不影响交叉轴对齐，可放心全量施加
- **组件级方案**（m-space 复用 m-compact 先例）：uvue 无 `$children`，父组件无法修饰任意子元素；用 provide/inject + reactive ids 注册序（子项 setup 中同步 register、onUnmounted 注销），`computed(() => ctx.indexOf(id))` 驱动轮位类，v-if/v-for 动态增删自动重排。该方案要求子项显式包裹（`<m-space-item>`），API 由「插槽直通」变为「包裹式」——架构上插槽直通无法给任意子元素加 margin，包裹是全端一致的唯一解
- **wrap 已知限制**：行间距经子项 margin-bottom 实现，末行底部多出一段（子项无法感知换行位置），文档已标注；若改为「全部子项 margin-top + 容器负 margin-top」可消除，但 margin-top 会参与交叉轴 align-items 计算使内容整体偏移，权衡后保留 margin-bottom 方案
- **App 负 margin 支持度待验证**：Web 已实测顶格；App 端 ucss 若不支持负 margin（声明被丢弃），症状是整体左移 8px 丢失 + 每行行首缩进 8px，届时回退方案为条件编译（App 保留「非首项 margin-left」旧方案）
- **注册序先例三件套**：context.uts（reactive ids 数组 + 模块级自增 id 生成器）· 子组件 inject + 同步 register · computed indexOf 驱动样式；`$children` / `:first-child` / `gap` 三缺一的场景均可套用

### 73. 可空 prop 的编译器诊断噪音与正确写法（2026-11-03 dev 日志复核）
- 现象：VDOM Web 构建（`pnpm build:demo`）出现 `No overload matches this call` TS 诊断——编译器把「`T | null` 类型 + `default: null`」的可空 prop 生成为 `type: [T, null]` 形态的 props 对象，Vue Prop 类型系统不接受 type 数组里的 null；**该噪音会泄漏到使用者的构建日志中**（组件库经 uni_modules 分发后用户编译即见）
- **正确写法（2026-11-03 dev 日志复核后的最终结论）**：**保留 `default: null`，只去掉类型上的 `| null`**（`formatter?: Function` 而非 `formatter?: Function | null`，withDefaults 里的 `xxx: null` 原样保留）——生成声明变为 `{ type: Function, default: null }` 或 `{ default: null }`，type 数组不再含 null，警告消除且运行时未传仍为 null
- **反向坑：不要顺手删掉 `default: null`**。Vue 对 Boolean prop 仅在「缺省且无 default」时才转 false（`isAbsent && !hasDefault`）；删掉默认值后 `props.clickable != null` 恒真，三态语义破坏（m-cell 不再继承 isLink、m-toast loading 型不再默认 forbidClick）——曾因此产生运行时回归
- **验证方式**：TS2769 只在 dev 模式（HBuilderX 运行 / `cli launch web` 非 `--compile`）逐页类型诊断时输出；`pnpm build:demo`（发行）与 `launch web --compile` 均不输出该诊断，用它们验证「警告清零」是无效验证；发行模式仅剩 SSRSlot 警告
- 判别规律：同样可空的 prop（如 m-row `gutter?: GutterValue | GutterValue[] | null` 默认 0）不触发警告，触发点是「默认值为 null」；据此先用单组件试点（m-input formatter）再全量推广
- 残余不可修：SSRSlot WARNING（`Type 'number'/'Function' is not assignable to type 'SSRSlot'`，定位在生成代码 `_createSlots({ _: 2 }, ...)` / `footer: _withCtx(...)`）来自**插槽条件转发**（`<template v-if="$slots['x'] != null" #x>`）与无条件插槽转发的生成代码类型标注，属编译器噪音；规避需砍掉插槽透传 API，不值得，声明为已知噪音即可

### 74. 反向方向（row-reverse / column-reverse）的间距映射：轮位换边而非换 margin 边（2026-11-03 Web 实测）
- 现象：若照搬「全部子项 margin-left + 容器负 margin 补偿」到 row-reverse，**不换行**时容器负 margin 会把内容整体左移一段（justify center / end 下右边缘差 gap 宽），因为 justify 需要容器满宽（`width: auto` 撑满 / 100%），负 margin 会改变内容盒起点
- 规约：**间距施加的 margin 边只由「主轴方向」决定，轮位判断承担反向语义**——row / row-reverse 都用 `margin-left`（DOM 非首项即 row，DOM 非末项即 row-reverse）；column 用 `margin-top`（非首项）；column-reverse 用 `margin-bottom`（非末项）；如此首尾天然无多余留白，且不依赖负 margin
- 例外：**水平换行（wrap）仍保留「全部子项 margin-left + 容器等值负 margin」**（#72 的行首顶格方案）；此时 justify + wrap 组合会因负 margin 整体偏 gap 宽，属可接受边角（无 wrap 时 justify 精确）
- Web 实测证据：row-reverse 视觉顺序 三 二 一（首项 left 1048 / 末项 880）、column-reverse 自上而下 三 二 一；wrap 10 项换 4 行（3/3/3/1），各行行首 left 全等于 24px；9 个区块控制台无报错
- 实现要点：反向方向需 `ctx.ids.length`（末项判断），`computed` 读 reactive 数组长度即响应 v-if/v-for 增删；单 item 时 `index < count - 1` 恒 false，首尾均无 margin

### 75. uvue Web 不能使用 position: sticky；受控吸附的三个实测坑（2026-11-03 m-sticky Web 实测）
- **sticky 全端不可用**：uni-app x Web 运行时给所有 `<view>` 注入 `overflow: hidden`（`@dcloudio/uni-h5/style/framework/uvue.css` 的 `uni-app uni-view { overflow: hidden; }`），`position: sticky` 的最近滚动容器会退化为不滚动的父级 view。实测：根节点 computed `position: sticky / top: 0px`，滚到 `scrollTop=400` 时 `rect.top=-198`（等于 202-400，完全没吸附），无任何报错——只查 computed style 会误判为「已生效」。组件级吸顶一律走「占位根节点 + 内容节点 fixed」的受控方案，Web 也需页面回传 `scroll-top`
- **`parentElement` 在 Web 返回原生 DOM 节点**：没有 `UniElement.getBoundingClientRectAsync`（实测 `TypeError: parent.getBoundingClientRectAsync is not a function`，且该异常会中断后续测量链导致整个组件静默不工作）。Web 用条件编译 `(parent as any).getBoundingClientRect()` 同步取，App / 小程序保留异步接口；把 Web 分支放在 `#ifdef WEB` + `return` 之前，避免重复声明 `rect`
- **滚动容器识别**：Web 判 `classList` 含 `uni-scroll-view`（框架把 scroll-view 渲染成多层同名 class 的 div，最内层即 scroller）；App / 小程序判 `scrollHeight > offsetHeight`（官方文档：非滚动组件该值返回视图高度，相等）。用 `scrollHeight > offsetHeight` 单独作判据会误判「固定高度 + overflow:hidden + 内容溢出」的普通 view（如自定义高度的 m-sticky-box），只在兜底时用
- **吸附基准要用滚动容器可视区，不要用视口**：uvue 页面常见「自定义导航栏 + scroll-view」，视口顶部在导航栏之上，按视口吸附会把吸附条压到导航栏里；容器 rect 在滚动中不变，只需测一次
- **演示页要有尾部留白**：最后一个吸顶块的页面位置若距内容底部不足一个视口高度，滚到底也永远越不过吸附线（实测第 6 个 m-sticky 无法触发 change/scroll），验收页末尾需留 `~600px` 空白才能覆盖最后一个变体

### 76. 瀑布流实现的三条实测结论（2026-11-04 m-waterfall Web 实测）
- **多组件家族必须拆顶层目录**：easycom 只认 `components/<tag>/<tag>.uvue`，把 `m-waterfall-item` / `m-waterfall-load` 放进 `m-waterfall/` 目录会报 `Failed to resolve component`（连带出现 `getBoundingClientRectAsync is not a function` 等派生异常）；拆成各自顶层目录后一次修复，共享逻辑仍放 `m-waterfall/context.uts` 用相对路径导入
- **`<image mode="widthFix">` 的 `@load` 时刻不可直接测高**：回调触发时 uvue image 自身尺寸更新尚未落地，测得高度偏小且之后无重测（表现为项已显示但位置重叠、容器总高度偏小）。正确做法是「立即测一次并标记完成 + `setTimeout(0)` 再补测一次」；修复后实测 `containerH === maxBottom`、重叠数 0
- **作用域插槽透出函数在 Web 端可用且 props 必须 camelCase**：`<m-waterfall-item #default="{ onLoad }">` 与别名解构 `#default="{ onLoad: onImageLoad, overtime }"` 编译、运行均正常（此前未验证的能力，本轮实证可用）；插槽 prop 要写 `:onLoad`，kebab-case 会取不到
- **排查提示**：演示页依赖 GitHub raw 外链图时，偶发「浏览器零请求 + 容器高度 0」先怀疑网络（本轮 `curl` 单个图片耗时 9.3s），不要误判为组件缺陷；组件本身在图片到达后自动重排

### 77. UTSJSONObject 动态选项与级联组件的三条实测结论（2026-11-04 m-cascader Web 实测）
- **`getString` 签名按端漂移**：Web 编译产物中 `UTSJSONObject.getString` 返回 `string | null`，本机 Kotlin d.ts 却是非空签名——按「可空」写 null 判断兜底是唯一安全写法（两端都编译通过）；同族 `getNumber` / `getArray` / `getBoolean` / `getJSON` 均已验证存在。动态选项树（对标 Vant 的 options）全部走 typed getter，配合 `instanceof UTSJSONObject` 过滤 children 元素，规避递归 type 编译风险
- **`JSON.parse<UTSJSONObject[]>` 解析单对象 `{...}` 返回 null**（不是抛错）：单对象必须用 `JSON.parse<UTSJSONObject>` 泛型，数组与对象要分开封 parse 函数；null 兜底后再 `new UTSJSONObject()` 防下游空接收者
- **递归 type 风险的工程解**：UTS 的 type 递归引用（children 引用自身数组）未验证过，动态类型 + typed getter 是零风险替代方案，`field-names` 等能力不受影响
- **swiper 承载 swipeable**：层级切换手势用 `:disable-touch="!swipeable"` 反向承载（prop 语义不变），swiper `@change`（`e.detail.current`）同步 activeTab 但不回发 click-tab——避免用户手势与 tab 点击双重触发
- **浏览器自动化测 uni-app x Web 页面**：自定义元素在快照中不暴露 interactive ref，`browser_click` 对视口外元素直接失败且子 agent 易误判；有效方案——视口内元素用 fresh snapshot ref 点击，其余用 `browser_evaluate` 派发合成 MouseEvent 序列（mousedown / mouseup / click，`bubbles: true`），组件 `@click` 正常响应；子 agent 给出矛盾结论时必须亲自复现

### 78. HBuilderX 项目级 vite.config.ts 接入 routeGen 的四个坑（2026-11-04 playground 改造实测）
- **manifest `web` 段的 server 侧注入随内置配置一起丢失**：项目根出现 vite.config.ts 后，HBuilderX 整体替换内置配置（内置仅 `plugins: [uni()]`），dev server 掉回 5173 / base 丢失；须在 vite.config.ts 读 manifest.json 显式回填 `base` 与 `server.port`
- **`uniMod.default ?? uniMod` 是工厂不是插件实例**：直接放进 plugins 数组时 uni 全部钩子静默失效，唯一症状是 `/main` 走 SPA fallback 返回 HTML（curl 看 content_type 即可判别），页面空白且无报错堆栈——必须调用 `uniFactory()`
- **`/main` 解析的 importer 死角**：`uni:h5-resolve-id` 仅在 `importer.endsWith('index.html')` 时把 `/main` 映射到 main.uts，dev 下浏览器模块请求无 importer，项目级 config + 自定义 base 下该路径不命中；前置一个 `resolveId(id) { if (id === '/main') return main.uts 绝对路径 }` 的插件即可修复
- **插件适配器的 bare import 依赖**：ux-router `plugins/index.mjs` 内部 `import 'unplugin'`，playground 是纯 HBuilderX 工程无 node_modules，需在 monorepo 根安装 unplugin（vite 加载 config 时按项目侧解析，不会落到 HBuilderX 内置目录）
- **判别服务是否正常的快捷链**：`curl /unix-ui/playground/main` 看 content_type——`text/javascript` = uni transform 生效；`text/html` = uni 插件未注册（工厂未调用或宏/依赖缺失）；vite.config.ts 改动会自动重启 server（重启窗口期的 ERR_ABORTED / CONNECTION_REFUSED 是瞬态噪音，别误判为编译错误）

### 79. 长跑 dev server 坏状态导致点击导航静默失败（2026-11-04 级联拆页验证实测）
- **症状**：首页部分条目（级联三个）点击后 URL 不变、页面不跳转，控制台无 error 也无 `[ux-router]` afterEach 日志；同页其它条目（按钮）跳转正常——极易误判为新改代码的问题
- **根因**：dev server 长跑期间历经端口竞争（两个 `cli launch` 并存）与多次 vite.config 触发的重启风暴后进入坏状态，与代码无关；对照实验（按钮条目可跳、级联条目不可跳）曾强烈误导排查方向
- **正确姿势**：排查点击 / 导航类异常前，先 `kill` 旧 node 进程重启 dev server 再取证；重启后同一代码立即全部恢复正常
- **重启注意**：`kill` HBuilderX 拉起的 node 编译进程后，HBuilderX IDE 会自动重新 launch（新 PID），无需手动 `cli launch`；正确的 CLI 路径是 `Contents/MacOS/cli`（`Contents/HBuilderX/cli` 报 exit 127）

### 80. VDOM 云打包 kotlinc 报错的五类源码适配（2026-11-04 appResource 本地导出核验）
- **本地回归链路**：kotlinc 只在云端跑，但 .kt 由本地生成——`"/Applications/HBuilderX.app/Contents/MacOS/cli" publish app-android --type appResource --project <playground>` 导出后直接 grep `unpackage/resources/app-android/uniappx/app-android/src/` 下的 .kt 即可核对全部 kotlinc 报错点，无需反复云打包
- **重命名解构不绑定**：`#default="{ onLoad: onImageLoad, overtime }"` 在 VDOM 生成器中不产出 `val onImageLoad = slotProps[...]`，模板内引用报 Unresolved；必须同名解构。嵌套同名（外层 m-waterfall-item 与内层 m-waterfall-load 槽都透出 onLoad）合法——各自 slot lambda 内生成同名 `val onLoad`，Kotlin 嵌套局部作用域遮蔽
- **watch 双端都要显式类型**：源无返回类型 → Kotlin `Return type mismatch (expected Unit, actual Any?)` + `Cannot infer`；回调参数无类型 → `Cannot infer (nv)`。写法 `watch((): T | null => props.value, (nv: T | null) => {...})`
- **作用域插槽桥接参数必须 `any | null`**：槽实参生成 `val x = slotProps["x"]`（Any?），页面桥接函数参数声明 `any`（非空 Any）即类型不匹配；`any | null` 生成 `Any?` 正确对接（ux-router isNavigationFailure 同款先例）。取属性仍需 `as` 强转 + 判空兜底
- **`is` 类型判断在 uvue script 不可用**：`event is UniImageLoadEvent` 报 vue/compiler-sfc `Unexpected token`——uvue 编译链不认 UTS 的 is 运算符；判别场景改为收窄 API 或换设计（m-waterfall-load 的 error 场景由 maxWait 超时兜底替代）
- **extapi 云端缺失判别**：本地 UTS 编译器能对 `uni.onWindowResize` 生成 import `io.dcloud.uniapp.extapi.*`，但云端 VDOM runtime SDK 无该类，kotlinc 报 Unresolved——支持性表查官方文档（doc.dcloud.net.cn/uni-app-x/api/），onWindowResize/offWindowResize 仅 Web/微信小程序支持（App/iOS/HarmonyOS 全 x），用 `// #ifdef WEB` 条件编译隔离；App 端窗口尺寸恒定，页面级尺寸变化用 onResize 生命周期

### 81. 微信小程序端 UniElement 无同步测量 API（2026-11-11 issue #5 m-tabs 修复）
- **mp 端 `UniElement` 只有 `getBoundingClientRectAsync(callback Promise)`，无同步 `getBoundingClientRect`**——组件 mounted 里任何同步测量都会抛 `TypeError: el.getBoundingClientRect is not a function`，且抛错会中断同一 hook 内后续初始化（首屏无激活态、底部条不显示，症状与测量代码本身相距很远）
- **修复模式（对齐 m-sticky 先例）**：`// #ifdef WEB` 同步测量 + `// #ifndef WEB` `el.getBoundingClientRectAsync()!.then(...)`；批量测量用局部 `let pending` 计数器收集后统一判定（resolveScrollSpy 的 Map<index, top> 收集 → applyScrollSpy）
- **先问「测量结果真的被消费吗」**：m-tabs `measureWidth` 原本在 onMounted / watch(items) 无条件执行，但 selfWidth 仅被 freeLine 布局与 swipeable 消费——加 `if (!freeLineMode.value && !props.swipeable) return` 跳过大部分场景的测量，比全量异步化更省（issue 报告者的建议 1）
- **mp 端产物验证捷径**：`cli publish --platform mp-weixin --project <绝对路径>`（查文档确认格式）编译后 grep 产物 `uni_modules/m-ui-x/components/<name>/<name>.js` 统计 `getBoundingClientRect[A-Za-z]*` 调用——修复后应为 0 个同步调用；运行时复现需微信开发者工具
- **Web 端 dev server 的 public base 是 `/unix-ui/playground/`**：直开 `localhost:5174/pages-sub/...` 只得到配置提示页，须带前缀 `localhost:5174/unix-ui/playground/pages-sub/...`

### 82. scroll-x 废弃 + view 默认 overflow hidden 双重钳死横向滚动（2026-11-12 m-tabs 居中修复）
- **`scroll-x` 已废弃**（uni-app x 改 `direction` 属性，默认 `vertical`）：仅设 `scroll-x` 时 uni-h5 内部滚动层 `overflow-x: hidden`，横向触摸滚动与 `scroll-left` / `scroll-into-view` 程序化滚动全部静默失效——`_scrollLeftChanged` 被 `realScrollX` 门控（只认 `direction === 'horizontal' | 'all'`），prop 传了、DOM 属性也对、功能不生效时直接读 HBuilderX 运行时源码（`plugins/uniapp-cli-vite/node_modules/@dcloudio/uni-h5/dist-x-vapor/uni-h5.es.js`，vapor 与 VDOM 同实现）
- **view 默认 `overflow: hidden` 会把溢出内容从外层滚动区域「藏起来」**：scroll-view 的直接子层若是默认裁剪的 view（m-tabs 标题行），溢出内容被裁在行内，外层 `scrollWidth == offsetWidth`，源码钳制公式 `scrollToValue > scrollWidth - offsetWidth` 恒成立，一切滚动目标被压回 0——修法是内容行 `overflow: visible`（ucss 暂仅 view 支持 visible），裁剪交回 scroll-view
- **scroll-view 编程滚动正路是 `:scroll-left` prop + `@scroll` 回灌镜像**：rootRef 的 `scrollLeft` getter/setter 被 `Object.defineProperties` 重定义到内部 main 层（getter 可读实际位置）；prop 写入若无动画直接 `main.scrollLeft = val`，动画走 content transform（transitionend 才同步 scrollLeft，期间 scroll 事件不触发）；手动滚动后绑定值若与上次同值不重触发，靠 `@scroll` 回灌 `e.detail.scrollLeft` 保持镜像一致
- **Web 端 scroll-view 有编译器内部包装层**（uni-scroll-view × 2 + uni-scroll-view-content），`UniElement.children[0]` 不是业务子节点、`el.id` 属性可能不映射 DOM id——按 id 定位子元素用 `getAttribute('id')` + 深度优先（children 递归），不要假设直接子节点结构
- **取证工具链**：窄视口交互验证用 puppeteer（HBuilderX `plugins/uniapp-debugger/node_modules/puppeteer-cn-2` + `executablePath` 指向本机 Chrome，`page.mouse.click` 真实事件；合成 `dispatchEvent` 触发不了组件回调，见 #72）；无头 `--dump-dom` 对异步加载 SPA 有竞态不可靠；`querySelector('.m-tabs__title--active')` 这类全局选择器会抓到页面第一个实例，须先限定实例子树再查
- **m-cascader 层级 tabs 同款问题同款修复**（`scroll-x` → `direction="horizontal"` + 行 `overflow: visible`）；排查中曾误把宽视口下「内容不溢出、scrollLeft=0 的正确钳制」当成 bug——验证滚动行为必须窄视口

### 83. defineExpose 属性名裸调用被解析到 window.scrollTo（2026-11-12 m-tabs scrollspy 点击定位修复）
- **`defineExpose({ scrollTo: ... })` 的属性名在组件作用域不可见**：点击处理器里裸写 `scrollTo(index)`，Web 构建下被静默解析到全局 `window.scrollTo`——索引被当作滚动坐标（`window.scrollTo(1)` ≈ 无操作），在 scroll-view 滚动的页面里功能全灭且零报错；UTS 强类型在 Web 目标下也拦不住（全局恰好有同名 API，连 ReferenceError 都没有）
- **规避模式**：expose 的实现抽成组件内真实函数（如 `scrollToIndex`），`defineExpose` 只引用它；调用点一律显式引用组件内符号
- **取证捷径**：puppeteer `page.on('pageerror')` + console 过滤抓不到这类静默失效——功能「该发生没发生」时优先怀疑标识符解析，grep 源码核对调用点引用的是函数还是对象字面量属性名

### 84. scrollspy 判定基准线必须与吸附时序解耦（2026-11-12 m-tabs 基准线语义修复）
- **不能用 `offset-top` 直接作 scrollspy 判定基准**：内容区常处于非零视口偏移的滚动容器中（页面顶部有固定导航时 holder 顶边在视口 44px 处），判定整体错位一个容器偏移，表现为激活标签与视口内容不一致（用户截图「区块 1 激活、内容是区块 2」）
- **也不能用标签栏实时 rect**：scroll 事件触发判定的瞬间 m-sticky 吸附态可能尚未切换（nav 还在文档流位置，fixed top 未生效），基准线随吸附时序漂移且无后续 scroll 事件修正——错位定格
- **正解：用稳定量拼出吸附位**——`holderTop + offsetTop + navHeight`（吸附态 nav 底边 = 滚动视口顶 + offset-top + 标签栏高）；点击定位同基准（`scrollBy = delta - offsetTop - navHeight`，容器顶偏移在视口坐标推导中自然抵消）。验证实测：定位后 pane 顶 131.67 vs 吸顶 nav 底 132，偏差 0.33px
- **findScrollParent 含试位移探测（scrollTop +10 读回）有副作用**，滚动高频路径（每次 scroll 事件）必须缓存结果（含 null——页面级滚动同样缓存），否则试位移赋值会再触发 scroll 事件形成事件风暴
- **取证教训：跨坐标系比较是最大陷阱**——`getBoundingClientRect().top` 是视口绝对坐标，与「相对滚动容器顶」「相对某 wrapper 顶」混算会造出 ±44px 的假跳动；同一元素多探针测量必须统一坐标系后再比（本轮「布局跳动 44px」的推断最终证明是探针坐标基准不一致）
- **m-sticky 占位机制已核实无塌陷**：根节点占位层恒在文档流（实测 height 44 恒定），内容节点吸附切 fixed 不引起布局跳动——排查布局偏移时先排除 m-sticky 本身
- **slots 占位破坏均匀槽位公式**：平分布局独立底部条按 `(i + 0.5) * 宽 / n` 定位，nav-left/right 插槽占位后失真（实测偏约半条宽）——改为测量制（按 id 找标题实测中心），且测量基准必须是 line 自己的定位父级（line 与标题行分属 nav 不同子树，基准错子树偏移翻倍）

### 85. VDOM 产物 setup 内函数编译为局部 val 引用，禁前向引用与 function 声明传值（2026-11-12 m-tabs VDOM 云打包修复）
- **UTS function 声明在 VDOM 产物中编译为两层**：顶层 `fun gen_xxx_fn(...)` + setup 内局部 `val xxx = ::gen_xxx_fn`——setup 内一切引用（含 lambda/computed/watch 回调体内）都经由该局部 val，**val 声明前引用即 kotlinc `Unresolved reference`**；局部 fun/val 无前向可见性，与 #80 的 Kotlin 规则同源
- **蒸汽模式不报错的原因**：vapor 产物走 JS/字节码路径，标识符解析宽松——「蒸汽通过 ≠ VDOM 通过」，VDOM 改动必须走 appResource 导出静态核对（本条与 #80 捷径配套）
- **修复模式：setup 内按依赖拓扑排序声明**——纯工具函数（addUnit / parsePx / findDescendantById / findScrollParent 等）→ refs/状态 → computed → 依赖函数的函数组 → const 箭头（onTitleClick 等）→ watch / onMounted；箭头函数体内引用的函数必须在其声明之前
- **`function` 声明不能作 props 值 / 事件绑定传递**：`:before-change="onBeforeChange"` 传 function 声明报 `Function invocation 'onBeforeChange(...)' expected`（tabs.kt），const 箭头生成 `val onBeforeChange = fun(...)` 定义在前则通过——#80 先例（m-calendar-popup）的推广，演示页全量 function → const 箭头
- **`UniElement.id` 属性在 App 端 Unresolved**（Web 端也不映射 DOM id）：按 id 查找只用 `el.getAttribute('id')`，产物生成 `el.getAttribute("id")` 合法
- **`getBoundingClientRectAsync` App 端存在**（11 处调用编译通过）——#81 的「仅小程序缺同步测量」结论与 m-sticky App 端异步先例一致，报错是前向引用级联（接收者类型推断失败），修声明序即消失

### 86. 闭包捕获的可变局部变量禁 Kotlin smart cast（2026-11-12 m-tabs spyHolder 二次修复）
- **`var spyHolder` 被 lambda 捕获后，`if (spyHolder != null) { spyHolder.xxx }` 报 `Smart cast to 'UniElement' is impossible, because 'spyHolder' is a local variable that is mutated in a capturing closure`**——Kotlin 规则：被闭包捕获的可变局部变量不可 smart cast，判空后不能收窄类型
- **修复模式：使用点先读入不可变快照**——`const snapshot = spyHolder; if (snapshot != null) { snapshot.xxx }`，局部 val 一次赋值可 smart cast；多分支读同一快照还顺带保证测量批次内引用一致
- **传参不需要 smart cast**：`if (spyHolder != null) { fn(spyHolder) }`（形参类型可空）合法，只有**成员访问**（`.xxx`）触发该报错——排查时只改报错处，不必全量快照化
- **VDOM 打包的迭代节奏**：前向引用（Unresolved）修完后才暴露 smart cast（后续编译阶段），单轮 appResource 导出只能验证到当前最深的报错层——重大重构后建议本地导出 + 云打包各跑一轮直至清零

### 87. 小程序端 UniElement 无 children/parentElement，getBoundingClientRectAsync 仅支持有 id 元素（2026-11-12 issue #8 修复）
- **小程序端 UniElement 的 DOM 遍历能力为零**：无 `children`、无 `parentElement`（vendor.js 实现类只有 getBoundingClientRectAsync / getAttribute / setAttribute / scrollTo / animate 等，scrollHeight / offsetHeight 等恒为 NaN）——`el.children.length` 即 TypeError（mounted 即崩，首屏初始化被中断，与 #5 同款位置效应）
- **`getBoundingClientRectAsync` 在 mp 端的实现 = `createSelectorQuery().in(this.$vm).select('#'+this.id).boundingClientRect()`**：仅对**有 id 的元素**生效（无 id 时 console.warn 并 reject）；in($vm) 是**组件实例作用域**——元素 id 只需组件内唯一，多实例安全
- **MP 端测量统一方案**：`uni.createSelectorQuery().in(getCurrentInstance()!.proxy!).select('#'+id).boundingClientRect().exec((ret: Array<any>) => { ret[0] as DOMRect })`（uni-app x UTS API 全端可用，官方签名如此）——所有需测量的元素补 id（root / nav / line / nav-scroll 静态 id + m-tab pane 按注册序动态 id），标题 id（m-tabs-tab-N）已天然满足
- **遍历型查找 MP 编译期降级**：findDescendantById / findScrollParent 函数体 `#ifdef MP return null`——调用点本就判空（centerActiveTab / animateLine 跳过居中、scrollspy 判定按 holderTop=0 的页面级语义、点击定位回退 uni.pageScrollTo）；注意 findScrollParent 不加保护会在修复 findDescendantById 后成为下一个崩溃点（`cur.parentElement` 在 undefined 上取属性即抛错）
- **静默降级链**：仅修崩溃点不够——同一根因在多条路径埋雷，修复时把「同一缺失能力」的全部调用点一次排查（children / parentElement / 无 id 的 getBoundingClientRectAsync 三类，m-tabs 中共 6 处）
- **App 端 UniElement 有完整遍历能力**（children / parentElement / 同步测量都可用）——条件编译按 `#ifdef MP` / `#ifndef MP` 三分支：MP 走 id 查询、WEB 同步、APP 异步；注意 `#ifndef WEB` 会包含 MP 端，三分支必须显式互斥包裹

### 88. 滚轮选择器：scroll-view 吸附定位与「无 pointer-events」的替代方案（2026-11-15 m-date-picker 三件套）
- **滚轮列的吸附定位可用 `:scroll-top` prop**：`@scroll` 回灌 `e.detail.scrollTop` 维护镜像（`actualTop`），停止后按 `Math.round(top / optionHeight) * optionHeight` 回写；上下占位高固定为 `(visibleNum - 1) / 2 * optionHeight`（偶数可见数时是半格 2.5 行，选中项才精确居中）
- **同值回写不触发属性下发**：用户滚走又滚回同一格时（镜像 233.2、目标 220，而上一次 prop 已是 220），直接赋同值无效——先写 `target + 0.5` 再 `nextTick` 归位 `target`，才能强制吸附；程序化滚动期间用 120ms 标记位屏蔽自身 scroll 事件，避免吸附递归
- **uvue 无 `pointer-events`**：Vant 那种覆盖式渐变遮罩会拦截滚动手势（项目内 m-toast 亦按「全屏层天然拦截」处理）——滚轮渐隐改用每个选项按 `|index - activeIndex|` 分级 `opacity` 类实现；选中框两条细线放在列层 `z-index: 0`、列层 `z-index: 1` 且滚动区背景透明，既不挡手势也保持视觉层次

### 89. 面板组合通用 Picker 的状态同步（2026-11-15 日期 / 时间面板迁移）
- **`m-picker` 只监听 `columns.length`**：日期 / 时间面板把列内容重新构建后列数往往不变（限域、`minuteStep`、`hourCycle`、`filter` / `formatter`），其内部 `indexes` 不会重算，会出现「显示值正确但下标错位」；面板必须在这些依赖变化时 `nextTick` 调 `picker.$callMethod('resetSelection')`
- **双状态边界只在两处**：常规滚动靠 `m-picker` 的「`value` 同值跳过」不会回环；`resetSelection` 与上述列内容变化必须显式复位，且面板的 `resetSelection` 要先改内部值再调 `m-picker` 的 `resetSelection`
- **不要转发 `m-picker` 的 `update:value`**：它在每次滚动即派发，而面板的 `v-model:value` 契约是「仅确认回写」；转发会让外部值随滚动变化
- **`change` 的 `columnIndex` 用前后 `indexes` 差异反推**（`firstDiffIndex`），值重建用 `selectedOptions` 按列类型全量解析——比按变化列单独写回更稳，能覆盖「切时段导致小时列重建」这类多列联动
- **跨组件转发 `option` 插槽需做口径回退**：`m-picker` 的作用域参数是 `{ label, value }` + 行列下标，面板对外仍是 `{ text, value }` 与单个 `index`，转发时用桥接函数转换，保持既有文档契约

### 90. 农历选择器的列模型（2026-11-15 农历三件套）
- **农历月序用负数表示闰月**：`getLunarMonthSequence(year)` 返回 `[1, 2, -2, 3, ...]`（闰月紧随其月），`getLunarMonthName(-2)` 输出「闰二月」；列 value 直接存负数字符串，避免另造编码
- **切年必须归一闰月**：从闰四月年切到无闰四月的年份时，月值 `-4` 非法，需 `getLunarLeapMonth(year)` 校验并回退到 `4`，再把日收敛到当月 29 / 30 天，否则 `lunarToSolar` 返回 `null` 导致面板停更
- **日列长度按农历月长生成**，不能用公历 `getDaysInMonth`；`min/max` 落在月中间时用「min/max 所在农历三元组」裁剪首尾，闰月比较同样用负值
- **年列全量 1900–2100 时约 201 项**：滚轮列可承受，但低端机首屏需实测；默认范围与日期选择器的「前后 10 年」不同，农历生日场景必须全量
- **对外值仍用公历 `Date`**：滚动农历列后 `lunarToSolar` → 截断到 min/max → 真源回写，`pickerValue` 由列下标派生，避免 `m-picker` 精确匹配失配
- **输入框展示文案独立于值口径**：值保持 `Date`（便于表单/弹层互换），展示用 `formatLunarPickerText` 按 `columns-type` 拼接（年/月/日名，干支按开关）

### 91. Android 云打包暴露的函数声明顺序问题（2026-11-16）
- **Web 编译通过 ≠ Android 通过**：uvue 的 `<script setup>` 内 `function` 在 Web（JS，函数提升）可用后置声明，但 uni-app x 编译到 Kotlin 时不提升；被 `setTimeout` 箭头函数或其它函数提前引用的函数若定义在调用之后，云打包报 `Unresolved reference 'xxx'`
- **已修复两处**：`m-picker` 的 `resolveColumnsForNormalize`（被 `normalizeIndexes` 调用）与 `m-date-picker-column` 的 `onScrollSettle`（被 `setTimeout` 回调调用），统一移到首个调用之前
- **排查方法**：对每个 `.uvue` 的 `<script` 之后区域，按 `^\s*function (\w+)` 收集定义行，再扫描其前的调用行；模板中的事件引用不计入
- **日志中的 `DatePickerOption` / `TimePickerOption` / `LunarPickerOption` unresolved 属跨界 type 依赖问题**：popup / input / range 三件套只导入了 `XxxFormatter` / `XxxFilter` 这些**引用 Option 的 type 别名**，UTS 生成 Kotlin 时把别名展开却不为被引用的 Option 生成 import，导致 `Unresolved reference`。修法是在这些文件的 import 列表里**显式加入 Option 类型**（即使源码不直接使用），让编译器生成对应 Kotlin import；`PickerOption` 能正常解析正是因为它被各组件显式 import
- **`Any?` 与泛型推断错误多来自跨文件类型别名与 `ref` 元素访问**：`Cannot infer type argument for 'E'` 出现在未标注参数类型的 `map` / `filter` 回调；`Unresolved reference 'length'` 往往意味着上游表达式被推断为 `Any?`（先查该变量/返回值是否缺少显式类型标注）

### 92. 向 m-icon 字体新增字形的两个致命坑（2026-11-17 数字键盘退格图标）
- **字体源文件是 `packages/core/static/m-icon.ttf`**，`components/m-icon/m-icon-font.uts` 只是它的 base64 产物（小程序 `loadFontFace` 用）。改字形后必须两者同时更新并 `pnpm sync:uni-modules`
- **坑 1：TTGlyphPen 只接受整数坐标**。SVG path 经 `TransformPen` 缩放后是小数，直接写入会产出畸形 glyf；浏览器表现极具迷惑性——HTTP 200、`fontTools` 能正常读取、控制台无报错，但 `document.fonts` 状态为 `error`、`FontFace` 报 "A network error occurred"、所有图标一起变空白。修法：`TransformPen → RoundingPen → TTGlyphPen`
- **坑 2：TrueType 只支持二次贝塞尔**。SVG path 的三次曲线（`a` 圆弧也会转成三次）若直接进 `TTGlyphPen`，fontTools 会写 `flagCubic(0x80)`，浏览器 OTS 判定「Bad glyph flag, reserved bit 7 must be set to zero」并拒绝整个字体。修法：`Cu2QuPen(RoundingPen(TTGlyphPen), max_err=1.0, all_quadratic=True)`
- **本地先用 OTS 校验，别靠浏览器试错**：`pip install --user opentype-sanitizer` 后调用 `~/Library/Python/3.9/lib/python/site-packages/ots/ots-sanitize in.ttf out.ttf`，失败会打印具体表与字形号
- **写字形顺序**：先 `font.setGlyphOrder(order + [name])`，再 `font["glyf"][name] = glyph`、`font["hmtx"][name] = (adv, lsb)`；反序会触发 `maxp.recalc` 的 `len(glyphOrder) == len(glyphs)` 断言
- **cmap 只写 format 4 / 12**：format 0 子表仅容纳 0-255，写 PUA 码点会在保存时抛 `assert set(cmap.keys()).issubset(range(256))`
- **字体验证要硬刷新**：`/static/m-icon.ttf` 无内容哈希，浏览器强缓存旧文件；改字体后必须 Ctrl+Shift+R 才能看到效果

## 2026-11-17 m-password-input 密码输入格子（密码/验证码场景，与 keyboard 配合）

### #93 UTS 禁止函数形式 ref 绑定
- **现象**：写 `:ref="(el, k) => { if (k === 0) cursorRef = el }"` 编译器报错或 runtime 不生效
- **原因**：UTS（Kotlin 编译目标）不支持函数形式 ref 绑定；项目里所有组件的 ref 绑定都是普通字符串形式 `ref="spinnerRef"` + `const spinnerRef = ref<UniElement | null>(null)`
- **修法**：改成 `ref="cursorRef"` 模板绑定 + `const cursorRef = ref<UniElement | null>(null)`。同一时刻只渲染一个光标 view（v-else-if 条件渲染），普通 ref 足够。watch 里用 `flush: 'post'` + `setTimeout` 确保 DOM 渲染后 ref 就绪

### #94 uni-app x 全局类型无需 import
- **现象**：`import type { UniAnimationKeyframe } from '@dcloudio/uni-app'` 编译器警告 "unused import" 或 runtime 找不到类型
- **原因**：`UniElement`、`UniAnimationKeyframe`、`UniAnimation` 等是 uni-app x 全局类型（类似全局 JS 类型），直接使用即可，无需 import
- **修法**：删除 import 语句，模板和 script 里直接用类型名（m-loading、m-color-picker 等项目内组件都是这么写的）

### #95 SCSS 变量写进 script 是 undefined（样式全体失效 + setup 抛错）
- **现象**：password-input 首版在 `<script>` 里拼内联样式引用 `$m-password-input-cursor-width` 等 SCSS 变量，web 编译日志出现几十条 `Cannot find name '$m-...'` 错误；页面渲染降级——格子不等分、圆点/光标不可见、明文字符错位
- **原因**：SCSS 变量只在 `<style>` 块的编译期存在，UTS script 里的 `$m-...` 是未定义标识符；运行时取值 undefined → 拼出的内联 style 全部非法被丢弃
- **修法**：静态样式（圆点/光标/文字/提示）全部移到 `<style>` 扁平 class；script 里只允许 props 驱动的 number 值拼接（如 gap margin）
- **推论**：聚焦高亮等复合选择器 `.a.b` 拆成运行时拼接的扁平类（`--bordered-active`），ucss 无复合选择器对账

### #96 el.animate 在 web 端不存在；el.style.setProperty 在 web 端 UniElement 代理上无效
- **现象**：web 端控制台 `Uncaught TypeError: el.animate is not a function`（m-loading 同样写法，web 端动画实际没跑起来）；改用 `el.style.setProperty('opacity', ...)` 降级后 style attribute 仍为空（采样两次 opacity 恒为默认值）
- **原因**：`UniElement.animate` 只在 App 端实现；web 端 UniElement 的 style 是代理对象，setProperty 不映射到 DOM style attribute
- **修法**：闪烁类"状态切换动画"统一用 **setInterval 半周期切换响应式 ref + 模板拼 hidden class**——纯 Vue 响应式，零 DOM 操作，全平台一致，无需条件编译
- **验证**：250ms 采样序列 `true,false,false,true,true,false` 有翻转即闪烁正常

## 2026-11-17 m-radio 单选框四件套（自绘圆环图标，对标 Vant Radio）

### #97 ucss 中 border-width 必须伴随显式 border-style: solid 才渲染
- **现象**：演示页自定义图标 `.custom-icon` 只写 `border-width: 1px; border-color: #c8c9cc`，圆环边框不渲染（200% 缩放截图确认只有灰点无圈）；补 `border-style: solid` 后边框立即可见
- **原因**：ucss 的 border-style 默认值为 `none`（与 W3C 一致），只设 width/color 时边框整体不绘制；且 uni-app x web 运行时 `getComputedStyle` 对 border-width 返回误导性 `0px`（即使实际渲染正常，如 `.m-radio__ring` 三件套齐写时边框可见但 computed 仍报 0）——**样式验证一律以截图视觉为准，不信任 web 端 computed 测量**
- **修法**：任何描边元素三件套齐写：`border-width` + `border-style: solid` + `border-color`

### #98 禁用态视觉禁用「透明度叠加浅色描边」方案
- **现象**：radio 禁用态首版用 icon 容器 `opacity: 0.5`，但未选外环本就是浅灰（#c8c9cc），叠加后与可选态肉眼无差异（用户验收截图打回）；另一隐藏坑：弹层选项文字走 default 插槽显式色，label 禁用色类挂在外层 view 上根本罩不住
- **修法**：Vant 同款显式方案——禁用未选 = 外环灰底填充（`$m-radio-icon-disabled-background`），禁用选中 = 环点退灰（`$m-radio-icon-disabled-color`，checkedColor 覆盖在禁用态短路）；插槽文字禁用色须在**文字元素本层**加变体类（`m-radio-popup__label--disabled`），挂父层无效
- **推论**：默认态描边越浅，禁用态越要用「填充/换色」而非「透明度」表达；凡经插槽显式设置文字色的组件，禁用变体类必须给到 text 本层

### #99 m-checkbox 未选态实色勾的隐匿成因：字形缺失期视觉「碰巧正确」
- **现象**：checkbox 上线以来未选态一直「显示为空框」，0.7.0 重新生成 m-icon 字体（#92）后用户截图暴露未选项渲染蓝色实色勾
- **根因**：m-checkbox 未选与选中渲染的是同一个 `m-icon 'success'` 字形，无任何分支区分——早期字体里 success 字形缺失（#92 之前字体生成有缺陷），未选/选中一起不可见，未选态「碰巧」看着像空框才通过验收；字体修好后勾形显形，错误才浮现
- **修法**：未选 = 描边空框（round 圆环 / square 圆角方框 view），选中 = 实心填充 + 白勾（v-else-if 只在选中渲染 success），indeterminate = 实心底 + 白横杠（60% 宽白杠，替换原 inline calc 方案）
- **教训**：依赖字体图标的「条件视觉」必须在字形可见的真实状态下验收；组件状态分支不能共用同一字形而无样式区分，验收截图要覆盖全部状态组合（尤其「未选」这种默认态）

### #100 inlaid 嵌入 flex 行容器的拉伸必须加在组件根节点，且只用 grow 不动 basis
- **现象**：m-input inlaid 嵌入 m-cell__value 后，值区剩余宽度（标题与输入框之间的空隙，实测 503px 值区 vs 151px 控件）点击无反应——0.6.0 的修复只给控件层加了 min-height（高度塌陷），宽度塌陷漏修；演示页用 `custom-style="flex: 1"` 补偿也无效
- **根因**：m-input 模板是「根（.m-input，无宽高约束）→ body（flex:1）」两层，custom-style 落在 body 层——body 的 flex:1 只在根收缩出的 151px 内部分配，等于没生效；**使用者侧 custom-style 够不到组件根节点**
- **修法**：inlaid 时根节点加 `m-input--inlaid-root { flex-grow: 1; flex-shrink: 1; flex-basis: auto; }`——只用 grow 不用 `flex: 1` 简写（basis 0% 会在 column + auto 高度容器中塌陷高度，uni-app x 所有 view 默认 flex column，* -input 组合组件内嵌 m-input 时正是这种容器）；basis auto 下 grow 只吃剩余空间，cell 内兄弟节点（箭头等）不被挤压
- **教训**：两层容器组件（根 + 视觉主体）的拉伸属性必须加在「父级 flex 容器的直接子项」即根上；`flex: 1` 简写 ≠ `flex-grow: 1`，在不确定父级主轴方向时显式展开并保留 basis auto 最稳

### #101 uni-h5 scroll-view 的空触点 touchmove 会抛 pageX TypeError（嵌套滚动必踩）
- **现象**：m-select-input 演示页偶发 `Uncaught TypeError: Cannot read properties of undefined (reading 'pageX')`，来源 `uni-h5.es.js`；人工点击流程无法稳定复现
- **根因**：uni-h5 的 scroll-view `touchmove` 处理器直接读 `event.touches[0].pageX`，没有 `touches.length` 判断；嵌套滚动（弹层内列表 + 页面 scroll-view）在快速甩动或手势被浏览器接管时会派发 `touches` 为空的 touchmove，于是 `undefined.pageX`
- **验证方式**：在列表 `.uni-scroll-view` 上派发「1 触点 touchstart + 空 touches touchmove」，稳定 100% 复现（同一机制同理可验证修复）
- **修法**：在组件内（m-select）于 Web 端 `window` **捕获阶段**监听 touchmove，`touches.length == 0` 时 `stopPropagation()`，事件在进入框架处理器前被拦截；`#ifdef WEB` 隔离，组件卸载时移除监听
- **教训**：uni-h5 内置组件对触摸事件的容错不可假设；凡是「嵌套 scroll-view + 触摸交互」的组件，验收必须包含空触点/中断手势的合成事件测试，不能只测点击流程

### #102 watch 的元组 getter 会让云打包 Kotlin 编译失败（Web 完全不报错）
- **现象**：云打包 `:app:kaptGenerateStubsReleaseKotlin` 失败，报 `m-password-input.kt:156 Type expected / Expecting an element / Unexpected tokens`，Web 端运行一切正常
- **根因**：`watch((): [boolean, number] => [props.focused, activeIndex.value], ...)` 被 uts 编译器翻译成 Kotlin 的 `fun(): [Boolean, Number]`——Kotlin 没有 `[T]` 这种类型语法（合法写法是 `Array<Any>`），连带后续 `fun(_: [Boolean, Number])`、元组字面量一起解析失败
- **定位方式**：`cli publish app-android --type appResource --project <playground 绝对路径>` 可**本地生成** Kotlin 源码到 `packages/playground/unpackage/resources/app-android/uniappx/app-android/src/...`，直接打开对应 `.kt` 即可看到非法代码，无需等云端打包
- **修法**：拆成两个单值 watch（`(): boolean`、`(): number`）共用一个 `syncCursorAnimation()`；或在注释中标注该约束
- **教训**：watch getter 只返回单值；凡是改动 watcher / 多值派生逻辑，验收必须包含「本地生成 app-android 资源 + 检查生成 Kotlin 无 `: [` 等非法类型语法」，仅过 Web 编译不能作为 Android 通过的依据

### #103 getCurrentInstance() 只能在 setup/生命周期内取，$callMethod 与事件处理器路径都会拿到 null
- **现象**：微信小程序端 `m-color-picker-popup` 打开弹层必崩：`TypeError: Cannot read properties of null (reading 'proxy')`（issue #20）；Web 完全正常
- **根因**：`measureNode` 内**调用时**执行 `getCurrentInstance()`。父组件 `$callMethod('refresh')` 与触摸/点击处理器都属于 setup 之后的执行上下文，返回 null
- **修法**：`#ifdef MP` 在 setup 顶层一次性 `const mpInstance = getCurrentInstance()`，后续只用引用（与 m-fab / m-tabs 一致）
- **自查结论**：`m-color-picker`、`m-rate` 各有一处调用时取值，均已改为 setup 捕获；库内其余 `getCurrentInstance` 均已在 setup 作用域
- **教训**：凡是可能被 `$callMethod` 调用或事件处理器调用的函数，禁止内部再取 `getCurrentInstance()`；小程序端验收须覆盖「父组件调用子组件方法」这条路径，Web 无法暴露该问题

### #104 UTS 函数提升在 Kotlin codegen 三处失效：前向引用、alias+数组联合形参、$slots.default 属性访问（第二轮云打包错误全记录）
- **现象**：第二轮云打包 `compileReleaseKotlin` 报 17 处错误，波及 6 个演示页 + 5 个组件，Web 端全部正常。三类根因：
  1. **Kotlin 局部函数禁前向引用**：UTS/JS 函数声明有提升（先调用后声明合法），但 codegen 按源码声明顺序生成 Kotlin 局部函数 / `val xxx = ::gen_xxx_fn`，先使用后声明直接 `Unresolved reference`。命中：m-select 的 `itemClass`→`isSelected`、m-select-input 的 `displayLabel` computed→`labelOf`、m-password-input 的 `startCursorAnimation`→`stopCursorAnimation`，以及演示页 computed→`valuesText`
  2. **type alias 与数组联合的组合形参让 codegen 静默丢弃整个函数**：`function onSelectValueChange(v: RadioValue | RadioValue[])` 不生成任何 Kotlin（渲染层引用报 `Function invocation expected`）；形参展开为 `string | number | string[] | number[]` 后正常生成 `v: Any`。演示页 `@change="logMulti"` 函数名直传同样报 invocation expected（UTS 红线「函数声明不能作值传递」），内联调用 `logMulti($event)` 后正常
  3. **`default` 是 Kotlin 保留字**：模板 `$slots.default != null` 生成的反引号转义失效（`Unresolved 'default'`），改索引访问 `$slots['default'] != null`
- **另确认两条 codegen 规律**：
  - watch 单表达式 source 无显式返回类型注解时 Kotlin 报 `Return type mismatch: expected 'Unit', actual 'String'/'Boolean'`；显式注解 `(): string => props.xxx`（radio-group 写法）正常
  - codegen 对组件事件处理器的模板内联 `$event` 一律生成 `fun($event: Any)`（与组件 emit 声明的 payload 类型无关）——演示页日志函数形参必须 `any | null` 内部 cast（radio / checkbox 页早已是此写法所以从未报错）
- **验证方式**：`cli publish app-android --type appResource` 本地生成 Kotlin，grep 复查：`gen_xxx_fn` 生成情况、`"onChange" to 函数名` 直传残留、`$slots` 访问形态、`as RadioValue | ` 联合 cast 残留
- **教训**：① 组件内函数声明顺序按调用依赖拓扑排（被调用者在前）；② 事件/透传函数形参禁用「type alias + 数组联合」组合，写具体展开联合；③ 模板绑定组件事件一律内联 `$event` 调用；④ `$slots.xxx` 一律索引访问；⑤ watch source 一律显式返回类型注解；⑥ 演示页事件日志函数形参一律 `any | null`；⑦ 仅 Web 编译通过不能作为 Android 通过依据，改动后必须本地生成 Kotlin grep 复查

### #105 演示页按分类拆分子包：路由 name 不变，但文档 frontmatter 与 build-demo 深链扫描必须同步
- **背景**：67 个演示页由 `pages-sub/<name>/` 迁到 `pages-sub/<分类>/<name>/`（basic / layouts / form / pickers / datetime / feedback / display / nav），`vite.config.ts` 的 `subPackages` 拆成 8 项（root 与 dir 同名）
- **关键结论**：
  1. **路由 name 不变**：routeGen 的 `name` 取页面 `defineUniPage` 宏声明，不由目录派生；首页 `router.push({ name })` 与 `demo-components.uts` 零改动。只有 `path` 变为三段
  2. **组目录不能与页面目录同名**：`pages-sub/layout`、`pages-sub/picker` 本身就是页面目录，无法再作组目录 → 组名改用 `layouts` / `pickers`（否则出现 `layout/layout/layout` 且 mv 冲突）
  3. **文档 frontmatter 必须同步**：`demo: pages-sub/<name>/<name>` 共 134 处（中英各 67），`DemoPhone.vue` 直接用它拼 iframe 的 history 路由，漏改即文档站演示区 404
  4. **`scripts/build-demo.mjs` 深链扫描只认两层**：`collectDemoPages` 写死 `readdirSync(base)` + `<name>/<name>.uvue`，页面变三层后返回空数组 → 在线演示全部 404 且**构建日志不报错**（只有 `public/playground/pages-sub` 目录整个消失才能发现）。已改为递归扫描
- **排查信号**：`build:demo` 输出「完成（N 个文件）」但 N 未随页面数增加、`public/playground/pages-sub` 不存在或缺少分类子目录
- **教训**：① 路由结构变更后要同时核对四处：`pages.json` 分包、`routes.gen.uts` path、文档 frontmatter、演示产物深链；② 静态产物生成脚本里的路径约定要写成递归，不要写死层级；③ 批量 `git mv` 用 Node 或显式数组，zsh 中 `${var#*:}` 不做分词会把整串当单个路径；④ 页面物理位置变更属「构建产物必须重建」变更，`pnpm build:demo` 与 `build:docs` 都要重跑并提交产物

### #106 微信小程序 loadFontFace：source 必须是 CSS 资源地址，去重标记必须放模块级
- **背景**：issue #22——微信小程序端任意 `m-icon` 挂载即报 `loadFontFace:fail createDownloadTask:fail invalid url`，全部图标回退默认字形；编译期无任何告警，只有运行时报错
- **根因一（格式）**：`uni.loadFontFace` 的 `source` 必须是 CSS 资源地址格式，内联字体要包成 `url("data:font/ttf;base64,<base64>")`；直接传裸 base64 会被当作 URL 去创建下载任务，必然失败。注意 wxss 的 `@font-face` 在小程序端不支持本地字体文件，所以本地 ttf 方案在 MP 端不可用，只能走 loadFontFace
- **根因二（作用域）**：`<script setup>` 顶层声明的变量是 **setup 实例级**，写在组件里做「已加载」标记，N 个图标实例就是 N 份独立状态 → N 次重复加载。去重标记必须放在独立 `.uts` 的**模块级导出对象**里（编译产物是单例 `const o = new e({...}); exports.mpFontState = o`，所有实例共享同一引用）
- **验证链路（本次实测有效）**：
  1. `cli publish --platform mp-weixin --project <playground>` 生成产物，grep `unpackage/dist/build/mp-weixin/uni_modules/m-ui-x/components/m-icon/m-icon.js` 的 `loadFontFace({...})` 行，确认 `source:'url("data:font/ttf;base64,'+...+')'` 与 `if(mpFontState.loaded)return` 都在
  2. wechatide skill 打开产物目录 → `get_simulator_console --command 'grep -iE "loadFontFace|invalid url|m-icon|error"'` 返回空 + `simulator_screenshot` 看到图标字形正常，即为通过
- **坑（运行才知道）**：HBuilderX 产物 `project.config.json` 的 `appid` 是 `touristappid`，MCP `open_project_window` 会直接报 `APPID_ERROR`（游客模式不被接受）；需先 `get_user_appids` 拿一个有权限的测试号 AppID，临时写进**产物目录**的 `project.config.json`（unpackage 不入 git，无需还原），再开窗
- **教训**：① 字体 / 资源加载类问题编译期不报错，必须进模拟器看 console；② 组件内任何「全局只做一次」的状态都要用模块级文件承载，不能写在 setup 里；③ 小程序端 `global: true` 的副作用是全端生效，天然适合单次加载

### #107 小程序插槽三连坑：`$slots` 空数组恒真、`<slot>` fallback 编译为 `wx:if`、弹层插槽声明是静态的
- **背景**：issue #24——微信小程序端 picker-popup 系列未传插槽时顶部工具栏空白、无法确认提交；Web / App 正常
- **坑一（空数组）**：小程序端未传具名插槽时 `$slots['x']` 是空数组（个别情况空对象），不是 `null`，因此 `$slots.x != null` 恒为真。任何「未传就不转发」的守卫都不能用 `!= null`
- **坑二（fallback 编译）**：`<slot name="x">默认内容</slot>` 在小程序端编译为 `<block wx:if="{{$slots.x}}"><slot name="x"/></block><block wx:else>默认内容</block>`；空数组 truthy → fallback 永不渲染。默认内容必须自己写成 `<template v-if="slotHasContent($slots['x'])"><slot name="x"/></template><view v-else>默认内容</view>`
- **坑三（静态声明）**：父组件对子组件的插槽声明是**编译期静态**的——即使 `<template v-if="..." #toolbar>` 运行时为 false，产物仍生成 `u-s="{{['toolbar','title',...]}}"`，子组件 `$slots` 始终有对应 key。因此只修弹层转发不够，叶子面板层也必须改用显式判断
- **统一解法**：新增 `utils/slot.uts#slotHasContent(slot)`（MP 取 length > 0，非 MP 非 null 即 true），弹层 89 处模板守卫 + 23 处脚本判断统一替换；带默认内容的面板插槽全部改显式 `v-if / v-else`
- **验证链路（本次实测有效）**：
  1. `cli publish --platform mp-weixin` → 产物 `m-picker.wxml` 确认 `wx:if="{{a}}"><slot name="toolbar"` + `wx:elif="{{b}}" class="m-picker__toolbar"`；`utils/slot.js` 为 `length>0` 判定
  2. 产物 `project.config.json` 的 `appid` 改为测试号；wechatide `simulator_refresh` → `automation_navigate` 进演示页
  3. 自定义组件无法用 automation selector 命中（`m-button`、`.m-button` 均 `no such element`），改用 `automation_evaluate`：`const p=getCurrentPages().pop(); p[p.data.c]({type:"tap"})` 触发页面按钮（`p.data.c` 是 WXML 里 `bindclick="{{c}}"` 编译出的方法名，形如 `e0_51`）
  4. 给产物 WXML 临时注入 `id`（页面 `#t-popup` / 弹层 `#t-panel` / 面板 `#t-picker`），用 `p.selectComponent('#t-popup').selectComponent('#t-panel')...` 逐层取实例；读 `picker.data.a/b/c/f/h` 即插槽判定值；`picker.createSelectorQuery().in(picker).select('.m-picker__toolbar').boundingClientRect` 非 null 即已渲染
  5. 触发按钮：`picker[picker.data.j]({type:"tap"})`（WXML 中 `bindtap="{{j}}"` 的编译方法名），随后截图看事件日志 / 弹层关闭
- **注意**：`automation_evaluate` 里用 `setTimeout` 等待会超时；`select(...).text()` 不存在（用 `.fields({text:true})`）；直接调用事件方法可能触发 `[Component] recursive update detected` 警告，重载页面即可恢复
- **教训**：① 跨端插槽判断一律走 `slotHasContent`，禁止裸 `!= null`；② 组件默认内容不要依赖 `<slot>` fallback，显式分支在小程序端才可控；③ 排查小程序插槽问题必须看产物 WXML/WXSS/JS，源码层的直觉不可靠


### #108 小程序弹层内滚轮列定位：隐藏态 scroll-top 无效 + 镜像提前写入 + nextTick 合帧三重叠加
- **背景**：issue #25——`mp-weixin` 端 `m-date-picker-popup` / `m-time-picker-popup` 首次打开滚轮停在首项（`1900-01-01` / `00:00`），不定位到传入的 `value`；关闭复开仍错；点确认会把首项回写
- **根因一（镜像提前写入）**：`requestScroll()` 在写 `scroll-top` 的同时把内部镜像 `actualTop` 写成目标值。弹层首帧挂载时面板处在隐藏态、滚动视口高度为 0，`scroll-top` 被忽略且不产生 `@scroll`——属性值已是目标值、镜像也已是目标值，但真实位置仍是 0，形成「假到位」
- **根因二（同值强制失效）**：同值定位靠「先写 `target + 0.5` 再 `nextTick` 归位」，而小程序端相邻两次 setData 会合帧渲染，同帧内先加后减等效于没有变化（与 m-overlay 淡入、m-popup 滑入同源的时序坑，见 #43 / m-popup 注释）
- **根因三（跳过判断）**：上述假到位之后，`resetSelection()` 再次请求定位时被「镜像已等于目标值」的判断跳过，弹层复开也无法自愈——这也是报告者看到「重新打开仍错」的原因
- **修法**：① 镜像只由 `@scroll` 回灌的 `e.detail.scrollTop` 更新，程序化定位不再回写；② 同值强制先写 `target + 1`、50ms 后归位 `target`（两次 setData 落在不同渲染帧，1px 偏移不可感知）；③ `requestScroll` 内挂 120ms 校验，镜像仍未到位且期间无用户滚动则强制重发一次（只重试一层，避免隐藏态轮询）；④ `m-picker` 以 `positionToken` 令牌下发给各列，新增 `reposition()` 并在弹层 `open`（`reset-on-open` 复位之后）调用——此时滚动视口才真正可滚动
- **验证链路（本次实测有效）**：
  1. `cli publish --platform mp-weixin` 编译成功；产物 `project.config.json` 的 appid 改测试号后用 wechatide 打开
  2. `automation_navigate --action navigateTo --url "/pages-sub/datetime/date-picker-popup/date-picker-popup" --wait 2`
  3. 自定义组件无法用 selector 命中，读页面 WXML 的 `bindclick="{{c}}"`，再用 `automation_evaluate` 执行 `p[p.data.c]({type:"tap"})` 触发按钮；`simulator_screenshot` 目视三列居中 `2026 / 11 / 21`
  4. 关闭弹层：同法调用 `p.data.m`（`v-model:show` 的 `updateShow` 绑定）——编译产物是 `m: e.o(o=>n.value=o)`，**直接传值** `p[k](false)` 才生效（传 `{detail:false}` 无效），随后再点按钮复开，截图仍居中
  5. 受控值验证：`m-time-picker-popup` 演示页第二个按钮（`bindclick="{{n}}"`）打开 09:30，截图三列居中 `09 / 30 / 00`
- **坑**：`automation_page_action --action callMethod` 对编译期生成的事件方法名无效（`this.e0_31 is not a function`）；`--args` 已被 CLI 废弃（改 `--args-file`）。事件方法只能在 `automation_evaluate` 里通过 `p[p.data.xxx](...)` 调用
- **教训**：① 程序化滚动的位置镜像**只能**由真实 scroll 事件回灌，任何「写属性即当作已生效」的优化都会在隐藏态/零高度容器里制造假状态；② 小程序端凡是「两次 setData 构成一次视觉变化」的写法（偏移归位、两段动画）都必须用定时器分帧，不能依赖 `nextTick`；③ 弹层内的滚轮/列表定位要挂在「打开且布局可用」的时机上（本次用 `open` + 校验重发），不能只靠子组件 `onMounted`

### #109 小程序默认插槽不能用「数组长度」判定：内容不进入 `$slots.default` 数组
- **背景**：复选框选中态只剩实心蓝圆 / 蓝方块、没有白勾（用户截图反馈）；顺带发现 `m-loading` 文案、`m-toast` 消息、`m-badge` 包裹子元素、`m-radio` 独立标签、`m-number-keyboard-popup` 内容区在 mp-weixin 端全部不渲染
- **根因**：`slotHasContent()`（#107 为解决 #24 引入）按「数组长度 > 0」判定。该口径只对**具名插槽**成立——具名插槽的内容是父级 `<template #x>` 生成的插槽 vnode，会进入数组。**默认插槽**（直接写在组件标签之间的匿名子节点）在小程序端由匿名 `<slot/>` 直接渲染，不进入 `$slots.default` 的元素：父级传了内容时它是**空数组**（length=0），未传时该 key 根本不存在。长度判定恒为 false → 组件把「已传」误判成「未传」；而组件内默认内容都写在 `<slot>` fallback 里，fallback 被编译成 `wx:else`，于是勾选图标、文案、包裹内容整体消失
- **同一 bug 的双向表现**：#24 是「空数组 truthy → 误判为已传」（具名插槽），本次是「空数组 length=0 → 误判为未传」（默认插槽）。**同一个 `$slots` 值，两种判据，两个方向都错**
- **修法**：默认插槽一律用 `slots['default'] != null`（有内容时空数组非 null；无内容时 key 不存在为 null）；具名插槽继续用 `slotHasContent` 的长度判定。`utils/slot.uts` 注释补充口径区分，避免下次再混用
- **验证方法（本次实测有效）**：
  1. 用 `u-s` 属性确认父级是否真的传了默认插槽：产物页面 WXML 中带 `u-s="{{['d']}}"` 的组件标签才是传了匿名子节点，自闭合标签没有该属性——这是编译期的确切信号，可用来核对运行时行为
  2. 临时把 `unpackage/dist` 的组件 JS 里 `slotHasContent(n.default)` 改成 `null!=n.default` 后 `simulator_refresh`，先验证假设再改源码（改产物只为验证，正式改动仍落在 core）
  3. 观察「有内容 / 无内容」两类实例：`m-loading` 有文案卡片应出现「加载中…」，无文案卡片布局不得出现多余空白（证明「无内容 → key 缺失 → false」成立）
  4. 逐页截图复核：checkbox（圆 / 方 / 禁用选中 / indeterminate）、radio（独立项）、badge（包裹模式子元素）、number-keyboard-popup（键盘上方内容区）、loading（文案 + 无文案）
- **教训**：① 跨端插槽判定必须按「插槽种类」区分口径，具名插槽看长度、默认插槽看 key 存在性，不能用一个工具函数打天下；② 默认内容尽量写成显式 `v-if / v-else` 分支而不是 `<slot>` fallback——fallback 在小程序端的可达性完全依赖 `$slots` 判定，一旦判定错就是整块内容静默消失，而显式分支至少是可读、可测的；③ 选中态、文案这类「缺失即不可见」的问题最容易在联调里被忽略，组件级演示页应同时覆盖「传内容 / 不传内容」两种形态

### #110 小程序自定义组件样式隔离：父组件 wxss 无法给 `m-icon` 内部节点着色（`custom-class` 静默失效）
- **背景**：复选框白勾恢复渲染后仍是**黑色**（用户截图反馈）。`.m-checkbox__check { color: #fff; font-size: 12px }` 写在 `m-checkbox` 的样式里，类名通过 `<m-icon custom-class="m-checkbox__check">` 挂在子组件内部节点上
- **根因**：小程序自定义组件默认样式隔离为 `isolated`（产物 `m-checkbox.json` 未设置 `styleIsolation`），父组件 wxss 的类选择器**无法命中**子组件内部节点。`custom-class` 只是把类名挂上去，样式仍旧在父组件的样式作用域里，于是 `color / font-size` 全部被忽略，勾取图标回落到默认黑色。Web / App 端没有该隔离，所以此前只在小程序端暴露
- **诊断方法**：编译产物 wxss 里能看到规则（`m-checkbox__check{color:#fff;font-size:12px}`），但渲染不生效 → 优先怀疑跨组件样式作用域，而不是 SCSS 变量或选择器优先级
- **修法**：颜色 / 字号落到**本组件自己的容器**（`.m-checkbox__icon-wrap--checked`）上，靠 CSS 继承穿透组件边界下发——继承按渲染树计算，不受样式隔离影响；`custom-class` 只保留给定位类（如弹层关闭图标的 absolute 定位）或干脆不再依赖
- **顺带调整**：`m-checkbox` 族 `shape` 默认值 `round → square`（产品决策，非缺陷），演示页与文档默认值列同步；`shape="round"` 仍可覆盖
- **教训**：① 小程序端凡是「父组件样式 + 子组件节点」的组合都必须假定不生效，跨组件着色/字号一律用「容器继承」或子组件自身 prop（`m-icon` 的 `color` / `size`）实现；② 组件演示页要同时覆盖「默认形状 / 显式覆盖」两种形态，默认值变更才能被看到；③ 同一类视觉问题先看编译产物（wxss / wxml / json 隔离配置），比盲改源码快

### #111 uvue 模板的两条 Android（Kotlin）编译红线：模板内插槽函数调用、setup 函数前向引用
- **背景**：0.7.2 的插槽修复在 mp-weixin / Web 验证通过后，用户 Android 云打包失败（`compileReleaseKotlin`），报错全部集中在 `uni_modules/m-ui-x/components/**/*.kt`
- **红线一：模板里不能直接调用「以 `$slots[…]` 为入参的导入函数」**。报错 `Unresolved reference 'invoke'` + `Function invocation 'slotHasContent(...)' expected`：Android 模板编译器会把 `slotHasContent($slots['toolbar'])` 生成成 `.invoke` 形式，导入的模块函数在这里不可调用。对照证据：同一文件里 `$slots['x'] != null`（纯属性访问）与组件方法调用（`isOptionSelected(opt, li)`）都能正常编译，说明问题出在「导入函数 + `$slots` 实参」这一组合，而不是 `$slots` 本身
  - **修法**：守卫一律在脚本层用计算属性求值，模板只引用布尔值：`const hasToolbarSlot = computed<boolean>(() => slotHasContent(slots['toolbar']))` + `v-if="hasToolbarSlot"`（本次 22 个组件、105 处模板守卫）
- **红线二：`<script setup>` 里的函数按声明顺序编译为局部函数，不能前向引用**。`requestScroll` 调用后声明的 `scheduleVerify` → `Unresolved reference 'scheduleVerify'`（mp / Web 的 JS 有函数提升，完全看不出来）
  - **修法**：把被调用函数移到前面；互相调用（A→B、B→A）无法靠换序解决，就内联为**单个函数自递归**（本次校验逻辑内联进 `requestScroll`，递归调用 `requestScroll(index, false)`）或改为对象上的方法
- **验证链路**：mp-weixin 编译 + 截图回归（选择器弹层工具栏、滚轮定位、复选框白勾）仍通过；Android 端只能由云打包验证，本地 macOS 无 Android 编译链，**必须在提交前把「模板内是否调用导入函数」「函数是否前向引用」当作静态检查项**
- **教训**：① uvue 模板的最佳实践是「模板只做取值与比较，逻辑一律收敛到 computed / 方法」，既避开各端模板编译器差异，也方便三端一致验证；② 云打包错误请按 `.kt` 文件与行号定位到源码模板行，两条报错成对出现（列号差 6）就是模板表达式的信号；③ 本地能跑的端（mp / Web）通过 ≠ 全平台通过，Android 的 Kotlin 约束要在写代码时就遵守

### #111 补充：还漏了 `slots['x']`（无 `$`）这一写法，静态检查要按「模板段」扫描
- 第一次修复按 `slotHasContent($slots[` 搜索，漏掉了 3 个用 setup 变量直接写的组件（`m-tabs` 4 处、`m-date-strip` 3 处，形如 `v-if="slotHasContent(slots['nav-left'])"`），云打包第二轮仍报同样的 `Unresolved reference 'invoke'`
- **正确的静态检查**：以 `<script` 为界只扫模板段，而不是按具体写法匹配——
  ```python
  t = source.split('<script')[0]
  assert 'slotHasContent(' not in t
  ```
- 教训：跨端编译规则的检查要按「语法位置」定义（模板内 / 脚本内），不要按某一种书写形式定义，否则换个变量名或加不加 `$` 就会漏

### #111 再补充：批量改写要防「自引用替换」，Kotlin daemon 崩溃是编译错误的次生现象
- 第三轮云打包报 `unresolved reference 'hasBottomInfoSlot' / 'hasNavLeftSlot'` 等，并附带 `Connection to the Kotlin daemon has been unexpectedly lost`。**daemon 崩溃是大量编译错误后的次生现象，不是内存/环境问题**，先修 `e:` 行
- 根因：批量脚本先插入 `const hasNavLeftSlot = computed(() => slotHasContent(slots['nav-left']))`，随后又对全文执行 `slotHasContent(slots['nav-left']) → hasNavLeftSlot` 替换，把刚生成的函数体替换成了它自己（`computed(() => hasNavLeftSlot)`）。上一批 22 个文件因为模板里写的是 `$slots[...]`（带 `$`），与插入体里的 `slots[...]` 不匹配，才侥幸没中招
- **规则**：批量改写时，插入的声明必须是**替换完成后**的最终文本，或先替换模板段再插入声明；改完必须做一致性自检——「计算属性名 ↔ 插槽名」是否一一对应、模板引用的每个标识符在脚本中是否有声明
- 自检脚本（本次有效）：
  ```python
  tpl, _, script = src.partition('<script')
  assert 'slotHasContent(' not in tpl
  for cn, slot in re.findall(r"const (has\w+Slot) = computed<boolean>\(\(\) => slotHasContent\(slots\['([^']+)'\]\)\)", src):
      assert cn == 'has' + pascal(slot) + 'Slot'
  for name in set(re.findall(r'\b(has\w+Slot)\b', tpl)):
      assert re.search(r'const %s\s*=' % name, script)
  ```
- 验证：mp-weixin 编译成功，`tabs`（基础/name 匹配/滚动/禁用/卡片与药丸风格）与 `date-strip`（基础单选/多选超限/范围端点/value-format）截图正常
