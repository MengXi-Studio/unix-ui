# m-segmented 分段控制器 实施方案

## 需求

对标 Sard Segmented（Vant 无同名组件，其能力最接近 Vant Tabs 的平铺切换），为 unix-ui 新增分段控制器 `m-segmented`：

- **Sard 能力面**：`v-model` 绑定值、`options` 数组驱动（含 `option-keys` 字段映射）、`size`（small / medium / large）、`shape`（square / round 胶囊）、`direction`（horizontal / vertical）、`ellipsis` 溢出省略、`disabled`（整体）/ `readonly`、单个选项 `disabled`、`segmented-item` 子组件自定义内容（图标 + 文本排列、仅图标）、`update:modelValue` + `change` 事件、选中块滑块视觉

## 需求分析

### 与参考的取舍（待疑问清单确认）

| 维度 | Sard | 本项目建议 | 理由 |
| --- | --- | --- | --- |
| 值模型 | `model-value: any` | **`v-model:value` + `string \| number`** | 项目全系统一 `v-model:value`；UTS 不做 any，值与 `m-radio-group` 的 `RadioValue` 对齐 |
| 选项驱动 | `options` + `option-keys` | **`options: SegmentedOption[]` + `fieldNames`** | 与 `m-radio-popup` / `m-checkbox-popup` 的「options + field-names」先例一致 |
| 原始值数组 | 支持 `['早班','中班']` | **不做**，仅对象数组 | UTS 联合数组（`(string \| SegmentedOption)[]`）运行时判型成本高；文档给出 `map` 写法 |
| 自定义内容 | `segmented-item` 子组件 | **`item` 作用域插槽**（`{ option, index, active, disabled }`） | 子组件需跨实例共享选中态（provide/inject 或 context），UTS 下成本高；作用域插槽覆盖同等能力且零注册 |
| 选中块 | 白色滑块 + 阴影 | **绝对定位滑块 + `UniElement.animate` 平移** | 复用 m-tabs 的动画范式（ucss 无 transition/keyframes；MP 端按既有结论直接落位降级） |
| 宽度分配 | 等分 | **等分（flex: 1）** | 分段器语义为「等宽切换」，宽度随内容变化会产生跳动 |
| 表单验证 | `validate-event` | **不做** | 项目暂无表单组件体系，无消费方 |
| 图标 | 靠子组件插槽 | **`item` 插槽内自渲染** | 与自定义内容同一出口，不额外加 `icon` 字段 |

### 可复用资产（结构性复用，代码独立实现）

- **滑块动画**：m-tabs `applyLine` 的范式——元素 ref + `UniElement.animate(keyframes, { duration })`，MP 端 `#ifndef MP` 降级为直接落位
- **选项模型**：`m-radio-group/radio.uts` 的 `fieldNames` 解析函数（label / value / disabled 三字段兜底）
- **尺寸体系**：small / medium / large 三档走 `$m-segmented-*` 主题变量，不引入新的尺寸枚举
- 无公共工具函数需新增到 `utils/`

### 技术风险

- **百分比平移动画**：滑块等分后可用「宽度 = `100 / count %`、位移 = `index * 100%`」表达（transform 百分比相对自身宽高），避免容器测量；需在 Web / App 验证 `UniElement.animate` 对百分比 transform 的支持，MP 走直接落位
- **文字省略**：`ellipsis` 依赖 text 的单行裁切能力（`lines=1` + `overflow: hidden`），需实测 Web / App 表现
- **阴影**：滑块阴影采用 `box-shadow`（Sard 同款）；若某端不支持则降级为无阴影（不影响选中态辨识）

### 影响面

| 产物 | 落点 |
| --- | --- |
| 组件源 | `packages/core/components/m-segmented/m-segmented.uvue`（单文件，类型内联 + 复用 radio.uts 的 fieldNames 解析） |
| 主题变量 | `$m-segmented-*` 段（约 15 项） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `packages/playground/pages-sub/segmented/segmented.uvue` + `demo-components.uts` 数据录入组末尾（`search` < `segmented`） |
| 文档 | `docs/src/components/segmented.md` + `docs/src/en/components/segmented.md` + 侧栏两侧同序 |
| 版本日志 | 插件 changelog + docs 站 zh / en 0.7.0 |
| 既有组件 | 不触碰 |

