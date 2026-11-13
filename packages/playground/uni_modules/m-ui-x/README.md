<img alt="梦曦工作室 Logo" width="180" src="https://raw.githubusercontent.com/MengXi-Studio/unix-ui/master/packages/docs/src/public/logo.png">

# m-ui-x

为 uni-app x 提供功能完善的 UI 组件库（UTS + uvue 编写，一套组件多端覆盖）。

**m-ui-x** 是开源项目 [unix-ui](https://github.com/MengXi-Studio/unix-ui) 的 uni_modules 插件发行版（npm 包名 [`@meng-xi/unix-ui`](https://www.npmjs.com/package/@meng-xi/unix-ui)），内置 46 个组件（含子组件），覆盖基础、布局、表单、反馈、数据展示与导航六类场景，把原生开发的交互细节（按压反馈、0.5px 细边框、文本省略、徽标截断……）与多端差异一次收敛。

## 目录

- [特性](#特性)
- [环境要求](#环境要求)
- [平台兼容性](#平台兼容性)
- [快速开始](#快速开始)
- [组件清单](#组件清单)
- [工具函数](#工具函数)
- [文档与演示](#文档与演示)
- [更新记录](#更新记录)
- [交流与支持](#交流与支持)
- [开源协议](#开源协议)

## 特性

- **easycom 零注册**：`<m-button>` 标签直接使用，无需 import 与手动注册
- **多端覆盖，vapor 兼容**：一套组件源码覆盖 App（Android / iOS / HarmonyOS）、Web、微信小程序，支持蒸汽模式（vapor）
- **编译期主题定制**：全部视觉参数以 `$m-*` SCSS 变量（全 `!default`）收敛，在根 `uni.scss` 定义同名变量即覆盖，零运行时开销
- **跨端一致的小屏细节**：0.5px hairline 细边框（transform 缩放方案）、按压反馈等平台差异由库内统一处理
- **组合式 API + 强类型 UTS**：props / events 全量类型标注，UTS / TS 提示到位；动画走 `UniElement.animate`，无 `@keyframes` 依赖
- **无全局副作用**：组件样式自包含，无全局样式注入，随用随取

## 环境要求

- HBuilderX `5.08` 及以上（uni-app x 编译器）
- uni-app x 项目（App / Web / 小程序均可）
- 建议启用样式隔离策略 2.0，兼容蒸汽模式（vapor）编译

## 平台兼容性

| App-Android | App-iOS | App-HarmonyOS | Web（Chrome / Safari） | 微信小程序 |
| :---------: | :-----: | :-----------: | :--------------------: | :--------: |
|      √      |    √    |       √       |           √            |     √      |

> 状态说明：Web 与 App-Android 已完整实测；App-iOS / App-HarmonyOS 已完成代码条件编译适配，待真机实测；微信小程序基线场景（遮罩显隐、弹层、字体加载）已实测修复，新组件随版本陆续验证；其他小程序已条件编译适配，待开发者工具实测。

## 快速开始

### 1. 导入插件

在 HBuilderX 中通过插件市场「导入插件」安装，插件位于工程 `uni_modules/m-ui-x/`；也可从 npm 安装 `@meng-xi/unix-ui` 后将包内容复制到 `uni_modules/m-ui-x/`。

> 插件 id 为 `m-ui-x`，目录名须与之一致，否则 easycom 无法自动匹配。

### 2. 使用组件

easycom 自动导入，模板中直接书写标签：

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

### 3. 主题定制（可选）

在工程根 `uni.scss` 中**直接定义**同名变量即可覆盖默认值（编译期 `!default` 叠加，无需引入任何文件）：

```scss
/* 常规按钮高度 44px → 48px */
$m-button-normal-height: 48px;
```

> 请勿在 `uni.scss` 中 `@import` 插件内 `vars.scss`——`uni.scss` 会注入每个组件样式，与组件内引用同一文件会触发 sass 循环导入。

全部可用变量见 [theme/vars.scss](./theme/vars.scss)，按 `$m-<组件>-<属性>` 命名。

## 组件清单

共 46 个组件（含子组件），按 6 大类组织；表中列出组件标签与核心能力，完整 API 见[组件参考](https://mengxi-studio.github.io/unix-ui/components/button.html)。

### 基础组件

| 组件 | 说明 |
| --- | --- |
| m-button | 按钮：语义色 type、plain / disabled / loading、四档尺寸、block、hairline 细边框、按压反馈 |
| m-icon | 图标：内置 257 个字体图标（ttf 随包分发）、颜色尺寸、自定义图标插槽 |
| m-image | 图片：mode 直通、加载 / 失败占位、淡入过渡、圆形、懒加载、点击预览 |
| m-text | 文本：语义色 / 色值双模式、三档字号、单行省略、多行截断、可选中 |

### 布局组件

| 组件 | 说明 |
| --- | --- |
| m-compact | 紧凑布局：按钮 / 输入框圆角衔接与边框合并、block / direction、动态增删自动重排 |
| m-divider | 分割线：水平 / 垂直、dashed 虚线、hairline 0.5px 细线、内容位置 |
| m-flex / m-flex-item | 弹性布局：排列方向、三档与自定义间距、主轴 / 交叉轴对齐、自动换行、flex 简写 |
| m-grid / m-grid-item | 宫格：自定义列数、正方形格子、gutter 间距、完整边框、徽标联动、页面跳转 |
| m-row / m-col | 24 栅格布局：gutter 间距、对齐、换行、份数宽度与偏移 |
| m-space / m-space-item | 间距：方向 / 换行 / 对齐，size 单值或双值（行 / 列）分写 |
| m-status-bar | 状态栏占位：为贴顶元素预留系统状态栏高度、自定义高度与背景样式 |
| m-sticky / m-sticky-box | 粘性布局：吸顶 / 吸底、容器边界约束、吸附状态事件 |
| m-waterfall / m-waterfall-item / m-waterfall-load | 瀑布流：按内容实际高度多列排列、列数与间距、已知宽高占位、动态增删与重新排版 |

### 表单组件

| 组件 | 说明 |
| --- | --- |
| m-calendar | 日历面板：单选 / 多选 / 范围选择、年月切换导航、formatter 定制、超限提示 |
| m-calendar-popup | 日历弹出框：m-popup + m-calendar，确认后自动关闭，支持方位、圆角、面板高度与安全区配置 |
| m-calendar-input | 日历输入框：只读触发器 + 弹层选日期、选中值格式化回填、清空与禁用 |
| m-cascader | 级联选择：多级联动、层级 tab 与手势滑动、field-names 字段映射、异步加载、四插槽 |
| m-cascader-popup | 级联弹出框：m-popup + m-cascader，选完最后一级自动关闭 |
| m-cascader-input | 级联输入框：只读触发器 + 弹层选择、选中路径文字回填、清空与禁用 |
| m-checkbox / m-checkbox-group | 复选框：组容器 + 单项双形态、形状 / 颜色 / 大小定制、max 限制、indeterminate 全选 |
| m-checkbox-popup | 复选弹出框：底部弹层多选，options 数组驱动 + field-names 映射 + footer 插槽 |
| m-checkbox-input | 复选输入框：只读触发器 + 弹层多选、「、」连接回显、超 2 项截断、自绘清空 |
| m-color-picker | 颜色选择器：饱和度-明度面板 + 色相 / 透明度滑块，hex / rgb / hsl 输出、预设色、最近色、Web 端吸管取色 |
| m-color-picker-popup | 颜色选择器弹出框：取消 / 标题 / 确定头部，确定后回写、取消与遮罩关闭丢弃 |
| m-color-picker-input | 颜色选择器输入框：只读触发器 + 左侧色块预览 + 弹层选色、可选字段标签与清空 |
| m-date-strip | 日期横条：横向连续日期、单选 / 多选 / 范围、value-format 字符串绑定、农历文案、过滤禁用、插槽定制 |
| m-input | 输入框：六种类型、clearable 两时机、formatter / precision / min-max 收敛、明文切换、字数统计、多行自适应、前后插槽 |

### 反馈组件

| 组件 | 说明 |
| --- | --- |
| m-fab / m-fab-item | 悬浮按钮：四角定位、点击展开扩展按钮列表、遮罩与拖拽吸附、v-model:offset 位置受控 |
| m-loading | 加载：circular / spinner 双形态、自定义颜色与尺寸、带文案、自定义图标插槽 |
| m-overlay | 遮罩层：show 驱动、z-index / duration、嵌入内容、Web 端 body 滚动锁，弹窗类组件基础 |
| m-popup | 弹出层：五方位、round 分侧圆角、closeable、遮罩定制、before-close 拦截、v-model:show |
| m-toast | 轻提示：函数式 API（showToast 系列）+ 组件式双形态、四类型三方位、遮罩与点击拦截 |

### 数据展示

| 组件 | 说明 |
| --- | --- |
| m-badge | 徽标：数字 / 文案 / 点、max 截断、语义色与色值、四角位置与偏移、独立形态 |
| m-cell / m-cell-group | 单元格与分组：title / value / label、图标、四向箭头、必填星号、inset 圆角卡片分组 |

### 导航组件

| 组件 | 说明 |
| --- | --- |
| m-tabs / m-tab | 标签页：line / card / pill 三种风格、索引与 name 混用匹配、标签栏横向滚动、内容转场与手势切换、吸顶、scrollspy、切换前拦截 |

## 工具函数

插件内置与组件同源的日期工具集（`utils/date.uts`，69 个纯函数：比较、算术、周月年边界、格式化解析、农历换算）：

```ts
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/index.uts'
```

## 文档与演示

- 📖 完整文档（指南 + 组件参考 + 更新日志，中英双语）：[https://mengxi-studio.github.io/unix-ui/](https://mengxi-studio.github.io/unix-ui/)
- 💻 在线演示（浏览器直接体验）：[Playground](https://mengxi-studio.github.io/unix-ui/playground/)
- 📱 Android 真机体验：[下载演示 App（APK）](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1794590278532-__UNI__F1AA560_1794590268233.apk)

## 更新记录

完整更新记录见 [changelog.md](./changelog.md)。近期版本主要新增：

- 颜色选择器三件套：m-color-picker / m-color-picker-popup / m-color-picker-input
- 复选框四组件：m-checkbox-group / m-checkbox / m-checkbox-popup / m-checkbox-input
- 悬浮按钮 m-fab / m-fab-item、日期横条 m-date-strip
- 标签页 m-tabs / m-tab、级联选择三件套 m-cascader / m-cascader-popup / m-cascader-input
- 布局组件 m-flex、m-sticky / m-sticky-box、m-status-bar、m-waterfall
- 日期工具函数集 `utils/date.uts`

## 交流与支持

想了解设计思路与实现原理（编译期主题变量注入、hairline 跨端方案、UTS 组件开发等）？公众号「**梦曦工作室**」有系列解析，扫码获取更多信息：

<img alt="微信公众号二维码" width="180" src="https://raw.githubusercontent.com/MengXi-Studio/unix-ui/master/packages/docs/src/public/QR_code.jpg">

- 🐛 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / 💬 [Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)
- 🌐 官网：[mengxi-studio.github.io](https://mengxi-studio.github.io/.github/)

## 开源协议

[MIT](./LICENSE) © MengXi-Studio
