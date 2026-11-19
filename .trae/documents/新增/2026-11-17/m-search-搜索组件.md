# m-search 搜索组件 实施方案

## 需求

对标两家实现，为 unix-ui 新增搜索组件 `m-search`：

- **Vant Search**：`v-model` 输入值、`label` 左侧文本、`shape`（round）、`background` 外部背景、`maxlength`、`placeholder`、`clearable` / `clear-icon` / `clear-trigger`、`autofocus`、`show-action` / `action-text`（默认「取消」）/ `action` 插槽、`disabled` / `readonly`、`error` / `error-message`、`formatter` / `format-trigger`、`input-align`、`left-icon`（默认 search）/ `right-icon`、`search` / `cancel` / `clear` / `focus` / `blur` / `click-input` / `click-left-icon` / `click-right-icon` 事件、`focus()` / `blur()` 实例方法、左 / 右侧外部与框内三组插槽
- **Sard Search**：`model-value`、`shape`、`background` / `input-background` / `input-color`、`cancel` / `search` 两个按钮文案 prop（点击后分别派发事件，cancel 额外清空）、`align`、`readonly` / `disabled`、`prepend` / `append` / `input-prepend` / `input-append` 四插槽、`input` / `change` / `search` / `cancel` / `clear` / `click` / `focus` / `blur` 事件

## 需求分析

### 与两个参考的取舍（待疑问清单确认）

| 维度 | Vant | Sard | 本项目建议 | 理由 |
| --- | --- | --- | --- | --- |
| 实现方式 | 自绘容器 + Field | 自绘容器 + 原生 input | **组合 `m-input`** | 清空 / 聚焦 / 失焦 / 只读 / 禁用 / 长度限制全部已有；仅需给 `m-input` 补 `confirm` 事件与 `inputAlign` 两处向后兼容能力 |
| 值绑定 | `v-model` | `model-value` | **`v-model:value`** | 项目全系统一 |
| 右侧按钮 | `show-action` + `action-text` + `action` 插槽（仅 cancel） | `search` / `cancel` 文案各自成按钮（二选一） | **单一按钮 + `action-type: 'cancel' \| 'search'`** | 两家视觉上都只有一个右侧按钮，用类型区分语义，避免两个 prop 互斥打架 |
| 取消行为 | 仅派发 `cancel`，不清空 | 派发 `cancel` 并清空输入 | **仅派发 `cancel`** | 受控组件不单方面改值；需要清空时外部在 `cancel` 里写 `value = ''` |
| 文字对齐 | `input-align` | `align` | **`inputAlign`** | 与 `m-input` 的 `input` 语义词对齐，避免与 flex `align` 混淆 |
| 输入区背景 | 固定主题色 | `input-background` / `input-color` | **`inputBackground`**，不做 `inputColor` | 文本色可由主题变量 / `customStyle` 覆盖；少一个 prop |
| 错误提示 | `error` / `error-message` | 无 | **支持（m-search 自身渲染提示行）** | 表单场景常用；不改 `m-input`，后续如需统一再上提 |
| 插槽 | left / action / label / left-icon / right-icon | prepend / append / input-prepend / input-append | **Vant 五插槽** | Sard 四插槽与之一一对应（prepend→left、append→action、input-*→left/right-icon） |
| 字符格式化 | `formatter` / `format-trigger` | 无 | **透传 `m-input`** | 零成本，m-input 已实现 |
| 实例方法 | `focus` / `blur` | `focus` / `blur` | **透传 `m-input` 的 `focus` / `blur`** | m-input 已 expose |

### 可复用资产（结构性复用，代码独立实现）

