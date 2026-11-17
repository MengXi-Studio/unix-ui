---
title: RadioInput
subtitle: 单选输入框
demo: pages-sub/radio-input/radio-input
added: 0.7.0
---

## 介绍

单选输入框：`m-input`（只读触发器）+ `m-radio-popup` 组合的表单形态组件。点击整区打开弹层单选，选中项 label 回显；`clearable` 显示自绘清空按钮，点击回写 `null` 并派发 `clear`。

> 值类型：选项标识 `string | number`，当前值 `RadioValue | null`（`null` 未选，显示占位符）。

## 代码演示

### 基础用法 {#demo-basic}

```vue
<m-radio-input v-model:value="value" :options="options" title="选择城市" placeholder="请选择城市" />
```

### 清空按钮 {#demo-clear}

`clearable`（默认 true）在有值且非禁用时显示右侧清空按钮：

```vue
<m-radio-input v-model:value="value" :options="options" @clear="onClear" />
```

### 禁用与形态 {#demo-disabled}

```vue
<m-radio-input v-model:value="value" :options="options" disabled title="禁用" />
<m-radio-input v-model:value="value" :options="options" inlaid title="嵌入式" />
```

### 自定义字段名 {#demo-field-names}

```vue
<m-radio-input
	v-model:value="value"
	:options="options"
	:field-names="{ label: 'name', value: 'code', disabled: 'disabled' }"
	title="选择地区编码"
/>
```

## API

### Props

透传 `m-radio-popup` 全部 props（除 show），另加：

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前选中项标识（v-model:value；null 未选） | RadioValue \| null | `null` |
| options | 选项数组（label / value / disabled 字段） | UTSJSONObject[] | `null` |
| placeholder | 占位符 | string | `请选择` |
| disabled | 是否禁用（触发层不渲染，无法打开弹层） | boolean | `false` |
| readonly | 是否只读（弹层内选项不可切换） | boolean | `false` |
| clearable | 是否显示清空按钮（有值且非禁用时可见） | boolean | `true` |
| border | 触发器是否显示边框容器（透传 m-input） | boolean | `true` |
| inlaid | 触发器嵌入式形态（透传 m-input） | boolean | `false` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 选中值变化 | value: RadioValue \| null |
| change | 选中值变化 | value: RadioValue \| null |
| click-item | 点击选项（透传弹层） | index: number |
| clear | 点击清空按钮 | - |

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-radio-input-trigger-z-index | 触发层层级 | 1 |
| $m-radio-input-clear-z-index | 清空按钮层级 | 2 |
| $m-radio-input-clear-width | 清空按钮宽度 | 40px |
| $m-radio-input-clear-icon-size | 清空图标字号 | 16px |
| $m-radio-input-clear-color | 清空图标颜色 | #c8c9cc |

触发器视觉复用 `$m-input-*`，弹层复用 `$m-radio-popup-*`。

## 注意事项

- 清空按钮为自绘实现（m-input 内置 `clearable` 的图标位于触发层之下会被挡住），点击回写 `null`
- 触发层为透明覆盖层：disabled 态不渲染触发层，原生禁用控件吞点击行为得以规避
- 展示文本按值匹配 options 取 label，无匹配回退值文本
