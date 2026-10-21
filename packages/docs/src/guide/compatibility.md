# 平台兼容性

## 平台矩阵

| 平台 | 状态 | 说明 |
| --- | --- | --- |
| Web | ✅ 已实测 | HBuilderX 编译运行，渲染 / 事件 / 主题覆盖矩阵验证通过 |
| App-Android | 🔧 已适配 | 蒸汽模式编译验证通过，真机实测待进行 |
| App-iOS | 🔧 已适配 | 代码条件编译适配，待真机实测（需 macOS 环境） |
| App-HarmonyOS | 🔧 已适配 | 代码条件编译适配，待实测（需 DevEco Studio） |
| 小程序 | 🔧 已适配 | 代码条件编译适配，待开发者工具实测 |

## HBuilderX 版本要求

| 能力 | 最低版本 |
| --- | --- |
| 组件编译（uni-app x） | 5.08 |
| 样式隔离策略 2.0 | 4.13+ |
| `UniElement.animate`（加载动画，Android 蒸汽模式） | 4.53+ |

## 蒸汽模式

unix-ui 组件兼容蒸汽模式（vapor）编译。项目启用方式——在 `manifest.json` 中配置：

```json
{
	"uni-app-x": {
		"styleIsolationVersion": "2",
		"vapor": true,
		"vapor-render-target": "bytecode"
	}
}
```

组件内部不使用 vdom 模式专属能力，vdom 与 vapor 两种模式下行为一致。

## 平台差异处理

组件内部通过条件编译隔离平台差异，业务代码无需感知：

- Web 端补充 `cursor: pointer` 等鼠标体验样式
- 文字渲染统一置于 `<text>` 节点（ucss 约束文字样式不继承）
- 样式隔离采用策略 2.0，组件样式不污染全局

## 下一步

- [常见问题](/guide/faq)：编译与运行的高频问题
- [Button 按钮](/components/button)：组件 API 参考
