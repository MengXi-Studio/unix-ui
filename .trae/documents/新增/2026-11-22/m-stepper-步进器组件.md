# m-stepper 步进器组件 实施方案

## 需求

用户给出两份参考实现，要求新增步进器组件：

- Vant Stepper：`https://vant-ui.github.io/vant/#/zh-CN/stepper`
- Sard Stepper：`https://sard.wzt.zone/components/stepper`

目标：按 unix-ui 组件规范实现 `m-stepper`，覆盖按钮增减、输入框直接输入、范围限制、步长、小数精度、禁用/只读、长按连续增减，并提供 `v-model:value` 双向绑定。

## 需求分析

### 两套参考的差异

| 能力 | Vant | Sard | 本组件建议 |
| --- | --- | --- | --- |
| 值绑定 | `v-model`（number / string） | `model-value`（number / string / null） | `v-model:value`（number \| null） |
| 最小值默认 | `1` | `Number.MIN_SAFE_INTEGER` | `1`（对齐 Vant） |
| 最大值默认 | 无 | `Number.MAX_SAFE_INTEGER` | 不限制 |
| 步长 | `step` | `step` | `step` |
| 小数位 | `decimal-length`（固定显示位数） | `precision`（toFixed） | `decimalLength`（对齐 Vant 命名） |
| 整数限制 | `integer` | — | `integer` |
| 空值 | `allow-empty` | `value-on-clear` | 两者都实现：`allowEmpty` + `valueOnClear` |
| 自动校正 | `auto-fixed` | — | `autoFixed`（默认 `true`） |
| 禁用 / 只读 | `disabled` / — | `disabled` / `readonly` | `disabled` / `readonly` |
| 按钮禁用 | `disable-plus` / `disable-minus` | — | 同名 |
| 输入框禁用 | `disable-input` | — | 同名 |
| 显示开关 | `show-plus` / `show-minus` / `show-input` | — | 同名 |
| 长按连加 | `long-press` | `press` / `press-time` / `interval` | `longPress` + `pressTime` + `interval` |
| 变更前拦截 | `before-change`（支持 Promise） | — | `beforeChange`（支持 Promise） |
| 风格 | `theme="round"` | `variant` 四态 + `size` | `theme` + `variant` + `size` 全部实现 |
| 事件 | change / overlimit / plus / minus / focus / blur | update / change / focus / blur | 全量保留 Vant 事件语义 |

### 涉及文件与影响面

- 组件：`packages/core/components/m-stepper/m-stepper.uvue`（新建）
- 主题：`packages/core/theme/vars.scss` 新增 `$m-stepper-*` 段（全部 `!default`）
- 同步：`pnpm sync:uni-modules` → `packages/playground/uni_modules/m-ui-x/`
- 演示页：`packages/playground/pages-sub/form/stepper/stepper.uvue`（新建，归数据录入组）
- 演示登记：`packages/playground/pages/index/demo-components.uts` 数据录入组，字母序插在 `slider` 之后
- 双语文档：`packages/docs/src/components/stepper.md`、`packages/docs/src/en/components/stepper.md`（新建）
- 侧栏：`packages/docs/.vitepress/config/zh.ts`、`en.ts` 数据录入组，插在 `slider` 之后
- 路由：页面内 `defineUniPage({ title: '步进器 Stepper', name: 'stepper' })` 由 routeGen 生成 pages.json / routes.gen.uts

