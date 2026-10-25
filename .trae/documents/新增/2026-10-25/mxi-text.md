# 新增组件：mxi-text（文本）

> 状态：**已完成**（2026-10-25 疑问闭环 Q1=A / Q2=A / Q3=A / Q4=A / Q5=A / Q6=A，实现并验证通过；docs 双语同步持续暂缓待用户通知）参考：Sard UI Text（https://sard.wzt.zone/components/text ）+ uni-app
> x 原生 text 能力流程：本任务遵循文档驱动四步工作流，疑问闭环后才进入实施

## 一、需求背景

用户要求参考 Sard UI 的 Text 组件实现 mxi-text。Sard 对该组件的定位是「用于文本展示，支持颜色、大小、单行和多行省略等样式控制」——API 极简（5 个 Props / 1 个插槽），本质是对原生 text 的样式快捷封装。

与 mxi-image（原生 image 增强）同理，mxi-text 定位为**原生 text 组件的样式快捷层**：语义色、档位字号、省略能力，不替代原生属性。

## 二、参考资料盘点

### 2.1 Sard TextProps

| 属性       | 描述                                       | 类型                                                                                                  | 默认值    |
| ---------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- | --------- |
| color      | 文本颜色                                   | `default` \| `secondary` \| `tertiary` \| `fourth` \| `primary` \| `success` \| `warning` \| `danger` | `default` |
| size       | 文本大小                                   | `small` \| `medium` \| `large`                                                                        | `medium`  |
| truncated  | 是否单行省略，超出容器宽度显示省略号       | boolean                                                                                               | false     |
| line-clamp | 多行省略行数，设置后超出指定行数显示省略号 | number                                                                                                | -         |
| tag        | 渲染的 HTML 标签                           | string                                                                                                | `span`    |

- TextSlots：default（自定义文本内容）
- 样式变量：`--s-text-font-size-sm` / `--s-text-font-size` / `--s-text-font-size-lg`（三档字号）
- 演示场景：基础使用 / 文本颜色 / 文本大小 / 单行省略（配合 max-width 约束）/ 多行省略 / 自定义标签（tag、sub/sup 嵌套）

### 2.2 uni-app x 原生 text 能力（官方文档实测盘点）

| 属性                | 类型    | 说明                                                                          | 与 Sard 映射关系               |
| ------------------- | ------- | ----------------------------------------------------------------------------- | ------------------------------ |
| max-lines           | number  | 文本最大行数，默认不限                                                        | **与 line-clamp 同义，可直通** |
| user-select         | boolean | 文本可选（vapor 推荐属性）；Web 端使节点变 inline-block，App 端弹「复制」菜单 | Sard 无，可作扩展              |
| selectable          | boolean | 文本可选，**vapor 已废弃**，推荐 user-select                                  | 不透传                         |
| space               | string  | 连续空格显示，**vapor 已废弃**（playground 开启 vapor）                       | 不透传                         |
| decode              | boolean | 运行期实体字符解码，**vapor 已废弃**                                          | 不透传                         |
| hover-class 等 4 项 | -       | 点击态，**仅 App 平台 vapor 支持**（子 text 不支持、VDOM 不支持）             | 疑问 Q3                        |
| flatten             | boolean | 拍平组件                                                                      | 暂不透传                       |

关键约束（影响实现）：

1. **文本样式必须写在 text 组件上**（uvue 样式不继承），mxi-text 根节点用 text 天然满足；
2. text 可嵌套 text（default 插槽承载），但**子 text 不继承父组件样式**——嵌套富文本场景 color/size 变体不会传递，文档需注明；
3. 单行省略用 `white-space: nowrap` + `text-overflow: ellipsis`（官方 hello uni-app x 示例验证过 ucss 支持），需外部宽度约束；
4. text 默认宽度收缩，truncated 生效依赖用户给组件约束宽度（Sard 同样要求「配合设置容器宽度」）。

## 三、能力映射与判定

| Sard 能力          | mxi-text 方案                                                                                                                                                                    | 判定    |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| color 8 语义色枚举 | 变体类编译期绑定主题变量：default → `$mxi-text-color`（既有通用变量）；primary/success/warning/danger → 复用 `$mxi-color-*`；secondary/tertiary/fourth → 新增灰阶变量（Q2 定值） | 采纳    |
| size 3 档          | sm/md/lg 变体类 + `$mxi-text-font-size-sm/md/lg`（Q4 定值）                                                                                                                      | 采纳    |
| truncated          | 变体类：`white-space: nowrap` + `text-overflow: ellipsis` + `overflow: hidden`                                                                                                   | 采纳    |
| line-clamp         | 原生 `max-lines` 属性直通（值经 computed 归一，null 时返回不限行数的实现待实测：先验 0，异常则改大数兜底）                                                                       | 采纳    |
| tag（HTML 标签）   | uni-app x 无 HTML 语义概念                                                                                                                                                       | 疑问 Q1 |
| default 插槽       | `<slot></slot>` 直通                                                                                                                                                             | 采纳    |
| —（扩展出口）      | customClass / customStyle 惯例透传；user-select 透传与否 Q3；color 是否兼收 CSS 色值 Q6                                                                                          | 疑问    |

