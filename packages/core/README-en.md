[中文](./README.md) | **English**

<div align="center">
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="MengXi Studio Logo" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/logo.png">
  </a>
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="WeChat Official Account QR Code" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/QR_code.jpg">
  </a>

  <h1>@meng-xi/unix-ui</h1>
  <p>A full-featured UI component library for uni-app x (written in UTS + uvue, one codebase for all platforms)</p>

[![license](https://img.shields.io/github/license/MengXi-Studio/unix-ui.svg)](./license.md) [![npm](https://img.shields.io/npm/v/@meng-xi/unix-ui?color=blue)](https://www.npmjs.com/package/@meng-xi/unix-ui)
![npm](https://img.shields.io/npm/dt/@meng-xi/unix-ui?color=green)
</div>

## Why unix-ui

Building UI with raw uni-app x `view` / `text` elements means hand-writing every interaction detail — button pressed states and loading indicators, 0.5px hairline borders, single- / multi-line text ellipsis, badge truncation and offsets — and then re-tuning styles per platform for App / Web / mini-programs. unix-ui converges all of this into a set of ready-to-use components:

- **Familiar with mainstream uni-app component libraries?** Component taxonomy, prop naming and visual specs are fully aligned — zero mental remapping, pick it up at a glance;
- **Multi-platform release?** One UTS + uvue codebase compiles to App (Android / iOS / HarmonyOS), Web and mini-programs; platform quirks like hairline borders and scroll containers are handled deterministically inside the library;
- **Care about theming?** Every visual parameter is a `$m-*` SCSS variable injected at compile time — change one line in the root `uni.scss` and it applies across all components, with zero runtime overhead.

The library depends only on built-in uni-app x components and `UniElement.animate` — no custom rendering stack. UTS source is distributed directly (Web / mini-programs → JS, Android → Kotlin, iOS → Swift) and compiled on the fly by the uni-app x toolchain.

## Features

- **Zero-registration easycom** - Follows the uni_modules component plugin spec (plugin id: `m-ui-x`); use `<m-button>` directly, no imports or manual registration
- **All platforms, vapor-compatible** - One component codebase for App (Android / iOS / HarmonyOS), Web and mini-programs, compatible with vapor mode
- **Compile-time theming** - All visual parameters live in `theme/vars.scss` as `$m-*` variables (all `!default`); define the same variable in the root `uni.scss` to override, otherwise the default theme works with zero configuration
- **Cross-platform pixel details** - 0.5px hairline borders (transform scale technique) and pressed feedback are handled uniformly by the library
- **Composition API + strongly typed UTS** - Fully typed props and events for UTS / TS IntelliSense; animations use `UniElement.animate`, no `@keyframes` dependency
- **No global side effects** - Component styles are self-contained and only reference the in-package `vars.scss`; no global style injection

## Installation

**npm**——after installing, sync the package contents into your project's `uni_modules/m-ui-x/` (the compiler does not scan node_modules):

```bash
pnpm add @meng-xi/unix-ui
mkdir -p uni_modules && cp -R node_modules/@meng-xi/unix-ui uni_modules/m-ui-x
```

> `packages/core` is a standard **uni_modules component plugin** (plugin id: `m-ui-x`; the directory name must match), consumed via zero-config easycom. If you use a different directory name or reference node_modules directly, configure the easycom rule in `pages.json` yourself.

## Quick Start

### 1. Use components in templates

```html
<template>
	<m-button type="primary" @click="onClick">Primary Button</m-button>
</template>

<script setup lang="uts">
	const onClick = () => {
		uni.showToast({ title: 'Button clicked' })
	}
</script>
```

### 2. Theming (optional)

Define same-named variables directly in the root `uni.scss` to override defaults (stacked via `!default` at compile time, no imports needed):

```scss
/* Normal button height 44px → 48px */
$m-button-normal-height: 48px;
```

> Do NOT `@import` the in-package `vars.scss` from `uni.scss` — `uni.scss` is injected into every component's style, and importing the same file again triggers a sass circular-import error.

For all available variables see [theme/vars.scss](./theme/vars.scss), named as `$m-<component>-<property>`.

## Components

| Component | Description |
| --- | --- |
| m-button | Button: semantic type, plain / disabled / loading, four sizes, block, hairline borders, pressed feedback |
| m-cell / m-cell-group | Cell and group: title / value / label, icon, four-direction arrows, inset rounded-card grouping |
| m-row / m-col | Grid layout: gutter, alignment, wrapping |
| m-icon | Icon: 250+ common icons (ttf bundled), color and size, custom icon slot |
| m-image | Image: pass-through mode, loading / error placeholders, fade-in transition, circle, lazy loading |
| m-text | Text: semantic / custom color modes, three font sizes, single-line ellipsis, multi-line clamp, selectable |
| m-space | Spacing: direction / wrap / alignment, single or dual (row / column) size |
| m-loading | Loading: circular / spinner variants, custom color and size, with text |
| m-badge | Badge: number / dot, max truncation, semantic and custom colors, position offset, standalone mode |

## Live Demo

The example project [packages/playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground) (one page per component exhaustively covering all props / variants / events) is deployed as a [live demo](https://mengxi-studio.github.io/unix-ui/playground/) on the documentation site — try it right in your browser.

**Try it on a real Android device**: [Download the demo app (APK)](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1793059625238-__UNI__F1AA560_1793059613497.apk) — a cloud-packaged Android build showcasing native rendering of all components. The package is rebuilt with each release; use the link in the latest release notes.

## Community & Support

Want to learn the design ideas and implementation details (compile-time theme variable injection, cross-platform hairline technique, UTS component development, etc.)? Follow our WeChat Official Account「**梦曦工作室** (MengXi Studio)」:

<p align="center">
  <img alt="WeChat Official Account QR Code" width="180" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/QR_code.jpg">
</p>

- 🐛 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / 💬 [Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)

## Documentation

📖 Full documentation from getting started to mastery (guides + component reference + changelog, bilingual):

**[https://mengxi-studio.github.io/unix-ui/en/](https://mengxi-studio.github.io/unix-ui/en/)**

Suggested reading: start with [Introduction](https://mengxi-studio.github.io/unix-ui/en/guide/introduction.html) and [Quick Start](https://mengxi-studio.github.io/unix-ui/en/guide/getting-started.html), then read [Theming](https://mengxi-studio.github.io/unix-ui/en/guide/theming.html) to master the override mechanism; for component details see the [component reference](https://mengxi-studio.github.io/unix-ui/en/components/button.html).

## Changelog

📝 **[https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md)**

## License

[MIT](./license.md)
