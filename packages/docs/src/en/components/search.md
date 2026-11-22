---
title: Search
subtitle: 搜索
demo: pages-sub/form/search/search
added: 0.7.0
---

## Introduction

A search input for search scenarios. It combines a search-box shell (background / radius / error border) with the `m-input` input body, supporting a rounded shape, left label and icon, a right button, clearing, keyboard search and error hints.

## Demos

### Basic usage {#demo-basic}

Bind the input value with `v-model:value`:

```vue
<m-search v-model:value="value" />
```

```uts
const value = ref<string>('')
```

### Keyboard search {#demo-search}

Tap the keyboard search key (`confirm-type="search"`) to emit `search`:

```vue
<m-search v-model:value="value" confirm-type="search" @search="onSearch" />
```

### Cancel button {#demo-cancel}

`show-action` shows the right button (default text `取消`); tapping it emits `cancel` and **does not clear the input**:

```vue
<m-search v-model:value="value" show-action @cancel="value = ''" />
```

### Search button {#demo-action-search}

With `action-type="search"` the right button emits `search`:

```vue
<m-search v-model:value="value" show-action action-text="搜索" action-type="search" @search="onSearch" />
```

### Custom button {#demo-action-slot}

The `action` slot replaces the right content; the component then stops emitting `cancel` / `search` automatically:

```vue
<m-search v-model:value="value" show-action>
	<template #action>
		<view @click="onCustomSearch"><text>查询</text></view>
	</template>
</m-search>
```

### Shape and background {#demo-shape}

`shape="round"` renders a rounded input area; `background` sets the outer background and `input-background` the input area background:

```vue
<m-search v-model:value="value" shape="round" background="#4fc08d" input-background="#ffffff" />
```

### Content alignment {#demo-align}

```vue
<m-search v-model:value="value" input-align="center" />
<m-search v-model:value="value" input-align="right" />
```

### Left text and icon {#demo-label}

`label` renders the left text inside the box, `left-icon` replaces the inner left icon (default `search`):

```vue
<m-search v-model:value="value" label="地址" left-icon="location" />
```

### Right icon {#demo-right-icon}

`right-icon` renders the inner right icon and emits `click-right-icon` when tapped:

```vue
<m-search v-model:value="value" right-icon="camera" @click-right-icon="onClickRightIcon" />
```

### Readonly and disabled {#demo-disabled}

```vue
<m-search value="机加工一线" readonly />
<m-search value="机加工一线" disabled />
```

### Error hint {#demo-error}

`error` turns the input border red, `error-message` renders the hint below:

```vue
<m-search v-model:value="value" error error-message="请输入 2-20 个字符的关键词" />
```

### Outer slots {#demo-outer-slot}

The `left` / `action` slots sit outside the search box:

```vue
<m-search v-model:value="value" show-action>
	<template #left>
		<m-icon name="arrow-left" />
	</template>
</m-search>
```

### Instance methods {#demo-methods}

```uts
const searchRef = ref<ComponentPublicInstance | null>(null)
searchRef.value?.$callMethod('focus')
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | Input value (v-model:value) | string | `''` |
| label | Left text inside the box | string | `''` |
| shape | Box shape, one of `square` `round` | string | `square` |
| background | Outer background color | string | theme `#f2f2f2` |
| input-background | Input area background color | string | theme (white) |
| placeholder | Placeholder text | string | `请输入搜索关键词` |
| maxlength | Maximum length, -1 for unlimited | number | `-1` |
| clearable | Whether the clear icon is enabled | boolean | `true` |
| clear-trigger | When the clear icon shows, one of `focus` `always` | string | `focus` |
| autofocus | Focus on mount | boolean | `false` |
| show-action | Whether to show the right button | boolean | `false` |
| action-text | Right button text | string | `取消` |
| action-type | Right button semantics, one of `cancel` `search` | string | `cancel` |
| left-icon | Inner left icon (m-icon glyph name) | string | `search` |
| right-icon | Inner right icon, empty string hides it | string | `''` |
| input-align | Text alignment, one of `left` `center` `right` | string | `left` |
| disabled | Whether disabled | boolean | `false` |
| readonly | Whether readonly | boolean | `false` |
| error | Error state (red input border) | boolean | `false` |
| error-message | Error hint text, hidden when empty | string | `''` |
| formatter | Value formatter (passed to m-input) | (value: string) => string | - |
| custom-class / custom-style | Pass-through classes / styles on the root node | - | - |

