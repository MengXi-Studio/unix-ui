# Introduction

**unix-ui** (`@meng-xi/unix-ui`) is a UI component library for [uni-app x](https://doc.dcloud.net.cn/uni-app-x/), written in UTS + uvue and compiled to native code on each platform with no Web runtime dependency.

## Features

- **easycom auto import**: follows the [uni_modules component plugin spec](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html); components require no import or registration
- **Built-in default theme**: components ship with a default theme that works out of the box; override it by defining variables in `uni.scss` — see [Theming](/en/guide/theming)
- **Multi-platform**: App (Android / iOS / HarmonyOS), Web and Mini Programs, compatible with [vapor mode](/en/guide/compatibility#vapor-mode)
- **Native rendering**: details like 0.5px hairline borders and loading animations are built on native capabilities for consistent visuals across platforms
- **Strongly typed UTS**: fully static Props / Events, errors caught at compile time
- **Vant-aligned API**: component naming, props and interaction semantics match [Vant](https://vant-ui.github.io/vant/) for a zero-cost migration

## Relationship with uni-ui and Vant

|  | unix-ui | uni-ui | Vant |
| --- | --- | --- | --- |
| Target framework | uni-app x (UTS/uvue) | uni-app (Vue) | Web (Vue) |
| Rendering | Native | Hybrid | DOM |
| Interaction & API style | Vant-aligned | Its own style | — |
| Theming | Compile-time SCSS variables | SCSS variables | CSS variables |

unix-ui borrows Vant's component design and interaction conventions, but re-implements them for uni-app x's native rendering and strict UTS typing (text must live in `<text>`, no pseudo-elements, no `@keyframes`).

## Learning Path

| Stage | Content |
| --- | --- |
| Getting started | [Installation](/en/guide/installation) → [Quick Start](/en/guide/getting-started) |
| Fundamentals | [Theming](/en/guide/theming) |
| Advanced | [Compatibility](/en/guide/compatibility) → [FAQ](/en/guide/faq) |
| Reference | [Button](/en/components/button) → [Changelog](/en/changelog) |
