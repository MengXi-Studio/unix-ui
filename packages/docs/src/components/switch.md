---
title: Switch
subtitle: 开关
demo: pages-sub/form/switch/switch
added: 0.8.0
---

## 介绍

用于在打开和关闭两种状态之间切换。支持自定义开关值、轨道颜色、尺寸、只读 / 禁用、加载态、异步切换，以及轨道文字与滑块 / 背景插槽。

> 开关值支持 `boolean | string | number`，通过 `checked-value` / `unchecked-value` 指定；值比较统一转为字符串。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定开关状态，`true` 为开、`false` 为关：

```vue
<m-switch v-model:value="checked" @change="onChange" />
```

```uts
const checked = ref<boolean>(true)

function onChange(value: boolean | string | number) {
	console.log('switch change: ' + value.toString())
}
```

### 禁用与只读 {#demo-status}

`disabled` 降低透明度且不可点击；`readonly` 外观正常但不可切换：

```vue
<m-switch :value="false" disabled />
<m-switch :value="true" disabled />
<m-switch :value="false" readonly />
<m-switch :value="true" readonly />
```

### 加载状态 {#demo-loading}

`loading` 用于外部控制加载态；`before-update` 返回 Promise 时自动进入加载态，`resolve` 后切换：

```vue
<m-switch v-model:value="checked" :loading="true" />
<m-switch v-model:value="asyncChecked" :before-update="beforeUpdate" @update:loading="onLoadingChange" />
```

```uts
const beforeUpdate = (value: boolean | string | number): Promise<any> => {
	return new Promise<any>((resolve: (result: any) => void) => {
		setTimeout(() => {
			resolve(null)
		}, 800)
	})
}
```

### 自定义尺寸 {#demo-size}

`size` 设置滑块尺寸（px），轨道按 1.8 × 滑块 + 4px 自动计算：

```vue
<m-switch v-model:value="checked" :size="18" />
<m-switch v-model:value="checked" :size="34" />
```

### 自定义颜色 {#demo-color}

`active-color` 为打开时轨道背景色，`inactive-color` 为关闭时轨道背景色：

```vue
<m-switch v-model:value="checked" active-color="#ee0a24" inactive-color="#dcdee0" />
```

### 不同状态的值 {#demo-value}

通过 `checked-value` / `unchecked-value` 使用字符串或数字作为开关值：

```vue
<m-switch v-model:value="status" checked-value="run" unchecked-value="stop" />
<m-switch v-model:value="numberValue" :checked-value="1" :unchecked-value="0" />
```

### 带有文字 {#demo-text}

`checked-text` / `unchecked-text` 在滑块对侧居中显示；默认按文案宽度自适应轨道（`text-auto-width`），超长文案会完整展示：

```vue
<m-switch v-model:value="checked" checked-text="开" unchecked-text="关" />
<m-switch v-model:value="checked" checked-text="联锁使能（需班组长授权）" unchecked-text="联锁禁用" :size="30" />
<m-switch
	v-model:value="checked"
	checked-text="联锁使能（需班组长授权）"
	unchecked-text="联锁禁用"
	:size="30"
	:text-auto-width="false"
/>
```

### 插槽自定义 {#demo-slot}

`checked-text` / `unchecked-text` 插槽优先于同名属性；`node` 自定义滑块内容，`background` 自定义轨道内容：

