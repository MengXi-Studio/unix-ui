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
- 现象：`@import './uni_modules/mxi-ui/theme/vars.scss'` 报 Can't find stylesheet
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
