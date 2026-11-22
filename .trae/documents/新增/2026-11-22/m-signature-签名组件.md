# m-signature 签名组件 实施方案（Vant + sard 合并版）

## 需求

用户原话：「现在开始，开发新组件；`https://sard.wzt.zone/components/signature`」，并追加：「`https://vant-ui.github.io/vant/#/zh-CN/signature` 结合这个重新输出一份设计」。

目标：以 **Vant Signature 为主 API 基线**（符合本项目「对标 Vant 同名组件」的约定），吸收 sard 的**全屏签名**能力，新增 `m-signature` 手写签名组件，并接入完整链路（组件 → 主题 → 同步 → 演示 → 双语文档 → 验证）。

## 需求分析

### 两套参考的差异

| 维度 | Vant Signature | sard Signature | 本方案取舍 |
| --- | --- | --- | --- |
| 笔触 | `pen-color`、`line-width` | `color`、`line-width` | 采用 Vant：`penColor`、`lineWidth` |
| 背景 | `background-color`（导出底色） | `background` | 采用 Vant：`backgroundColor` |
| 撤销 | `history-size` + `undo()` | 无 | 采用 Vant：`historySize` + `undo()` |
| 按钮 | `clear-button-text`、`undo-button-text`、`confirm-button-text` | `cancel-text`、`clear-text`、`confirm-text` | 采用 Vant 三文案；全屏扩展补 `cancelButtonText` |
| 事件 | `start`、`end`、`signing`、`submit({image, canvas})`、`clear` | `confirm(dataURL)`、`clear`、`cancel`、`update:visible` | 采用 Vant 事件名；`submit` 数据跨端仅保留 `image`；吸收 sard 的 `cancel` / `update:visible` |
| 插槽 | `tips`（不支持 Canvas 时的提示） | `default`（全屏底部提示） | 合并为一个 `tips` 插槽 |
| 方法 | `resize()`、`clear()`、`submit()`、`undo()` | `clear()`、`confirm()` | 采用 Vant 四方法 |
| 形态 | 仅内联 | 内联 + `full-screen` + `visible` | 内联为默认，全屏作为扩展保留 |
| 主题 | padding / content-height / content-background / content-border | canvas 高度 / 背景 / 全屏背景 / 间距 / 侧边按钮宽度 | 以 Vant 四变量为主，补全屏相关变量 |

### 涉及文件与影响面

- 组件源：`packages/core/components/m-signature/m-signature.uvue`（新建，组合式 API，逻辑内联）
- 主题变量：`packages/core/theme/vars.scss` 新增 `$m-signature-*` 段（全部 `!default`）
- 同步：`pnpm sync:uni-modules`
- 演示页：`packages/playground/pages-sub/form/signature/signature.uvue`（数据录入组）+ `pages/index/demo-components.uts` 登记（组内字母序插入）
- 文档：`packages/docs/src/components/signature.md` + `src/en/components/signature.md`，并更新 `zh.ts` / `en.ts` 侧栏（组内字母序）
- 版本号与发版说明：本任务不改 `package.json`，发版时统一处理

### 平台可行性（已查证 uni-app x 文档）

- `canvas`：Web 4.21 / 微信小程序 4.41 / 支付宝 5.31 / Android 4.25 / iOS 4.25 / HarmonyOS 4.61
- `uni.createCanvasContextAsync`：同上（微信小程序只能异步取上下文）
- `CanvasContext.getContext('2d')`：W3C 风格 `CanvasRenderingContext2D`
- `CanvasContext.toDataURL()`：同上全端可用；**无参数**（不接受 `type` / `quality`）
- `canvas` 组件自带 `@touchstart/@touchmove/@touchend/@touchcancel`；`UniTouch` 提供 `pageX/pageY`、`clientX/clientY`、`screenX/screenY`
- 结论：统一「异步 CanvasContext + 2d 上下文 + toDataURL」；坐标需用 `pageX/pageY` 减画布偏移换算

## 伪代码设计

### Props

