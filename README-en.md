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

[![license](https://img.shields.io/github/license/MengXi-Studio/unix-ui.svg)](./LICENSE) [![npm](https://img.shields.io/npm/v/@meng-xi/unix-ui?color=blue)](https://www.npmjs.com/package/@meng-xi/unix-ui) ![npm](https://img.shields.io/npm/dt/@meng-xi/unix-ui?color=green)

[Docs](https://mengxi-studio.github.io/unix-ui/en/) · [Live Demo](https://mengxi-studio.github.io/unix-ui/playground/) · [Changelog](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md) · [Playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground)
</div>

## Table of Contents

- [Why unix-ui](#why-unix-ui)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Components](#components)
- [Platform Compatibility](#platform-compatibility)
- [Live Demo](#live-demo)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Documentation](#documentation)
- [Community & Support](#community--support)

## Why unix-ui

Building UI with raw uni-app x `view` / `text` elements means hand-writing every interaction detail — button pressed states and loading indicators, 0.5px hairline borders, single- / multi-line text ellipsis, badge truncation and offsets — and then re-tuning styles per platform for App / Web / mini-programs. unix-ui converges all of this into a set of ready-to-use components:

- **Familiar with mainstream uni-app component libraries?** Component taxonomy, prop naming and visual specs follow mainstream conventions — zero mental remapping, pick it up at a glance;
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

## Requirements

- HBuilderX `5.08` or above (uni-app x compiler)
- Optional: Node.js + pnpm (for the npm install method or contributing to this repository)
- Style isolation strategy 2.0 recommended; vapor mode compilation supported — see [Platform Compatibility](#platform-compatibility)

## Installation

### Option 1: uni_modules (recommended)

Place the library into your project's `uni_modules/m-ui-x/` directory (via the plugin marketplace or manual copy). easycom picks it up automatically — **no configuration required**:

```
uni_modules/m-ui-x/
├── components/
├── utils/
└── theme/
```

> The plugin id is `m-ui-x`; the directory name must match, otherwise easycom cannot resolve the components.

### Option 2: npm

```bash
pnpm add @meng-xi/unix-ui
```

Then sync the package contents into your project's `uni_modules/m-ui-x/` (the compiler does not scan node_modules):

```bash
mkdir -p uni_modules && cp -R node_modules/@meng-xi/unix-ui uni_modules/m-ui-x
```

Alternatively, configure an easycom rule in `pages.json` pointing to the package path — see the [installation guide](https://mengxi-studio.github.io/unix-ui/en/guide/installation.html).

### Verify the Installation

Use a component directly in any page template, no import or registration:

```html
<template>
  <m-button type="primary">Installed</m-button>
</template>
```

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

For all available variables see [theme/vars.scss](./packages/core/theme/vars.scss), named as `$m-<component>-<property>`; for the mechanism see [Theming](https://mengxi-studio.github.io/unix-ui/en/guide/theming.html).

## Components

46 components in total (including sub-components), organized into 6 categories that mirror the documentation sidebar. Each row lists the tag and its core capabilities; see the [component reference](https://mengxi-studio.github.io/unix-ui/en/components/button.html) for full APIs.

### Basic Components

| Component | Description |
| --- | --- |
| `m-button` | Button: semantic type, plain / disabled / loading, four sizes, block, hairline borders, pressed feedback |
| `m-icon` | Icon: 257 built-in font icons (ttf bundled), color and size, custom icon slot |
| `m-image` | Image: pass-through mode, loading / error placeholders, fade-in transition, circle, lazy loading, tap-to-preview |
| `m-text` | Text: semantic / custom color modes, three font sizes, single-line ellipsis, multi-line clamp, selectable |

### Layout Components

| Component | Description |
| --- | --- |
| `m-compact` | Compact layout: joined corners and merged borders for wrapped buttons / inputs, block / direction, auto re-flow on dynamic add / remove |
| `m-divider` | Divider: horizontal / vertical, dashed, hairline 0.5px line, content position |
| `m-flex` / `m-flex-item` | Flex layout: direction, three preset and custom spacing, main / cross axis alignment, wrapping, flex shorthand |
| `m-grid` / `m-grid-item` | Grid cells: custom columns, square cells, gutter, full borders, badge integration, in-app page navigation |
| `m-row` / `m-col` | 24-column grid: gutter, alignment, wrapping, span and offset |
| `m-space` / `m-space-item` | Spacing: direction / wrap / alignment, single or dual (row / column) size |
| `m-status-bar` | Status bar placeholder: reserves the system status bar height for top-aligned elements, custom height and background |
| `m-sticky` / `m-sticky-box` | Sticky layout: stick to top / bottom, container bounds constraint, stick-state events |
| `m-waterfall` / `m-waterfall-item` / `m-waterfall-load` | Waterfall: multi-column layout by actual content height, columns and gutter, known-size placeholders, dynamic add / remove and re-layout |

### Form Components

| Component | Description |
| --- | --- |
| `m-calendar` | Calendar panel: single / multiple / range selection, year-month switching navigation, formatter, over-limit feedback |
| `m-calendar-popup` | Calendar popup: m-popup + m-calendar, closes on confirm, position / round corners / panel height / safe area |
| `m-calendar-input` | Calendar input: read-only trigger + popup picking, formatted echo, clearable and disabled |
| `m-cascader` | Cascader: multi-level linkage, level tabs and swipe gestures, field-names mapping, async loading, four slots |
| `m-cascader-popup` | Cascader popup: m-popup + m-cascader, closes automatically after picking the last level |
| `m-cascader-input` | Cascader input: read-only trigger + popup picking, selected path echo, clearable and disabled |
| `m-checkbox` / `m-checkbox-group` | Checkbox: group container + standalone item, shape / color / size customization, max limit, indeterminate state |
| `m-checkbox-popup` | Checkbox popup: bottom-sheet multi-select, options array driven, field-names mapping, footer slot |
| `m-checkbox-input` | Checkbox input: read-only trigger + popup multi-select, "、" joined echo, truncation over 2 items, custom clear button |
| `m-color-picker` | Color picker: saturation-value panel + hue / alpha sliders, hex / rgb / hsl output, presets, recent colors, Web eyedropper |
| `m-color-picker-popup` | Color picker popup: cancel / title / confirm header, commit on confirm, discard on cancel or overlay tap |
| `m-color-picker-input` | Color picker input: read-only trigger + color swatch preview + popup picking, optional label and clear |
| `m-date-strip` | Date strip: horizontal consecutive dates, single / multiple / range, value-format string binding, lunar text, filter and disabled dates, slot customization |
| `m-input` | Input: six types, clearable with trigger timing, formatter / precision / min-max clamping, password eye toggle, word limit, multiline auto-height, prepend / append slots |

### Feedback Components

| Component | Description |
| --- | --- |
| `m-fab` / `m-fab-item` | Floating action button: four-corner positioning, expandable action list, overlay and drag-to-snap, v-model:offset position control |
| `m-loading` | Loading: circular / spinner variants, custom color and size, with text, custom icon slot |
| `m-overlay` | Overlay: show-driven visibility, z-index / duration, embedded content, Web body scroll lock, foundation for popup-family components |
| `m-popup` | Popup: five positions, per-side round corners, closeable icon, overlay customization, before-close interception, v-model:show |
| `m-toast` | Toast: functional API (showToast family) + component mode, four types and three positions, overlay and click blocking |

### Data Display

| Component | Description |
| --- | --- |
| `m-badge` | Badge: number / text / dot, max truncation, semantic and custom colors, four-corner position and offset, standalone mode |
| `m-cell` / `m-cell-group` | Cell and group: title / value / label, icon, four-direction arrows, required asterisk, inset rounded-card grouping |

### Navigation Components

| Component | Description |
| --- | --- |
| `m-tabs` / `m-tab` | Tabs: line / card / pill styles, index and name mixed matching, horizontally scrollable bar, content transition and swipe switching, sticky, scrollspy, before-change interception |

> A date utility set also ships with the library (`utils/date.uts`, 69 pure functions covering comparison, arithmetic, week / month / year boundaries, formatting / parsing and lunar conversion) — see [Date tools](https://mengxi-studio.github.io/unix-ui/en/tools/date.html).

## Platform Compatibility

| Platform | Status | Notes |
| --- | --- | --- |
| Web | ✅ Verified | Compiled and run with HBuilderX; rendering / events / theme override matrix and per-component scenarios verified in the browser |
| App-Android | ✅ Cloud build verified | Both vapor and vdom modes compile and package via cloud build; a demo APK ships with every release |
| App-iOS | 🔧 Adapted | Conditional compilation in place; on-device testing pending (requires macOS) |
| App-HarmonyOS | 🔧 Adapted | Conditional compilation in place; testing pending (requires DevEco Studio) |
| WeChat Mini Program | 🔧 Baseline verified | Baseline issues (overlay visibility / popup layers / font loading) fixed through testing; new components are verified release by release |
| Other Mini Programs | 🔧 Adapted | Conditional compilation in place; testing pending in developer tools |

Full details (HBuilderX version requirements, vapor mode configuration, platform differences) — see [Platform Compatibility](https://mengxi-studio.github.io/unix-ui/en/guide/compatibility.html).

## Live Demo

The example project [packages/playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground) provides one page per component exhaustively covering all props / variants / events, deployed as a [live demo](https://mengxi-studio.github.io/unix-ui/playground/) on the documentation site — try it right in your browser.

**Try it on a real Android device**: [download the demo app (APK)](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1794590278532-__UNI__F1AA560_1794590268233.apk) — a cloud-packaged Android build showcasing native rendering of all components. The package is rebuilt with each release; use the link in the latest release notes.

## Project Structure

```
unix-ui/
├── packages/
│   ├── core/            # Component source (single source of truth, published as @meng-xi/unix-ui)
│   │   ├── components/  # m-* component directories
│   │   ├── utils/       # Shared utilities (date toolset, etc.)
│   │   └── theme/       # vars.scss theme variables
│   ├── playground/      # Demo project (uni_modules/m-ui-x is a sync artifact)
│   └── docs/            # VitePress bilingual documentation site
├── scripts/             # Engineering scripts such as sync-uni-modules.mjs
└── versions/            # Per-release notes
```

## Local Development

```bash
pnpm install
pnpm sync:uni-modules        # core → playground/uni_modules/m-ui-x
pnpm sync:uni-modules:check  # verify sync artifacts are consistent
pnpm dev:docs                # start the docs site
pnpm build:docs              # build the docs site (with dead-link checks)
```

- Only edit `packages/core`; everything under `packages/playground/uni_modules/m-ui-x/` (`components` / `utils` / `theme`) is a sync artifact and would be overwritten on the next sync.
- Run the demo project by opening `packages/playground` in HBuilderX. New components follow the order: component → theme → sync → demo → docs.
- Contributions via [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / [Pull Requests](https://github.com/MengXi-Studio/unix-ui/pulls) are welcome.

## Documentation

📖 Full documentation from getting started to mastery (guides + component reference + changelog, bilingual):

**[https://mengxi-studio.github.io/unix-ui/en/](https://mengxi-studio.github.io/unix-ui/en/)**

Suggested reading: start with [Introduction](https://mengxi-studio.github.io/unix-ui/en/guide/introduction.html) and [Quick Start](https://mengxi-studio.github.io/unix-ui/en/guide/getting-started.html), then read [Theming](https://mengxi-studio.github.io/unix-ui/en/guide/theming.html) to master the override mechanism; for component details see the [component reference](https://mengxi-studio.github.io/unix-ui/en/components/button.html).

## Community & Support

Want to learn the design ideas and implementation details (compile-time theme variable injection, cross-platform hairline technique, UTS component development, etc.)? Follow our WeChat Official Account「**梦曦工作室** (MengXi Studio)」— QR code above.

- 🐛 [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / 💬 [Discussions](https://github.com/MengXi-Studio/unix-ui/discussions)
- 📝 [Changelog](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md)

## License

[MIT](./LICENSE)
