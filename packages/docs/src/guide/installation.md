# 安装

## 环境要求

| 项目 | 要求 |
| --- | --- |
| 编译器 | HBuilderX `5.08` 及以上（uni-app x 编译器） |
| 工程类型 | uni-app x 工程，Web / App / 小程序均可 |
| 包管理器 | 可选，仅 npm 方式需要 |
| 样式隔离 | 建议启用策略 2.0（HBuilderX 4.13+） |
| 蒸汽模式 | 兼容 vapor 编译，详见[平台兼容性](/guide/compatibility) |

## 方式一：uni_modules（推荐）

把组件库放入工程 `uni_modules/m-ui-x/` 目录（插件市场导入或手动拷贝），目录结构遵循 [uni_modules 组件插件规范](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir)：

```
uni_modules/m-ui-x/
├── components/         # m-button/、m-input/ … 每个组件一个目录
├── utils/              # 日期工具入口 index.uts / date.uts
├── theme/
│   └── vars.scss       # 全部 $m-* 变量（!default）
├── static/             # 图标字体等静态资源
├── package.json        # 插件 id：m-ui-x
└── changelog.md
```

放入后组件即被 [easycom](https://doc.dcloud.net.cn/uni-app-x/component/#easycom) 自动扫描，**无需任何配置**。

::: tip 目录名必须为 m-ui-x
插件 id 为 `m-ui-x`，`uni_modules` 下的目录名须与之一致，否则 easycom 无法自动匹配组件。
:::

## 方式二：npm

```bash
npm install @meng-xi/unix-ui
```

安装后在 `pages.json` 配置 easycom 规则：

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

::: tip 组件未被识别时
HBuilderX 只扫描工程 `uni_modules/` 目录，部分版本对 `node_modules` 内组件的 easycom 解析不稳定。若标签无法渲染，把包内容复制到 `uni_modules/m-ui-x/`（目录名同上），改用方式一的零配置导入。
:::

## 验证安装

在任意页面模板中直接使用，无需 import 与注册：

```html
<template>
	<m-button type="primary">安装成功</m-button>
</template>
```

编译运行后能看到主色按钮即安装完成；若标签未渲染，请检查目录名与 easycom 规则，或参考[常见问题](/guide/faq#组件标签没有渲染)。

## 引入工具函数

组件库同时提供纯函数日期工具集，从两个等价入口按需引入：

```ts
// 汇总入口：一次拿到全部能力
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/index.uts'

// 短路径入口：只依赖日期模块（与 index.uts 导出完全一致）
import { formatDate } from '@/uni_modules/m-ui-x/utils/date.uts'
```

npm 方式把前缀换成包名即可（如 `@meng-xi/unix-ui/utils/date.uts`）。完整函数清单见[日期工具](/tools/date)。

## 升级

- **uni_modules**：用新版本覆盖 `uni_modules/m-ui-x/`，保留工程内已有业务代码；`package.json` / `changelog.md` 由插件包提供，无需手工改。
- **npm**：`npm install @meng-xi/unix-ui@latest`。
- 升级前先看[更新日志](/changelog)，重点关注标有“破坏性变更”的条目；历史版本中面板类组件均为内部重构，无 API 变更。

## 真机体验

不写代码也可以先在真机上看效果：[下载 Android 演示 App（APK）](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1795586984213-__UNI__F1AA560_1795586972273.apk)。它是示例工程（playground）的云打包产物，每个组件一页穷举全部 props / 变体 / 事件；安装包随版本重新打包，链接以最新发版说明为准。

## 下一步

- [快速上手](/guide/getting-started)：基础用法、属性、事件与双向绑定
- [主题定制](/guide/theming)：覆盖默认主题变量
- [平台兼容性](/guide/compatibility)：各端支持情况与蒸汽模式
