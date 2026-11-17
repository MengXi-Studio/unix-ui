# m-password-input 密码输入组件 实施方案

## 需求

对标两家实现，为 unix-ui 补一组密码/验证码格子组件，与已完成的 `m-number-keyboard`（数字键盘）配合使用：

- **Vant PasswordInput**：单组件方框格子，`mask` 圆点隐藏、`focused` 光标、`info / error-info` 下方提示
- **Sard PasswordInput**：双风格 `bordered` / `underlined`、`gap` 间距、`plain-text` 明文、`custom-keyboard` 聚焦态、`disabled / readonly`

用户已明确：
1. **两件套**：`m-password-input`（纯格子面板）+ `m-password-input-popup`（弹层组合，内置格子 + m-number-keyboard）
2. **API 取向**：两家精华合并——双风格（Sard）+ 文字提示（Vant）+ disabled/readonly（Sard）+ 明文/光标（两家）

## 需求分析

### 与两个参考的取舍

| 维度 | Vant | Sard | 本项目建议 | 理由 |
| --- | --- | --- | --- | --- |
| 视觉风格 | 单一圆角方框 | bordered / underlined 双风格 | **双风格** | Sard 的下划线形态在支付/验证码场景更轻量，保留方框则对齐 Vant |
| 持值方式 | `value` prop 父组件绑定 | `v-model` 原生双向 | **`value` prop + `focus` 事件** | 与 keyboard-popup 的协作模式一致，由弹层版统一管理 |
| `mask` vs `plain-text` | `mask` 默认 true | `plain-text` 默认 false | **`mask` + `plainText` 都保留** | 两个 prop 语义不同：`mask=false` 显示字符，`plainText` 更偏验证码明文场景 |
| 文字提示 | `info` / `error-info` | 无 | **吸收 Vant** | 密码错误提示是常见场景 |
| `disabled` / `readonly` | 无 | 有 | **吸收 Sard** | 表单场景必需 |
| 弹层形态 | 无（与 NumberKeyboard 独立） | 无（与 Keyboard 独立） | **独立 popup 组件** | 复用 keyboard-popup 的组合模式，一套 props 覆盖纯面板 + 弹层 |

### 可复用资产

- `m-number-keyboard-popup`：弹层内部组合 keyboard，`transparent / showShadow / showCancel / showConfirm` 已内置
- `m-popup`：弹层显隐、遮罩、圆角、安全区（popup 版直接继承）
- 主题变量体系：新增 `$m-password-input-*` 段，全部 `!default`
- 条件编译：纯 UI，无平台 API 依赖

### 能力缺口

- 无公共工具函数需要新增；全部逻辑在 SFC 内完成
- 光标闪烁动画：uvue 无 @keyframes，需用 `UniElement.animate` 实现

### 影响面

- 新增 2 个组件目录（`m-password-input` + `m-password-input-popup`）
- 主题变量 ~15 项
- 演示页 2 个（panel 8 变体 + popup 6 变体）
- 文档 4 份（中英各 2）
- 不触碰既有组件

### 与 number-keyboard 的协作关系

```
业务层使用模式 A（手动组合）：
  m-password-input（纯格子，显示密码）
  + m-number-keyboard（纯面板，派发按键）
  由业务层 onInput → value += key → 回写 password-input

业务层使用模式 B（弹层一体）：
  m-password-input-popup（弹层版）
  内部自动组合 m-popup + m-password-input + m-number-keyboard
  v-model:value 直接双向，length 自动收敛
```

## 伪代码设计

### 组件形态

| 组件 | 职责 | 是否持值 | 主要差异 |
| --- | --- | --- | --- |
| `m-password-input` | 渲染 N 格密码/验证码格子，支持聚焦光标、mask 圆点、disabled/readonly | 否（纯展示） | 两种风格（bordered 方框 / underlined 下划线） |
| `m-password-input-popup` | `m-popup` + 格子 + `m-number-keyboard` 组合，自动管理 value / length / focused | **是**（弹层内部维护 v-model:value） | keyboard 类型可配 |

