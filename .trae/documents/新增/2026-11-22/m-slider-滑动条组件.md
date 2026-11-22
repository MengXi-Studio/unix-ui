# m-slider 滑动条组件 实施方案（Vant + sard 合并版）

## 需求

用户原话：提供 `https://vant-ui.github.io/vant/#/zh-CN/slider` 与 `https://sard.wzt.zone/components/slider` 两个参考，新增滑动条组件。

目标：以 **Vant Slider 为主 API 基线**（符合本项目「对标 Vant 同名组件」约定），吸收 sard 的**值气泡 / 刻度**能力，新增 `m-slider`，并接入完整链路（组件 → 主题 → 同步 → 演示 → 双语文档 → 验证）。

## 需求分析

### 两套参考的差异

| 维度 | Vant Slider | sard Slider | 本方案取舍 |
| --- | --- | --- | --- |
| 单值 / 范围 | `v-model` + `range` | 同 | 一致 |
| 范围 | `min` / `max` / `step` | 同 | 一致 |
| 方向 | `vertical` / `reverse` | `vertical` | 采用 Vant（补 `reverse`） |
| 禁用 / 只读 | `disabled` / `readonly` | 同 | 一致 |
| 颜色 | `active-color` / `inactive-color` | `color` / `track-color` / `thumb-color` | 采用 Vant 命名；滑块色走主题变量，不另设 prop |
| 尺寸 | `bar-height` / `button-size`（number\|string） | `track-size` / `thumb-size`（string） | 采用 Vant 命名，类型收敛为 number（px） |
| 值气泡 | 无（Vant 4 已移除 tooltip） | `show-value` / `value-position` / `value-background` / `value-color` | 吸收 sard：`show-value` / `value-position` |
| 刻度 | 无 | `show-scale` / `scale-position` | 吸收 sard：`show-scale` / `scale-position` |
| 插槽 | `button`（单）/ `left-button` / `right-button`（范围） | `start-thumb` / `end-thumb` | 采用 Vant 三插槽 |
| 事件 | `update:model-value` / `change` / `drag-start` / `drag-end` | 同上 + `input` | 采用 Vant 四事件，不加 `input` 别名 |
| 表单校验 | 无 | `validate-event` | 首版不做（本项目暂无 form 容器） |

### 交互要点

- 点击轨道任意位置：单滑块直接跳到该位置；范围模式点击后靠近的一侧滑块跳动
- 拖动滑块：实时更新（`update:value`），松手且有变化时触发 `change`
- 值必须夹取在 `[min, max]` 并按 `step` 对齐；范围模式两个值不允许交叉（左 ≤ 右）
- `disabled` / `readonly`：不响应触摸，`disabled` 整体降透明度
- `reverse`：视觉方向反转（值增大向左/向下）
- `vertical`：轨道纵向，宽度撑满容器，高度由 `verticalHeight` 主题变量或外层高度决定

### 涉及文件与影响面

- 组件源：`packages/core/components/m-slider/m-slider.uvue`（新建）
- 主题变量：`packages/core/theme/vars.scss` 新增 `$m-slider-*` 段（全部 `!default`）
- 同步：`pnpm sync:uni-modules`
- 演示页：`packages/playground/pages-sub/form/slider/slider.uvue`（数据录入组）+ `pages/index/demo-components.uts` 登记（`signature` 之后）
- 文档：`packages/docs/src/components/slider.md` + `src/en/components/slider.md`，并更新 `zh.ts` / `en.ts` 侧栏
- 版本号与发版说明：本任务不改 `package.json`

### 平台可行性（复用仓库既有拖拽实现）

- 触摸：`@touchstart/@touchmove/@touchend` 在 Web / 小程序 / App 均可用（仓库已有 `m-color-picker`、`m-fab`、`m-tabs` 同款实现）
- 尺寸测量按端分流（同 `m-signature` / `m-rate`）：
  - Web：组件 ref `getBoundingClientRect()`
  - App：`getBoundingClientRectAsync()`
  - 小程序：`uni.createSelectorQuery().in(proxy).select('#id').boundingClientRect().exec(...)`
- 拖动期间阻止页面滚动：Web 用 `touch-action: none`；小程序在根节点用 `catchtouchmove` 等价能力（实施时按 `m-color-picker` 的既有做法处理）
- 样式：进度条宽度/滑块偏移全部走内联 style（数值运算），不生成动态类名

