# mxi-icon 图标组件 实施方案

## 需求

新增图标组件 `mxi-icon`，参考 Vant Icon（https://vant-ui.github.io/vant/#/zh-CN/icon ）：基于字体图标的图标集，支持图标名渲染、图片 URL 渲染、颜色与大小自定义、点击事件；为后续组件（如 Tag 关闭按钮、Empty、Toast 等）提供图标基础设施。

## 需求分析

### Vant Icon API 全貌（源码 Icon.tsx + README.zh-CN.md 已核对）

| Vant prop/event | 说明 | uni-app x 适配判定 |
| --- | --- | --- |
| name | 图标名称或图片链接（`name` 含 `/` 判定为图片，源码 `isImage`） | 对齐：查码点映射表渲染 text；含 `/` 渲染 image |
| color | 图标颜色，默认 `inherit` | 对齐：uvue 文字继承不可靠，默认值走主题变量（`$mxi-text-color`） |
| size | 图标大小，默认 `inherit`，纯数字补 px | 对齐：复用 mxi-loading 的 `addUnit` 思路 |
| dot | 右上角小红点 | 依赖 Badge 组件（本库未建），本轮是否实现待定 → Q2 |
| badge | 右上角徽标内容（number \| string） | 同上 → Q2 |
| badge-props | 透传给 Badge 的属性 | 同上（若 Q2 选不做则一并顺延） |
| class-prefix | 类名前缀，接第三方 iconfont | uni-app x 无伪元素，机制不同（用户须自行 loadFontFace + 提供码点映射）→ Q4 |
| tag | Web HTML 标签名（默认 `i`） | 移除：uni-app x 无 HTML 标签概念 |
| click | 点击事件 | 对齐 |
| default 插槽 | 源码存在（`slots.default?.()`） | 不提供：Icon 内容即图标本身，插槽无使用场景 |

### uni-app x 技术约束（官方文档已核对；初版对 @font-face 判断有误，已修正）

- ucss **支持 `@font-face`**（官方 at-rules 支持列表，仅支持 `font-family` 与 `src` 两个描述符）；App 端不支持伪元素 → 字体图标唯一跨端写法是 **unicode 直显**（text 组件 `{{'\uxxx'}}`），官方推荐封装成组件以 `type` 表意（即 uni-icons 模式）
- 字体路径支持**网络与本地**，本地字体放**项目或 uni_modules 的 static 目录**（官方 Tips 原文）；**ttf/otf 全平台支持**，woff/woff2 在 App-Android 不可用（loadFontFace 文档同源约束）
- `uni.loadFontFace` 仅在需要编程控制字体时使用——本组件用 `@font-face` 声明式方案即可，无需 JS 加载
- 官方 uni-icons 实证：插件样式内 `@font-face` 引入 `uni_modules/<插件>/static/` 下的 uniicons.ttf，全端可用

### 官方 uni-icons 实现对照（用户指出偏差后核对修正）

| 维度 | 官方 uni-icons | 本方案修正 |
| --- | --- | --- |
| 字体加载 | 组件样式内 `@font-face` 引入插件 static 目录 ttf | 同（替代初版的 loadFontFace + CDN 方案） |
| 渲染结构 | 单 text 根节点，unicode 直显 | 同 |
| 图标名类型 | `type` 为字符串联合类型（161 个，IDE 自动提示，源码 icons.uts 导出 IconsType） | → Q5：联合类型 vs string 查表 |
| 颜色/字号 | 无 color/size props，用户直接在标签上写 class/style 作用于 text 根节点 | 保持 Vant 对齐：提供 color/size props（默认空 → 不写 inline 样式，标签样式直达效果一致），兼具编程控制能力 |
| 自定义字体 | 用户自写 `@font-face` + class 覆盖 font-family（必要时 !important） | → Q4：class 覆盖 vs icon 插槽 |
| 徽标（dot/badge） | 无 | Q2 已答：本轮不做 |

### 字体文件获取途径

@vant/icons（v3.0.2）npm 包内**无裸 ttf**（Vant 将 woff2 以 base64 内嵌于 CSS `encode-woff2.less`）。方案：从 vant 主包 CSS 提取 base64 woff2 → fonttools 解码转 ttf（一次性脚本，放 /tmp 不进仓库）；同时从 CSS 的 `::before content` 码点 + `config.js` 图标名列表生成 name→码点映射表。

ttf 落点：`packages/core/static/vant-icon.ttf` → sync 后位于 `uni_modules/mxi-ui-x/static/vant-icon.ttf`（官方支持的本地字体路径），组件样式顶层 `@font-face` + `src: url('/uni_modules/mxi-ui-x/static/vant-icon.ttf')`。

### 影响面

