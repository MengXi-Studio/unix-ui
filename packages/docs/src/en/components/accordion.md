---
title: Accordion
subtitle: Accordion
demo: pages-sub/display/accordion/accordion
added: 0.8.0
---

## Introduction

Collapse content into expandable panels, allowing one or multiple panels to be open at the same time. Compose the container `m-accordion` with panels `m-accordion-item`; supports single / multiple expansion, per-item and global disabled, hidden borders, inset card style, height transition animation and instance methods.

> The value is always an array (`v-model:value`): when `multiple` is `false` the container keeps at most one item. Without `value` the container holds its own state (uncontrolled); once passed, the external value takes precedence.

## Examples

### Basic usage {#demo-basic}

```vue
<m-accordion v-model:value="active">
	<m-accordion-item title="Panel 1" name="1">Panel 1 content</m-accordion-item>
	<m-accordion-item title="Panel 2" name="2">Panel 2 content</m-accordion-item>
</m-accordion>
```

```uts
const active = ref<AccordionValueArray>(emptyAccordionValues())
```

### Multiple panels {#demo-multiple}

```vue
<m-accordion v-model:value="active" multiple>
	<m-accordion-item title="Panel A" name="a">Content A</m-accordion-item>
	<m-accordion-item title="Panel B" name="b">Content B</m-accordion-item>
</m-accordion>
```

### Uncontrolled usage {#demo-uncontrolled}

When `value` is omitted the container holds its own state, and `change` is still emitted:

```vue
<m-accordion @change="onChange">
	<m-accordion-item title="Panel 1">Content</m-accordion-item>
</m-accordion>
```

### Disabled {#demo-disabled}

```vue
<m-accordion v-model:value="active">
	<m-accordion-item title="Clickable" name="1">Content</m-accordion-item>
	<m-accordion-item title="Disabled item" name="2" disabled>Content</m-accordion-item>
</m-accordion>

<m-accordion v-model:value="active" disabled>
	<m-accordion-item title="Globally disabled" name="1">Content</m-accordion-item>
</m-accordion>
```

Item `disabled` and container `disabled` are combined with OR; disabled headers still emit `click` but do not toggle.

### Borders and inset card {#demo-style}

```vue
<m-accordion hide-border>...</m-accordion>
<m-accordion inset>...</m-accordion>
```

`hide-border` removes all dividers; `inset` adds margin and rounded corners, and the last item's divider is hidden automatically.

### Slots {#demo-slot}

```vue
<m-accordion v-model:value="active">
	<m-accordion-item name="1">
		<template #title>Custom title</template>
		<template #extra>Extra</template>
		Content
	</m-accordion-item>
	<m-accordion-item title="Scoped arrow" name="2">
		<template #arrow="{ visible }">
			<text>{{ visible ? '−' : '+' }}</text>
		</template>
		Content
	</m-accordion-item>
</m-accordion>
```

### Instance methods {#demo-method}

```uts
const accordionRef = ref<ComponentPublicInstance | null>(null)

function openFirst() {
	const inst = accordionRef.value
	if (inst != null) inst.$callMethod('open', '1')
}
```

### Lazy render {#demo-lazy}

`lazy-render` defaults to `true` (panel content renders on first expansion). Disable it to render content on mount:

```vue
<m-accordion :lazy-render="false">...</m-accordion>
```

## API

### Accordion Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| value | Expanded panel identifiers (v-model:value) | `AccordionValueArray` | `null` |
| multiple | Whether multiple panels can be expanded | boolean | `false` |
| disabled | Whether all panels are disabled | boolean | `false` |
| hide-border | Whether to hide dividers | boolean | `false` |
| inset | Whether to use the inset card style | boolean | `false` |
| duration | Expand / collapse duration in seconds (0 disables animation) | number | `0.3` |
| lazy-render | Whether to render content on first expansion only | boolean | `true` |
| custom-class / custom-style | Root style passthrough | - | - |

### Accordion Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:value | Expanded set changed (v-model:value) | value: `AccordionValueArray` |
| change | Expanded set changed (from interaction) | value: `AccordionValueArray`, name: `string \| number` |

### Accordion Methods

| Method | Description |
| --- | --- |
| open(name) | Expand the given panel |
| close(name) | Collapse the given panel |
| toggle(name) | Toggle the given panel |
| closeAll() | Collapse all panels |

### Accordion Slots

| Name | Description |
| --- | --- |
| default | Panel list (`m-accordion-item`) |

### AccordionItem Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| title | Panel title | string | `''` |
| extra | Extra text on the right of the title | string | `''` |
| name | Unique panel identifier (falls back to registration order) | string \| number | `null` |
| disabled | Whether this panel is disabled | boolean | `false` |
| custom-class / custom-style | Root style passthrough | - | - |

### AccordionItem Events

| Event | Description | Arguments |
| --- | --- | --- |
| click | Header click (including disabled state) | event: MouseEvent |

### AccordionItem Slots

| Name | Description | Scope |
| --- | --- | --- |
| default | Panel content | - |
| title | Custom title | - |
| extra | Custom extra area | - |
| arrow | Custom arrow | visible: boolean |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-accordion-background | Panel background | white |
| $m-accordion-border-color | Divider color | #ebedf0 |
| $m-accordion-header-padding-x | Header horizontal padding | 16px |
| $m-accordion-header-padding-y | Header vertical padding | 10px |
| $m-accordion-header-active-color | Header pressed background | #f2f3f5 |
| $m-accordion-title-font-size | Title font size | 14px |
| $m-accordion-title-color | Title color | primary text |
| $m-accordion-extra-font-size | Extra text font size | 12px |
| $m-accordion-extra-color | Extra text color | #969799 |
| $m-accordion-extra-margin | Gap between extra text and arrow | 8px |
| $m-accordion-arrow-color | Arrow color | #c8c9cc |
| $m-accordion-arrow-size | Arrow size | 16px |
| $m-accordion-body-padding-y | Body vertical padding | 16px |
| $m-accordion-body-padding-x | Body horizontal padding | 16px |
| $m-accordion-disabled-opacity | Disabled opacity | 0.5 |
| $m-accordion-inset-margin | Inset card margin | 12px |
| $m-accordion-inset-radius | Inset card radius | theme radius |
