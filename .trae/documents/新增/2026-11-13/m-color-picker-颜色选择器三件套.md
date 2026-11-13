# m-color-picker 颜色选择器三件套 实施方案

## 需求

- 对标设计（Sard）：
  - https://sard.wzt.zone/components/color-picker
  - https://sard.wzt.zone/components/color-picker-input
  - https://sard.wzt.zone/components/color-picker-popout
- 拆分先例：对齐本项目 m-calendar / m-calendar-popup / m-calendar-input 与 m-cascader / m-cascader-popup / m-cascader-input 的「面板 / 弹出框 / 输入框」三组件模式（Sard 叫 popout，本项目统一叫 popup）。
- 目标：在 `packages/core` 新增颜色选择器三件套，含主题变量、同步、演示页、双语文档与验证闭环。

## Sard API 摘录

**ColorPicker**：饱和度-明度面板 + 色相滑块；`model-value`（默认 `#1989FA`）、`show-alpha`、`format`（hex / rgb / hsl，默认 rgb）、`show-format`、`presets: string[]`、`show-presets`、`disabled`、`readonly`；emits：`update:modelValue` / `change` / `update:format` / `format-change`。

**ColorPickerPopout**：继承 ColorPickerProps + FormPopoutProps（title、确认 / 取消按钮等）；emits：`update:visible` / `update:modelValue` / `change` / `confirm(value)`。

**ColorPickerInput**：继承 ColorPickerPopoutProps + PopoutInputProps；emits：`update:modelValue` / `change` / `update:visible` / `confirm`。

演示要点：基础、选择透明度、预定义颜色、自定义预定义颜色、三种格式（hex / rgb / hsl）、允许切换格式。

## 需求分析（影响面）

| 落点 | 文件 |
| --- | --- |
| 共享类型与颜色算法 | `packages/core/components/m-color-picker/color-picker.uts`（RgbaColor / ColorFormat / parseColor / formatColor / rgbToHsv / hsvToRgb） |
| 面板组件 | `packages/core/components/m-color-picker/m-color-picker.uvue` |
| 弹层组件 | `packages/core/components/m-color-picker-popup/m-color-picker-popup.uvue` |
| 输入框组件 | `packages/core/components/m-color-picker-input/m-color-picker-input.uvue` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-color-picker-*` 段（全 `!default`） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页（每组件一页） | `pages-sub/color-picker/`、`pages-sub/color-picker-popup/`、`pages-sub/color-picker-input/` + `demo-components.uts` 登记（表单组件组，字母序插入 `checkbox-popup` 之后、`input` 之前） |
| 文档 | `docs/src/components/color-picker{,-popup,-input}.md` + `src/en/` 镜像 + `zh.ts` / `en.ts` 侧栏（同序） |
| 变更登记 | docs changelog（中英）+ 插件 changelog，版本号 0.6.0 |

## 伪代码设计

### 共享类型与算法（color-picker.uts）

```ts
type ColorFormat = 'hex' | 'rgb' | 'hsl'
type RgbaColor = { r: number; g: number; b: number; a: number }   // r/g/b 0-255，a 0-1

// 解析：兼容 #RGB / #RRGGBB / #RRGGBBAA / rgb() / rgba() / hsl() / hsla() / 空串（回退默认色）
parseColor(input: string): RgbaColor
// 输出：按 format 与 showAlpha 决定是否带 alpha（hex 采用 8 位 #RRGGBBAA）
formatColor(c: RgbaColor, format: ColorFormat, showAlpha: boolean): string
rgbToHsv(c: RgbaColor): HsvColor          // h 0-360 / s 0-100 / v 0-100
hsvToRgb(h: HsvColor, alpha: number): RgbaColor
```

### m-color-picker

Props：`value`（v-model:value，默认 `#1989FA`）、`showAlpha`、`format`（默认 rgb）、`showFormat`、`presets: string[]`、`showPresets`、`disabled`、`readonly`、`panelHeight`、`customClass`、`customStyle`。

