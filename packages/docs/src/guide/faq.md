# 常见问题

## 安装与导入

### 组件标签没有渲染

按顺序排查：

1. `uni_modules` 下的目录名必须是 `m-ui-x`（与插件 id 一致），否则 easycom 不会扫描；
2. npm 方式必须在 `pages.json` 配置 easycom 规则：`"^m-(.*)": "@meng-xi/unix-ui/components/m-$1/m-$1.uvue"`；
3. 改完 `pages.json` 需要重启 dev server；
4. 仍未生效时，把包内容复制到 `uni_modules/m-ui-x/`，改用零配置方式。

### npm 安装后没有类型提示

确认 `tsconfig.json` / `jsconfig.json` 未被项目覆盖了 `moduleResolution`；uni-app x 工程的默认配置已能解析包内 `.uvue` 与 `.uts`，如手动改过请恢复为工程模板的默认值。

### 可以只引入部分组件吗

可以。uni_modules 方式只保留需要的 `components/m-*` 目录；但主题变量、`utils/` 与 `static/`（图标字体）需保留，否则会出现样式变量缺失或图标空白。

## 主题

### 为什么不能在 uni.scss 中 import 变量文件

`uni.scss` 会被编译器注入每个组件样式，而组件内部已引入 `vars.scss`，两者指向同一文件会触发 sass 循环导入并报错：

```
[sass] This file is already being loaded.
```

正确做法是在 `uni.scss` 中**直接定义变量**，详见[主题定制](/guide/theming)。

### 修改 uni.scss 后主题没变化

`uni.scss` 是编译期注入，不参与热更新。修改后需要重启 dev server（必要时重新编译），再刷新页面。

### 只想改一个实例的样式

用 `custom-class` 传类名，或用 `custom-style` 传内联样式；不要为个别实例改动全局变量，否则会影响所有同类组件。

## 组件使用

### 日期、时间与选择器的值类型是什么

| 组件 | 值类型 |
| --- | --- |
| `m-input` / `m-picker` | `string` / `string[]` |
| `m-date-picker` / `m-calendar` | `Date \| null` |
| `m-time-picker` | `'HH:mm'` 或 `'HH:mm:ss'` |
| `m-lunar-picker` | 公历 `Date`（农历只体现在列与回显） |
| `m-checkbox-group` | 数组 |

多列选择器的 `columns` 支持 `PickerOption[][]`，也支持纯字符串二维数组，元素可为 `{ text, value, disabled }`。

### 农历日期和我预期的不一致

`m-lunar-picker` 对外值始终是公历 `Date`（本地零点），农历仅用于列渲染与输入框回显。做字符串输出时请用 `formatDate` 等工具函数，避免用 `toISOString()` 直接截取（会按 UTC 换算导致日期偏移）。

### 输入框嵌进 m-cell 后高度不对

使用 `inlaid` 模式嵌入 `m-cell`，控件高度由 `$m-input-inlaid-min-height`（默认 `24px`）保底，与单元格单行内容区一致。若自定义过该变量导致挤压，请恢复默认或同步调整 `m-cell` 的行高。

### 图标不显示

图标依赖 `static/` 下的字体文件。确认：
1. 该目录已随组件库一并复制（不完整拷贝会丢失）；
2. `m-icon` 的 `name` 在[图标文档](/components/icon)列表内；
3. App 端自定义字体需在 `manifest` 中正常打包，云端打包与本地运行行为一致。

## 平台

### App 端文字样式不生效

文字样式只应设在 `text` / `button` 上，`view` 在 App 端没有文字样式继承。把 `font-size` / `color` 写到 `text` 上即可。

### 小程序端 option 插槽不生效

小程序对同一 `v-for` 内的同名具名插槽只渲染第一个，`option` 这类按列转发的插槽因此在小程序端回退为内置文本。需要自定义样式时请用 `formatter` 改写文本，或仅面向 Web / App 使用插槽。

### 支持蒸汽模式吗

支持。详见[平台兼容性 · 蒸汽模式](/guide/compatibility#蒸汽模式)。

## 版本与迁移

### 升级后日期 / 时间面板有什么变化

0.6.0 起，`m-date-picker` / `m-time-picker` 的面板内部改为组合 `m-picker`，**对外 props / events / 插槽 / 值类型保持不变**；视觉统一由 `$m-picker-*` 控制，原先的面板级变量不再生效。详见[更新日志](/changelog)。

### 从 0.6.0 升级到 0.7.0 需要改代码吗

不需要，0.7.0 为纯新增版本（数字键盘、密码输入、单选、评分、搜索、分段控制器、列表选择共 14 个组件），无破坏性变更。仅两点可按需关注：`m-input` 新增 `confirm` 事件与 `input-align` 属性（默认行为不变）；`m-checkbox` 未选中态修正为描边空框（此前因图标字形缺失误显示为空框，若曾按旧视觉做过补偿样式可移除）。

### 如何查看某个版本改了什么

[更新日志](/changelog)按版本记录新增、修复与变更；插件市场与 npm 包的 changelog 内容一致。
