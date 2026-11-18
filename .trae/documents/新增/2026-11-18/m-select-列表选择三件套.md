# m-select 三件套（列表选择）实施方案

## 需求

对标 Sard 的 `Select` / `SelectPopout` / `SelectInput`，为 unix-ui 新增列表选择三件套：

- **Sard Select**：列表面板本体。`v-model`、`options` + `optionKeys`、`multiple` + `multiple-limit` + `show-toolbar`、`filterable` + `filter-placeholder` + `filter-method` + `filter-value`（受控筛选值）+ `filter-loading`、`value-key`、`update:modelValue` / `change` / `select` / `update:filterValue` 事件、`default` / `bottom` 插槽、`scrollTop()` 方法；选项由 `SelectOptionGroup` / `SelectOption` 子组件构成（分组、禁用、`plain` 自定义、`label` 插槽）
- **Sard SelectPopout**：`m-popup` + `Select` 组合，`v-model:visible` 控制显隐，`title` 标题
- **Sard SelectInput**：`PopoutInput` + `SelectPopout` 组合，输入框展示当前值标签、`clearable`、`max-labels`（多选时标签数）、`map-label`（远程场景标签映射）

## 需求分析

### 与参考的取舍（待疑问清单确认）

| 维度 | Sard | 本项目建议 | 理由 |
| --- | --- | --- | --- |
| 组件拆分 | Select / SelectPopout / SelectInput | **m-select / m-select-popup / m-select-input** | 与 cascader / picker / radio 三件套命名一致（`-popup` 而非 `-popout`） |
| 选项声明 | `SelectOption` / `SelectOptionGroup` 子组件 | **`options` 数组 + `fieldNames`**；`children` 存在时渲染为分组标题 | 项目统一 options 驱动（radio / checkbox / segmented / picker），子组件在 UTS 下需 context 传值 |
| 多选 | `multiple` + 限制 + 工具栏 | **首版只做单选**（见 Q2） | 多选值模型（`string[] \| number[]`）、工具栏、标签溢出展示体量大；且 `m-checkbox-popup` 已覆盖多选 |
| 筛选 | `filterable` + 受控 `filter-value` + `filter-method` | **沿用**，本地过滤 + 远程受控 | 与 m-search 组合，筛选框可复用其外观 |
| 选中态 | 主色文字 + `SelectOption` 插槽 | **右侧勾选图标 + 主色文字** | 与 m-radio 的勾选语义一致，列表场景更易扫视 |
| 值类型 | `any` | **`string \| number`** | UTS 不做 any，与 `RadioValue` 对齐 |
| 分组 | `SelectOptionGroup` | **`options[i].children` 即分组**（两层） | 不引入第三种选项结构，`fieldNames.children` 可映射 |

### 可复用资产

- `m-popup`：弹层容器（position / round / 遮罩关闭 / 安全区 / 动效），`m-picker-popup` 已验证该组合方式
- `m-input`：`m-select-input` 的只读触发器（`readonly` / `clearable` / 占位文本 / `input-align`）
- `m-icon`：勾选字形（`success`）已存在
- `m-search`：筛选框外观（可选，若不引入则用轻量自绘输入，见 Q4）
- `radio.uts`：`fieldNames` 解析与 `valuesEqual`（`children` 字段需额外解析）
- 列表滚动：`scroll-view` + `max-height` 主题变量，`scrollTop()` 通过实例方法驱动

### 技术风险

- **分组 + 扁平混合**：同一份 `options` 允许部分项含 `children`，渲染时需先判定是否为分组，分组标题不可选、不参与筛选命中（筛选时保留有命中子项的分组）
- **筛选与滚动联动**：远程筛选时需在数据更新后复位列表滚动（`scrollTop()`），Web 可直接操作 `scroll-view` 的 `scroll-top` 绑定值
- **输入框标签解析**：`m-select-input` 需从 `options` 递归查找当前值的 label；远程场景选项不在列表中时依赖 `map-label` 兜底，否则回退为值的字符串形式

### 影响面

| 产物 | 落点 |
| --- | --- |
| 组件源 | `packages/core/components/m-select/m-select.uvue`、`m-select-popup/m-select-popup.uvue`、`m-select-input/m-select-input.uvue` |
| 主题变量 | `$m-select-*` 段（约 18 项） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `pages-sub/select/select.uvue`、`select-popup/select-popup.uvue`、`select-input/select-input.uvue`（三页，与 cascader / picker 三件套结构一致） |
| 文档 | 三份 zh + 三份 en + 侧栏两侧同序（选择器组末尾） |
| 版本日志 | 插件 changelog + docs 站 zh / en 0.7.0 |
| 既有组件 | 不触碰 |