Emits：`update:value`、`change`、`update:format`、`format-change`。

模板结构（自上而下）：

1. 饱和度-明度面板：三层绝对定位 view 叠放 → 底层纯色相 `hsl(h,100%,50%)`，中层横向 `white → transparent`，顶层纵向 `transparent → black`；thumb 圆点 inline `left/top` 百分比定位。
2. 滑块组：色相条（0-360）+ 透明度条（showAlpha 时，棋盘格底 + 当前色渐变）。
3. 格式切换（showFormat 时）：hex / rgb / hsl 三选一 + 当前值文本展示。
4. 预定义色（showPresets 时）：presets 色块网格，点击直接选中。

交互：面板 / 滑块均走 `@touchstart/@touchmove`，按节点矩形换算百分比（矩形测量沿用 m-fab 的三端分支：Web `getBoundingClientRect` / MP `createSelectorQuery.in(instance)` / App `getBoundingClientRectAsync`）；disabled 不响应，readonly 只展示不派发值变更。

### m-color-picker-popup

`m-popup` + `m-color-picker` 组合：弹层 props（show / position / round / closeOnClickOverlay / safeAreaInsetTop/Bottom / zIndex / duration）透传 m-popup；选择器 props 全量透传 m-color-picker；头部为「取消 / 标题 / 确定」三栏（自绘，m-popup 无 title），确定后回写 `update:value` 并关闭（对齐 m-calendar-popup 的 confirm → 关闭）。

Props 额外：`title`、`showConfirm`（默认 true）、`confirmText`、`cancelText`。
Emits：`update:show`、`update:value`、`change`、`confirm`、`cancel`、`update:format`、`format-change`、`open`、`opened`、`close`、`closed`、`click-overlay`。

### m-color-picker-input

`m-input`（只读展示）+ `m-color-picker-popup` 组合，对齐 m-cascader-input：透明触发层接整区点击、自绘清空按钮、色块预览（展示当前颜色小方块）。

Props：`value`、`title`、`placeholder`、`disabled`、`clearable`、`showAlpha`、`format`、`showFormat`、`presets`、`showPresets`、`border`、`inlaid`、`confirmText`、`position`、`round`。
Emits：`update:value`、`change`、`confirm`、`clear`、`update:show`。

## 疑问清单

### Q1 组件命名与值绑定名（影响：三组件 API 与文件命名）

Sard 用 `popout` + `model-value`；本项目先例是 `popup`（m-calendar-popup / m-cascader-popup）+ `value`（m-calendar / m-cascader）。

- 方案 A（推荐）：`m-color-picker` / `m-color-picker-popup` / `m-color-picker-input`，`v-model:value` —— 与本项目三件套命名、绑定名完全一致
- 方案 B：跟 Sard 叫 `m-color-picker-popout`、`v-model`（modelValue）—— 与既有组件不一致

回答：方案 A。三组件沿用本项目先例 `m-color-picker` / `m-color-picker-popup` / `m-color-picker-input` + `v-model:value`。A。

### Q2 渐变渲染方案（影响：组件能否在 App / 小程序端正确显示）

UCSS 的 css function 白名单只列了 `url()/rgb()/rgba()/var()/env()`，但项目演示页已在 inline style 用过 `linear-gradient`（仅 Web 实测）。饱和度面板与色相 / 透明度条强依赖渐变。

- 方案 A（推荐）：直接用 `background: linear-gradient(...)`（面板叠 3 层 view + 色相条一条渐变 + 透明度条棋盘格 + 渐变覆盖），先 Web 实测，App 端以官方文档 + 编译产物核对；失败再降级
- 方案 B：不用渐变，全部用分段色块拼接（色相条 36 段、面板 16×16 网格）—— 三端必稳，但观感与性能下降
- 方案 C：用 canvas 绘制 —— uni-app x canvas 在 App 端限制多，项目无先例，不推荐

