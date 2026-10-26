# Theming

unix-ui theming is driven by SCSS variables. **A default theme ships with the components** (imported inside each component) and works with zero configuration.

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

## Next Steps

- [Button](/en/components/button): component props and events
- [FAQ](/en/guide/faq#why-cant-i-import-the-variable-file-in-uni-scss): common pitfalls of the theming mechanism
