# 组件前缀更名 mxi- → m-

> 日期：2026-10-26 ｜ 状态：已完成

## 需求

用户要求把 `packages/core/components` 组件前缀由 `mxi-` 改为 `m-`。

## 疑问清单（AskUserQuestion 已闭环）

### Q1 主题变量前缀 `$mxi-*` 是否随改？
回答：一起改为 `$m-*`（契约统一）。

### Q2 uni_modules 插件 id / 目录名 `mxi-ui-x` 是否随改？
回答：改为 `m-ui-x`（全链更名）。

## 方案与落点

- 单一替换规则 `mxi-` → `m-` 同时覆盖组件标签/类名、`$mxi-*` → `$m-*`、`mxi-ui-x` → `m-ui-x`（/tmp 一次性 node 脚本，文本替换 + 目录/文件重命名）。
- 文本范围：core 全部、playground（排除 uni_modules 产物）、docs/src、.trae/rules、scripts/sync-uni-modules.mjs；历史任务文档不替换。
- 重命名：11 个组件目录 + m-*.uvue + static/mxi-icon.ttf → m-icon.ttf + uni_modules 目录。
- 顺序依赖：sync 重建 uni_modules 产物 → build:demo（build:demo 依赖 uni_modules 产物编译）。

## 实施记录

- 115 文本文件替换、12 项重命名；unpackage/dist 与 docs public/playground 构建产物被顺带替换，经 `pnpm build:demo` 全量重建修正（chunk 引用与文件名重新对齐）。
- changelog 三处登记破坏性变更（docs zh/en「破坏性变更 / Breaking Changes」节 + uni_modules KEEP changelog）。
- 验证：sync:uni-modules + check 通过；build:demo 完成（42 文件）；build:docs 3.91s 无死链；兜底 grep 仅剩 changelog 有意保留的旧名记录；dev(5174) 重启后浏览器实测 button/badge 演示页渲染正常、console 无 easycom/字体错误。

## 遗留

- 无。