## 伪代码设计

### 模板结构

```html
<view :class="rootClass" :style="customStyle">
	<!-- 轨道：padding 由根节点承担，轨道自身无内边距，滑块百分比定位才准确 -->
	<view :class="trackClass">
		<!-- 选中块：等分宽度 + translate 平移 -->
		<view ref="thumbRef" :class="thumbClass" :style="thumbStyle"></view>

		<view
			v-for="(option, index) in items"
			:key="index"
			:class="itemClass(option, index)"
			@click="onItemClick(option, index)"
		>
			<slot name="item" :option="option" :index="index" :active="index == activeIndex" :disabled="isOptionDisabled(option)">
				<text :class="labelClass(option, index)">{{ option.label }}</text>
			</slot>
		</view>
	</view>
</view>
```

- 根节点：背景 + 圆角（`shape=round` 时半径取胶囊值）+ 内边距
- 轨道：`position: relative`，横向 `row` / 纵向 `column`
- 滑块：绝对定位 `left: 0; top: 0;`，宽度 `100 / count %`（纵向为高度），颜色/圆角/阴影走主题
- 选中块在 DOM 中位于选项之前，不遮挡点击（`pointer-events` 或纯视觉层）

### 关键逻辑

```uts
/** 选中下标（无匹配返回 -1） */
const activeIndex = computed<number>(() => {
	for (let i = 0; i < items.value.length; i++) {
		if (items.value[i].value == props.value) return i
	}
	return -1
})

/** 滑块内联样式：尺寸百分比 + 位移（百分比相对自身，无需测量） */
const thumbStyle = computed<string>(() => {
	const n = items.value.length
	if (n <= 0 || activeIndex.value < 0) return 'opacity: 0;'
	const size = (100 / n).toString() + '%'
	const offset = (activeIndex.value * 100).toString() + '%'
	if (props.direction == 'vertical') return 'height: ' + size + '; transform: translateY(' + offset + ');'
	return 'width: ' + size + '; transform: translateX(' + offset + ');'
})

/** 下标变化：滑块从旧位平移（首帧 / MP / duration<=0 直接落位） */
watch(activeIndex, (nv: number, ov: number) => {
	const el = thumbRef.value
	if (el == null) return
	if (firstSet || props.duration <= 0 || ov < 0 || nv < 0) { firstSet = false; return }
	// #ifndef MP
	const from = (ov * 100).toString() + '%'
	const to = (nv * 100).toString() + '%'
	const keyframes: UniAnimationKeyframe[] = props.direction == 'vertical'
		? [{ transform: 'translateY(' + from + ')', offset: 0 }, { transform: 'translateY(' + to + ')', offset: 1 }]
		: [{ transform: 'translateX(' + from + ')', offset: 0 }, { transform: 'translateX(' + to + ')', offset: 1 }]
	el.animate(keyframes, { duration: Math.round(props.duration * 1000), easing: 'ease' })
	// #endif
})

/** 点击：组件或选项禁用 / 只读 / 同值时不派发 */
function onItemClick(option: SegmentedOption, index: number) {
	if (props.disabled || props.readonly || isOptionDisabled(option)) return
	if (option.value == props.value) return
	emit('update:value', option.value)
	emit('change', option.value)
}
```

### API

#### Props

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | `''` | 当前选中值（v-model:value） |
| `options` | `SegmentedOption[]` | `[]` | 选项数组 |
| `fieldNames` | `SegmentedFieldNames \| null` | `null` | 字段映射（label / value / disabled），默认取同名键 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 尺寸 |
| `shape` | `'square' \| 'round'` | `'square'` | 形状 |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 排列方向 |
| `disabled` | `boolean` | `false` | 整体禁用 |
| `readonly` | `boolean` | `false` | 只读（可展示选中态，不可切换） |
| `ellipsis` | `boolean` | `true` | 文本溢出省略 |
| `duration` | `number` | `0.2` | 滑块动画时长（秒），0 关闭 |
| `customClass` / `customStyle` | — | `''` | 根节点样式直达 |

