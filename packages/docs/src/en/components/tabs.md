---
title: Tabs
subtitle: 标签页
demo: pages-sub/tabs/tabs
added: 0.4.0
---

## Introduction

Tabs component for switching content areas. Supports `line` / `card` / `pill` styles, mixed index / name matching, horizontal tab bar scrolling, underline and content transition animations, swipe gesture switching, sticky header (reuses [Sticky](/en/components/sticky)), scrollspy navigation and before-change interception.

The component has two forms:

- **Slot form** (primary): `m-tabs` container + `m-tab` children for content areas; titles are rendered by the container from children registration snapshots
- **Bar-only form**: pass `options` array to render the tab bar only (no content area), plug-and-play with `v-model:active`

## Usage

### Basic Usage {#demo-basic}

Bind index with `v-model:active`; `title` of `m-tab` is the tab title and its default slot is the content:

```vue
<m-tabs v-model:active="active">
	<m-tab title="Tab 1">Content 1</m-tab>
	<m-tab title="Tab 2">Content 2</m-tab>
	<m-tab title="Tab 3">Content 3</m-tab>
</m-tabs>
```

### Match by Name {#demo-name}

`active` accepts index or name (exact match by name type first, falls back to index with clamping):

```vue
<m-tabs v-model:active="activeName">
	<m-tab title="Group A" name="a">Content A</m-tab>
	<m-tab title="Group B" name="b">Content B</m-tab>
	<m-tab title="Group C" name="c">Content C</m-tab>
</m-tabs>
```

### Scrollable Tab Bar {#demo-scroll}

When tab count exceeds `swipe-threshold` (default 5), the tab bar scrolls horizontally and the active tab centers smoothly; below the threshold tabs share equal width:

```vue
<m-tabs :active="0" :swipe-threshold="5">
	<m-tab v-for="i in 10" :key="i" :title="'Tab ' + i">Content of tab {{ i }}</m-tab>
</m-tabs>
```

### Disabled Tab {#demo-disabled}

Disabled tabs do not switch on click while `click-tab` still emits:

```vue
<m-tabs :active="0">
	<m-tab title="Enabled">Content 1</m-tab>
	<m-tab title="Disabled" disabled>Unreachable</m-tab>
	<m-tab title="Enabled">Content 3</m-tab>
</m-tabs>
```

### Style {#demo-type}

`type="card"` for card style, `type="pill"` for pill style (shrink-to-fit widths, active item filled with theme color):

```vue
<m-tabs type="card" :active="0">
	<m-tab title="Card A">Content A</m-tab>
	<m-tab title="Card B">Content B</m-tab>
</m-tabs>
<m-tabs type="pill" :active="0" style="margin-top: 12px;">
	<m-tab title="Pill A">Content A</m-tab>
	<m-tab title="Pill B">Content B</m-tab>
</m-tabs>
```

### Custom Underline {#demo-line}

`color` derives the underline and active color; `line-width` / `line-height` customize the underline size (number gets px appended / string used as-is):

```vue
<m-tabs color="#ee0a24" :line-width="24" :active="0">
	<m-tab title="Red">Content 1</m-tab>
	<m-tab title="Theme">Content 2</m-tab>
</m-tabs>
```

### Content Animation and Swipe {#demo-animated}

`animated` enables the track translation transition; `swipeable` adds left-right swipe gesture switching (gesture switching does not trigger `before-change`):

```vue
<m-tabs animated :active="0">
	<m-tab title="Anim 1">Content 1</m-tab>
	<m-tab title="Anim 2">Content 2</m-tab>
</m-tabs>
<m-tabs swipeable animated :active="0" style="margin-top: 12px;">
	<m-tab title="Swipe 1">Content 1</m-tab>
	<m-tab title="Swipe 2">Content 2</m-tab>
</m-tabs>
```

### Title Badge and Slots {#demo-badge}

`m-tab` supports `dot` / `badge` / `show-zero-badge` (hide when 0, default `true`); `nav-left` / `nav-right` slots extend both ends of the tab bar:

```vue
<m-tabs :active="0">
	<m-tab title="Dot" dot>Content</m-tab>
	<m-tab title="Badge" badge="8">Content</m-tab>
</m-tabs>
<m-tabs :active="0" style="margin-top: 12px;">
	<template #nav-left><text>Left</text></template>
	<template #nav-right><text>Right</text></template>
	<m-tab title="Tab 1">Content 1</m-tab>
</m-tabs>
```

