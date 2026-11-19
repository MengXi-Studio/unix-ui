# Quick Start

## Prerequisites

[Installation](/en/guide/installation) is done (either uni_modules or npm) and `<m-button>` renders in a page.

## 1. Use a component in a template

Components follow easycom — no import, no registration:

```html
<template>
	<m-button type="primary" @click="onClick">Primary</m-button>
</template>

<script setup lang="uts">
	function onClick(event: MouseEvent) {
		console.log('clicked')
	}
</script>
```

## 2. Props and events

Props work like native attributes; boolean props can be written bare or bound:

```html
<!-- Types and sizes -->
<m-button type="primary">Primary</m-button>
<m-button type="danger" size="large">Danger large</m-button>
<m-button type="success" size="small">Success small</m-button>

<!-- Loading: click suppressed, spinner rotates -->
<m-button type="primary" loading loading-text="Submitting..." />

<!-- Disabled: click suppressed -->
<m-button type="primary" disabled>Disabled</m-button>
```

While `loading` or `disabled`, `click` is not emitted, so async submissions need no extra duplicate-guard. Full props live under each component's "Props" section, e.g. [Button](/en/components/button).

## 3. Two-way binding

Form components use `v-model`, and the value type follows the component's semantics:

```html
<!-- String value -->
<m-input v-model="keyword" :clearable="true" placeholder="Keyword" />

<!-- Date value (Date | null) -->
<m-date-picker v-model:value="date" title="Pick a date" :min-date="minDate" :max-date="maxDate" />
```

```uts
const keyword = ref('')
const date = ref<Date | null>(null)
const minDate = new Date(2020, 0, 1)
const maxDate = new Date(2030, 11, 31)
```

| Component type | Value type | Examples |
| --- | --- | --- |
| Text | `string` | `m-input`, `m-search` |
| Picker | `string` / `number` (use `null` for empty) | `m-picker`, `m-radio-group`, `m-select`, `m-segmented` |
| Numeric | `number` | `m-rate` |
| Date | `Date \| null` | `m-date-picker`, `m-calendar` |
| Time | `'HH:mm'` / `'HH:mm:ss'` | `m-time-picker` |
| Multi-select | array | `m-checkbox-group`, `m-select` (`multiple`) |

## 4. Popup and input variants

For form fields, use the composed variants instead of wiring `popup` yourself:

```html
<m-date-picker-input
	v-model:value="birthday"
	title="Date of birth"
	placeholder="Select a date"
	:clearable="true"
/>
```

The trio always splits the same way: `m-date-picker` is the panel, `m-date-picker-popup` is the overlay, and `m-date-picker-input` is the form field. The same applies to time, date range, lunar and the generic picker.

## 5. Composing with slots

Container components compose children through slots, e.g. `m-cell-group`:

```html
<m-cell-group inset>
	<m-cell title="Cell" value="Value" is-link />
	<m-cell title="With icon" icon="setting" is-link />
</m-cell-group>
```

To join buttons / inputs tightly, wrap them in `m-compact` and radii and borders merge automatically:

```html
<m-compact>
	<m-button type="primary">Confirm</m-button>
	<m-button type="primary">Cancel</m-button>
</m-compact>
```

## 6. Theming

Re-theme globally by defining variables in the project-root `uni.scss` (see [Theming](/en/guide/theming)):

```scss
$m-color-primary: #10b981;
$m-button-normal-height: 48px;
```

For one-off tweaks prefer `custom-style` / `custom-class` over changing a global variable:

```html
<m-button type="primary" custom-style="margin-left: 12px;">Offset</m-button>
```

## 7. Common mistakes

| Symptom | Cause and fix |
| --- | --- |
| Tag not rendered | Directory is not `m-ui-x`, or the easycom rule is missing for npm — see [FAQ](/en/guide/faq#component-tag-not-rendered) |
| Theme variable has no effect | `vars.scss` was `@import`ed in `uni.scss` (define values instead), or the dev server was not restarted |
| Text styles look wrong on App | Put text styles on `<text>`, not on container `view`s |

## Next steps

- [Theming](/en/guide/theming): variable layers, precedence and pitfalls
- [Components](/en/components/button): props, events and slots of every component
- [FAQ](/en/guide/faq): common build and runtime issues
