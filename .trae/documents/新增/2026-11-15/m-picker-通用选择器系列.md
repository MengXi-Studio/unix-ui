# m-picker 通用选择器系列 实施方案

## 需求

- 用户提供五个参考链接（原话）：
  - `https://vant-ui.github.io/vant/#/zh-CN/picker`
  - `https://sard.wzt.zone/components/picker`
  - `https://sard.wzt.zone/components/picker-input`
  - `https://sard.wzt.zone/components/picker-popout`
  - `https://sard.wzt.zone/components/picker-view`
- 推断意图：新增通用滚轮选择器系列（对标 Vant Picker + Sard Picker / PickerInput / PickerPopout / PickerView），按项目「面板 / 弹出框 / 输入框」三件套惯例拆分，并评估是否单独提供 PickerView 纯视图组件。
- 本文档只做需求分析与伪代码设计，疑问清单确认后才落码。

## 需求分析

### 三个来源的契约对照

| 维度 | Vant Picker | Sard Picker | Sard PickerView |
| --- | --- | --- | --- |
| 列数据 | `columns: PickerOption[] \| PickerOption[][]`（含 `children` 级联） | `columns: T[] \| T[][]` + `option-keys {label,value,children}` | 无数据 props，靠 `PickerViewColumn` 子组件 + 默认插槽 |
| 值绑定 | 事件回传 `selectedValues` / `selectedOptions` / `selectedIndexes` | `model-value: any`（单列标量 / 多列数组） | `value: number[]`（索引数组） |
| 工具栏 | `title` / `cancel-button-text` / `confirm-button-text` / `show-toolbar` | 由 `PickerPopout` 的 FormPopout 提供 | 无 |
| 状态 | `loading` / `readonly` | 无 loading / readonly（需确认） | 无 |
| 尺寸 | `option-height` / `visible-option-num` / `swipe-duration` | 由 PickerView 变量控制 | `indicator-style` / `mask-style` / 高度 |
| 插槽 | `toolbar` / `title` / `cancel` / `confirm` / `option` / `columns-top` / `columns-bottom` | `option {option, rowIndex, columnIndex}` | `default` + 每列 `default` |
| 事件 | `change` / `confirm` / `cancel` | `update:modelValue` / `change` / `confirm` | `update:value` / `change` |

### 现有可复用资产

| 资产 | 能力 | 复用方式 |
| --- | --- | --- |
| `m-date-picker-column.uvue` | 通用文本滚轮列：`options {text, value}`、下标、吸附、透明度渐隐、readonly | 直接复用；通用 Picker 把任意选项值映射为「列内序号字符串」，回传时按序号从原始数据取值 |
| `m-date-picker` / `m-time-picker` | 顶部栏、选中框、加载遮罩、option 插槽 | 结构与样式参考，不直接组合（列类型固定） |
| `m-date-picker-popup` / `-input`、`m-time-picker-popup` / `-input` | 弹层与输入框组合、透明触发层、自绘清空 | 结构沿用 |
| `m-cascader` 三件套 | 级联选择（层级面板形态） | 与本系列「滚轮级联」形态不同，需明确边界，避免功能重复 |

### 影响面（预估）

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-picker/`（面板 + 共享类型/列构建）、`m-picker-popup/`、`m-picker-input/`；若含纯视图则另有 `m-picker-view/` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-picker-*`（`!default`，不改旧默认值） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `pages-sub/picker{,-popup,-input}/`，覆盖单列 / 多列 / 对象选项 / 级联 / 插槽 / 状态 |
| 演示登记 | `demo-components.uts` 表单组字母序插入 |
| 双语文档 | `docs/src/components/` + `src/en/components/`，侧栏同序插入 |
| 发布 | 变更日志三处（插件 / 文档站 / versions），`version` 字段不触碰（由用户手动 release） |

## 伪代码设计

### 数据类型（待 Q3 / Q4 确认）

```
type PickerOption = {
  label: string                 // 展示文本（默认字段）
  value: string | number        // 选项值
  children?: PickerOption[]     // 级联子项（若支持）
  disabled?: boolean            // 禁用项（若支持）
}

props:
  columns: PickerOption[] | PickerOption[][]   // 一维自动视为单列；二维为多列
  columnsFieldNames?: { label: string; value: string; children: string }
  value: string | number | (string|number)[] | null
  title / confirmButtonText / cancelButtonText / showToolbar
  loading / readonly / optionHeight / visibleOptionNum / swipeDuration
```

