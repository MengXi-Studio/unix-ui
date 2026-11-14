# Introduction

**unix-ui** (`@meng-xi/unix-ui`) is a UI component library for [uni-app x](https://doc.dcloud.net.cn/uni-app-x/), written in UTS + uvue: one codebase is compiled by the uni-app x toolchain into Web (JS), Android (Kotlin), iOS (Swift) and mini-program code. Components rely only on built-in components and runtime capabilities — no custom rendering stack.

It currently ships **46 components** (including sub-components) across six categories — basic, layout, form, feedback, data display and navigation — plus a date toolset of 69 pure functions.

## Why unix-ui

Building UI with raw `view` / `text` elements costs time on the same three things over and over:

- **Interaction details must be hand-written**: button pressed states and loading indicators, 0.5px hairline borders, single- / multi-line text ellipsis, badge truncation and offsets;
- **Platform differences must be tuned per platform**: the same style behaves differently on App, Web and mini-programs, so hairline borders and scroll containers need platform-by-platform debugging;
- **Theming is hard to land**: runtime theming adds overhead, while page-level overrides tend to scatter across the codebase.

unix-ui turns this repetitive work into reusable components and a compile-time theming mechanism. Its component taxonomy, prop naming and visual specs follow the conventions of mainstream uni-app component libraries, so migration requires no new mental model.

## Features

- **easycom auto import**: follows the [uni_modules component plugin spec](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html); components require no import or registration
- **Built-in default theme**: components ship with a default theme that works out of the box; override it by defining variables in `uni.scss` — see [Theming](/en/guide/theming)
- **Multi-platform**: App (Android / iOS / HarmonyOS), Web and Mini Programs, compatible with [vapor mode](/en/guide/compatibility#vapor-mode)
- **Native rendering**: details like 0.5px hairline borders and loading animations are built on native capabilities for consistent visuals across platforms
- **Strongly typed UTS**: fully static Props / Events, errors caught at compile time
- **No global side effects**: component styles are self-contained and only reference the in-package `vars.scss`

## Design Conventions

Components stay within the capabilities of uni-app x and follow these conventions:

- **Text styles only on `<text>`** (ucss does not inherit text styles); no pseudo-elements and no `@keyframes` — animations use `UniElement.animate`
- **Flex-only layout**, avoiding positioning and scrolling features that differ between platforms; 0.5px hairline borders always use an absolutely positioned node with `transform: scale(0.5)`
- **Strongly typed API**: all props / events are typed in UTS; nullable values are expressed with `null`
- **Compile-time theming**: every visual parameter is a `$m-*` SCSS variable (all `!default`), with zero runtime overhead

## Component Categories

| Category | Components |
| --- | --- |
| Basic | Button, Icon, Image, Text |
| Layout | Compact, Divider, Flex, Grid, Layout, Space, StatusBar, Sticky, Waterfall |
| Form | Calendar, Cascader, Checkbox, ColorPicker, DateStrip, Input; Calendar / Cascader / Checkbox / ColorPicker also provide popup and input variants |
| Feedback | Fab, Loading, Overlay, Popup, Toast |
| Data Display | Badge, Cell and CellGroup |
| Navigation | Tabs |

See the "Components" sidebar for the full list and APIs; to see them in action, visit the [live demo](https://mengxi-studio.github.io/unix-ui/playground/).

## Distribution

| Channel | Notes |
| --- | --- |
| uni_modules plugin | Plugin id `m-ui-x`; import it from the plugin marketplace and easycom works with zero configuration |
| npm package | `@meng-xi/unix-ui`; requires an easycom rule, see [Installation](/en/guide/installation) |
| Source | [GitHub repository](https://github.com/MengXi-Studio/unix-ui), MIT licensed |

## Learning Path

| Stage | Content |
| --- | --- |
| Getting started | [Installation](/en/guide/installation) → [Quick Start](/en/guide/getting-started) |
| Fundamentals | [Theming](/en/guide/theming) |
| Advanced | [Compatibility](/en/guide/compatibility) → [FAQ](/en/guide/faq) |
| Reference | [Button](/en/components/button) → [Date tools](/en/tools/date) → [Changelog](/en/changelog) |

## Next Steps

- [Installation](/en/guide/installation): add the library to your uni-app x project
- [Quick Start](/en/guide/getting-started): start with your first component
