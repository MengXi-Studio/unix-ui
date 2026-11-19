# m-radio 单选组件族 实施方案

## 需求

对标两家实现，为 unix-ui 补一组单选组件，与已完成的 `m-checkbox` 四件套同构：

- **Vant Radio / RadioGroup**：`v-model` 单值绑定、`direction` 排列、`shape`（square/dot）、`checked-color`、`icon-size`、`label-position`、`label-disabled`、禁用
- **Sard Radio / RadioGroup**：`readonly` 只读、`type`（circle/record 图标形态）、`options` 自动渲染、`custom` 插槽、`validate-event`
- **Sard RadioPopout**：弹层单选（m-popup + 单选组 + options 驱动）、`searchable` 搜索过滤、`icon-position`
- **Sard RadioInput**：弹层单选 + 输入框触发器组合（表单形态）

## 需求分析

### 与两个参考的取舍

| 维度 | Vant | Sard | 本项目建议 | 理由 |
| --- | --- | --- | --- | --- |
| 组件形态 | Radio + RadioGroup 两件 | Radio + Group + Popout + Input 四件 | **四件套**（镜像 checkbox 系） | checkbox 系已验证四件套分层：纯单项 / 组容器 / 弹层形态 / 表单触发器 |
| 值模型 | `v-model` 单值 any | `model-value` 单值 any | **`value: RadioValue \| null`（v-model:value）** | UTS 无 any，收窄 string \| number；null 表未选（radio-input 清空需要） |
| 点击已选项 | 不可取消 | 置 undefined 可取消 | **不可取消**（Vant 语义） | 单选刚性；可清空交给 radio-input 的 clearable |
| readonly | 无 | 有 | **吸收 Sard** | 表单场景必需，与 checkbox 系能力对齐 |
| 图标形态 | shape square/dot | type circle/record | **固定圆环 + 内实心圆点**，不做 shape | 单选语义图标即圆形；方形图标与 checkbox 混淆（Sard 也无 shape） |
| 选中色/尺寸 | checked-color / icon-size | checked-color / size | **checked-color / icon-size 沿用** | 与 checkbox 系 API 命名一致 |
| options 自动渲染 | 无 | Group 有 options | **不做**（options 驱动只在 popup/input） | 与 checkbox-group 对齐，避免 group 职责膨胀 |
| searchable | 无 | Popout 有 | **本期不做** | 与 checkbox-popup 对齐，搜索过滤后续扩展 |
| icon 插槽 | 有（slotProps.checked） | 有 | **保留** | 自定义图标场景（配 cell）真实存在 |

### 可复用资产（结构性复用，代码独立实现）

- `m-checkbox-group/checkbox.uts`：RadioGroupContext 类骨架、valuesEqual 宽松相等、options 字段读取函数——radio 系**独立实现 `radio.uts`**（不 import checkbox.uts，组件族自包含，避免跨族依赖）
- `m-popup`：弹层显隐、遮罩、圆角、安全区（popup 版直接继承）
- `m-input` + 透明触发层 + 自绘清空钮：input 版直接沿用 checkbox-input 的组合模式（含 z-index 层叠方案 1/2/3）
- 主题变量体系：新增 `$m-radio-*` 段，全部 `!default`
- 值相等判定逻辑同构：'1' 与 1 视为同一项（宽松标识语义）

### 能力缺口

- 选中态图标：m-icon 图标库无「圆环+圆点」radio 形态图标，需**自绘 view**（外环 border + 内点，与 password-input 的 mask 圆点自绘先例同构）
- 无公共工具函数需新增到 `utils/`；全部逻辑在组件族内

### 影响面

- 新增 4 个组件目录（`m-radio` + `m-radio-group` + `m-radio-popup` + `m-radio-input`）+ 共享 `radio.uts`
- 主题变量 ~22 项
- 演示页 3 个（radio 10 变体 + radio-popup 5 变体 + radio-input 5 变体）
- 文档 8 份（中英各 4）
- 不触碰既有组件
- 登记落位：`demo-components.uts` 数据录入组**末尾**（现有序 …password-input-popup 结尾，r > p，追加即字母序正确）；文档侧栏 zh.ts / en.ts 同位置三处同序

### 与 checkbox 四件套的结构对照

