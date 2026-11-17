# m-number-keyboard 数字键盘 实施方案

## 需求

对标三家实现，为 unix-ui 补一个虚拟数字键盘，覆盖验证码、支付密码、金额、身份证号等输入场景：

- Vant NumberKeyboard：单组件自带弹层，`theme: default / custom`，内置 `v-model` 与 `maxlength`
- Sard Keyboard：纯面板，`type: number / digit / idcard / random / plate`，只抛按键事件
- Sard KeyboardPopout：面板 + 弹层组合，`default` 插槽承载输入区

## 需求分析

### 与三个参考的取舍

| 维度 | Vant | Sard | 本项目建议 |
| --- | --- | --- | --- |
| 值状态 | 组件内 `v-model` + `maxlength` | 不持值，只抛 `input(key)` | 不持值，只抛事件；长度与合法性由 `disabledKey` 回调控制 |
| 弹层 | 与面板同一组件 | 独立 `keyboard-popout` | 独立 `m-number-keyboard-popup` |
| 类型 | `theme` 两种 | `type` 五种（含车牌） | 首版四种，车牌二期 |
| 外部 API | `extra-key: string \| string[]` | `disabled-key` 回调 | `extraKeys: string[]`（禁用联合类型） |

**不内置 `v-model` 的理由**：面板持值会引入「外部值 / 内部值」双真源的同步问题（0.6.0 的 `m-picker-view` 已为此写了 30 行对齐逻辑）。键盘的输入区在业务侧几乎总是定制结构（6 格验证码、带货币符号的金额串），由业务拼串只有 2 行代码，比双向同步更稳。

### 可复用资产

- `m-popup`：弹层显隐、遮罩、圆角、安全区、动效全量复用，`close-on-click-overlay` 天然解决「点外部收起」
- `m-icon`：删除键与关闭键的图形
- 主题变量体系：新增 `$m-number-keyboard-*` 段，全部 `!default`
- 条件编译：键盘为纯 UI，无平台 API 依赖，不需要 `#ifdef` 分叉

### 能力缺口

无。不需要改 `utils/`，无需新增日期类的公共函数。

### 影响面

- 新增 2 个组件目录、1 份共享类型文件、1 段主题变量
- 演示页 1 个、文档 2 份（中英各 2）
- 不触碰既有组件，无回归风险

## 伪代码设计

### 组件形态

| 组件 | 职责 | 是否持值 |
| --- | --- | --- |
| `m-number-keyboard` | 渲染 12 键网格，抛 `input` / `delete` / `close` | 否 |
| `m-number-keyboard-popup` | `m-popup` + 面板 + `default` 输入区插槽，取消 / 确定后关闭 | 否 |

```
packages/core/components/m-number-keyboard/
├── m-number-keyboard.uvue        面板
├── keyboard.uts                   共享类型、键位常量、构造函数
packages/core/components/m-number-keyboard-popup/
└── m-number-keyboard-popup.uvue   弹层组合
```

### 键位模型（keyboard.uts）

```uts
/** 按键类型：普通可输入键 / 删除键 / 关闭键 */
export type NumberKeyboardKeyType = 'normal' | 'delete' | 'close'

/** 单个按键 */
export type NumberKeyboardKey = {
	/** 按键文本（删除 / 关闭键为空串，由样式与图标渲染） */
	text: string
	/** 按键类型 */
	type: NumberKeyboardKeyType
}

/** 键盘类型 */
export type NumberKeyboardType = 'number' | 'digit' | 'idcard' | 'random'

/** 构建 default 主题的 12 键（3 列 × 4 行） */
export function buildDefaultKeys(type: NumberKeyboardType, extraKeys: string[], randomOrder: boolean): NumberKeyboardKey[]

/** 构建 custom 主题的左区（3 列数字）与右区（删除 / 关闭竖排） */
export function buildCustomKeys(type: NumberKeyboardType, extraKeys: string[], randomOrder: boolean): NumberKeyboardKey[][]

/** Fisher-Yates 乱序（不修改入参） */
export function shuffleKeys(keys: NumberKeyboardKey[]): NumberKeyboardKey[]
```

键面规则：

- `number`：1–9、extraKey（空则空白占位）、0、删除
- `digit`：1–9、`.`（或 extraKeys 首项）、0、删除
- `idcard`：1–9、`X`、0、删除
- `random`：1–9 与 0 打乱，extraKeys 固定不参与打乱
- `custom` 主题：左区 3 列 × 4 行同上，右区为「删除」跨两行 + 「关闭」一行（关闭文字为空时不渲染关闭键，删除键占满）