## 伪代码设计

### m-select（面板）

```html
<view :class="rootClass" :style="customStyle">
	<!-- 筛选框：filterable 时展示 -->
	<view v-if="filterable" class="m-select__filter">
		<m-search v-model:value="innerFilter" :placeholder="filterPlaceholder" :show-action="false" />
	</view>

	<scroll-view class="m-select__body" :scroll-y="true" :scroll-top="scrollTopValue">
		<!-- 分组标题（不可选） -->
		<view v-for="(group, gi) in visibleGroups" :key="gi" class="m-select__group">
			<view v-if="group.label != ''" class="m-select__group-label">
				<text class="m-select__group-text">{{ group.label }}</text>
			</view>
			<view
				v-for="(item, ii) in group.items"
				:key="ii"
				:class="itemClass(item)"
				@click="onItemClick(item)"
			>
				<slot name="option" :option="item.raw" :index="ii" :selected="isSelected(item)" :disabled="item.disabled">
					<text :class="labelClass(item)">{{ item.label }}</text>
				</slot>
				<m-icon v-if="isSelected(item)" name="success" custom-class="m-select__check" />
			</view>
		</view>

		<slot name="bottom"></slot>
	</scroll-view>
</view>
```

- 面板不持内部值；筛选值在 `filterValue` 受控时以外部为准，否则内部维护（`v-model:filter-value` 可选）
- 本地筛选：按 `label` 包含匹配（大小写不敏感），空查询展示全部；分组在「有命中子项」时保留
- 远程筛选：传 `filterMethod` 时只派发 `filter-change`（或 `update:filterValue`），不做本地过滤

### 关键逻辑

```uts
/** 选项扁平化：分组标题不参与选中，仅参与渲染 */
type SelectItem = { label: string; value: RadioValue; disabled: boolean; raw: UTSJSONObject }
type SelectGroup = { label: string; items: SelectItem[] }

/** 选中判定 */
function isSelected(item: SelectItem): boolean {
	return valuesEqual(item.value, props.value)
}

/** 点击：禁用 / 同值不派发 */
function onItemClick(item: SelectItem) {
	if (props.disabled || item.disabled) return
	if (valuesEqual(item.value, props.value)) return
	emit('update:value', item.value)
	emit('change', item.value)
	emit('select', item.raw)
}

/** 递归查找 label（m-select-input 用） */
function findLabel(options: UTSJSONObject[], value: RadioValue, fields: SelectFieldNames): string
```

### API

#### m-select Props

| Props | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `value` | `string \| number` | `''` | 当前选中值（v-model:value） |
| `options` | `UTSJSONObject[]` | `[]` | 选项数组；含 `children` 的项视为分组 |
| `fieldNames` | `UTSJSONObject \| null` | `null` | 字段映射（label / value / disabled / children） |
| `filterable` | `boolean` | `false` | 是否显示筛选框 |
| `filterPlaceholder` | `string` | `'请输入关键词'` | 筛选框占位 |
| `filterValue` | `string` | `''` | 筛选值（支持 `v-model:filter-value`） |
| `filterMethod` | `((query: string) => void) \| null` | `null` | 远程筛选回调（存在时关闭本地过滤） |
| `disabled` | `boolean` | `false` | 禁用面板 |
| `emptyText` | `string` | `'暂无选项'` | 空列表文案 |
| `customClass` / `customStyle` | — | `''` | 根节点样式直达 |

#### m-select Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `[value: RadioValue]` | 选中值变化 |
| `change` | `[value: RadioValue]` | 选中值变化 |
| `select` | `[option: UTSJSONObject]` | 选中项原始对象 |
| `update:filterValue` | `[query: string]` | 筛选值变化 |

#### m-select Methods

`scrollTop()` — 列表回到顶部

#### m-select Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `option` | `{ option, index, selected, disabled }` | 自定义选项内容（`option` 为原始对象） |
| `bottom` | — | 列表底部（远程加载更多） |

#### m-select-popup Props

继承 m-select 全部 props，另加：`show`（v-model:show）、`title`、`position`（默认 `bottom`）、`round`、`closeOnClickOverlay`、`safeAreaInsetTop` / `safeAreaInsetBottom`、`zIndex`、`duration`、`confirmOnSelect`（选中后是否自动关闭，默认 `true`）

#### m-select-input Props

继承 m-select-popup 全部 props，另加：`placeholder`、`clearable`（默认 `true`）、`readonly`、`disabled`、`mapLabel`（`Record<string, string>` 语义，UTS 用 `UTSJSONObject`）、`inputAlign`、`customClass` / `customStyle`