## API 设计

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值（`v-model:value`，`null` 表示空输入） | number \| null | `1` |
| min | 最小值 | number | `1` |
| max | 最大值 | number | 不限制 |
| step | 步长 | number | `1` |
| decimalLength | 固定小数位数（`-1` 不固定） | number | `-1` |
| integer | 仅允许整数 | boolean | `false` |
| allowEmpty | 允许输入为空（值为 `null`） | boolean | `false` |
| valueOnClear | 清空后回写值，支持 `'min'` / `'max'` | number \| string \| null | `null` |
| autoFixed | 超出 `[min, max]` 时自动校正（按钮与失焦） | boolean | `true` |
| disabled | 禁用整个步进器 | boolean | `false` |
| readonly | 只读（外观正常、不可修改） | boolean | `false` |
| disableInput | 禁用输入框（按钮仍可点） | boolean | `false` |
| disablePlus | 禁用增加按钮 | boolean | `false` |
| disableMinus | 禁用减少按钮 | boolean | `false` |
| showPlus | 显示增加按钮 | boolean | `true` |
| showMinus | 显示减少按钮 | boolean | `true` |
| showInput | 显示输入框 | boolean | `true` |
| longPress | 长按按钮连续增减 | boolean | `true` |
| pressTime | 长按触发时间 ms | number | `350` |
| interval | 长按后连续触发间隔 ms | number | `150` |
| beforeChange | 变更前拦截，返回 `false` 阻止，支持 Promise | `((value: number \| null) => boolean \| Promise<boolean>) \| null` | `null` |
| inputWidth | 输入框宽度 px（`0` 用主题变量） | number | `0` |
| buttonSize | 按钮尺寸 / 输入框高度 px（`0` 用主题变量） | number | `0` |
| theme | 风格（`round` 为胶囊 + 主色按钮） | `'default' \| 'round'` | `'default'` |
| variant | 变体（`solid` 灰底 / `outlined` 描边 / `accent` 主色浅底 / `ghost` 无底） | `'solid' \| 'outlined' \| 'accent' \| 'ghost'` | `'solid'` |
| size | 尺寸 | `'medium' \| 'small'` | `'medium'` |
| placeholder | 输入框占位文案 | string | `''` |
| customClass / customStyle | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 值变化（v-model:value，空输入为 `null`） | value: number \| null |
| change | 值确认变化（点击按钮、失焦收敛后） | value: number \| null |
| plus | 点击增加按钮 | - |
| minus | 点击减少按钮 | - |
| overlimit | 点击到达边界 / 被禁用的按钮 | - |
| focus | 输入框聚焦 | event: UniEvent |
| blur | 输入框失焦 | event: UniEvent |

### Slots

首版不提供插槽（Vant / Sard 均无）。

### 模板结构

```text
view.m-stepper（row；variant 背景 / 描边 + size + theme）
├── view.m-stepper__button.m-stepper__minus（showMinus；m-icon name="minus"）
├── input.m-stepper__input（showInput；type 由 integer 决定 digit / number）
└── view.m-stepper__button.m-stepper__plus（showPlus；m-icon name="plus"）
```

- 根节点常驻静态，variant / size / theme / 禁用态用扁平类名切换（禁止后代选择器）；`inputWidth` / `buttonSize` > 0 时用内联样式覆盖。
- 图标颜色通过按钮类名设置 `color` 由 m-icon 继承；按钮尺寸、输入框高度、字号、圆角、颜色全部走主题变量。
- `theme="round"` 时根背景透明、按钮主色底 + 白图标、胶囊圆角；与 variant 同时传时 round 优先。

### 关键逻辑（伪代码）

```text
clamp(v)          = min(max(v, min), max)
formatValue(v)    = decimalLength >= 0 ? v.toFixed(decimalLength)
                                       : 去除浮点误差后转字符串（最多 6 位小数）
normalize(v)      = autoFixed ? clamp(formatValue(v)) : formatValue(v)
current           = value == null ? null : normalize(value)

点击增加/减少：
  emit plus / minus（按钮可用时）
  若 disabled || readonly || disableXxx || 边界禁用 → emit overlimit，直接返回
  requestChange((current == null ? min : current) ± step)

requestChange(next):
  next = normalize(next)
  若 beforeChange != null：
    返回 boolean → 直接判定；返回 Promise → then 判定
  ok 时 commit(next)

commit(next):
  若 next != current → emit update:value + change

输入框 @input：
  过滤非法字符（integer 去掉小数点；其它保留数字、小数点、负号）
  合法数字 → emit update:value（不在此阶段 clamp，允许输入中间态）
  文本为空且 allowEmpty → emit update:value(null)
  文本为空且 !allowEmpty → 仅停留在文本层，失焦再回落 min

输入框 @blur：
  文本为空 → allowEmpty ? 解析 valueOnClear（number / 'min' / 'max' / null） : min
  否则 parseFloat → normalize
  文本回写 formatValue，与聚焦快照不同 → emit change

长按：
  touchstart / mousedown → pressTimer = setTimeout(pressTime)
    → 到点后先触发一次，再 intervalTimer = setInterval(interval)
  touchend / touchcancel / mouseup / mouseleave / 卸载 → 清理两个定时器
```

### 主题变量（全部 `!default`）

