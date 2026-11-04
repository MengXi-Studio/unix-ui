# m-cascader 级联选择三组件 实施方案

## 需求

用户要求参考 Vant Cascader（`https://vant-ui.github.io/vant/#/zh-CN/cascader`）实现三个组件：**级联选择（m-cascader）、级联弹出框（m-cascader-popup）、级联输入框（m-cascader-input）**，拆分方式与日历三组件（m-calendar / m-calendar-popup / m-calendar-input）一致。

目标行为：多级联动选择（如省市区），顶部 tab 展示各级已选层级、点击选项进入下一级、选到最后一级触发完成；可与弹层组合为下拉选择，与输入框组合为表单触发器。

参考实现（Vant Cascader）要点：

| 维度 | Vant 实现 |
| --- | --- |
| Props | `v-model`（选中叶子 value）、`title`、`options`（树形数组）、`placeholder`（未选中 tab 文案，默认 Select）、`active-color`、`swipeable`（手势滑动，默认 true）、`closeable`（默认 true）、`show-header`（默认 true）、`close-icon`、`field-names`（自定义字段名） |
| Events | `change({ value, selectedOptions, tabIndex })`、`finish({ value, selectedOptions, tabIndex })`、`close`、`click-tab(activeTab, title)` |
| Slots | `title`、`option({ option, selected })`、`options-top({ tabIndex })`、`options-bottom({ tabIndex })` |
| CascaderOption | `text` / `value` / `color` / `children` / `disabled` / `className` |
| 交互 | 头部（标题 + 关闭图标）→ tabs（已选层级标题 + 未选 tab 显示 placeholder）→ 选项列表（固定高度 384px 内部滚动，选中项高亮 + 对勾图标） |
| 默认值 | header 高 48px、tabs 高 48px、options 高 384px、active-color 默认主题色 |

## 需求分析

| 层 | 落点 | 内容 |
| --- | --- | --- |
| core 共享类型 | `packages/core/components/m-cascader/cascader.uts` | `CascaderOption` / `CascaderFieldNames` / `CascaderChangeEvent` 等类型与「按路径查找层级选项」工具函数（对标 calendar.uts 先例） |
| core 面板 | `packages/core/components/m-cascader/m-cascader.uvue` | 纯面板：头部 + tabs + 选项列表 + 全部状态与事件（对标 m-calendar 单组件形态，不再拆 panel——级联无月份网格等重型渲染，单文件可控） |
| core 弹出框 | `packages/core/components/m-cascader-popup/m-cascader-popup.uvue` | m-popup（bottom + round 默认）组合 m-cascader，props / 事件 / 插槽条件转发（对标 m-calendar-popup） |
| core 输入框 | `packages/core/components/m-cascader-input/m-cascader-input.uvue` | m-input 只读触发器 + m-cascader-popup 组合，`v-model:value` 回填「text/text/text」、自绘清空、disabled / border / inlaid（对标 m-calendar-input） |
| 主题变量 | `packages/core/theme/vars.scss` | 新增 `$m-cascader-*` 段（header / tabs / options 三区高度与色彩、active-color 复用 `$m-color-primary`、disabled 复用 `$m-disabled-opacity`） |
| 演示页 | `packages/playground/pages-sub/cascader/cascader.uvue` + 注册三件套 | 一页穷举：基础面板、弹层组合、输入框组合、自定义颜色、异步加载（若 Q3 ①）、field-names（若 Q4 ①）、插槽（按 Q5 结论）、全部事件 |
| 使用文档 | `packages/docs/src/components/cascader.md`、`src/en/components/cascader.md` | 双语文档（三组件各一节 API 表） |
| 侧栏导航 | `.vitepress/config/zh.ts`、`en.ts` | 「表单组件」按字母序插入 cascader |
| changelog | 文档站 zh / en、`playground/uni_modules/m-ui-x/changelog.md` | 0.3.0 追加条目（0.3.0 尚未发布） |

### uni-app x 技术约束（影响方案选型）

