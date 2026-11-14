# 安装

## 环境要求

| 项目 | 要求 |
| --- | --- |
| 编译器 | HBuilderX `5.08` 及以上（uni-app x 编译器） |
| 工程类型 | uni-app x 工程（App / Web / 小程序均可） |
| 包管理器 | 可选；仅 npm 方式安装时需要 |
| 样式隔离 | 建议启用策略 2.0（HBuilderX 4.13+） |
| 蒸汽模式 | 兼容 vapor 编译，详见[平台兼容性](/guide/compatibility) |

## 方式一：uni_modules（推荐）

将组件库放入工程的 `uni_modules/m-ui-x/` 目录（可通过插件市场导入或手动拷贝），目录结构遵循 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir)：

```
uni_modules/m-ui-x/
├── components/
│   └── m-button/
│       └── m-button.uvue
├── utils/
│   └── date.uts
├── theme/
│   └── vars.scss
├── package.json
└── ...
```

组件即被 [easycom](https://doc.dcloud.net.cn/uni-app-x/component/#easycom) 自动扫描，**无需任何配置**。

::: tip 目录名必须为 m-ui-x
插件 id 为 `m-ui-x`，`uni_modules` 下的目录名须与之一致，否则 easycom 无法自动匹配组件。
:::

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

::: tip
若工程对 `node_modules` 内组件的解析异常，也可以把包内容复制到 `uni_modules/m-ui-x/`（目录名同上），改用方式一的零配置导入。
:::

## 验证安装

在任意页面模板中直接使用，无需 import 与注册：

```html
<template>
	<m-button type="primary">安装成功</m-button>
</template>
```

编译运行后能看到主色按钮即安装完成；若标签未渲染，请检查目录名与 easycom 规则，或参考[常见问题](/guide/faq)。

## 引入工具函数

组件库同时提供日期工具集，按需从 `utils` 入口引入：

```ts
// 汇总入口：一次拿到全部能力
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/index.uts'

// 按需入口：只依赖日期模块，路径更短
import { formatDate } from '@/uni_modules/m-ui-x/utils/date.uts'
```

完整函数清单见[日期工具](/tools/date)。

## 真机体验

不写代码也可以先在真机上体验组件效果：[下载 Android 演示 App（APK）](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1794590278532-__UNI__F1AA560_1794590268233.apk)——示例工程（playground）的云打包产物，每个组件一页穷举全部 props / 变体 / 事件。安装包随版本更新重新打包，链接以最新发版说明为准。

## 下一步

- [快速上手](/guide/getting-started)：基础用法、属性与事件
- [主题定制](/guide/theming)：覆盖默认主题变量
- [平台兼容性](/guide/compatibility)：各端支持情况与蒸汽模式
