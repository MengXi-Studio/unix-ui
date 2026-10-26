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
