---
title: Input
subtitle: Input
demo: pages-sub/input/input
---

## Introduction

Text input field. Ships with a rounded bordered container and prepend / append slots, supporting six input types, a clear icon, a built-in eye toggle, formatter, numeric precision and range clamping, word limit, and auto-height textarea. It can join `m-compact` for compact layouts or be embedded in `m-cell` for form-item look.

Labels, required marks, validation and error messages belong to the form system and will be provided by a future `m-form-item`.

## Demo

### Basic Usage {#demo-basic}

`v-model` binds the value. The `input` event fires immediately; the `change` event only fires on blur when the value has changed (same semantics as the native change event).

```vue
<m-input v-model="value" placeholder="Please input" />
```

### Custom Type {#demo-type}

Set the type via `type`: `text` / `tel` / `digit` / `number` / `password` / `textarea`. The `password` type pairs with `show-eye` to render a built-in visibility toggle icon.

```vue
<m-input v-model="tel" type="tel" placeholder="Telephone" />
<m-input v-model="pwd" type="password" :show-eye="true" placeholder="Password" />
```

### Clearable {#demo-clearable}

With `clearable`, a clear icon appears when there is content. `clear-trigger` controls when it shows: `focus` (default, while focused) or `always`.

```vue
<m-input v-model="value" :clearable="true" placeholder="Clear on focus" />
<m-input v-model="value2" :clearable="true" clear-trigger="always" placeholder="Always show" />
```

### Readonly and Disabled {#demo-readonly}

`readonly` looks normal but is not editable; `disabled` additionally applies disabled background and text color.

```vue
<m-input v-model="value" :readonly="true" />
<m-input v-model="value2" :disabled="true" />
```

### Slots {#demo-slots}

The `prepend` slot is placed before the input area, the `append` slot after the icon area. Put `m-icon` for icons or `m-button` for actions.

```vue
<m-input v-model="phone" type="tel" placeholder="Mobile number">
	<template #prepend>
		<m-icon name="user-o" />
	</template>
	<template #append>
		<m-button size="small" type="primary">Send code</m-button>
	</template>
</m-input>
```

### Borderless {#demo-borderless}

Set `border=false` to remove the bordered container; background and radius can be freely customized via `custom-style`.

```vue
<m-input v-model="value" :border="false" placeholder="Borderless" custom-style="background-color: #f7f8fa; border-radius: 8px;" />
```

### Textarea {#demo-textarea}

`type="textarea"` switches to multi-line input. `auto-height` grows with content; the fixed height is controlled by the theme variable `$m-input-textarea-min-height`.

```vue
<m-input v-model="msg" type="textarea" placeholder="Message" />
<m-input v-model="msg2" type="textarea" :auto-height="true" placeholder="Auto height" />
```

### Word Limit {#demo-word-limit}

`show-word-limit` together with `maxlength` renders a character counter, for both single-line and textarea.

```vue
<m-input v-model="value" :maxlength="20" :show-word-limit="true" placeholder="Max 20 chars" />
```

### Formatter and Number Clamping {#demo-format}

Pass a formatting function via `formatter` and choose when it applies with `format-trigger`: `onChange` (default, on input) or `onBlur` (on blur). When `type` is `number` / `digit`, the value is truncated to `precision` decimals and clamped to `min` / `max` on blur (without interrupting the typing state).

```vue
<script setup lang="uts">
	/** Uppercase formatter (must be defined as an arrow function constant in script) */
	const upperFormatter = (value: string): string => {
		return value.toUpperCase()
	}
</script>

<template>
	<m-input v-model="upper" placeholder="Uppercase on input" :formatter="upperFormatter" />
	<m-input v-model="num" type="number" placeholder="0-100, 2 decimals" :precision="2" :min="0" :max="100" />
</template>
```

### Compact Layout {#demo-compact}

Put it in `m-compact` mixed with `m-button`: positions are mutually aware, adjacent corners join and borders merge into 1px; the vertical direction forms a login form look.

```vue
<m-compact block>
	<m-input v-model="keyword" placeholder="Search" />
	<m-button type="primary">Search</m-button>
</m-compact>
<m-compact direction="vertical" block>
	<m-input v-model="name" placeholder="Username" />
	<m-input v-model="pwd" type="password" placeholder="Password" />
</m-compact>
```

### Embedded in Cell {#demo-cell}

With `inlaid` removing the border and padding, embed it into `m-cell` for a form-item look.

```vue
<m-cell-group inset>
	<m-cell title="Consignee" required>
		<template #value>
			<m-input v-model="name" :inlaid="true" placeholder="Name" custom-style="flex: 1; text-align: left;" />
		</template>
	</m-cell>
</m-cell-group>
```