`SegmentedOption = { label: string; value: string \| number; disabled?: boolean }`

#### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `[value: string \| number]` | 选中值变化（v-model:value） |
| `change` | `[value: string \| number]` | 选中值变化 |

#### Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `item` | `{ option, index, active, disabled }` | 自定义单项内容（图标 + 文本、仅图标等） |

### 主题变量（`$m-segmented-*`）

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `$m-segmented-padding` | `2px` | 容器内边距（滑块与边框间距） |
| `$m-segmented-bg` | `$m-fill-color` | 容器背景 |
| `$m-segmented-radius` | `$m-radius-md` | 方形圆角 |
| `$m-segmented-radius-round` | `$m-radius-max` | 胶囊圆角 |
| `$m-segmented-thumb-bg` | `$m-white` | 滑块背景 |
| `$m-segmented-thumb-radius` | `$m-radius-sm` | 滑块圆角 |
| `$m-segmented-thumb-shadow` | `0 2px 4px rgba(0, 0, 0, 0.08)` | 滑块阴影 |
| `$m-segmented-height-sm` | `28px` | small 高度 |
| `$m-segmented-height` | `32px` | medium 高度 |
| `$m-segmented-height-lg` | `40px` | large 高度 |
| `$m-segmented-font-size` | `14px` | 文字字号 |
| `$m-segmented-font-size-sm` | `12px` | small 字号 |
| `$m-segmented-item-padding` | `0 12px` | 单项内边距 |
| `$m-segmented-item-padding-sm` | `0 8px` | small 单项内边距 |
| `$m-segmented-item-color` | `$m-text-color-third` | 未选中文字色 |
| `$m-segmented-item-color-active` | `$m-text-color` | 选中文字色 |
| `$m-segmented-item-color-disabled` | `$m-text-color-fourth` | 禁用文字色 |

### 约束与边界

| 约束 | 说明 |
| --- | --- |
| **等分宽度** | 所有选项 `flex: 1`，纵向时等分高度；不随内容自适应，避免切换跳动 |
| **受控值** | 不持内部值；`value` 无匹配项时滑块隐藏（`opacity: 0`），不自动纠偏 |
| **同值点击不派发** | 分段器不提供「取消选中」语义 |
| **禁用优先级** | 组件级 `disabled` > 选项级 `disabled`；`readonly` 仅禁止切换 |
| **样式扁平** | `m-segmented` / `__track` / `__thumb` / `__item` / `__label` 全部扁平类，无层级嵌套 |
| **动画** | 仅滑块平移；无 @keyframes / 无伪元素；MP 端直接落位 |

### 验证矩阵

| 场景 | 操作 | 预期 |
| --- | --- | --- |
| 基础 | 点击第 2 项 | 值切换为第 2 项，滑块平移到第 2 格 |
| 尺寸 | size=small / large | 高度、字号、内边距同步变化 |
| 胶囊 | shape=round | 容器与滑块均为胶囊圆角 |
| 纵向 | direction=vertical | 选项纵向等分，滑块沿 Y 轴平移 |
| 自定义内容 | `item` 插槽放图标 + 文本 | 渲染自定义节点，选中态样式随 active |
| 仅图标 | 插槽只放图标 | 单项仍等分并居中 |
| 溢出省略 | 长文本 + ellipsis | 单行省略，不撑破等分宽度 |
| 关闭省略 | ellipsis=false | 长文本换行 / 撑高，不裁切 |
| 整体禁用 | disabled | 点击无变化、文字灰显 |
| 单项禁用 | options[1].disabled | 该项点击无变化、文字灰显，其他项正常 |
| 只读 | readonly | 点击无变化，选中态正常显示 |
| 受控 | 外部改 value | 滑块跟随，不派发事件 |
| 无匹配值 | value='' | 滑块隐藏，选项均为未选中态 |
| fieldNames | 自定义 `{ label: 'name', value: 'id' }` | 正常解析渲染与取值 |