```vue
<m-switch v-model:value="checked">
	<template #checked-text>
		<m-icon name="success" color="white" size="14" />
	</template>
	<template #unchecked-text>
		<m-icon name="cross" color="white" size="14" />
	</template>
</m-switch>

<m-switch v-model:value="checked">
	<template #node>
		<m-icon :name="checked ? 'success' : 'cross'" size="14" />
	</template>
</m-switch>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前值（v-model:value） | boolean \| string \| number | `false` |
| checked-value | 打开时对应的值 | boolean \| string \| number | `true` |
| unchecked-value | 关闭时对应的值 | boolean \| string \| number | `false` |
| active-color | 打开时轨道背景色（`''` 用主题变量） | string | `''` |
| inactive-color | 关闭时轨道背景色（`''` 用主题变量） | string | `''` |
| size | 滑块尺寸 px（`0` 用主题变量） | number | `0` |
| loading | 加载状态（不可点击） | boolean | `false` |
| disabled | 禁用 | boolean | `false` |
| readonly | 只读（外观正常、不可切换） | boolean | `false` |
| checked-text | 打开时轨道内文字 | string | `''` |
| unchecked-text | 关闭时轨道内文字 | string | `''` |
| text-auto-width | 文案自适应轨道宽度（有文案 / 文字插槽时生效） | boolean | `true` |
| before-update | 异步切换：返回 Promise，resolve 后切换，pending 显示 loading | `(value: boolean \| string \| number) => Promise<any>` | - |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 值变化（v-model:value） | value: boolean \| string \| number |
| change | 开关切换完成 | value: boolean \| string \| number |
| click | 点击开关（禁用 / 只读 / 加载中不触发） | event: MouseEvent |
| update:loading | 异步切换的 loading 变化 | loading: boolean |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| node | 自定义滑块内容 | - |
| background | 自定义轨道背景内容 | - |
| checked-text | 打开时轨道内容（优先于 checked-text 属性） | - |
| unchecked-text | 关闭时轨道内容（优先于 unchecked-text 属性） | - |

## 主题定制

开关样式可通过以下 SCSS 变量定制（在项目根 `uni.scss` 中直接定义即可覆盖默认值）：

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-switch-width | 轨道宽度 | 51px |
| $m-switch-height | 轨道高度 | 30px |
| $m-switch-node-size | 滑块尺寸（改尺寸需同步调整宽高） | 26px |
| $m-switch-node-background | 滑块底色 | #ffffff |
| $m-switch-node-shadow | 滑块阴影 | 0 3px 1px rgba(0,0,0,.05) |
| $m-switch-background | 关闭时轨道底色 | rgba(120,120,128,.16) |
| $m-switch-on-background | 打开时轨道底色 | 主题主色 |
| $m-switch-disabled-opacity | 禁用透明度 | 主题禁用透明度 |
| $m-switch-loading-opacity | 加载态透明度 | 0.6 |
| $m-switch-text-color | 轨道文字颜色 | #ffffff |
| $m-switch-text-font-size | 轨道文字字号 | 12px |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant / Sard 的差异

- **绑定语法**：统一 `v-model:value`
- **开关值**：Vant 的 `active-value` / `inactive-value` 命名为 `checked-value` / `unchecked-value`（对齐 Sard）
- **颜色**：统一 `active-color` / `inactive-color`（对齐 Vant）
- **异步切换**：提供 Sard 的 `before-update`（Promise，pending 自动 loading），并保留 Vant 的 `loading` 外部控制
- **文字**：提供 Sard 的 `checked-text` / `unchecked-text` 属性与插槽
- **插槽**：提供 Vant 的 `node` / `background`
- **未实现**：`validate-event`（表单校验由表单组件统一处理）

## 注意事项

- 值比较按 `toString()` 结果进行，避免 `boolean` / `string` / `number` 混合配置时的类型不一致
- `before-update` 的 Promise `resolve` 后应用新值，`reject` 保持原值；pending 期间派发 `update:loading(true/false)`
- 自定义 `size` 时轨道宽高按 `1.8 × size + 4` / `size + 4` 计算，主题变量仅用于默认尺寸
- 轨道文字显示在「轨道减去滑块」的剩余区域内，水平、垂直均居中
- 滑块位移按当前轨道宽度计算为像素值，切换时直接落位（不做位移动画）
- 文案默认自适应轨道宽度：按文案固有宽度测量后扩展轨道，保证文案尽量完整展示；`text-auto-width=false` 时保持默认宽度并按轨道裁剪
- 自适应宽度以默认轨道宽度为下限；测量依赖 `getBoundingClientRectAsync`，首次渲染可能有一帧落位过程
