# 介绍

**unix-ui**（`@meng-xi/unix-ui`）是一个面向 [uni-app x](https://doc.dcloud.net.cn/uni-app-x/) 的 UI 组件库，使用 UTS + uvue 编写，编译为各端原生代码，不依赖任何 Web 运行时。

## 特性

- **easycom 自动导入**：遵循 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html)，组件免 import、免注册
- **默认主题内置**：组件自带默认主题，零配置可用；需要定制时在 `uni.scss` 定义变量即可，详见[主题定制](/guide/theming)
- **多端兼容**：App（Android / iOS / HarmonyOS）、Web、小程序，兼容[蒸汽模式](/guide/compatibility#蒸汽模式)（vapor）
- **原生渲染**：0.5px 细边框、加载动画等细节全部基于原生能力实现，各端视觉一致
- **UTS 强类型**：Props / Events 全部静态类型，编译期拦截错误
- **API 对标 Vant**：组件命名、Props、交互语义与 [Vant](https://vant-ui.github.io/vant/) 保持一致，迁移零心智成本

## 与 uni-ui / Vant 的关系

| | unix-ui | uni-ui | Vant |
| --- | --- | --- | --- |
| 目标框架 | uni-app x（UTS/uvue） | uni-app（Vue） | Web（Vue） |
| 渲染方式 | 原生渲染 | 混合渲染 | DOM |
| 交互与 API 风格 | 对齐 Vant | 自成一派 | — |
| 主题机制 | 编译期 SCSS 变量 | SCSS 变量 | CSS 变量 |

unix-ui 借鉴 Vant 的组件设计与交互规范，但针对 uni-app x 的原生渲染与 UTS 强类型约束重新实现（例如文字必须置于 `<text>`、无伪元素、无 `@keyframes`）。

## 学习路径

| 阶段 | 内容 |
| --- | --- |
| 入门 | [安装](/guide/installation) → [快速上手](/guide/getting-started) |
| 基础 | [主题定制](/guide/theming) |
| 进阶 | [平台兼容性](/guide/compatibility) → [常见问题](/guide/faq) |
| 参考 | [Button 按钮](/components/button) → [更新日志](/changelog) |