```
m-checkbox        →  m-radio          单项（组内 inject / 独立使用）
m-checkbox-group  →  m-radio-group    组容器（provide 上下文，单值替代集合）
m-checkbox-popup  →  m-radio-popup    m-popup + 组 + options 驱动
m-checkbox-input  →  m-radio-input    m-input + radio-popup（表单触发器）
checkbox.uts      →  radio.uts        上下文类 + 共享类型 + options 读取
```

## 伪代码设计

### 组件形态

| 组件 | 职责 | 是否持值 | 主要差异 |
| --- | --- | --- | --- |
| `m-radio` | 渲染单项：圆环图标（内点选中显示）+ 文本 | 否（组内由上下文驱动；独立受控 checked） | readonly / disabled / label-position / icon 插槽 |
| `m-radio-group` | 组容器：provide 上下文，单值受控 | **是**（v-model:value） | direction / icon-size / checked-color / disabled / readonly 下发 |
| `m-radio-popup` | m-popup + m-radio-group 组合，options 驱动渲染 | **是**（v-model:value） | 头部标题 + 关闭钮，对齐 checkbox-popup |
| `m-radio-input` | m-input + m-radio-popup 组合触发器 | **是**（v-model:value） | 展示选中项 label 单文本，clearable 清空置 null |

```
packages/core/components/m-radio/
└── m-radio.uvue                    纯单项

packages/core/components/m-radio-group/
├── radio.uts                       上下文类 + 共享类型 + options 读取
└── m-radio-group.uvue              组容器

packages/core/components/m-radio-popup/
└── m-radio-popup.uvue              弹层单选

packages/core/components/m-radio-input/
└── m-radio-input.uvue              表单触发器
```

### 共享类型与上下文（radio.uts）

```uts
/** provide / inject 配对 key */
export const RADIO_KEY: string = '__mxi_radio_group__'

/** 单个选项标识（UTS 无 any，收窄为字符串 / 数字） */
export type RadioValue = string | number

/** 排列方向 / 文本位置 / 字段名映射：与 checkbox.uts 同构 */
export type RadioDirection = 'vertical' | 'horizontal'
export type RadioLabelPosition = 'right' | 'left'
export type RadioFieldNames = { label: string, value: string, disabled: string }

/** 单选组注入上下文：维护选中值与统一视觉规格（无 max / 无集合 toggle） */
export class RadioGroupContext {
	value: Ref<RadioValue | null> = ref<RadioValue | null>(null)
	disabled: Ref<boolean> = ref<boolean>(false)
	readonly: Ref<boolean> = ref<boolean>(false)
	iconSize: Ref<string> = ref<string>('')
	checkedColor: Ref<string> = ref<string>('')
	direction: Ref<RadioDirection> = ref<RadioDirection>('vertical')
	/** 注册的 name 集合（保留：popup 驱动渲染与后续扩展用） */
	names: Array<RadioValue> = reactive<Array<RadioValue>>([])

	/**
	 * 选中 name（已选中 / 禁用 / 只读拦截在调用层；此处只做值收敛）
	 *
	 * @param name 选项标识
	 */
	select(name: RadioValue): void {
		const next: RadioValue | null = name
		this.value.value = next
	}
}
```

### 单项核心逻辑（m-radio）

```uts
/** 是否选中：组内经上下文值比对，独立读受控 checked prop */
const isChecked = computed<boolean>(() => {
	if (inGroup.value && ctx != null && props.name != null) {
		return valuesEqual(ctx.value.value, props.name)   // null 恒 false
	}
	return props.checked
})

/** 是否禁用 / 只读：组内合并组容器 */
const isDisabled = computed<boolean>(() => props.disabled || (inGroup && ctx.disabled))
const isReadonly = computed<boolean>(() => props.readonly || (inGroup && ctx.readonly))

/**
 * 点击切换：禁用 / 只读不响应；已选中不取消（单选刚性）；
 * 组内经 ctx.select 回写，独立派发 change
 */
function doSelect() {
	if (isDisabled.value || isReadonly.value) return
	if (isChecked.value) return                       // 已选中不重复派发
	if (inGroup.value && ctx != null && props.name != null) {
		ctx.select(props.name)
		emit('change', true)
		return
	}
	emit('change', true)                              // 独立受控形态只派发，不持值
}
```

### 选中态图标渲染（自绘，禁走 m-icon）

