---
title: StatusBar
demo: pages-sub/layouts/status-bar/status-bar
added: 0.3.0
---

## Introduction

The status bar placeholder reserves the system status bar height for top-anchored elements such as `Navbar` and `Notify`, preventing content from entering the status bar area.

Height resolution order: the `height` prop (used directly when greater than 0) → `uni.getWindowInfo().statusBarHeight`. The value is valid on App and WeChat Mini Program; H5 has no system status bar, so it is 0 (no placeholder) — pass `height` explicitly when a placeholder is needed. Reading the system height on WeChat Mini Program is fixed in `0.8.1`.

Content in the default slot fills the status bar area absolutely, which is useful for background layers or immersive hero images sharing the same gradient as the header below.

## Examples

### Basic Usage {#demo-basic}

Without `height`, the system status bar height is read automatically (valid on App / WeChat Mini Program; 0 on H5).

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

Set a background color with `background`, or use `custom-style` / `custom-class` for gradients and class-based styles so the status bar matches the navigation bar.

```vue
<m-status-bar :height="32" background="#1989fa" />
<m-status-bar :height="32" custom-style="background: linear-gradient(90deg, #1989fa, #39b54a);" />
<m-status-bar :height="32" custom-class="my-status-bar" />
```

### Default Slot {#demo-slot}

Slot content fills the status bar area absolutely and does not affect the height calculation. It is ideal for background layers or immersive hero images, so the status bar and the header below can share one gradient without duplicating style strings.

```vue
<view class="hero">
	<m-status-bar :height="24">
		<view class="hero-bg"></view>
	</m-status-bar>
	<view class="hero-body">
		<text class="hero-title">Immersive hero</text>
	</view>
</view>
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
| height | Status bar height in px; 0 reads the system status bar height automatically (valid on App / Mini Program; 0 on H5) | number | `0` |
| background <VersionBadge version="0.8.1" /> | Background color of the root node ('' leaves it unset; use custom-style for gradients) | string | - |
| custom-class | Custom class name for the root node | string.ClassString | - |
| custom-style | Custom inline style for the root node (e.g. background color) | string | - |

### Events

None.

### Slots

| Name | Description |
| --- | --- |
| default <VersionBadge version="0.8.1" /> | Content of the status bar area, filling it absolutely (background layer / immersive content); does not affect the height |

## Theming

This component has no dedicated `$m-*` theme variables (it is a pure height placeholder; colors are set via `custom-style` / `custom-class`). See [Theming](/en/guide/theming) for the full variable list and override approach.
