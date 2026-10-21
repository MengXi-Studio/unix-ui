# @meng-xi/unix-ui

为 uni-app x 提供功能完善的 UI 组件库。

## 特性

- 基于 uni-app x（UTS + uvue）开发，支持 App（Android / iOS / HarmonyOS）、Web、小程序多端
- 兼容蒸汽模式（vapor）
- 遵循 uni_modules 组件插件规范，easycom 自动导入，无需手动注册
- 主题变量通过全局 uni.scss 注入，支持编译期定制与运行时覆盖

## 安装

```bash
npm install @meng-xi/unix-ui
```

## 使用

1. 在项目根 `uni.scss` 中引入主题变量（可选，不引入则使用默认主题）：

```scss
@import '@meng-xi/unix-ui/theme/vars.scss';
```

2. 直接在模板中使用组件（easycom 自动导入）：

```html
<template>
	<mxi-button type="primary" @click="onClick">主要按钮</mxi-button>
</template>
```

npm 安装方式需在 `pages.json` 中配置 easycom 规则；或直接将包内容复制 / 同步至项目 `uni_modules/mxi-ui-x` 目录实现零配置导入。

## 文档

详见文档站（packages/docs）。

## 许可证

[MIT](./license.md)