```html
<!-- 外环：常态灰环；选中变主题色。内点：选中时按比例显示 -->
<view class="m-radio__icon" :style="iconSizeStyle">
	<view class="m-radio__dot" :style="dotStyle"></view>
	<slot name="icon" :checked="isChecked" :disabled="isDisabled"></slot>
</view>
```

```scss
.m-radio__icon {
	width: $m-radio-icon-size;
	height: $m-radio-icon-size;
	border-width: $m-radio-icon-border-width;
	border-color: $m-radio-icon-border-color;
	border-radius: 50%;
	justify-content: center;
	align-items: center;
}
.m-radio__icon--checked {
	border-color: $m-radio-icon-color;
}
.m-radio__dot {
	width: $m-radio-dot-size;        /* 主题变量 10px（icon 20px 的 50%） */
	height: $m-radio-dot-size;
	border-radius: 50%;
	background-color: $m-radio-icon-color;
}
```

- 内点尺寸：icon-size 自定义时按 50% 比例 JS 换算内联（`calc(20px * 0.5)` 在 uvue 数值运算上不可靠，走 computed 字符串拼接）
- 禁用态：整体降透明度（同 checkbox `__icon-wrap--disabled` 方案）

### radio-input 展示文本

```uts
/** 展示文本：按值查 options 取 label；无匹配回退值文本；未选（null）为空串 */
const displayText = computed<string>(() => {
	if (props.value == null) return ''
	const opt = findOption(props.value)
	if (opt != null) return radioOptionLabel(opt, fields.value)
	return radioValueText(props.value)
})

/** 清空：置 null 派发 clear（与 checkbox-input 的空数组语义对应） */
function onClearClick(_: MouseEvent) {
	emit('update:value', null)
	emit('clear')
}
```

### API

#### m-radio Props

| Props | 类型 | 默认 | 说明 | 来源 |
| --- | --- | --- | --- | --- |
| `name` | `RadioValue \| null` | `null` | 标识符（组内必填，独立可空） | Vant/Sard |
| `checked` | `boolean` | `false` | 独立受控选中态（组内忽略，非 v-model） | Vant |
| `disabled` | `boolean` | `false` | 禁用（组内合并容器） | 两家 |
| `readonly` | `boolean` | `false` | 只读（不可切换，视觉正常） | Sard |
| `labelDisabled` | `boolean` | `false` | 禁用文本点击 | Vant |
| `labelPosition` | `'right' \| 'left'` | `'right'` | 文本位置 | Vant |
| `iconSize` | `string \| number` | `''` | 图标尺寸（number 补 px；组内继承） | 两家 |
| `checkedColor` | `string` | `''` | 选中色（组内继承，子项优先） | 两家 |
| `bindGroup` | `boolean` | `true` | 是否绑定组（false 时即使有 name 也独立） | checkbox 系沿用 |
| `customClass / customStyle` | — | `''` | 根节点类名 / 内联样式 | 项目惯例 |

**Events：** `change` `[checked: boolean]`（选中态变化）/ `click` `[event: MouseEvent]`
**Slots：** `default`（文本，插槽参 `{ checked, disabled }`）/ `icon`（自定义图标，插槽参同上）

#### m-radio-group Props

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `RadioValue \| null` | `null` | 当前选中项（v-model:value；null 未选） |
| `disabled` | `boolean` | `false` | 禁用全部 |
| `readonly` | `boolean` | `false` | 只读全部 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向 |
| `iconSize` | `string \| number` | `''` | 统一图标尺寸 |
| `checkedColor` | `string` | `''` | 统一选中色 |
| `customClass / customStyle` | — | `''` | 项目惯例 |

**Events：** `update:value` `[value: RadioValue | null]` / `change` 同参

#### m-radio-popup Props

透传组容器全部规格 props（value / disabled / readonly / direction / iconSize / checkedColor），另加：

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `show` | `boolean` | `false` | 弹层显隐（v-model:show） |
| `options` | `UTSJSONObject[] \| null` | `null` | 选项数组（label / value / disabled + field-names 映射） |
| `title` | `string` | `''` | 弹层标题 |
| `showHeader / closeable / closeIcon` | — | `true / true / 'cross'` | 头部（同 checkbox-popup） |
| `labelPosition` | `'right' \| 'left'` | `'right'` | 文本位置 |
| `fieldNames` | `RadioFieldNames \| null` | `null` | 自定义字段名 |
| `optionsHeight` | `number` | `0` | 选项区高度 px（0 用主题变量） |
| `position / round / closeOnClickOverlay / safeAreaInsetBottom / zIndex / duration` | — | 同 checkbox-popup | 弹层行为透传 m-popup |

