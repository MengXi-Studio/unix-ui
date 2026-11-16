# 主题定制

unix-ui 的主题由 SCSS 变量驱动，**默认主题开箱即用**：组件内部已引入变量文件，零配置即可获得完整视觉，不需要任何初始化代码，也没有运行时主题计算。

## 覆盖变量

在项目根 `uni.scss` 中**直接定义**同名变量即可全局覆盖：

```scss
// 1. 品牌色：影响所有使用主色的组件
$m-color-primary: #10b981;
$m-color-danger: #dc2626;

// 2. 组件规格：按需覆盖，未定义的保持默认
$m-button-normal-height: 48px;
$m-button-radius: 12px;
$m-radius-md: 12px;
```

变量文件全部使用 `!default`：用户定义的值始终优先于组件默认值，与书写位置无关。

## 工作原理

1. 组件 style 顶层引入 `theme/vars.scss`（全部 `!default`），编译时展开为默认值；
2. uni-app x 编译器把项目根 `uni.scss` 注入每个组件的样式，参与同一次编译；
3. 用户定义的变量使 `!default` 声明跳过，从而完成覆盖。

整个过程只发生在编译期，运行时没有任何主题计算开销。uni_modules 与 npm 两种安装方式的变量契约完全一致。

::: warning 禁止在 uni.scss 中引入 vars.scss
不要在 `uni.scss` 中 `@import` 组件库的 `vars.scss`——编译器会把 `uni.scss` 注入每个组件样式，与组件内部的引入形成循环导入，导致编译报错：

```
[sass] This file is already being loaded.
```

覆盖主题只需**直接定义变量**，不需要引入任何文件。
:::

## 变量分层

| 层级 | 命名 | 示例 | 用途 |
| --- | --- | --- | --- |
| 全局基础 | `$m-<属性>` | `$m-color-primary`、`$m-radius-md`、`$m-border-width` | 品牌色、圆角、边框等跨组件规格 |
| 组件级 | `$m-<组件>-<属性>` | `$m-button-normal-height`、`$m-tabs-nav-height` | 单个组件的尺寸与配色 |
| 组合形态 | `$m-<组件>-input-*` / `-popup-*` | `$m-lunar-picker-input-*` | 输入框 / 弹出框组合形态的专属外观 |

全局基础变量：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `$m-color-primary` | 主要色 | `#1989fa` |
| `$m-color-success` | 成功色 | `#07c160` |
| `$m-color-warning` | 警告色 | `#ff976a` |
| `$m-color-danger` | 危险色 | `#ee0a24` |
| `$m-text-color` | 基础文字色 | `#323233` |
| `$m-white` | 基础白色 | `#ffffff` |
| `$m-disabled-opacity` | 禁用透明度 | `0.5` |
| `$m-border-width` | 基础边框宽度 | `1px` |
| `$m-radius-md` | 基础圆角 | `8px` |
| `$m-radius-max` | 全圆角 | `999px` |

组件级变量的默认值与用途见各组件文档的「主题定制」小节。

## 查找变量

- 全部变量集中定义在 [theme/vars.scss](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/core/theme/vars.scss)，按组件分段并附注释；
- 只想确认某个组件有哪些变量时，直接看该组件文档的「主题定制」小节（如 [Button 主题定制](/components/button#主题定制)）；
- 想改的是单个实例而不是全局外观时，优先用 `custom-class` / `custom-style`。

## 注意事项

- `uni.scss` 是编译期注入，**不参与热更新**；修改变量后需重启 dev server 才会生效，详见[常见问题](/guide/faq#修改-uni-scss-后主题没变化)。
- 只定义需要调整的变量，其余保持默认，后续升级时对比成本最低。
- 面板类组件的视觉统一由 `$m-picker-*` 承担；日期 / 时间面板迁移到 `m-picker` 组合后，原先的面板级变量已失效，见[更新日志](/changelog)。

## 下一步

- [常见问题](/guide/faq#为什么不能在-uni-scss-中-import-变量文件)：主题机制的常见坑
- [Button 按钮](/components/button)：查看组件支持的属性与事件
