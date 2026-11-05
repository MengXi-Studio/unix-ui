---
title: CascaderInput
subtitle: Cascader Input
demo: pages-sub/cascader-input/cascader-input
added: 0.3.0
---

## Introduction

Cascader input component, composed of [Input](/en/components/input) (readonly trigger) and [CascaderPopup](/en/components/cascader-popup). Clicking the trigger opens the popup; finishing the last level writes the leaf value back via `v-model:value` and displays it; a self-drawn clear button appears when a value exists.

One-way controlled value: external `value` syncs the popup cascader selection, and `finish` writes back via `update:value`. The display text is derived by resolving the `value` path in the options tree (level texts joined with `/`, e.g. "Zhejiang/Hangzhou/Xihu"; falls back to the value string when not found). Unconfirmed selections are not written back.

## Usage

### Basic {#demo-basic}

After selection the path text "province/city/district" is displayed; `clearable` defaults to `true`, the clear button shows when a value exists (emitting `clear`):

```vue
<m-cascader-input
	v-model:value="value"
	title="Select region"
	:options="options"
	placeholder="Select region"
	@finish="onFinish"
	@clear="onClear"
/>
```

### Disabled and shapes {#demo-state}

`disabled` disables the trigger (no trigger layer, popup cannot open); `clearable=false` hides the clear button; `border=false` renders a borderless inlaid form (forwarded to m-input, composable with cells):

```vue
<m-cascader-input v-model:value="value" disabled />
<m-cascader-input v-model:value="value" :clearable="false" />
<m-cascader-input v-model:value="value" :border="false" />
```

### Popup shape and theme color {#demo-shape}

`title` customizes the popup title; `position` / `round` are forwarded to the popup container (same as [CascaderPopup](/en/components/cascader-popup#demo-shape)); `active-color` derives the selected theme color; `field-names` / `options-height` / `swipeable` are fully forwarded to the cascader panel.

```vue
<m-cascader-input
	v-model:value="value"
	:options="options"
	title="Select region"
	active-color="#07c160"
/>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| value | Selected value (`v-model:value`; leaf value, `null` unselected) | CascaderValue \| null | `null` |
| options | Options tree (dynamic type) | UTSJSONObject[] \| null | `null` |
| placeholder | Placeholder text | string | `请选择` |
| disabled | Whether disabled | boolean | `false` |
| clearable | Show clear button (visible when value exists and not disabled) | boolean | `true` |
| border | Trigger shows bordered container (forwarded to m-input) | boolean | `true` |
| inlaid | Trigger inlaid form (forwarded to m-input) | boolean | `false` |
| title | Popup title | string | `''` |
| active-color | Theme color (selected text / check / tab underline) | string | `''` |
| field-names | Custom option field names | CascaderFieldNames \| null | `null` |
| options-height | Options area height px (`0` uses theme variable) | number | `0` |
| swipeable | Enable swipe gesture level switching | boolean | `true` |
| position | Popup position (forwarded to m-popup) | CascaderPopupPosition | `bottom` |
| round | Popup radius (forwarded to m-popup) | boolean | `true` |
| custom-class | Custom root class | string.ClassString | - |
| custom-style | Custom root inline style | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Writes back the leaf value on finish; writes back `null` on clear | value: CascaderValue \| null |
| change | Clicked an option (forwarded from popup cascader) | event: CascaderChangeEvent |
| finish | Finished the last level (popup closes automatically) | event: CascaderChangeEvent |
| clear | Clicked the clear button | - |

## Theming

Trigger layer and clear button stacking / size variables (isomorphic with m-calendar-input):

| Variable | Description | Default |
| --- | --- | --- |
| $m-cascader-input-trigger-z-index | Transparent trigger layer z-index | 1 |
| $m-cascader-input-clear-z-index | Clear button z-index (above trigger) | 2 |
| $m-cascader-input-clear-width | Clear button hit-area width | 40px |
| $m-cascader-input-clear-icon-size | Clear icon size | 16px |
| $m-cascader-input-clear-color | Clear icon color | #c8c9cc |

Popup panel style variables see [Cascader Theming](/en/components/cascader#theming).

## Differences from Vant

- Vant has no standalone CascaderInput (Field + Cascader popup composition is left to the business); this project encapsulates it as a ready-made component following the family precedent (m-calendar-input)
- Display text is level texts joined with "/" (Vant Field display text is assembled by the business); when the value path cannot be found in the options tree, the value string is displayed as fallback (covering display-before-async-load scenarios)
- The clear button is self-drawn (m-input's built-in clearable icon sits under the transparent trigger layer and would be blocked), emitting `clear` and writing back `null`