回答：方案 A。已核对 uni-app x 官方 `background-image` 文档：兼容性 Web 4.0 / Android 3.9 / iOS 4.11 / HarmonyOS 4.61，App 端明确「不支持背景图片，仅支持 linear-gradient 方法」，支持方向 / 多色标 / 百分比色标。实现约束：App 端仅单层渐变，面板用「3 层绝对定位 view 各放一条线性渐变」叠加，不写逗号分隔的多重背景。A。

### Q3 弹层确认语义（影响：m-color-picker-popup 交互）

Sard 的 FormPopout 带确认按钮，选择过程不回写，确认才生效。

- 方案 A（推荐）：头部「取消 / 标题 / 确定」+ 确定回写并关闭（`show-confirm` 默认 true，关闭后恢复打开前颜色）
- 方案 B：实时回写，无确认按钮（点遮罩即关闭即生效，像 m-cascader-popup）

回答：B。

### Q4 支持的颜色格式与 hex 透明度表示（影响：解析 / 输出与文档）

Sard 支持 hex / rgb / hsl 三种输出。

- 方案 A（推荐）：完整支持 hex / rgb / hsl 解析与输出；`show-alpha` 时 hex 输出 8 位 `#RRGGBBAA`（业界常见约定）
- 方案 B：hex 不支持 alpha（show-alpha 时强制回退 rgba），避免 8 位 hex 兼容争议

回答：A。

### Q5 格式切换控件形态（影响：m-color-picker 模板与主题变量）

`show-format` 时用户可切换 hex / rgb / hsl。

- 方案 A（推荐）：自绘三个文字 pill（选中项主题色底），轻量、无额外依赖
- 方案 B：复用 m-tabs（pill 风格）—— 引入 tabs 的滚动 / 手势逻辑，体量与依赖偏重

回答：A。

### Q6 输入框形态的展示内容（影响：m-color-picker-input 模板）

本项目 m-cascader-input 只做「值文本 + 清空」，无前置标签。

- 方案 A：`m-input` 左侧色块预览 + 颜色值文本 + 清空按钮（无 title 前置标签）
- 方案 B（推荐）：同 A，并在有 `title` 时于输入框上方渲染一行标签文本（对齐 Sard PopoutInput 的 title）

回答：与之前的m-calendar-input、m-cascader-input和m-checkbox-input等保持一致。

### Q7 预定义颜色默认值（影响：主题变量与开箱体验）

Sard `presets` 无内置默认。

- 方案 A：无内置，仅 `show-presets` + `presets` 传参生效（严格对标 Sard）
- 方案 B（推荐）：内置一组常用色（主题变量 `$m-color-picker-presets` 不可行 → 代码内默认数组，可被 props 覆盖），`show-presets` 单独开启即有内容

回答：A。

### Q8 范围裁剪（影响：工作量与后续版本）

- 是否需要在 0.6.0 就包含：面板数值输入框（R/G/B/A 手输）、吸管取色、最近使用颜色记录？
- 建议：本版**不做**以上三项，仅做面板 + 滑块 + 格式切换 + 预设色 + 三件套组合。

回答：方案 B —— 0.6.0 全部实现：R/G/B/A 数值输入框 + 最近使用颜色（组件内状态，默认最多 8 个）全平台一致；吸管取色仅 Web 端条件编译渲染（`#ifdef WEB`，Chromium `EyeDropper` API），其余平台不渲染入口、不写占位实现。新增 props：`showInputs`（数值输入框）、`showRecent`（最近使用颜色）、`showEyedropper`（Web 吸管入口，默认 false）。

## 实施记录

### 落码

