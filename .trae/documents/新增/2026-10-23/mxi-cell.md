# 新增组件：mxi-cell 单元格 + mxi-cell-group 单元格组

> 状态：**已完成**（2026-10-23 疑问闭环 Q1=A / Q2=A / Q3=B / Q4=D，实现并验证通过）
> 本轮范围调整：packages/docs 双语文档与侧栏 **暂缓**（用户要求「后续等我通知再同步」），其余按六步流程执行（组件源 → 主题变量 → sync → 演示页 → 验证）。

## 需求

- 用户原话：「现在，可以 `https://vant-ui.github.io/vant/#/zh-CN/cell` 实现这个组件了，docs项目中的信息后续等我通知在同步」。
- 新增 `mxi-cell` 单元格组件，对标 Vant Cell 的 props / slots / 交互语义；功能与体验对齐优先。
- 验收工程（playground）同步落演示页，并按既有登记链路接入首页分组导航。

## 需求分析

### Vant Cell API 盘点（官网 README 已核对）

**Cell Props**：`title` / `value` / `label` / `size(normal|large)` / `icon` / `icon-prefix` / `tag` / `url` / `to` / `replace` / `border` / `center` / `clickable` / `is-link` / `required` / `arrow-direction(left|up|down|right)` / `title-style` / `title-class` / `value-class` / `label-class`
**Cell Events**：`click`
**Cell Slots**：`title` / `value` / `label` / `icon` / `right-icon` / `extra`
**CellGroup Props**：`title` / `inset` / `border`；**Slots**：`default` / `title`

### uni-app x 场景映射（逐条判定）

| Vant 能力 | 映射方案 | 判定 |
| --- | --- | --- |
| title / value / label | 三段 text：标题左、value 右灰字、label 标题下方小灰字 | 实现 |
| size=large | padding 与字号规格切换（title 16px / label 14px / 上下 12px） | 实现 |
| icon | 内部渲染 mxi-icon（core 首个组件间依赖，easycom 自动解析，uni-ui 同款做法）；prop 类型复用 `IconName` 联合类型，相对路径 `import type { IconName } from '../mxi-icon/icons.uts'`（架构规则允许的跨组件共享例外） | 实现 |
| is-link + arrow-direction | mxi-icon `arrow` + 外层 wrapper view `transform: rotate()`（right 0° / up -90° / down 90° / left 180°） | 实现 |
| border 分隔线 | hairline 规范：绝对定位 view + `scale(0.5)` + `transform-origin: 0 0`；线左端从内容区（16px）起笔，对齐 Vant | 实现（成熟模式） |
| center | 内容容器 align-items 切换 | 实现 |
| clickable 点击态 | view `hover-class` 挂按压态类（mxi-button 同款机制，无需 touch 事件）；is-link 时默认可点 | 实现 |
| required | title 前红色星号 | 实现 |
| url / to / replace | 路由跳转 | 裁剪 → Q2 |
| tag 自定义元素标签 | uvue 无跨标签渲染概念 | 不做 |
| icon-prefix | mxi-icon 已有 customClass 出口覆盖此场景 | 不做 |
| title-style / title-class / value-class / label-class | 动态样式定制 | 裁剪 → Q3 |
| extra 插槽 | 右侧扩展位 | → Q3 |
| 五个具名插槽 | uvue 支持 slot | title / value / label / icon / right-icon 实现 |

### 组件间依赖说明（首个）

- core 内现有 4 组件零相互依赖；mxi-cell 将首次在组件模板内使用 `<mxi-icon>`（icon prop 与右侧箭头）。
- 依据：easycom 对 uni_modules 内组件同样生效（uni-ui 官方组件库内部互引同机制）；两组件同随 `mxi-ui-x` 插件分发，无外部依赖引入。
- icons.uts 的 `IconName` 为跨组件共享类型，按架构规则以相对路径导入，符合「跨组件共享拆 .uts」例外条款。

### 布局与关键结构（伪代码）