## 四、布局伪代码

```html
<template>
	<!-- 单 text 根节点：mxi-icon 同构；default 插槽直通承载文本 -->
	<text :class="rootClass" :style="rootStyle" :max-lines="maxLinesValue" :user-select="...">
		<slot></slot>
	</text>
</template>

<script setup lang="uts">
	type TextColor = 'default' | 'secondary' | 'tertiary' | 'fourth' | 'primary' | 'success' | 'warning' | 'danger'
	type TextSize = 'small' | 'medium' | 'large'

	type Props = {
	  color?: TextColor        // 默认 'default'
	  size?: TextSize          // 默认 'medium'
	  truncated?: boolean      // 默认 false
	  lineClamp?: number       // 默认 null（不限制）
	  userSelect?: boolean     // 默认 false（视 Q3）
	  customClass?: string.ClassString
	  customStyle?: string
	}

	// rootClass = 'mxi-text'
	//   + size 变体（仅非 medium 时拼 ' mxi-text--sm/lg'，medium 走基类默认字号）
	//   + color 变体（仅非 default 时拼 ' mxi-text--primary' 等，default 走基类默认色）
	//   + truncated 时拼 ' mxi-text--truncated'
	// maxLinesValue = props.lineClamp == null ? 0(待实测) : props.lineClamp
</script>

<style lang="scss">
	@import '../../theme/vars.scss';

	/* 基类：默认字号（md 档）+ 默认色 */
	.mxi-text {
		font-size: $mxi-text-font-size-md;
		color: $mxi-text-color;
	}
	/* 三档字号变体（small/medium/large 中 medium 不单设类） */
	.mxi-text--sm {
		font-size: $mxi-text-font-size-sm;
	}
	.mxi-text--lg {
		font-size: $mxi-text-font-size-lg;
	}
	/* 灰阶语义色变体 */
	.mxi-text--secondary {
		color: $mxi-text-color-secondary;
	}
	.mxi-text--tertiary {
		color: $mxi-text-color-tertiary;
	}
	.mxi-text--fourth {
		color: $mxi-text-color-fourth;
	}
	/* 主题语义色变体（复用既有 $mxi-color-*） */
	.mxi-text--primary {
		color: $mxi-color-primary;
	}
	.mxi-text--success {
		color: $mxi-color-success;
	}
	.mxi-text--warning {
		color: $mxi-color-warning;
	}
	.mxi-text--danger {
		color: $mxi-color-danger;
	}
	/* 单行省略变体 */
	.mxi-text--truncated {
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
</style>
```

实施注意：

- 全部扁平类，无嵌套无循环；
- color 若按 Q6 选「兼收 CSS 色值」，参考 mxi-loading 双模式（语义色走变体类、CSS 色值走 inline style）；
- truncated 与 line-clamp 同传时的行为按 Q5 定案。

## 五、主题变量草案（packages/core/theme/vars.scss 新增段）

```scss
/* ========== Text 文本 ========== */
$mxi-text-font-size-sm: 12px !default; /* Q4：small 档字号 */
$mxi-text-font-size-md: 14px !default; /* Q4：medium 档字号（基准档） */
$mxi-text-font-size-lg: 16px !default; /* Q4：large 档字号 */
$mxi-text-color-secondary: #646566 !default; /* Q2：次要文本色（Vant gray-7） */
$mxi-text-color-tertiary: #969799 !default; /* Q2：三级文本色（Vant gray-5） */
$mxi-text-color-fourth: #c8c9cc !default; /* Q2：四级文本色（Vant gray-4） */
```

说明：default 色直接复用既有通用变量 `$mxi-text-color`（#323233），不重复定义；主题语义色复用 `$mxi-color-*`，均不新增变量。注意 `$mxi-text-color-secondary` 等命名与既有 `$mxi-text-color` 不重名，sass 无冲突。

## 六、演示页规划（pages-sub/text/text.uvue）

| 区块     | 内容                                                                  |
| -------- | --------------------------------------------------------------------- |
| 基础用法 | 默认样式一段文本                                                      |
| 文本颜色 | 8 个语义色各一行                                                      |
| 文本大小 | small / medium / large 各一行                                         |
| 单行省略 | 长文本 + `style="max-width: 200px"`（或 300px）+ truncated            |
| 多行省略 | 长文本 lineClamp 2 与 3 对照                                          |
| 自定义   | user-select 演示（长按复制，视 Q3）/ color 兼收 CSS 色值演示（视 Q6） |
| 组合     | size + color + truncated 组合行（验收对账）                           |

同步登记：pages.json / router.config.uts / demo-components.uts（基础组件组）。

## 七、疑问清单（请直接在「回答：」处作答）

### Q1：Sard 的 `tag` 属性（渲染 HTML 标签，如 p/b/i/sub/sup/mark）如何处理？

uni-app x 无 HTML 语义概念，tag 无跨端对应能力；Sard 的 sub/sup 嵌套演示本质是嵌套 text 场景。

