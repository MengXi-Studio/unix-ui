# 快速上手

## 前置条件

已完成[安装](/guide/installation)（uni_modules 或 npm 二选一），并能在页面中渲染出 `<m-button>`。

## 1. 在模板中使用

组件遵循 easycom 规范，无需 import 与注册：

```html
<template>
	<m-button type="primary" @click="onClick">主要按钮</m-button>
</template>

<script setup lang="uts">
	function onClick(event: MouseEvent) {
		console.log('clicked')
	}
</script>
```

## 2. 属性与事件

props 写法与原生属性一致，布尔属性可直接书写或绑定表达式：

```html
<!-- 类型与尺寸 -->
<m-button type="primary">主要按钮</m-button>
<m-button type="danger" size="large">危险大按钮</m-button>
<m-button type="success" size="small">成功小按钮</m-button>

<!-- 加载中：点击不触发，图标自动旋转 -->
<m-button type="primary" loading loading-text="提交中..." />

<!-- 禁用：点击不触发 -->
<m-button type="primary" disabled>禁用状态</m-button>
```

`loading` 与 `disabled` 期间 `click` 不会派发，异步提交无需额外做防重复点击。完整属性见各组件文档的「Props」，例如 [Button 按钮](/components/button)。

## 3. 双向绑定

表单类组件统一用 `v-model`，值类型随组件语义而定：

```html
<!-- 字符串值 -->
<m-input v-model="keyword" :clearable="true" placeholder="请输入关键词" />

<!-- 日期值（Date | null） -->
<m-date-picker v-model:value="date" title="选择日期" :min-date="minDate" :max-date="maxDate" />
```

```uts
const keyword = ref('')
const date = ref<Date | null>(null)
const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2030, 11, 31)
```

| 组件类型 | 值类型 | 示例 |
| --- | --- | --- |
| 文本 | `string` | `m-input`、`m-search` |
| 选择器 | `string` / `number`（可空用 `null`） | `m-picker`、`m-radio-group`、`m-select`、`m-segmented` |
| 数值 | `number` | `m-rate` |
| 日期 | `Date \| null` | `m-date-picker`、`m-calendar` |
| 时间 | `'HH:mm'` / `'HH:mm:ss'` | `m-time-picker` |
| 多选 | 数组 | `m-checkbox-group`、`m-select`（`multiple`） |

## 4. 弹出框与输入框组合

需要表单外观时，优先使用组合形态，而不是自己拼 `popup`：

```html
<m-date-picker-input
	v-model:value="birthday"
	title="出生日期"
	placeholder="请选择日期"
	:clearable="true"
/>
```

三件套的分工固定：`m-date-picker` 是面板，`m-date-picker-popup` 负责弹层，`m-date-picker-input` 负责表单回显；时间、日期范围、农历、通用选择器同理。

## 5. 用插槽组合

容器类组件通过插槽组合子组件，例如用 `m-cell-group` 组织一组单元格：

```html
<m-cell-group inset>
	<m-cell title="单元格" value="内容" is-link />
	<m-cell title="带图标" icon="setting" is-link />
</m-cell-group>
```

按钮 / 输入框需要紧凑连接时，用 `m-compact` 包裹即可自动衔接圆角与边框：

```html
<m-compact>
	<m-button type="primary">确定</m-button>
	<m-button type="primary">取消</m-button>
</m-compact>
```

## 6. 调整主题

全局换肤在工程根 `uni.scss` 直接定义变量（详见[主题定制](/guide/theming)）：

```scss
$m-color-primary: #10b981;
$m-button-normal-height: 48px;
```

单个实例的微调优先用 `custom-style` / `custom-class`，不要为局部样式改动全局变量：

```html
<m-button type="primary" custom-style="margin-left: 12px;">偏移按钮</m-button>
```

## 7. 常见错误

| 现象 | 原因与处理 |
| --- | --- |
| 标签未渲染 | 目录名不是 `m-ui-x`，或 npm 方式漏配 easycom 规则，见[常见问题](/guide/faq#组件标签没有渲染) |
| 主题变量不生效 | 在 `uni.scss` 中 `@import` 了 `vars.scss`（应直接定义变量），或修改后未重启 dev server |
| App 端文字样式异常 | 文字样式写在 `<text>` 上，不要写在容器 `view` 上 |

## 下一步

- [主题定制](/guide/theming)：变量分层、覆盖优先级与常见坑
- [组件参考](/components/button)：查全部组件的 Props、Events 与插槽
- [常见问题](/guide/faq)：编译与运行的高频问题