### Before Change {#demo-before-change}

`before-change` returning `false` blocks the switch (synchronous boolean version, aligned with `before-close` of `m-popup`):

```ts
/** Blocking example: tab at index 2 is rejected */
function onBeforeChange(name: string | number | null, index: number): boolean {
	return index != 2
}
```

```vue
<m-tabs :active="0" :before-change="onBeforeChange">
	<m-tab title="Allowed 1">Content 1</m-tab>
	<m-tab title="Blocked">Content 2</m-tab>
	<m-tab title="Allowed 3">Content 3</m-tab>
</m-tabs>
```

### Sticky {#demo-sticky}

`sticky` pins the tab bar (reuses m-sticky) and requires the page to pass back `scroll-top`; `offset-top` sets the pin distance:

```vue
<scroll-view scroll-y @scroll="(e: UniScrollEvent) => (scrollTop = e.detail.scrollTop)">
	<m-tabs sticky :scroll-top="scrollTop">
		<m-tab title="Sticky 1">Content 1</m-tab>
		<m-tab title="Sticky 2">Content 2</m-tab>
	</m-tabs>
</scroll-view>
```

### Scrollspy {#demo-scrollspy}

`scrollspy` enables scroll navigation: content lays out flat, scrolling activates the matching tab; clicking a tab activates it immediately then scrolls to the content block. Also relies on page-passed `scroll-top`:

```vue
<m-tabs scrollspy sticky :scroll-top="scrollTop" :active="0">
	<m-tab title="Block 1">Long content of block 1</m-tab>
	<m-tab title="Block 2">Long content of block 2</m-tab>
	<m-tab title="Block 3">Long content of block 3</m-tab>
</m-tabs>
```

Click-to-scroll supports both scroll contexts: the component looks up the first scrollable ancestor (embedded scroll-view) and translates it directly; when absent it falls back to `uni.pageScrollTo` page-level positioning (primary path on App page-level scrolling).

### Bar-Only Form {#demo-options}

Passing `options` array (`UTSJSONObject[]`) renders the tab bar only without content area; field names mapped via `field-names`:

```ts
const tabOptions: UTSJSONObject[] = [
	{ label: 'All', value: 0 },
	{ label: 'Ongoing', value: 1 },
	{ label: 'Cancelled', value: 3, disabled: true }
]
```

```vue
<m-tabs v-model:active="optActive" :options="tabOptions" />
```

## API

### TabsProps

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| active | Currently active tab (`v-model:active`; index or name: matched by name type first, falls back to index) | string \| number | `0` |
| type | Style: `line` underline / `card` / `pill` | TabsType | `line` |
| color | Theme color (line underline, card / pill active fill, active title color; empty string uses theme variables) | string | `''` |
| background | Tab bar background color (empty string uses theme variable) | string | `''` |
| duration | Underline and content transition duration in seconds (0 disables animation) | number | `0.3` |
| line-width | Underline width (number gets px appended / string as-is) | string \| number | `''` |
| line-height | Underline height (number gets px appended / string as-is) | string \| number | `''` |
| animated | Enable content transition animation (track mode) | boolean | `false` |
| border | Show tab bar outer border (line style only) | boolean | `false` |
| ellipsis | Ellipsize long titles (equal-width layout only) | boolean | `true` |
| sticky | Pin tab bar (reuses m-sticky, requires page-passed scroll-top) | boolean | `false` |
| shrink | Shrink-to-left layout (tabs no longer share equal width) | boolean | `false` |
| swipeable | Swipe gesture content switching (does not trigger before-change) | boolean | `false` |
| lazy-render | Lazy render (content renders on first activation) | boolean | `true` |
| scrollspy | Scroll navigation (flat content, scroll-driven activation; requires page-passed scroll-top) | boolean | `false` |
| show-header | Show tab bar | boolean | `true` |
| offset-top | Pin distance from scroll container top (px) | number | `0` |
| swipe-threshold | Scroll threshold: tab bar scrolls horizontally beyond this count | number | `5` |
| title-active-color | Active title color (empty string derives from theme variables) | string | `''` |
| title-inactive-color | Inactive title color (empty string uses theme variable) | string | `''` |
| before-change | Before-change interception callback (return false to block; not triggered by gesture) | TabsBeforeChange \| null | `null` |
| options | Options array (bar-only form: label / value / disabled / dot / badge, no content area) | UTSJSONObject[] \| null | `null` |
| field-names | Options field name mapping (null uses default) | TabsFieldNames \| null | `null` |
| scroll-top | Page scroll distance px (sticky and scrollspy rely on page / scroll container passing back) | number | `0` |
| custom-class | Root node custom class | string.ClassString | - |
| custom-style | Root node custom inline style | string | - |

