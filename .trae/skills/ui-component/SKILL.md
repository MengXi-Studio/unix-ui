---
name: ui-component
description: 按 unix-ui 既定标准流程开发新 UI 组件或扩展既有组件，覆盖组件源码、主题变量、uni_modules 同步、演示页、双语文档与验证闭环。当用户要求新增组件（如 mxi-tag、mxi-cell）、为既有组件扩展属性/变体/事件时使用。不用于文档站配置、工程脚手架调整或纯 bug 修复。
---

# UI 组件开发（ui-component）

在本仓库开发任何组件，一律按下方六步落码，全程强制遵循 `.trae/rules/architecture.md`（分层、主题契约、命名清单）、`.trae/rules/workflow.md`（文档驱动四步工作流：建立任务文档 → 等待并读取回答 → 实现与验证 → 实施记录回填）与 `.trae/rules/project_rules.md`（UTS / uvue 红线）。禁止跳步，禁止「为了简洁」绕过契约。

## 0. 需求确认（动手前）

- 对标设计：组件参考 Vant 同名组件的设计与交互（props 命名、变体、事件语义），功能与体验对齐优先于自创 API。
- 判定范围：全新组件（走全流程建文件）/ 既有组件扩展（只改既有文件与文档）。
- 动工前明确 props / events / slots 清单；组件命名 `mxi-` 前缀 + 小写中划线（如 `mxi-loading`），目录 `packages/core/components/<name>/<name>.uvue`。

## 1. 组件源码（packages/core/components/）

- 组合式 API；`<style lang="scss">` **必须显式声明 lang**；style 顶层无条件 `@import '../../theme/vars.scss'`。
- 样式仅 class 选择器 + flex 布局；文字样式只设在 text/button；不用 scoped；不用 rpx（除随屏宽场景）。
- 样式规则扁平书写：禁止层级嵌套（后代选择器）、禁用 `@each`/`@if` 批量生成类；scss 仅用于变量与运算（`$mxi-*` / `!default` / `rgba($var, alpha)` / 数值运算）。
- 动画一律走 `UniElement.animate`（ucss 无 @keyframes / 伪元素）；0.5px 细边框走「绝对定位 view + `transform: scale(0.5)`」缩放层——**必须** `transform-origin: 0 0`、根节点 `border-width: 0`、圆角 ×2 同步。
- 类型与逻辑默认内联 SFC，不外置同级 `.uts`（easycom 页面零 import，外部拿不到组件内部类型）；仅当跨组件共享纯数据/工具或单文件过大时才拆，用相对路径导入。
- 禁止：组件内写全局副作用、依赖 playground 专属配置、引入 vars.scss 之外的样式文件。

## 2. 主题变量（packages/core/theme/vars.scss）

- 新增 `$mxi-<component>-*` 段，全部 `!default`；**禁止**修改既有变量默认值（破坏用户覆盖契约）。
- 通用规格（色彩 / 圆角 / 禁用透明度）优先复用既有 `$mxi-color-*` / `$mxi-radius-*` / `$mxi-disabled-opacity`。

## 3. 同步与演示页

- `pnpm sync:uni-modules` 同步到 playground；**禁止**手改 `playground/uni_modules/mxi-ui-x/` 下的 `components/`、`theme/`（同步即覆盖丢失；该目录仅 `package.json`、`changelog.md` 为手工维护）。
- 演示页 `packages/playground/pages-sub/<name>/<name>.uvue` + `pages.json` 注册；一页穷举 props / 变体 / 事件，便于截图验收。

## 4. 双语文档

- `packages/docs/src/components/<name>.md`（中文）与 `src/en/components/<name>.md`（英文）双份同步维护，结构对齐既有 `button.md`（Props / Events / Slots 表格 + 示例代码 + Next Steps）。
- 更新 `.vitepress/config/zh.ts` 与 `en.ts` 侧栏，两侧一致。

## 5. 验证闭环（DoD 硬性要求）

1. `pnpm sync:uni-modules:check` 一致性通过。
2. HBuilderX CLI `cli launch web --project <playground 绝对路径>`，确认编译成功。
3. 浏览器打开演示页（history 路由）实测全部变体并截图比对，确认无运行时错误；主题覆盖场景需在 uni.scss 定义 `$mxi-*` 变量后**重启 server** 再验。
4. `pnpm build:docs` 死链检查通过。
5. 清理临时调试代码后方可报告完成。

## 常见错误（直接判失败）

- 直接改 `playground/uni_modules/mxi-ui-x/` 下的组件或主题（同步即丢）
- style 未声明 `lang="scss"`、漏顶层 `@import vars.scss`、在 uni.scss 中 `@import` vars.scss（循环导入）
- 主题变量缺 `!default`、改既有变量默认值
- 样式层级嵌套产生后代选择器、用 `@each`/`@if` 批量生成类
- hairline 缩放层漏 `transform-origin: 0 0`（边框偏移）、根节点未清零 border（双线）、圆角未 ×2
- 文档只写中文漏英文、漏更新 zh/en 侧栏
- 演示页未在 `pages.json` 注册
- UTS 踩线：undefined、truthy 判断、对象字面量赋 interface、函数声明作值传递、throw 非 Error