**Events：** `update:show` / `update:value` / `change` / `click-item` `[index: number]` / `close`

#### m-radio-input Props

透传 radio-popup 全部（除 show），另加：

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `RadioValue \| null` | `null` | 当前选中项（v-model:value） |
| `placeholder` | `string` | `'请选择'` | 占位符 |
| `clearable` | `boolean` | `true` | 清空按钮（有值且非 disabled 时可见） |
| `border / inlaid` | `boolean` | `true / false` | 透传 m-input |

**Events：** `update:value` / `change` / `click-item` / `clear`

### 主题变量（`$m-radio-*`，预估 22 项）

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `$m-radio-padding` | `10px 16px` | 单项内边距 |
| `$m-radio-icon-size` | `20px` | 图标外环尺寸 |
| `$m-radio-icon-border-width` | `1px` | 外环线宽 |
| `$m-radio-icon-border-color` | `$m-text-color-fourth` | 未选外环色 |
| `$m-radio-icon-color` | `$m-color-primary` | 选中外环 + 内点色 |
| `$m-radio-dot-size` | `10px` | 内点尺寸（icon 的 50%） |
| `$m-radio-label-gap` | `8px` | 图标与文本间距 |
| `$m-radio-label-font-size` | `14px` | 文本字号 |
| `$m-radio-label-line-height` | `20px` | 文本行高 |
| `$m-radio-label-color` | `$m-text-color` | 文本色 |
| `$m-radio-label-disabled-color` | `$m-text-color-fourth` | 文本禁用色 |
| `$m-radio-disabled-opacity` | `$m-disabled-opacity` | 禁用透明度 |
| `$m-radio-popup-background` | `$m-white` | 弹层底色 |
| `$m-radio-popup-header-padding` | `14px 16px` | 头部内边距 |
| `$m-radio-popup-title-font-size` | `16px` | 标题字号 |
| `$m-radio-popup-title-color` | `$m-text-color` | 标题色 |
| `$m-radio-popup-close-icon-size` | `18px` | 关闭图标尺寸 |
| `$m-radio-popup-close-icon-color` | `$m-text-color-fourth` | 关闭图标色 |
| `$m-radio-popup-options-height` | `278px` | 选项区高度 |
| `$m-radio-input-trigger-z-index` | `1` | 触发层层级 |
| `$m-radio-input-clear-z-index` | `2` | 清空钮层级 |
| `$m-radio-input-clear-width` | `40px` | 清空钮定宽 |
| `$m-radio-input-clear-icon-size` | `16px` | 清空图标尺寸 |
| `$m-radio-input-clear-color` | `$m-text-color-fourth` | 清空图标色 |

### 约束与边界

| 约束 | 说明 |
| --- | --- |
| **禁用联合类型 props** | `iconSize: string \| number` 是 checkbox 系已验证可用形态；除此之外不加新联合类型 |
| **可空一律 null** | `value: RadioValue \| null`，不引入 undefined |
| **值宽松相等** | '1' 与 1 视为同一项（checkbox.uts 已验证的字符串化比对，radio.uts 内独立实现） |
| **自绘图标** | 圆环 + 内点用 view + border-radius 50%，禁 `<text>` 字符模拟（跨端字体渲染不一致） |
| **扁平类** | 变体类 `m-radio--label-left / --disabled`、`m-radio__icon--checked` 等全部扁平书写 |
| **hairline 不涉及** | 外环 1px 常规边框（圆环非 hairline 场景，无需 scale 0.5 方案） |
| **theme/vars.scss** | style 顶层无条件 `@import '../../theme/vars.scss'`，全部 `!default` |

### 验证矩阵

