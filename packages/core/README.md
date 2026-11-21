**中文** | [English](./README-en.md)

<div align="center">
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="梦曦工作室 Logo" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/logo.png">
  </a>
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="微信公众号 二维码" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/QR_code.jpg">
  </a>

  <h1>@meng-xi/unix-ui</h1>
  <p><b>为 uni-app x 而生的 UI 组件库</b><br>79 个组件 · 8 大分类 · 一套 UTS 源码直出 App / Web / 小程序</p>

[![license](https://img.shields.io/github/license/MengXi-Studio/unix-ui.svg)](./LICENSE) [![npm](https://img.shields.io/npm/v/@meng-xi/unix-ui?color=blue)](https://www.npmjs.com/package/@meng-xi/unix-ui) ![npm](https://img.shields.io/npm/dt/@meng-xi/unix-ui?color=green)

[文档](https://mengxi-studio.github.io/unix-ui/) · [在线演示](https://mengxi-studio.github.io/unix-ui/playground/) · [更新日志](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md) · [示例工程](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground)
</div>

> **你不需要再手写界面细节了。** 按钮的按压反馈与加载态、0.5px 细边框、单行与多行省略、徽标截断偏移、弹层与滚轮选择、日期与农历换算……这些「每个项目都要重写一遍、每端都要重调一次」的活，unix-ui 已经收敛成 79 个开箱即用的组件。装进去，写标签就能用；改一行变量，全站换肤。

## 目录

- [为什么选择 unix-ui](#为什么选择-unix-ui)
- [核心能力](#核心能力)
- [5 分钟接入](#5-分钟接入)
- [组件全景](#组件全景)
- [为多端而生的实现](#为多端而生的实现)
- [平台支持](#平台支持)
- [真机与在线体验](#真机与在线体验)
- [工程与共建](#工程与共建)
- [文档](#文档)
- [交流与支持](#交流与支持)

## 为什么选择 unix-ui

| 你关心的 | 原生 `view` / `text` 手写 | 移植 H5 组件库 | **unix-ui** |
| --- | --- | --- | --- |
| 交互细节 | 按压态、加载、省略逐个手写 | 依赖 DOM，跨端表现漂移 | 组件内建，多端一致 |
| 0.5px 细边框 | App / Web / 小程序各写一套 | 需要额外 hack | 统一的 transform 缩放方案 |
| 主题换肤 | 样式散落各处 | 运行时 CSS 变量 | 编译期 `$m-*` 变量，零运行时开销 |
| 类型提示 | 无 | `any` 泛滥 | UTS 全量类型，补全与提示到位 |
| 组件接入 | — | 注册、按需引入、样式冲突 | easycom 自动扫描，**零注册零配置** |
| 平台适配 | 每端逐条排查 | 小程序端能力缺失 | 条件编译隔离差异，库内兜底 |

设计上不重造渲染栈：只依赖 uni-app x 内置组件与 `UniElement.animate`。UTS 源码直接分发（Web / 小程序 → JS，Android → Kotlin，iOS → Swift），由 uni-app x 编译链现场编译，**没有一层多余的运行时**。

## 核心能力

### 79 个组件，覆盖真实业务场景

从基础按钮、布局栅格，到表单录入、滚轮与列表选择、日期时间与农历，再到反馈、展示、导航——按 8 大分类组织，与文档站侧栏一一对应，按主流组件库的命名与交互习惯设计，**心智零迁移**。

### 编译期主题，改一行全站生效

全部视觉参数以 `$m-*` SCSS 变量收敛在 `theme/vars.scss`（全 `!default`）。在工程根 `uni.scss` 里写一行同名变量即完成覆盖，不写则零配置使用默认主题。变量在编译期注入，**运行时零开销**。

### 一套源码，多端一致

App（Android / iOS / HarmonyOS）、Web、小程序共用一套 UTS + uvue。hairline 细边框、滚动容器、弹层层级、字体加载等平台差异，由库内确定性实现，兼容蒸汽模式（vapor）。

### 强类型 UTS，写错就有提示

props / events 全量类型标注，编辑器补全到位；回调一律箭头函数、可空用 `null` 而非 `undefined`，与 UTS 规范保持一致。动画统一走 `UniElement.animate`，无 `@keyframes` 依赖。

### easycom 零注册，随用随取

遵循 uni_modules 组件插件规范（插件 id：`m-ui-x`），`<m-button>` 直接写进模板即可，无需 import 与手动注册。

### 无全局副作用

组件样式自包含，仅引用同包 `vars.scss`；不注入全局样式、不污染工程配置，随时可加可删。

## 5 分钟接入

**第一步：放入工程**（二选一）

```bash
# 方式一（推荐）：插件市场导入到 uni_modules/m-ui-x/
# 方式二：npm 安装后同步到 uni_modules（编译器不扫描 node_modules）
pnpm add @meng-xi/unix-ui
mkdir -p uni_modules && cp -R node_modules/@meng-xi/unix-ui uni_modules/m-ui-x
```

> 插件 id 与目录名必须为 `m-ui-x`，否则 easycom 无法自动匹配。

**第二步：直接使用**

```html
<template>
  <m-button type="primary" @click="onClick">主要按钮</m-button>
</template>

<script setup lang="uts">
  const onClick = () => {
    uni.showToast({ title: '点击了按钮' })
  }
</script>
```

**第三步：按需换肤**（可选）

```scss
/* 工程根 uni.scss：常规按钮高度 44px → 48px，所有按钮立即生效 */
$m-button-normal-height: 48px;
```

> 请勿在 `uni.scss` 中 `@import` 包内 `vars.scss`——`uni.scss` 会注入每个组件样式，重复引入同一文件会触发 sass 循环导入。

环境要求：HBuilderX `5.08` 及以上；建议启用样式隔离策略 2.0。全部可用变量与机制细节见[主题定制](https://mengxi-studio.github.io/unix-ui/guide/theming.html)。

## 组件全景

共 **79 个组件**（含子组件、弹层与输入框等组合形态），8 大分类组内按组件名字母序排列：

| 分类 | 组件 |
| --- | --- |
| 基础 | `m-button` `m-icon` `m-image` `m-text` |
| 布局 | `m-compact` `m-divider` `m-flex` `m-grid` `m-row` `m-space` `m-status-bar` `m-sticky` `m-waterfall` |
| 数据录入 | `m-checkbox` `m-color-picker` `m-input` `m-number-keyboard` `m-password-input` `m-radio` `m-rate` `m-search` `m-segmented` |
| 选择器 | `m-cascader` `m-picker` `m-picker-view` `m-select` |
| 日期时间 | `m-calendar` `m-date-picker` `m-date-range-picker` `m-date-strip` `m-lunar-picker` `m-time-picker` `m-time-range-picker` |
| 反馈 | `m-fab` `m-loading` `m-overlay` `m-popup` `m-toast` |
| 数据展示 | `m-badge` `m-cell` |
| 导航 | `m-tabs` |

> 数据录入、选择器、日期时间三类的多数组件同时提供 **弹层（-popup）** 与 **输入框（-input）** 形态，上表只列基础组件名；另有覆盖 1900–2100 的纯函数日期工具集（`utils/date.uts`），见[日期工具](https://mengxi-studio.github.io/unix-ui/tools/date.html)。

<details>
<summary><b>展开完整组件清单（含全部形态与核心能力）</b></summary>

### 基础组件

| 组件 | 说明 |
| --- | --- |
| `m-button` | 按钮：语义色 type、plain / disabled / loading、四档尺寸、block、hairline 细边框、按压反馈 |
| `m-icon` | 图标：内置 257 个字体图标（ttf 随包分发）、颜色尺寸、自定义图标插槽 |
| `m-image` | 图片：mode 直通、加载 / 失败占位、淡入过渡、圆形、懒加载、点击预览 |
| `m-text` | 文本：语义色 / 色值双模式、三档字号、单行省略、多行截断、可选中 |

### 布局组件

| 组件 | 说明 |
| --- | --- |
| `m-compact` | 紧凑布局：按钮 / 输入框圆角衔接与边框合并、block / direction、动态增删自动重排 |
| `m-divider` | 分割线：水平 / 垂直、dashed 虚线、hairline 0.5px 细线、内容位置 |
| `m-flex` / `m-flex-item` | 弹性布局：排列方向、三档与自定义间距、主轴 / 交叉轴对齐、自动换行、flex 简写 |
| `m-grid` / `m-grid-item` | 宫格：自定义列数、正方形格子、gutter 间距、完整边框、徽标联动、页面跳转 |
| `m-row` / `m-col` | 24 栅格布局：gutter 间距、对齐、换行、份数宽度与偏移 |
| `m-space` / `m-space-item` | 间距：方向 / 换行 / 对齐，size 单值或双值（行 / 列）分写 |
| `m-status-bar` | 状态栏占位：为贴顶元素预留系统状态栏高度、自定义高度与背景样式 |
| `m-sticky` / `m-sticky-box` | 粘性布局：吸顶 / 吸底、容器边界约束、吸附状态事件 |
| `m-waterfall` / `m-waterfall-item` / `m-waterfall-load` | 瀑布流：按内容实际高度多列排列、列数与间距、已知宽高占位、动态增删与重新排版 |

### 数据录入

| 组件 | 说明 |
| --- | --- |
| `m-checkbox` / `m-checkbox-group` | 复选框：组容器 + 单项双形态、形状 / 颜色 / 大小定制、max 限制、indeterminate 全选 |
| `m-checkbox-input` | 复选输入框：只读触发器 + 弹层多选、「、」连接回显、超 2 项截断、自绘清空 |
| `m-checkbox-popup` | 复选弹出框：底部弹层多选，options 数组驱动 + field-names 映射 + footer 插槽 |
| `m-color-picker` | 颜色选择器：饱和度-明度面板 + 色相 / 透明度滑块，hex / rgb / hsl 输出、预设色、最近色、Web 端吸管取色 |
| `m-color-picker-input` | 颜色选择器输入框：只读触发器 + 左侧色块预览 + 弹层选色、可选字段标签与清空 |
| `m-color-picker-popup` | 颜色选择器弹出框：取消 / 标题 / 确定头部，确定后回写、取消与遮罩关闭丢弃 |
| `m-input` | 输入框：六种类型、clearable 两时机、formatter / precision / min-max 收敛、明文切换、字数统计、多行自适应、前后插槽、confirm 事件与 input-align 对齐 |
| `m-number-keyboard` | 数字键盘：1-9 + 0 + 删除键的纯按键区，number / digit / idcard / random 四种类型、custom 主题右侧栏、禁用键回调、extra-key 插槽 |
| `m-number-keyboard-popup` | 数字键盘弹层：m-popup + 面板组合，默认插槽承载验证码格 / 金额展示，取消 / 完成派发后自动关闭 |
| `m-password-input` | 密码输入格子：bordered / underlined 两种风格、mask 圆点、聚焦光标闪烁、明文显示、禁用只读与错误提示 |
| `m-password-input-popup` | 密码输入弹层：弹层 + 格子 + 数字键盘一体化，v-model:value 自动收敛长度、打开自动聚焦、随机键盘 |
| `m-radio` / `m-radio-group` | 单选框：组容器 + 单项双形态、自绘圆环圆点图标、round / square 形状、颜色与大小定制、只读禁用 |
| `m-radio-input` | 单选输入框：只读触发器 + 弹层单选、选中项 label 回显、自绘清空按钮回写 null |
| `m-radio-popup` | 单选弹出框：底部弹层单选，options 数组驱动 + field-names 映射 + footer 插槽，点选不自动关闭 |
| `m-rate` | 评分：0.5 网格吸附、半星裁切、滑动评分、自定义图标 / 颜色 / 尺寸 / 数量、可清空、只读小数展示 |
| `m-search` | 搜索：组合 m-input 承载输入，圆角 / 背景定制、清除、键盘搜索、取消或搜索按钮、左右图标、错误提示与内容对齐 |
| `m-segmented` | 分段控制器：等分单选、三档尺寸、胶囊 / 纵向、滑块平移动画、item 作用域插槽、溢出省略、禁用只读 |

### 选择器

| 组件 | 说明 |
| --- | --- |
| `m-cascader` | 级联选择：多级联动、层级 tab 与手势滑动、field-names 字段映射、异步加载、四插槽 |
| `m-cascader-input` | 级联输入框：只读触发器 + 弹层选择、选中路径文字回填、清空与禁用 |
| `m-cascader-popup` | 级联弹出框：m-popup + m-cascader，选完最后一级自动关闭 |
| `m-picker` | 通用滚轮选择器：一维 / 二维列数据自动识别、children 级联、禁用项、对象选项、columns-top / columns-bottom 插槽 |
| `m-picker-input` | 选择器输入框：只读触发器 + 弹层选择、各列选中项文本回显、清空与禁用 |
| `m-picker-popup` | 选择器弹出框：m-popup + m-picker，v-model 控制显隐与选中值，确认 / 取消后自动关闭 |
| `m-picker-view` | 选择器纯视图：无工具栏的索引受控多列滚轮，配合 m-picker-view-column 与 option 插槽嵌入自定义容器 |
| `m-select` | 列表选择：options 驱动、children 分组、整体 / 单项禁用、本地与远程筛选、多选与上限、option 作用域插槽、scrollTop 回顶 |
| `m-select-input` | 列表选择输入框：只读触发器 + 弹层选择、标签按 options → map-label → 值字符串解析、max-labels 折叠、清空与只读禁用 |
| `m-select-popup` | 列表选择弹层：m-popup + 选择面板，标题与筛选、选中后自动关闭（多选保持打开） |

### 日期时间

| 组件 | 说明 |
| --- | --- |
| `m-calendar` | 日历面板：单选 / 多选 / 范围选择、年月切换导航、formatter 定制、超限提示 |
| `m-calendar-input` | 日历输入框：只读触发器 + 弹层选日期、选中值格式化回填、清空与禁用 |
| `m-calendar-popup` | 日历弹出框：m-popup + m-calendar，确认后自动关闭，支持方位、圆角、面板高度与安全区配置 |
| `m-date-picker` | 日期选择：年 / 月 / 日滚轮、列组合、min / max 区间、filter / formatter、顶部栏与只读加载态 |
| `m-date-picker-input` | 日期输入框：只读触发器 + 弹层选择、按列组合格式化回填、清空与禁用 |
| `m-date-picker-popup` | 日期选择弹出框：m-popup + 日期面板，确认 / 取消后自动关闭，支持方位、圆角与安全区配置 |
| `m-date-range-picker` | 日期范围选择：开始 / 结束两段标题复用一个日期滚轮，确认时自动升序，支持区间、过滤格式化与快捷选项插槽 |
| `m-date-range-picker-input` | 日期范围输入框：只读触发器 + 弹层选择、按 outlet-format 回填「起 - 止」 |
| `m-date-range-picker-popup` | 日期范围弹出框：m-popup + 日期范围面板，确认 / 取消后自动关闭 |
| `m-date-strip` | 日期横条：横向连续日期、单选 / 多选 / 范围、value-format 字符串绑定、农历文案、过滤禁用、插槽定制 |
| `m-lunar-picker` | 农历选择：农历年 / 月（含闰月）/ 日滚轮、干支生肖年列、列组合、min / max 反向映射，对外值为公历 Date |
| `m-lunar-picker-input` | 农历输入框：只读触发器 + 农历弹层，回填农历文案（如 2026年六月十五） |
| `m-lunar-picker-popup` | 农历选择弹出框：m-popup + 农历面板，确认 / 取消后自动关闭 |
| `m-time-picker` | 时间选择：时 / 分 / 秒滚轮、列组合、分钟与秒步长、min / max 时刻、12/24 小时制（12 制附上午下午列） |
| `m-time-picker-input` | 时间输入框：只读触发器 + 弹层选择，回填 HH:mm（含秒为 HH:mm:ss） |
| `m-time-picker-popup` | 时间弹出框：m-popup + 时间面板，确认 / 取消后自动关闭 |
| `m-time-range-picker` | 时间范围选择：开始 / 结束两段标题复用一个时间滚轮，确认时自动升序，支持步长、时刻区间、12 小时制与快捷选项插槽 |
| `m-time-range-picker-input` | 时间范围输入框：只读触发器 + 弹层选择，以「起 - 止」回填 |
| `m-time-range-picker-popup` | 时间范围弹出框：m-popup + 时间范围面板，确认 / 取消后自动关闭 |

### 反馈组件

| 组件 | 说明 |
| --- | --- |
| `m-fab` / `m-fab-item` | 悬浮按钮：四角定位、点击展开扩展按钮列表、遮罩与拖拽吸附、v-model:offset 位置受控 |
| `m-loading` | 加载：circular / spinner 双形态、自定义颜色与尺寸、带文案、自定义图标插槽 |
| `m-overlay` | 遮罩层：show 驱动、z-index / duration、嵌入内容、Web 端 body 滚动锁，弹窗类组件基础 |
| `m-popup` | 弹出层：五方位、round 分侧圆角、closeable、遮罩定制、before-close 拦截、v-model:show |
| `m-toast` | 轻提示：函数式 API（showToast 系列）+ 组件式双形态、四类型三方位、遮罩与点击拦截 |

### 数据展示

| 组件 | 说明 |
| --- | --- |
| `m-badge` | 徽标：数字 / 文案 / 点、max 截断、语义色与色值、四角位置与偏移、独立形态 |
| `m-cell` / `m-cell-group` | 单元格与分组：title / value / label、图标、四向箭头、必填星号、inset 圆角卡片分组 |

### 导航组件

| 组件 | 说明 |
| --- | --- |
| `m-tabs` / `m-tab` | 标签页：line / card / pill 三种风格、索引与 name 混用匹配、标签栏横向滚动、内容转场与手势切换、吸顶、scrollspy、切换前拦截 |

</details>

## 为多端而生的实现

| 机制 | 做法 | 收益 |
| --- | --- | --- |
| 主题变量 | 组件样式顶层 `@import vars.scss`，全部变量 `!default` | 用户根 `uni.scss` 定义同名变量即覆盖，零配置有默认主题 |
| 0.5px 细边框 | 绝对定位 0.5px 层 + `transform: scale(0.5)`，`transform-origin: 0 0` | App / Web / 小程序一致的 hairline，无模糊无偏移 |
| 动画 | 统一 `UniElement.animate` | 不依赖 `@keyframes`，三端同源 |
| 平台差异 | 条件编译（`#ifdef APP-ANDROID / WEB / MP-WEIXIN` 等）隔离 | 差异收敛在库内，业务代码不感知 |
| 样式写法 | 只用 class 选择器 + flex，规则扁平书写 | 规避 ucss 不支持后代选择器与伪元素 |
| 类型 | UTS 强类型，可空用 `null`，回调用箭头函数 | Web / App 编译期即暴露类型问题 |

## 平台支持

| 平台 | 状态 | 说明 |
| --- | --- | --- |
| Web | ✅ 已实测 | HBuilderX 编译运行，渲染 / 事件 / 主题覆盖矩阵与逐组件场景浏览器实测通过 |
| App-Android | ✅ 云打包验证 | 蒸汽与 VDOM 双模式云打包编译通过；0.7.0 修复两轮 Kotlin 编译错误后重新出包，真机演示 App 随版本发布 |
| App-iOS | 🔧 已适配 | 代码条件编译适配，待真机实测（需 macOS 环境） |
| App-HarmonyOS | 🔧 已适配 | 代码条件编译适配，待实测（需 DevEco Studio） |
| 微信小程序 | 🔧 基线已实测 | 遮罩显隐 / 弹层 / 字体加载等基线问题已实测修复，0.7.0 修复弹层组件 `getCurrentInstance` 空实例崩溃（issue #20），0.7.1 修复图标字体加载（issue #22），新组件随版本陆续实测 |
| 其他小程序 | 🔧 已适配 | 代码条件编译适配，待开发者工具实测 |

完整说明（HBuilderX 版本要求、蒸汽模式配置、平台差异处理）见[平台兼容性](https://mengxi-studio.github.io/unix-ui/guide/compatibility.html)。

## 真机与在线体验

- **浏览器直接体验**：文档站的[在线演示](https://mengxi-studio.github.io/unix-ui/playground/)，每个组件一页，穷举全部 props / 变体 / 事件。
- **Android 真机**：[下载演示 App（APK）](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1795255930231-__UNI__F1AA560_1795255914654.apk)——云打包产物，覆盖全部组件的真实原生渲染效果；安装包随版本更新重新打包，链接以最新发版说明为准。
- **源码即文档**：示例工程 [packages/playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground) 的每个演示页都是可运行的最佳实践。

## 工程与共建

```
unix-ui/
├── packages/
│   ├── core/            # 组件源码（唯一真源，发布为 @meng-xi/unix-ui）
│   │   ├── components/  # m-* 组件目录
│   │   ├── utils/       # 公共工具函数（日期工具集等）
│   │   └── theme/       # vars.scss 主题变量
│   ├── playground/      # 演示工程（uni_modules/m-ui-x 为同步产物）
│   └── docs/            # VitePress 双语文档站
├── scripts/             # sync-uni-modules.mjs 等工程脚本
└── versions/            # 各版本发布说明
```

```bash
pnpm install
pnpm sync:uni-modules        # core → playground/uni_modules/m-ui-x
pnpm sync:uni-modules:check  # 校验同步产物一致性
pnpm dev:docs                # 启动文档站
pnpm build:docs              # 构建文档站（含死链检查）
```

- 组件源码只改 `packages/core`；`playground/uni_modules/m-ui-x/` 下的 `components` / `utils` / `theme` 为同步产物，手改会在下次同步时被覆盖。
- 演示工程用 HBuilderX 打开 `packages/playground` 运行；新增组件按「组件 → 主题 → 同步 → 演示 → 文档」顺序落码。
- 欢迎通过 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / [Pull Requests](https://github.com/MengXi-Studio/unix-ui/pulls) 参与共建；如果这个库帮你省下了时间，点个 **Star** 是最好的支持。

## 文档

📖 完整文档从入门到精通（指南 + 组件参考 + 更新日志，中英双语）：

**[https://mengxi-studio.github.io/unix-ui/](https://mengxi-studio.github.io/unix-ui/)**

阅读建议：先看[介绍](https://mengxi-studio.github.io/unix-ui/guide/introduction.html)与[快速上手](https://mengxi-studio.github.io/unix-ui/guide/getting-started.html)，再看[主题定制](https://mengxi-studio.github.io/unix-ui/guide/theming.html)掌握覆盖机制，组件细节查[组件参考](https://mengxi-studio.github.io/unix-ui/components/button.html)。

## 交流与支持

想了解设计思路与实现原理（编译期主题变量注入、hairline 跨端方案、UTS 组件开发等）？关注公众号「**梦曦工作室**」（上方二维码）。

- 🐛 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / 💬 [Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)
- 📝 [更新日志](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md)

## License

[MIT](./LICENSE)
