# 平台兼容性

## 支持矩阵

| 平台 | 状态 | 说明 |
| --- | --- | --- |
| Web（H5 / PC 浏览器） | 已逐组件实测 | 演示站即 Web 端，可交互验证全部变体 |
| App · Android | 支持 | 云打包产物可安装体验，见[安装](/guide/installation#真机体验)；0.7.0 修复两轮 Kotlin 编译错误后重新出包 |
| App · iOS | 支持 | 与 Android 共用同一套 uvue 源码 |
| App · HarmonyOS | 支持 | 依赖 HBuilderX 对应版本的原生渲染能力 |
| 微信 / 支付宝等小程序 | 支持（有限制） | 见下方「已知限制」 |

设计目标是同一套源码在各端表现一致；平台差异全部收敛在组件内部的条件编译中，业务代码不需要判断平台。

## 环境要求

| 项目 | 要求 |
| --- | --- |
| HBuilderX | `5.08` 及以上 |
| uni-app x 编译器 | 随 HBuilderX 提供，无需单独安装 |
| 样式隔离 | 建议策略 2.0（HBuilderX 4.13+） |
| Node.js | 仅 npm 安装方式需要 |

## 蒸汽模式

组件库兼容 uni-app x 的[蒸汽模式](https://doc.dcloud.net.cn/uni-app-x/compiler/#vapor)（vapor + bytecode）：组件模板不使用 VDOM 特有写法，动画统一走 `UniElement.animate`，在开启 `manifest.json` 的 vapor 配置后可直接编译运行。

## 平台差异如何处理

| 差异点 | 组件内的处理 |
| --- | --- |
| 0.5px 细边框 | 绝对定位层 + `transform: scale(0.5)`，各端统一 |
| 动画 | `UniElement.animate`（ucss 无 `@keyframes`、无伪元素） |
| 字体图标 | 打包进 `static/` 的字体文件 + `text` 渲染，不依赖 Web 字体加载 |
| 文字样式 | 只设在 `text` / `button` 上（App 端 `view` 无文字样式继承） |
| 平台专属能力 | 用 `#ifdef APP-ANDROID` / `APP-IOS` / `WEB` 隔离，对使用方透明 |

## 已知限制

- **App 端 Kotlin 编译约束**：UTS 函数声明在 Web 端有提升效果，但生成的 Kotlin 局部函数不允许前向引用（被调用函数需先声明）；`type alias` 与数组的联合类型作形参、`$slots.default` 等 Kotlin 保留字的属性访问都会导致云打包失败。组件库内部已按此约束实现，自研组件时需留意；可用 `cli publish app-android --type appResource` 本地生成 Kotlin 产物提前自查。
- **小程序端具名插槽**：`v-for` 内使用同名具名插槽时仅第一个生效，因此 `option` 这类按列 / 按项转发的插槽在小程序端不可用，列文本回退为内置渲染；Web 与 App 端不受影响。
- **滚动吸附手感**：滚轮类组件的吸附动画依赖各端 `UniElement` 实现，真机上的惯性曲线与 Web 略有差异，属平台特性。
- **农历范围**：农历换算数据覆盖 1900–2100，超出范围的公历日期会被钳制到边界。
- **面板级主题变量**：日期 / 时间面板已迁移为 `m-picker` 组合，面板级 `$m-date-picker-*` / `$m-time-picker-*` 视觉变量不再生效，统一由 `$m-picker-*` 控制。

## 反馈

发现某端表现与文档不一致时，请在 [GitHub Issues](https://github.com/MengXi-Studio/unix-ui/issues) 附上平台、HBuilderX 版本、组件名与最小复现，便于定位是否为平台差异。

## 下一步

- [常见问题](/guide/faq)：编译、主题与运行时的常见问题
- [主题定制](/guide/theming)：变量覆盖与优先级
