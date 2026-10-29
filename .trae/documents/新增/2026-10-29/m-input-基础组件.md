# m-input 基础组件 实施方案

## 需求

用户提供两份对标文档，要求实现输入框组件 `m-input`：

- Vant Field：https://vant-ui.github.io/vant/#/zh-CN/field （表单项形态：label / 必填星号 / 错误提示 / 校验规则，与 CellGroup 联动）
- Sard Input：https://sard.wzt.zone/components/input （裸输入框形态：自带边框容器 + prepend/append 插槽，表单能力由 form 体系承担）

同时兑现 m-compact 任务遗留 TODO（Q2-A）：「m-input 落地后输入类组件注入 compact 上下文，补齐 Sard 输入类组件混排场景」。

## 需求分析

两个对标组件定位不同，不可直接混合：

| 维度 | Vant Field | Sard Input |
| --- | --- | --- |
| 组件定位 | 表单项（label + 输入控件 + 错误提示） | 裸输入框（边框容器 + 输入控件） |
| 样式形态 | 无边框、依赖 m-cell 观感，配 CellGroup inset 使用 | 自带圆角边框容器，可独立使用 |
| 扩展出口 | label / button / left-icon / right-icon / extra 等 7 插槽 | prepend / append 两插槽 |
| 表单体系 | 深度绑定 Form / rules 校验 | validate-event 预留，无 form 依赖 |
| 与本项目重叠 | 「表单项」观感与既有 m-cell 高度重叠（title / label / 图标） | 无重叠；可直接进 m-compact、可嵌 m-cell |
| 数字增强 | min / max（v4.9.5） | precision 精度 |
| 文本处理 | formatter / format-trigger | formatter |
| 密码显隐 | 无（用插槽自实现） | show-eye 内置 |
| 清除图标时机 | clear-trigger（always / focus，默认 focus） | show-clear-only-focus（boolean） |

uni-app x（uvue / ucss）红线下的取舍：

| 对标能力 | m-input 方案 |
| --- | --- |
| `<input>` / `<textarea>` 两套标签 | uni-app x 原生 input 与 textarea 是两个组件：内部按 `type == 'textarea'` 切换两个原生节点（非根节点，不踩「根节点 v-if 丢 attrs 透传」红线），共享同一 v-model 状态 |
| v-model 值类型 | 统一 `string`（uni-app x 原生 input 即 string；Vant 同样内部格式化为 string 并文档说明，`.number` 由用户侧处理）——Sard 的 `string \| number` 收窄，文档注记 |
| type 类型集 | `text / tel / digit / number / password / textarea`（uni-app x 原生支持集）；HTML-only type 不提供 |
| auto-height | uni-app x textarea 原生 `auto-height` 属性直通，Sard 的对象式 `{minHeight, maxHeight}` 收窄为 boolean + `textarea-min-height` 变量 |
| 字数统计 | `maxlength` 原生直通 + `show-word-limit`（对齐 Vant 命名）自实现计数（Vant / Sard 命名不同，取 Vant） |
| change 事件 | uni-app x 无原生 change：focus 时快照值，blur 时对比不同才触发（模拟 Vant / Sard「失焦且内容改变」语义） |
| formatter / format-trigger、precision、min / max | 待 Q3：倾向 v1 裁剪（formatter 用户侧 computed 可替代；precision / min / max uni-app x 无原生键盘精度配合，独造价值低） |
| spellcheck / autocorrect / autocapitalize / autocomplete 等 HTML-only 属性 | v1 不提供（uni-app x 原生不支持或仅部分端生效，文档「与对标的差异」注记） |
| show-eye（Sard） | v1 不内置：append 插槽 + 动态 type 即可自实现（Sard 演示自身也给出 append 方案），注记 |
| focus / blur 实例方法 | `defineExpose({ focus, blur })`（内部 :focus 绑定状态驱动），App 端实际行为列入真机验证点 |
| compact 联动 | 待 Q2：注入 COMPACT_KEY 复用 m-compact/context.uts（同 ids 注册数组），m-input 自带 compact 位置修饰类（清圆角 + 非首项清相邻侧边框，作用于容器边框，与 m-button 独立成段） |

