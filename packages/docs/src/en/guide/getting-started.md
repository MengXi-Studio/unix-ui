# Quick Start

## Prerequisites

Complete the [Installation](/en/guide/installation) first (uni_modules or npm, either one) and make sure `<m-button>` renders on a page.

## 1. Using Components

Components follow the easycom convention — use them directly in templates without import or registration:

```html
<template>
	<m-button type="primary" @click="onClick">Primary Button</m-button>
</template>

<script setup lang="uts">
	function onClick(event: MouseEvent) {
		console.log('clicked')
	}
</script>
```

## 2. Binding Props

Props are written like native attributes; boolean props can be written bare or bound with an expression via `:`:

```html
<!-- Types and sizes -->
<m-button type="primary">Primary</m-button>
<m-button type="danger" size="large">Large Danger</m-button>
<m-button type="success" size="small">Small Success</m-button>

<!-- Loading: click is suppressed, the icon spins automatically -->
<m-button type="primary" loading loading-text="Submitting..." />

<!-- Disabled: click is suppressed -->
<m-button type="primary" disabled>Disabled</m-button>
```

See the "Props" section of each component's documentation for the full list, e.g. [Button](/en/components/button).

## 3. Handling Events

Bind events with `@event-name` and type the handler parameters in UTS:

```html
<template>
	<m-button type="primary" :loading="loading" @click="submit">
		Submit
	</m-button>
</template>

<script setup lang="uts">
	const loading = ref(false)

	function submit() {
		loading.value = true
		// Simulate an async task
		setTimeout(() => {
			loading.value = false
		}, 2000)
	}
</script>
```

::: tip
A button in the `loading` or `disabled` state does not emit `click`, so no extra duplicate-submit guard is needed during async submissions.
:::

## 4. Two-way Binding

Form components use `v-model` for two-way binding:

```html
<template>
	<m-input v-model="value" :clearable="true" placeholder="Type something" />
</template>

<script setup lang="uts">
	const value = ref('')
</script>
```

## 5. Composing Components

Container components compose children through slots — for example, group cells with `m-cell-group`:

```html
<m-cell-group inset>
	<m-cell title="Cell" value="Value" is-link />
	<m-cell title="With icon" icon="setting" is-link />
</m-cell-group>
```

When buttons / inputs should sit flush against each other, wrap them in `m-compact` and corners and borders are merged automatically:

```html
<m-compact>
	<m-button type="primary">Confirm</m-button>
	<m-button type="primary">Cancel</m-button>
</m-compact>
```

## Next Steps

- [Theming](/en/guide/theming): override the default theme variables
- [Component reference](/en/components/button): all props and events
- [FAQ](/en/guide/faq): common compile and runtime issues