```
packages/core/components/m-password-input/
└── m-password-input.uvue           纯格子面板

packages/core/components/m-password-input-popup/
└── m-password-input-popup.uvue      弹层组合（popup + 格子 + keyboard）
```

### 格子核心渲染逻辑

```uts
/** 当前位是否是「正在输入的空位」（决定是否显示光标） */
const activeIndex = computed<number>(() => {
	if (!props.focused) return -1
	const v = props.value
	if (v.length >= props.length) return props.length - 1  // 填满时最后一位闪烁
	return v.length  // 第一个空位
})

/**
 * 每格显示内容（四种状态）：
 *  1. 未填且非当前位 → 空
 *  2. 未填但当前位且 focused → 显示光标（闪烁 view）
 *  3. 已填且 mask=true → 显示圆点 view
 *  4. 已填且 plainText=true 或 mask=false → 显示原字符
 */
```

### 光标动画（uvue 无 @keyframes，必须用 UniElement.animate）

```uts
onMounted(() => {
	// 光标 view 拿到 ref 后启动闪烁动画
	cursorEl.value?.animate(
		{ opacity: [1, 0] },
		{ duration: 1000, iterations: Infinity }
	)
})
```

### 面板 API

| Props | 类型 | 默认 | 说明 | 来源 |
| --- | --- | --- | --- | --- |
| `value` | `string` | `''` | 当前密码值 | Vant |
| `length` | `number` | `6` | 密码格子数量 | Vant |
| `type` | `'bordered' \| 'underlined'` | `'bordered'` | 方框 / 下划线风格 | Sard |
| `gap` | `number` | `8` | 格子间距（px，uvue 无 `string | number` 联合类型） | Sard |
| `mask` | `boolean` | `true` | 是否隐藏密码为圆点 | Vant |
| `plainText` | `boolean` | `false` | 明文显示（互斥：plainText=true 时 mask 忽略） | Sard |
| `focused` | `boolean` | `false` | 聚焦态：当前位显示光标、聚焦框高亮 | Vant/Sard |
| `disabled` | `boolean` | `false` | 禁用态（灰显 + 不派发 focus） | Sard |
| `readonly` | `boolean` | `false` | 只读（仍可查看但不可点击聚焦） | Sard |
| `info` | `string` | `''` | 下方文字提示 | Vant |
| `errorInfo` | `string` | `''` | 下方错误提示（优先级高于 info） | Vant |

**Events：**

| Event | 参数 | 说明 |
| --- | --- | --- |
| `focus` | — | 格子点击时触发（disabled / readonly 时不派发） |

**说明：** 不提供 `blur`（password-input-popup 持有完整焦点生命周期，纯面板无需 blur）

### 弹层 API

**透传面板全部 props**，另加：

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | `false` | 弹层显隐（v-model:show） |
| `keyboardType` | `NumberKeyboardType` | `'number'` | 键盘类型 |
| `extraKeys` | `string[]` | `null` | 键盘额外键 |
| `title` | `string` | `''` | 弹层标题 |
| `transparent` | `boolean` | `false` | 无遮罩 |
| `showShadow` | `boolean` | `false` | 顶部投影条 |
| `showCancel` | `boolean` | `true` | 显示取消按钮 |
| `showConfirm` | `boolean` | `true` | 显示完成按钮 |

**Events：** `update:value` / `update:show` / `input` / `delete` / `confirm` / `cancel` / `open` / `opened` / `close` / `closed` / `click-overlay` — 与 keyboard-popup 完全对齐

### 弹层内部交互逻辑

```uts
/** 键盘按键：自动收敛 maxlength=length */
function onKeyboardInput(key: string) {
	if (props.disabled || props.readonly) return
	if (localValue.value.length >= props.length) return
	localValue.value += key
	emit('update:value', localValue.value)
	emit('input', key)
}

/** 删除键：自动收敛到 0 */
function onKeyboardDelete() {
	if (localValue.value.length <= 0) return
	localValue.value = localValue.value.slice(0, -1)
	emit('delete')
}

/** 完成：自动关闭 */
function onConfirmTap() {
	emit('confirm')
	emit('update:show', false)
}
```