## API 设计

### Props

```uts
type SliderValue = number | number[]

type Props = {
	value?: SliderValue          // v-model:value；range 时必须是数组
	min?: number                 // 默认 0
	max?: number                 // 默认 100
	step?: number                // 默认 1
	range?: boolean              // 双滑块，默认 false
	disabled?: boolean           // 默认 false
	readonly?: boolean           // 默认 false
	vertical?: boolean           // 默认 false
	reverse?: boolean            // 默认 false
	barHeight?: number           // 轨道高度 px，0 用主题变量
	buttonSize?: number          // 滑块直径 px，0 用主题变量
	activeColor?: string         // 激活色，'' 用主题变量
	inactiveColor?: string       // 轨道色，'' 用主题变量
	showValue?: boolean          // 值气泡，默认 false
	valuePosition?: 'top' | 'bottom' | 'left' | 'right' // 默认按方向取 top / right
	showScale?: boolean          // 刻度，默认 false
	scalePosition?: 'top' | 'bottom' | 'left' | 'right' // 默认按方向取 bottom / left
	customClass?: string.ClassString
	customStyle?: string
}
```

> 所有 prop 类型均不含 `null`（避免 TS2769，见 LESSONS #115）；`barHeight` / `buttonSize` 传 0 表示用主题变量。

### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| update:value | `value: SliderValue` | 拖动 / 点击轨道实时更新（v-model） |
| change | `value: SliderValue` | 松手且值发生变化 |
| drag-start | `event: TouchEvent` | 开始拖动 |
| drag-end | `event: TouchEvent` | 结束拖动 |

### Slots

| 名称 | 作用域 | 说明 |
| --- | --- | --- |
| button | `{ value, dragging }` | 单滑块自定义按钮 |
| left-button | `{ value, dragging, dragIndex }` | 范围模式左侧按钮 |
| right-button | `{ value, dragging, dragIndex }` | 范围模式右侧按钮 |

### 模板结构

```
view.m-slider（根，横向 / 纵向由 class 区分）
├─ view.m-slider__track（绝对定位，含上下/左右留白，保证滑块不出界）
│  ├─ view.m-slider__bar（未激活轨道）
│  ├─ view.m-slider__fill（激活段，inline 宽度/位移）
│  ├─ view.m-slider__scale（可选：刻度点 + 文字，inline 位置）
│  └─ view.m-slider__button ×1 或 ×2（inline left/top，内部 slot 或默认圆点）
└─ view.m-slider__value（可选：值气泡，inline 对准按钮）
```

## 主题变量（新增，全部 `!default`）

```scss
$m-slider-bar-height: 2px;
$m-slider-button-size: 24px;
$m-slider-active-color: $m-color-primary;
$m-slider-inactive-color: $m-fill-color-secondary;
$m-slider-button-background: $m-white;
$m-slider-button-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
$m-slider-disabled-opacity: $m-disabled-opacity;
$m-slider-vertical-height: 150px;
$m-slider-value-font-size: $m-font-size-sm;
$m-slider-value-color: $m-white;
$m-slider-value-background: $m-gray-800;
$m-slider-value-padding: 4px;
$m-slider-scale-size: 2px;
$m-slider-scale-color: $m-text-color-tertiary;
$m-slider-scale-font-size: $m-font-size-sm;
```

（变量名与取值实施时对齐 `vars.scss` 既有 `$m-color-*` / `$m-fill-*` / `$m-font-size-*`）

## 疑问清单

### Q1 颜色 / 尺寸命名采用哪套

建议以 Vant 为准：`activeColor` / `inactiveColor` / `barHeight` / `buttonSize`；sard 的 `color` / `trackColor` / `trackSize` / `thumbSize` 不设别名；滑块颜色直接用主题变量。

回答：

### Q2 是否实现 sard 的值气泡与刻度

建议实现 `showValue` + `valuePosition`、`showScale` + `scalePosition`（这是 sard 相对 Vant 的主要增量，且纯展示、无平台风险）；`valueBackground` / `valueColor` 用主题变量代替，不设 prop。

回答：

### Q3 插槽命名

建议 Vant 三插槽：`button`（单滑块）、`left-button` / `right-button`（范围）；不采用 sard 的 `start-thumb` / `end-thumb`。

回答：

### Q4 尺寸类型

