---
title: Switch
subtitle: Switch
demo: pages-sub/form/switch/switch
added: 0.8.0
---

## Introduction

Toggle between an on and an off state. Supports custom switch values, track colors, sizes, readonly / disabled, loading, asynchronous switching, track text and thumb / background slots.

> The switch value supports `boolean | string | number`, configured with `checked-value` / `unchecked-value`; values are compared by their string form.

## Examples

### Basic usage {#demo-basic}

Bind the state with `v-model:value`; `true` means on and `false` means off:

```vue
<m-switch v-model:value="checked" @change="onChange" />
```

```uts
const checked = ref<boolean>(true)

function onChange(value: boolean | string | number) {
	console.log('switch change: ' + value.toString())
}
```

### Disabled and readonly {#demo-status}

`disabled` lowers the opacity and blocks clicks; `readonly` keeps the normal look but blocks toggling:

```vue
<m-switch :value="false" disabled />
<m-switch :value="true" disabled />
<m-switch :value="false" readonly />
<m-switch :value="true" readonly />
```

### Loading {#demo-loading}

`loading` controls the loading state externally; `before-update` returning a Promise enters loading automatically and switches after it resolves:

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

### Custom size {#demo-size}

`size` sets the thumb size in px; the track is calculated as `1.8 × size + 4px`:

```vue
<m-switch v-model:value="checked" :size="18" />
<m-switch v-model:value="checked" :size="34" />
```

### Custom colors {#demo-color}

`active-color` sets the track color when on, `inactive-color` when off:

```vue
<m-switch v-model:value="checked" active-color="#ee0a24" inactive-color="#dcdee0" />
```

### Custom values {#demo-value}

Use string or number values with `checked-value` / `unchecked-value`:

```vue
<m-switch v-model:value="status" checked-value="run" unchecked-value="stop" />
<m-switch v-model:value="numberValue" :checked-value="1" :unchecked-value="0" />
```

### With text {#demo-text}

`checked-text` / `unchecked-text` render centered on the opposite side of the thumb; the track auto-fits the text width by default (`text-auto-width`) so long text stays fully visible:

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

### Custom slots {#demo-slot}

The `checked-text` / `unchecked-text` slots take precedence over the same-name props; `node` customizes the thumb and `background` the track content:

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

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Current value (v-model:value) | boolean \| string \| number | `false` |
| checked-value | Value when on | boolean \| string \| number | `true` |
| unchecked-value | Value when off | boolean \| string \| number | `false` |
| active-color | Track color when on (`''` uses the theme value) | string | `''` |
| inactive-color | Track color when off (`''` uses the theme value) | string | `''` |
| size | Thumb size in px (`0` uses the theme value) | number | `0` |
| loading | Loading state (not clickable) | boolean | `false` |
| disabled | Disabled | boolean | `false` |
| readonly | Readonly (normal look, cannot toggle) | boolean | `false` |
| checked-text | Text shown in the track when on | string | `''` |
| unchecked-text | Text shown in the track when off | string | `''` |
| text-auto-width | Auto-fit the track width to the text (active when text or text slots exist) | boolean | `true` |
| before-update | Async switch: return a Promise; the value applies on resolve, loading is shown while pending | `(value: boolean \| string \| number) => Promise<any>` | - |
| custom-class / custom-style | Root style passthrough | - | - |

### Events

| Event | Description | Callback |
| --- | --- | --- |
| update:value | Value changed (v-model:value) | value: boolean \| string \| number |
| change | The switch has toggled | value: boolean \| string \| number |
| click | The switch was clicked (not emitted when disabled / readonly / loading) | event: MouseEvent |
| update:loading | Async loading state changed | loading: boolean |

### Slots

| Name | Description | Scope |
| --- | --- | --- |
| node | Custom thumb content | - |
| background | Custom track content | - |
| checked-text | Content shown when on (takes precedence over the prop) | - |
| unchecked-text | Content shown when off (takes precedence over the prop) | - |

## Theming

The switch can be styled with the following SCSS variables (define them in the project's root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-switch-width | Track width | 51px |
| $m-switch-height | Track height | 30px |
| $m-switch-node-size | Thumb size (adjust width/height together) | 26px |
| $m-switch-node-background | Thumb background | #ffffff |
| $m-switch-node-shadow | Thumb shadow | 0 3px 1px rgba(0,0,0,.05) |
| $m-switch-background | Track background when off | rgba(120,120,128,.16) |
| $m-switch-on-background | Track background when on | Primary color |
| $m-switch-disabled-opacity | Disabled opacity | Theme disabled opacity |
| $m-switch-loading-opacity | Loading opacity | 0.6 |
| $m-switch-text-color | Track text color | #ffffff |
| $m-switch-text-font-size | Track text font size | 12px |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Vant / Sard

- **Binding**: unified as `v-model:value`
- **Switch values**: Vant's `active-value` / `inactive-value` are named `checked-value` / `unchecked-value` (matching Sard)
- **Colors**: unified as `active-color` / `inactive-color` (matching Vant)
- **Async switching**: Sard's `before-update` (Promise, automatic loading while pending) plus Vant's external `loading`
- **Text**: Sard's `checked-text` / `unchecked-text` props and slots
- **Slots**: Vant's `node` / `background`
- **Not implemented**: `validate-event` (validation is handled by the form layer)

## Notes

- Values are compared by `toString()` so mixed `boolean` / `string` / `number` configurations behave consistently
- A `before-update` Promise applies the new value on `resolve` and keeps the old value on `reject`; `update:loading(true/false)` is emitted while pending
- With a custom `size`, the track is `1.8 × size + 4` wide and `size + 4` high; theme variables only cover the default size
- Track text is centered both horizontally and vertically in the area left by the thumb
- The thumb offset is calculated in pixels from the current track width and snaps into place when toggled (no movement animation)
- Text auto-fits the track width by default: the intrinsic text width is measured and the track expands so the text stays visible; with `text-auto-width=false` the track keeps its default width and clips the text
- Auto width never shrinks below the default track width; measurement uses `getBoundingClientRectAsync`, so the first render may take one frame to settle