- `m-input`：输入主体、清空按钮（`clearable` / `clearTrigger`）、`focus` / `blur` 实例方法、`formatter` / `maxlength` / `disabled` / `readonly` 全部透传
- `m-input` 的 `prepend` / `append` 插槽：分别承载 `<label + left-icon>` 与 `<right-icon>`（框内元素）
- `m-input` 的 `customStyle`（作用于边框层）：搜索框的圆角、输入区背景色直接内联，无需依赖跨组件类名
- `m-icon`：`search` / `clear` 字形已存在
- 主题变量体系：新增 `$m-search-*` 段，全部 `!default`

### 需要给 m-input 补的能力（向后兼容）

| 能力 | 现状 | 补充方式 | 影响 |
| --- | --- | --- | --- |
| `confirm` 事件 | 未监听原生 `@confirm`，键盘搜索键无回调 | `input` / `textarea` 增加 `@confirm`，派发 `confirm: [value: string]` | 纯新增事件，既有消费者不受影响 |
| `inputAlign` | 无对齐能力 | 新增 `inputAlign?: 'left' \| 'center' \| 'right'`，默认 `'left'`，内联 `text-align` 到控件 | 默认值不改既有观感 |

### 影响面

| 产物 | 落点 |
| --- | --- |
| 组件源 | `packages/core/components/m-search/m-search.uvue` |
| 既有组件 | `m-input` 补 `confirm` 事件 + `inputAlign`（含文档属性表更新） |
| 主题变量 | `$m-search-*` 段（约 10 项） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `packages/playground/pages-sub/search/search.uvue` + `demo-components.uts` 数据录入组末尾（`rate` < `search`） |
| 文档 | `docs/src/components/search.md` + `docs/src/en/components/search.md` + 侧栏两侧同序 + `input.md` 补两处能力说明 |
| 版本日志 | 插件 changelog + docs 站 zh / en 0.7.0 |
| 既有组件行为 | 除 m-input 的两处新增外不变 |

## 伪代码设计

### 模板结构

```html
<view :class="rootClass" :style="outerStyle">
	<!-- 搜索框外左侧（Vant left 插槽） -->
	<view v-if="hasLeft" class="m-search__left"><slot name="left"></slot></view>

	<!-- 输入框：组合 m-input，round / 背景走 customStyle -->
	<m-input
		ref="inputRef"
		class="m-search__input"
		:model-value="value"
		:type="'text'"
		:placeholder="placeholder"
		:maxlength="maxlength"
		:clearable="clearable"
		:clear-trigger="clearTrigger"
		:disabled="disabled"
		:readonly="readonly"
		:border="border"
		:formatter="formatter"
		:align="inputAlign"
		:custom-style="inputStyle"
		@update:model-value="onInput"
		@focus="onFocus"
		@blur="onBlur"
		@confirm="onConfirm"
		@clear="onClear"
	>
		<template #prepend>
			<slot name="label"><text v-if="label != ''" class="m-search__label">{{ label }}</text></slot>
			<view class="m-search__left-icon" @click="onClickLeftIcon">
				<slot name="left-icon"><m-icon :name="leftIcon" custom-class="m-search__left-icon-glyph" /></slot>
			</view>
		</template>
		<template #append>
			<view v-if="rightIcon != null" class="m-search__right-icon" @click="onClickRightIcon">
				<slot name="right-icon"><m-icon :name="rightIcon" custom-class="m-search__right-icon-glyph" /></slot>
			</view>
		</template>
	</m-input>

	<!-- 搜索框外右侧：show-action 且非 action 插槽时渲染按钮 -->
	<view v-if="showAction" class="m-search__action" @click="onActionClick">
		<slot name="action"><text class="m-search__action-text">{{ actionText }}</text></slot>
	</view>

	<!-- 错误提示行 -->
	<text v-if="errorMessage != ''" class="m-search__error">{{ errorMessage }}</text>
</view>
```

- 根节点纵向排布（输入行 + 错误行），输入行横向排布（left + 输入框 + action）
- `round` 形态：`inputStyle` 追加 `border-radius: 999px;`；`inputBackground` 追加 `background-color: ...;`
- 搜索框外部背景：根节点输入行 `background-color: <background>`

