# Theming

unix-ui theming is driven by SCSS variables. **A default theme ships out of the box**: every component imports the variable file, so the full visual design works with zero configuration and no initialization code.

## Overriding Theme Variables

Define variables with the same names directly in the project root `uni.scss` to override globally:

```scss
// Custom theme colors (applies to all components)
$m-color-primary: #10b981;
$m-color-danger: #dc2626;

// Custom component metrics
$m-button-normal-height: 48px;
$m-radius-md: 12px;
```

All variables in the variable file are declared with `!default`, so user-defined values always win over component defaults, regardless of where they are written.

## How It Works

1. Each component imports `theme/vars.scss` at the top level of its style (all `!default`), which expands to the default values at compile time
2. The uni-app x compiler injects the project root `uni.scss` into every component's style for the same compilation
3. Variables defined by the user in `uni.scss` make the `!default` declarations skip, thus overriding the defaults

Everything happens at compile time — theming has zero runtime cost.

::: warning Never import vars.scss in uni.scss
Do not `@import` the library's `vars.scss` in `uni.scss` — the compiler injects `uni.scss` into every component's style, and importing the same file again forms a circular import that fails the build:

```
[sass] This file is already being loaded.
```

To override the theme, just **define the variables directly** — no import of any file is needed.
:::

## Variable Reference

### Theme Colors

| Variable | Description | Default |
| --- | --- | --- |
| $m-color-primary | Primary color | #1989fa |
| $m-color-success | Success color | #07c160 |
| $m-color-warning | Warning color | #ff976a |
| $m-color-danger | Danger color | #ee0a24 |
| $m-white | Base white | #ffffff |
| $m-text-color | Base text color | #323233 |
| $m-disabled-opacity | Disabled opacity | 0.5 |
| $m-color-default-bg | Background of the default type | #ffffff |
| $m-color-default-border | Border of the default type | #ebedf0 |

### Base Metrics

| Variable | Description | Default |
| --- | --- | --- |
| $m-border-width | Base border width | 1px |
| $m-radius-md | Base radius | 8px |
| $m-radius-max | Full radius | 999px |

### Button

See [Button Theming](/en/components/button#theming) for the full set of Button variables, including height, padding, font size and radius for each size.

### Component-level Variables

Besides the global variables above, each component ships its own `$m-<component>-*` variables (e.g. `$m-sticky-z-index` for Sticky, the `$m-tabs-*` series for Tabs, the `$m-calendar-*` series for Calendar), all declared with `!default`. See the "Theming" section of each component's documentation for the complete list.

## Naming and Discovery

- Global variables are named `$m-<property>`, component-specific ones `$m-<component>-<property>`;
- All variables are defined in [theme/vars.scss](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/core/theme/vars.scss), grouped by component with comments;
- To check what a single component exposes, read the "Theming" section of its documentation.

## Notes

- `uni.scss` is injected at compile time and **does not participate in hot updates**; restart the dev server after changing variables — see the [FAQ](/en/guide/faq).
- Override only the variables you need and keep the rest at their defaults — this keeps upgrade diffs minimal.
- Use theme variables for global visual consistency; for one-off tweaks prefer the `custom-class` / `custom-style` props instead of changing global variables.

## Next Steps

- [Button](/en/components/button): component props and events
- [FAQ](/en/guide/faq#why-cant-i-import-the-variable-file-in-uni-scss): common pitfalls of the theming mechanism
