# 安装

## 环境要求

- HBuilderX `5.08` 及以上（uni-app x 编译器）
- 可选：npm 包管理器（npm 方式安装时）

## 方式一：uni_modules（推荐）

将组件库放入项目的 `uni_modules/mxi-ui` 目录（可通过插件市场导入或手动拷贝），目录结构遵循 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir)：

```
uni_modules/mxi-ui/
├── components/
│   └── mxi-button/
│       └── mxi-button.uvue
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
			"^mxi-(.*)": "@meng-xi/unix-ui/components/mxi-$1/mxi-$1.uvue"
		}
	}
}
```

## 验证安装

在任意页面模板中直接使用，无需 import 与注册：

```html
<template>
	<mxi-button type="primary">安装成功</mxi-button>
</template>
```

## 下一步

- [快速上手](/guide/getting-started)：了解基础用法与事件处理
- [主题定制](/guide/theming)：覆盖默认主题变量
