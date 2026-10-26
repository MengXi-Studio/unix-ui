---
layout: home

title: '@meng-xi/unix-ui'
titleTemplate: unix-ui 组件库

hero:
  name: '@meng-xi/unix-ui'
  text: uni-app x UI 组件库
  tagline: 为 uni-app x 提供功能完善的 UI 组件库，默认主题开箱即用，easycom 免注册使用
  image:
    src: /logo.svg
    alt: unix-ui
  actions:
    - theme: brand
      text: 快速上手
      link: /guide/getting-started
    - theme: alt
      text: 介绍
      link: /guide/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/MengXi-Studio/unix-ui

features:
  - icon: 🧩
    title: easycom 自动导入
    details: 遵循 uni_modules 组件插件规范，组件免 import、免注册，模板中直接使用；npm 安装方式提供 easycom custom 规则
  - icon: 🎨
    title: 主题可定制
    details: 默认主题开箱即用，零配置可用；在项目根 uni.scss 中直接定义 $m-* 变量即可编译期全局覆盖，!default 语义保证用户值优先
  - icon: 📱
    title: 多端兼容
    details: 支持 App（Android / iOS / HarmonyOS）、Web、小程序，兼容蒸汽模式（vapor + bytecode）；条件编译隔离平台差异
  - icon: ⚡
    title: 原生渲染
    details: UTS + uvue 编译为原生代码；0.5px 细边框用 scale(0.5) 实现，加载动画走 UniElement.animate，不依赖任何 Web 专属能力
  - icon: 💪
    title: UTS 强类型
    details: Props 用 type 定义 + withDefaults 默认值，Events 用具名元组声明，严格类型无隐式转换，编译期拦截错误
  - icon: 📐
    title: 统一的组件 API
    details: 组件命名、Props / Events、视觉规格遵循统一的交互规范，上手零心智成本
---