### 关键逻辑

```uts
/** 输入变化：派发 update:value */
function onInput(v: string) {
	emit('update:value', v)
	emit('change', v)      // m-input 的 change 已在失焦时派发，这里对齐 Sard 的「值变即 change」？见 Q8
}

/** 键盘搜索键 */
function onConfirm(v: string) {
	emit('search', v)
}

/** 右侧按钮：按 action-type 派发 search 或 cancel；有 action 插槽时由用户自行处理 */
function onActionClick(e: MouseEvent) {
	emit('click', e)
	if (slotAction) return
	if (props.actionType == 'search') emit('search', props.value)
	else emit('cancel')
}
```

### API

#### Props

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `string` | `''` | 输入值（v-model:value） |
| `label` | `string` | `''` | 框内左侧文本 |
| `shape` | `'square' \| 'round'` | `'square'` | 输入框形状 |
| `background` | `string` | `''` | 搜索框外部背景色（空用主题值） |
| `inputBackground` | `string` | `''` | 输入区背景色（空用主题值） |
| `placeholder` | `string` | `'请输入搜索关键词'` | 占位符 |
| `maxlength` | `number` | `-1` | 最大长度（-1 不限） |
| `clearable` | `boolean` | `true` | 清除按钮 |
| `clearTrigger` | `'focus' \| 'always'` | `'focus'` | 清除按钮显示时机 |
| `autofocus` | `boolean` | `false` | 挂载即聚焦 |
| `showAction` | `boolean` | `false` | 显示右侧按钮 |
| `actionText` | `string` | `'取消'` | 右侧按钮文案 |
| `actionType` | `'cancel' \| 'search'` | `'cancel'` | 右侧按钮语义 |
| `leftIcon` | `IconName` | `'search'` | 框内左图标 |
| `rightIcon` | `IconName \| null` | `null` | 框内右图标 |
| `inputAlign` | `'left' \| 'center' \| 'right'` | `'left'` | 输入文字对齐 |
| `border` | `boolean` | `false` | 输入框边框（搜索框默认无边框） |
| `disabled` | `boolean` | `false` | 禁用 |
| `readonly` | `boolean` | `false` | 只读 |
| `error` | `boolean` | `false` | 错误态（边框标红） |
| `errorMessage` | `string` | `''` | 错误提示文案（空不展示） |
| `formatter` | `((v: string) => string) \| null` | `null` | 输入格式化（透传 m-input） |
| `customClass` / `customStyle` | — | `''` | 根节点样式直达 |

#### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `[value: string]` | 输入变化（v-model:value） |
| `search` | `[value: string]` | 键盘搜索键 / `actionType='search'` 的按钮点击 |
| `cancel` | `[]` | `actionType='cancel'` 的按钮点击 |
| `clear` | `[]` | 点击清除按钮 |
| `focus` / `blur` | `[event: UniEvent]` | 聚焦 / 失焦 |
| `click-input` | `[event: MouseEvent]` | 点击输入区域 |
| `click-left-icon` / `click-right-icon` | `[event: MouseEvent]` | 点击框内左 / 右图标 |
| `click` | `[event: MouseEvent]` | 点击组件 |

#### Slots

| 插槽 | 位置 | 说明 |
| --- | --- | --- |
| `left` | 搜索框外左侧 | 对应 Sard `prepend` |
| `action` | 搜索框外右侧 | 自定义后不再自动派发 `cancel` / `search` |
| `label` | 框内最左 | 覆盖 `label` 文本 |
| `left-icon` | 框内左图标位 | 覆盖 `leftIcon` |
| `right-icon` | 框内右图标位 | 覆盖 `rightIcon` |

#### Methods

`focus()` / `blur()`（透传 `m-input`）

