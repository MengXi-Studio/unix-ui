# m-toast 轻提示 实施方案

> 状态：立项完成，等待「疑问清单」作答；全部澄清后进入实现。

## 需求

用户预研 Vant Toast 与 Sard Toast 的函数式调用在 uni-app x 的可行性，确认「动态挂载式」不可行后，按「**全局函数 + 页面预置容器 + 全局单例桥通信**」方案立项 m-toast。要求 API 手感对齐 Vant（`showToast('文案')` 等），同时保留组件式用法。

参照实现：
- Vant Toast（https://vant-ui.github.io/vant/#/zh-CN/toast）：showToast / showLoadingToast / showSuccessToast / showFailToast / closeToast / setToastDefaultOptions；组件式 `van-toast` + v-model:show + message 插槽；单例语义（连续调用覆盖前一个）。
- Sard Toast（https://sard.wzt.zone/components/toast）：toast / toast.success / toast.fail / toast.loading / toast.hide + createToast 独立实例；title 两段式（标题 + 正文）；visible 双向绑定。

## 需求分析

- **包影响**：core 新增 `m-toast` 组件目录（反馈组件，与 overlay / loading 同组）；playground 新增演示页 + 首页分组登记；docs 双语文档 + 侧栏（zh.ts / en.ts 反馈组追加）。
- **依赖组件**：m-loading（loading 型气泡内的加载动画）、m-icon（success / fail 图标、自定义 icon）、复用 m-overlay 经验的透明遮罩拦截（forbidClick）。
- **技术前提（预研结论）**：uni-app x 无运行时动态挂载（无 createApp 挂载 / 无 h() 渲染 uvue 组件 / 无 body 宿主），函数式必须页面预置容器。
- **页面栈语义**：容器 mounted 时向全局单例注册渲染回调（后注册覆盖），栈顶页面最后 mounted 天然持有注册；返回前页时栈顶注销、前页注册恢复——无需 eventbus，类型安全的 UTS 回调直调。

## 伪代码设计

### 类型定义

```uts
/** 提示类型：文本 / 加载 / 成功 / 失败（Vant 的 html 型 uvue 无 v-html，不支持） */
type ToastType = 'text' | 'loading' | 'success' | 'fail'

/** 展示位置 */
type ToastPosition = 'top' | 'middle' | 'bottom'

/** 加载图标类型（对齐 m-loading 的 type） */
type ToastLoadingType = 'circular' | 'spinner'

/** 函数式调用选项（Vant ToastOptions 裁剪版） */
type ToastOptions = {
  type?: ToastType | null            // 默认 'text'
  position?: ToastPosition | null    // 默认 'middle'
  message?: string | null            // 支持 \n 换行
  icon?: IconName | null             // 自定义图标（覆盖 success/fail 默认图标；不支持图片链接）
  iconSize?: number | string | null  // 默认 '36px'
  overlay?: boolean | null           // 是否显示背景遮罩（默认 false）
  forbidClick?: boolean | null       // 禁止背景点击（透明遮罩拦截；loading 型默认 true）
  closeOnClick?: boolean | null      // 点击提示后关闭
  closeOnClickOverlay?: boolean | null // 点击遮罩后关闭
  loadingType?: ToastLoadingType | null // 默认 'circular'
  duration?: number | null           // 展示时长 ms；0 不自动关闭（loading 型默认 0，其余 2000）
  zIndex?: number | string | null    // 默认走主题基准 2000+
  customClass?: string.ClassString   // 气泡自定义类名
  customStyle?: string               // 气泡自定义内联样式
  onOpened?: (() => void) | null     // 完全展示后回调
  onClose?: (() => void) | null      // 关闭后回调
}
```

### 全局桥（组件库导出的函数式 API）

```uts
// 全局单例：宿主容器注册表（仅保存最近注册容器的渲染回调）
type ToastHost = (cmd: ToastCmd) => void
let toastHost: ToastHost | null = null

// 容器 mounted 时自注册 / onUnmounted 注销
export function registerToastHost(host: ToastHost) { toastHost = host }
export function unregisterToastHost() { toastHost = null }

// 对外导出的函数式 API（Vant 命名）
export function showToast(options: string | ToastOptions): void
export function showLoadingToast(options: string | ToastOptions): void  // type 强制 loading + duration 默认 0 + forbidClick 默认 true
export function showSuccessToast(message: string): void                 // type 强制 success
export function showFailToast(message: string): void                    // type 强制 fail
export function closeToast(): void
```

`ToastCmd` 为容器渲染指令（type / message / 上述 options 全量 + 唯一 seq），单例语义：重复 showToast 发新指令覆盖当前显示（Vant 行为）。

### 容器组件 `<m-toast />`（组件式 + 函数式共用基座）