| 落点 | 文件 |
| --- | --- |
| 共享类型与算法 | `packages/core/components/m-color-picker/color-picker.uts`（ColorFormat / RgbaColor / HsvColor / HslColor / parseColor / formatColor / rgbToHsv / hsvToRgb / rgbToHsl / hslToRgba / rgbaCss / alphaTrackGradient / colorsEqual） |
| 面板组件 | `packages/core/components/m-color-picker/m-color-picker.uvue`（面板 / 色相条 / 透明度条 / 数值输入 / 格式切换 / 预设 / 最近色 / Web 吸管，expose refresh） |
| 弹层组件 | `packages/core/components/m-color-picker-popup/m-color-picker-popup.uvue`（取消 / 标题 / 确定 + 草稿值） |
| 输入框组件 | `packages/core/components/m-color-picker-input/m-color-picker-input.uvue`（只读触发器 + 色块预览 + 字段标签 + 自绘清空 + 弹层） |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-color-picker-*` 52 个（全 `!default`） |
| 演示页 | `pages-sub/color-picker/`（11 区块）、`pages-sub/color-picker-popup/`（5 区块）、`pages-sub/color-picker-input/`（6 区块）+ demo-components 登记（表单组件组字母序） |
| 文档 | `docs/src/components/color-picker{,-popup,-input}.md` + `src/en/` 镜像 + zh/en 侧栏（同序） |
| 变更登记 | docs changelog（中英）+ 插件 changelog 0.5.0 段补条目；四个 package.json 版本 0.4.2 → 0.5.0 |

### 实现期关键决策

1. **渐变分层**：官方 `background-image` 文档确认 App 端仅支持 `linear-gradient`（不支持背景图），因此饱和度面板 = 3 个绝对定位层（纯色相 rgb + 横向白渐变 + 纵向黑渐变），不写多重背景；色相条单条 7 色标渐变。
2. **吸管仅 Web**：`#ifdef WEB` 内直接取 `window.EyeDropper`，非 Chromium 走 toast 提示；App / 鸿蒙 / 小程序不渲染入口（模板条件编译），未写占位实现。
3. **确认语义**：弹层维护内部 draft，确认回写 `update:value` / `change` / `confirm` 并关闭；取消与遮罩关闭丢弃本次改动；`show-confirm=false` 走实时回写。
4. **最近色**：组件内部状态（最多 8 个，去重、最新在前），手势结束（touchend）或选择预设色时记录，不持久化。
5. **触摸换算**：沿用 m-fab 的矩形测量三端分支（Web 同步 / 小程序 `createSelectorQuery.in(instance)` / App `getBoundingClientRectAsync`），弹层在 `opened` 后经 expose `refresh` 重新测量（动画期间 rect 带位移）。
6. **输入框层级**：透明触发层（z-index 1）接住整区点击，自绘清空按钮（2）在其上，弹层（3）盖住浮层；`disabled` 不渲染触发层。
7. **数值输入**：失焦 / 回车提交，RGB 钳制 0-255、A 钳制 0-100，提交后回写规范化文本。

### 验证（Web 实测，puppeteer 390×844）

- 面板中心触摸 → `rgb(64, 95, 128)`（s=50 / v=50）✓
- 色相条 25% → `rgb(96, 128, 64)`（h≈90）✓
- 透明度条 80% → `rgba(..., 0.8)` ✓
- 预设色块点击 → `rgb(239, 68, 68)`（#EF4444）；自定义预设 → `rgb(46, 204, 113)` ✓
- 格式切换 hex → `#1989fa99`（8 位 hex 带 alpha）✓
- 数值输入 R 超范围 → 钳制 255 ✓
- 最近色：色块总数 26 → 27（记录 1 个）✓
- disabled 面板点击 → 值不变 ✓
- 弹层：选色 → 确定 → 回写 `rgb(63, 84, 105)`；再开 → 选色 → 取消 → 值保持 ✓
- 输入框：选色确定回写、清空回写空串、disabled 点击不打开弹层（面板数 1 → 1）✓
- 吸管入口 Web 渲染 1 个，点击无报错（headless 无法真实取色）✓
- 控制台零运行时错误；`sync:uni-modules:check` 通过；`build:docs` 通过；三处组件列表字母序校验通过

### 遗留

- App / 鸿蒙 / 小程序端未真机实测（渐变分层与触摸换算已按官方文档约束实现，建议发布前 appResource 导出核对）
- 吸管取色仅能在 Chromium 真机交互验证（headless 无法完成屏幕取色）