Note: the `value` area of `m-cell` is right-aligned by default; add `text-align: left` via `custom-style` to left-align the input text.

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| v-model | Input value, always string | string | `''` |
| type | Input type, one of `text` `tel` `digit` `number` `password` `textarea` | InputType | `text` |
| placeholder | Placeholder text | string | `''` |
| placeholder-style | Inline style of placeholder (native passthrough) | string | `''` |
| placeholder-class | Extra class of placeholder (appended after the built-in placeholder class) | string | `''` |
| maxlength | Max length, `-1` for unlimited | number | `-1` |
| show-word-limit | Show character counter, requires `maxlength > 0` | boolean | `false` |
| clearable | Whether to enable the clear icon | boolean | `false` |
| clear-trigger | When the clear icon shows, one of `focus` `always` | ClearTrigger | `focus` |
| border | Whether to show the bordered container | boolean | `true` |
| inlaid | Inlaid mode: removes border, radius, padding and background for embedding into m-cell etc. | boolean | `false` |
| disabled | Whether disabled | boolean | `false` |
| readonly | Whether readonly: looks normal but not editable (simulated via native disabled, cannot be focused) | boolean | `false` |
| confirm-type | Confirm key text, one of `done` `search` `send` `go` `next`, single-line only | string | `''` |
| auto-height | Auto height for textarea, only for `type=textarea` | boolean | `false` |
| formatter | Value formatter, applies at the moment set by `format-trigger` | (value: string) => string | `null` |
| format-trigger | When the formatter applies, one of `onChange` `onBlur` | FormatTrigger | `onChange` |
| precision | Decimal places: truncates on blur for `number` / `digit` | number | `null` |
| min | Numeric lower bound: clamps on blur | number | `null` |
| max | Numeric upper bound: clamps on blur | number | `null` |
| show-eye | Built-in visibility toggle icon, only for `type=password` (before the append slot) | boolean | `false` |
| custom-class | Custom class of the input container (border layer) | string | `''` |
| custom-style | Custom inline style of the input container (border layer) | string | `''` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:modelValue | Fires when the value changes (v-model) | value: string |
| input | Fires immediately on input | value: string |
| change | Fires on blur when the value has changed | value: string |
| focus | Fires when focused | event: UniEvent |
| blur | Fires when blurred | event: UniEvent |
| clear | Fires after tapping the clear icon | — |

### Slots

| Name | Description |
| --- | --- |
| prepend | Content before the input area (e.g. icons) |
| append | Content after the icon area (e.g. buttons) |

### Methods

Call via the component instance obtained from a template ref.

| Method | Description |
| --- | --- |
| focus | Focus the input |
| blur | Blur the input |

## Theming

The following SCSS variables are provided (all `!default`; disabled opacity reuses the global `$m-disabled-opacity`, border width reuses `$m-border-width`):

| Variable | Default | Description |
| --- | --- | --- |
| $m-input-font-size | 14px | Base font size of the control |
| $m-input-padding-y | 7px | Vertical padding of the container |
| $m-input-padding-x | 10px | Horizontal padding of the container |
| $m-input-gap | 6px | Gap between the control and prepend / append parts |
| $m-input-border-radius | $m-radius-md | Container radius |
| $m-input-border-color | #ebedf0 | Default border color |
| $m-input-border-color-focus | $m-color-primary | Focused border color |
| $m-input-bg | $m-white | Container background |
| $m-input-bg-disabled | #f7f8fa | Disabled background |
| $m-input-text-color | $m-text-color | Input text color |
| $m-input-text-color-disabled | $m-text-color-tertiary | Disabled text color |
| $m-input-placeholder-color | $m-text-color-fourth | Placeholder color |
| $m-input-clear-icon-size | 16px | Clear icon font size |
| $m-input-clear-color | $m-text-color-fourth | Clear icon color |
| $m-input-eye-icon-size | 16px | Eye toggle icon font size |
| $m-input-eye-color | $m-text-color-fourth | Eye toggle icon color |
| $m-input-count-font-size | 12px | Counter font size |
| $m-input-count-color | $m-text-color-tertiary | Counter color |
| $m-input-textarea-min-height | 60px | Base min-height of fixed-height textarea |

See [Theming](/en/guide/theming) for full variables and override instructions.

## Differences from Vant Field and Sard Input

- **Component shape**: modeled after Sard Input (bare input with bordered container + prepend / append slots); Vant Field's label / required mark / validation belong to the form system and will be provided by a future `m-form-item`; currently compose with `m-cell` + `inlaid` for a form-item look
- **Value type**: always `string` (narrowed from Sard's `string | number`; `.number` modifier is left to users)
- **Kept capabilities**: Vant's `formatter` / `format-trigger` / `min` / `max` / `show-word-limit` and Sard's `precision` / `show-eye` are all provided
- **HTML-only capabilities not provided**: `spellcheck` / `autocorrect` / `autocapitalize` / `autocomplete` / `inputmode` / `rows` etc. (no native counterpart in uni-app x); fixed textarea height is controlled by `$m-input-textarea-min-height`
- **readonly implementation**: uni-app x has no native readonly; simulated via native `disabled`, so a readonly input cannot be focused
- **Word limit position**: rendered below the input, right-aligned (Vant renders it inside the container at top-right)
- **Clear trigger naming**: follows Vant's `clear-trigger` (`focus` / `always`) instead of Sard's `show-clear-only-focus` boolean
