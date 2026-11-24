# m-accordion 手风琴（折叠面板）实施方案

## 需求

用户提供参考链接 `https://sard.wzt.zone/components/accordion`，目标为在 unix-ui 新增「手风琴 / 折叠面板」组件：

- 通过折叠收纳内容，允许同时展开一个或多个面板；
- 面板由「容器 + 面板项」两组件配合（参考 Sard：`s-accordion` + `s-accordion-item`）；
- 支持单选展开 / 多选展开、单项禁用、隐藏边框、标题 / 扩展内容 / 箭头插槽。

> 流程约束：本文档为第一步产出，**疑问清单未全部作答前不写代码**。

## 需求分析

### 参考实现（Sard Accordion）

| 归属 | API |
| --- | --- |
| AccordionProps | `model-value`（string \| number \| 数组）、`multiple`、`hide-border` |
| AccordionEmits | `update:modelValue` |
| AccordionItemProps | `title`、`extra`、`name`、`disabled` |
| AccordionItemSlots | `default`、`title`、`extra`、`arrow`（作用域参数 `{ visible }`） |
| AccordionItemEmits | `click` |
| 主题变量 | 背景 / 激活背景 / 边框色 / 头部与内容内边距 / 标题字号 |

Vant Collapse 对照要点：v-model 恒为数组、`accordion` 单开模式、`border` / `inset` 卡片形态、内容 `lazy-render`。本项目取两者交集，避免过度设计。

### 影响面与落点

| 类型 | 落点 |
| --- | --- |
| 组件源 | `packages/core/components/m-accordion/m-accordion.uvue`、`.../m-accordion-item/m-accordion-item.uvue` |
| 共享上下文 | `packages/core/components/m-accordion/accordion.uts`（provide / inject 上下文类与类型，跨两个组件共享） |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-accordion-*` 段（全 `!default`） |
| 同步 | `pnpm sync:uni-modules` |
| 演示页 | `packages/playground/pages-sub/display/accordion/accordion.uvue`（一页穷举全部变体） |
| 首页登记 | `pages/index/demo-components.uts` 的「数据展示」组，按字母序插入到 `badge` 之前 |
| 文档 | `packages/docs/src/components/accordion.md` + `src/en/components/accordion.md`；侧栏 `zh.ts` / `en.ts`「数据展示」组同位置插入 |
| changelog | `packages/playground/uni_modules/m-ui-x/changelog.md` |

### 分类判定

手风琴是「折叠收纳内容」的展示型容器，不产出表单值、不接结构化数据源、无日期值域，归 **数据展示** 组（与 Sard「数据展示」、Vant「展示组件」一致）。

## 伪代码设计

### 1. 共享上下文 `accordion.uts`

```uts
/** provide / inject 配对 key */
export const ACCORDION_KEY: string = '__mxi_accordion__'

/** 单个面板标识（string / number，对齐 checkbox 的宽松标识语义） */
export type AccordionValue = string | number
/** 展开项标识集合（v-model:value 的值形态） */
export type AccordionValueArray = Array<string | number>

/** 子项注册信息（容器按注册序渲染快照 / 判定末线用） */
export type AccordionItemInfo = {
  name: AccordionValue
  key: number
}

export class AccordionContext {
  /** v-model:value 展开集合（容器持有，子项只读判定 + 点击经 toggle 回写） */
  value: Ref<AccordionValueArray>
  multiple: Ref<boolean>
  disabled: Ref<boolean>
  hideBorder: Ref<boolean>
  duration: Ref<number>
  lazyRender: Ref<boolean>
  /** 注册子项（setup 同步 register，onUnmounted unregister） */
  items: AccordionItemInfo[]
  /** 已渲染过的面板 key 集合（lazy-render 在首次展开后永久保留渲染） */
  everKeys: Ref<number[]>