## 疑问清单

> 每条已给推荐答案，在「回答：」处作答；回复「按推荐执行」即全部按推荐定案。

### Q1 值类型与绑定：`v-model:value` + `string | number`？（影响：全部 API 与类型）

**推荐：`value: string | number`，默认 `''`**（与 `m-radio-group` 的 `RadioValue` 一致）。放弃 Sard 的 `any`：UTS 不做 any，且 `boolean` 值在分段器场景无实际用例。

回答：

### Q2 选项形态：仅对象数组 + `fieldNames`，不做原始值数组？（影响：使用方式）

**推荐：仅对象数组 + `fieldNames` 映射**（与 `m-radio-popup` / `m-checkbox-popup` 一致）。不支持 `['早班','中班','晚班']` 这类原始值数组，文档给出 `.map(v => ({ label: v, value: v }))` 的等价写法。

回答：

### Q3 自定义内容：`item` 作用域插槽，而非 `m-segmented-item` 子组件？（影响：组件数量与实现复杂度）

**推荐：只做 `m-segmented` 单组件 + `item` 作用域插槽**（`{ option, index, active, disabled }`）。理由：子组件需与父级共享选中态，UTS 下需 context / provide，收益仅是模板书写差异；插槽可完整覆盖「图标 + 文本」「仅图标」两类用法。

回答：

### Q4 滑块动画：`UniElement.animate` 百分比平移，MP 直接落位？（影响：视觉与跨端差异）

**推荐：按此实现**，`duration` 默认 `0.2` 秒、可设 0 关闭。理由：等分结构下百分比位移无需测量容器宽度；与 m-tabs 的动画范式一致；MP 端沿用既有「直接落位」结论。

回答：

### Q5 尺寸与形状：small / medium / large + square / round 全量支持？（影响：主题变量数量）

**推荐：全量支持**。尺寸走 `$m-segmented-height*` / `font-size*` / `item-padding*`；`shape=round` 时容器与滑块同时取胶囊圆角。

回答：

### Q6 纵向模式是否本期内置？（影响：模板与滑块双轴逻辑）

**推荐：内置 `direction: 'horizontal' | 'vertical'`**。理由：Sard 有该能力，且纵向滑块仅多一条 translateY 分支与一套类名，成本可控。

回答：

### Q7 `ellipsis` 行为：默认开启单行省略？（影响：文本裁切实现）

**推荐：默认 `true`**，开启时单项文本单行省略（`lines=1` + `overflow: hidden`）；关闭时允许换行撑高。若 App 端省略能力不达标，退化为不换行 + 裁切，并在实施记录标注。

回答：

### Q8 事件集合：仅 `update:value` + `change`？（影响：事件契约）

**推荐：仅两个事件，同参同发**（不做 `click` 冒泡事件）。理由：分段器的点击语义已被 change 表达；需要点击埋点时可在 `item` 插槽内容上自行绑定。

回答：

### Q9 版本与分组：0.7.0 + 数据录入组？（影响：changelog 与侧栏位置）

**推荐：追加 `0.7.0`，归入「数据录入」组末尾**（`search` < `segmented`）。理由：分段器本质是单选控件（radio 的平铺形态），与 radio / rate / search 同组；若你认为它更偏导航（切视图），也可放入「导航」组（在 tabs 邻近），请在回答中指明。

回答：

## 实施记录（2026-11-18）

Q1-Q9 全部按推荐执行（`v-model:value` + `string | number` / 仅对象数组 + fieldNames / `item` 插槽替代子组件 / 百分比滑块动画 + MP 落位 / 三档尺寸 + 胶囊 / 内置纵向 / ellipsis 默认开启 / 仅两个事件 / 追加 0.7.0 归数据录入组）。产出：