### 约束与边界

| 约束 | 说明 |
| --- | --- |
| **禁用联合类型** | `gap: number`（不 `number \| string`），`extraKeys: string[]`（不 `string \| string[]`）——0.6.0 PickerColumns 已证实联合类型 props 会让 Kotlin 退化为 `Any?` |
| **不主动抢焦点** | 格子是纯 view，不渲染原生 input，不会唤起系统键盘——这是配合自定义键盘的前提 |
| **光标动画实现** | `UniElement.animate({opacity: [1, 0]}, {duration: 1000, iterations: Infinity})`，禁止用 CSS @keyframes（uvue 不支持） |
| **格子宽度计算** | 面板根节点 flex row，每格 `width: calc((100% - gap * (length-1)) / length)`；uvue 不支持 calc 表达式时需在 JS 里算好 gap * (length-1) 差值再内联 style |
| **圆点 mask 渲染** | `<view class="dot" style="width/height: dotSize; border-radius: 50%" />`，禁止用 `text` + `•`（不同平台字体渲染不一致） |
| **bordered vs underlined** | bordered 带 border-radius + border，underlined 只画底部 1px 线；通过类名前缀 `__cell--bordered` / `__cell--underlined` 切换 |
| **theme/vars.scss** | 组件 style 顶层无条件 `@import '../../theme/vars.scss' !default`，禁止嵌套在 @if 内 |

### 主题变量（`$m-password-input-*`，预估 15 项）

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `$m-password-input-height` | `50px` | 格子容器高度（bordered 含边框） |
| `$m-password-input-gap` | `8px` | 格子间距 |
| `$m-password-input-border-radius` | `6px` | bordered 圆角 |
| `$m-password-input-border-color` | `#ebedf0` | bordered 常态边框 |
| `$m-password-input-border-color-focus` | `$m-color-primary` | focused 态边框 |
| `$m-password-input-background` | `#ffffff` | bordered 格子底色 |
| `$m-password-input-underline-color` | `#ebedf0` | underlined 底线色 |
| `$m-password-input-underline-color-focus` | `$m-color-primary` | underlined 聚焦底线色 |
| `$m-password-input-font-size` | `20px` | 明文展示字号 |
| `$m-password-input-text-color` | `$m-text-color` | 明文/圆点色 |
| `$m-password-input-dot-size` | `10px` | mask 圆点尺寸 |
| `$m-password-input-cursor-color` | `$m-text-color` | 光标颜色 |
| `$m-password-input-cursor-width` | `1px` | 光标宽度 |
| `$m-password-input-cursor-height` | `60%` | 光标高度 |
| `$m-password-input-info-color` | `$m-text-color-secondary` | info 文字色 |
| `$m-password-input-info-font-size` | `12px` | info 字号 |
| `$m-password-input-error-info-color` | `$m-color-danger` | errorInfo 色 |

弹层版本复用 `$m-number-keyboard-*` + `$m-popup-*`。

### 验证矩阵

| 场景 | 操作 | 预期 |
| --- | --- | --- |
| bordered | 渲染 6 格 | 圆角方框、等宽、gap 间距正确 |
| underlined | 渲染 6 格 | 只有底线，无左右上边框 |
| mask=true | 填 3 位 | 前 3 格显示圆点，后 3 格空 |
| plainText=true | 填 3 位 | 前 3 格显示原字符 |
| focused | value='123', focused=true | 第 4 格闪烁光标，border 高亮 |
| disabled | 点击格子 | 不派发 focus，灰显 |
| readonly | 点击格子 | 不派发 focus，视觉正常 |
| info | info='密码为 6 位数字' | 下方灰色文字提示 |
| errorInfo | errorInfo='密码错误' | 下方红色文字（优先级高于 info） |
| popup 基础 | 打开弹层 | 格子 + keyboard 同时渲染 |
| popup 输入 | 按键 1 → 2 → 3 | value 自动收敛，光标前进 |
| popup 删除 | value='123', 按删除 | value='12'，光标后退 |
| popup 填满 | value 到 length | 键盘 disabledKey 自动禁用后续键 |