### 主题变量（`$m-search-*`）

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `$m-search-padding-y` | `10px` | 搜索框上下内边距 |
| `$m-search-padding-x` | `12px` | 搜索框左右内边距 |
| `$m-search-background` | `#f2f2f2` | 搜索框外部背景 |
| `$m-search-input-background` | `$m-white` | 输入区背景 |
| `$m-search-input-height` | `34px` | 输入区高度 |
| `$m-search-input-radius` | `$m-radius-md` | 方形圆角 |
| `$m-search-input-radius-round` | `$m-radius-max` | 圆形圆角 |
| `$m-search-label-color` | `$m-text-color` | 左侧文本色 |
| `$m-search-label-font-size` | `14px` | 左侧文本字号 |
| `$m-search-icon-color` | `$m-text-color-fourth` | 框内图标色 |
| `$m-search-icon-size` | `16px` | 框内图标尺寸 |
| `$m-search-action-padding` | `0 8px` | 右侧按钮内边距 |
| `$m-search-action-color` | `$m-text-color` | 右侧按钮文字色 |
| `$m-search-action-font-size` | `14px` | 右侧按钮字号 |
| `$m-search-error-color` | `$m-color-danger` | 错误提示色 |
| `$m-search-error-font-size` | `12px` | 错误提示字号 |

### 约束与边界

| 约束 | 说明 |
| --- | --- |
| **不改 m-input 既有默认行为** | 只新增 `confirm` 事件与 `inputAlign`（默认 `'left'`） |
| **受控值** | 搜索组件不持内部值，`cancel` 不清空，清空由外部在 `cancel` 中处理 |
| **扁平淡化样式** | `m-search` / `m-search__row` / `m-search__label` / `m-search__left-icon` / `m-search__right-icon` / `m-search__action` / `m-search__error` 全部扁平 |
| **图标不依赖插槽 v-for** | 单例图标，无 #17 重复插槽问题 |
| **错误态标红** | 通过 m-input `customStyle` 覆盖边框色实现，不新增 m-input prop |

### 验证矩阵

| 场景 | 操作 | 预期 |
| --- | --- | --- |
| 基础 | 输入关键词 | `update:value` 连续回传，值回显 |
| 键盘搜索 | 输入后按回车 / 搜索键 | `search` 回传当前值 |
| 取消按钮 | show-action 点击 | `cancel` 派发，输入值不变 |
| 搜索按钮 | action-type="search" 点击 | `search` 回传当前值 |
| action 插槽 | 传自定义按钮 | 点击不自动派发 cancel / search |
| 清除 | 点击清除图标 | 值清空、`clear` 派发 |
| 形状 / 背景 | shape=round + background / input-background | 圆角与两处背景生效 |
| 对齐 | input-align=center / right | 输入文字与占位符对齐 |
| 左侧文本 / 图标 | label + left-icon | 框内左文本与图标渲染 |
| 右图标 | right-icon | 渲染并派发 click-right-icon |
| 禁用 / 只读 | disabled / readonly | 不可输入，视觉区分 |
| 错误提示 | error + error-message | 边框标红 + 下方提示 |
| 实例方法 | focus() / blur() | 聚焦 / 失焦生效 |
| 格式化 | formatter | 输入内容按规则变换 |

## 疑问清单

> 每条已给推荐答案，在「回答：」处作答；回复「按推荐执行」即全部按推荐定案。

### Q1 实现方式：组合 `m-input` 还是独立自绘 input？（影响：是否改动既有组件）

**推荐：组合 `m-input`**，并给它补两处向后兼容能力：`confirm` 事件（键盘搜索键）与 `inputAlign`（默认 `left`）。理由：清空 / 聚焦 / 失焦 / 只读 / 禁用 / 长度限制 / formatter 全部复用，避免第二套输入逻辑；两处补充均为纯新增，既有消费者无感。

回答：组合 `m-input`。

### Q2 右侧按钮模型：单一按钮 + `action-type`？（影响：API 形态）

