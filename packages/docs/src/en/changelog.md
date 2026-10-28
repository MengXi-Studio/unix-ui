# Changelog

## [0.1.0] - 2026-10-27

First usable release: a UI component library for uni-app x with a pnpm monorepo architecture (core / docs / playground), one set of UTS + uvue sources covering multiple platforms, with 11 built-in base components.

### Added

- **m-button**: five types (default / primary / success / warning / danger), four sizes (large / normal / small / mini), plain, round, square, block, disabled, loading state (loading / loading-text, the loading icon is powered by [m-loading](/en/components/loading), `loading-type` supports `circular` / `spinner`), press feedback (hover-class based, opacity overridable via `$m-button-active-opacity`), custom color (color, supporting `linear-gradient` gradients) and hairline borders
- **m-badge**: badge number / text / dot at the top-right corner, max truncation (`{max}+`), semantic color names and CSS color values, four-corner position, offset-x / offset-y, show-zero and a content slot for custom content; displays standalone without a child element, combinable with m-icon
- **m-icon**: 257 built-in font icons (`name` is the `IconName` union type), `color` / `size` customization, `custom-class` / `custom-style` direct tag styling, an `icon` slot and `click` events; the font file ships with the package (`@font-face` declarative loading), zero configuration, offline available
- **m-loading**: two loading types (circular arc ring / spinner petals), custom color (`color`, CSS color values or semantic color names), custom size (`size`, supports `100%` to fill an externally sized container), vertical layout (`vertical`), custom text styling (`text-size` / `text-color`), default text slot and custom icon slot; the spinner type uses 1.2s 12-step discrete rotation with a fading tail, the circular type is an arc ring rotating at a constant speed, animations are powered by `UniElement.animate` (ucss has no `@keyframes`)
- **m-cell / m-cell-group**: title / value / label, icons, four-direction arrows, inset rounded-card groups
- **m-row / m-col**: grid layout with gutter spacing, alignment and wrapping
- **m-image**: mode passthrough, loading / failure placeholders, fade-in transition, circle, lazy loading
- **m-text**: semantic color / color value dual mode, three font sizes, single-line ellipsis, multi-line truncation, selectable
- **m-space**: direction / wrap / alignment, size as a single value or dual values (row / column)
- **m-overlay**: `show` visibility, `z-index` level, `duration` in seconds (`0` disables animation), `custom-class` / `custom-style` direct styling and a `click` event (the overlay does not close automatically, aligned with Vant semantics); built-in body scroll lock on Web (released only when all stacked instances close), the foundation of popup components
- **m-popup**: five positions (center / top / bottom / left / right), per-side round corners, closeable with `close-icon` / `close-icon-position`, `close-on-click-overlay`, overlay customization (`overlay` / `overlay-class` / `overlay-style`), `z-index` / `duration`, `lazy-render` / `destroy-on-close`, `safe-area-inset-top` / `safe-area-inset-bottom`, and a `before-close` guard (sync boolean); `v-model:show` two-way binding with full events (open / opened / close / closed / click / click-overlay / click-close-icon); center scales in with a fade, edge positions slide, composed on top of m-overlay
- **m-divider**: horizontal / vertical forms (vertical as a flex item; parent container needs `flex-direction: row` + `align-items: center`), `dashed`, `hairline` 0.5px thin line (1px border + single-axis 0.5 scale, safe on App platforms), `content-position` (left / right / center, one line width-capped at 10%), default slot with inherited text styles
- **easycom auto import**: uni_modules-compliant directory layout (`uni_modules/m-ui-x/components/<name>/<name>.uvue`), no import or registration needed; an `easycom.custom` rule in pages.json for npm installs
- **Theming**: the default theme is built in and requires zero configuration (components import `theme/vars.scss` at the top level, all `!default`); define `$m-*` variables in the project root uni.scss to override globally at compile time — see [Theming](/en/guide/theming)
- **0.5px hairline borders**: ucss has no pseudo-elements, implemented with an absolutely positioned view + `scale(0.5)`, consistent across Web and native
- **Event semantics**: click does not fire while disabled or loading

### Engineering

- **pnpm monorepo**: packages/core (component source) / packages/docs (VitePress site) / packages/playground (uni-app x demo project)
- **uni_modules sync script**: `sync-uni-modules.mjs` syncs core into playground `uni_modules/m-ui-x` with a sha256 consistency check (`--check`)
- **Vapor mode**: playground enables `vapor: true` + `vapor-render-target: bytecode`; components verified under vapor compilation
- **VitePress docs site**: local search (Chinese translations), UTS syntax highlighting, dark code theme, home badges

### Platform Support

- **Web**: compile and runtime verified (rendering, events and theme override matrix tested)
- **Android / iOS / HarmonyOS / Mini Programs**: adapted via conditional compilation, pending on-device testing