  isExpanded(name): boolean          // 分类型全等匹配（'1' 与 1 不互等，同 m-tabs）
  register(name, key): void
  unregister(key): void
  toggle(name): void                 // multiple=false 时以「只保留本项」写回，点击已展开项则收起
  setExpanded(name, expanded): void  // 供实例方法 open/close 复用
}
```

### 2. `m-accordion` 容器

Props（草案，最终以疑问清单结论为准）：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| value | `AccordionValueArray` | `[]` | 展开面板 name 集合（v-model:value） |
| multiple | boolean | false | 是否可同时展开多个 |
| disabled | boolean | false | 是否禁用全部面板 |
| hideBorder | boolean | false | 是否隐藏分隔线 |
| duration | number | 0.3 | 展开 / 收起动画时长（秒，0 直接显隐） |
| lazyRender | boolean | true | 是否首次展开才渲染内容 |
| customClass / customStyle | string | '' | 根节点定制 |

Events：`update:value(value: AccordionValueArray)`、`change(value: AccordionValueArray, name: AccordionValue)`。

Slots：`default`。

模板：

```html
<view :class="rootClass" :style="customStyle"><slot></slot></view>
```

逻辑要点：

1. `provide(ACCORDION_KEY, ctx)`；props → ctx 全部 `watch(..., { immediate: true })` 下发（对齐 m-checkbox-group）。
2. `watch(ctx.value)` → `emit('update:value')` + `emit('change')`（交互与外部回灌统一出口）。
3. `defineExpose({ open(name), close(name), toggle(name), closeAll() })`（对齐 m-checkbox-group 的 toggleAll 暴露风格）。

### 3. `m-accordion-item` 面板

Props：

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| title | string | '' | 面板标题 |
| extra | string | '' | 标题右侧文本 |
| name | `string \| number` | 注册序 | 面板唯一标识 |
| disabled | boolean | false | 禁用本面板（容器 disabled 优先） |
| customClass / customStyle | string | '' | 根节点定制 |

Events：`click(event: MouseEvent)`（头部点击恒派发，含禁用态）。

Slots：`default`（内容）、`title`、`extra`、`arrow`（作用域参数 `visible: boolean`）。

模板：

```html
<view :class="itemClass">
  <view :class="headerClass" :hover-class="hoverClass" @click="onHeaderClick">
    <view class="m-accordion-item__title">
      <slot name="title"><text v-if="title != ''" class="m-accordion-item__title-text">{{ title }}</text></slot>
    </view>
    <view v-if="hasExtra" class="m-accordion-item__extra">
      <slot name="extra"><text v-if="extra != ''" class="m-accordion-item__extra-text">{{ extra }}</text></slot>
    </view>
    <view :class="arrowClass">
      <slot name="arrow" :visible="expanded">
        <m-icon name="arrow" size="16" custom-class="m-accordion-item__arrow-text" />
      </slot>
    </view>
  </view>
  <view v-if="rendered" ref="bodyRef" class="m-accordion-item__body">
    <slot></slot>
  </view>
  <view v-if="showLine" class="m-accordion-item__line"></view>