**推荐：`show-action` + `action-text`（默认「取消」）+ `action-type: 'cancel' | 'search'`**。理由：两家视觉上都只有一个右侧按钮，用类型区分语义即可；避免 Sard 的 `search` / `cancel` 两个 prop 互斥冲突。

回答：`show-action` + `action-text`（默认「取消」）+ `action-type: 'cancel' | 'search'`

### Q3 点取消是否清空输入？（影响：交互语义）

**推荐：不清空**（Vant 语义）。理由：受控组件不单方面改值；需要「退出即清空」时外部在 `@cancel` 里写 `value = ''`。

回答：不清空。

### Q4 值绑定与命名：`v-model:value` / `inputAlign` / `inputBackground` / `actionText`？（影响：全部 API）

**推荐：按上述命名**。理由：`v-model:value` 为项目全系约定；`inputAlign` 明确作用于输入文字（避免与 flex `align` 混淆）；`inputBackground` 对齐 Sard；`actionText` 对齐 Vant。

回答：按上述命名。

### Q5 是否支持 `error` / `error-message`？（影响：API 与模板行结构）

**推荐：支持**，由 `m-search` 自身渲染提示行 + 通过 `m-input` 的 `customStyle` 覆盖边框色，不改 `m-input`。理由：表单场景常用，实现自包含。

回答：支持。

### Q6 图形与文本出口：`label` + `leftIcon`（默认 search）+ 同名插槽？（影响：模板结构）

**推荐：`label` / `leftIcon` / `rightIcon` 三个 prop + `label` / `left-icon` / `right-icon` 三个插槽**。理由：`m-icon` 已有 `search` / `clear` 字形；插槽兜底自定义内容。

回答：`label` / `leftIcon` / `rightIcon` 三个 prop + `label` / `left-icon` / `right-icon` 三个插槽。

### Q7 插槽集合：Vant 五插槽？（影响：与 Sard 的映射）

**推荐：`left` / `action` / `label` / `left-icon` / `right-icon`**。理由：与 Sard 的 `prepend` / `append` / `input-prepend` / `input-append` 一一对应，命名采用 Vant 体系（更通用）。

回答：`left` / `action` / `label` / `left-icon` / `right-icon`。

### Q8 `change` 事件语义：值变即派发，还是失焦时派发？（影响：事件契约）

**推荐：值变即派发**（与 Sard 一致，`update:value` 与 `change` 同参同发）。理由：项目内 `m-input` 的 `change` 为失焦语义，但搜索场景需要实时联动列表过滤；两者并存会让 `change` 含义漂移。若确认此口，`m-search` 不转发 `m-input` 的 `change`，而是自行在输入时派发；**若你希望保留失焦语义，请在此写明**。

回答：值变即派发。

### Q9 是否需要 `formatter` / `maxlength` 等 `m-input` 能力透传？（影响：API 范围）

**推荐：透传 `maxlength` / `formatter` / `clearTrigger`**，其余（precision / min / max / eye）不透传。理由：搜索场景只用到长度限制与格式化，其余属数值输入能力。

回答：透传 `maxlength` / `formatter` / `clearTrigger`。

### Q10 版本归属：追加 0.7.0？（影响：changelog 与文档 frontmatter）

**推荐：追加 `0.7.0`**。理由：与 rate / radio / password-input 同批发布；四个 package.json 的 version 仍由你统一 bump。

回答：追加 `0.7.0`。

## 实施记录（2026-11-17）

Q1-Q10 全部按推荐执行（组合 m-input / 单一按钮 + action-type / 取消不清空 / v-model:value 等命名 / 支持错误提示 / label + 图标 + 插槽 / 五插槽 / change 值变即派发 / 透传 maxlength·formatter·clearTrigger / 追加 0.7.0）。产出：