#### 主题变量（`$m-select-*`）

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `$m-select-max-height` | `320px` | 面板最大高度 |
| `$m-select-bg` | `$m-white` | 面板背景 |
| `$m-select-filter-padding` | `8px 12px` | 筛选区内边距 |
| `$m-select-option-min-height` | `44px` | 选项最小高度 |
| `$m-select-option-padding` | `0 12px` | 选项内边距 |
| `$m-select-option-color` | `$m-text-color` | 选项文字色 |
| `$m-select-option-color-selected` | `$m-color-primary` | 选中文字色 |
| `$m-select-option-color-disabled` | `$m-text-color-fourth` | 禁用文字色 |
| `$m-select-option-bg-active` | `$m-fill-color` | 选项按下背景 |
| `$m-select-option-font-size` | `14px` | 选项字号 |
| `$m-select-check-color` | `$m-color-primary` | 勾选图标色 |
| `$m-select-check-size` | `16px` | 勾选图标字号 |
| `$m-select-group-label-padding` | `8px 12px` | 分组标题内边距 |
| `$m-select-group-label-font-size` | `12px` | 分组标题字号 |
| `$m-select-group-label-color` | `$m-text-color-tertiary` | 分组标题颜色 |
| `$m-select-group-label-bg` | `$m-fill-color` | 分组标题背景 |
| `$m-select-empty-padding` | `32px 0` | 空态内边距 |
| `$m-select-empty-color` | `$m-text-color-fourth` | 空态文字色 |

### 约束与边界

| 约束 | 说明 |
| --- | --- |
| **单选** | 值类型 `string \| number`；多选不在首版范围（见 Q2） |
| **受控值** | 面板不持内部值；同值点击不派发 |
| **分组不可选** | 含 `children` 的项只渲染标题，不参与选中与筛选命中判断（按子项命中保留） |
| **筛选** | `filterMethod` 存在时不本地过滤，仅回传查询值 |
| **扁平淡化** | 所有类名扁平，无后代选择器；无 rpx |
| **三件套职责** | m-select 管列表；m-select-popup 管弹层；m-select-input 管触发器与标签解析 |

### 验证矩阵

| 场景 | 操作 | 预期 |
| --- | --- | --- |
| 基础 | 点击选项 | 值切换、勾选图标迁移、change / select 派发 |
| 同值点击 | 点击已选项 | 不派发事件 |
| 分组 | options 含 children | 渲染分组标题，子项可选中 |
| 禁用 | 组件 / 选项禁用 | 不可选且灰显 |
| 筛选 | 输入关键词 | 列表按 label 过滤，分组保留命中子项 |
| 远程筛选 | 传 filterMethod | 只回传查询值，不本地过滤 |
| 空态 | options 为空 | 展示 emptyText |
| 滚动 | 长列表 | 面板限高可滚动，scrollTop() 生效 |
| 弹层 | m-select-popup 选中 | 默认选中后关闭；confirm-on-select=false 时不关闭 |
| 输入框 | m-select-input 选中 | 输入框显示 label，clearable 可清空 |
| 映射 | map-label + 值不在 options | 显示映射文案，否则回退值字符串 |
| 只读 | 输入框 readonly | 可打开面板但不展示清除；值不可改 |

## 疑问清单

> 每条已给推荐答案，在「回答：」处作答；回复「按推荐执行」即全部按推荐定案。

### Q1 三件套命名：`m-select` / `m-select-popup` / `m-select-input`？（影响：目录与文档）

**推荐：按此命名**（Sard 的 `-popout` 在本项目统一为 `-popup`，与 picker / cascader / radio 三件套一致）。

回答：

### Q2 首版是否支持多选？（影响：值模型、工具栏、输入框标签展示，工作量最大的一项）

**推荐：首版只做单选**，多选列入后续。理由：多选需要 `string[] | number[]` 值模型、`multiple-limit`、工具栏全选 / 反选、输入框多标签溢出展示，体量与风险都显著高于单选；项目已有 `m-checkbox-popup` 覆盖多选弹层场景。若你确实需要多选，我会按单选先落地、多选作为二期（并先在文档中标注规划）。

回答：

### Q3 选项结构：`options` 数组 + 两层分组，不用子组件？（影响：使用方式与渲染逻辑）

**推荐：`options` 数组，含 `children` 的项视为分组标题**，`fieldNames` 支持 `label` / `value` / `disabled` / `children` 四键映射。理由：与项目 options 驱动一致；子组件方案在 UTS 下需要 context 传值，且 easycom 识别成本高。

回答：