```uts
type Props = {
  // 组件式用法：v-model:show 控制显隐；函数式用法忽略（命令驱动）
  show?: boolean
  type?: ToastType | null
  message?: string | null
  icon?: IconName | null
  iconSize?: number | string | null
  position?: ToastPosition | null
  overlay?: boolean | null
  forbidClick?: boolean | null
  closeOnClick?: boolean | null
  closeOnClickOverlay?: boolean | null
  loadingType?: ToastLoadingType | null
  duration?: number | null
  zIndex?: number | string | null
  customClass?: string.ClassString
  customStyle?: string
}
// emits: update:show / opened / closed；slots: default（替代 message 文本，容纳自定义内容）
```

模板结构（扁平 flex，无伪元素）：

```
view.m-toast                      // position: fixed 全屏，z-index，条件渲染
├─ view.m-toast__overlay          // overlay=true 渲染 m-overlay / forbidClick=true 渲染透明拦截层（catch 点击）
├─ view.m-toast__wrap --top/--middle/--bottom   // 定位层（top/bottom 20% 偏移，middle 居中）
│  └─ view.m-toast__bubble        // 黑色半透明圆角气泡（rgba($m-black, 0.7)）
│     ├─ m-loading                // type=loading（loadingType 直通）
│     ├─ m-icon                   // type=success/fail 或传了 icon（success→'checked'，fail→'close'，对齐 Vant 图标语义，具体名实现时核对 icons.uts）
│     └─ text.m-toast__message    // message（\n 换行）；default 插槽存在时渲染插槽
```

关键逻辑：
- 动画：`UniElement.animate` 淡入（opacity 0→1，约 200ms）/ 淡出；watch 显隐 `{ flush: 'post' }` 启动。
- duration 计时器：duration > 0 时 setTimeout 自动 close；重复 show 重置计时器；close 前清定时器。
- 点击气泡：closeOnClick 为 true 关闭；点击遮罩：closeOnClickOverlay 为 true 关闭。
- 函数式命令流：onMounted `registerToastHost(箭头函数)`，收到命令 → 更新内部状态 + show；onUnmounted 注销。

### 主题变量（vars.scss 新增段，全 `!default`）

| 变量 | 默认值（对齐 Vant --van-toast-*） |
| --- | --- |
| $m-toast-max-width | 70% |
| $m-toast-text-color | #fff |
| $m-toast-font-size | 14px |
| $m-toast-line-height | 20px |
| $m-toast-radius | 8px |
| $m-toast-background | rgba(0, 0, 0, 0.7) |
| $m-toast-icon-size | 36px |
| $m-toast-text-min-width | 96px |
| $m-toast-text-padding | 8px 12px |
| $m-toast-default-padding | 16px |
| $m-toast-default-width / min-height | 88px / 88px |
| $m-toast-top-distance / bottom-distance | 20% / 20% |
| $m-toast-z-index | 2000 |

### 演示页与文档

- `packages/playground/pages-sub/toast/toast.uvue`：文字提示 / 成功失败 / 加载 / 自定义图标 / 位置 top-middle-bottom / 遮罩与禁止点击 / 点击关闭 / 自定义内容（组件式 + default 插槽）/ 函数式与组件式混合计时；每节按钮即调函数。
- 首页分组：反馈组件追加 m-toast（字母序 loading、overlay、toast）。
- 文档：`src/components/toast.md` + `src/en/components/toast.md`（函数式 API 表 + ToastOptions 表 + 组件式 Props/Events/Slots 表 + 「页面预置容器」使用前提说明）；侧栏 zh.ts / en.ts 反馈组追加。
- 三处 changelog 0.2.0 追加。

## 疑问清单

### Q1 函数式 API 命名：Vant 式还是 Sard 式？（影响：导出函数面）
Vant：`showToast / showLoadingToast / showSuccessToast / showFailToast / closeToast`（本库一贯对齐 Vant）；
Sard：`toast / toast.success / toast.fail / toast.loading / toast.hide` + `createToast` 独立实例。
回答：A。

### Q2 组件式形态的范围？（影响：组件 props / 演示页 / 文档结构）
方案 A：一期同时提供组件式（v-model:show 全量 props + default 插槽嵌入自定义内容，对齐 Vant「使用 Toast 组件」节）与函数式，函数式内部即命令驱动同一组件；
方案 B：一期仅函数式，组件式 props 仅作内部实现不对外承诺。
回答：A。

### Q3 单例语义与多实例？（影响：桥的实现复杂度）
方案 A：默认单例（连续 showToast 覆盖当前提示，对齐 Vant 默认），`allowMultipleToast` 多实例二期再议；
方案 B：一期即实现多实例。
回答：A。

### Q4 loading 型语义（对齐 Vant）：duration 默认 0 不自动关闭、forbidClick 默认 true、需 `closeToast()` 手动关闭，确认吗？
回答：确认。

### Q5 uvue 限制裁剪项确认：`html` 类型（无 v-html）、`wordBreak`（ucss 不支持）、`transition` 动画类名（改内置淡入淡出）、`teleport`（无意义）、icon 仅支持 m-icon 字体图标名（不支持图片链接）——以上全部裁剪，确认吗？
回答：确认。