- 组件源：`packages/core/components/m-search/m-search.uvue`
- 既有组件增强：`m-input` 新增 `confirm` 事件（input / textarea 均监听原生 `@confirm`）与 `inputAlign` 属性（内联 `text-align`），默认值不改既有观感；中英文 `input.md` 属性 / 事件表已补两行
- 主题变量：`$m-search-*` 20 项（vars.scss 末尾追加，全 `!default`）
- 演示页：`pages-sub/search/search.uvue`（13 卡片）+ `demo-components.uts` 数据录入组末尾登记（`rate` < `search`）
- 文档：zh / en 各 1 份 + 侧栏两侧同序 + 三处 changelog 0.7.0

**实现细节（与伪代码的差异）**

- 搜索框视觉全部落在 `m-search__field` 自绘层（高度 / 圆角 / 背景 / 错误边框 / padding），`m-input` 以 `inlaid` 形态嵌入：规避了「跨组件类名覆盖 m-input 圆角」的特异性不确定问题，也让 `$m-search-field-*` 变量真正生效
- 错误态不改 `m-input`：field 基础类预留 `border-width + transparent`，`--error` 只换 `border-color`，避免 border-width 从 0 到 1 引起布局跳动
- `inputAlign` 通过 m-input 控件内联 `text-align` 实现，默认 `left` 不产生内联样式
- `autofocus` 走 `onMounted + nextTick` 调用 `focus()`（uvue 首次渲染后控件才存在）
- `action` 插槽存在时不再自动派发 `cancel` / `search`（`slots['action']` 判定）
- `focus()` / `blur()` 通过 `$callMethod` 转发到 m-input

**DoD 验证结果：**

- [x] 编译通过：既有 vite dev server（5174）热更新加载，`/pages-sub/search/search` 返回 200
- [x] 页面实测：13 张卡片全部渲染；基础输入回显 `当前：机加工一线`；取消按钮派发 `cancel` 且值不变；搜索按钮（action-type=search）派发 `search`；Enter 触发 confirm → `search 键盘 search: abc`；右侧图标计数 0→1；input-align=center 输入文字居中；readonly / disabled 输入框均不可编辑且禁用态灰显
- [x] 运行日志：`search 基础 change: 机加工一线`、`search 键盘 search: abc`、`search 按钮 search: xyz`、`search cancel`、`search click-right-icon: 1` 全部符合预期
- [x] 无运行时错误：控制台无 error / warning
- [x] `pnpm sync:uni-modules:check` 一致性通过
- [x] `pnpm build:docs` 构建与死链检查通过

**遗留 TODO**

- `inputAlign` 的 `text-align` 在 App 端原生 input / textarea 上的实际表现需真机验收（Web 已确认居中 / 右对齐均生效）
- 小程序端 `left` / `action` 插槽与 `prepend` / `append` 内插槽未实测（沿用既有经验：单例插槽无 #17 限制）

**经验**：跨组件视觉定制优先「父组件自绘容器 + 子组件 inlaid」，比「向子组件传类名覆盖样式」更可控（ucss 无 scoped，单类选择器特异性相同，最终生效取决于打包顺序）。

**修复记录（2026-11-17，搜索框圆角视觉偏差）**

- 现象：`label`（地址）+ `left-icon`（定位）上下堆叠，输入区内容高 36px，被 34px 的 field + `overflow: hidden` 裁切，图标压在圆角处被切，视觉上表现为圆角破损
- 根因：`m-input` 的 `.m-input__prepend` 容器未声明 `flex-direction`（ucss 默认列向），槽内多节点即纵向堆叠；节点多时撑高输入区越界
- 修复：`m-search` 的 `prepend` 槽内新增单行包裹层 `.m-search__prepend`（`flex-direction: row; align-items: center`），并把 label 与图标的间距收敛为 `$m-search-label-gap`（4px，新增主题变量，中英文档已补）
- 复验：地址与图标同行，图标 16px 完整可见且垂直居中；field 高 34px、内容 24px，无任何子元素越界，圆角完整；`address_card_zoomed` 截图确认