```
mxi-cell 模板（flex 行布局，min-height 48px 起）：
<view class="mxi-cell" :class="cellClass" :hover-class="clickable ? 'mxi-cell--active' : ''" @click="onClick">
  <view class="mxi-cell__icon" v-if="icon != '' || icon 插槽">        ← 左图标区（右距 8px）
    <slot name="icon"><mxi-icon v-if="icon != ''" :name="icon" size="17"/></slot>
  </view>
  <view class="mxi-cell__title-wrap">                                  ← title+label 区
    <view class="mxi-cell__title">
      <text v-if="required" class="mxi-cell__required">*</text>
      <slot name="title"><text v-if="title != ''" class="mxi-cell__title-text">{{ title }}</text></slot>
    </view>
    <slot name="label"><text v-if="label != ''" class="mxi-cell__label">{{ label }}</text></slot>
  </view>
  <slot name="value"><text v-if="value != ''" class="mxi-cell__value">{{ value }}</text></slot>
  <slot name="right-icon">
    <view v-if="isLink" class="mxi-cell__arrow" :style="rotateStyle">
      <mxi-icon name="arrow" size="16" color="$mxi-cell-right-icon-color 对应值"/>
    </view>
  </slot>
  <view v-if="border" class="mxi-cell__hairline"/>                     ← hairline 缩放层
</view>

mxi-cell-group 模板（若 Q1=A）：
<view class="mxi-cell-group" :class="inset ? 'mxi-cell-group--inset' : ''">
  <view class="mxi-cell-group__title" v-if="title != '' || title 插槽">
    <slot name="title"><text>{{ title }}</text></slot>
  </view>
  <view class="mxi-cell-group__body"> <slot/> </view>   ← inset 时圆角 + 外边距，border 时外框 hairline
</view>
```

布局对齐 Vant：title 区与 value 区均 `flex: 1`，value 右对齐；label 在 title 下方（垂直排列），center 时整行垂直居中。

### 主题变量草案（vars.scss 新增段，全部 !default）

```
/* ========== Cell 单元格 ========== */
$mxi-cell-font-size: 14px !default;
$mxi-cell-line-height: 24px !default;
$mxi-cell-vertical-padding: 10px !default;
$mxi-cell-horizontal-padding: 16px !default;
$mxi-cell-text-color: $mxi-text-color !default;
$mxi-cell-background: $mxi-white !default;
$mxi-cell-border-color: #ebedf0 !default;        /* 复用 $mxi-color-default-border 同值 */
$mxi-cell-active-color: #f2f3f5 !default;
$mxi-cell-required-color: $mxi-color-danger !default;
$mxi-cell-label-color: #969799 !default;
$mxi-cell-label-font-size: 12px !default;
$mxi-cell-label-margin-top: 4px !default;
$mxi-cell-value-color: #969799 !default;
$mxi-cell-icon-size: 17px !default;
$mxi-cell-right-icon-color: #c8c9cc !default;
$mxi-cell-large-vertical-padding: 12px !default;
$mxi-cell-large-title-font-size: 16px !default;
$mxi-cell-large-label-font-size: 14px !default;
/* ========== CellGroup 单元格组 ========== */
$mxi-cell-group-background: $mxi-white !default;
$mxi-cell-group-title-color: #969799 !default;
$mxi-cell-group-title-padding: 16px 16px 8px !default;
$mxi-cell-group-title-font-size: 14px !default;
$mxi-cell-group-inset-radius: $mxi-radius-md !default;
$mxi-cell-group-inset-padding: 0 16px !default;
```

### 演示页（pages-sub/cell/）

- 对齐 Vant demo 八区块：基础用法 / 圆角卡片（inset）/ 大尺寸 / 左侧图标 / 链接箭头（含 arrow-direction 四向）/ 分组标题 / 插槽自定义 / 垂直居中。
- 登记链路四处：`demo-components.uts`（基础组件组）+ `router.config.uts`（name: cell）+ `pages.json` + 演示页 demo-navbar props（单元格/Cell）。

## 疑问清单

### Q1 组件范围（影响：本轮交付物数量）

- 方案 A（推荐）：mxi-cell + mxi-cell-group 一并实现——cell 的分组形态、inset 圆角卡片、组标题均由 group 承载，Vant 两者也是同包发布；拆开后续还要再立一轮
- 方案 B：仅 mxi-cell，cell-group 后续单独立项

回答：A。

### Q2 路由跳转 props（url / to / replace）（影响：组件 API 与 core 依赖边界）

- 方案 A（推荐）：不实现——core 保持纯 UI，不依赖任何路由方案；跳转由使用者在 click 回调自调（router.push / uni.navigateTo）
- 方案 B：实现 url prop（内部封装 uni.navigateTo），to / replace 不做
- 方案 C：url + to 都实现（to 需依赖路由器实例，与 core「禁止依赖 playground 专属配置」冲突）

