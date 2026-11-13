# m-checkbox 复选框三件套 实施方案

## 需求

- 对标设计：Vant Checkbox / CheckboxGroup（https://vant-ui.github.io/vant/#/zh-CN/checkbox）——在一组备选项中进行多选。
- 拆分先例：对齐 m-calendar / m-calendar-popup / m-calendar-input 与 m-cascader / m-cascader-popup / m-cascader-input 的「面板 / 弹出框 / 输入框」三组件模式。
- 目标：在 `packages/core` 新增复选框三件套，完成主题变量、uni_modules 同步、演示页、双语文档与验证闭环。

## Vant API 摘录

**Checkbox**：v-model（boolean）、name（any 标识）、shape（round / square）、disabled、label-disabled、label-position（left / right）、icon-size（20px）、checked-color、bind-group、indeterminate（不确定态）；slots：default（文本，作用域 {checked, disabled}）、icon（作用域 {checked, disabled}）；events：change、click。

**CheckboxGroup**：v-model（选中项数组）、disabled、max（0 不限）、direction（vertical / horizontal）、icon-size、checked-color、shape；expose：toggleAll(checked?)；event：change(names)。

## 影响面（预估，按 Q1 结论调整）

| 落点 | 文件 |
| --- | --- |
| 组件源码 | `packages/core/components/m-checkbox-group/`（+ m-checkbox 子项？）、`m-checkbox-popup/`、`m-checkbox-input/`、共享类型 `checkbox.uts` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-checkbox-*` 段（全 `!default`） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `packages/playground/pages-sub/checkbox/checkbox.uvue` + demo-components 登记（表单组件组） |
| 文档 | `packages/docs/src/components/checkbox.md` + en 镜像 + zh.ts / en.ts 侧栏 |
| 变更登记 | docs changelog（中英）+ 插件 changelog、版本号升级 |

## 技术要点（UTS / uvue 约束）

- **provide/inject 上下文**：组容器 provide（value 数组、disabled、shape、iconSize、checkedColor、direction、max），子项 inject 后注册 name 与切换回调（复用 m-fab / m-compact 注册序先例）。
- **独立复选框**：不在组内时自持 boolean 状态（v-model）。
- **icon 绘制**：选中态打勾可复用 m-icon（`success` 类图标）或自绘 view + border 旋转（对勾图形），indeterminate 态画横杠——先比对内置图标名再定。
- **max 限制**：组内达到 max 后其余项点击仅派发 click 不变更（Vant 语义）。
- **popup**：m-popup（bottom 方位）+ 组面板组合，全 props 透传 + 插槽条件转发（对齐 m-cascader-popup）。
- **input**：m-input 只读触发器 + popup 组合；回显选中 label「、」连接（超限截断 +N），清空按钮清空 value（对齐 m-cascader-input）。
- **值类型红线**：UTS 无 `Array<string | number>`，多选值类型需在 Q2 拍板。

## 疑问清单

### Q1 组件拆分（影响：组件数量与 API 手感）

Vant 是 CheckboxGroup + Checkbox 两组件；三件套先例是「面板（内部自渲染）+ 弹层 + 输入框」。checkbox 若照搬 cascader 的 options 数组驱动面板，将失去 Vant 的插槽自由排布能力。

- 方案 A（推荐，四组件）：`m-checkbox-group` + `m-checkbox` 两核心（完整对标 Vant：插槽文本、icon 插槽、label-position、indeterminate）+ `m-checkbox-popup`（弹层多选，内部用 options 数组渲染组面板）+ `m-checkbox-input`（输入框触发 + 弹层）
- 方案 B（严格三组件）：`m-checkbox` 单组件 = 组面板（options 数组驱动 + field-names，无独立子项组件）+ `m-checkbox-popup` + `m-checkbox-input`——丢失 Vant 的子项插槽 / indeterminate / label-position 等能力
- 方案 C：先做 A 的前两个核心，popup / input 后续版本

回答：

### Q2 多选值类型（影响：value prop / change 事件 / input 回显）

UTS 不支持 `Array<string | number>` 联合数组。

- 方案 A（推荐）：`string[]`，name 仅支持 string（数字 name 由使用者自行转 string）
- 方案 B：`UTSJSONObject[]`（每项 `{ name }`），读写均需包装，手感差
- 方案 C：组容器不支持泛型，name 内部统一 string 存储，对外提供 number 重载无门

回答：

### Q3 popup 的选项渲染方式（影响：popup / input 是否依赖子组件）

- 方案 A（推荐）：popup 内部由 options 数组渲染 checkbox 组（label / value / disabled 三字段 + field-names 映射，对齐 cascader-popup 的 options 驱动），不要求使用者写子组件模板
### Q1 组件拆分（影响：组件数量与 API 手感）

回答：方案 A —— 四组件完整对标：`m-checkbox-group` + `m-checkbox` 两核心（插槽文本 / icon 插槽 / label-position / indeterminate）+ `m-checkbox-popup`（弹层多选，options 数组驱动）+ `m-checkbox-input`（输入框触发 + 弹层）。

### Q2 多选值类型（影响：value prop / change 事件 / input 回显）

回答：`Array<string | number>`——已在 playground 实测 UTS 联合类型数组合法（编译通过、运行 `['a', 1]` 输出 `2 a 1`），全对标 Vant any[]；App 端实现完成后以 appResource 导出产物静态核对联合数组编译产物。

### Q3 popup 的选项渲染方式（影响：popup / input 是否依赖子组件）

回答：方案 A —— popup 内部 options 数组驱动（label / value / disabled + field-names 映射，对齐 cascader-popup）。

### Q4 文档与演示归组

回答：方案 A —— 归「表单组件」组。

## 实施记录

### 落码

| 落点 | 文件 |
| --- | --- |
| 共享类型与上下文 | `packages/core/components/m-checkbox-group/checkbox.uts`（CheckboxValue / CheckboxValueArray / CheckboxGroupContext / valuesEqual 等） |
| 组容器 | `packages/core/components/m-checkbox-group/m-checkbox-group.uvue`（expose toggleAll） |
| 单项 | `packages/core/components/m-checkbox/m-checkbox.uvue`（双形态 + expose toggle） |
| 弹层 | `packages/core/components/m-checkbox-popup/m-checkbox-popup.uvue`（options 驱动 + footer 插槽） |
| 输入框 | `packages/core/components/m-checkbox-input/m-checkbox-input.uvue` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-checkbox-*` 27 个（全 `!default`） |
| 演示页 | 三页拆分（对齐 calendar / cascader 三件套「每组件一页」约定）：`pages-sub/checkbox/checkbox.uvue`（group + checkbox 11 区块）、`pages-sub/checkbox-popup/checkbox-popup.uvue`（6 区块：基础 / field-names / max+禁用 / horizontal / options-height / 事件）、`pages-sub/checkbox-input/checkbox-input.uvue`（6 区块：基础 / 截断 / 清空 / 禁用与 inlaid / field-names+number / max）+ demo-components 登记三条目 |
| 文档 | checkbox.md / checkbox-popup.md / checkbox-input.md（中英六文件）+ zh/en 侧栏 |
| 变更登记 | docs changelog（中英）+ 插件 changelog 0.5.0 补条目（版本号维持 0.5.0，与 fab 同版） |