- 新增 `packages/core/components/mxi-icon/`：`mxi-icon.uvue` + `icons.uts`（码点映射表，单文件体量大拆分符合架构例外条款）
- 新增 `packages/core/static/vant-icon.ttf`；**sync 脚本 `scripts/sync-uni-modules.mjs` 的 INCLUDE 扩展 `'static'`**（工程脚本改动，当前 INCLUDE 仅 components/theme/readme/license）
- `packages/core/theme/vars.scss`：本轮**不新增**变量段（color/size 默认空值、标签样式直达，跟随官方 uni-icons 无默认样式设计；后续库内组件引用需要默认值时再补）
- `pnpm sync:uni-modules` 同步
- 演示页 `packages/playground/pages-sub/icon/icon.uvue` + `pages.json` 注册（按 config.js 分组 basic/outline/filled 循环渲染 + props 演示）
- 双语文档 `components/icon.md` + `en/components/icon.md` + 侧栏 zh.ts / en.ts + changelog zh / en

## 伪代码设计

### Props

| prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| name | 视 Q5（联合类型 / string） | - | 图标名称（Q5 选 string 时兼容图片 URL，含 `/` 渲染 image） |
| color | string | 空 | 图标颜色；为空不写 inline 样式（标签 class/style 直达 text 生效） |
| size | string | 空 | 图标大小；纯数字自动补 px；为空不写 inline 样式 |
| custom-class / custom-style | - | - | 项目惯例，作用于根节点 |

### Events

| 事件 | 说明 |
| --- | --- |
| click | 点击图标时触发（event: MouseEvent） |

### 结构与逻辑

```
根节点（视 Q5）
├─ Q5 选联合类型：单 text 根节点（官方 uni-icons 同构）：font-family 'mxi-icon'；内容 = 查表码点；color/size 非空时写 inline style；click 直接挂 text
└─ Q5 选 string：view 根（承载 click，flex 行内收缩）
   ├─ text（字体分支）：查表码点
   └─ image（图片分支，name 含 '/'）：src = name，宽高 = size
```

- 字体：组件 style 顶层 `@font-face { font-family: mxi-icon; src: url('/uni_modules/mxi-ui-x/static/vant-icon.ttf'); }`——声明式、零 JS、离线可用、ttf 全端支持（与官方 uni-icons 同构）
- 映射表未命中：不渲染（控制台 warn 提示无效 name），与官方「取值不存在时不显示图标」一致
- 图标名与码点：Q1 已答全量引入，`icons.uts` 由一次性脚本从 vant CSS 码点 + config.js 名称生成

### 主题变量（拟新增）

本轮**不新增**——color/size props 默认空、无默认样式，跟随官方 uni-icons「标签样式直达」设计；Vant 的 `--van-icon-font-family` 对应物是组件内写死的 `mxi-icon`（无多字体切换场景，不做变量化）。

### 映射表 icons.uts（生成物，一次性脚本产出）

```uts
export const iconCodepoints: Map<string, string> = new Map()
iconCodepoints.set('arrow', '\ue6b1') // ~300 行
```

## 疑问清单

### Q1 图标范围：全量引入还是常用子集？（影响：映射表体量、字体文件、文档对齐度）

方案 A（推荐）：全量引入 Vant 图标（basic 12 + outline/filled 约 300+），name 与 Vant 文档完全对齐——映射表与 ttf 由脚本一次生成，后续组件（Tag/Empty/Cell 等）引用不受限
方案 B：精选常用子集（约 60~80 个）——包体更小，但选哪些需再确认，且与 Vant 文档示例对不齐

回答：A。

### Q2 dot / badge 徽标能力本轮是否实现？（影响：组件结构、是否提前引入 Badge 职责）

方案 A（推荐）：本轮不实现，等 mxi-badge 组件建立后按 Vant 结构（Icon 包 Badge）扩展——Icon 保持单一职责
方案 B：本轮内联简化实现（绝对定位红点 + 数字徽标，样式硬编码 $mxi-icon-badge-*），后续 Badge 组件就位后再迁移

回答：A。

### Q3 字体分发策略（初版方案作废重写：官方 uni-icons 实证后已无 CDN/loadFontFace 必要）

初版三选项（CDN / loadFontFace 指向包内路径 / base64）基于「ucss 无 @font-face」的误判，全部作废。修正后方案：

**ttf 随包内置**：`packages/core/static/vant-icon.ttf` → sync 后 `uni_modules/mxi-ui-x/static/vant-icon.ttf`（官方 Tips 明确支持的本地字体路径）→ 组件样式顶层 `@font-face` 声明。零配置、离线可用、ttf 全端支持，与官方 uni-icons 完全同构。

唯一代价：**sync 脚本 INCLUDE 需扩展 `'static'`**（当前仅 components/theme/readme/license 四项；KEEP 机制不受影响）。

回答：确认（2026-10-22 用户指示「已作答，请严格执行」，对 ttf 随包 + sync 脚本 INCLUDE 扩展 'static' 无其他意见，转记生效）。

### Q4 自定义图标出口？（初版选项已按官方惯例修正）