回答：A。

### Q3 API 裁剪（影响：props / slots 清单）

- 方案 A（推荐）：裁剪 tag / icon-prefix / title-style / title-class / value-class / label-class / extra；样式定制出口统一为 customClass + customStyle（对齐 mxi-icon）+ title / value / label / icon / right-icon 五个具名插槽
- 方案 B：尽量全保留——title-class 等四个以独立 customClass props 实现，extra 插槽一并补上

回答：B。

### Q4 组内分隔线收口（影响：border 交互细节）

背景：ucss 无伪元素与 `:last-child`，cell 无法自动感知「组内最后一个」，Vant 靠 CSS 自动隐藏末线，uvue 做不到。

- 方案 A（推荐）：cell 自身保留 border prop（默认 true，hairline 画在自身下边缘）；组内最后一个由使用者传 `:border="false"` 关闭，演示页示范 + 文档说明
- 方案 B：cell-group 内 provide/inject 注册序号自动感知末位（实现复杂度高，App 端时序风险）
- 方案 C：分隔线改画在 cell 上边缘、group 外框承担底线（首线仍需处理，问题只是转移）

回答：不能通过在 cell-group 内获取子组件数量来判断末位？

**技术辨析（2026-10-23，针对上述反问）**：

「cell-group 直接获取子组件数量」在 uni-app x 中做不到，原因：

1. uvue / UTS 无 `this.$children`（Vue 3 已移除，uni-app x 未提供等价 API），group 拿不到子组件实例列表；
2. 组件内调用 `useSlots().default()` 遍历 vnode 的方式在 uni-app x 不可靠——App 端组件编译为原生渲染，slot 被编译器展开，运行时无 vnode 树可遍历；
3. ucss 无 `:last-child` 伪类（仅 class 选择器）。

但可以通过 **provide/inject 注册机制间接实现自动末位感知**（即原方案 B 的具体化）：

- group 在 setup 中 provide 一个管理器（reactive id 数组 + 注册 / 注销方法）；
- 每个 cell onMounted 时 inject 并注册自身 id（父 setup 先于子 setup，provide 时序安全）；onUnmounted 注销；
- cell 的 `isLast` computed = 「已注册 && 自身 id 为数组末位」；未注册（独立使用、不在 group 内）时退回 border prop；
- 最终画线条件：`isShowLine = border && (!registered || !isLast)`——border prop 语义与 Vant 一致（默认 true 参与画线），组内末线自动隐藏，使用者零心智。

风险点（需验证链覆盖）：
- vapor 模式下 reactive 数组 push / splice 的响应式 + computed 重算是否可靠（Web 端可实测）；
- App 端 onMounted / onUnmounted 挂载注销时序（列入真机遗留验证）；
- v-if 动态增删 cell 时末线自动重算（依赖注销通知）。

### Q4 最终方案选择

- 方案 A：使用者手动 `:border="false"` 关闭末线（最简单，文档说明）
- 方案 D（推荐）：provide/inject 注册自动感知末位 + border prop 保留为手动开关兜底（体验对齐 Vant，复杂度中等；验证不过时降级 A）

回答：D。

## 实施记录

### 落码清单（2026-10-23）

| 文件 | 变更 |
| --- | --- |
| `core/components/mxi-cell/mxi-cell.uvue` | 新建：单元格组件——title/value/label 三段布局（title 区与 value 区均 flex:1）、size large、icon prop（复用 mxi-icon，`IconName \| null`）、四向箭头（mxi-icon arrow + 容器 rotate）、required 星号、center、hover-class 按压态（clickable 默认跟随 isLink）、titleStyle / titleClass / valueClass / labelClass（Q3=B 全保留）、extra 插槽、0.5px 分隔线 |
| `core/components/mxi-cell-group/mxi-cell-group.uvue` | 新建：单元格组——title 分组标题（title 插槽）、inset 圆角卡片（margin + radius + overflow hidden，无外框）、外框上下 0.5px 细线（border && !inset）、provide CellGroupContext |
| `core/components/mxi-cell-group/context.uts` | 新建（Q4=D）：组上下文——CellGroupContext class（reactive id 数组 + register / unregister / isLast）、CELL_GROUP_KEY 字符串 key、generateCellId 模块级自增 id |
| `core/theme/vars.scss` | 新增 Cell / CellGroup 两段变量（22 个，全部 !default，含 large 规格） |
| `playground/pages-sub/cell/cell.uvue` | 新建：演示页十区块（基础 / inset / 大尺寸 / 左侧图标 / 四向箭头 / 分组标题 / 插槽自定义 / 垂直居中 / 点击事件与按压反馈 / 末线自动隐藏动态增删） |
| `playground/pages.json` | 注册 `cell/cell` 页（标题「单元格 Cell」） |
| `playground/router/router.config.uts` | 新增 cell 路由（name: cell） |
| `playground/pages/index/demo-components.uts` | 基础组件组登记「单元格 / Cell」条目 |

