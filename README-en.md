[中文](./README.md) | **English**

<div align="center">
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="MengXi Studio Logo" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/logo.png">
  </a>
  <a href="https://github.com/MengXi-Studio/unix-ui">
    <img alt="WeChat Official Account QR Code" width="215" src="https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/public/QR_code.jpg">
  </a>

  <h1>@meng-xi/unix-ui</h1>
  <p><b>The UI component library built for uni-app x</b><br>79 components · 8 categories · one UTS codebase for App / Web / mini-programs</p>

[![license](https://img.shields.io/github/license/MengXi-Studio/unix-ui.svg)](./LICENSE) [![npm](https://img.shields.io/npm/v/@meng-xi/unix-ui?color=blue)](https://www.npmjs.com/package/@meng-xi/unix-ui) ![npm](https://img.shields.io/npm/dt/@meng-xi/unix-ui?color=green)

[Docs](https://mengxi-studio.github.io/unix-ui/en/) · [Live Demo](https://mengxi-studio.github.io/unix-ui/playground/) · [Changelog](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/docs/src/changelog.md) · [Playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground)
</div>

> **Stop hand-writing UI details.** Pressed states and loading indicators, 0.5px hairline borders, single- and multi-line ellipsis, badge truncation and offsets, popups and wheel pickers, date and lunar conversion — work you normally rewrite for every project and re-tune for every platform is distilled into 79 ready-to-use components. Install, write a tag, ship. Change one variable, re-skin the whole app.

## Table of Contents

- [Why unix-ui](#why-unix-ui)
- [Capabilities](#capabilities)
- [Up and running in 5 minutes](#up-and-running-in-5-minutes)
- [Component landscape](#component-landscape)
- [Engineered for every platform](#engineered-for-every-platform)
- [Platform support](#platform-support)
- [Try it on a device or in the browser](#try-it-on-a-device-or-in-the-browser)
- [Project & contributing](#project--contributing)
- [Documentation](#documentation)
- [Community & Support](#community--support)

## Why unix-ui

| What you care about | Raw `view` / `text` | Ported H5 libraries | **unix-ui** |
| --- | --- | --- | --- |
| Interaction details | Pressed states, loading, ellipsis — by hand | DOM-bound, drifts across platforms | Built in, consistent everywhere |
| 0.5px hairline | One implementation per platform | Extra hacks required | Unified transform-scale technique |
| Theming | Styles scattered around | Runtime CSS variables | Compile-time `$m-*` variables, zero runtime cost |
| Type safety | None | Pervasive `any` | Fully typed UTS with reliable IntelliSense |
| Adoption | — | Register, import, style conflicts | easycom auto-scan, **zero registration** |
| Platform parity | Debug each target | Missing mini-program capabilities | Conditional compilation, handled inside |

No custom rendering stack either: the library only depends on built-in uni-app x components and `UniElement.animate`. UTS source ships directly (Web / mini-programs → JS, Android → Kotlin, iOS → Swift) and is compiled on the fly by the uni-app x toolchain — **no extra runtime layer**.

## Capabilities

### 79 components for real product scenarios

From buttons, grids and layout to form controls, wheel and list pickers, dates and lunar calendars, then feedback, display and navigation — organized into 8 categories that mirror the documentation sidebar, following mainstream component-library naming and interaction conventions so **there is nothing new to learn**.

### Compile-time theming, one line app-wide

Every visual parameter is a `$m-*` SCSS variable living in `theme/vars.scss` (all `!default`). Define the same variable in your root `uni.scss` to override it, or use the default theme with zero configuration. Variables are injected at compile time — **zero runtime overhead**.

### One codebase, consistent everywhere

App (Android / iOS / HarmonyOS), Web and mini-programs share the same UTS + uvue source. Hairline borders, scroll containers, popup layering and font loading are implemented deterministically inside the library, with vapor mode supported.

### Strongly typed UTS, mistakes surface early

Fully typed props and events with editor completion; callbacks are arrow functions and nullable values use `null` rather than `undefined`, matching the UTS spec. Animations go through `UniElement.animate` — no `@keyframes` dependency.

### easycom, zero registration

Follows the uni_modules component plugin spec (plugin id: `m-ui-x`). Write `<m-button>` straight into your template — no imports, no manual registration.

### No global side effects

Component styles are self-contained and only reference the in-package `vars.scss`. Nothing is injected globally and no project config is touched — add or remove at will.

## Up and running in 5 minutes

**Step 1: add it to your project** (choose one)

```bash
# Option 1 (recommended): import from the plugin marketplace into uni_modules/m-ui-x/
# Option 2: install via npm, then sync into uni_modules (the compiler skips node_modules)
pnpm add @meng-xi/unix-ui
mkdir -p uni_modules && cp -R node_modules/@meng-xi/unix-ui uni_modules/m-ui-x
```

> The plugin id and directory name must both be `m-ui-x`, otherwise easycom cannot resolve the components.

**Step 2: use it**

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

**Step 3: re-skin as needed** (optional)

```scss
/* Root uni.scss: normal button height 44px → 48px, every button updates instantly */
$m-button-normal-height: 48px;
```

> Do NOT `@import` the in-package `vars.scss` from `uni.scss` — `uni.scss` is injected into every component's style, and importing the same file again triggers a sass circular-import error.

Requirements: HBuilderX `5.08` or above; style isolation strategy 2.0 recommended. For every available variable and how the mechanism works, see [Theming](https://mengxi-studio.github.io/unix-ui/en/guide/theming.html).

## Component landscape

**79 components** in total (including sub-components, popup and input variants), alphabetically ordered within each of the 8 categories:

| Category | Components |
| --- | --- |
| Basic | `m-button` `m-icon` `m-image` `m-text` |
| Layout | `m-compact` `m-divider` `m-flex` `m-grid` `m-row` `m-space` `m-status-bar` `m-sticky` `m-waterfall` |
| Data entry | `m-checkbox` `m-color-picker` `m-input` `m-number-keyboard` `m-password-input` `m-radio` `m-rate` `m-search` `m-segmented` |
| Pickers | `m-cascader` `m-picker` `m-picker-view` `m-select` |
| Date & time | `m-calendar` `m-date-picker` `m-date-range-picker` `m-date-strip` `m-lunar-picker` `m-time-picker` `m-time-range-picker` |
| Feedback | `m-fab` `m-loading` `m-overlay` `m-popup` `m-toast` |
| Data display | `m-badge` `m-cell` |
| Navigation | `m-tabs` |

> Most data-entry, picker and date & time components also ship **popup (`-popup`)** and **input (`-input`)** variants — the table lists base names only. A pure-function date toolset covering 1900–2100 (`utils/date.uts`) is included too, see [Date tools](https://mengxi-studio.github.io/unix-ui/en/tools/date.html).

<details>
<summary><b>Expand the full component list (all variants and capabilities)</b></summary>

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

### Data Entry

| Component | Description |
| --- | --- |
| `m-checkbox` / `m-checkbox-group` | Checkbox: group container + standalone item, shape / color / size customization, max limit, indeterminate state |
| `m-checkbox-input` | Checkbox input: read-only trigger + popup multi-select, "、" joined echo, truncation over 2 items, custom clear button |
| `m-checkbox-popup` | Checkbox popup: bottom-sheet multi-select, options array driven, field-names mapping, footer slot |
| `m-color-picker` | Color picker: saturation-value panel + hue / alpha sliders, hex / rgb / hsl output, presets, recent colors, Web eyedropper |
| `m-color-picker-input` | Color picker input: read-only trigger + color swatch preview + popup picking, optional label and clear |
| `m-color-picker-popup` | Color picker popup: cancel / title / confirm header, commit on confirm, discard on cancel or overlay tap |
| `m-input` | Input: six types, clearable with trigger timing, formatter / precision / min-max clamping, password eye toggle, word limit, multiline auto-height, prepend / append slots, confirm event and input-align |
| `m-number-keyboard` | Number keyboard: 1-9 + 0 + delete pure keypad, number / digit / idcard / random types, custom theme side column, disabled-key callback, extra-key slot |
| `m-number-keyboard-popup` | Number keyboard popup: m-popup + keypad, the default slot hosts code cells / amount display, closes after cancel / confirm |
| `m-password-input` | Password input cells: bordered / underlined styles, mask dots, blinking cursor when focused, plain text, disabled / readonly and error info |
| `m-password-input-popup` | Password input popup: popup + cells + keyboard in one, v-model:value clamps to length, auto focus on open, random keypad |
| `m-radio` / `m-radio-group` | Radio: group container + standalone item, self-drawn ring and dot, round / square shapes, color and size customization, readonly / disabled |
| `m-radio-input` | Radio input: read-only trigger + popup single-select, echoes the selected label, custom clear button writes back null |
| `m-radio-popup` | Radio popup: bottom-sheet single-select, options array driven, field-names mapping, footer slot, stays open after picking |
| `m-rate` | Rate: snaps to a 0.5 grid, half-star clipping, drag-to-rate, custom icon / color / size / count, clearable, readonly decimal display |
| `m-search` | Search: wraps m-input for input handling, round / background customization, clear, keyboard search, cancel or search action, side icons, error message and content align |
| `m-segmented` | Segmented control: equal-width single-select, three sizes, pill / vertical, sliding thumb animation, item scoped slot, ellipsis, disabled / readonly |

### Pickers

| Component | Description |
| --- | --- |
| `m-cascader` | Cascader: multi-level linkage, level tabs and swipe gestures, field-names mapping, async loading, four slots |
| `m-cascader-input` | Cascader input: read-only trigger + popup picking, selected path echo, clearable and disabled |
| `m-cascader-popup` | Cascader popup: m-popup + m-cascader, closes automatically after picking the last level |
| `m-picker` | Generic wheel picker: auto-detects 1D / 2D columns, children cascade, disabled options, object options, columns-top / columns-bottom slots |
| `m-picker-input` | Picker input: read-only trigger + popup picking, echoes the selected text of each column, clearable and disabled |
| `m-picker-popup` | Picker popup: m-popup + m-picker, v-model controls visibility and value, closes on confirm / cancel |
| `m-picker-view` | Picker view: toolbar-less index-controlled wheel columns, compose with m-picker-view-column and the option slot inside custom containers |
| `m-select` | Select: options-driven with children groups, whole / item disabled, local and remote filtering, multiple with limit, option scoped slot, scrollTop |
| `m-select-input` | Select input: read-only trigger + popup, label resolved by options → map-label → value string, max-labels collapsing, clear and readonly / disabled |
| `m-select-popup` | Select popup: m-popup + select panel, title and filter, closes on select (stays open in multiple mode) |

### Date & Time

| Component | Description |
| --- | --- |
| `m-calendar` | Calendar panel: single / multiple / range selection, year-month switching navigation, formatter, over-limit feedback |
| `m-calendar-input` | Calendar input: read-only trigger + popup picking, formatted echo, clearable and disabled |
| `m-calendar-popup` | Calendar popup: m-popup + m-calendar, closes on confirm, position / round corners / panel height / safe area |
| `m-date-picker` | Date picker: year / month / day wheels, column sets, min / max range, filter / formatter, toolbar and readonly loading state |
| `m-date-picker-input` | Date picker input: read-only trigger + popup picking, formatted echo by column set, clearable and disabled |
| `m-date-picker-popup` | Date picker popup: m-popup + date panel, closes on confirm / cancel, position / corners / safe area |
| `m-date-range-picker` | Date range picker: start / end titles share one date wheel, auto-swaps to ascending order on confirm, range, filter / formatter and quick-option slot |
| `m-date-range-picker-input` | Date range input: read-only trigger + popup picking, echoes "start - end" by outlet-format |
| `m-date-range-picker-popup` | Date range popup: m-popup + date range panel, closes on confirm / cancel |
| `m-date-strip` | Date strip: horizontal consecutive dates, single / multiple / range, value-format string binding, lunar text, filter and disabled dates, slot customization |
| `m-lunar-picker` | Lunar picker: lunar year / month (including leap month) / day wheels, GanZhi and zodiac year column, column sets, reverse-mapped min / max; the public value stays a Gregorian Date |
| `m-lunar-picker-input` | Lunar picker input: read-only trigger + lunar popup, echoes lunar text (e.g. 2026年六月十五) |
| `m-lunar-picker-popup` | Lunar picker popup: m-popup + lunar panel, closes on confirm / cancel |
| `m-time-picker` | Time picker: hour / minute / second wheels, column sets, minute and second steps, min / max time, 12/24-hour (AM / PM column for 12-hour mode) |
| `m-time-picker-input` | Time picker input: read-only trigger + popup picking, echoes HH:mm (HH:mm:ss with seconds) |
| `m-time-picker-popup` | Time picker popup: m-popup + time panel, closes on confirm / cancel |
| `m-time-range-picker` | Time range picker: start / end titles share one time wheel, auto-swaps to ascending order on confirm, steps, time range, 12-hour mode and quick-option slot |
| `m-time-range-picker-input` | Time range input: read-only trigger + popup picking, echoes "start - end" |
| `m-time-range-picker-popup` | Time range popup: m-popup + time range panel, closes on confirm / cancel |

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

</details>

## Engineered for every platform

| Mechanism | How | Benefit |
| --- | --- | --- |
| Theme variables | Components `@import vars.scss` at the top of styles, every variable `!default` | Define the same variable in your root `uni.scss` to override; default theme works with zero config |
| 0.5px hairline | Absolutely positioned 0.5px layer + `transform: scale(0.5)` with `transform-origin: 0 0` | Consistent hairline on App / Web / mini-programs, no blur, no offset |
| Animation | `UniElement.animate` everywhere | No `@keyframes` dependency, same source for all targets |
| Platform differences | Conditional compilation (`#ifdef APP-ANDROID / WEB / MP-WEIXIN`, etc.) | Differences stay inside the library; application code does not care |
| Style authoring | Class selectors + flex only, flat rule lists | Avoids ucss limits (no descendant selectors, no pseudo-elements) |
| Typing | Strongly typed UTS, `null` for nullable, arrow-function callbacks | Type problems surface at compile time on Web / App |

## Platform support

| Platform | Status | Notes |
| --- | --- | --- |
| Web | ✅ Verified | Compiled and run with HBuilderX; rendering / events / theme override matrix and per-component scenarios verified in the browser |
| App-Android | ✅ Cloud build verified | Both vapor and vdom modes compile and package via cloud build; 0.7.0 fixed two rounds of Kotlin compile errors and repackaged, a demo APK ships with every release |
| App-iOS | 🔧 Adapted | Conditional compilation in place; on-device testing pending (requires macOS) |
| App-HarmonyOS | 🔧 Adapted | Conditional compilation in place; testing pending (requires DevEco Studio) |
| WeChat Mini Program | 🔧 Baseline verified | Baseline issues (overlay visibility / popup layers / font loading) fixed through testing; 0.7.0 fixed the `getCurrentInstance` null crash in popup components (issue #20); 0.7.1 fixed icon font loading (issue #22); new components are verified release by release |
| Other Mini Programs | 🔧 Adapted | Conditional compilation in place; testing pending in developer tools |

Full details (HBuilderX version requirements, vapor mode configuration, platform differences) — see [Platform Compatibility](https://mengxi-studio.github.io/unix-ui/en/guide/compatibility.html).

## Try it on a device or in the browser

- **In the browser**: the [live demo](https://mengxi-studio.github.io/unix-ui/playground/) on the documentation site — one page per component, exhaustively covering all props / variants / events.
- **On an Android device**: [download the demo app (APK)](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1795095433761-__UNI__F1AA560_1795095406297.apk) — a cloud-packaged build showing every component with native rendering. The package is rebuilt with each release; use the link in the latest release notes.
- **Source as documentation**: every demo page in [packages/playground](https://github.com/MengXi-Studio/unix-ui/tree/master/packages/playground) is a runnable best practice.

## Project & contributing

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

```bash
pnpm install
pnpm sync:uni-modules        # core → playground/uni_modules/m-ui-x
pnpm sync:uni-modules:check  # verify sync artifacts are consistent
pnpm dev:docs                # start the docs site
pnpm build:docs              # build the docs site (with dead-link checks)
```

- Only edit `packages/core`; everything under `playground/uni_modules/m-ui-x/` (`components` / `utils` / `theme`) is a sync artifact and would be overwritten on the next sync.
- Run the demo project by opening `packages/playground` in HBuilderX. New components follow the order: component → theme → sync → demo → docs.
- Contributions via [Issues](https://github.com/MengXi-Studio/unix-ui/issues) / [Pull Requests](https://github.com/MengXi-Studio/unix-ui/pulls) are welcome. If this library saved you time, a **Star** is the best way to say thanks.

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
