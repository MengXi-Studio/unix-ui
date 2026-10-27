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

[![license](https://img.shields.io/github/license/MengXi-Studio/unix-ui.svg)](./license.md) [![npm](https://img.shields.io/npm/v/@meng-xi/unix-ui?color=blue)](https://www.npmjs.com/package/@meng-xi/unix-ui)
![npm](https://img.shields.io/npm/dt/@meng-xi/unix-ui?color=green)
</div>

## 为什么是 unix-ui

直接用 uni-app x 的原生 `view` / `text` 搭界面，按钮的按压反馈与加载态、0.5px 细边框、文本单行 / 多行省略、徽标截断与偏移……每一处交互细节都要手写，App / Web / 小程序还要逐端调样式。unix-ui 把这些重复劳动收敛成一套开箱即用的组件：

- **用过主流 uni-app 组件库？** 组件划分、props 命名、视觉规格全面对齐，心智零迁移，看一眼 API 就能上手；
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

## 安装

**npm**——安装后将包内容同步到工程 `uni_modules/m-ui-x/`（编译器不扫描 node_modules）：

```bash
pnpm add @meng-xi/unix-ui
mkdir -p uni_modules && cp -R node_modules/@meng-xi/unix-ui uni_modules/m-ui-x
```

> `packages/core` 为标准 **uni_modules 组件插件**（插件 id：`m-ui-x`，目录名须与之一致），业务侧零配置 easycom 导入；若采用其他目录名或直接引用 node_modules，需在 `pages.json` 中自行配置 easycom 规则。

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

全部可用变量见 [theme/vars.scss](./theme/vars.scss)，按 `$m-<组件>-<属性>` 命名。

## 组件清单

| 组件 | 说明 |
| --- | --- |
| m-button | 按钮：语义色 type、plain / disabled / loading、四档尺寸、block、hairline 细边框、按压反馈 |
| m-cell / m-cell-group | 单元格与分组：title / value / label、图标、四向箭头、inset 圆角卡片分组 |
| m-row / m-col | 栅格布局：gutter 间距、对齐、换行 |
| m-icon | 图标：250+ 常用图标（ttf 随包分发）、颜色尺寸、自定义图标插槽 |
| m-image | 图片：mode 直通、加载 / 失败占位、淡入过渡、圆形、懒加载 |
| m-text | 文本：语义色 / 色值双模式、三档字号、单行省略、多行截断、可选中 |
| m-space | 间距：方向 / 换行 / 对齐，size 单值或双值（行 / 列）分写 |
| m-loading | 加载：circular / spinner 双形态、自定义色与尺寸、带文案 |
| m-badge | 徽标：数字 / 点、max 截断、语义色与色值、位置偏移、独立形态 |

## 在线演示

示例工程 [packages/playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground)（每个组件一页穷举全部 props / 变体 / 事件的可运行验证矩阵），部署于文档站的[在线演示](https://mengxi-studio.github.io/unix-ui/playground/)，浏览器可直接体验。

**Android 真机体验**：[下载演示 App（APK）](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1793059625238-__UNI__F1AA560_1793059613497.apk)——云打包产物（Android），覆盖全部组件的真实原生渲染效果；安装包随版本更新重新打包，链接以最新发版说明为准。

## 交流与支持

想了解设计思路与实现原理（编译期主题变量注入、hairline 跨端方案、UTS 组件开发等）？公众号「**梦曦工作室**」有系列解析，扫码关注：

<p align="center">
  <img alt="微信公众号 二维码" width="180" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/QR_code.jpg">
</p>

- 🐛 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / 💬 [Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)

## 文档

📖 从入门到精通的完整文档（指南 + 组件参考 + 更新日志，中英双语）：

**[https://mengxi-studio.github.io/unix-ui/](https://mengxi-studio.github.io/unix-ui/)**

阅读建议：先看[介绍](https://mengxi-studio.github.io/unix-ui/guide/introduction.html)与[快速上手](https://mengxi-studio.github.io/unix-ui/guide/getting-started.html)，再看[主题定制](https://mengxi-studio.github.io/unix-ui/guide/theming.html)掌握覆盖机制，组件细节查[组件参考](https://mengxi-studio.github.io/unix-ui/components/button.html)。

## 更新日志

📝 **[https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md)**

## License

[MIT](./LICENSE)