### TabsFieldNames

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| label | Tab text field name | string | `label` |
| value | Tab value field name (used as name) | string | `value` |
| disabled | Disabled field name | string | `disabled` |
| dot | Dot field name | string | `dot` |
| badge | Badge field name | string | `badge` |

### TabProps (m-tab)

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Tab title text | string | `''` |
| name | Tab identifier (null matches by index) | string \| number \| null | `null` |
| disabled | Whether disabled | boolean | `false` |
| dot | Show red dot | boolean | `false` |
| badge | Badge content text | string | `''` |
| show-zero-badge | Show badge when 0 | boolean | `true` |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| update:active | Active tab changed (`v-model:active`; tab name, or index when name unset) | name: string \| number |
| change | Active tab changed (interaction paths only; not emitted by scrollspy scroll linkage or external binding) | name: string \| number \| null, index: number |
| click-tab | Tab clicked (including disabled) | event: TabsClickEvent |
| sticky-change | Sticky state changed (sticky mode, relayed from m-sticky) | isFixed: boolean |

### TabsClickEvent

| Field | Description | Type |
| --- | --- | --- |
| index | Registration order | number |
| name | Tab identifier (null when name unset) | string \| number \| null |
| title | Tab title text | string |
| disabled | Whether disabled | boolean |

### Methods

Call via component [ref](https://vuejs.org/guide/essentials/template-refs.html):

| Method | Description | Arguments | Returns |
| --- | --- | --- | --- |
| scrollTo | Scroll to the target tab (scrollspy mode) | target: string \| number (name or index) | - |

### Slots

| Name | Description |
| --- | --- |
| default | List of `m-tab` children (ignored in options form) |
| nav-left | Left extension of tab bar |
| nav-right | Right extension of tab bar |

## Theming

Tabs styles can be customized with the following SCSS variables (define them in root `uni.scss` to override defaults):

| Variable | Description | Default |
| --- | --- | --- |
| $m-tabs-background | Tabs background color | #ffffff |
| $m-tabs-tab-height | Tab height | 44px |
| $m-tabs-tab-font-size | Tab font size | 14px |
| $m-tabs-tab-color | Tab text color | #323233 |
| $m-tabs-tab-active-color | Active tab text color | #1989fa |
| $m-tabs-line-width | Underline width | 40px |
| $m-tabs-line-height | Underline height | 3px |
| $m-tabs-line-radius | Underline radius | 3px |
| $m-tabs-card-height | Card style tab height | 30px |
| $m-tabs-card-radius | Card style radius | 8px |
| $m-tabs-pill-height | Pill style tab height | 30px |
| $m-tabs-pill-radius | Pill style radius | 999px |
| $m-tabs-border-color | Tab bar outer border color | #ebedf0 |

See [Theming](/en/guide/theming) for the full variable list and usage.

## Differences from Vant

- Component split: Vant is a single component (Tab parsed by Tabs container); this project splits into `m-tabs` container + `m-tab` item. uni-app x has no VNode moving capability, so titles are rendered by the container from children registration snapshots — therefore **`title` slot and custom title styling are not supported** (content renders in the `m-tab` default slot)
- `options` array form is an extension of this project: bar-only without content area, `label / value / disabled / dot / badge` fields mapped via `field-names`
- `swipe-threshold` is an extension prop: Vant controls scroll layout via CSS variables; this project switches equal-width / scroll layout by tab count threshold
- `before-change` is a synchronous boolean version (aligned with `before-close` of `m-popup`); Vant supports async Promise interception
- Sticky and scrollspy rely on page-passed `scroll-top` (controlled protocol, aligned with m-sticky); Vant listens to page scrolling internally
- Swipeable switching is a self-orchestrated track translation + touch gesture (uni-app x cannot place children into swiper-item); gesture switching does not trigger `before-change`; real-device gesture experience should be verified on App
- Tab `render` custom render function is not supported (no VNode in UTS); `badge` is presented as text