### Events

| Event | Description | Parameters |
| --- | --- | --- |
| update:value | Input value changed (v-model:value) | value: string |
| change | Input value changed (emitted on every change) | value: string |
| search | Keyboard confirm key / right button with `action-type="search"` | value: string |
| cancel | Right button with `action-type="cancel"` | — |
| clear | The clear icon is tapped | — |
| focus / blur | Focused / blurred | event: UniEvent |
| click-input | The input area is clicked | event: MouseEvent |
| click-left-icon | The inner left icon is clicked | event: MouseEvent |
| click-right-icon | The inner right icon is clicked | event: MouseEvent |
| click | The component is clicked | event: MouseEvent |

### Slots

| Name | Position | Description |
| --- | --- | --- |
| left | Outside the box, left | Equivalent to Sard `prepend` |
| action | Outside the box, right | When provided, `cancel` / `search` are no longer emitted automatically |
| label | Inside the box, leftmost | Overrides the `label` text |
| left-icon | Inner left icon slot | Overrides `left-icon` |
| right-icon | Inner right icon slot | Overrides `right-icon` |

### Methods

| Method | Description | Parameters |
| --- | --- | --- |
| focus | Focus the input | — |
| blur | Blur the input | — |

## Theming

The search box can be customized with the following SCSS variables (define them directly in the project root `uni.scss` to override the defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-search-padding-y | Vertical padding of the search box | 10px |
| $m-search-padding-x | Horizontal padding of the search box | 12px |
| $m-search-background | Outer background color | #f2f2f2 |
| $m-search-field-height | Input area height | 34px |
| $m-search-field-padding | Input area horizontal padding | 0 8px |
| $m-search-field-background | Input area background | white |
| $m-search-field-radius | Square corner radius | $m-radius-md |
| $m-search-field-radius-round | Round corner radius | $m-radius-max |
| $m-search-label-gap | Gap between left text and icon | 4px |
| $m-search-label-color | Left text color | $m-text-color |
| $m-search-label-font-size | Left text size | 14px |
| $m-search-icon-color | Inner icon color | $m-text-color-fourth |
| $m-search-icon-size | Inner icon size | 16px |
| $m-search-icon-padding | Inner icon padding | 0 2px |
| $m-search-action-gap | Gap between the left slot and the box | 8px |
| $m-search-action-padding | Right button padding | 0 8px |
| $m-search-action-color | Right button text color | $m-text-color |
| $m-search-action-font-size | Right button text size | 14px |
| $m-search-error-color | Error hint and error border color | $m-color-danger |
| $m-search-error-font-size | Error hint size | 12px |
| $m-search-error-padding | Error hint padding | 0 12px 8px |

See [Theming](/en/guide/theming) for the full variable list and override instructions.

## Differences from Vant

- **Binding syntax**: Vant uses `v-model`; this project uses `v-model:value`
- **Right button**: Vant's button only emits `cancel`; this project uses `action-type` to switch between `cancel` / `search` on a single button
- **Cancel behavior**: neither clears the input (Sard does; not adopted here)
- **Input background**: an extra `input-background` prop (aligned with Sard); text color is themed via variables
- **`change` semantics**: emitted on every change (like Sard), not on blur like `m-input`
- **Implementation**: composes `m-input` in inlaid mode, so input behaviors stay consistent

## Notes

- The component is controlled and holds no internal value; `cancel` does not clear it — set the value to `''` in `@cancel` if needed
- `change` and `update:value` share the same argument and timing, which suits live list filtering
- `maxlength` / `formatter` are forwarded to `m-input`; numeric-only capabilities (precision / min / max etc.) are not exposed
- When the `action` slot is provided, the right button no longer emits `cancel` / `search` automatically