| 场景 | 操作 | 预期 |
| --- | --- | --- |
| 基础单选 | 组内点选第二项 | 第一项圆点消失，第二项出现，value 更新 |
| 已选再点 | 点击当前选中项 | 值不变、change 不派发（单选刚性） |
| 横向排列 | direction="horizontal" | 单项横向排布且换行 |
| 禁用组 | 组设 disabled | 全部灰显，点击不变更 |
| 禁用单项 | 单项设 disabled | 仅该项不可点，其余正常 |
| 只读 | 设 readonly | 视觉正常但不可切换 |
| 禁用文本 | label-disabled | 点图标可切换，点文本不响应 |
| 文本位置 | label-position="left" | 文本在左、图标在右，间距正确 |
| 自定义尺寸/颜色 | icon-size=24 + checked-color | 外环与内点同步缩放、变色 |
| icon 插槽 | 传自定义图标 | 替换内置圆环，插槽参 checked 正确 |
| 独立受控 | name 缺省 + checked 翻转 | 图标态跟随，change 派发 |
| popup 基础 | 打开弹层 | 头部 + options 列表渲染，选中态回显 |
| popup 选项禁用 | options 含 disabled 项 | 该项不可点，其余正常 |
| popup 点选 | 选一项 | value 回写，弹层**不自动关闭**（单选即选即定，关闭走头部/遮罩，见 Q6） |
| input 展示 | 选中后查看触发器 | 显示 label 文本 |
| input 清空 | 点清空钮 | value 置 null，文本回占位符 |
| input 无匹配 | value 不在 options | 回退显示值文本 |

## 疑问清单

> 每条已给推荐答案，回复「按推荐执行」即可全部定案。

### Q1 组件命名：radio-popup 还是 radio-popout？（影响：目录名、文档标题、登记条目）

**推荐：`m-radio-popup`**。理由：Sard 叫 radio-popout，但本项目已有 `m-checkbox-popup / m-cascader-popup / m-picker-popup / m-calendar-popup` 全系 `-popup` 先例，命名一致性优先于对标库。

答： `m-radio-popup`。

### Q2 值模型：null 表未选？（影响：全部 API 与清空语义）

**推荐：`value: RadioValue | null`（v-model:value），null = 未选**。理由：radio 单值无法像 checkbox 用空数组表达「未选」；radio-input 的 clearable 必须有可清空语义（Sard 用 undefined，UTS 用 null）；可空 prop 的 TS2769 warning 是已验证的编译器噪音，原生端不受影响（LESSONS #24）。

答：`value: RadioValue | null`（v-model:value），null = 未选。

### Q3 点击已选中项是否可取消？（影响：交互语义）

**推荐：不可取消（Vant 语义）**。理由：单选刚性是 radio 的默认心智；需要「清空」场景走 radio-input 的 clearable。Sard 的点选置 undefined 属少数派。

答：不可取消。

### Q4 readonly 是否支持？（影响：API 范围）

**推荐：支持**。子项与组容器均设 readonly（组内合并），只读视觉正常但不可切换。与 checkbox 系能力对齐（checkbox 系当年吸收了 Sard 的 disabled，readonly 是同类表单场景需求）。

答：支持。

### Q5 选中态图标实现方式？（影响：视觉与跨端一致性）

**推荐：自绘 view（外环 border + 内实心圆点）**。理由：m-icon 图标库无 radio 点选形态图标；view + border-radius 50% 跨端渲染一致（password-input mask 圆点同构先例）；保留 icon 插槽供自定义（插槽参 `{ checked, disabled }`）。

答：自绘 view（外环 border + 内实心圆点）。

### Q6 radio-popup 点选后是否自动关闭？（影响：弹层交互）

**推荐：不自动关闭**。理由：checkbox-popup 点选不关（多选持续勾选），radio 单选虽「即选即定」，但保留弹层让用户核对后经头部关闭钮 / 遮罩关闭更稳；若自动关闭则与 `update:show` 的受控模型冲突（外部 show 为 true 时内部无法单方面关）。Vant 无此组件，Sard popout 点选后也不自动关（需点确定/遮罩）。

答：不自动关闭。

### Q7 独立使用形态：受控 checked prop 还是自持 v-model？（影响：m-radio API）

**推荐：受控 `checked` prop（非 v-model）+ change 派发**。理由：Vant 的 Radio 独立使用即受控 checked（搭配 cell 场景外部控制）；checkbox 自持 v-model 是因为「勾选/不勾选」本身就是值，radio 独立使用无「值」可言（组才有值），自持布尔反而误导。

答：受控 `checked` prop（非 v-model）+ change 派发。

### Q8 radio-popup 是否需要 searchable 搜索过滤？（影响：API 范围与组件复杂度）

