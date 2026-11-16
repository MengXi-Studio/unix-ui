---
layout: home

title: unix-ui
titleTemplate: uni-app x UI 组件库

hero:
  name: unix-ui
  text: uni-app x 原生 UI 组件库
  tagline: 65 个组件覆盖 8 类场景，easycom 免注册即可使用；编译期主题零运行时开销，Web / App / 小程序一套代码
  image:
    src: /logo.svg
    alt: unix-ui
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/getting-started
    - theme: alt
      text: 浏览组件
      link: /components/button
    - theme: alt
      text: GitHub
      link: https://github.com/MengXi-Studio/unix-ui

features:
  - icon: 🧩
    title: easycom 零配置
    details: 遵循 uni_modules 组件插件规范，插件市场导入后模板直接使用 m-button，无需 import 与注册；npm 方式提供一条 easycom 规则解决
  - icon: 🎨
    title: 编译期主题
    details: 全部视觉参数为 $m-* SCSS 变量且带 !default，在根 uni.scss 直接定义同名变量即可全局覆盖，运行时零计算开销
  - icon: 📱
    title: 多端一套代码
    details: 支持 Web、App（Android / iOS / HarmonyOS）与小程序，兼容蒸汽模式（vapor）；平台差异在组件内部用条件编译隔离，业务代码无需判断平台
  - icon: ⚡
    title: 原生能力实现
    details: 0.5px 细边框用 scale(0.5) 缩放实现，加载动画走 UniElement.animate，不依赖任何 Web 专属能力，各端视觉一致
  - icon: 💪
    title: UTS 强类型
    details: Props 用 type 与 withDefaults 声明，Events 用具名元组声明，可空值统一为 null，编译期拦截类型错误
  - icon: 🗓️
    title: 完整的日期时间家族
    details: 日期、日期范围、时间、时间范围、农历与通用选择器均提供「面板 + 弹出框 + 输入框」三件套，并附带覆盖 1900–2100 的纯函数日期工具集
---

## 30 秒上手

```html
<!-- 模板中直接使用，无需 import 与注册 -->
<template>
	<m-button type="primary" size="large">主要按钮</m-button>
</template>
```

```scss
// 项目根 uni.scss：定义同名变量即可全局换肤（可选）
$m-color-primary: #10b981;
```

详细步骤见[安装](/guide/installation)与[快速上手](/guide/getting-started)。

## 组件分类

| 分类 | 代表组件 |
| --- | --- |
| 基础 / 布局 | 按钮、图标、图片、文本 / 紧凑布局、栅格、间距、粘性布局、瀑布流 |
| 数据录入 | 输入框、复选框、颜色选择器（均含弹出框与输入框组合形态） |
| 选择器 | 通用滚轮选择器、级联选择（含三件套与纯视图） |
| 日期时间 | 日历、日期 / 日期范围、时间 / 时间范围、农历选择、日期横条（含三件套） |
| 反馈 / 展示 / 导航 | 弹出层、遮罩、轻提示、加载、悬浮按钮 / 徽标、单元格 / 标签页 |

完整清单见左侧「组件」侧栏，效果可前往[在线演示](https://mengxi-studio.github.io/unix-ui/playground/)。

## 为什么选 unix-ui

- **不重造渲染栈**：只依赖 uni-app x 内置组件与运行时能力，升级 HBuilderX 不需要等待适配层
- **迁移成本低**：组件划分、Props 命名与视觉规格贴近主流 uni-app 组件库，换库不必重建心智模型
- **可持续维护**：单一真源（`packages/core`）+ 主题变量契约 + 双语文档与逐组件演示页，版本演进有据可查
