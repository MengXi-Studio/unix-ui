# 主题定制

unix-ui 的主题由 SCSS 变量驱动，**默认主题开箱即用**：组件内部已引入变量文件，零配置即可获得完整视觉，不需要任何初始化代码。

## 覆盖变量

在项目根 `uni.scss` 中**直接定义**同名变量即可全局覆盖：

```scss
// 自定义主题色（对全部组件生效）
$m-color-primary: #10b981;
$m-color-danger: #dc2626;

// 定制组件规格
$m-button-normal-height: 48px;
$m-radius-md: 12px;
```

变量文件全部使用 `!default` 定义，用户定义值始终优先于组件默认值，与定义书写位置无关。

## 工作原理

1. 组件 style 顶层引入 `theme/vars.scss`（全部 `!default`），编译时展开为默认值
2. uni-app x 编译器将项目根 `uni.scss` 注入每个组件的样式，参与同一次编译
3. 用户在 `uni.scss` 中定义的变量使 `!default` 声明跳过，从而覆盖默认值

整个过程只发生在编译期，运行时没有任何主题计算开销。

::: warning 禁止在 uni.scss 中引入 vars.scss
不要在 `uni.scss` 中 `@import` 组件库的 `vars.scss`——编译器会把 `uni.scss` 注入每个组件样式，与组件内部的引入形成循环导入，导致编译报错：

```
[sass] This file is already being loaded.
```

覆盖主题只需**直接定义变量**，不需要引入任何文件。
:::

## 变量总表

### 主题色

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-color-primary | 主要色 | #1989fa |
| $m-color-success | 成功色 | #07c160 |
| $m-color-warning | 警告色 | #ff976a |
| $m-color-danger | 危险色 | #ee0a24 |
| $m-white | 基础白色 | #ffffff |
| $m-text-color | 基础文字色 | #323233 |
| $m-disabled-opacity | 禁用透明度 | 0.5 |
| $m-color-default-bg | default 类型背景色 | #ffffff |
| $m-color-default-border | default 类型边框色 | #ebedf0 |

### 基础规格

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-border-width | 基础边框宽度 | 1px |
| $m-radius-md | 基础圆角 | 8px |
| $m-radius-max | 全圆角 | 999px |

### Button 按钮

完整变量见 [Button 主题定制](/components/button#主题定制)，包括各尺寸的高度、内边距、字号与圆角。

### 组件级变量

除上方全局通用变量外，各组件还有专属的 `$m-<component>-*` 变量（如 Sticky 的 `$m-sticky-z-index`、Tabs 的 `$m-tabs-*` 系列、Calendar 的 `$m-calendar-*` 系列），全部 `!default`。完整清单与说明见各组件文档的「主题定制」小节。

## 命名规则与查找方式

- 全局通用变量命名为 `$m-<属性>`，组件专属变量命名为 `$m-<组件>-<属性>`；
- 全部变量集中定义在 [theme/vars.scss](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/core/theme/vars.scss)，按组件分段并附注释；
- 只想确认某个组件有哪些变量时，直接查看该组件文档的「主题定制」小节。

## 注意事项

- `uni.scss` 是编译期注入，**不参与热更新**；修改变量后需重启 dev server 才会生效，详见[常见问题](/guide/faq)。
- 只定义需要调整的变量，其余保持默认，后续升级时对比成本最低。
- 主题变量用于全局统一视觉；单个实例的微调优先使用组件提供的 `custom-class` / `custom-style`，避免为局部样式改动全局变量。

## 下一步

- [Button 按钮](/components/button)：查看组件支持的属性与事件
- [常见问题](/guide/faq#为什么不能在-uni-scss-中-import-变量文件)：主题机制的常见坑