### 关键实现决策

- **末线自动隐藏（Q4=D）**：cell 在 setup 中同步 inject + register（注册顺序即渲染顺序，首帧即为正确末位，规避 mounted 注册的首帧闪烁）；onUnmounted 注销；画线条件 `isShowLine = border && (!registered || !isLast)`。reactive 数组 + computed 依赖收集在 uni-app x 编译下工作正常（动态增删实测末线自动重算通过）。
- **图标颜色主题联动**：mxi-icon 的 color prop 为运行时字符串，无法接 SCSS 变量；改走 custom-class——cell 样式表定义 `.mxi-cell__icon-text` / `.mxi-cell__arrow-text` 色类，经 customClass 挂到 mxi-icon 根 text（文字样式合规落在 text 类上，颜色随 $mxi-cell-text-color / $mxi-cell-right-icon-color 覆盖生效）。
- **单线 hairline**：与 button 整圈 hairline（scale(0.5)）不同，分隔线用 `scaleY(0.5)` 单轴缩放（x 轴不缩放保持通宽）+ `transform-origin: 0 100%`（贴底） / `0 0`（贴顶）；线左端从 `$mxi-cell-horizontal-padding` 起笔（对齐 Vant）。
- **Q2=A 落地**：无 url / to / replace props，跳转由使用者在 click 回调自调；click 事件无条件透传（对齐 Vant）。
- **Q3=B 落地**：titleStyle / titleClass / valueClass / labelClass 以独立 props 实现（titleStyle 走 inline style，三个 class 拼接到对应 text 类）；extra 插槽位于 value 与右图标之间；tag / icon-prefix 裁剪（uvue 无跨标签概念、mxi-icon customClass 已覆盖同场景）。
- **组件间依赖**：mxi-cell 模板内渲染 mxi-icon（core 首个组件间依赖，easycom 解析正常）；`IconName` 类型经相对路径 `import { IconName } from '../mxi-icon/icons.uts'` 导入。
- **演示页**：cell-group 直接铺灰底页面（不包 card，对齐列表卡观感）；动态增删区块以 v-for + push / pop 验证组内末线随增删自动重算。

### 验证记录（DoD）

- [x] `pnpm sync:uni-modules:check` 通过
- [x] HBuilderX CLI `cli launch web` 编译成功（dev server 端口 5174，pages.json 变更已重启编译）
- [x] 浏览器实测（Chrome）十二项全 PASS：导航栏「单元格 Cell」、基础用法行结构 + 0.5px 分隔线 + 末行无线、inset 两侧留白圆角、大尺寸行高字号、左侧图标、四向箭头方向正确、分组标题、title 插槽（粗体标题 + 徽标）与 right-icon 插槽、垂直居中、动态添加后四行且新末行（单元格 4）无线 / 移除恢复三行末行无线、首页基础组件组出现「单元格 / Cell」条目且搜索「cell」可过滤；console 无 error、network 无失败
- [x] click 事件透传：真实点击「点击我」行 console 输出 `[cell demo] cell clicked`
- [x] `pnpm build:docs` 免跑：本轮 docs 零变更（双语文档按用户要求暂缓）
- [x] 无遗留调试代码

### 遗留

- App 端真机验证（全局既有遗留项，本轮新增关注点：cell 的 reactive 注册 / 注销时序、hover 按压态、clickable=false 反馈关停效果）。补充说明：uni-app x web 端合成事件（el.click() / dispatchEvent）不触发 uvue 组件事件（框架行为，与组件无关），自动化无法模拟真实点击验证 clickable=false 行，需真机确认。
- packages/docs 双语文档与侧栏：待用户通知后同步（本轮范围明确排除）。
- 新增组件登记链路已四处齐备（demo-components.uts / router.config.uts / pages.json / 演示页 demo-navbar props）。