```scss
$m-stepper-height: 28px;
$m-stepper-input-width: 32px;
$m-stepper-input-font-size: 14px;
$m-stepper-input-text-color: $m-text-color;
$m-stepper-input-disabled-text-color: $m-text-color-tertiary;
$m-stepper-background: #f2f3f5;
$m-stepper-radius: $m-radius-md;
$m-stepper-radius-round: $m-radius-max;
$m-stepper-button-icon-color: $m-text-color;
$m-stepper-button-icon-size: 16px;
$m-stepper-button-disabled-icon-color: $m-text-color-fourth;
$m-stepper-round-color: $m-color-primary;
$m-stepper-round-icon-color: $m-white;
/* outlined / accent / ghost 变体 */
$m-stepper-border-color: #ebedf0;
$m-stepper-accent-background: rgba($m-color-primary, 0.1);
$m-stepper-accent-color: $m-color-primary;
/* small 尺寸 */
$m-stepper-height-small: 24px;
$m-stepper-input-width-small: 28px;
$m-stepper-input-font-size-small: 12px;
$m-stepper-button-icon-size-small: 14px;
```

## 疑问清单

### Q1 值类型与空值支持（影响：Props / 事件 / 文档）

建议：`value` 固定为 `number`，默认 `1`，首版不实现 Vant `allow-empty` 与 Sard `value-on-clear`；输入框清空后失焦回落到 `min`。

回答：类型由你决定，实现 Vant `allow-empty` 与 Sard `value-on-clear`。

### Q2 Sard 的 variant / size 是否纳入首版（影响：主题变量与样式矩阵）

建议：不纳入。首版只做 Vant 的 `theme="round"` 与 `inputWidth` / `buttonSize` 自定义尺寸；Sard 的 solid / outlined / accent / ghost 四变体暂不做。

回答：Sard 的 variant / size 纳入首版。

### Q3 长按参数是否开放（影响：Props 数量）

建议：开放 `longPress` / `pressTime` / `interval` 三个属性，默认 350ms 触发、150ms 间隔（对齐 Sard）。

回答：开放。

### Q4 超限输入的处理方式（影响：交互行为）

建议：始终自动校正（点击按钮与失焦都 clamp 到 `[min, max]`），不提供 Vant `auto-fixed=false` 的关闭选项。

回答：提供 `auto-fixed` 选项，默认 `true`。

## 实施记录

### 决策（用户回答）

- 值类型 `number | null`，同时实现 Vant `allow-empty` 与 Sard `value-on-clear`
- Sard `variant`（solid / outlined / accent / ghost）与 `size`（medium / small）纳入首版
- 开放 `longPress` / `pressTime` / `interval`
- 提供 `autoFixed` 选项，默认 `true`

### 落码清单

- 组件：`packages/core/components/m-stepper/m-stepper.uvue`
- 主题：`packages/core/theme/vars.scss` 新增 20 个 `$m-stepper-*` 变量（全部 `!default`）
- 演示：`packages/playground/pages-sub/form/stepper/stepper.uvue`（基础 / 范围与 auto-fixed / 步长精度 / 空值 / 只读禁用 / 变体 / 尺寸与 round / 长按 / 拦截事件）+ `demo-components.uts` 登记
- 路由：routeGen 生成 `pages.json` 与 `router/routes.gen.uts`
- 文档：`packages/docs/src/components/stepper.md`、`src/en/components/stepper.md`，`zh.ts` / `en.ts` 侧栏已插入

### 实现要点

1. 值归一：`roundNumber` 处理 integer / decimalLength / 浮点误差，`normalize` 按 `autoFixed` 收敛到 `[min, max]`
2. 输入：允许 `1.` / `-` / `.` 中间态；合法数字即时 `update:value`，失焦统一解析、收敛、回写展示文本
3. 空值：`allowEmpty` 时空文本回写 `null`；失焦按 `valueOnClear`（number / `'min'` / `'max'` / `null`）解析
4. 按钮：`plus` / `minus` 先派发，再经 `beforeChange`（同步或 Promise）决定是否 `commit`
5. 长按：`pressTime` 后触发一次并按 `interval` 连续触发；`touchend` / `mouseup` / `mouseleave` 清理定时器，并抑制长按后的 click
6. 样式：四种变体、两档尺寸、round 主题全部用扁平类名；图标颜色 / 字号落在 `m-icon` 的 `custom-class` 上，避免在 view 上写文字样式

### 验证

| 项 | 结果 |
| --- | --- |
| `pnpm sync:uni-modules:check` | 通过 |
| Web 编译（HBuilderX CLI） | 成功，dev server 5174 |
| Web 实测（浏览器） | 基础 +/- 正常；decimal-length=2 输入 1.2345 失焦变 1.23；allow-empty 清空回写 null；value-on-clear="min" 回写 3；四种变体 / small / round / 禁用只读渲染正常；长按连续递增生效；console 无 warn / error |
| `pnpm build:docs` | 通过（双语文档 + 侧栏） |

### 遗留

- 无

