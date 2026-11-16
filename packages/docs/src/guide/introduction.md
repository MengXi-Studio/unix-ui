# 介绍

**unix-ui**（`@meng-xi/unix-ui`）是面向 [uni-app x](https://doc.dcloud.net.cn/uni-app-x/) 的 UI 组件库，使用 UTS + uvue 编写。同一套源码由 uni-app x 编译器分别产出 Web（JS）、Android（Kotlin）、iOS（Swift）与小程序代码，组件只依赖内置组件与运行时能力，不引入自建渲染栈。

当前提供 **65 个组件**（含子组件、弹出框与输入框等组合形态），按 **8 个分类**组织：基础、布局、数据录入、选择器、日期时间、反馈、数据展示、导航；另附覆盖 1900–2100 的纯函数日期工具集。

## 为什么选择 unix-ui

用原生 `view` / `text` 搭界面，以下三件事会反复消耗时间：

| 痛点 | 具体表现 | unix-ui 的做法 |
| --- | --- | --- |
| 交互细节要手写 | 按压反馈、加载态、0.5px 细边框、省略号、徽标截断与偏移 | 收敛为组件 props 与统一视觉规格 |
| 多端差异要逐端调 | hairline、滚动容器、字体图标在各端表现不同 | 差异在组件内部用条件编译隔离 |
| 主题换肤难落地 | 运行时主题有额外开销，页面级覆盖容易散落 | `$m-*` 变量 + `!default`，编译期完成覆盖 |

组件的划分、Props 命名与视觉规格贴近主流 uni-app 组件库的使用习惯，迁移时无需重新建立心智模型。

## 特性

- **easycom 自动导入**：遵循 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html)，组件免 import、免注册
- **默认主题内置**：零配置可用；需要定制时在根 `uni.scss` 直接定义变量，详见[主题定制](/guide/theming)
- **多端兼容**：Web、App（Android / iOS / HarmonyOS）、小程序，兼容[蒸汽模式](/guide/compatibility#蒸汽模式)
- **原生渲染**：0.5px 细边框、加载动画等细节全部基于原生能力实现，各端视觉一致
- **UTS 强类型**：Props / Events 全量静态类型，编译期拦截错误
- **无全局副作用**：组件样式自包含，只引用包内 `vars.scss`，不注入任何全局样式

## 设计约定

组件在 uni-app x 的能力边界内实现，遵循以下约定：

- **文字样式只设在 `<text>` / `<button>` 上**（ucss 不做文字样式继承），不使用伪元素与 `@keyframes`，动画统一走 `UniElement.animate`
- **布局只用 flex**，不依赖平台差异较大的定位与滚动特性；0.5px 细边框统一为「绝对定位 + `transform: scale(0.5)`」
- **强类型 API**：props / events 全量 UTS 类型标注，可空值统一用 `null`
- **编译期主题**：全部视觉参数为 `$m-*` SCSS 变量（全 `!default`），不产生运行时开销

## 组件体系

| 分类 | 组件（含组合形态） |
| --- | --- |
| 基础组件 | 按钮、图标、图片、文本 |
| 布局组件 | 紧凑布局、分割线、弹性布局、宫格、栅格布局、间距、状态栏、粘性布局、瀑布流 |
| 数据录入 | 复选框、颜色选择器、输入框；复选框与颜色选择器另提供弹出框、输入框形态 |
| 选择器 | 通用选择器、级联选择；两者另提供弹出框、输入框形态，通用选择器另有纯视图 |
| 日期时间 | 日历、日期选择、日期范围、日期横条、时间选择、时间范围、农历选择；日期 / 时间 / 农历系列另提供弹出框、输入框形态 |
| 反馈组件 | 悬浮按钮、加载、遮罩层、弹出层、轻提示 |
| 数据展示 | 徽标、单元格与分组 |
| 导航组件 | 标签页 |

完整清单与属性说明见侧栏「组件」；想先看效果，可前往[在线演示](https://mengxi-studio.github.io/unix-ui/playground/)。

## 分发方式

| 渠道 | 说明 |
| --- | --- |
| uni_modules 插件 | 插件 id `m-ui-x`，从插件市场导入后 easycom 零配置 |
| npm 包 | `@meng-xi/unix-ui`，需配置一条 easycom 规则，见[安装](/guide/installation#方式二-npm) |
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
