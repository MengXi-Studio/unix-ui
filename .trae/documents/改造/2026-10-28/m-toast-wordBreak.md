# m-toast wordBreak 换行控制 实施方案

> 状态：已完成（DoD 全勾）。

## 需求

用户在演示页 [toast.uvue#L130-132](/Users/queyupeng/github/MengXi-Studio/unix-ui/packages/playground/pages-sub/toast/toast.uvue) 选中 `\n` 换行示例，提出：换行方式能不能支持动态的，支持三个属性值——**不换行、换行时截断单词、换行时不截断单词**。

即为 m-toast 的 message 文本新增换行控制能力（对齐 Vant ToastOptions.wordBreak 的场景，取值按用户三值语义）。

## 需求分析

- **技术前提勘误**：0.2.0 立项时 Q5 以「ucss 不支持 wordBreak」裁剪了该能力——经查官方文档（doc.dcloud.net.cn/uni-app-x/css/word-break.html）为**错误认知**：
  - `word-break: normal | break-all | keep-all | break-word` 官方支持；兼容性 Web 4.0+ / Android(Vapor) 5.31+ / iOS(Vapor) 5.31+ / HarmonyOS(Vapor) 5.31+（**VDOM 模式不支持**，playground 已启用 vapor 不受影响）；
  - `white-space: nowrap` 已有 m-text 单行省略先例（m-text.uvue L124）。
- **三值语义到 CSS 的映射**：
  - 不换行 → `white-space: nowrap`
  - 换行时截断单词 → `word-break: break-all`
  - 换行时不截断单词 → `word-break: normal`（默认行为，保持现状）
- **影响面**：core 的 `toast.uts`（类型 + 归一）与 `m-toast.uvue`（Props + message 类拼接 + style 扁平类）；playground 演示页换行节改造；docs 双语文档（Props 表 + 「与 Vant 的差异」勘误）+ changelog 三处；主题变量无需新增。
- **限制注记（文档须写明）**：App 端 word-break 仅 Vapor 模式（HBuilderX 5.31+）生效，VDOM 模式不生效；Web 端全支持。

## 伪代码设计

### 类型与归一（toast.uts）

```uts
/** message 换行控制：nowrap 不换行 / break-all 换行截断单词 / normal 默认不截断（对齐用户三值语义） */
export type ToastWordBreak = 'nowrap' | 'break-all' | 'normal'

// ToastOptions 增补：
wordBreak?: ToastWordBreak | null   // 默认 'normal'

// normalizeOptions 增补一行归一：
wordBreak: opts.wordBreak == null ? 'normal' : opts.wordBreak
```

### 容器组件（m-toast.uvue）

- Props 增补 `wordBreak`（与 ToastOptions 同契约），`propsToOptions()` 同步透传（组件式与函数式同源）。
- message `text` 类拼接变体：`m-toast__message` + （wordBreak == 'nowrap' → `m-toast__message--nowrap`）/（== 'break-all' → `m-toast__message--break-all`）；normal 为默认行为不加类。
- style 扁平类新增（禁嵌套、禁 @each）：

```scss
.m-toast__message--nowrap { white-space: nowrap; }
.m-toast__message--break-all { word-break: break-all; }
```

### 演示页（pages-sub/toast/toast.uvue）

「基础用法」节换行示例扩展为 wordBreak 变体演示：不换行（长英文短句 nowrap）/ 换行截断单词（连续长字符串 break-all）/ 换行不截断（带空格长句 normal），原 `\n` 换行示例保留；caption 说明三值语义。

### 文档

- `toast.md` / `en/toast.md`：ToastOptions 表与组件式 Props 表新增 `word-break` 行；「与 Vant 的差异」节移除 wordBreak 裁剪项，改为注记（App 端 Vapor 5.31+ 生效 / VDOM 不支持；Vant 的 `break-word` 值不提供）；代码演示节同步。
- changelog 三处（docs zh/en + 插件 KEEP）0.2.0 m-toast 条目补 word-break 描述。

## 疑问清单

### Q1 取值集合：按你说的三值落地为 `wordBreak: 'nowrap' | 'break-all' | 'normal'`（CSS 惯例命名），Vant 还有第四值 `break-word`（长单词溢出时才截断，与 normal 高度重叠）不再提供，确认吗？
回答：对齐Vant的三类吧。

### Q2 nowrap 的溢出行为：气泡有 max-width 70% 限制，nowrap 长文本会溢出气泡边界——方案 A：nowrap 时内置单行省略（ellipsis，m-text 同款组合）；方案 B：纯 nowrap 不加省略（溢出原样展示，配合 customStyle 自行处理）。选哪个？
回答：Vant中无此属性值。

### 定案（依据回答推导）

- 取值对齐 Vant 官方类型 `ToastWordBreak = 'normal' | 'break-all' | 'break-word'`（拉 Vant 源码 Toast.tsx 核实：`wordBreak: String as PropType<ToastWordBreak>`，无 props 默认值、未设置即 CSS 默认 normal；类变体 break-normal / break-all / break-word）。
- 「不换行（nowrap）」不提供——Q2 确认 Vant 无此属性值；本库默认值显式化为 `normal`（与 CSS 默认行为一致、与 Vant 未设置时实际效果一致），未传时归一 normal。

## 实施记录

### 方案落地形态

- **toast.uts**：新增 `export type ToastWordBreak = 'normal' | 'break-all' | 'break-word'`；`ToastOptions` 增补 `wordBreak?: ToastWordBreak | null`；`normalizeOptions` 归一 `wordBreak == null → 'normal'`（逐字段默认值契约延续）。
- **m-toast.uvue**：Props 增补 `wordBreak`（withDefaults null）+ `propsToOptions()` 同契约归一；新增 `messageClass` computed（基类 + `--normal` / `--break-all` / `--break-word` 三变体类，归一后恒落一类，对齐 Vant 类语义但类名体系归 m- 前缀）；message text 模板改 `:class="messageClass"`；style 扁平类三段（`word-break: normal / break-all / break-word`，无嵌套无循环）。主题变量无需新增（word-break 非可定制视觉量）。
- **演示页**：基础用法节追加三按钮（换行时截断单词 break-all / 换行时不截断单词 normal / 长单词放不下才截断 break-word），英文长串数据使差异可见；原「文字提示」「换行提示」按钮与文本不变（回归基线）；caption 补 word-break 三值语义。
- **文档**：zh/en toast.md 各三处——「换行控制 / Word Break」演示节（含 App 端 Vapor 5.31+ 平台差异注记）、ToastOptions 表增 wordBreak 行（组件式 Props 引用同表无需重复）、差异节勘误（wordBreak 移出「不支持」清单，改为「已支持 + 平台注记」）；changelog 三处（docs zh/en + 插件 KEEP）m-toast 条目补 wordBreak 描述。

### 变更文件清单

- core：`packages/core/components/m-toast/toast.uts`、`packages/core/components/m-toast/m-toast.uvue`
- playground：`pages-sub/toast/toast.uvue`、`uni_modules/m-ui-x/changelog.md`（KEEP）+ sync 产物
- docs：`src/components/toast.md`、`src/en/components/toast.md`、`src/changelog.md`、`src/en/changelog.md`

### 用户反馈修复：message 软换行不生效（flex-shrink 默认值坑）

- 现象：三值属性断言全过，但用户实测长文本单行溢出气泡被裁（截图），`\n` 换行却正常。
- 诊断：diagram 脚本探测 computed——`white-space: pre-line` / `word-break` 均正确，但 message text 宽 277px > 父气泡 195px，**text 未收缩溢出父容器**。
- 根因：**uvue 的 `flex-shrink` 默认值是 0**（对齐原生端，异于 W3C 的 1）——message text 是气泡的 flex 子项，永远保持内容单行宽度不收缩，软换行永不触发；`\n` 硬换行不依赖收缩故正常。
- 修复：`.m-toast__message` 增补 `flex-shrink: 1`（两端一致：App 端同规范）；实测 text 收缩到 171px、height 40 = 两行，软换行真实发生。
- 断言补强：专项脚本从「computed 属性值断言」升级为「实际换行行为断言」（clientHeight ≥ 40 两行 + 短文本 20 单行回归），12 断言全过。

### 用户反馈修复 2：短文本未水平居中

- 现象：短文本（如「提示内容」）在窄条气泡（min-width 96px）内靠左。
- 根因：`.m-toast__bubble--text` 只写了 `align-items: center`（垂直），缺 `justify-content: center`（水平）；且 `.m-toast__message` 缺 `text-align: center`（多行换行时各行应居中，对齐 Vant）。
- 修复：气泡补 `justify-content: center`、message 补 `text-align: center`；实测短文本左右间隙 20.0 / 20.0px 完全对称。

### 验证方式与结果（core-protocol DoD）

- `pnpm sync:uni-modules:check`：一致，通过；dev server HMR 生效，页面正常。
- Playwright 专项断言（`/tmp/pw-popup-verify/verify-wordbreak.cjs`）：**15 断言全过**——break-all / normal / break-word 三值的 computed word-break 与变体类逐一命中 + **实际换行行为断言**（长文本 clientHeight ≥ 40 两行 / 短文本 20 单行）+ **居中断言**（justify-content / text-align / 左右间隙对称）、未传时默认归一 normal、无 console / page 报错。
- 全量回归（`verify-toast.cjs`）：**35 断言全过**（既有功能零回归）。
- `pnpm build:docs`：成功（死链检查通过）；`pnpm build:demo`：成功（演示产物入库）。
- App 端限制：word-break 仅 Vapor 模式（HBuilderX 5.31+）生效（官方兼容性表），已写入文档；VDOM 模式不支持。

### 遗留 TODO

- App（Android / iOS / HarmonyOS）真机实测 word-break 表现（当前 Web 端验证通过，官方文档声明 Vapor 5.31+ 支持）。
- 「不换行」语义未提供（Q2 定案 Vant 无此值）；如后续需要单行省略场景可再立项。
