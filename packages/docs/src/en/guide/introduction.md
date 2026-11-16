# Introduction

**unix-ui** (`@meng-xi/unix-ui`) is a UI component library for [uni-app x](https://doc.dcloud.net.cn/uni-app-x/), written in UTS + uvue. One codebase is compiled by the uni-app x toolchain into Web (JS), Android (Kotlin), iOS (Swift) and mini-program code; components rely only on built-in components and runtime capabilities — no custom rendering stack.

It currently ships **65 components** (including sub-components, popup and input variants) organized into **8 categories**: basic, layout, data entry, pickers, date & time, feedback, data display and navigation — plus a pure-function date toolset covering 1900–2100.

## Why unix-ui

Building UI with raw `view` / `text` elements repeatedly costs time on three things:

| Pain point | What it looks like | How unix-ui helps |
| --- | --- | --- |
| Interaction details are hand-written | pressed states, loading, 0.5px hairlines, ellipsis, badge truncation and offsets | captured as component props with one visual spec |
| Platform differences need per-platform tuning | hairlines, scroll containers and icon fonts behave differently | isolated inside components via conditional compilation |
| Theming is hard to land | runtime theming adds overhead; page-level overrides scatter | `$m-*` variables + `!default`, resolved at compile time |

Component taxonomy, prop naming and visual specs follow mainstream uni-app libraries, so migration requires no new mental model.

## Features

- **easycom auto import**: follows the [uni_modules component plugin spec](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html); no import or registration required
- **Built-in default theme**: works out of the box; override it by defining variables in the root `uni.scss` — see [Theming](/en/guide/theming)
- **Multi-platform**: Web, App (Android / iOS / HarmonyOS) and Mini Programs, compatible with [vapor mode](/en/guide/compatibility#vapor-mode)
- **Native rendering**: 0.5px hairlines and loading animations are built on native capabilities for consistent visuals
- **Strongly typed UTS**: fully static props / events, errors caught at compile time
- **No global side effects**: component styles are self-contained and only reference the in-package `vars.scss`

## Design conventions

Components stay within the capabilities of uni-app x and follow these conventions:

- **Text styles only on `<text>` / `<button>`** (ucss does not inherit text styles); no pseudo-elements, no `@keyframes` — animations use `UniElement.animate`
- **Flex-only layout**, avoiding positioning and scrolling features that differ between platforms; 0.5px hairlines always use an absolutely positioned node with `transform: scale(0.5)`
- **Strongly typed API**: all props / events typed in UTS; nullable values use `null`
- **Compile-time theming**: every visual parameter is a `$m-*` SCSS variable (all `!default`) with zero runtime overhead

## Component categories

| Category | Components (including variants) |
| --- | --- |
| Basic | Button, Icon, Image, Text |
| Layout | Compact, Divider, Flex, Grid, Layout, Space, StatusBar, Sticky, Waterfall |
| Data entry | Checkbox, ColorPicker, Input; Checkbox and ColorPicker also provide popup and input variants |
| Pickers | Picker, Cascader; both provide popup and input variants, and Picker also provides a toolbar-less view |
| Date & time | Calendar, DatePicker, DateRangePicker, DateStrip, TimePicker, TimeRangePicker, LunarPicker; the date / time / lunar series also provide popup and input variants |
| Feedback | Fab, Loading, Overlay, Popup, Toast |
| Data display | Badge, Cell and CellGroup |
| Navigation | Tabs |

See the "Components" sidebar for the full list and APIs; visit the [live demo](https://mengxi-studio.github.io/unix-ui/playground/) for behavior.

## Distribution

| Channel | Notes |
| --- | --- |
| uni_modules plugin | Plugin id `m-ui-x`; import from the plugin marketplace and easycom works with zero configuration |
| npm package | `@meng-xi/unix-ui`; requires one easycom rule, see [Installation](/en/guide/installation#option-2-npm) |
| Source | [GitHub repository](https://github.com/MengXi-Studio/unix-ui), MIT licensed |

## Learning path

| Stage | Content |
| --- | --- |
| Getting started | [Installation](/en/guide/installation) → [Quick Start](/en/guide/getting-started) |
| Fundamentals | [Theming](/en/guide/theming) |
| Advanced | [Compatibility](/en/guide/compatibility) → [FAQ](/en/guide/faq) |
| Reference | [Button](/en/components/button) → [Date tools](/en/tools/date) → [Changelog](/en/changelog) |

## Next steps

- [Installation](/en/guide/installation): add the library to your uni-app x project
- [Quick Start](/en/guide/getting-started): start with your first component