1. `CascaderOption` 是递归 type（`children` 引用自身数组）。UTS 的 type 递归引用未在本项目验证过，是最主要编译风险；若编译器不支持，回退方案为 `children: any[] | null` + 工具函数内强转。
2. tabs 需横向滚动：用 scroll-view（`:scroll-x`）承载；Vant 的「选中 tab 居中滚动」降级为「点击后 scroll-into-view 对齐」（能力差异在文档标注）。
3. 选项列表固定高度内部滚动：scroll-view（`:scroll-y`）+ 固定 `options-height`（Vant 同款 384px 默认值）。
4. 无手势轮播需求的前提下不引入 swiper（见 Q2）；层级切换为瞬时替换，无左右滑动动画（Vant 的滑动动画依赖 swiper，属 Q2 决策）。
5. 异步加载依赖 options 为 reactive 数据：业务在 `change` 回调中修改 `options[i].children`，vue 响应式自动渲染新层级（组件不持有 options 副本，直接消费 props 引用——与日历 formatter 消费方式一致）。
6. 插槽作用域对象（`{ option, selected }` / `{ tabIndex }`) 在 Web 端已验证可用（m-waterfall 实证）；App 端真机待验（统一登记 TODO）。
7. `value` 联合类型 prop 有 VDOM 诊断前科（LESSONS #73），见 Q1。

## 伪代码设计

### 结构

```
<!-- m-cascader（纯面板） -->
<view class="m-cascader" :class="customClass" :style="customStyle">
  <view v-if="showHeader" class="m-cascader__header">
    <slot name="title"><text class="m-cascader__title">{{ title }}</text></slot>
    <m-icon v-if="closeable" :name="closeIcon" @click="emit('close')" />
  </view>
  <slot name="options-top" :tab-index="activeTab"></slot>
  <scroll-view :scroll-x="true" class="m-cascader__tabs">
    <view v-for="(tab, i) in tabs" @click="onTabClick(i)">
      <text :class="i === activeTab ? active 类 : 普通类">{{ tab.title }}</text>
      <view v-if="i === activeTab" class="m-cascader__tab-line" />
    </view>
  </scroll-view>
  <scroll-view :scroll-y="true" class="m-cascader__options" :style="optionsStyle">
    <view v-for="opt in currentOptions" @click="onOptionClick(opt)">
      <slot name="option" :option="opt" :selected="opt.value === 当前层选中值">
        <text :style="文字色（opt.color / disabled / active）">{{ opt.text }}</text>
      </slot>
      <m-icon v-if="选中" name="success" :color="activeColor" />
    </view>
  </scroll-view>
  <slot name="options-bottom" :tab-index="activeTab"></slot>
</view>

<!-- m-cascader-popup：m-popup(bottom, round) 包 m-cascader，全量条件转发 -->
<!-- m-cascader-input：m-input(readonly, is-link 视觉) + m-cascader-popup + 自绘清空 -->
```

### 状态与算法（面板核心）

```
props: value（叶子 value，Q1）、options、title、placeholder、activeColor、
       closeable、closeIcon、showHeader、fieldNames（Q4）、optionsHeight（Q6）

state:
  selectedValues: string[]     // 路径各级已选 value（不含叶子则为空尾）
  activeTab: number            // 当前展示层

computed:
  currentOptions = 按 selectedValues[0..activeTab-1] 逐层下钻 children
  tabs = [
    ...selectedValues 各级 { title: 对应 option.text },
    { title: placeholder }      // 未选层兜底 tab
  ]

onOptionClick(opt):
  if opt.disabled: return
  path = selectedValues.slice(0, activeTab) + [opt.value]
  selectedValues = path; activeTab = activeTab + 1（若展示新层）
  if opt.children 非空: emit change; 不 finish
  else: emit change + emit finish({ value: opt.value, selectedOptions: 全路径, tabIndex })
  // 注意：选已有后续路径的中间层时截断 selectedValues 尾部（重新选择上级）

watch(value)（v-model 外部回灌）:
  按 options 自顶向下匹配 value 所在路径，重建 selectedValues 与 activeTab
```

### 事件 payload

```
type CascaderChangeEvent = { value: string, selectedOptions: CascaderOption[], tabIndex: number }
```

## 疑问清单（请逐条回答）

### Q1 `value` 的类型？
背景：Vant 为 `string | number`。UTS 联合类型 prop 在 VDOM 产物有类型诊断前科（LESSONS #73），且联合值参与比较 / 匹配需处处分支。
候选：① 统一 `string`（数字 value 业务自行 `toString()`，文档标注，推荐——规避联合类型风险，与 m-calendar `value: string` 先例一致）；② `string | number` 完全对齐 Vant。
影响：CascaderOption.value 类型、比较逻辑、文档示例。
回答：②。