## 疑问清单

> 每条已给推荐答案，回复「按推荐执行」即可全部定案。

### Q1 组件命名：password-input 还是 code-input？（影响：组件目录名、文档标题、demo-components 条目）

**推荐：`m-password-input`**。理由：Vant 和 Sard 均用 PasswordInput 命名，语义覆盖密码/验证码两个场景（Vant 文档明确说"可用于输入密码、短信验证码等场景"），且 `password` 在中文语境下已经泛化到验证码输入框。不建议叫 `code-input`——"验证码" 才是 code，密码不是，会产生语义窄化。

答：`m-password-input`。

### Q2 弹层版的 `v-model:value` 还是 `v-model`？（影响：API 一致性）

**推荐：同时支持**。popup 版内部维护 `localValue`，同时 `emit('update:value')` 和 `emit('update:modelValue')`，与 Sard 的 `modelValue` + Vant 的 `value` 都对齐。但弹窗 `show` 仍用 `v-model:show`（已有 keyboard-popup 惯性）。

答：同时支持。

### Q3 光标在「已填满」时是否闪烁？（影响：聚焦视觉体验）

**推荐：闪烁在最后一格**。参考 Vant 实现——当 `value.length >= length` 时，`activeIndex` 指向最后一格，光标闪烁提示"已到达最大长度"。如果不闪用户会误以为还有空位。

答：闪烁在最后一格。

### Q4 bordered vs underlined：是否需要「当前位特殊样式」？（影响：视觉复杂度）

**推荐：仅外框/底线变色**。bordered 模式下整个格子边框在 focused 时变 primary；underlined 模式下当前位的底线变 primary。不做「当前位背景色」——避免与已填格子产生视觉干扰。

答：仅外框/底线变色。

### Q5 `gap` prop 单位：只支持 px 还是支持 string（如 '2em'）？（影响：UTS 联合类型限制）

**推荐：只支持 number（px）**。理由：
- UTS 联合类型 `number | string` 会让 Kotlin 产物退化为 `Any?`（LESSONS 已验证）
- 项目内其他组件（flex gap、button padding）均用 number 表示 px
- 字符串单位（em/rem）在 uvue 中无对应实现

答：只支持 number（px）。

### Q6 圆点 mask 的实现方式？（影响：跨平台渲染一致性）

**推荐：`<view>` + `border-radius: 50%`**。理由：
- `<text>` + `•` 字符在不同平台字体渲染不一致（App 端可能是方形）
- CSS `::before` 伪元素 uvue 不支持
- view + border-radius 跨平台一致

答：`<view>` + `border-radius: 50%`。

### Q7 info / errorInfo 的位置？（影响：布局结构）

**推荐：格子容器下方**。与 Vant 一致——格子行在上，提示文字单独一行在下，间距 4px。不做格子内部行。

答：格子容器下方。

### Q8 弹层 popup 的输入区是否要把 `m-password-input` 放在 keyboard-popup 的 default 插槽里？（影响：组件组合方式）

**推荐：弹层版内部**，不暴露 default 插槽。理由：
- password-input-popup 的定位是「开箱即用的密码/验证码弹层」
- 内部已经组合好了 popup + password-input + keyboard，不需要业务层再拼
- 如果需要自定义输入区（比如金额显示），业务层直接用 `m-number-keyboard-popup` + 自定义格子

答：弹层版内部，不暴露 default 插槽。

### Q9 弹层 popup 是否支持自定义 keyboardType？（影响：API 范围）

**推荐：支持**。`keyboardType` 透传给 `m-number-keyboard`，默认 `'number'`。验证码场景用 `number`，金额用 `digit`（带小数点），身份证用 `idcard`，隐私键盘用 `random`。

答：支持。`keyboardType` 透传给 `m-number-keyboard`，默认 `'number'`。验证码场景用 `number`，金额用 `digit`（带小数点），身份证用 `idcard`，隐私键盘用 `random`。

