---
title: Rate
subtitle: 评分
demo: pages-sub/form/rate/rate
added: 0.7.0
---

## 介绍

用于对事物进行评级操作。支持半星、滑动评分、自定义图标 / 颜色 / 尺寸 / 数量、可清空、只读小数展示与禁用。

> 分值类型为 `number`，`0` 表示未评分；交互选择吸附到 `0.5` 网格。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定当前分值，点击或滑动选择：

```vue
<m-rate v-model:value="value" />
```

```uts
const value = ref<number>(3)
```

### 半星 {#demo-half}

设置 `allow-half` 后可选中半星（点击图标左半边为半星）：

```vue
<m-rate v-model:value="value" allow-half />
```

### 自定义图标 {#demo-icon}

`icon` / `void-icon` 接收 m-icon 的字形名：

```vue
<m-rate v-model:value="value" icon="like" void-icon="like-o" />
```

### 自定义样式 {#demo-style}

`color` / `void-color` 设置选中与未选中颜色，`size` / `gap` 设置图标尺寸与间距：

```vue
<m-rate v-model:value="value" color="#ffd21e" void-color="#eeeeee" :size="28" :gap="10" />
```

### 自定义数量 {#demo-count}

```vue
<m-rate v-model:value="value" :count="7" allow-half />
```

### 可清空 {#demo-clearable}

`clearable` 时再次点击当前分值清零：

```vue
<m-rate v-model:value="value" clearable />
```

### 只读与禁用 {#demo-disabled}

```vue
<m-rate :value="3" readonly />
<m-rate :value="3" disabled />
```

### 只读小数 {#demo-decimal}

`readonly` + `allow-half` 可展示任意小数（如评分均值 3.3）：

```vue
<m-rate :value="3.3" allow-half readonly />
```

### 滑动评分 {#demo-touchable}

`touchable` 默认开启，按住横向拖动连续选分；设为 `false` 后仅点击生效：

```vue
<m-rate v-model:value="value" allow-half />
<m-rate v-model:value="value" :touchable="false" allow-half />
```

### 自定义图标插槽 {#demo-slot}

`icon` / `void-icon` 插槽作用域为 `{ index, active }`，插槽内容同样被半星裁切：

```vue
<m-rate v-model:value="value" allow-half>
	<template #void-icon="{ index }">
		<text class="slot">{{ index + 1 }}</text>
	</template>
	<template #icon="{ index }">
		<text class="slot slot--on">{{ index + 1 }}</text>
	</template>
</m-rate>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前分值（v-model:value），0 表示未评分 | number | `0` |
| count | 图标总数 | number | `5` |
| size | 图标尺寸（number 补 px） | string \| number | `''`（空串用主题值 `20px`） |
| gap | 图标间距（number 补 px，等价 Vant 的 gutter） | string \| number | `''`（空串用主题值 `4px`） |
| color | 选中态颜色 | string | `''`（空串用主题值 `#ee0a24`） |
| void-color | 未选中态颜色 | string | `''`（空串用主题值 `#c8c9cc`） |
| disabled-color | 禁用态颜色（选中与未选同时生效） | string | `''`（空串用主题值 `#c8c9cc`） |
| icon | 选中态字形（m-icon 字形名） | string | `star` |
| void-icon | 未选中态字形 | string | `star-o` |
| allow-half | 是否允许半星 | boolean | `false` |
| clearable | 是否允许再次点击当前分值清零 | boolean | `false` |
| readonly | 是否只读（视觉正常但不可交互） | boolean | `false` |
| disabled | 是否禁用（灰显且不可交互） | boolean | `false` |
| touchable | 是否允许滑动评分 | boolean | `true` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 分值变化（v-model:value） | value: number |
| change | 分值变化 | value: number |
| click | 点击评分（含禁用 / 只读被拒绝时） | event: MouseEvent |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| icon | 自定义选中态图标内容 | `{ index, active }` |
| void-icon | 自定义未选中态图标内容 | `{ index, active }` |

## 主题定制

评分样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-rate-icon-size | 图标默认尺寸 | 20px |
| $m-rate-gap | 图标默认间距 | 4px |
| $m-rate-icon-color | 选中态图标颜色 | #ee0a24 |
| $m-rate-icon-void-color | 未选中态图标颜色 | #c8c9cc |
| $m-rate-icon-disabled-color | 禁用态图标颜色 | #c8c9cc |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant 的差异

- **绑定语法**：Vant 为 `v-model`；本项目统一 `v-model:value`
- **间距命名**：Vant 为 `gutter`；本项目统一 `gap`（与 flex / space / password-input 一致）
- **文字评分**：不提供 Sard 的 `text` / `void-text`，改由 `icon` / `void-icon` 插槽承载任意内容
- **禁用配色**：`disabled-color` 单选与未选字形同时生效，不做整体透明度叠加
- **半星实现**：图标库无半星字形，采用「未选字形 + 宽度百分比裁切层」叠加，只读态可按小数比例裁切

## 注意事项

- 分值超出 `count` 时仅视觉截断，不回写外部值
- `size` / `gap` 使用 px 语义；传非 px 单位时滑动换算退回主题默认步进（点击选择不受影响）
- `touchable=false` 时仅点击生效，滑动不改变分值
- 小程序端 `icon` / `void-icon` 插槽不生效（`v-for` 内同名插槽限制），回退内置字形
- 半星依赖裁切层，App 端字形裁切效果需在真机验收