### 面板 API

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `type` | `NumberKeyboardType` | `'number'` | 键盘类型 |
| `theme` | `'default' \| 'custom'` | `'default'` | 是否带右侧栏 |
| `extraKeys` | `string[]` | `[]` | 额外键：default 取首项作左下角，custom 取前两项放右侧栏 |
| `showDeleteKey` | `boolean` | `true` | 是否显示删除键 |
| `deleteButtonText` | `string` | `''` | 空则用 `m-icon` 删除图标 |
| `closeButtonText` | `string` | `''` | 仅 custom；空则不渲染关闭键 |
| `disabledKey` | `((key: string) => boolean) \| null` | `null` | 返回 true 的键灰显且不派发事件 |
| `customClass` / `customStyle` | `string.ClassString` / `string` | `''` | 根节点扩展 |

| Events | 参数 | 说明 |
| --- | --- | --- |
| `input` | `key: string` | 点击可输入键 |
| `delete` | — | 点击删除键 |
| `close` | — | 点击右侧栏关闭键 |

| Expose | 说明 |
| --- | --- |
| `shuffle()` | 重新打乱（仅 `type='random'`） |

| Slots | 作用域 | 说明 |
| --- | --- | --- |
| `delete` | — | 自定义删除键内容 |
| `extra-key` | `index: number` | 自定义额外键内容 |
| `title-left` | — | 仅 custom 主题左上角占位区 |

### 弹层 API

透传面板全部 props，另加：

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | `false` | v-model:show |
| `title` | `string` | `''` | 工具条标题，空则不渲染工具条 |
| `showToolbar` | `boolean` | `true` | 是否显示取消 / 确定工具条 |
| `cancelButtonText` / `confirmButtonText` | `string` | `'取消'` / `'完成'` | 按钮文案 |
| `position` / `round` / `closeOnClickOverlay` / `safeAreaInsetBottom` / `zIndex` / `duration` | 同 `m-picker-popup` | bottom / true / true / true / 1 / 0.3 | 透传 `m-popup` |

| Events | 参数 | 说明 |
| --- | --- | --- |
| `update:show` | `boolean` | 显隐回写 |
| `input` / `delete` / `close` | 同面板 | 透传 |
| `cancel` / `confirm` | — | 工具条按钮，派发后自动关闭 |
| `open` / `opened` / `close` / `closed` / `click-overlay` | 同 `m-popup` | 生命周期 |

| Slots | 说明 |
| --- | --- |
| `default` | 输入区（键盘上方，承接验证码格 / 金额展示） |
| `title` / `cancel` / `confirm` | 工具条分区替换 |
| `delete` / `extra-key` / `title-left` | 同面板 |

### 交互回写

```uts
/** 按键点击：禁用态直接忽略，其余按类型派发 */
function onKeyTap(key: NumberKeyboardKey) {
	if (isDisabled(key.text)) {
		return
	}
	if (key.type == 'delete') {
		emit('delete')
		return
	}
	if (key.type == 'close') {
		emit('close')
		return
	}
	emit('input', key.text)
}
```

按压态：`hover-class="m-number-keyboard__key--active"`，不用 `:active`（uvue 无伪类）。

### 约束与边界

- **禁用联合类型**：`extraKeys` 用 `string[]`，不接受 `string | string[]`。0.6.0 已证实联合类型 props 会让 Kotlin 产物退化为 `Any?`
- **随机排序稳定性**：`type='random'` 时仅在 `onMounted` 打乱一次；外部改 `type` 或重开弹层不重排，只有显式 `shuffle()` 才重排（避免用户按到一半键位跳动）
- **`v-for` key 用按键文本**，不用下标，否则重排后按压态与动画错位
- **高度**：单键 48px、间隙 6px、内边距 8px；弹层另加 `safe-area-inset-bottom`
- **不监听物理键盘**：App / 小程序无此场景，不引入 `uni.onKeyDown`
- **不抢焦点**：键盘为纯 view 点击，不渲染 `input`，不会唤起系统键盘