### Q2 手势滑动（swipeable）是否实现？
背景：Vant 层级切换带左右滑动动画（基于 tabs swiper）。uvue 的 swiper 与自定义 tab 头联动有坑，且滑动动画非级联核心体验。
候选：① 不实现，层级切换瞬时替换，`swipeable` prop 不提供（推荐——简单可靠，文档标注差异）；② 用 swiper 实现手势滑动并保留 `swipeable` prop。
影响：模板结构、复杂度、与 Vant 的交互差异。
回答：②。

### Q3 异步动态加载（change 后填充 children）怎么支持？
背景：Vant 典型场景是点省后异步拉市列表。机制上只需业务在 change 回调改 reactive options 即可，组件零成本支持；差异在是否内置 loading 提示。
候选：① 支持，不内置 loading——children 为空数组视为叶子直接 finish，业务需要加载态自行用 m-toast（推荐——组件保持纯，与 Vant「业务自行 showLoadingToast」的实际用法一致）；② 同 ① 但 children 为空数组视为「未加载完」不触发 finish（行为更贴心但与 Vant 语义不同，且永远无法选空层级）。
影响：finish 触发条件、文档「异步加载」示例写法。
回答：①。

### Q4 `field-names` 自定义字段名是否支持？
背景：Vant 支持 `{ text, value, children }` 字段映射。UTS 中实现为 CascaderFieldNames type + 下钻工具函数按映射取值，成本可控。
候选：① 支持（完全对齐 Vant，推荐）；② 不支持，固定 text / value / children（文档标注）。
影响：下钻与取值工具函数、CascaderOption 是否放宽。
回答：①。

### Q5 插槽范围？
候选：① 全套四插槽：title / option / options-top / options-bottom（对齐 Vant，推荐）；② 常用子集：title + option（options-top/bottom 使用频率低）。
影响：模板条件转发数量、文档 Slots 表。
回答：①。

### Q6 选项区高度可配？
背景：Vant 默认 384px（CSS 变量 `--van-cascader-options-height`）。
候选：① props `options-height`（px，默认 384）+ 主题变量 `$m-cascader-options-height` 兜底（推荐——props 覆盖变量，与其它组件规格一致）；② 仅主题变量 `$m-cascader-options-height`，不加 props。
影响：props 清单、vars.scss、文档。
回答：①。

### Q7 验收范围？
候选：① 仅 Web 浏览器实测，App / 小程序登记真机 TODO（与前几次一致，推荐）；② 需真机验收。
回答：①。

## 实施记录

2026-11-04 完成，Web 端验证通过（core-protocol DoD 达成）。

### 实际落码

| 产物 | 路径 | 说明 |
| --- | --- | --- |
| 共享类型与工具 | `packages/core/components/m-cascader/cascader.uts` | `CascaderValue = string \| number`、`CascaderFieldNames`、`CascaderChangeEvent`；`findCascaderPath`（DFS + unshift 重建路径）、typed getter 取值系列工具 |
| 面板组件 | `packages/core/components/m-cascader/m-cascader.uvue` | 头部（title 插槽 + closeable）+ tabs（scroll-view scroll-x + scroll-into-view 锚点）+ swiper 层级选项列表（`:disable-touch="!swipeable"`）；状态 `selectedNodes`（路径含叶子）+ `activeTab`；emits：`update:value` / change / finish / close / `click-tab` |
| 弹出框 | `packages/core/components/m-cascader-popup/m-cascader-popup.uvue` | m-popup（position 默认 bottom、round 默认 true）组合；finish 自动 `update:show` 关闭；头部关闭图标仅发 `update:show`（close 事件由 m-popup 统一派发防双发）；四插槽条件转发 |
| 输入框 | `packages/core/components/m-cascader-input/m-cascader-input.uvue` | m-input 只读触发器 + 弹层（`:z-index="3"`）+ 透明触发层（z-index 1）+ 自绘清空（z-index 2）；displayText 用 findCascaderPath 路径文字 `/` 连接，未找到回退 value 字符串 |
| 主题变量 | `packages/core/theme/vars.scss` | `$m-cascader-*` 段（header 48px / tabs 48px / options 384px / option 40px 等）+ `$m-cascader-input-*` 段（trigger / clear 层级与尺寸），全部 `!default` |
| 演示页 | `packages/playground/pages-sub/cascader/cascader.uvue` + pages.json + router.config.uts + demo-components.uts | 9 区块穷举：基础 / 数字 value / 自定义主题色+高度 / 关闭手势 / 弹出框 / 输入框三形态 / 异步加载 / field-names / 插槽四件套 |
| 文档 | docs zh / en 各 3 篇 + 侧栏（zh.ts / en.ts 表单区字母序）+ changelog 三处（docs zh / en、插件 KEEP 文件） | frontmatter `added: 0.3.0` |