方案 A（推荐）：跟随官方 uni-icons 惯例——用户自写 `@font-face` + `custom-class` 覆盖根节点 font-family（配合自有字体与码点），不新增插槽
方案 B：方案 A 基础上再提供 `icon` 插槽（与 mxi-loading 一致，可放任意内容），成本极低
方案 C：实现 uni-app x 化的 class-prefix（prop 传第三方 fontFamily 名，name 仍查表）——仅覆盖「用户已加载同族字体」场景，收益有限

回答：B。

### Q5 name 类型：联合类型还是 string？（新增：官方 uni-icons 用联合类型，Vant 用 string）

方案 A（推荐，官方 uni-icons 同构）：`name` 为字符串联合类型 `IconName`（由脚本从 config.js 生成，~300 个成员）——IDE 自动提示全部图标名、写错编译期报错；**放弃 Vant 的图片 URL 能力**（联合类型容不下任意 URL），组件为单 text 根节点
方案 B（Vant 对齐）：`name` 为 string，运行时查表；含 `/` 渲染 image（保留 Vant 图片 URL 能力）；组件为 view 根包 text/image 两分支，IDE 无提示

回答：A。

## 实施记录

**完成（2026-10-22）**，按已答疑问（Q1=A / Q2=A / Q3=ttf 随包 / Q4=B / Q5=A）全量落地，与伪代码设计无偏离。

### 方案落地形态

- **字体链路**：@vant/icons 包内无裸 ttf，从 vant 4.10.2 主包 `lib/index.css` 提取内嵌 base64 woff2（与 @vant/icons encode-woff2.less 同源，取 vant CSS 保证字体与码点同包一致）→ fonttools+brotli 解码转 ttf（262 glyphs，59KB）；码点取自 CSS `.van-icon-xxx:before{content:"\eXXX"}`（259 条，config.js 257 个名称全量命中 cmap，弃用别名 arrow-double-left/right 未纳入）。
- **icons.uts**（脚本生成物，17.9KB）：`IconName` 联合类型（257 成员，多行竖线格式）+ `iconCodepoints: Map<string, string>` + `iconBasicNames / iconOutlineNames / iconFilledNames` 三分组数组（10/139/108）。
- **组件**：单 `text` 根节点（官方 uni-icons 同构），`v-if="codepoint != ''"` 兜底无效名不渲染 + watch immediate warn；`color` / `size` 为空不写 inline（标签样式直达），size 复用 mxi-loading 的 addUnit 补 px 思路；`custom-class` / `custom-style` 作用于根节点；`click` 事件 emit 透传 MouseEvent；`icon` 插槽 fallback 为码点文本。
- **@font-face**：组件 style 顶层声明，`src: url('/uni_modules/mxi-ui-x/static/vant-icon.ttf')` 写死路径（web dev 实测 200、font/ttf）；ucss 仅支持 font-family/src 两描述符，未写 format。
- **vars.scss 本轮未新增变量段**（按方案：无默认样式，跟随官方 uni-icons 设计）。

### 变更文件清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/mxi-icon/mxi-icon.uvue` | 新增（组件实现） |
| `packages/core/components/mxi-icon/icons.uts` | 新增（码点映射，脚本生成物） |
| `packages/core/static/vant-icon.ttf` | 新增（字体，59KB） |
| `scripts/sync-uni-modules.mjs` | INCLUDE 扩展 `'static'` |
| `packages/playground/uni_modules/mxi-ui-x/**` | `pnpm sync:uni-modules` 同步产物 |
| `packages/playground/pages-sub/icon/icon.uvue` + `pages.json` | 演示页 + 路由注册 |
| `packages/docs/src/components/icon.md` + `src/en/components/icon.md` | 双语文档（含 257 图标清单折叠块） |
| `packages/docs/.vitepress/config/zh.ts` + `en.ts` | 侧栏登记 |
| `packages/playground/uni_modules/mxi-ui-x/changelog.md` | 未发布段登记（KEEP 手工维护） |
| `.trae/documents/implementation-log.md` | 索引追加 |

### 验证方式与结果

1. `pnpm sync:uni-modules:check` 一致性通过。
2. HBuilderX web dev server（5174 端口，归属确认）编译成功，无错误 overlay。
3. 浏览器实测 6 项全过：257 图标字形正常渲染（无方块/空白）；console 仅 1 条 info 无 error；vant-icon.ttf 请求 200（font/ttf）；点击图标「最近点击」状态条更新（arrow）；三分组网格 + 颜色/大小/custom-class/icon 插槽各区块渲染正常。
4. `pnpm build:docs` 构建通过（VitePress 死链检查）。
5. 无临时调试代码残留（转换/生成脚本均在 /tmp，未进仓库）。

### 遗留 TODO

- dot / badge 徽标能力：等 mxi-badge 组件建立后按 Vant 结构（Icon 包 Badge）扩展（Q2 结论，位置：本组件扩展点）。
- ttf 全端验证仅覆盖 web；App-Android / App-iOS 端 `@font-face` 路径解析待真机/基座实测（官方文档支持 uni_modules static 路径，风险低）。