</view>
```

逻辑要点：

1. `inject` 上下文（null 兜底：脱离容器时自身不可展开也不报错）。
2. `name` 为空时用注册序（`ctx.items.length` 生成 key，同时作为标识）。
3. `expanded = ctx.isExpanded(name)`；`rendered = !lazyRender || everKeys 含本 key`。
4. 头部点击：`emit('click')` → 禁用则 return → `ctx.toggle(name)`。
5. 箭头：容器旋转（`arrow` 图标默认右向，展开态 rotate 90deg），动画走 `UniElement.animate`（可选）。
6. 分隔线：`hideBorder` 为 true 时不渲染；默认每项底部一条 0.5px 线（绝对定位 + `scaleY(0.5)`，对齐 m-cell）。

### 4. 展开 / 收起动画（待 Q3 确认）

- 展开：`rendered = true` → `nextTick` → 实测内容高度（Web `getBoundingClientRect`，非 Web `getBoundingClientRectAsync`）→ `animate` 高度 `0 → h` → 动画结束清空内联高度。
- 收起：实测当前高度 → `animate` `h → 0` → 结束后 `rendered = false`。
- `duration <= 0`、测量失败、小程序端 → 直接显隐（降级路径）。
- 不使用 `max-height` 猜测法（ucss 无过渡属性，且内容高度不可知会产生卡顿）。

### 5. 主题变量（`vars.scss` 新增段）

```scss
/* ========== Accordion 手风琴 ========== */
$m-accordion-background: $m-white !default;
$m-accordion-header-active-color: #f2f3f5 !default;   /* 头部按压态 */
$m-accordion-border-color: #ebedf0 !default;
$m-accordion-header-padding-x: 16px !default;
$m-accordion-header-padding-y: 10px !default;
$m-accordion-title-font-size: 14px !default;
$m-accordion-title-color: $m-text-color !default;
$m-accordion-extra-font-size: 12px !default;
$m-accordion-extra-color: #969799 !default;
$m-accordion-arrow-color: #c8c9cc !default;
$m-accordion-arrow-size: 16px !default;
$m-accordion-body-padding-x: 16px !default;
$m-accordion-body-padding-y: 16px !default;
$m-accordion-body-font-size: 14px !default;
$m-accordion-body-color: #646566 !default;
$m-accordion-duration: 0.3 !default;
```

### 6. 演示页变体清单

基础单选、展开多个、单项禁用、全局禁用、隐藏边框、三插槽（title / extra / arrow 作用域参数）、默认展开、实例方法（open / close / toggle / closeAll）按钮组、自定义主题色（根节点 customStyle）。

## 疑问清单

### Q1 `v-model` 值形态：单选模式下绑定单值还是数组？（影响：容器 Props / Emits / 演示页 / 文档）
- 方案 A（推荐）：**统一数组** `value: Array<string | number>`，`multiple=false` 时容器内部保证最多一项（Vant 语义，UTS 类型最简单，无需联合类型分支）。
- 方案 B：单选绑定 `string | number | null`，多选另起 `values` 数组 prop（UTS 类型明确但 API 分裂）。
- 方案 C：仿 Sard 联合类型 `string | number | 数组`（单 prop 多形态，UTS 编译期推断风险最高）。

回答：A。

### Q2 组件命名（影响：目录名 / 标签名 / 文档 / 主题变量前缀）
- 方案 A（推荐）：`m-accordion` + `m-accordion-item`（与参考站一致）。
- 方案 B：`m-collapse` + `m-collapse-item`（Vant 生态更常见，但与参考链接命名不一致）。

回答：A。

### Q3 是否实现展开 / 收起的高度过渡动画？（影响：面板实现复杂度 / 跨端稳定性）
- 方案 A（推荐）：实现，`duration` 默认 0.3 秒；测量失败或 `duration=0` 时降级为直接显隐。
- 方案 B：本期不做动画，仅直接显隐（实现最简，体验略生硬）。

回答：A。

### Q4 边框形态（影响：容器 Props 与样式）
- 方案 A（推荐）：仅提供 `hide-border`（全组无分隔线），保持参考站能力。
- 方案 B：额外提供 `inset` 圆角卡片形态（Vant 风格，新增根节点圆角 / 内外边距变量）。

回答：B。

### Q5 `name` 缺省策略（影响：面板 Props 类型 / 展开判定）
- 方案 A（推荐）：`name` 可选，缺省用「注册序」作为标识（演示页可省略 name）。
- 方案 B：`name` 必填，缺失时面板不可展开并告警（语义最严格）。

回答：A。

### Q6 箭头插槽作用域参数（影响：插槽 API 与跨端兼容）
- 方案 A（推荐）：保留 `arrow` 作用域插槽并传 `{ visible }`（项目已有作用域插槽先例：m-date-range-picker-popup）。
- 方案 B：`arrow` 为普通插槽（无参数），组件不再自动旋转，用户自行按需渲染（兼容最稳）。

回答：A。

### Q7 是否允许非受控使用（不传 v-model）（影响：容器状态模型）
- 方案 A（推荐）：受控 + 非受控双支持（未传 `value` 时容器内部自持状态，传入后以外部为准）。
- 方案 B：仅受控（必须传 v-model，简单但上手成本高）。

回答：A。

### Q8 全局禁用与单项禁用优先级（影响：面板 Props）
- 方案 A（推荐）：容器 `disabled` 为 true 时全组禁用，面板 `disabled` 单独禁用本项（两者取或）。
- 方案 B：不提供容器级 disabled，仅面板级（对齐参考站）。

回答：A。

### Q9 分类与文档归属（影响：demo-components.uts / 侧栏顺序）
- 方案 A（推荐）：归「数据展示」组，字母序插入 `accordion` → `badge` → `cell`，中文名「手风琴」，英文名「Accordion」。
- 方案 B：归「布局组件」组。

回答：A。

## 实施记录

（2026-11-24 完成，按 Q1-A / Q2-A / Q3-A / Q4-B / Q5-A / Q6-A / Q7-A / Q8-A / Q9-A 执行）

### 落点清单

| 类型 | 文件 |
| --- | --- |
| 共享上下文 | `packages/core/components/m-accordion/accordion.uts`（`ACCORDION_KEY`、`AccordionValue` / `AccordionValueArray`、`emptyAccordionValues`、`AccordionContext`） |
| 容器 | `packages/core/components/m-accordion/m-accordion.uvue` |
| 面板 | `packages/core/components/m-accordion-item/m-accordion-item.uvue` |
| 主题变量 | `packages/core/theme/vars.scss` 新增 17 项 `$m-accordion-*` |
| 演示页 | `packages/playground/pages-sub/display/accordion/accordion.uvue`（10 组变体） |
| 首页登记 | `pages/index/demo-components.uts` 数据展示组首位 |
| 文档 | `packages/docs/src/components/accordion.md` + `src/en/components/accordion.md`，zh/en 侧栏同位置 |
| changelog | `playground/uni_modules/m-ui-x/changelog.md` 并入未发布的 0.8.0 段 |

### 与方案的关键实现差异 / 细节

1. **变更派发不监听数组**：上下文新增 `changeEpoch`（仅用户交互递增）与 `lastName`，容器 `watch(changeEpoch)` 统一 emit `update:value` / `change`；prop 回灌仅写 `ctx.value`，不会触发二次派发，规避「同步写值 + 异步 watch 守卫失效」问题。
2. **受控 / 非受控**：`value` 默认 `null`，容器 `watch(() => props.value, immediate)` 仅在非 null 时下发；单选模式归一为「最后一项」（最近一次展开语义），`multiple` 由 true 切 false 时同步收敛。
3. **动画**：`rendered` 永不复位，收起后以 `height: 0 + overflow: hidden` 裁剪；展开先 `height: auto` 完成布局再测量，`UniElement.animate` 走 0→h / h→0，结束后清空（展开）或保持 0（收起）；`duration<=0`、元素缺失、测量高度 0、小程序端均降级直接显隐；`animToken` 令牌避免连续切换的旧定时器改写样式。
4. **name 缺省**：注册时 `null` 以注册 key 兜底，key 同时用于注销与末线判定；面板独立使用（无容器）时自持展开态，不报错。
5. **禁用**：面板 `disabled` 与容器 `disabled` 取或；头部 `click` 恒派发，禁用时仅不切换（演示页已挂日志验证）。
6. **箭头**：颜色 / 字号设在容器并经继承穿透 `m-icon`（规避小程序样式隔离），展开态仅内置图标子层 `rotate(90deg)`（`arrow` 插槽内容不再被强制旋转，方向由用户按 `visible` 自行渲染）；`arrow` 作用域插槽传 `visible`。
7. **分隔线**：0.5px 走绝对定位 + `scaleY(0.5)` + `transform-origin: 0 100%`；`hide-border` 全关，组内末项自动隐藏。

### 验证

- `pnpm sync:uni-modules` / `pnpm sync:uni-modules:check` 通过。
- `pnpm build:docs` 通过（中英文页与侧栏无死链）。
- HBuilderX `cli launch web --project packages/playground` 编译成功，端口 5174 无冲突；routeGen 生成 accordion 路由（pages.json / routes.gen.uts 均含）。
- 浏览器实测（`/unix-ui/playground/pages-sub/display/accordion/accordion`）：
  - 基础单选展开、展开多个（a/b 同时可见）、默认展开、单项 / 全局禁用、非受控、懒渲染关闭均正常；
  - 实例方法 `open('1')` / `closeAll()` 正常，展开集合与状态文案同步；
  - `arrow` 作用域插槽 `visible` 切换（+ → −）正常；`inset` 圆角卡片留白与圆角正常；
  - 控制台无 error，无报错遮罩。
- 未做：App / 小程序真机动画与触摸回归（Web 已通过，动画在 MP 端按设计降级为直接显隐）；内置上传类服务端联调不涉及本组件。