### 实现期关键决策与修复

1. **Q2 实测推翻假设**：`Array<string | number>` 在 UTS 合法（playground 临时插桩实测：编译通过、运行 `['a', 1]` 输出 `2 a 1`），采纳为值类型全对标 Vant any[]；App 端建议发布前 appResource 导出核对联合数组 Kotlin 产物。
2. **instanceof 坑（首轮验证抓出）**：`v instanceof String/Number` 对 UTS 原始值恒 false（Web 运行时原始 string/number 非包装对象），导致 contains 全 false（初始 `['a']` 匹配不上）与 label 回显空串。修复：`valuesEqual` 改 `a.toString() == b.toString()`（字符串化比较，'1' 与 1 等价，对齐 Vant any 宽松语义）；`checkboxValueText` 改统一 `toString()`。
3. **icon 点击 `.stop` 吞事件**：icon-wrap `@click.stop` 阻断了冒泡，根节点 `@click` 收不到 → 演示页全选按钮失效。修复：去掉 `.stop`（icon 与 label 点击都冒泡到根统一派发 click，根只 emit 不 toggle，无双切换）。
4. **indeterminate 显示条件**：`indeterminate && isChecked` 错误——不确定态与勾选态独立（未勾选也可显示横杠）。修复为 `v-if="indeterminate"`。
5. **popup 必须内包 group**：直接渲染 m-checkbox 列表会 inject 不到上下文（走独立状态与 value 脱钩），修正为 m-checkbox-group 包裹列表。
6. **后代选择器自查**：首版 `.m-checkbox--label-left .m-checkbox__label` 违反 ucss 扁平规则，改 inline labelStyle（left 位置 margin 对调）。
7. **灰色变量**：`$m-color-gray` 不存在，统一改 `$m-text-color-fourth`（对齐 m-input-clear-color 先例）。

### 验证（Web 实测，puppeteer 390×800）

- 基础用法：初始 `[a]`、点 b → `[a、b]`、点 a → `[b]`（contains / 去重 / 移除全对）
- 独立复选框：v-model 布尔切换 ✓
- 禁用：单项禁用点击不勾选、组容器全禁 ✓
- max=2：选满两项后第三项被拒（`[a、b]` 不变）✓
- 弹层：打开 → 勾 2 项 → footer 确定（2 项）✓
- 输入框：选 3 项（number value 混用）回显「北京、上海 等 3 项」✓（label 匹配 + 截断）
- label-position=left：labelX(273) < iconX(329) 反转排布 ✓
- indeterminate：[a、b]（2/3）显示 12px 横杠；点击 → 全选 `[a、b、c]`（实心主题色）；再点 → `[]` ✓
- 控制台零报错（仅 favicon 404）；`sync:uni-modules:check` 与 `build:docs` 通过

### 遗留

- App / 小程序端未真机实测；联合类型数组在 VDOM Kotlin 产物中的编译结果建议 appResource 导出核对（0.4.2 捷径）
- toggleAll 的取反模式不受 max 约束（文档已注明）；禁用项参与全选 / 全不选（对齐 Vant）