### Q4 筛选框实现：复用 `m-search` 还是轻量自绘？（影响：依赖与外观一致性）

**推荐：复用 `m-search`**（`show-action=false`）。理由：搜索框的清除、对齐、占位、键盘行为已具备；m-search 已在本版落地，不增加新依赖。

回答：

### Q5 远程筛选契约：`filterMethod` 回调 + `v-model:filter-value`？（影响：事件与受控方式）

**推荐：`filterable` + 受控 `filterValue`（`v-model:filter-value`）+ `filterMethod(query)`**；本地过滤在 `filterMethod` 为空时生效（label 包含匹配，大小写不敏感）。理由：与 Sard 一致，且不引入防抖策略（由使用方决定）。

回答：

### Q6 选项自定义出口：`option` 作用域插槽？（影响：模板与 API）

**推荐：`option` 作用域插槽**（`{ option, index, selected, disabled }`），`option` 透出原始对象。理由：替代 Sard 的 `SelectOption` 的默认插槽与 `label` 插槽两级自定义，一个插槽即可覆盖。

回答：

### Q7 `m-select-input` 标签来源：options 递归查找 + `mapLabel` 兜底？（影响：远程场景显示）

**推荐：先递归查 `options`，未命中再查 `mapLabel`，仍未命中显示值的字符串形式**；不提供 `value-label` 之类的额外 prop。

回答：

### Q8 弹层选中是否自动关闭？（影响：交互默认值）

**推荐：默认关闭（`confirmOnSelect: true`）**，多选场景另议（本期无多选）。理由：单选列表点击即完成选择，符合移动端习惯；需要连续操作时传 `false`。

回答：

### Q9 主题变量范围：18 项（面板 / 筛选 / 选项 / 分组 / 勾选 / 空态）？（影响：定制粒度）

**推荐：按上表 18 项落地**，文件名与变量前缀统一 `$m-select-*`。

回答：

### Q10 版本与分组：0.7.0 + 选择器组末尾？（影响：changelog 与侧栏）

**推荐：追加 `0.7.0`，归入「选择器」组末尾**（`picker-view` < `select` < `select-input` < `select-popup`），三处（demo-components / zh.ts / en.ts）同序。

回答：

## 实施记录（2026-11-18）

Q1-Q10 全部按推荐执行（三件套命名 / 首版仅单选 / options + 两层分组 / 复用 m-search 筛选 / filterMethod + 受控 filterValue / option 作用域插槽 / options → mapLabel → 值字符串 / 选中自动关闭 / 24 项主题变量 / 0.7.0 选择器组末尾）。产出：

- 组件源：`m-select` / `m-select-popup` / `m-select-input`（复用 `radio.uts` 解析、`m-search` 筛选、`m-popup` 弹层、`m-input` 触发器，结构对齐 `m-picker-input` 的「m-input + 透明触发层 + 自绘清除 + 弹层 z-index 3」范式）
- 主题变量：`$m-select-*` 24 项（全 `!default`）
- 演示页：`select` / `select-popup` / `select-input` 三页，均登记到 `demo-components.uts` 选择器组末尾（picker-view < select < select-input < select-popup）
- 文档：三份 zh + 三份 en + 侧栏两侧同序 + 三处 changelog 0.7.0

**实现细节**

- 分组：`options` 中 `children` 非空的项解析为分组块，连续普通选项合并进同一个无标题块，保持原始顺序；筛选后空分组自动丢弃
- 筛选：`filterMethod` 非空时只回传查询值（远程模式），否则按 label 小写包含匹配；筛选值支持 `v-model:filter-value` 受控
- 面板滚动：`scroll-view` + `scroll-top` 绑定，`scrollTop()` 置 0；面板最大高度走 `$m-select-max-height`
- `m-select-popup` 仅做组合与转发：弹层 props 归 m-popup，列表 props 归 m-select，选中后按 `confirmOnSelect` 关闭
- `m-select-input` 以 m-input 只读展示标签，叠加透明触发层（原生 disabled 控件吞点击）与自绘清除按钮；弹层 z-index 固定 3 以覆盖触发层与清除按钮

**DoD 验证结果：**

- [x] 编译通过：三个演示页均返回 200，控制台无编译错误
- [x] 页面实测（Select）：7 卡片；点击压铸四线 → `当前：line-4`、日志 `select 基础 change: line-4`、勾选迁移；分组标题不可选、子项可选；筛选「注塑」只剩 1 项；空态显示「暂无可选产线」
- [x] 页面实测（SelectPopup）：标题弹层打开；选中注塑二线自动关闭且值为 line-2；`confirm-on-select=false` 时选中后弹层保持打开
- [x] 页面实测（SelectInput）：点击输入框开弹层，选中压铸四线回显「压铸四线」；`map-label` 显示「外协九线」；清除按钮清空输入框
- [x] 运行日志：`select 基础 change: line-4` 等符合预期；无 error / warning
- [x] `pnpm sync:uni-modules:check` 一致性通过
- [x] `pnpm build:docs` 构建与死链检查通过