建议 `barHeight` / `buttonSize` 只接受 `number`（px），不兼容 `'4px'` 字符串，降低跨端解析成本；主题变量仍可写任意 CSS 长度。

回答：

### Q5 平台范围与验证深度

建议全平台实现，Web 做完整交互验证（拖动、点击轨道、范围、垂直、禁用、插槽、刻度），微信小程序做渲染与拖动验证，App 编译通过。

回答：

### Q6 分组与命名

建议归入「数据录入」组（`pages-sub/form/slider/`），组件名 `m-slider`，演示与侧栏按字母序插入（`signature` 之后）。

回答：

## 实施记录

### 决策（用户「都按建议」）

- 命名以 Vant 为准：`activeColor` / `inactiveColor` / `barHeight` / `buttonSize`，不设 sard 别名
- 实现 sard 的 `showValue` / `valuePosition` / `showScale` / `scalePosition`
- 插槽采用 Vant 三插槽：`button` / `left-button` / `right-button`
- `barHeight` / `buttonSize` 仅接受 `number`（px，0 用主题变量）
- 全平台实现；本页验收 Web 完整交互，mp-weixin 全量编译通过
- 归入数据录入组，字母序在 `signature` 之后

### 落码清单

- 组件：`packages/core/components/m-slider/m-slider.uvue`
- 主题：`packages/core/theme/vars.scss` 新增 19 个 `$m-slider-*` 变量（全部 `!default`）
- 演示：`packages/playground/pages-sub/form/slider/slider.uvue`（9 个示例：基础 / 范围 / 区间步长 / 自定义 / 垂直 / 气泡刻度 / 禁用只读 / 插槽 / 事件）+ `demo-components.uts` 登记
- 文档：`packages/docs/src/components/slider.md`、`src/en/components/slider.md`，`zh.ts` / `en.ts` 侧栏已插入

### 实现要点

1. 触摸换算：`touchRatio` 统一处理 horizontal / vertical / reverse；值按 `step` 对齐并夹取，范围模式交叉自动交换
2. 测量：`measureTrack` 三分支（Web 同步 / 小程序 `SelectorQuery` / App `getBoundingClientRectAsync`），挂载后测量一次，每次触摸按下刷新
3. 轨道点击：测量回调后计算，范围模式取最近滑块；滑块拖动由 `.stop` 阻止冒泡到轨道
4. 几何：位置用内联百分比 + `translate(-50%, -50%)`；厚度 / 滑块尺寸默认交给主题变量，仅当 prop > 0 时内联覆盖；根节点按半个滑块尺寸预留留白，0% / 100% 不出界
5. 刻度：超过 11 个刻度只画线不画文字，避免密集重叠

### 验证

| 项 | 结果 |
| --- | --- |
| `pnpm sync:uni-modules:check` | 通过 |
| Web 编译 | 成功（70 页，含新演示页） |
| Web 实测（浏览器） | 基础点击 40 → 50、范围 20~60 → 40~60、垂直双滑块 thumb 均在轨道内、刻度 0/2/4/6/8/10 正常、禁用降透明度、自定义滑块显示数字 6；console 无报错 |
| mp-weixin `--compile true` | 成功，无 TS2769 / error |
| `pnpm build:docs` | 通过（双语文档 + 侧栏） |

### 已知限制

- 小程序端拖拽手势为避免页面滚动依赖 `touch-action`（仅 Web）；小程序真机快速拖动可能同时触发页面滚动，待真机验收后按需补 `catchtouchmove` 方案
- 值气泡与刻度为纯展示，不参与布局占位（父容器需自行留出空间）

### 修复记录（2026-11-22 单滑块激活段不显示）

- 现象：演示页基础用法 / 指定范围与步长 / 自定义颜色与尺寸三处单滑块只有灰色轨道，激活段颜色不可见；双滑块范围正常
- 根因：`fillStyle` 在单值模式下把起止位置都取 `positionPercent(0)`，`width / height` 恒为 0
- 修复：起止改为「最小值端 → 滑块偏移」；同时把垂直方向的百分比换算为 bottom 偏移（`100 - position`），修正垂直范围激活段错位
- 验证：`pnpm sync:uni-modules:check` 通过；Web 实测五个卡片（基础 / 范围 / 区间步长 / 自定义色 / 垂直）激活段均正常显示，双滑块与垂直范围填充位于两滑块之间；console 无报错

