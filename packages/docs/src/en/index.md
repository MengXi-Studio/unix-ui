---
layout: home

title: unix-ui
titleTemplate: UI components for uni-app x

hero:
  name: unix-ui
  text: Native UI components for uni-app x
  tagline: 65 components across 8 categories, ready via easycom with no registration; compile-time theming with zero runtime cost, one codebase for Web / App / Mini Programs
  image:
    src: /logo.svg
    alt: unix-ui
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/getting-started
    - theme: alt
      text: Browse Components
      link: /en/components/button
    - theme: alt
      text: GitHub
      link: https://github.com/MengXi-Studio/unix-ui

features:
  - icon: 🧩
    title: Zero-config easycom
    details: Follows the uni_modules component plugin spec — after importing from the plugin marketplace, use m-button directly in templates with no import or registration; npm installs need just one easycom rule
  - icon: 🎨
    title: Compile-time theming
    details: Every visual parameter is a $m-* SCSS variable with !default; define the same variable in the root uni.scss to override it globally, with zero runtime computation
  - icon: 📱
    title: One codebase, multi-platform
    details: Supports Web, App (Android / iOS / HarmonyOS) and Mini Programs, compatible with vapor mode; platform differences are isolated inside components via conditional compilation
  - icon: ⚡
    title: Built on native capabilities
    details: 0.5px hairlines use scale(0.5) transforms and loading animations run on UniElement.animate — no Web-only capability is required, so visuals stay consistent
  - icon: 💪
    title: Strongly typed UTS
    details: Props use type declarations with withDefaults, events are declared as named tuples, nullable values are always null — type errors are caught at compile time
  - icon: 🗓️
    title: A complete date & time family
    details: Date, date range, time, time range, lunar and generic pickers all ship as a panel / popup / input trio, plus a pure-function date toolset covering 1900–2100
---

## Get started in 30 seconds

```html
<!-- Use directly in templates — no import, no registration -->
<template>
	<m-button type="primary" size="large">Primary</m-button>
</template>
```

```scss
// Project-root uni.scss: define the same variable to re-theme globally (optional)
$m-color-primary: #10b981;
```

See [Installation](/en/guide/installation) and [Quick Start](/en/guide/getting-started) for the full steps.

## Categories

| Category | Representative components |
| --- | --- |
| Basic / Layout | Button, Icon, Image, Text / Compact, Grid, Space, Sticky, Waterfall |
| Data entry | Input, Checkbox, ColorPicker (each with popup and input variants) |
| Pickers | Generic wheel picker, Cascader (trio plus a toolbar-less view) |
| Date & time | Calendar, Date / DateRange, Time / TimeRange, Lunar picker, DateStrip (each with a trio) |
| Feedback / Display / Navigation | Popup, Overlay, Toast, Loading, Fab / Badge, Cell, Tabs |

The full list lives in the "Components" sidebar; see the [live demo](https://mengxi-studio.github.io/unix-ui/playground/) for behavior.

## Why unix-ui

- **No custom rendering stack**: only built-in uni-app x components and runtime capabilities, so HBuilderX upgrades never wait on an adapter layer
- **Low migration cost**: component taxonomy, prop names and visual specs follow mainstream uni-app libraries — no new mental model
- **Maintainable by design**: a single source of truth (`packages/core`) + a theme-variable contract + bilingual docs and per-component demos
