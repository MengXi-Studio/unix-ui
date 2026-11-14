**中文** | [English](./README-en.md)

<div align="center">
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="梦曦工作室 Logo" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/logo.png">
  </a>
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="微信公众号 二维码" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/QR_code.jpg">
  </a>

  <h1>@meng-xi/unix-ui</h1>
  <p>为 uni-app x 提供功能完善的 UI 组件库（UTS + uvue 编写，一套组件多端覆盖）</p>

[![license](https://img.shields.io/github/license/MengXi-Studio/unix-ui.svg)](./LICENSE) [![npm](https://img.shields.io/npm/v/@meng-xi/unix-ui?color=blue)](https://www.npmjs.com/package/@meng-xi/unix-ui) ![npm](https://img.shields.io/npm/dt/@meng-xi/unix-ui?color=green)

[文档](https://mengxi-studio.github.io/unix-ui/) · [在线演示](https://mengxi-studio.github.io/unix-ui/playground/) · [更新日志](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md) · [示例工程](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground)
</div>

## 目录

- [为什么是 unix-ui](#为什么是-unix-ui)
- [特性](#特性)
- [环境要求](#环境要求)
- [安装](#安装)
- [快速开始](#快速开始)
- [组件清单](#组件清单)
- [平台兼容性](#平台兼容性)
- [在线演示](#在线演示)
- [项目结构](#项目结构)
- [本地开发](#本地开发)
- [文档](#文档)
- [交流与支持](#交流与支持)

## 为什么是 unix-ui

直接用 uni-app x 的原生 `view` / `text` 搭界面，按钮的按压反馈与加载态、0.5px 细边框、文本单行 / 多行省略、徽标截断与偏移……每一处交互细节都要手写，App / Web / 小程序还要逐端调样式。unix-ui 把这些重复劳动收敛成一套开箱即用的组件：

- **用过主流 uni-app 组件库？** 组件划分、props 命名、视觉规格遵循主流习惯，心智零迁移，看一眼 API 就能上手；
- **多端发布？** UTS + uvue 一套源码，编译到 App（Android / iOS / HarmonyOS）、Web、小程序，hairline 细边框、滚动容器等平台差异由库内确定性实现，不用逐端排查；
- **在意主题？** 全部视觉参数收敛为 `$m-*` SCSS 变量，编译期注入，根 `uni.scss` 改一行全组件生效，零运行时开销。

底层只依赖 uni-app x 内置组件与 `UniElement.animate`，不重造渲染栈；UTS 源码分发（Web / 小程序 → JS，Android → Kotlin，iOS → Swift），由 uni-app x 编译链现场编译。

## 特性

- **easycom 零注册** - 遵循 uni_modules 组件插件规范（插件 id：`m-ui-x`），`<m-button>` 标签直接使用，无需 import 与手动注册
- **多端覆盖，vapor 兼容** - 一套组件源码覆盖 App（Android / iOS / HarmonyOS）、Web、小程序，兼容蒸汽模式（vapor）
- **编译期主题定制** - 全部视觉参数以 `$m-*` 变量（全 `!default`）收敛在 `theme/vars.scss`，在根 `uni.scss` 直接定义同名变量即覆盖，不定义则零配置使用默认主题
- **跨端一致的小屏细节** - 0.5px hairline 细边框（transform 缩放方案）、按压反馈等平台差异由库内统一处理
- **组合式 API + 强类型 UTS** - props / events 全量类型标注，UTS / TS 提示到位；动画走 `UniElement.animate`，无 `@keyframes` 依赖
- **无全局副作用** - 组件样式自包含，仅引用同包 `vars.scss`；无全局样式注入，随用随取

## 环境要求

- HBuilderX `5.08` 及以上（uni-app x 编译器）
- 可选：Node.js + pnpm（npm 方式安装，或参与本仓库开发时）
- 建议启用样式隔离策略 2.0；兼容蒸汽模式（vapor）编译，详见[平台兼容性](#平台兼容性)

## 安装

### 方式一：uni_modules（推荐）

将组件库放入工程的 `uni_modules/m-ui-x/` 目录（插件市场导入或手动拷贝），easycom 自动扫描，**无需任何配置**：

```
uni_modules/m-ui-x/
├── components/
├── utils/
└── theme/
```

> 插件 id 为 `m-ui-x`，目录名须与之一致，否则 easycom 无法自动匹配。

### 方式二：npm

```bash
pnpm add @meng-xi/unix-ui
```

安装后将包内容同步到工程 `uni_modules/m-ui-x/`（编译器不扫描 node_modules）：

```bash
mkdir -p uni_modules && cp -R node_modules/@meng-xi/unix-ui uni_modules/m-ui-x
```

也可在 `pages.json` 中配置 easycom 规则指向包路径，详见[安装文档](https://mengxi-studio.github.io/unix-ui/guide/installation.html)。

### 验证安装

在任意页面模板中直接使用，无需 import 与注册：

```html
<template>
  <m-button type="primary">安装成功</m-button>
</template>
```

## 快速开始

### 1. 在模板中使用组件

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

### 2. 主题定制（可选）

在工程根 `uni.scss` 中**直接定义**同名变量即可覆盖默认值（编译期 `!default` 叠加，无需引入任何文件）：

```scss
/* 常规按钮高度 44px → 48px */
$m-button-normal-height: 48px;
```

> 请勿在 `uni.scss` 中 `@import` 包内 `vars.scss`——`uni.scss` 会注入每个组件样式，与组件内引用同一文件会触发 sass 循环导入。

全部可用变量见 [theme/vars.scss](./packages/core/theme/vars.scss)，按 `$m-<组件>-<属性>` 命名；机制细节见[主题定制](https://mengxi-studio.github.io/unix-ui/guide/theming.html)。

## 组件清单

共 46 个组件（含子组件），按 6 大类组织，与文档站侧栏分组一一对应；表中列出组件标签与核心能力，完整 API 见[组件参考](https://mengxi-studio.github.io/unix-ui/components/button.html)。

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

### 表单组件

| 组件 | 说明 |
| --- | --- |
| `m-calendar` | 日历面板：单选 / 多选 / 范围选择、年月切换导航、formatter 定制、超限提示 |
| `m-calendar-popup` | 日历弹出框：m-popup + m-calendar，确认后自动关闭，支持方位、圆角、面板高度与安全区配置 |
| `m-calendar-input` | 日历输入框：只读触发器 + 弹层选日期、选中值格式化回填、清空与禁用 |
| `m-cascader` | 级联选择：多级联动、层级 tab 与手势滑动、field-names 字段映射、异步加载、四插槽 |
| `m-cascader-popup` | 级联弹出框：m-popup + m-cascader，选完最后一级自动关闭 |
| `m-cascader-input` | 级联输入框：只读触发器 + 弹层选择、选中路径文字回填、清空与禁用 |
| `m-checkbox` / `m-checkbox-group` | 复选框：组容器 + 单项双形态、形状 / 颜色 / 大小定制、max 限制、indeterminate 全选 |
| `m-checkbox-popup` | 复选弹出框：底部弹层多选，options 数组驱动 + field-names 映射 + footer 插槽 |
| `m-checkbox-input` | 复选输入框：只读触发器 + 弹层多选、「、」连接回显、超 2 项截断、自绘清空 |
| `m-color-picker` | 颜色选择器：饱和度-明度面板 + 色相 / 透明度滑块，hex / rgb / hsl 输出、预设色、最近色、Web 端吸管取色 |
| `m-color-picker-popup` | 颜色选择器弹出框：取消 / 标题 / 确定头部，确定后回写、取消与遮罩关闭丢弃 |
| `m-color-picker-input` | 颜色选择器输入框：只读触发器 + 左侧色块预览 + 弹层选色、可选字段标签与清空 |
| `m-date-strip` | 日期横条：横向连续日期、单选 / 多选 / 范围、value-format 字符串绑定、农历文案、过滤禁用、插槽定制 |
| `m-input` | 输入框：六种类型、clearable 两时机、formatter / precision / min-max 收敛、明文切换、字数统计、多行自适应、前后插槽 |

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

> 另有与组件同源的日期工具集（`utils/date.uts`，69 个纯函数：比较、算术、周月年边界、格式化解析、农历换算），详见[日期工具](https://mengxi-studio.github.io/unix-ui/tools/date.html)。

## 平台兼容性

| 平台 | 状态 | 说明 |
| --- | --- | --- |
| Web | ✅ 已实测 | HBuilderX 编译运行，渲染 / 事件 / 主题覆盖矩阵与逐组件场景浏览器实测通过 |
| App-Android | ✅ 云打包验证 | 蒸汽与 VDOM 双模式云打包编译通过，真机演示 App 随版本发布 |
| App-iOS | 🔧 已适配 | 代码条件编译适配，待真机实测（需 macOS 环境） |
| App-HarmonyOS | 🔧 已适配 | 代码条件编译适配，待实测（需 DevEco Studio） |
| 微信小程序 | 🔧 基线已实测 | 遮罩显隐 / 弹层 / 字体加载等基线问题已实测修复，新组件随版本陆续实测 |
| 其他小程序 | 🔧 已适配 | 代码条件编译适配，待开发者工具实测 |

完整说明（HBuilderX 版本要求、蒸汽模式配置、平台差异处理）见[平台兼容性](https://mengxi-studio.github.io/unix-ui/guide/compatibility.html)。

## 在线演示

示例工程 [packages/playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground) 为每个组件提供一页穷举全部 props / 变体 / 事件的可运行验证矩阵，部署于文档站的[在线演示](https://mengxi-studio.github.io/unix-ui/playground/)，浏览器可直接体验。

**Android 真机体验**：[下载演示 App（APK）](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1794590278532-__UNI__F1AA560_1794590268233.apk)——云打包产物，覆盖全部组件的真实原生渲染效果；安装包随版本更新重新打包，链接以最新发版说明为准。

## 项目结构

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

## 本地开发

```bash
pnpm install
pnpm sync:uni-modules        # core → playground/uni_modules/m-ui-x
pnpm sync:uni-modules:check  # 校验同步产物一致性
pnpm dev:docs                # 启动文档站
pnpm build:docs              # 构建文档站（含死链检查）
```

- 组件源码只改 `packages/core`；`packages/playground/uni_modules/m-ui-x/` 下的 `components` / `utils` / `theme` 为同步产物，手改会在下次同步时被覆盖。
- 演示工程需用 HBuilderX 打开 `packages/playground` 运行；新增组件按「组件 → 主题 → 同步 → 演示 → 文档」顺序落码。
- 欢迎通过 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / [Pull Requests](https://github.com/MengXi-Studio/unix-ui/pulls) 参与共建。

## 文档

📖 从入门到精通的完整文档（指南 + 组件参考 + 更新日志，中英双语）：

**[https://mengxi-studio.github.io/unix-ui/](https://mengxi-studio.github.io/unix-ui/)**

阅读建议：先看[介绍](https://mengxi-studio.github.io/unix-ui/guide/introduction.html)与[快速上手](https://mengxi-studio.github.io/unix-ui/guide/getting-started.html)，再看[主题定制](https://mengxi-studio.github.io/unix-ui/guide/theming.html)掌握覆盖机制，组件细节查[组件参考](https://mengxi-studio.github.io/unix-ui/components/button.html)。

## 交流与支持

想了解设计思路与实现原理（编译期主题变量注入、hairline 跨端方案、UTS 组件开发等）？关注公众号「**梦曦工作室**」（上方二维码）。

- 🐛 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / 💬 [Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)
- 📝 [更新日志](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md)

## License

[MIT](./LICENSE)