主题变量（`$m-input-*` 段，全 `!default`）：padding / gap、border-radius、border-color、border-color-focus（聚焦态）、bg、bg-disabled、text-color、text-color-disabled、placeholder-color、clear-icon-size、clear-color、count-font-size、count-color、textarea-min-height；禁用透明度复用 `$m-disabled-opacity`。

涉及文件（architecture.md 第 6 节唯一落点）：

| 落点 | 内容 |
| --- | --- |
| `packages/core/components/m-input/m-input.uvue` | 组件源（类型与逻辑内联 SFC） |
| `packages/core/theme/vars.scss` | 新增 `$m-input-*` 段（全 `!default`） |
| `packages/core/components/m-compact/context.uts`、`m-button.uvue` | 无需改动（Q2 若本期做，m-input 侧自行 inject + 自带修饰类） |
| `packages/playground/pages-sub/input/input.uvue` + `pages.json` / `router/router.config.uts` / `pages/index/demo-components.uts` | 演示页 + 三处注册（数据展示组按 enName 字母序插入 Input——现状组内 Badge / Cell，I 排首位；实现时按当次实际分组核对） |
| `packages/docs/src/components/input.md` + `src/en/components/input.md` | 双语文档（含「与 Vant / Sard 的差异」节） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏两侧同步 |
| `playground/uni_modules/m-ui-x/changelog.md` + 文档站 changelog 中英 | 第四步回填 |

验证链（workflow 第三步 DoD）：`pnpm sync:uni-modules` → `sync:uni-modules:check` → dev server 编译 → Playwright 全变体实测（v-model 双向、type 各类型、clearable 两时机、disabled / readonly、password、textarea / auto-height、字数统计、compact 混排、cell 嵌入组合、无 pageerror）→ `build:docs` 死链 → `build:demo` 产物入库 → 清理调试代码。

## 伪代码设计

### Props（`type Props` + `withDefaults`，对齐 Vant 命名优先）

```
modelValue: string = ''            // v-model
type: InputType = 'text'           // 'text' | 'tel' | 'digit' | 'number' | 'password' | 'textarea'
placeholder: string = ''
placeholderStyle: string = ''      // 直通原生
placeholderClass: string = ''      // 直通原生（custom-class 惯例外补原生能力）
maxlength: number = -1             // -1 不限制（原生语义）
showWordLimit: boolean = false     // 需配合 maxlength
clearable: boolean = false
clearTrigger: ClearTrigger = 'focus'   // 'always' | 'focus'（对齐 Vant：有值 && (always || 聚焦) 时显示）
border: boolean = true             // 对齐 Vant「是否显示内边框」；Sard borderless 反向，取 Vant 正向
inlaid: boolean = false            // 嵌入式（清边框 + 清内边距，嵌 cell 用；对齐 Sard）
disabled: boolean = false
readonly: boolean = false
focus: boolean = false             // 受控聚焦驱动（expose focus()/blur() 即改此状态）
confirmType: string = ''           // 直通原生键盘回车键（done/search/send/go/next）
autoHeight: boolean = false        // 仅 textarea 生效，直通原生
rows: number = 1                   // 仅 textarea 生效
customClass / customStyle          // 项目惯例透传
```

### Events

```
update:modelValue(value: string)   // @input 驱动
input(value: string)               // 输入即发
change(value: string)              // blur 时与 focus 快照比对，不同才发（模拟 Vant 语义）
focus(event) / blur(event)         // 直通原生
clear()                            // 点清除图标
```

### Slots

```
prepend                            // 容器前部（对齐 Sard；Vant 用 left-icon，图标场景由 m-icon 放插槽实现）
append                             // 容器后部（验证码按钮 / 显隐密码等）
```

### 模板结构（单根，无根节点 v-if）

