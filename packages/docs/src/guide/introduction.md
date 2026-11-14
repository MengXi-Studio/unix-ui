# 介绍

**unix-ui**（`@meng-xi/unix-ui`）是一个面向 [uni-app x](https://doc.dcloud.net.cn/uni-app-x/) 的 UI 组件库，使用 UTS + uvue 编写：一套源码由 uni-app x 编译器分别产出 Web（JS）、Android（Kotlin）、iOS（Swift）与小程序代码，组件只依赖内置组件与运行时能力，不引入自建渲染栈。

当前提供 **46 个组件**（含子组件），覆盖基础、布局、表单、反馈、数据展示与导航六类场景，并附带 69 个纯函数的日期工具集。

## 为什么选择 unix-ui

直接用原生 `view` / `text` 搭界面时，以下三件事会反复消耗时间：

- **交互细节要手写**：按钮按压反馈与加载态、0.5px 细边框、文本单行 / 多行省略、徽标截断与偏移……每一处都要自己实现；
- **多端差异要逐端调**：同一套样式在 App、Web、小程序上表现不一致，hairline、滚动容器等差异需要逐端排查；
- **主题换肤难落地**：运行时主题方案带来额外开销，页面级覆盖又容易散落在各处。

unix-ui 把这些重复劳动收敛为可复用的组件与编译期主题机制：组件划分、props 命名与视觉规格贴近主流 uni-app 组件库的使用习惯，迁移时无需重新建立心智模型。

## 特性

- **easycom 自动导入**：遵循 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html)，组件免 import、免注册
- **默认主题内置**：组件自带默认主题，零配置可用；需要定制时在 `uni.scss` 定义变量即可，详见[主题定制](/guide/theming)
- **多端兼容**：App（Android / iOS / HarmonyOS）、Web、小程序，兼容[蒸汽模式](/guide/compatibility#蒸汽模式)（vapor）
- **原生渲染**：0.5px 细边框、加载动画等细节全部基于原生能力实现，各端视觉一致
- **UTS 强类型**：Props / Events 全部静态类型，编译期拦截错误
- **无全局副作用**：组件样式自包含，只引用包内 `vars.scss`，不注入任何全局样式

## 设计约定

组件在 uni-app x 的能力边界内实现，遵循以下约定：

- **文字样式只设在 `<text>` 上**（ucss 不做文字样式继承），不使用伪元素与 `@keyframes`，动画统一走 `UniElement.animate`
- **布局只用 flex**，不依赖平台差异较大的定位与滚动特性；0.5px 细边框统一采用绝对定位 + `transform: scale(0.5)` 方案
- **强类型 API**：props / events 全量 UTS 类型标注，可空值统一用 `null` 表达
- **编译期主题**：全部视觉参数为 `$m-*` SCSS 变量（全 `!default`），不产生运行时开销

## 组件体系

| 分类 | 组件 |
| --- | --- |
| 基础组件 | 按钮、图标、图片、文本 |
| 布局组件 | 紧凑布局、分割线、弹性布局、宫格、栅格布局、间距、状态栏、粘性布局、瀑布流 |
| 表单组件 | 日历、级联选择、复选框、颜色选择器、日期横条、输入框；日历 / 级联选择 / 复选框 / 颜色选择器另提供弹出框与输入框组合形态 |
| 反馈组件 | 悬浮按钮、加载、遮罩层、弹出层、轻提示 |
| 数据展示 | 徽标、单元格与分组 |
| 导航组件 | 标签页 |

完整清单与属性说明见侧栏「组件」；想先看效果，可前往[在线演示](https://mengxi-studio.github.io/unix-ui/playground/)。

## 分发方式

| 渠道 | 说明 |
| --- | --- |
| uni_modules 插件 | 插件 id `m-ui-x`，插件市场导入后 easycom 零配置 |
| npm 包 | `@meng-xi/unix-ui`，需配置 easycom 规则，见[安装](/guide/installation) |
| 源码 | [GitHub 仓库](https://github.com/MengXi-Studio/unix-ui)，MIT 协议 |

## 学习路径

| 阶段 | 内容 |
| --- | --- |
| 入门 | [安装](/guide/installation) → [快速上手](/guide/getting-started) |
| 基础 | [主题定制](/guide/theming) |
| 进阶 | [平台兼容性](/guide/compatibility) → [常见问题](/guide/faq) |
| 参考 | [Button 按钮](/components/button) → [日期工具](/tools/date) → [更新日志](/changelog) |

## 下一步

- [安装](/guide/installation)：把组件库接入你的 uni-app x 工程
- [快速上手](/guide/getting-started)：从第一个组件开始