### 与伪代码设计的偏差（自定默认决策）

1. **状态从 `selectedValues` 改为 `selectedNodes`**（存节点对象而非 value 数组）：payload `selectedOptions` 需要完整节点，避免二次查找。
2. **options 为动态类型 `UTSJSONObject[]` 而非递归 type**：UTS 递归 type 引用未验证，风险规避；取值全走 typed getter（`getString` / `getNumber` / `getArray` 等），`field-names` 照常支持。技术约束第 1 条的回退方案直接成为主方案。
3. **`options-height` prop 默认 0 而非字面 384**：0 表示走主题变量 `$m-cascader-options-height: 384px`，prop > 0 时 inline 覆盖——保持「默认值全部走主题变量」的覆盖契约一致性。
4. **finish 自动关闭弹层**：m-cascader-popup 在 finish 后主动 `update:show` 关闭（Vant Popup 组合的惯例行为，演示页与文档已标注）。
5. **层级列表用 swiper 承载**（Q2=②）：每层一个 pane，`swipeable` 由 `:disable-touch` 反向承载；swiper `@change` 同步 activeTab（不回发 click-tab）。
6. **演示页路由补挂两条命名路由**（验收后修复）：首页 demo-components 登记的 `cascader-popup` / `cascader-input` 条目按名导航（`router.push({ name })`，ux-router strict 模式未注册即抛 RouterError），而演示页为一页穷举形态 → router.config.uts 补两条命名路由指向同一 path（meta.title 各自正确）。代价是路由初始化时 2 条「重复路由路径」warn（pathMap 后者覆盖前者，仅影响直连 path 时的 document.title 取值，按名导航全部正常），浏览器实测三条目均正常跳转。

### 踩坑记录

- **`getString` Web 端可空签名**：Web 编译产物中 `UTSJSONObject.getString` 返回 `string | null`（与本机 Kotlin d.ts 非空签名不同），首次编译产生一批 TS 诊断 warning；全部调用点统一 null 判断兜底后清零。
- **解析单对象 JSON**：`JSON.parse<UTSJSONObject[]>` 解析 `{...}` 会得到 null，演示页异步数据源改用 `parseObject`（UTSJSONObject 泛型）。
- **HBuilderX CLI 路径**：正确路径为 `/Applications/HBuilderX.app/Contents/MacOS/cli`（非 `Contents/HBuilderX/cli`，exit 127 教训）。
- **浏览器自动化测试**：uni-app x Web 自定义元素在快照中不暴露 interactive ref，`browser_click` 对视口外元素失败；有效方案为对视口内元素用 ref 点击，其余用 `browser_evaluate` 派发合成 MouseEvent 序列（mousedown/mouseup/click，`bubbles: true`）——组件 @click 正常响应。

### 验证结论

- `pnpm sync:uni-modules:check` 通过；`pnpm build:docs` 通过（无死链）。
- HBuilderX `cli launch web` 编译无 error（残留 3 条 SSRSlot WARNING 为插槽条件转发编译噪音，与既有组件一致）。
- 浏览器实测（端口 5174）：基础面板三级选择 + finish + v-model 回写 + 外部赋值回灌 + 清空；弹层 open → 三级选择 → finish 自动关闭；遮罩点击关闭；输入框路径回显与清空；异步加载（600ms 填充后可选）；field-names；四插槽渲染与 disabled / color 选项；禁用选项点击无层级变化；控制台无 error / warning。
- App / 小程序真机验收 TODO（Q7=①）：插槽作用域对象、swiper 手势、getString 行为待真机回归。
