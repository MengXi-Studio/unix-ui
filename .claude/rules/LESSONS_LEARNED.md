# LESSONS_LEARNED

> 仅记录"只有运行起来才知道"的坑。前提：经验已通过运行验证（DoD 达成）。

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
- 产物自检：`pages-sub/<name>/<name>/index.html` 深链目录 + 根 404.html 必须存在；构建日志「资源路径补前缀：0 个文件」属正常（vite base 已生效，rewriteBase 是兜底）
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
- 关联：本地 `.kt` 与云端报错行号逐行吻合（m-badge.kt:35、demo-navbar.kt:30 精确命中），可把云端错误直接映射回本地生成产物定位

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