### 主题变量（`$m-number-keyboard-*`）

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `$m-number-keyboard-background` | `#f2f3f5` | 键盘底色 |
| `$m-number-keyboard-padding` | `8px` | 四周内边距 |
| `$m-number-keyboard-key-gap` | `6px` | 键间隙 |
| `$m-number-keyboard-key-height` | `48px` | 单键高度 |
| `$m-number-keyboard-key-radius` | `6px` | 键圆角 |
| `$m-number-keyboard-key-background` | `#ffffff` | 键底色 |
| `$m-number-keyboard-key-active-background` | `#e5e6eb` | 按压态 |
| `$m-number-keyboard-key-color` | `#323233` | 键文字色 |
| `$m-number-keyboard-key-font-size` | `24px` | 键文字大小 |
| `$m-number-keyboard-delete-font-size` | `16px` | 删除文字大小 |
| `$m-number-keyboard-title-height` | `44px` | 工具条高度 |
| `$m-number-keyboard-title-color` | `#323233` | 标题色 |
| `$m-number-keyboard-title-font-size` | `14px` | 标题字号 |
| `$m-number-keyboard-button-color` | `#1989fa` | 取消 / 确定文字色 |

弹层视觉复用 `$m-popup-*`。

### 验证矩阵

| 场景 | 操作 | 预期 |
| --- | --- | --- |
| number | 点 1–9、0 | `input` 依次派发对应字符 |
| number + 删除 | 点删除 | `delete` 派发 |
| digit | 点 `.` | `input('.')` |
| idcard | 点 `X` | `input('X')` |
| random | 挂载 | 1–9 与 0 打乱，extraKeys 位置不变 |
| random + shuffle | 调 `shuffle()` | 键位重排，无重复无缺失 |
| custom | 点右侧栏关闭 | `close` 派发 |
| disabledKey | 返回 true 的键 | 灰显、点击无事件 |
| popup | 点取消 / 完成 | 派发 `cancel` / `confirm` 并关闭 |
| popup | 点遮罩 | `update:show=false` |
| popup | 输入区插槽 | 键盘上方渲染自定义内容 |

## 疑问清单

> 每条已给推荐答案，回复「按推荐执行」即可全部定案。

### Q1 组件形态：两件套还是三件套？

**推荐：两件套**（面板 + 弹层），不做 `-input`。键盘输入区几乎总是定制格，只读 `m-input` 回显价值低，Vant 与 Sard 也均无第三件。

### Q2 首版类型范围？

**推荐：`number` / `digit` / `idcard` / `random`**。车牌号（Sard `plate`）需要「省份简称 + 字母 + 后缀」状态机与中英切换，二期单独建档。

### Q3 是否内置 `v-model` 与 `maxlength`？

**推荐：不内置**，只抛 `input` / `delete`；长度与非法键由 `disabledKey` 回调控制（Sard 路线）。文档给出 5 行拼串示例。

### Q4 `extraKeys` 的语义？

**推荐：统一 `string[]`**。default 主题取首项作左下角（空则留白）；custom 主题取前两项放右侧栏下部（删除键占上方两行）。不兼容 Vant 的 `string | string[]` 写法。

### Q5 custom 主题右侧栏怎么排？

**推荐：右栏 1 列 4 行**——删除键跨 2 行，关闭键 1 行，剩余 1 行留白；`closeButtonText` 为空时不渲染关闭键，删除键占满 4 行。

### Q6 弹层是否带工具条？

**推荐：带**（标题 + 取消 / 完成），与 `m-picker-popup` 的交互惯性一致；`showToolbar=false` 时退化为纯键盘 + `default` 插槽。

### Q7 删除键默认如何表现？

**推荐**：`deleteButtonText` 为空时用 `m-icon` 的删除图标；提供文字则渲染文字。两者都不显示时可用 `delete` 插槽完全自定义。

### Q8 主题变量归属？

**推荐**：新增 `$m-number-keyboard-*`（14 项），弹层共用 `$m-popup-*`，不新增 `$m-number-keyboard-popup-*`。

### Q9 版本号归入哪一版？

**推荐：0.7.0**。0.6.0 的 changelog、发布稿与 `added` 标记均已定稿，键盘作为下一个功能版本。

### Q10 排序位置？

**推荐**：「数据录入」组 `input` 之后（字母序 `number-keyboard` > `input`），`demo-components.uts`、`zh.ts`、`en.ts` 三处同序。

### Q11 演示页变体？

**推荐：10 个**——number / digit / idcard / random+shuffle / custom / 多 extraKeys / disabledKey / popup 基础 / popup + 6 格验证码 / popup + 金额。

### Q12 文档放在哪一组？

**推荐**：「数据录入」，与 `demo-components.uts` 的分组一致；中英各一份，含 Props / Events / Slots / Methods / 主题变量。