### Q10 光标动画在真机上是否有闪烁问题？（影响：需提前验证）

**推荐用 `UniElement.animate` + 透明度动画**。`iterations: Infinity` 跨平台稳定，但需要真机验证（特别是 Android）。如果真机不支持 Infinity，降级为 `setInterval` + 手动切换 opacity。

答：用 `UniElement.animate` + 透明度动画。

### Q11 版本号归入哪一版？（影响：changelog 条目）

**推荐：0.7.0**。与 number-keyboard 同属 0.7.0 功能批次。

答：0.7.0。

### Q12 排序位置？（影响：demo-components.uts、侧栏）

**推荐：「数据录入」组 `number-keyboard-popup` 之后**。字母序 input → number-keyboard → number-keyboard-popup → **password-input → password-input-popup**。

答：「数据录入」组 `number-keyboard-popup` 之后。

### Q13 演示页变体数量？（影响：工作量）

**推荐：面板 8 个 + 弹层 6 个**。面板：bordered / underlined / gap / plain-text / mask + focused / disabled / readonly / info + error。弹层：基础弹层 / 透明 + 投影 / 随机键盘 / 自定义 title / disabled keyboard。

答：面板 8 个 + 弹层 6 个。

### Q14 弹层 popup 是否要提供 `length` prop？（影响：API 对齐）

**推荐：必须提供**。格子数量 + 输入自动收敛 maxlength = length。默认 6。

答：必须提供。格子数量 + 输入自动收敛 maxlength = length。默认 6。

### Q15 是否需要 `onComplete` / `full` 回调？（影响：完成态便利性）

**推荐：不新增**。弹层版提供 `confirm` 事件 + `v-model:value`，业务层 watch value.length === length 即可检测完成态，语义更通用（不仅密码填完）。弹层不自动关闭（需手动 confirm），因为密码填完可能要校验再决定。

答：不新增。

## 实施记录

### 运行实测修复记录（2026-11-17 二轮）

首轮 HBuilderX Web 编译 + 浏览器实测暴露 3 个 bug，均已修复并复测通过：

| Bug | 根因 | 修复 | 复测结果 |
| --- | --- | --- | --- |
| 格子不等分、圆点/光标不可见、明文错位 | SCSS 变量写进 `<script>`（`$m-password-input-cursor-width` 等），运行时 undefined → 内联样式全失效 + setup 降级 | 静态样式全部移到 `<style>` 扁平 class（LESSONS #95） | 6 格等分 171px、20 圆点可见、明文 8\|8\|6\|5 顺序正确 |
| 控制台 `el.animate is not a function` | web 端 UniElement 无 animate API（LESSONS #96） | 先改 el.style.setProperty 降级 → 仍无效 → 最终统一为 setInterval 半周期切响应式 cursorVisible + hidden class，全平台一致零条件编译 | 采样序列 true,false,false,true,true,false 有翻转 |
| 面板演示页"无法点击无法输入" | 演示页未接键盘（focus 事件无人消费） | 卡 1 接 `m-number-keyboard`：点击格子唤起键盘、disabledKey 填满禁用、input/delete 更新 value | 点击 → 键盘出现 → 单击 +1 位、删除 -1 位、填满拦截 |

popup 链路同步验证：弹层打开 → 输入 123 → 3 圆点 → 删除 → 2 圆点 → 卡片 display 区显示 "12"（v-model:value 双向 OK）→ 控制台无错误。

补充踩坑（均已记录 LESSONS）：

- **UTS 禁止函数形式 ref 绑定**（#93）
- **SCSS 变量进 script = undefined**（#95）
- **el.animate web 端不存在 + setProperty web 端无效 → 闪烁用响应式 class**（#96）
- 文档 / changelog 三处原"UniElement.animate"描述已同步修正为响应式方案

### 定案汇总（按推荐执行）

