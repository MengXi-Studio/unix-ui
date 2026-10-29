---
title: Input
subtitle: 输入框
demo: pages-sub/input/input
---

## 介绍

文本输入框。自带圆角边框容器与前后插槽，支持六种输入类型、清除图标、内置明文切换、formatter 格式化、数字精度与范围收敛、字数统计与多行自适应；可与 `m-compact` 联动组成紧凑布局，也可嵌入 `m-cell` 组合出表单项观感。

label / 必填星号 / 校验与错误提示属表单体系，留待未来 `m-form-item` 承担。

## 代码演示

### 基础使用 {#demo-basic}

`v-model` 双向绑定输入内容。`input` 事件即时触发；`change` 事件在失焦且内容变化时才触发（与原生 change 语义一致）。

```vue
<m-input v-model="value" placeholder="请输入内容" />
```

### 自定义类型 {#demo-type}

通过 `type` 指定输入类型：`text` / `tel` / `digit` / `number` / `password` / `textarea`。`password` 类型配合 `show-eye` 展示内置明文切换图标。

```vue
<m-input v-model="tel" type="tel" placeholder="电话 tel" />
<m-input v-model="pwd" type="password" :show-eye="true" placeholder="密码" />
```

### 可清除的 {#demo-clearable}

设置 `clearable` 后，输入框有内容时展示清除图标。`clear-trigger` 控制显示时机：默认 `focus`（聚焦中显示），`always` 常驻。

```vue
<m-input v-model="value" :clearable="true" placeholder="聚焦时显示" />
<m-input v-model="value2" :clearable="true" clear-trigger="always" placeholder="始终显示" />
```

### 只读和禁用 {#demo-readonly}

`readonly` 外观正常但不可编辑；`disabled` 叠加禁用底色与文本色。

```vue
<m-input v-model="value" :readonly="true" />
<m-input v-model="value2" :disabled="true" />
```

### 插槽 {#demo-slots}

`prepend` 插槽置于输入区之前，`append` 插槽置于图标区之后。图标场景放 `m-icon`，动作场景放 `m-button`。

```vue
<m-input v-model="phone" type="tel" placeholder="请输入手机号">
	<template #prepend>
		<m-icon name="user-o" />
	</template>
	<template #append>
		<m-button size="small" type="primary">发送验证码</m-button>
	</template>
</m-input>
```

### 无边框 {#demo-borderless}

设置 `border=false` 去除边框容器，背景与圆角可经 `custom-style` 自由定制。

```vue
<m-input v-model="value" :border="false" placeholder="无边框" custom-style="background-color: #f7f8fa; border-radius: 8px;" />
```

### 多行文本 {#demo-textarea}

`type="textarea"` 切换多行输入。`auto-height` 使高度随内容自然生长；固定高度由主题变量 `$m-input-textarea-min-height` 控制。

```vue
<m-input v-model="msg" type="textarea" placeholder="请输入留言" />
<m-input v-model="msg2" type="textarea" :auto-height="true" placeholder="自动增高" />
```

### 字数统计 {#demo-word-limit}

`show-word-limit` 配合 `maxlength` 展示字数统计，单行与多行均支持。

```vue
<m-input v-model="value" :maxlength="20" :show-word-limit="true" placeholder="最多 20 字" />
```

### 格式化与数字修正 {#demo-format}

`formatter` 传入格式化函数，`format-trigger` 指定生效时机：`onChange`（默认，输入即应用）或 `onBlur`（失焦应用）。`type` 为 `number` / `digit` 时，失焦按 `precision` 取舍小数位并向 `min` / `max` 收敛（输入过程不打断中间态）。

```vue
<script setup lang="uts">
	/** 即时转大写的格式化函数（需在 script 中定义为箭头函数常量） */
	const upperFormatter = (value: string): string => {
		return value.toUpperCase()
	}
</script>

<template>
	<m-input v-model="upper" placeholder="输入即时转大写" :formatter="upperFormatter" />
	<m-input v-model="num" type="number" placeholder="0-100 保留两位" :precision="2" :min="0" :max="100" />
</template>
```

### 紧凑布局组合 {#demo-compact}

放入 `m-compact` 与 `m-button` 混排：位置互相感知，相邻项圆角衔接、边框合并为 1px；垂直方向即登录表单形态。

```vue
<m-compact block>
	<m-input v-model="keyword" placeholder="请输入搜索内容" />
	<m-button type="primary">搜索</m-button>
</m-compact>
<m-compact direction="vertical" block>
	<m-input v-model="name" placeholder="用户名" />
	<m-input v-model="pwd" type="password" placeholder="密码" />
</m-compact>
```

### cell 嵌入组合 {#demo-cell}

设置 `inlaid` 清除边框与内边距后嵌入 `m-cell`，组合出表单项观感。

```vue
<m-cell-group inset>
	<m-cell title="收货人" required>
		<template #value>
			<m-input v-model="name" :inlaid="true" placeholder="请输入姓名" custom-style="flex: 1; text-align: left;" />
		</template>
	</m-cell>
</m-cell-group>
```