### Q6 Sard 的 title 两段式（标题 + 正文，气泡内两行文字）是否需要？（Vant 无此设计；建议不保持 Vant 对齐、不做）
回答：否。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- **桥带 seq 令牌**：`registerToastHost` 返回自增 seq，`unregisterToastHost(seq)` 仅在 seq 相等（自己仍是注册者）时清空——比伪代码的无参注销多一层防护，防止栈顶页面 unmount 清掉前页容器的注册（多页各预置容器的场景）。
- **动画实现改 ucss transition**：伪代码写 `UniElement.animate` 淡入，落地改为 opacity 两态 ucss transition（300ms ease）+ 双 rAF（WEB）/ nextTick（非 WEB）置 1 触发，与 m-overlay 同款时序；`TRANSITION_DURATION = 300` 同时供 opened 回调时延复用。
- **遮罩与拦截为条件渲染的 mask 层**（非复用 m-overlay 组件）：`v-show="visible && maskVisible"`，maskVisible = overlay || forbidClick——无 pointer-events 环境下全屏层天然拦截点击，普通提示必须不渲染该层（曾因漏写 maskVisible 条件出现「普通提示显示期间全页不可点」真 bug，测试暴露后修复并补断言）。
- **气泡定位**：本体 `fixed + left: 50% + translate(-50%, -50%)`（middle）/ top·bottom 20%，不用全屏 flex 容器居中（会拦截整页点击），仅气泡区域参与点击（closeOnClick）。
- **类型复用**：loadingType 直接复用 m-loading 的 `LoadingType`（未另定义 ToastLoadingType）；emits 为 `update:show` / `opened` / `close`（伪代码写 closed）。
- **组件式初始 show=true**：onMounted 时直接可见、不做淡入动画；close 内置幂等保护（`!visible` 直接 return）。

### 落码过程中的三个编译/运行问题

1. **sass Undefined variable: $m-toast-default-padding**：任务文档变量表有、vars.scss 落码时漏加，页面 500（404 表现为「连接服务器超时」）——补变量后恢复。
2. **ESM SyntaxError: does not provide an export named 'LoadingType'**：m-toast.uvue 从 `./toast.uts` 导入 LoadingType，但该文件只 import 未 re-export——改从 `'../m-loading/loading.uts'` 直接导入（m-button 先例），LESSONS #40。
3. **mask 拦截真 bug**：见上，Playwright 超时日志定位，LESSONS #41。

### 变更文件清单

- core（组件源，唯一真源）：`packages/core/components/m-toast/toast.uts`（类型 + 全局桥 + 5 个函数式 API）、`packages/core/components/m-toast/m-toast.uvue`（容器组件）、`packages/core/theme/vars.scss`（Toast 段 16 个 `!default` 变量）
- playground：`pages-sub/toast/toast.uvue`（9 节演示 + 页尾函数式容器）、`pages.json`（subPackages 注册）、`router/router.config.uts`、`pages/index/demo-components.uts`（反馈组追加，字母序 loading / overlay / toast）、`uni_modules/m-ui-x/changelog.md`（KEEP）
- docs：`src/components/toast.md` + `src/en/components/toast.md`（双语文档）、`.vitepress/config/zh.ts` + `en.ts`（侧栏反馈组）、`src/changelog.md` + `src/en/changelog.md`（0.2.0）
- 同步产物：`pnpm sync:uni-modules` 生成 `playground/uni_modules/m-ui-x/components/m-toast/` 等

### 验证方式与结果（core-protocol DoD）

- `pnpm sync:uni-modules:check`：playground 插件与 core 一致，通过。
- 编译运行：HBuilderX CLI dev server（5175），toast 页 200，组件改动经 sync 后 HMR 生效。
- Playwright 全变体实测（`/tmp/pw-popup-verify/verify-toast.cjs`，系统 Chrome headless）：**35 断言全过**——文字/换行/成功/失败/加载/自定义图标/三位置/overlay 遮罩/forbidClick 拦截（限时点击 catch 断言）/closeOnClick/长显 + closeToast/单例覆盖与计时重置/onOpened·onClose 回调/组件式插槽与 duration/无 console·page 报错（favicon 404 已归因为 dev 环境固有噪音并过滤）。
- 首页分组断言（`verify-demo-groups.cjs`）：7 断言全过（反馈组件 = 加载 / 遮罩层 / 轻提示，字母序）。
- `pnpm build:docs`：成功（VitePress 死链检查通过）；`pnpm build:demo`：成功（演示产物 58 文件入库）。
- LESSONS_LEARNED 追加 #40 / #41 / #42。

### 遗留 TODO

- `allowMultipleToast` 多实例：Q3 定案二期再议（桥为单例注册，多实例需改注册表结构）。
- `setToastDefaultOptions` 全局默认选项（Vant 有）：一期未立项，如需再开任务文档。
- Android / iOS / HarmonyOS / 小程序端真机与开发者工具实测（当前 Web 端验证通过，代码已按条件编译适配）。
