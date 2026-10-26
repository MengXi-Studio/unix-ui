# Changelog

## [Unreleased]

### Breaking Changes

- **Component prefix renamed**: the component prefix `mxi-` is renamed to `m-` (e.g. `mxi-button` → `m-button`); the uni_modules plugin id and directory are renamed `mxi-ui-x` → `m-ui-x`, and the theme variable prefix `$mxi-*` is renamed `$m-*`; upgrading requires a global replacement of template tags, the easycom directory name and the `uni.scss` variable prefix

### Added

- **m-loading**: two loading types (circular arc ring / spinner petals), custom color (`color`, CSS color values or semantic names `default` `primary` `success` `warning` `danger` `white`), custom size (`size`, supports `100%` to fill an externally sized container), vertical layout (`vertical`), custom text styling (`text-size` / `text-color`), default text slot and custom icon slot; the spinner type uses 1.2s 12-step discrete rotation with a fading tail, and the circular type is an arc ring rotating at a constant speed
- **m-button press feedback**: hover-class-based pressed state (opacity 0.8, theme-overridable); disabled and loading states show no press feedback
- **m-button loading refactor**: the loading icon is now powered by [m-loading](/en/components/loading) (form and animation maintained in a single place); `loading-type` removes the `clock` type, converging to `circular` / `spinner` (breaking change)

## [0.1.0] - 2026-10-21

First usable release: a UI component library for uni-app x with a pnpm monorepo architecture (core / docs / playground) and the first component, [Button](/en/components/button).

### Added

- **m-button**: five types (default / primary / success / warning / danger), four sizes (large / normal / small / mini), plain, round, square, block, disabled, loading state (loading / loading-text), custom color (color, supporting `linear-gradient` gradients) and hairline borders
- **easycom auto import**: uni_modules-compliant directory layout (`uni_modules/m-ui-x/components/<name>/<name>.uvue`), no import or registration needed; an `easycom.custom` rule in pages.json for npm installs
- **Theming**: the default theme is built in and requires zero configuration (components import `theme/vars.scss` at the top level, all `!default`); define `$m-*` variables in the project root uni.scss to override globally at compile time — see [Theming](/en/guide/theming)
- **0.5px hairline borders**: ucss has no pseudo-elements, implemented with an absolutely positioned view + `scale(0.5)`, consistent across Web and native
- **Loading animation**: spinner rotation via `UniElement.animate` (under the constraint that ucss forbids `@keyframes`)
- **Event semantics**: click does not fire while disabled or loading

### Engineering

- **pnpm monorepo**: packages/core (component source) / packages/docs (VitePress site) / packages/playground (uni-app x demo project)
- **uni_modules sync script**: `sync-uni-modules.mjs` syncs core into playground `uni_modules/m-ui-x` with a sha256 consistency check (`--check`)
- **Vapor mode**: playground enables `vapor: true` + `vapor-render-target: bytecode`; components verified under vapor compilation
- **VitePress docs site**: local search (Chinese translations), UTS syntax highlighting, dark code theme, home badges

### Platform Support

- **Web**: compile and runtime verified (rendering, events and theme override matrix tested)
- **Android / iOS / HarmonyOS / Mini Programs**: adapted via conditional compilation, pending on-device testing
