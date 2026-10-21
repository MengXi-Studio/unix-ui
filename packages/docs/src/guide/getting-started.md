# 快速上手

## 安装

```bash
npm install @meng-xi/unix-ui
```

## 主题定制（可选）

组件**内置默认主题，零配置即可使用**。如需定制，在项目根 `uni.scss` 中直接定义同名变量：

```scss
// 自定义主题色（对全部组件全局生效）
$mxi-color-primary: #10b981;
```

变量文件全部使用 `!default` 定义，用户定义值始终优先于组件默认值，与定义书写位置无关。完整变量见包内 `theme/vars.scss`。

> 注意：不要在 `uni.scss` 中 `@import` 组件库的 `vars.scss`——uni-app x 编译器会将项目根 `uni.scss` 注入每个组件样式，与组件内部的引入形成循环导入，导致编译报错 `This file is already being loaded`。

## easycom 自动导入

### uni_modules 方式（零配置）

将包内容同步至项目 `uni_modules/mxi-ui` 目录（目录结构与 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir) 一致），组件即可被 easycom 自动扫描：

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

### npm 方式

npm 安装后，在 `pages.json` 中配置 easycom 规则：

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

## 使用组件

无需 import 与注册，直接在模板中使用：

```html
<template>
	<mxi-button type="primary" @click="onClick">主要按钮</mxi-button>
</template>

<script setup lang="uts">
	function onClick(event: MouseEvent) {
		console.log('clicked')
	}
</script>
```