```html
<view :class="rootClass" :style="rootStyle">
	<view v-if="有 prepend 插槽内容" class="m-input__prepend"><slot name="prepend" /></view>
	<!-- 输入区：两个原生组件按 type 切换（内部节点，非根） -->
	<input
		v-if="type != 'textarea'"
		class="m-input__control"
		:value="modelValue"
		:type="inputType"          <!-- password 类型映射原生 password；number/digit/tel/text 直通 -->
		:password="type == 'password'"
		:placeholder="placeholder"
		:placeholder-style="placeholderStyle"
		:maxlength="maxlength"
		:disabled="disabled"
		:focus="focused"
		:confirm-type="confirmType"
		@input="onInput" @focus="onFocus" @blur="onBlur" @confirm="onConfirm"
	/>
	<textarea
		v-else
		class="m-input__control m-input__textarea"
		:value="modelValue"
		:auto-height="autoHeight"
		:maxlength="maxlength"
		:disabled="disabled"
		:placeholder="placeholder"
		:placeholder-style="placeholderStyle"
		:show-count="false"
		@input="onInput" @focus="onFocus" @blur="onBlur"
	/>
	<!-- 清除图标：clearable && 有值 && (clearTrigger=='always' || 聚焦) && !disabled && !readonly -->
	<view v-if="showClear" class="m-input__clear" @click="onClear">
		<m-icon name="clear" :custom-class="clearIconClass" />  <!-- 图标名以 m-icon 实际 IconName 联合类型为准，实现时核对 -->
	</view>
	<view v-if="有 append 插槽内容" class="m-input__append"><slot name="append" /></view>
</view>
<!-- 字数统计：textarea 时独立一行（右对齐），单行时容器内右侧 -->
<view v-if="showWordLimit && maxlength > 0" class="m-input__count">
	<text class="m-input__count-text">{{ modelValue.length }}/{{ maxlength }}</text>
</view>
```

注：字数统计若 v1 简化为「仅 textarea 独立行 + 单行容器外下方」，以实现时视觉验收为准；结构允许微调。

### 根类拼接（扁平类）

```
m-input
+ m-input--textarea                    （type=='textarea'：纵向布局容纳计数行）
+ m-input--bordered / m-input--borderless   （border prop；inlaid 强制 borderless）
+ m-input--inlaid                      （清 padding）
+ m-input--disabled                    （bg-disabled + 文字色 + 透明度）
+ m-input--focus                       （聚焦态边框色，仅 bordered）
+ compact 位置类（Q2=A 时）：m-input--compact-h-first / h-last / h-middle / v-first / v-last / v-middle + h-not-first（清左边框）/ v-not-first（清上边框）——容器级清圆角，独立于 m-button 段
+ customClass
```

### compact 联动（Q2=A 时，对齐 m-button 既有实现）

```
import { COMPACT_KEY, CompactContext, generateCompactId } from '../m-compact/context.uts'
inject 可选 → 非空时 register(id) / onUnmounted unregister
compactPosition / compactNotFirst 两个 computed（与 m-button 同构）
```

### 样式要点

```
.m-input            { flex-direction: row; align-items: center; border: 1px solid $m-input-border-color; border-radius: $m-input-border-radius; padding: $m-input-padding-y $m-input-padding-x; background: $m-input-bg; }
.m-input__control   { flex: 1; flex-shrink: 1; font-size / color 走变量; background: transparent; height 撑满容器; }
.m-input--focus     { border-color: $m-input-border-color-focus; }        （扁平类同特异性按源码顺序，写在 bordered 之后）
.m-input--disabled  { background: $m-input-bg-disabled; } + 文本色变量 + opacity: $m-disabled-opacity
.m-input--inlaid    { padding: 0; border-width: 0; background: transparent; border-radius: 0; }
.m-input__count-text / textarea min-height 等
```

### 主题变量（vars.scss 新增段，全 !default）

```
$m-input-padding-y / -x / -gap / -border-radius
$m-input-border-color / -border-color-focus / -bg / -bg-disabled
$m-input-text-color / -text-color-disabled / -placeholder-color
$m-input-clear-icon-size / -clear-color
$m-input-count-font-size / -count-color
$m-input-textarea-min-height
```

### 演示页规划（pages-sub/input/input.uvue，穷举 props / 变体 / 事件）