## 实施记录

### 定案汇总（按推荐执行）

- 两件套：`m-number-keyboard`（面板）+ `m-number-keyboard-popup`（弹层），不做 `-input`
- 首版类型：`number` / `digit` / `idcard` / `random`；车牌二期
- 不内置 `v-model` / `maxlength`，只抛 `input` / `delete`；长度由 `disabledKey` 控制
- `extraKeys: string[]`，取首项作为左下角按键
- `theme="custom"` 右侧栏：关闭键 1 行 + 删除键跨 2 行 + 留白 1 行；关闭文字为空时删除占满
- 弹层带工具条（取消 / 标题 / 完成），`showToolbar=false` 可退出
- 删除键默认 `m-icon name="delete"`，`deleteButtonText` 非空显示文字
- 主题变量新增 `$m-number-keyboard-*`，弹层共用 `$m-popup-*`
- 版本归入 0.7.0；排序位置为「数据录入」组 `input` 之后
- 演示页两页：面板 7 个变体、弹层 4 个变体；文档中英各两份

### 与方案的偏差（实施时收敛，均为规避平台风险）

| 方案项 | 实施 | 原因 |
| --- | --- | --- |
| `delete` 插槽 | 不提供，改用 `deleteButtonText` + 图标 | 删除键在 default 左下角与 custom 右栏两处渲染，同名具名插槽需重复声明，Vue 会告警、App 端行为不确定 |
| `title-left` 插槽 | 不提供 | 面板无标题栏，该插槽无语义落点；标题相关能力由弹层工具条承担 |
| 弹层 `position` 透传 | 固定 `bottom`，不开放 | 数字键盘不会从顶部弹出，开放该属性只会产生无效配置 |
| `randomKeyOrder` prop | 合并进 `type="random"` | 两个开关语义重叠，单入口更清晰 |
| `$m-number-keyboard-key-gap` 默认 6px | 3px（单元格内边距） | 相邻两格各留 3px，视觉间隙即 6px；避免在样式里做除法运算 |
| 主题变量 14 项 | 14 项（含 `title-height` / `title-color` / `title-font-size` / `button-color`） | 与方案一致，无增减 |
| `disabledKey` 默认 `null` | withDefaults 中不声明该项 | 声明 null 会让 VDOM 生成 `type: [Function, null]`，触发 TS2769 告警 |

### 变更文件清单

新增：

- `packages/core/components/m-number-keyboard/keyboard.uts`
- `packages/core/components/m-number-keyboard/m-number-keyboard.uvue`
- `packages/core/components/m-number-keyboard-popup/m-number-keyboard-popup.uvue`
- `packages/playground/pages-sub/number-keyboard/number-keyboard.uvue`
- `packages/playground/pages-sub/number-keyboard-popup/number-keyboard-popup.uvue`
- `packages/docs/src/components/number-keyboard.md`
- `packages/docs/src/components/number-keyboard-popup.md`
- `packages/docs/src/en/components/number-keyboard.md`
- `packages/docs/src/en/components/number-keyboard-popup.md`

修改：

- `packages/core/theme/vars.scss`（新增 NumberKeyboard 段）
- `packages/playground/pages/index/demo-components.uts`（数据录入组新增两条）
- `packages/docs/.vitepress/config/zh.ts` / `en.ts`（侧栏新增两条）
- `packages/docs/src/changelog.md` / `en/changelog.md` / 插件 `changelog.md`（0.7.0）
- `packages/playground/pages.json` / `router/routes.gen.uts`（routeGen 自动生成）

### 验证方式与结果

- `pnpm sync:uni-modules` / `pnpm sync:uni-modules:check`：通过
- `pnpm build:docs`：通过（9.77s，无死链）
- HBuilderX CLI `launch web`：编译通过，dev server 端口 5175
- 页面实测（浏览器）：面板渲染 1-9 / 0 / 删除键，点击 1 → 2 后显示区为「12」；禁用键满 6 位后灰显；custom 右侧栏关闭键生效，控制台无 error
- 弹层实测：面板页与独立弹层页均通过——打开后标题与键盘渲染，按键回写输入区，完成后自动关闭，控制台无 error

### 遗留 TODO

- 车牌号键盘（`type="plate"`：省份简称 + 字母 + 后缀、中英切换、`toggle()` 方法）留待二期建档
- Android / iOS 真机复测（按压态 `hover-class` 手感、`safeAreaInsetBottom` 生效情况）
- 微信小程序开发者工具回归