- 组件源：`packages/core/components/m-segmented/m-segmented.uvue`（复用 `m-radio-group/radio.uts` 的 fieldNames 解析与 `valuesEqual`）
- 主题变量：`$m-segmented-*` 20 项（vars.scss 末尾按 Search 段之后追加，全 `!default`）
- 演示页：`pages-sub/segmented/segmented.uvue`（9 卡片）+ `demo-components.uts` 数据录入组末尾（`search` < `segmented`）
- 文档：zh / en 各 1 份 + 侧栏两侧同序 + 三处 changelog 0.7.0

**实现细节**

- 结构分三层：根容器（背景 / 圆角 / 内边距 / 固定高度）→ 轨道（`position: relative`，等分）→ 选项（`position: relative` 绘制在滑块之上）；根节点承担 padding，保证滑块百分比定位不被内边距干扰
- 滑块尺寸与位移全部走百分比（`width: 100 / count %`、`transform: translateX(index * 100%)`），零容器测量；纵向切换 `height` + `translateY`
- 滑块动画：`watch(activeIndex)` + `UniElement.animate`，首帧 / `duration <= 0` / 越界下标不播放；`#ifndef MP` 隔离，MP 直接落位（沿用 m-tabs 结论）
- `options` 与 `fieldNames` 均为 `UTSJSONObject`，解析统一走 radio.uts helper，缺 value 的选项跳过渲染；插槽作用域 `option` 透出**原始对象**（便于取 `icon` 等自定义字段）
- `ellipsis` 用 `<text :max-lines="ellipsis ? 1 : 0">`（0 = 不限行），与 m-text 的 `max-lines` 语义一致
- 形状：容器与滑块各自声明 `--round` 变体类（避免后代选择器）；首版遗漏滑块圆角，实测发现后补 `$m-segmented-thumb-radius-round`

**DoD 验证结果：**

- [x] 编译通过：既有 dev server（5174）热更新，`/pages-sub/segmented/segmented` 返回 200
- [x] 页面实测：9 张卡片全部渲染；基础卡片点击「中班」后滑块 `translateX(100%)` 与「中班」中心对齐（x≈558.99 vs 558.98），日志 `segmented 基础 change: 中班`；自定义内容卡片图标 + 文本纵向排列且选中项为蓝色；单项禁用点击无变化（active 保持「早班」）
- [x] 胶囊形状：容器 `border-radius: 999px`、滑块 `999px`（修复后）；方形形态滑块仍为 `4px`
- [x] 运行日志：`segmented 基础 change: 中班` 符合预期；控制台仅 vite 连接与预加载日志，无 error / warning
- [x] `pnpm sync:uni-modules:check` 一致性通过
- [x] `pnpm build:docs` 构建与死链检查通过

**遗留 TODO**

- 滑块 `UniElement.animate` 的百分比 `transform` 与 `box-shadow` 在 App / 小程序端的实际表现需实机验收（Web 已验证；MP 已按降级直接落位）
- `ellipsis` 的 `max-lines=1` 在 App 端长文本下的裁切效果需实机确认
- 纵向模式下 `duration` 动画走 `translateY`，同样待 App 端确认

**经验**：等分布局优先用「百分比宽度 + 百分比位移」表达滑块，可直接省掉容器测量与 resize 监听；但变体样式（如胶囊圆角）必须给每个受影响节点单独声明变体类——ucss 没有后代选择器，父级变体不会自动传导。

**修复记录（2026-11-18，纵向模式高度异常）**

- 现象：`direction="vertical"` 时容器仍套用横向固定高度（medium 32px），三个选项被压进 32px 内互相重叠、文字裁切
- 根因：`.m-segmented` 的高度是固定值，纵向模式下应由内容撑开；且单项左右内边距在纵向无法形成行高
- 修复：`.m-segmented--vertical { height: auto }`；新增纵向单项内边距 `$m-segmented-item-padding-vertical(-sm/-lg)`（8px 12px / 6px 8px / 10px 16px），itemClass 在纵向时改用纵向内边距变体，不再叠加尺寸左右内边距
- 复验：纵向容器 112px、三项各 36px 无重叠；滑块全宽 36px 精确覆盖选中行；点击「中班」滑块 Y 位移 36px 且选中态与文案同步，控制台无报错


