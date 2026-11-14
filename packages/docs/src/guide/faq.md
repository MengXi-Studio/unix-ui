# 常见问题

按问题类型分组；未覆盖的问题欢迎到 [GitHub Discussions](https://github.com/MengXi-Studio/unix-ui/discussions) 提问。

## 环境与编译

### 编译报「根目录缺少 index.html」

uni-app x 的 Web 端基于 Vite 编译，工程根目录必须有 `index.html` 入口模板（内含 `<script type="module" src="/main">`）。CLI 创建的 uni-app x 工程默认包含；手动搭建的工程需自行补齐。

### manifest.json 的 appid 报错

- 已被占用的 appid → 「您不是这个应用的项目成员」
- 编造的未注册 appid → 「appid 不存在，请在 manifest.json 中重新获取」

本地 Web 开发阶段可将 `manifest.json` 中 `appid` 置为空字符串 `""`；App 云打包前需在 [dev.dcloud.net.cn](https://dev.dcloud.net.cn/) 正式获取。

### 本地端口被其他项目占用

多个项目共用开发机时，Vite 默认端口 5173 可能被其他 dev server 抢占（日志仍显示正常但页面内容是别的项目）。在 `manifest.json` 中显式指定端口：

```json
{
	"web": {
		"devServer": {
			"port": 5174
		}
	}
}
```

启动后确认端口的占用进程归属，避免页面内容来自其他项目。

### 组件标签没有渲染（easycom 未命中）

按顺序检查：

1. `uni_modules` 下的目录名是否为 `m-ui-x`（须与插件 id 一致）；
2. npm 方式是否已在 `pages.json` 配置 `^m-(.*)` 的 easycom 规则；
3. `pages.json` 中是否存在同名组件的其他 easycom 映射，导致匹配被抢占。

### App 端自定义样式不生效

App 端 ucss 有明确约束：文字样式只对 `<text>` / `button` 生效且不继承、不支持伪元素与后代选择器、无 `@keyframes`。覆盖组件样式时优先使用组件暴露的 `custom-class` / `custom-style`，并把文字样式写在 `<text>` 上。

## 主题

### 为什么不能在 uni.scss 中 import 变量文件？

uni-app x 编译器会把项目根 `uni.scss` **注入每个组件的样式**参与编译。组件库的 `theme/vars.scss` 已在组件内部引入，若 `uni.scss` 再引入同一文件，会触发 sass 循环导入：

```
[sass] This file is already being loaded.
```

覆盖主题只需在 `uni.scss` 中**直接定义** `$m-*` 变量，详见[主题定制](/guide/theming)。

### 修改 uni.scss 后主题没变化

`uni.scss` 是编译期注入，**不参与热更新**。修改变量后必须重启 dev server（先停止再 `launch web`）。

## 使用与路由

### Web 端页面跳转地址带 # 不生效

`manifest.json` 中 `web.router.mode` 配置为 `history` 时，路由读取的是 URL pathname（如 `http://localhost:5174/pages-sub/button/button`），`#` 后的 hash 部分不参与路由。分享或收藏页面链接时使用 pathname 形式。

## 平台

### 蒸汽模式如何开启

见[平台兼容性 · 蒸汽模式](/guide/compatibility#蒸汽模式)。

## 下一步

- [主题定制](/guide/theming)：变量覆盖的完整说明
- [平台兼容性](/guide/compatibility)：各端支持情况与已知限制
- [GitHub Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)：未覆盖的问题欢迎提问