### 列构建与选中定位

```
normalizeColumns(columns):
  一维（元素无 children 且非数组）→ [columns]
  二维 → 原样
  若存在 children → 级联模式：第 0 列 = 顶层，第 n 列 = 前 n 层选中项的 children

resolveIndexes(value, columns):
  按值逐列匹配（单列标量 / 多列数组），缺失回退 0
  indexes = number[]

buildColumns(indexes):
  每列 options 映射为 { text: label, value: 序号字符串 }（列组件只认文本 + 序号）
  选中下标 = indexes[i]

onColumnChange(columnIndex, index):
  indexes[columnIndex] = index
  级联模式：columnIndex 之后的下标归零
  value = 各列选中的原始 value（单列 → 标量；多列 → 数组）
  emit change(value, selectedOptions, indexes)
```

### 三件套组合（沿用既有惯例）

```
m-picker          面板：工具栏 + 多列滚轮 + 加载遮罩
m-picker-popup    弹层：m-popup + 面板，confirm / cancel 后自动关闭
m-picker-input    输入框：m-input 只读触发器 + 弹层，展示各列 label 拼接，支持清空
```

若 Q1 包含纯视图（`m-picker-view`），方案：

```
m-picker-view        无工具栏 / 无数据 props，接收 value: number[]（索引），渲染插槽列
m-picker-view-column 每列插槽容器，选中项由父级 index 决定
实现：列容器复用 m-date-picker-column 的滚动骨架，但内容改为默认插槽逐项渲染
```

### 输入框展示

```
displayText = 各列选中项的 label 按列顺序拼接（默认「 / 」分隔）
单列 → 单个 label
清空 → emit update:value(null) + clear
```

## 疑问清单

### Q1 本轮范围？（影响：组件数量与工作量）
- A. 三件套（`m-picker` / `m-picker-popup` / `m-picker-input`）
- B. 三件套 + 纯视图（`m-picker-view` / `m-picker-view-column`）
- C. 仅面板
- 回答：B。

### Q2 命名方案？（影响：目录名 / 标签名 / 文档路由）
- A. `m-picker` 系列，弹层用 `-popup`、输入框用 `-input`、纯视图用 `-view`
- B. 其他命名（请在回答中给出）
- 回答：A。

### Q3 列数据契约？（影响：props 结构与使用成本）
- A. 二维数组 `columns: PickerOption[][]`（Vant 口径，单列需包一层）
- B. 一维 / 二维自动识别（Sard 口径，单列直接传数组）
- C. 二维数组 + `columns-field-names` 字段映射（对象选项，兼容任意字段名）
- 回答：B。

### Q4 值口径？（影响：v-model 契约与事件参数）
- A. 单列标量、多列数组（自动判断），另回传 `selectedOptions` 与 `indexes`
- B. 始终数组（多列友好，单列也返回长度 1 数组）
- C. 主值为索引数组（对齐 PickerView），label / value 由外部派生
- 回答：A。

### Q5 是否支持级联（children）？（影响：列刷新逻辑与与 m-cascader 的边界）
- A. 支持（滚轮级联：切换上层后下层重建并回到首项）
- B. 不支持（级联继续由 `m-cascader` 承担）
- 回答：A。

### Q6 是否支持禁用项？（影响：列渲染与点击拦截）
- A. 支持 `disabled` 选项（灰显、滚动跳过、点击不选中）
- B. 首版不支持
- 回答：A。

### Q7 插槽范围？（影响：演示页与文档规模）
- A. 对齐 Vant：`toolbar` / `title` / `cancel` / `confirm` / `option` / `columns-top` / `columns-bottom`
- B. 仅 `toolbar` / `title` / `confirm` / `cancel` / `option`
- C. 首版不提供插槽
- 回答：A。

### Q8 与既有日期 / 时间选择的关系？（影响：是否重构）
- A. 本期不动，日期 / 时间继续用各自面板（只做新增）
- B. 通用 Picker 落地后，另起任务把日期 / 时间面板迁移为 Picker 组合
- 回答：B。

## 实施记录

### 定案汇总（按回答执行）

