# 更新日志

## [未发布]

### 新增

- **mxi-loading 加载**：API 对标 [Vant Loading](https://vant-ui.github.io/vant/#/zh-CN/loading)——两种加载类型（circular 弧段圆环 / spinner 花瓣）、自定义颜色（color）、自定义大小（size）、垂直排列（vertical）、自定义文案样式（text-size / text-color）、默认文案插槽与 icon 自定义图标插槽；spinner 型采用 1.2s 12 步离散旋转 + 亮度拖尾，circular 型为弧段圆环匀速旋转
- **mxi-button 按压反馈**：基于 `hover-class` 实现按压态（opacity 0.8，可主题覆盖），禁用与加载状态不出现按压反馈
- **mxi-button 加载类型**：`loading-type` 新增 `clock`（时钟指针）与 `spinner`（花瓣，亮度拖尾 + 离散旋转）形态

## [0.1.0] - 2026-10-21

首个可用版本：面向 uni-app x 的 UI 组件库，pnpm monorepo 架构（core / docs / playground 三包），首个组件 [Button 按钮](/components/button)。

### 新增

- **mxi-button 按钮**：API 对标 [Vant Button](https://vant-ui.github.io/vant/#/zh-CN/button)——五种类型（default / primary / success / warning / danger）、四种尺寸（large / normal / small / mini）、朴素（plain）、圆形（round）、方形（square）、块级（block）、禁用（disabled）、加载状态（loading / loading-text）、自定义颜色（color，支持 `linear-gradient` 渐变）、细边框（hairline）
- **easycom 自动导入**：uni_modules 规范目录结构（`uni_modules/mxi-ui-x/components/组件名/组件名.uvue`），免 import 免注册；npm 方式提供 pages.json `easycom.custom` 规则
- **主题机制**：默认主题零配置内置（组件内顶层引入 `theme/vars.scss`，全 `!default`）；在项目根 uni.scss 直接定义 `$mxi-*` 变量即可编译期全局覆盖，详见[主题定制](/guide/theming)
- **0.5px 细边框**：ucss 无伪元素，采用绝对定位 view + `scale(0.5)` 方案，Web 与原生端表现一致
- **加载动画**：`UniElement.animate` 实现 loading 圆环旋转（ucss 禁用 `@keyframes` 的约束下）
- **事件语义**：禁用与加载状态下 click 不触发，与 Vant 行为一致

### 工程化

- **pnpm monorepo**：packages/core（组件源码）/ packages/docs（VitePress 文档站）/ packages/playground（uni-app x 演示工程）
- **uni_modules 同步脚本**：`sync-uni-modules.mjs` 将 core 同步至 playground `uni_modules/mxi-ui-x`，含 sha256 一致性校验（`--check`）
- **蒸汽模式**：playground 已启用 `vapor: true` + `vapor-render-target: bytecode`，组件在蒸汽模式编译验证通过
- **VitePress 文档站**：本地搜索（中文翻译）、UTS 语法高亮、暗色代码主题、首页徽章

### 平台支持

- **Web**：编译与运行验证通过（渲染、事件、主题覆盖矩阵实测）
- **Android / iOS / HarmonyOS / 小程序**：代码已按条件编译适配，待真机与开发者工具实测
