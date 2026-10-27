# 安装

## 环境要求

- HBuilderX `5.08` 及以上（uni-app x 编译器）
- 可选：npm 包管理器（npm 方式安装时）

## 方式一：uni_modules（推荐）

将组件库放入项目的 `uni_modules/m-ui-x` 目录（可通过插件市场导入或手动拷贝），目录结构遵循 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir)：

```
uni_modules/m-ui-x/
├── components/
│   └── m-button/
│       └── m-button.uvue
├── theme/
│   └── vars.scss
├── package.json
└── ...
```

组件即被 [easycom](https://doc.dcloud.net.cn/uni-app-x/component/#easycom) 自动扫描，**无需任何配置**。

## 方式二：npm

```bash
npm install @meng-xi/unix-ui
```

安装后在 `pages.json` 中配置 easycom 规则：

```json
{
	"easycom": {
		"autoscan": true,
		"custom": {
			"^m-(.*)": "@meng-xi/unix-ui/components/m-$1/m-$1.uvue"
		}
	}
}
```

## 验证安装

在任意页面模板中直接使用，无需 import 与注册：

```html
<template>
	<m-button type="primary">安装成功</m-button>
</template>
```

## 真机体验

不写代码也可以先在真机上体验组件效果：[下载 Android 演示 App（APK）](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1793059625238-__UNI__F1AA560_1793059613497.apk)——示例工程（playground）的云打包产物，每个组件一页穷举全部 props / 变体 / 事件。安装包随版本更新重新打包，链接以最新发版说明为准。

## 下一步

- [快速上手](/guide/getting-started)：了解基础用法与事件处理
- [主题定制](/guide/theming)：覆盖默认主题变量