- Q1 → B：三件套 + 纯视图（`m-picker` / `-popup` / `-input` / `m-picker-view` / `m-picker-view-column`）
- Q2 → A：命名 `m-picker` 系列，弹层 `-popup`、输入框 `-input`、纯视图 `-view`
- Q3 → B：一维 / 二维自动识别（一维按单列；元素为数组按多列），无字段映射，选项统一 `{ label, value, children?, disabled? }`
- Q4 → A：单列标量、多列（含级联）数组；事件回传 `selectedOptions` 与 `indexes`
- Q5 → A：支持 `children` 级联（切换上层后下层重建并回到首项）
- Q6 → A：支持禁用项（灰显 / 吸附跳过 / 点击不选中）
- Q7 → A：`toolbar` / `title` / `cancel` / `confirm` / `option` / `columns-top` / `columns-bottom`
- Q8 → B：本期只新增；日期 / 时间面板迁移到 Picker 组合另起任务（见遗留 TODO）

### 方案落地形态（与伪代码设计的差异）

- 列渲染继续复用 `m-date-picker-column`：每列把 `label` 作 `text`、列内序号作 `value`，宿主按序号从原始 `PickerOption[]` 取回原值，因此无需改动列组件的数据契约。
- 为支持禁用项，列组件新增可选 `disabledOptions?: boolean[]`（默认 null，日期 / 时间不传即行为不变）：禁用项追加 `--disabled` 类（透明度 0.2）、点击忽略、吸附时经 `nearestEnabledIndex` 跳过（向下优先、再向上）。
- 级联只在一维数据且存在 `children` 时启用；二维多列按列独立，不做级联混合。
- 级联展开在 `resolveColumns(indexes)` 中按层下钻，`onColumnChange` 将下游下标归零后由 `normalizeIndexes` 补齐长度与可用项。
- 纯视图与面板分离：`m-picker-view` 只接受 `value: number[]`，不做标量 / 数组换算、不展开级联；`m-picker-view-column` 为数据驱动列（`options` + `index`），可单独使用。
- 输入框展示复用 `resolveDisplayLabels`（级联逐层下钻、多列逐列匹配），以「 / 」连接。

### 变更文件清单

| 类型 | 文件 |
| --- | --- |
| 新增 | `packages/core/components/m-picker/{picker.uts, m-picker.uvue}` |
| 新增 | `packages/core/components/m-picker-popup/m-picker-popup.uvue`、`m-picker-input/m-picker-input.uvue` |
| 新增 | `packages/core/components/m-picker-view/{m-picker-view.uvue, m-picker-view-column.uvue}` |
| 修改 | `packages/core/components/m-date-picker/m-date-picker-column.uvue`（新增 `disabledOptions` 与禁用吸附 / 点击拦截 / 样式） |
| 修改 | `packages/core/theme/vars.scss`（`$m-picker-*` / `$m-picker-input-*` / `$m-picker-view-*`） |
| 新增 | `packages/playground/pages-sub/{picker,picker-popup,picker-input,picker-view}/*.uvue` |
| 新增 | `packages/docs/src/components/picker{,-popup,-input,-view}.md` 及 `src/en/components/` 同名 4 篇 |
| 修改 | `packages/playground/pages/index/demo-components.uts`、`packages/docs/.vitepress/config/{zh,en}.ts` |
| 生成 | `packages/playground/pages.json`、`router/routes.gen.uts`、`types/route-name.gen.d.ts`、`uni_modules/m-ui-x/**`（sync） |

### 验证方式与结果

- `pnpm sync:uni-modules` + `pnpm sync:uni-modules:check`：通过。
- 六个文件经 Vite 模块请求编译：均返回 200。
- 四个演示页 HTTP：均返回 200，`pages.json` 路由已生成。
- Web 实测（dev server 5174）：
  - `picker` 页：单列 / 三列多列 / 级联（切换厂区后下层重建）/ 禁用项灰显 / 确认与 `getSelectedIndexes`，均通过；
  - `picker-view` 页：三组索引受控视图、外部定位 `[1,1,1]`、清空 `[]`、option 插槽彩色圆点，均通过；
  - `picker-input` 页：弹层顶部栏、填入「包装五线」、级联回填三层文本、清空、禁用态无清空按钮，均通过；
  - 三页控制台无 error。
- `pnpm build:docs`：通过（含死链检查）。

### 遗留 TODO

- 滚轮拖拽 / 吸附交互未由浏览器自动化覆盖（`scroll-view` 滚轮不可程序化滚动），由同款列组件既有验证承接；真机（微信小程序 / Android / iOS）待复测。
- Q8-B：日期 / 时间面板迁移为 Picker 组合需另起任务（涉及 `m-date-picker`、`m-time-picker` 及其三件套的列构建逻辑收敛）。
- 首版不支持纯字符串列数据（`columns: string[]`），需包装为 `PickerOption`。
