# Theming

unix-ui theming is driven by SCSS variables. **A default theme ships with the components** (imported inside each component) and works with zero configuration.

## Overriding Theme Variables

Define variables with the same names directly in the project root `uni.scss` to override globally:

```scss
// Custom theme colors (applies to all components)
$mxi-color-primary: #10b981;
$mxi-color-danger: #dc2626;

// Custom component metrics
$mxi-button-normal-height: 48px;
$mxi-radius-md: 12px;
```

All variables in the variable file are declared with `!default`, so user-defined values always win over component defaults, regardless of where they are written.

## How It Works

1. Each component imports `theme/vars.scss` at the top level of its style (all `!default`), which expands to the default values at compile time
2. The uni-app x compiler injects the project root `uni.scss` into every component's style for the same compilation
3. Variables defined by the user in `uni.scss` make the `!default` declarations skip, thus overriding the defaults

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
| $mxi-color-primary | Primary color | #1989fa |
| $mxi-color-success | Success color | #07c160 |
| $mxi-color-warning | Warning color | #ff976a |
| $mxi-color-danger | Danger color | #ee0a24 |
| $mxi-white | Base white | #ffffff |
| $mxi-text-color | Base text color | #323233 |
| $mxi-disabled-opacity | Disabled opacity | 0.5 |
| $mxi-color-default-bg | Background of the default type | #ffffff |
| $mxi-color-default-border | Border of the default type | #ebedf0 |

### Base Metrics

| Variable | Description | Default |
| --- | --- | --- |
| $mxi-border-width | Base border width | 1px |
| $mxi-radius-md | Base radius | 8px |
| $mxi-radius-max | Full radius | 999px |

### Button

See [Button Theming](/en/components/button#theming) for the full set of Button variables, including height, padding, font size and radius for each size.

## Next Steps

- [Button](/en/components/button): component props and events
- [FAQ](/en/guide/faq#why-cant-i-import-the-variable-file-in-uni-scss): common pitfalls of the theming mechanism
