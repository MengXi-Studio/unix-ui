# 快速上手

## 安装

```bash
npm install @meng-xi/unix-ui
```

## 引入主题变量（可选）

在项目根 `uni.scss` 中引入组件库主题变量：

```scss
@import '@meng-xi/unix-ui/theme/vars.scss';
```

组件样式直接使用 `$mxi-*` 变量（uni-app x 编译器会将项目根 `uni.scss` 自动注入每个组件的样式）。变量文件全部使用 `!default` 定义，因此：

- 在引入语句**之前**预先定义同名变量即可覆盖默认值
- 不引入该文件时，组件内部已内置默认值，可正常编译

主题定制示例：

```scss
// 自定义主题色（需在 @import 之前定义）
$mxi-color-primary: #10b981;

@import '@meng-xi/unix-ui/theme/vars.scss';
```

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