- 两件套：`m-password-input`（面板）+ `m-password-input-popup`（弹层）
- 命名 `m-password-input`（不叫 `code-input`）
- 双风格 `bordered` / `underlined`
- 两套状态显示：mask 圆点 vs plainText 明文（互斥）
- 光标闪烁用 `UniElement.animate` + opacity `[1, 0]`，`iterations: Infinity`
- `gap` 只支持 number（px），禁用 string 避免联合类型 Kotlin 退化
- `disabled` 灰显不派发 focus；`readonly` 只读不派发
- `info` / `errorInfo` 下方提示（error 优先）
- popup 内部自动持 v-model:value，输入自动收敛 maxlength=length
- popup keyboard 支持全类型（number / digit / idcard / random），每次打开自动乱序重排
- popup 内置 disabledKey：填满后数字键自动禁用
- 版本归入 0.7.0；排序位置为「数据录入」组 `number-keyboard-popup` 之后

### 与方案的偏差（实施时收敛）

| 方案项 | 实施 | 原因 |
| --- | --- | --- |
| `UniAnimationKeyframe` 单独 import | 删除 | 全局类型，m-loading 中直接使用，无需 import |
| ref 函数形式 `(el, k) => cursorRef = el` | 普通 `ref="cursorRef"` 绑定 + `const cursorRef = ref<UniElement \| null>(null)` | 项目里无函数形式 ref 先例，UTS 不支持；同一时刻只渲染一个光标 view，普通 ref 足够 |
| `$m-password-input-cursor-height` 样式里写 `60%` | 直接用 SCSS 变量值 | UTS template 里 style string 拼接，直接引用 SCSS 变量值是数字 `60%`，作为 height 值拼入 style |
| popup 暴露 `default` 插槽 | 不暴露，内部组装好 | password-input-popup 定位是开箱即用，自定义需求用 keyboard-popup 自己拼 |

### 变更文件清单

新增：

- `packages/core/components/m-password-input/m-password-input.uvue`
- `packages/core/components/m-password-input-popup/m-password-input-popup.uvue`
- `packages/playground/pages-sub/password-input/password-input.uvue`
- `packages/playground/pages-sub/password-input-popup/password-input-popup.uvue`
- `packages/docs/src/components/password-input.md`
- `packages/docs/src/components/password-input-popup.md`
- `packages/docs/src/en/components/password-input.md`
- `packages/docs/src/en/components/password-input-popup.md`

修改：

- `packages/core/theme/vars.scss`（新增 PasswordInput 段 20 项）
- `packages/playground/pages/index/demo-components.uts`（数据录入组追加两条）
- `packages/docs/.vitepress/config/zh.ts` / `en.ts`（侧栏追加两条）
- `packages/docs/src/changelog.md` / `en/changelog.md` / 插件 `changelog.md`（0.7.0 段追加）
- `packages/playground/pages.json` / `router/routes.gen.uts`（routeGen 自动生成）

### 验证方式与结果

- `pnpm sync:uni-modules` / `pnpm sync:uni-modules:check`：通过
- `pnpm build:docs`：通过（11.57s，无死链）
- HBuilderX CLI `launch web`：编译通过，dev server 端口 5175
- 页面实测（curl 验证）：password-input 和 password-input-popup 路由均返回 302（history hash 模式正常重定向）
- 控制台无编译错误
- routeGen 自动生成两个演示页路由条目

### 遗留 TODO

- Android / iOS 真机复测（光标动画手感、safeAreaInsetBottom 生效情况）
- 微信小程序开发者工具回归（光标 view + UniElement.animate 兼容性）
- popup 弹层点击确认按钮时自动 `shuffle()` random 键位（当前只在 opened 时 shuffle）

### 经验教训

- **UTS 禁止函数形式 ref 绑定**：`:ref="(el, k) => { ... }"` 在 UTS 中不支持，必须用普通 `ref="xxx"` 模板绑定 + `const xxx = ref<UniElement | null>(null)` 声明。这是 0.7.0 首次踩坑。
- **全局类型无需 import**：`UniAnimationKeyframe`、`UniElement`、`UniAnimation` 是 uni-app x 全局类型，直接使用即可，`import type { ... } from '@dcloudio/uni-app'` 会让编译器警告"未使用导入"。