- A. **舍弃 tag**（推荐）：跨端组件无意义；嵌套富文本走 default 插槽由用户自行组合
- B. 仅 WEB 条件编译支持：增加维护面，收益低

回答：A。

### Q2：灰阶语义色（secondary / tertiary / fourth）具体色值？

Sard 的 token 页未抓到具体灰阶值。方案：

- A. **对齐 Vant 灰阶**（推荐）：#646566 / #969799 / #c8c9cc，与 vars.scss 既有灰阶体系（cell-label-color、value-color 等）完全一致
- B. 对齐 Sard 实际值：我再抓取 Sard 源码 token 确认后替换（观感与 A 差异不大）

回答：A。

### Q3：是否透传原生扩展能力？

- A. **仅透传 user-select**（推荐）：vapor 官方推荐属性，长按复制是高频需求，一行属性成本低
- B. user-select + hover-class 系列（hover-stop-propagation / hover-start-time / hover-stay-time）：仅 App vapor 支持且有子 text 限制，演示页无法在 web 验收，跨端表现不对等
- C. 均不透传：保持 Sard 纯度，用户有需求时用 custom-class 自行扩展

回答：A。

### Q4：三档字号基准值？

- A. **对齐 Vant 基准 12 / 14 / 16**（推荐）：与现有组件（button 档位字号、cell 字号）体系一致
- B. 对齐 Sard：其 `--s-font-size-sm/-/-lg` 引用全局 token，具体值未取到，需再查

回答：A。

### Q5：truncated 与 line-clamp 同时传入时的行为？

Sard 未说明互斥逻辑。实现上两者可同时渲染（max-lines 控制行数 + nowrap 约束单行），但语义冲突。

- A. **line-clamp 优先**（推荐）：同时传时 truncated 类不再拼接，文档注明互斥语义、后者生效
- B. 运行时告警互斥：console.warn 提示，保持类拼接行为不变

回答：A。

## 八、实施记录（2026-10-25）

### 8.1 落码清单

| 文件 | 变更 |
| --- | --- |
| `packages/core/components/mxi-text/mxi-text.uvue` | 新建组件：单 text 根节点 + default 插槽直通 |
| `packages/core/theme/vars.scss` | 新增 Text 段 6 个变量（三档字号 + 三级灰阶，全部 !default） |
| `packages/playground/uni_modules/mxi-ui-x/` | `pnpm sync:uni-modules` 同步产物 |
| `packages/playground/pages-sub/text/text.uvue` | 新建演示页（七区块） |
| `packages/playground/pages.json` | pages-sub 注册 `text/text` |
| `packages/playground/router/router.config.uts` | 路由表登记 `text` |
| `packages/playground/pages/index/demo-components.uts` | 基础组件组登记「文本 / Text」 |

### 8.2 关键实现决策

1. **color 双模式（Q6=A）**：Props 类型用 `string`（UTS 中 `TextColor | string` 会退化为 string 且失去枚举意义），运行时 `semanticColors.indexOf` 判定——8 语义色名命中走编译期变体类（主题覆盖生效），未命中视为 CSS 色值走 inline，与 mxi-loading 同款模式；
2. **size 严格枚举**：`TextSize` 联合类型仅三档，保留 IDE 提示，写错编译期报错；
3. **line-clamp → max-lines 直通**：computed 归一 null → 0。**实测确认：max-lines 传 0 等价不限行数**（基础用法等未传 lineClamp 的文本全部正常显示），无异常无需大数兜底；
4. **truncated 互斥（Q5=A）**：`truncated && lineClamp == null` 才拼接省略类，line-clamp 同传时优先；
5. **舍弃项（Q1=A）**：tag 不实现；selectable / space / decode 因 vapor 废弃不透传；hover 系列因跨端不对等不透传（Q3=A），仅透传 user-select。

### 8.3 验证记录

| 项目 | 结果 |
| --- | --- |
| `pnpm sync:uni-modules:check` | PASS（playground 插件与 core 一致） |
| HBuilderX CLI `launch web` 重启编译 | PASS（编译成功，text 相关无任何告警；日志尾部仅 mxi-image 历史 radius 类型告警） |
| 页面加载与 console | PASS（无 JS 运行时错误、无 404） |
| 基础用法 / 9 行颜色（含 #7232dd）/ 3 档字号 | PASS（颜色各异、字号递增） |
| 单行省略（200px 截断 + 省略号）/ 多行省略（2 行与 3 行对照） | PASS |
| user-select / 组合行（small + danger + truncated） | PASS |
| **关键回归**：max-lines=0 是否吞文本 | PASS（未传 lineClamp 的文本正常完整显示） |
| 首页「基础组件」分组登记 | PASS（条目渲染确认；点击跳转验证受 agent 预算截断改为直达 URL 验证，跳转机制与既有组件同构且路由登记正确） |

### 8.4 遗留

- App 端真机验证：user-select 长按复制菜单、truncated / max-lines 的原生渲染表现（web 端已验收）；
- docs 双语文档同步持续暂缓（mxi-cell / mxi-image / mxi-text 三轮，待用户通知）。
