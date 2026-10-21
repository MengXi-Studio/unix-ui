# Changelog

## [0.1.0] - 2026-10-21

First usable release: a UI component library for uni-app x with a pnpm monorepo architecture (core / docs / playground) and the first component, [Button](/en/components/button).

### Added

- **mxi-button**: API aligned with the [Vant Button](https://vant-ui.github.io/vant/#/zh-CN/button) — five types (default / primary / success / warning / danger), four sizes (large / normal / small / mini), plain, round, square, block, disabled, loading state (loading / loading-text), custom color (color, supporting `linear-gradient` gradients) and hairline borders
- **easycom auto import**: uni_modules-compliant directory layout (`uni_modules/mxi-ui-x/components/<name>/<name>.uvue`), no import or registration needed; an `easycom.custom` rule in pages.json for npm installs
- **Theming**: the default theme is built in and requires zero configuration (components import `theme/vars.scss` at the top level, all `!default`); define `$mxi-*` variables in the project root uni.scss to override globally at compile time — see [Theming](/en/guide/theming)
- **0.5px hairline borders**: ucss has no pseudo-elements, implemented with an absolutely positioned view + `scale(0.5)`, consistent across Web and native
- **Loading animation**: spinner rotation via `UniElement.animate` (under the constraint that ucss forbids `@keyframes`)
- **Event semantics**: click does not fire while disabled or loading, matching Vant behavior

### Engineering

- **pnpm monorepo**: packages/core (component source) / packages/docs (VitePress site) / packages/playground (uni-app x demo project)
- **uni_modules sync script**: `sync-uni-modules.mjs` syncs core into playground `uni_modules/mxi-ui-x` with a sha256 consistency check (`--check`)
- **Vapor mode**: playground enables `vapor: true` + `vapor-render-target: bytecode`; components verified under vapor compilation
- **VitePress docs site**: local search (Chinese translations), UTS syntax highlighting, dark code theme, home badges

### Platform Support

- **Web**: compile and runtime verified (rendering, events and theme override matrix tested)
- **Android / iOS / HarmonyOS / Mini Programs**: adapted via conditional compilation, pending on-device testing