1. 基础使用（v-model + placeholder + @input / @change 日志输出到页面演示区）
2. 自定义类型（text / tel / digit / number / password 各一 + append 插槽实现明文切换）
3. 可清除的（clearable + clear-trigger 两时机对照）
4. 只读和禁用
5. 插槽（prepend 放 m-icon + append 放 m-button 发送验证码）
6. 无边框与嵌入（border=false / inlaid 嵌入 m-cell 内演示「Vant Field 观感」组合）
7. 多行文本（textarea + auto-height + rows）
8. 字数统计（show-word-limit + maxlength，textarea 与单行各一）
9. compact 组合（m-compact + m-input + m-button 混排——Sard 输入类场景补齐）
10. cell 嵌入组合（m-cell 包裹 m-input 对齐 Vant Field 用法）

### 文档规划

zh / en input.md：介绍 / 代码演示（对齐上述节）/ Props / Events / Slots 表 / 主题定制（$m-input-* 变量表）/ 「与 Vant Field、Sard Input 的差异」节（值统一 string、HTML-only 属性与 formatter / precision / show-eye 裁剪注记、clear-trigger 命名取 Vant）；侧栏 zh.ts / en.ts 同步。

## 疑问清单（回复编号即可，如「Q1 答：A」）

- **Q1 对标基准与组件形态**（决定组件边界与后续表单体系规划）：
  - A（推荐）：对标 Sard Input 做**裸输入框**——自带边框容器 + prepend/append 插槽；label / 必填星号 / 错误提示 / 校验属表单体系（与 m-cell 重叠且无 m-form 支撑），留待未来 m-form-item；「Vant Field 观感」用 m-cell 包裹 m-input 组合获得（演示页出组合示例）
  - B：对标 Vant Field 做**表单项**全量（label / error / rules）——但本项目无 m-form，校验无处安放，且与 m-cell 职责重叠

答：A。

- **Q2 compact 联动是否本期落地**（兑现 m-compact 遗留 TODO）：
  - A（推荐）：本期实现——m-input 注入 COMPACT_KEY（复用 m-compact/context.uts 同一注册数组，m-button 与 m-input 混排时位置互相感知）+ 自带容器级 compact 修饰类；演示页加 compact 混排节
  - B：本期不做，compact 联动留待下期（m-compact 的输入类场景继续缺位）

答：A。

- **Q3 裁剪清单确认**（v1 范围控制，均属低频或不可行项，文档「与对标的差异」注记）：
  - A（推荐）：全部裁剪——formatter / format-trigger（用户侧 computed 可替代）、precision、min / max（uni-app x 无原生键盘精度配合）、show-eye（append 插槽自实现）、spellcheck / autocorrect / autocapitalize / autocomplete / inputmode 等 HTML-only 属性
  - B：保留 formatter（uvue 支持 `(value: string) => string` 函数 prop），其余裁剪

答：能保留的都保留。

> 转记（AI 落地解读，2026-10-29）：「能保留的都保留」落实为——**保留** formatter（`(value: string) => string` 函数 prop）、format-trigger（'onChange' 默认 / 'onBlur'）、precision（number / digit 失焦时 toFixed 应用，不打断输入中间态）、min / max（number / digit 失焦时 clamp 回写）、show-eye（type=password 内置明文切换图标，位于 append 插槽之前）；**无法保留**（uni-app x 平台不支持，文档注记）：spellcheck / autocorrect / autocapitalize / autocomplete / inputmode 等 HTML-only 属性。

## 实施记录（2026-10-29 回填）

### 方案落地形态（与伪代码设计的差异）

