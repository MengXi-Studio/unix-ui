---
title: CascaderPopup
subtitle: Cascader Popup
demo: pages-sub/cascader-popup/cascader-popup
added: 0.3.0
---

## Introduction

Cascader popup component, composed of [Popup](/en/components/popup) (bottom popup) and [Cascader](/en/components/cascader) (cascader panel). It owns the popup container capabilities (visibility, position / radius / z-index); the cascader capabilities (options tree / field-names / swipe / slots) are fully forwarded.

After finishing the last level, `finish` fires and the popup closes automatically. For form-trigger scenarios use [CascaderInput](/en/components/cascader-input).

## Usage

### Basic {#demo-basic}

Control visibility via `v-model:show`; finishing the last level emits `finish` and closes automatically. Full popup lifecycle events (open / opened / close / closed / click-overlay) are available:

```vue
<m-button block @click="show = true">Open cascader</m-button>
<m-cascader-popup
	v-model:show="show"
	title="Select region"
	:options="options"
	@change="onChange"
	@finish="onFinish"
	@closed="onClosed"
/>
```

### Controlled value {#demo-controlled}

Control the selected value via `v-model:value` (leaf value): written back on both `change` and `finish`; after assigning externally, tabs and selection follow the controlled value (an internal guard prevents update loops on already-matched paths):

```vue
<m-cascader-popup v-model:show="show" v-model:value="value" :options="options" />
```

### Position / radius {#demo-shape}

Popup container props are forwarded to [Popup](/en/components/popup): `position`, `round`, `z-index`, `close-on-click-overlay`, `safe-area-inset-bottom`, etc.:

```vue
<m-cascader-popup
	v-model:show="show"
	position="bottom"
	:round="true"
	:options="options"
/>
```

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| show | Whether to show the popup (`v-model:show`) | boolean | `false` |
| value | Selected value (`v-model:value`; leaf value, `null` unselected) | CascaderValue \| null | `null` |
| options | Options tree (dynamic type) | UTSJSONObject[] \| null | `null` |
| title | Title | string | `''` |
| placeholder | Placeholder text of unselected tab | string | `请选择` |
| active-color | Theme color (selected text / check / tab underline) | string | `''` |
| closeable | Show header close icon | boolean | `true` |
| close-icon | Close icon name | IconName | `cross` |
| show-header | Show header | boolean | `true` |
| field-names | Custom option field names | CascaderFieldNames \| null | `null` |
| options-height | Options area height px (`0` uses theme variable) | number | `0` |
| swipeable | Enable swipe gesture level switching | boolean | `true` |
| position | Popup position: `top` `bottom` `left` `right` `center` (forwarded to m-popup) | CascaderPopupPosition | `bottom` |
| round | Popup radius (forwarded to m-popup) | boolean | `true` |
| close-on-click-overlay | Close on overlay click (forwarded to m-popup) | boolean | `true` |
| safe-area-inset-top | Top safe area (forwarded to m-popup) | boolean | `false` |
| safe-area-inset-bottom | Bottom safe area (forwarded to m-popup) | boolean | `true` |
| z-index | z-index (forwarded to m-popup) | number | `1` |
| duration | Animation duration in seconds (forwarded to m-popup) | number | `0.3` |
| custom-class | Custom cascader panel root class | string.ClassString | - |
| custom-style | Custom cascader panel root inline style | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:show | Popup visibility changed (`v-model:show`) | value: boolean |
| update:value | Selected value changed (`v-model:value`; emitted on both change and finish) | value: CascaderValue |
| change | Clicked an option (including intermediate levels) | event: CascaderChangeEvent |
| finish | Finished the last level (popup closes automatically) | event: CascaderChangeEvent |
| click-tab | Clicked a tab | tabIndex: number, title: string |
| open | Popup starts opening | - |
| opened | Popup open animation finished | - |
| close | Popup starts closing | - |
| closed | Popup close animation finished | - |
| click-overlay | Clicked the overlay | event: MouseEvent |

### Slots

The four cascader slots are conditionally forwarded (only override the panel default rendering when provided by the business):

| Name | Description |
| --- | --- |
| title | Title |
| option | Option row content (scope: `option`, `selected`) |
| options-top | Above options area (scope: `tabIndex`) |
| options-bottom | Below options area (scope: `tabIndex`) |

## Differences from Vant

- Vant switches popup/inline forms via the `poppable` prop; this project extracts an independent composite component — popup behavior belongs to [Popup](/en/components/popup), cascader behavior belongs to [Cascader](/en/components/cascader), this component only composes and forwards
- The popup closes automatically after `finish`: Vant does not auto-close on completion; this project follows the m-calendar-popup "auto close on confirm" family precedent
- The header close icon uniformly closes via `update:show(false)`; the `close` event is emitted by the popup closing process (same path as overlay close, no duplicate emission)
