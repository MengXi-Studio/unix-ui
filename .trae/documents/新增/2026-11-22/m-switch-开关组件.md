# m-switch 开关组件 实施方案

## 需求

用户给出两份参考实现，要求新增开关组件：

- Vant Switch：`https://vant-ui.github.io/vant/#/zh-CN/switch`
- Sard Switch：`https://sard.wzt.zone/components/switch`

目标：按 unix-ui 组件规范实现 `m-switch`，覆盖开 / 关切换、自定义值、颜色、尺寸、禁用 / 只读、加载态、异步切换、轨道文字与插槽自定义。

## 需求分析

### 两套参考的差异

| 能力 | Vant | Sard | 本组件建议 |
| --- | --- | --- | --- |
| 绑定 | `v-model`（any） | `v-model`（any） | `v-model:value` |
| 开关值 | `active-value` / `inactive-value`（any） | `checked-value` / `unchecked-value`（any） | `checkedValue` / `uncheckedValue`（boolean \| string \| number） |
| 颜色 | `active-color` / `inactive-color` | `checked-color` / `unchecked-color` | `activeColor` / `inactiveColor`（对齐 Vant） |
| 尺寸 | `size`（number \| string，默认 26px） | `size`（string） | `size`（number px，0 用主题变量） |
| 禁用 / 只读 | `disabled` / — | `disabled` / `readonly` | `disabled` / `readonly` |
| 加载 | `loading` | 由 `before-update` 自动进入 | `loading` + 异步自动 loading |
| 异步切换 | — | `before-update`（Promise，pending 显示 loading） | `beforeUpdate` |
| 轨道文字 | — | `checked-text` / `unchecked-text` + 同名插槽 | 属性与插槽都提供 |
| 插槽 | `node`（滑块）/ `background` | `checked-text` / `unchecked-text` | 全部提供 |
| 事件 | change / click | update:modelValue / change / click / update:loading | 合并 |

### 涉及文件与影响面

- 组件：`packages/core/components/m-switch/m-switch.uvue`（新建）
- 主题：`packages/core/theme/vars.scss` 新增 `$m-switch-*` 段（全部 `!default`）
- 同步：`pnpm sync:uni-modules`
- 演示页：`packages/playground/pages-sub/form/switch/switch.uvue`（新建，归数据录入组）
- 演示登记：`demo-components.uts` 数据录入组，字母序插在 `stepper` 之后
- 双语文档：`packages/docs/src/components/switch.md`、`src/en/components/switch.md`
- 侧栏：`zh.ts` / `en.ts` 数据录入组，插在 `stepper` 之后
- 路由：页面内 `defineUniPage({ title: '开关 Switch', name: 'switch' })`

## API 设计

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值（`v-model:value`） | boolean \| string \| number | `false` |
| checkedValue | 打开时对应的值 | boolean \| string \| number | `true` |
| uncheckedValue | 关闭时对应的值 | boolean \| string \| number | `false` |
| activeColor | 打开时轨道背景色（`''` 用主题变量） | string | `''` |
| inactiveColor | 关闭时轨道背景色（`''` 用主题变量） | string | `''` |
| size | 滑块尺寸 px（`0` 用主题变量） | number | `0` |
| loading | 加载状态（不可点击） | boolean | `false` |
| disabled | 禁用 | boolean | `false` |
| readonly | 只读（外观正常、不可切换） | boolean | `false` |
| checkedText | 打开时轨道内文字 | string | `''` |
| uncheckedText | 关闭时轨道内文字 | string | `''` |
| textAutoWidth | 文案自适应轨道宽度（有文案 / 文字插槽时生效） | boolean | `true` |
| beforeUpdate | 异步切换：返回 Promise，resolve 后切换，pending 期间显示 loading | `(value: SwitchValue) => Promise<any>` | - |
| customClass / customStyle | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 值变化（v-model:value） | value: boolean \| string \| number |
| change | 开关切换完成 | value: boolean \| string \| number |
| click | 点击开关（禁用 / 只读 / 加载中不触发） | event: UniEvent |
| update:loading | 异步切换的 loading 变化 | loading: boolean |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| node | 自定义滑块内容 | - |
| background | 自定义轨道背景内容 | - |
| checked-text | 打开时轨道文字（优先于 checked-text 属性） | - |
| unchecked-text | 关闭时轨道文字（优先于 unchecked-text 属性） | - |

### 模板结构

```text
view.m-switch（轨道：inline 背景色 / 尺寸；class 控制选中 / 禁用 / 加载）
├── slot background（自定义轨道背景）
├── view.m-switch__text-wrap--left（checkedText / checked-text 插槽；文案居中）
├── view.m-switch__text-wrap--right（uncheckedText / unchecked-text 插槽；文案居中）
├── view.m-switch__node（滑块：白底 + 阴影 + 按轨道宽度计算的 px 位移）
│   └── slot node / m-loading（loading 时）
└── text.m-switch__measure-text（隐藏测量节点：nowrap + opacity 0，取文案固有宽度）
```

### 关键逻辑（伪代码）

```text
checked = value === checkedValue

点击：
  若 disabled || readonly || loading → 直接返回（不派发 click）
  emit click
  next = checked ? uncheckedValue : checkedValue
  若 beforeUpdate == null → apply(next)
  否则：
    pending = true；emit update:loading(true)
    beforeUpdate(next).then(() => apply(next)).finally(pending = false; emit update:loading(false))

apply(next):
  emit update:value(next) + change(next)

watch(checked, flush: 'post')：
  重新测量当前可见文案宽度，必要时扩展轨道

尺寸：
  nodeSize = size > 0 ? size : 主题值
  trackHeight = nodeSize + 4
  trackWidth = max(nodeSize * 1.8 + 4, 文案宽度 + nodeSize + 16)
  translateX = checked ? trackWidth - nodeSize - 4 : 0（px）
```