```uts
type Props = {
	penColor?: string            // 笔触颜色，默认 '#000'（Vant pen-color）
	lineWidth?: number           // 线宽 px，默认 3
	historySize?: number         // 撤销历史最大笔画数，默认 20
	backgroundColor?: string     // 导出图片底色；'' 表示透明
	tips?: string                // Canvas 初始化失败时的提示文案（Vant tips）
	clearButtonText?: string     // '清空'
	undoButtonText?: string      // '撤销'
	confirmButtonText?: string   // '确认'
	// —— sard 全屏扩展 ——
	fullScreen?: boolean         // 是否全屏签名，默认 false
	visible?: boolean            // 全屏显隐（v-model:visible）
	cancelButtonText?: string    // '取消'
}
```

> 不设 `height` prop：画布高度走主题变量 `$m-signature-content-height`（对齐 Vant 的 CSS 变量设计）。

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `start` | — | 开始一笔 |
| `signing` | `touch: TouchEvent` | 书写过程中 |
| `end` | — | 一笔结束 |
| `submit` | `data: SignatureSubmitData` → `{ image: string }` | 点击确认；空签名 `image = ''` |
| `clear` | — | 点击清空 |
| `cancel` | — | 全屏模式点击取消 |
| `update:visible` | `visible: boolean` | 全屏显隐回写 |

> `submit` 不返回 `canvas` 元素：uni-app x 各端 Canvas 元素类型不一致且无法安全外抛，文档标注与 Vant 的差异。

### Slots

- `tips`：画布内提示文案（同时用于「不支持 Canvas」兜底与全屏底部提示）；默认内容取 `props.tips`

### Expose

- `resize()`：外层尺寸 / 显示状态变化后重新测量并重绘（Vant 4.7.3）
- `clear()`：清空签名与历史
- `submit()`：等价点击确认
- `undo()`：撤销上一笔

### 模板结构

```
内联模式（fullScreen=false）
└─ view.m-signature
   ├─ view.m-signature__content（相对定位；虚线边框由主题变量控制）
   │  ├─ canvas#m-signature-canvas（@ready / @touchstart / @touchmove / @touchend / @touchcancel）
   │  └─ view.m-signature__tips（tips 插槽 / 文案；仅初始化失败时显示）
   └─ view.m-signature__actions
      ├─ text 撤销（strokes==0 时置灰禁用）
      ├─ text 清空
      └─ text 确认

全屏模式（fullScreen=true 且 visible=true）
└─ view.m-signature-full（position: fixed；四边 0；z-index）
   ├─ view.m-signature-full__content（flex:1，canvas 铺满）
   ├─ view.m-signature-full__tips（tips 插槽）
   └─ view.m-signature-full__actions（取消 / 撤销 / 清空 / 确认）
```

- 两个 canvas 用不同 id（`m-signature-canvas` / `m-signature-full-canvas`），按模式 `v-if` 只挂一个
- 全屏层自建 `fixed` 覆盖层，不复用 `m-popup`：`m-popup` 无 full 方位，签名全屏是整屏编辑态而非弹层
- 两个模式共用一套绘制状态：切换时销毁旧 canvas、重新取上下文并重绘历史笔画

### 绘制与历史

- 初始化（canvas `@ready`）：
  ```uts
  uni.createCanvasContextAsync({
  	id: 'm-signature-canvas',
  	component: getCurrentInstance()!.proxy,
  	success: (ctx: CanvasContext) => { /* getContext('2d') → 记录 */ },
  	fail: (_) => { canvasReady = false } // 显示 tips 兜底
  })
  ```
- 尺寸 / dpr：按实际布局尺寸设置 `canvas.width = w * dpr`、`canvas.height = h * dpr`，`context.scale(dpr, dpr)` 一次；`resize()` 重新执行并重绘
- 坐标：`pageX/pageY` 减画布偏移（初始化与 `resize()` 时缓存），换算为画布内坐标
- 笔画模型：
  ```uts
  type SignaturePoint = { x: number; y: number }
  type SignatureStroke = { points: SignaturePoint[] }
  ```
  `strokes` 保存全部笔画，超过 `historySize` 时丢弃最早一笔；`undo()` 弹出最后一笔并整幅重绘
- 绘制：`beginPath → moveTo → lineTo → stroke`，`lineCap/lineJoin = 'round'`，`strokeStyle = penColor`，`lineWidth = lineWidth`
- 清空：`clearRect` + 按 `backgroundColor` 重绘底色 + `strokes = []`，派发 `clear`
- 确认：`strokes.length == 0` 时 `image = ''`，否则 `toDataURL()`；派发 `submit`；全屏模式随后 `update:visible(false)`
- 取消：仅全屏，派发 `cancel` 并关闭
- UTS 红线：无 `undefined`、条件必须布尔、回调用箭头函数、对象字面量只赋 `type`

