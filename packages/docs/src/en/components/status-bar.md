---
title: StatusBar
demo: pages-sub/status-bar/status-bar
added: 0.3.0
---

## Introduction

The status bar placeholder reserves the system status bar height for top-anchored elements such as `Navbar` and `Notify`, preventing content from entering the status bar area.

Height resolution order: the `height` prop (used directly when greater than 0) → `uni.getWindowInfo().statusBarHeight` on the App platform. Web / Mini Program have no system status bar, so the value is 0 (no placeholder); pass `height` explicitly when a placeholder is needed.

## Examples

### Basic Usage {#demo-basic}

Without `height`, the system status bar height is read automatically (App only; 0 on Web / Mini Program).

```vue
<m-status-bar />
```

### Custom Height {#demo-height}

`height` is in px and takes precedence over the system height when greater than 0 — useful for Web simulation, embedded webviews or special device calibration.

```vue
<m-status-bar :height="24" custom-style="background-color: #e8f3ff" />
<m-status-bar :height="44" custom-style="background-color: #e8f3ff" />
```

### Background and Custom Styles {#demo-style}

Use `custom-style` or `custom-class` to set the background so it matches the navigation bar.

```vue
<m-status-bar :height="32" custom-style="background: linear-gradient(90deg, #1989fa, #39b54a);" />
<m-status-bar :height="32" custom-class="my-status-bar" />
```

### Combined with a Navbar {#demo-navbar}

Placing the status bar placeholder before the navigation content forms a complete top-anchored structure.

```vue
<view class="navbar">
	<m-status-bar custom-style="background-color: #ffffff" />
	<view class="navbar-body">
		<text class="navbar-title">Page Title</text>
	</view>
</view>
```

## API

### Props

| Attribute | Description | Type | Default |
| --- | --- | --- | --- |
| height | Status bar height in px; 0 reads the system status bar height automatically (App only; 0 on Web / Mini Program) | number | `0` |
| custom-class | Custom class name for the root node | string.ClassString | - |
| custom-style | Custom inline style for the root node (e.g. background color) | string | - |

### Events

None.

### Slots

None.

## Theming

This component has no dedicated `$m-*` theme variables (it is a pure height placeholder; colors are set via `custom-style` / `custom-class`). See [Theming](/en/guide/theming) for the full variable list and override approach.
