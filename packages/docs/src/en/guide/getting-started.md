# Quick Start

## Prerequisites

Complete the [Installation](/en/guide/installation) first (uni_modules or npm, either one).

## Using Components

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

## Common Examples

### Types and Sizes

```html
<m-button type="primary">Primary</m-button>
<m-button type="danger" size="large">Large Danger</m-button>
<m-button type="success" size="small">Small Success</m-button>
```

### States

```html
<!-- Loading: click is suppressed, the icon spins automatically -->
<m-button type="primary" loading loading-text="Submitting..." />

<!-- Disabled: click is suppressed -->
<m-button type="primary" disabled>Disabled</m-button>
```

### Dynamic Loading

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

See [Button](/en/components/button) for the full props and events.

## Next Steps

- [Theming](/en/guide/theming): override the default theme variables
- [Button](/en/components/button): all props and events
- [FAQ](/en/guide/faq): common compile and runtime issues