### 主题变量（新增，全部 `!default`）

```scss
$m-signature-padding: 8px;                     // 组件内边距（Vant --van-signature-padding）
$m-signature-content-height: 200px;            // 画布高度（Vant content-height）
$m-signature-content-background: ...;          // 画布底色（Vant content-background）
$m-signature-content-border: 1px dotted #dadada; // 画布边框（Vant content-border，可拆细线规范）
$m-signature-action-height: 52px;              // 操作栏高度
$m-signature-action-color: ...;                // 操作文字颜色
$m-signature-action-disabled-color: ...;       // 撤销禁用色
$m-signature-tips-color: ...;                  // 提示文字颜色
$m-signature-full-background: ...;             // 全屏背景（sard）
$m-signature-full-gap: 16px;                   // 全屏内边距（sard）
```

（变量命名与取值在实施时对齐 `vars.scss` 既有 `$m-color-*` / `$m-fill-*`）

## 疑问清单

### Q1 是否保留 sard 的全屏形态（`fullScreen` / `visible` / `cancel` / `cancelButtonText`）

Vant 无全屏能力。建议**保留**，作为本组件的扩展能力（演示页与文档单独示例），默认关闭不影响 Vant 基线。

回答：保留。

### Q2 `type` / `quality` 是否彻底移除

Vant 有 `type`（png/jpeg）；uni-app x 的 `toDataURL()` 不接受参数，`toBlob` 在 Android/iOS 不支持。建议**不提供 `type`**，统一 PNG dataURL，文档注明与 Vant 的差异。

回答：uni-app x 的 `toDataURL()` 方法文档中什么地方写明不支持 `type` 参数？

> 澄清（证据）：文档「CanvasContext 的方法 → toDataURL(): string」一节中，方法签名写作 `toDataURL(): string`，该节只有「返回值」表，**没有「参数」表**；与之对比，同页 `toBlob(callback, type?, quality?)` 明确列出了 `type` / `quality` 参数，且其兼容性表中 Android / iOS 为 `x`。
> 因此准确表述是：**方法签名本身不接收参数**（不是文档写了「不支持 type」的否定句）。据此按建议不提供 `type` / `quality`，统一输出 PNG dataURL。

### Q3 `submit` 回调数据是否只给 `image`

Vant 返回 `{ image, canvas }`；跨端 Canvas 元素类型不一致且不可安全外抛。建议**只返回 `{ image }`**。

回答：只返回 `{ image }`。

### Q4 插槽合并为 `tips` 是否可接受

Vant 的 `tips` 用于「不支持 Canvas」兜底，sard 的 `default` 用于全屏底部提示。建议合并为 `tips` 一个插槽（画布内 / 全屏底部复用），不另设 `default`。

回答：合并为 `tips` 一个插槽。

### Q5 首版平台保证范围

建议 **Web + 微信小程序 + Android/iOS** 作为验收平台（Web 实测绘制/撤销/导出，微信小程序实测渲染与按钮，App 编译通过）；支付宝/鸿蒙标注「待实测」。

回答：全平台实现。

### Q6 分组与命名

建议归入「数据录入」组（`pages-sub/form/signature/`），组件名 `m-signature`，演示与侧栏按字母序插入（`select` 之后、`slider` 之前，以实际清单为准）。

回答：支持。

## 实施记录

### 落地文件

- 组件源：`packages/core/components/m-signature/m-signature.uvue`
- 主题变量：`packages/core/theme/vars.scss`（新增 `$m-signature-*` 19 个变量，全部 `!default`）
- 演示页：`packages/playground/pages-sub/form/signature/signature.uvue`（5 个示例：基础 / 自定义笔触与背景 / 撤销历史 / 实例方法 / 全屏）
- 演示登记：`pages/index/demo-components.uts`（数据录入组，按字母序插入 `signature`）
- 文档：`packages/docs/src/components/signature.md`、`src/en/components/signature.md`，`zh.ts` / `en.ts` 侧栏各新增一项
- 路由产物：`pages.json`、`router/routes.gen.uts` 由 routeGen 自动生成并包含 signature

