# m-image 点击预览（preview）实施方案

## 需求

为 `m-image` 新增 `preview` 属性开启点击预览大图，可选 `preview-list` 指定预览图列表；内部封装 `uni.previewImage`，让使用方通过布尔属性获得一致的跨端预览体验（用户提案，对标 Vant Image 的预览能力）。

## 需求分析

- **涉及组件**：仅 m-image（既有组件扩展，只改既有文件与文档）
- **文件影响面**：
  - `packages/core/components/m-image/m-image.uvue`：新增 props + 点击处理逻辑
  - `packages/core/theme/vars.scss`：**无需新增**（预览走系统原生 API，无自绘 UI，无主题变量）
  - `packages/playground/pages-sub/image/image.uvue`：演示页新增「点击预览」小节（preview 单图 / preview-list 多图 / 与 click 事件并存三例）
  - `packages/docs/src/components/image.md` + `src/en/components/image.md`：Props 表新增两行 + 用法示例
  - 文档侧栏：无新增页面，仅内容更新，`zh.ts` / `en.ts` 不动
  - `playground/uni_modules/m-ui-x/changelog.md`（KEEP）：0.3.1 或 0.3.2 段补一条
  - 文档站 changelog.md（zh / en）：同步补条目
- **技术底座**：`uni.previewImage({ urls, current })`——用户提案确认 Web / 微信 / 支付宝小程序 / Android / iOS / HarmonyOS 兼容良好；实现时需按 HBuilderX 文档核实 uni-app x 端回调签名（success / fail / complete 可选）

## 伪代码设计

### Props 清单

```
preview?: boolean          // 是否开启点击预览大图，默认 false
previewList?: string[]     // 预览的图片地址列表，默认空数组；不传（或为空）时使用 [src]
```

模板与既有逻辑不变（根节点已有 `@click="onClick"`，复用现有入口）。

### 关键逻辑分支（onClick 内）

```
function onClick(e: MouseEvent) {
    emit('click', e)                          // click 事件始终透传，不因 preview 开启而吞掉（待 Q2 确认）
    if (!props.preview) return
    let urls: string[] = props.previewList
    if (urls.length == 0) urls = [props.src]  // 未传列表回退单图
    let current = 0                            // 待 Q3：current 取 src 在 urls 中的索引，找不到回退 0
    uni.previewImage({ urls: urls, current: current })
}
```

### 不做的事（边界）

- 不做自绘预览层（对齐 Vant 用系统原生 API，无 overlay / 动画定制，故无主题变量、无 Slots）
- 不做 `show-preview` 独立开关（Vant 语义里 preview 是受控函数式调用场景，本组件点击即开，布尔足够）
- 不拦截 disabled / 加载失败态：占位层显示中仍可点击预览（图片本身失败与预览互不影响，previewList 可传可用图）——待 Q4 确认是否需要在 error 态禁用预览

## 疑问清单

### Q1 API 命名：`preview` + `preview-list` 还是 Vant 的 `preview-src-list`？（影响：Props 命名 / 文档 / 未来兼容）

用户提案为 `preview`（boolean 开关）+ `preview-list`（列表）。Vant Image 是 `preview-src-list`（传列表即隐式开启预览，无独立布尔）。本组件库既有惯例是对齐 Vant 命名（如 cascader / calendar），但提案的布尔开关更简单直白。

回答：`preview`（boolean 开关）+ `preview-list`（列表）。

### Q2 preview 开启后 click 事件是否仍透传？（影响：事件语义 / 文档表述）

方案 A：始终透传（既弹预览又触发 click，不破坏既有监听方）；方案 B：preview 开启时吞掉 click（点击语义专用于预览，与 Vant 中 preview 开启时不触发 click 的行为一致）。

回答：A。

### Q3 多图预览的 current 起始索引规则？（影响：previewList 与 src 不一致的边界）

方案 A：取 `src` 在 `previewList` 中的索引，找不到回退 0；方案 B：始终从 0 开始；方案 C：提供独立 prop 显式指定起始索引。

回答：提供独立 prop 显式指定起始索引，如果未指定则取 `src` 在 `previewList` 中的索引，找不到回退 0。

### Q4 图片加载失败（error 占位态）时是否禁用预览？（影响：点击处理分支）

方案 A：不区分状态，开启 preview 即可点（占位层之下图片可能已重试成功，且 previewList 传的图与展示图可不同源）；方案 B：仅 success 态可预览。

回答：B。

## 实施记录

### 方案落地形态（与伪代码设计的差异）

- props 命名按 Q1 回答落地：`preview`（boolean）+ `preview-list`（string[]）+ `preview-current`（number，Q3 要求的显式起始索引）
- `previewList` / `previewCurrent` 默认值写法对齐库内数组 prop 惯例（m-cascader options 先例）：类型标注不带 `| null`、默认 null，运行时未传即 null
- onClick 内 urls 拷贝采用逐项 push 构建 `string[]`（UTS 数组类型收窄，避免直接复用 props 引用）
- 其余与伪代码一致：click 始终透传（Q2 回答 A）→ preview 关闭即返回 → 仅 success 态响应（Q4 回答 B）→ 列表回退 `[src]` → 索引规则 previewCurrent 优先、否则 src 在列表中的索引、找不到回退 0

### 变更文件清单

- `packages/core/components/m-image/m-image.uvue`：Props 新增 preview / previewList / previewCurrent 三项，onClick 扩展预览逻辑
- `packages/playground/pages-sub/image/image.uvue`：新增「点击预览」小节（单图 / 多图 preview-list / preview-current + click 并存三例）与 previewSrcs 数据、preview-item 间距类
- `packages/docs/src/components/image.md` / `src/en/components/image.md`：介绍、点击预览示例小节、Props 表三行
- `packages/docs/src/changelog.md` / `src/en/changelog.md`：0.3.1 段新增「新增」类目与条目
- `packages/playground/uni_modules/m-ui-x/changelog.md`（KEEP）：0.3.1 段新增一条
- 主题 vars.scss：无变更（系统原生 API，无自绘 UI）

### 验证方式与结果

1. `pnpm sync:uni-modules` 同步 + `pnpm sync:uni-modules:check` 一致性通过
2. HBuilderX CLI `cli launch web` 启动 playground（端口 5174，进程归属确认），演示页 history 路由可达
3. 浏览器实测（debtool 驱动点击 + console + 截图）：组1 单图预览弹出指示器 1/1；组2 多图 `list=4` 弹出 1/4；组3 `preview-current=2` 弹出 3/4 且 console 捕获 `[image demo] preview image clicked (preview opens too)`（click 与预览并存）；控制台无运行时错误
4. `pnpm build:docs` 构建通过（含死链检查）
5. 调试日志已清理（临时 console.log 移除后重新 sync，一致性通过）

### 遗留 TODO

- 无