### 主题变量（全部 `!default`）

```scss
$m-switch-size: 26px;
$m-switch-width: 50px;
$m-switch-height: 30px;
$m-switch-node-size: 26px;
$m-switch-node-background: $m-white;
$m-switch-node-shadow: 0 3px 1px rgba(0, 0, 0, 0.05);
$m-switch-background: rgba(120, 120, 128, 0.16);
$m-switch-on-background: $m-color-primary;
$m-switch-disabled-opacity: $m-disabled-opacity;
$m-switch-loading-opacity: 0.6;
$m-switch-text-color: $m-white;
$m-switch-text-font-size: 12px;
$m-switch-duration: 200;
```

## 疑问清单

### Q1 颜色属性命名（影响：Props / 文档）

建议：对齐 Vant 使用 `activeColor` / `inactiveColor`，不额外提供 Sard 的 `checkedColor` / `uncheckedColor` 别名。

回答：使用 `activeColor` / `inactiveColor`。

### Q2 自定义开关值范围（影响：值类型与事件）

建议：支持 `boolean | string | number` 三类值，通过 `checkedValue` / `uncheckedValue` 指定；判断严格相等。

回答：使用建议。

### Q3 异步切换与加载态（影响：交互与事件）

建议：实现 `beforeUpdate`；pending 期间内部 loading 且不可点击，`resolve` 后应用新值，`reject` 保持原值；同时保留 `loading` 属性用于外部控制，派发 `update:loading`。

回答：使用建议。

### Q4 轨道文字与插槽（影响：模板与样式）

建议：同时提供 `checkedText` / `uncheckedText` 属性与 `checked-text` / `unchecked-text` 插槽；另提供 Vant 的 `node` / `background` 插槽。

回答：使用建议。

## 实施记录

### 决策

- 颜色命名：`activeColor` / `inactiveColor`
- 值范围：`boolean | string | number`，通过 `checkedValue` / `uncheckedValue` 配置
- 异步切换：`beforeUpdate` + 内部 pending loading，派发 `update:loading`；外部 `loading` 保留
- 文字与插槽：`checkedText` / `uncheckedText` 属性与同名插槽，另提供 `node` / `background`

### 落码清单

- 组件：`packages/core/components/m-switch/m-switch.uvue`
- 主题：`packages/core/theme/vars.scss` 新增 11 个 `$m-switch-*` 变量（全部 `!default`）
- 演示：`packages/playground/pages-sub/form/switch/switch.uvue`（基础 / 禁用只读 / 加载与异步 / 尺寸 / 颜色 / 自定义值 / 文字 / 四种插槽）+ `demo-components.uts` 登记
- 路由：routeGen 生成 `pages.json` 与 `router/routes.gen.uts`
- 文档：`packages/docs/src/components/switch.md`、`src/en/components/switch.md`，`zh.ts` / `en.ts` 侧栏已插入

### 实现要点

1. 值比较统一 `toString()`，兼容 boolean / string / number 混合配置
2. 轨道几何：默认走主题变量；`size` > 0 时内联 `1.8 × size + 4` / `size + 4`，滑块位移固定为自身宽度 80%，与尺寸解耦
3. 滑块位移：按当前轨道宽度计算 px 位移（`checked ? trackWidth - nodeSize - 4 : 0`），不依赖 transform 百分比，自动扩宽后仍能准确落在右端；切换时直接落位
4. 异步切换：pending 期间 `isLoading` 生效且不可点击；Promise resolve 后应用新值，reject 保持原值，均派发 `update:loading(false)`
5. 文字与插槽：文字显示在滑块对侧；`checked-text` / `unchecked-text` 插槽优先于同名属性；`background` 由独立绝对定位容器承载
6. 插槽探测统一走 `utils/slot.uts` 的 `slotHasContent`，规避小程序空插槽恒真问题
7. 加载图标：`m-loading` 根节点自带 `align-self: flex-start`，需通过 `custom-style="align-self: center;"` 覆盖，才能在滑块内水平居中
8. 文案自适应：隐藏测量 text（绝对定位 + `white-space: nowrap` + `opacity: 0`）取固有宽度，轨道宽度 = 文案宽度 + 滑块尺寸 + 16px；`textAutoWidth=false` 时恢复默认宽度并裁剪；文字容器占满轨道、滑块侧预留 `nodeSize + 2` 且反向内边距为 0，文案在「轨道减去滑块」区域内水平、垂直居中

### 验证

| 项 | 结果 |
| --- | --- |
| `pnpm sync:uni-modules:check` | 通过 |
| Web 编译（HBuilderX CLI） | 成功，dev server 5174 |
| Web 实测（浏览器） | 基础开 / 关切换与文案同步；disabled / readonly 四种组合均不可切换；异步切换约 800ms 完成且 loading 事件顺序正确；18 / 26 / 34 尺寸、红 / 绿自定义色、字符串 / 数字值、轨道文字、文字 / 滑块 / 背景插槽均正常；加载图标与滑块中心像素级重合（偏移 0px）；长文案自适应后轨道 190px、文案 144px 完整无换行；文案在「轨道减去滑块」区域内水平偏移 0px、垂直偏移 0.5px，且不与滑块重叠；`text-auto-width=false` 保持 58px 并裁剪；console 无 warn / error |
| `pnpm build:docs` | 通过（双语文档 + 侧栏） |

### 遗留

- 无