### 与设计稿的差异（实现期修正）

1. **提交载荷类型改为 `UTSJSONObject`**：原先 emit 载荷用 `type SignatureSubmitData`，Web 端传到页面后是普通对象，页面按 `UTSJSONObject.getString('image')` 读取会报 `data.getString is not a function`。改为组件内 `const data = { image } as UTSJSONObject` 后，Web / 小程序一致。
2. **Web 端不能依赖 canvas `@ready`**：实测 Web 下 `@ready` 触发不可靠，`canvasReady` 一直为 false、显示兜底提示。改为 `onMounted + nextTick → measureCanvas()` 主动测量，并保留 `@ready` 与 `visible` / `fullScreen` watch 作为补充触发。
3. **测量按平台分流**（复用 m-rate / m-tabs 既有模式）：Web 用组件 ref 的 `getBoundingClientRect()`；App 用 `getBoundingClientRectAsync()`；小程序用 `uni.createSelectorQuery().in(proxy).select('#id').boundingClientRect().exec((ret) => ...)`。
4. 绘制上下文统一走 `uni.createCanvasContextAsync`，`toDataURL()` 导出；不提供 `type` / `quality`（方法签名无参数）。

### 验证结果（DoD）

- `pnpm sync:uni-modules` / `sync:uni-modules:check`：通过
- Web（HBuilderX `cli launch web`，history 路由）：页面 200；画布正常初始化；触摸拖拽可绘制；点确认后 `submit` 返回 dataURL 并成功回显预览图；全屏模式下提示文案、取消/撤销/清空/确认按钮、取消关闭均正常；console 无报错
- 微信小程序（`cli launch mp-weixin --compile true`，69 页）：编译成功；签名页渲染正常——画布为空白可绘区（无「暂不支持」兜底）、撤销置灰、清空/确认正常；未做模拟器手势绘制验证
- 文档：`pnpm build:docs` 通过（死链检查 + 页面渲染）
- 未验证：Android / iOS / 鸿蒙 / 支付宝小程序（代码已按条件编译适配，待随版本复验）

### 遗留

- 版本号未改；`m-signature` 需随下一个版本（建议 0.8.0）补充发版说明与插件 changelog

### 补丁：线条发飘（实测反馈后修复）

- 现象：书写时线条与手指位置错位 / 发飘
- 根因：画布视口偏移只在挂载时测量一次，页面滚动后 `getBoundingClientRect().top` 已变化但缓存未更新，`clientY - canvasTop` 产生整体偏移
- 修法：
  1. 每次 `touchstart` 调用 `refreshOffsetThenBegin()` 重新测量偏移（Web 同步 / App 异步矩形 / 小程序 SelectorQuery）；
  2. 异步平台在回调返回前把触点原始坐标存入 `pendingPoints`，测量回来后统一换算并补画，避免首段丢失或错位；
  3. Web 画布样式增加 `touch-action: none`，阻止书写过程中页面滚动
- 复测（Web）：滚动到视口下方画布再绘制，笔画中心与触点偏移一致（60 vs 60），绘制期间 `scrollTop` 不变；console 无报错；mp-weixin 重新编译成功

### 补丁：帧合并 + 二次曲线平滑

- 目的：消除逐点 `stroke()` 的渲染延迟与折线感
- 实现：
  1. `touchmove` 仅把点追加到当前笔画，用 `CanvasContext.requestAnimationFrame` 调度帧合并（全端兼容，替代 `setTimeout`），同一帧内多次移动只绘制一次；
  2. 曲线算法：相邻点中点作为曲线段端点，原始点作为控制点 `quadraticCurveTo`；`SignatureStroke` 增加 `drawnIndex / lastMidX / lastMidY` 增量游标，只画新增尾段，不整笔重绘；
  3. 末点预览：每帧从当前中点直线连到最新点，避免笔画末端落后手指半个线段；
  4. 收笔时取消动画帧并补画尾段；撤销 / 清空时 `cancelAnimationFrame`，`redraw()` 用完整平滑路径重画并复位游标
- 复测（Web）：21 点弧线连续平滑、到达末点（`drawnIndex=20`、终点坐标一致）；撤销后画布像素归零；重画 + 确认生成预览图（dataURL 长度 10926）；console 无报错；mp-weixin 编译成功