**推荐：本期不做**。理由：checkbox-popup 未做，选项驱动的搜索过滤属独立能力，后续如需可统一给 popup 系补（依赖 m-input 搜索框 + 过滤逻辑），避免本次范围膨胀。

答：本期不做。

### Q9 shape（Vant 的 square/dot 图标形状）是否提供？（影响：视觉变体）

**推荐：不提供**。理由：radio 选中图标即「圆环+圆点」，方形图标与 checkbox 语义混淆；Sard 也无 shape。真需要方形场景用户应使用 checkbox。

答：提供。

**【实施决策回填 2026-11-17】** 用户定案提供 shape。经 Vant radio/index.less 源码核实：Vant 的 `dot` 形态即「圆环+内实心圆点」——与本文档既定的默认视觉完全一致；Vant 默认 `round` 为「实心圆+白勾」（checkbox 式，与本项目 checkbox 视觉冲突）。据此实施为 **`shape: 'round' | 'square'`，默认 `'round'`**：
- `round`：圆环 + 内圆点（本文档既定默认形态）
- `square`：方形边框 + 内圆点（保留点选心智，不引入 Vant 的白勾以免与 checkbox 混淆）
- Vant 的 `dot` 值与本项目默认 round 视觉相同，属冗余 API，不引入
- 组容器 shape 下发子项（同 checkbox-group 模式），radio.uts 增加 `RadioShape = 'round' | 'square'`

## 实施记录（2026-11-17）

Q1-Q8 按推荐执行，Q9 按上述实施决策落码。产出：

- 组件源：`m-radio-group/radio.uts`（上下文类 + 共享类型 + options 读取）+ `m-radio` / `m-radio-group` / `m-radio-popup` / `m-radio-input` 四个 SFC
- 主题变量：`$m-radio-*` 段 27 项（vars.scss 末尾追加，全 `!default`）
- 演示页：`pages-sub/radio`（9 卡片）+ `pages-sub/radio-popup`（6 卡片 + 只读弹层）+ `pages-sub/radio-input`（5 卡片），demo-components.uts 数据录入组末尾登记（r > p 字母序）
- 文档：zh / en 各 4 份 + 侧栏三处同序 + changelog 0.7.0

**DoD 验证结果：**

- [x] 编译通过：`cli launch web` 启动成功，vite dev server 监听 5174
- [x] 页面实测：radio / radio-popup / radio-input 三页浏览器全变体走查（点选切换、禁用/只读拒绝、square 形状、icon-size/checked-color 缩放变色、popup 点选不自动关、clearable 清空置 null、disabled 不渲染触发层），全部符合验证矩阵
- [x] 运行日志：change 事件回传值正确（`radio 基础 change: b` / `radio-popup 基础弹层 change: line-2` / number 值回显 440100）
- [x] 无运行时错误：三页控制台均无 error 级消息
- [x] `pnpm sync:uni-modules:check` 一致性通过
- [x] `pnpm build:docs` 构建与死链检查通过

无新增 LESSONS（本轮一次编译通过，无运行时踩坑；`Ref<RadioValue | null>` 可空联合 ref 实测合法，与 LESSONS #24 的 TS2769 噪音结论一致）。

### 二轮修复（2026-11-17 用户验收反馈）

用户截图指出两处不合理，均已修复并视觉复验：

1. **禁用态与可选态无差异**：未选外环本为浅灰，原「0.5 透明度」方案叠加后不可见；弹层选项文字色为显式设置，label 禁用色也失效。改为 Vant 同款显式方案：禁用未选 = 外环灰底填充（`$m-radio-icon-disabled-background: #ebedf0`）、禁用选中 = 环点退灰（`$m-radio-icon-disabled-color`，checkedColor 覆盖在禁用态不生效）；`m-radio-popup` 选项文字新增 `--disabled` 变体类。弃用 `$m-radio-disabled-opacity`（文档/changelog 同步更新）。
2. **自定义图标未选态空框**：演示页 `·` 为白字白底不可见 + `.custom-icon` 缺 `border-style: solid`（ucss 默认 none 边框不渲染）。修复演示样式（未选灰字灰框、选中白字绿底），另修演示数据 `disabledValue` 预置 `'c'` 验证禁用选中灰点。

**经验**：ucss 中 `border-width` 必须伴随显式 `border-style: solid` 才渲染（默认 none）；禁用态视觉不要依赖透明度叠加在浅色描边元素上，用显式灰底填充。