- **Q3 转记全量落地**：伪代码倾向 v1 裁剪的 formatter / formatTrigger / precision / min / max / showEye 全部保留，props 总数 24 个（含 customClass / customStyle）；数字修正顺序为 parseFloat → min/max clamp → precision toFixed（**保留尾零**，先 `parseFloat(n.toFixed(p))` 会抹零）
- **focus 受控 prop 移除**：改为 `defineExpose({ focus, blur })` 实例方法（内部 focusState 经 `:focus` 属性驱动，与原生聚焦事件双向同步）；顺带规避了受控 focus 与用户点击的争抢
- **rows prop 移除**：官方文档确认 uni-app x textarea **无 rows 属性**（伪代码前提有误），多行高度改 `$m-input-textarea-min-height`（60px）兜底 + autoHeight 直通；textarea 亦无 show-count，计数完全自实现
- **双层结构**：根 view（column）→ `.m-input__body` 边框容器承担边框 / padding / compact 位置类（h-not-first / v-not-first），`hblock` / `vblock` 必须拼在根类（须作用于 m-compact 直接子项）；字数统计行统一置于 body 外下方右对齐（不限 textarea）
- **change 时序**：blur 先发（对齐 Vant，避免演示日志被子事件覆盖），随后格式化 / 数字修正，最终值与 focus 快照不同才发 change；native change 存在但维持快照方案（跨平台确定 + 与 formatter 修正联动比对最终值）
- **readonly 模拟**：uni-app x input 无 readonly 原生支持，`:disabled="disabled || readonly"` 实现禁输入，readonly 不挂 `--disabled` 类保持常态外观
- **事件载荷收窄**：input 与 textarea 的聚焦 / 失焦事件类型不同（UniInputEvent vs UniTextareaFocusEvent / UniTextareaBlurEvent），分设 handler 后 emit 收窄为基类 UniEvent
- confirm 事件落地裁掉（伪代码模板 @confirm 挂钩未保留）

### 变更文件清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/m-input/m-input.uvue` | 新增组件源（24 props / 6 events / 2 slots / expose focus·blur / compact 注入） |
| `packages/core/theme/vars.scss` | 追加 `$m-input-*` 段 19 个变量（全 `!default`） |
| `packages/playground/pages-sub/input/input.uvue` + `pages.json` / `router/router.config.uts` / `pages/index/demo-components.uts` | 演示页 11 节 + 三处注册（数据展示组 Cell 后，字母序 B/C/I） |
| `packages/docs/src/components/input.md` + `src/en/components/input.md` | 双语文档（介绍 / 11 节演示 / Props / Events / Slots / Methods / 主题定制 19 变量表 / 与 Vant Field、Sard Input 差异 7 条） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏数据展示组加 Input |
| `packages/docs/src/components/compact.md` + `en` 镜像 | 兑现 m-compact 遗留 TODO：「仅支持 m-button」三处表述更新为「m-button / m-input 组合」 |
| 三处 changelog（`playground/uni_modules/m-ui-x/changelog.md` + 文档站中英） | 0.2.0 段补录 m-input，组件数 14→15 |

### 验证方式与结果

- `pnpm sync:uni-modules` + `sync:uni-modules:check` 通过
- Playwright（playwright-core + 系统 Chrome，端口 5174）全变体实测：T0–T12 共 **50 断言全过**（v-model 与事件、type+inputmode 平台映射、show-eye 切换、clearable 两时机与清除生效、readonly / disabled、插槽、无边框、textarea 高度、字数统计、formatter / precision 修正、compact 水平垂直混排、cell 嵌入、无 pageerror / 无资源 404）；截图双轮视觉验收
- 首轮 45/50，五项修复后回归全过：change 先于 blur 发（调序）、digit 的 inputmode=decimal 属平台正确映射（改断言）、precision 尾零被 parseFloat 抹掉（改 toFixed 直返）、flex 取 computed flexGrow、m-button min-width 致混排 31px 等宽差（既有设计，放宽为「双方拉伸」断言）
- cell 嵌入截图发现 inlaid 输入继承 m-cell value 区右对齐 → 演示页与双语文档示例补 `text-align: left`，复测 textAlign=left + 截图两行 placeholder 左边缘对齐确认
- `pnpm build:demo` 产物入库（66 文件）；`pnpm build:docs` 死链检查通过

### 遗留 TODO

- label / 必填星号 / 校验体系：留待未来 m-form-item（Q1-A 既定边界，cell 嵌入组合为过渡形态）
- `focus()` / `blur()` 实例方法 App 端真机行为验证（Web 端已实测通过）
- m-compact 中 m-button 与 m-input 混排存在 31px 等宽差（m-button min-width:76px 底线与 flex basis 分配交互，属 m-button 既有设计，接受现状）
