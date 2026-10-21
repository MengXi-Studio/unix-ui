# 常见问题

## 为什么不能在 uni.scss 中 import 变量文件？

uni-app x 编译器会把项目根 `uni.scss` **注入每个组件的样式**参与编译。组件库的 `theme/vars.scss` 已在组件内部引入，若 `uni.scss` 再引入同一文件，会触发 sass 循环导入：

```
[sass] This file is already being loaded.
```

覆盖主题只需在 `uni.scss` 中**直接定义** `$mxi-*` 变量，详见[主题定制](/guide/theming)。

## 编译报「根目录缺少 index.html」

uni-app x 的 Web 端基于 Vite 编译，工程根目录必须有 `index.html` 入口模板（内含 `<script type="module" src="/main">`）。CLI 创建的 uni-app x 工程默认包含；手动搭建的工程需自行补齐。

## manifest.json 的 appid 报错

- 已被占用的 appid → 「您不是这个应用的项目成员」
- 编造的未注册 appid → 「appid 不存在，请在 manifest.json 中重新获取」

本地 Web 开发阶段可将 `manifest.json` 中 `appid` 置为空字符串 `""`；App 云打包前需在 [dev.dcloud.net.cn](https://dev.dcloud.net.cn/) 正式获取。

## 本地端口被其他项目占用

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

## 修改 uni.scss 后主题没变化

`uni.scss` 是编译期注入，**不参与热更新**。修改变量后必须重启 dev server（先停止再 `launch web`）。

## Web 端页面跳转地址带 # 不生效

`manifest.json` 中 `web.router.mode` 配置为 `history` 时，路由读取的是 URL pathname（如 `http://localhost:5174/pages-sub/button/button`），`#` 后的 hash 部分不参与路由。分享或收藏页面链接时使用 pathname 形式。

## 蒸汽模式如何开启

见[平台兼容性 · 蒸汽模式](/guide/compatibility#蒸汽模式)。

## 下一步

- [主题定制](/guide/theming)：变量覆盖的完整说明
- [GitHub Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)：未覆盖的问题欢迎提问