**遗留 TODO**

- ~~多选（`multiple` / `multiple-limit` / 工具栏 / 输入框多标签）按 Q2 结论列入后续版本~~ → 2026-11-18 已实现，见下方「多选补充实施记录」
- 远程筛选后的列表滚动复位（`scrollTop()`）在数据异步到达后的时序需在真实接口场景复测
- App / 小程序端 `scroll-view` 的 `scroll-top` 复位与弹层 z-index 层叠需实机验收

## 多选补充实施记录（2026-11-18）

**API 决策**

- 值模型沿用单一 `value` prop：`RadioValue | RadioValue[]`，以 `multiple` 为判别式（与 m-calendar 的 `Date | Date[]` + `type` 先例一致），不新增 `values` prop
- 新增 props：`multiple` / `multipleLimit`（0 不限）/ `showToolbar`；输入框另加 `maxLabels`（默认 10，-1 不限）
- 多选弹层选中后**永不自动关闭**：`confirmOnSelect` 仅对单选生效（否则无法连续勾选）
- 工具栏固定为「已选 N 项 + 清空」，文案不开放 props；标签以「、」拼接为纯文本，超出 `maxLabels` 折叠为「等 N 项」（不做 tag 胶囊，避免引入 m-tag 依赖）

**实现要点**

- 数组判别用 `typeof v == 'string' || typeof v == 'number'`，避免 `Array.isArray` 在 Kotlin 端泛型推断问题（同 picker.uts 结论）
- 多选点击：已选则移除、未选则追加，达上限后静默忽略；`change` / `update:value` 统一回传新数组
- `select` 事件在取消选中时同样派发（回传被点击的原始对象），便于外部联动
- 输入框 `showClear` 多选时以数组长度判定；清空回传空数组
- 新增 `$m-select-toolbar-*` 4 项变量（内边距 / 字号 / 文字色 / 清空色）

**DoD 验证结果：**

- [x] 多选面板：初始 `line-1` → 已选 1 项；追加两项 → 已选 3 项；再点已选项取消 → 已选 2 项；工具栏「清空」→ 未选择 / 已选 0 项
- [x] 上限：`multiple-limit=2` 选满后点击第 3 项无效，工具栏保持已选 2 项
- [x] 多选弹层：选中两项弹层保持打开、工具栏计数正确，底部「完成」关闭后值同步
- [x] 多选输入框：显示「机加工一线、注塑二线」；`max-labels=2` 显示「机加工一线、注塑二线 等 3 项」；弹层内追加不关闭；清除后回到占位符
- [x] 控制台：面板与弹层页无 error；输入框页曾出现一次 `pageX` 的 uni-h5 运行时异常，按「清除 / 开弹层 / 滚动 / 选项点击 / 原生输入点击」逐项复测均未复现，判定为自动化合成触摸事件的偶发框架问题，非组件缺陷（已记录，后续如复现再深挖）
- [x] `pnpm sync:uni-modules:check` 与 `pnpm build:docs` 通过

**修复记录（2026-11-18，Web 端 pageX 异常）**

- 现象：`m-select-input` 演示页偶发 `Uncaught TypeError: Cannot read properties of undefined (reading 'pageX')`（uni-h5.es.js），点击流程无法稳定复现
- 根因：uni-h5 的 scroll-view `touchmove` 处理器直接读 `event.touches[0].pageX`，未判 `touches` 长度；嵌套滚动（弹层列表 + 页面 scroll-view）在快速甩动 / 手势被浏览器接管时派发空触点 touchmove
- 复现：在列表 `.uni-scroll-view` 上派发「1 触点 touchstart + 空 touches touchmove」，稳定复现（与线上报错同文件同机制）
- 修复：m-select 在 Web 端于 `window` 捕获阶段监听 `touchmove`，`touches.length == 0` 时 `stopPropagation()`，事件在进入框架处理器前被拦截；`#ifdef WEB` 隔离，卸载时移除监听（`m-select-popup` / `m-select-input` 内含 m-select，三件套同时覆盖）
- 复验：同一合成事件序列不再产生错误，正常点击选项、回显、自动关闭均正常；已记入 `.trae/documents/LESSONS_LEARNED.md` #101