提示：`m-cell` 的 value 区默认右对齐，嵌入输入框时经 `custom-style` 补 `text-align: left` 让输入文本左对齐。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| v-model | 输入框内容，统一 string 类型 | string | `''` |
| type | 输入框类型，可选值 `text` `tel` `digit` `number` `password` `textarea` | InputType | `text` |
| placeholder | 占位符 | string | `''` |
| placeholder-style | 占位符内联样式（直通原生） | string | `''` |
| placeholder-class | 占位符额外样式类（追加在内置占位符类之后） | string | `''` |
| maxlength | 最大输入长度，`-1` 不限制 | number | `-1` |
| show-word-limit | 展示字数统计，需配合 `maxlength > 0` | boolean | `false` |
| clearable | 是否启用清除图标 | boolean | `false` |
| clear-trigger | 清除图标显示时机，可选值 `focus` `always` | ClearTrigger | `focus` |
| border | 是否显示边框容器 | boolean | `true` |
| inlaid | 嵌入式形态：清边框、圆角、内边距与背景，用于嵌入 m-cell 等 | boolean | `false` |
| disabled | 是否禁用 | boolean | `false` |
| readonly | 是否只读：外观正常但不可编辑（经原生 disabled 模拟，只读态不可聚焦） | boolean | `false` |
| confirm-type | 键盘确认键文字，可选值 `done` `search` `send` `go` `next`，仅单行生效 | string | `''` |
| auto-height | 多行是否自动增高，仅 `type=textarea` 生效 | boolean | `false` |
| formatter | 输入内容格式化函数，配合 `format-trigger` 指定生效时机 | (value: string) => string | `null` |
| format-trigger | formatter 生效时机，可选值 `onChange` `onBlur` | FormatTrigger | `onChange` |
| precision | 小数位数：`number` / `digit` 失焦时按位取舍 | number | `null` |
| min | 数值下限：`number` / `digit` 失焦时收敛 | number | `null` |
| max | 数值上限：`number` / `digit` 失焦时收敛 | number | `null` |
| show-eye | 内置明文切换图标，仅 `type=password` 生效（位于 append 插槽之前） | boolean | `false` |
| custom-class | 自定义输入框容器（边框层）类名 | string | `''` |
| custom-style | 自定义输入框容器（边框层）内联样式 | string | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:modelValue | 输入内容变化时触发（v-model 绑定） | value: string |
| input | 输入时即时触发 | value: string |
| change | 失焦且内容变化时触发 | value: string |
| focus | 获得焦点时触发 | event: UniEvent |
| blur | 失去焦点时触发 | event: UniEvent |
| clear | 点击清除图标后触发 | — |

### Slots

| 名称 | 说明 |
| --- | --- |
| prepend | 输入区之前的内容（如图标） |
| append | 图标区之后的内容（如按钮） |

### Methods

通过模板 ref 获取组件实例后调用。

| 方法名 | 说明 |
| --- | --- |
| focus | 聚焦输入框 |
| blur | 失焦输入框 |

## 主题定制

输入框提供以下 SCSS 变量（全部 `!default`，禁用透明度复用全局 `$m-disabled-opacity`，边框宽度复用 `$m-border-width`）：

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| $m-input-font-size | 14px | 输入控件基准字号 |
| $m-input-padding-y | 7px | 边框容器纵向内边距 |
| $m-input-padding-x | 10px | 边框容器横向内边距 |
| $m-input-gap | 6px | 控件与前后部（插槽 / 图标）间距 |
| $m-input-border-radius | $m-radius-md | 边框容器圆角 |
| $m-input-border-color | #ebedf0 | 常态边框色 |
| $m-input-border-color-focus | $m-color-primary | 聚焦态边框色 |
| $m-input-bg | $m-white | 边框容器背景色 |
| $m-input-bg-disabled | #f7f8fa | 禁用态背景色 |
| $m-input-text-color | $m-text-color | 输入文本颜色 |
| $m-input-text-color-disabled | $m-text-color-tertiary | 禁用态文本颜色 |
| $m-input-placeholder-color | $m-text-color-fourth | 占位符颜色 |
| $m-input-clear-icon-size | 16px | 清除图标字号 |
| $m-input-clear-color | $m-text-color-fourth | 清除图标颜色 |
| $m-input-eye-icon-size | 16px | 明文切换图标字号 |
| $m-input-eye-color | $m-text-color-fourth | 明文切换图标颜色 |
| $m-input-count-font-size | 12px | 字数统计字号 |
| $m-input-count-color | $m-text-color-tertiary | 字数统计颜色 |
| $m-input-textarea-min-height | 60px | 多行固定高度基准值 |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant Field、Sard Input 的差异

- **组件形态**：对标 Sard Input 的裸输入框（自带边框容器 + 前后插槽）；Vant Field 的 label / 必填星号 / 校验与错误提示属表单体系，留待未来 `m-form-item`，当前用 `m-cell` + `inlaid` 组合出表单项观感
- **值类型**：统一 `string`（Sard 的 `string | number` 收窄，`.number` 修饰由用户侧处理）
- **保留能力**：Vant 的 `formatter` / `format-trigger` / `min` / `max` / `show-word-limit` 与 Sard 的 `precision` / `show-eye` 均已提供
- **不提供的 HTML-only 能力**：`spellcheck` / `autocorrect` / `autocapitalize` / `autocomplete` / `inputmode` / `rows` 等（uni-app x 原生无对应属性）；多行固定高度经 `$m-input-textarea-min-height` 控制
- **readonly 实现**：uni-app x 无原生 readonly，经原生 `disabled` 模拟，只读态不可聚焦
- **字数统计位置**：展示在输入框下方右对齐（Vant 展示在输入框容器内右上）
- **清除图标时机命名**：取 Vant 的 `clear-trigger`（`focus` / `always`），不采用 Sard 的 `show-clear-only-focus` 布尔语义
