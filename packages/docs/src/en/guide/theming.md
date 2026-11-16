# Theming

unix-ui theming is driven by SCSS variables, and the **default theme works out of the box**: components already import the variable file, so no initialization code is required and there is no runtime theme computation.

## Overriding variables

Define the same variables **directly** in the project-root `uni.scss`:

```scss
// 1. Brand colors: affect every component that uses them
$m-color-primary: #10b981;
$m-color-danger: #dc2626;

// 2. Component specs: override only what you need
$m-button-normal-height: 48px;
$m-button-radius: 12px;
$m-radius-md: 12px;
```

Every variable uses `!default`, so user-defined values always win over component defaults, regardless of where they are written.

## How it works

1. Each component imports `theme/vars.scss` (all `!default`) at the top of its style block, expanding to defaults at compile time;
2. The uni-app x compiler injects the project-root `uni.scss` into every component style in the same compilation;
3. User-defined variables make the `!default` declarations skip, completing the override.

Everything happens at compile time — zero runtime theming cost. The variable contract is identical for uni_modules and npm installs.

::: warning Never import vars.scss in uni.scss
Do not `@import` the library's `vars.scss` in `uni.scss`: the compiler injects `uni.scss` into every component style, which then imports the same file again and triggers a circular import:

```
[sass] This file is already being loaded.
```

Just **define variables** — no file import is needed.
:::

## Variable layers

| Layer | Naming | Examples | Scope |
| --- | --- | --- | --- |
| Global base | `$m-<property>` | `$m-color-primary`, `$m-radius-md`, `$m-border-width` | brand colors and cross-component specs |
| Component | `$m-<component>-<property>` | `$m-button-normal-height`, `$m-tabs-nav-height` | one component's sizes and colors |
| Variants | `$m-<component>-input-*` / `-popup-*` | `$m-lunar-picker-input-*` | appearance of input / popup variants |

Global base variables:

| Variable | Description | Default |
| --- | --- | --- |
| `$m-color-primary` | Primary color | `#1989fa` |
| `$m-color-success` | Success color | `#07c160` |
| `$m-color-warning` | Warning color | `#ff976a` |
| `$m-color-danger` | Danger color | `#ee0a24` |
| `$m-text-color` | Base text color | `#323233` |
| `$m-white` | Base white | `#ffffff` |
| `$m-disabled-opacity` | Disabled opacity | `0.5` |
| `$m-border-width` | Base border width | `1px` |
| `$m-radius-md` | Base radius | `8px` |
| `$m-radius-max` | Pill radius | `999px` |

Component-level defaults and usage live in each component's "Theming" section.

## Finding variables

- All variables live in [theme/vars.scss](https://github.com/MengXi-Studio/unix-ui/blob/master/packages/core/theme/vars.scss), grouped per component with comments;
- For a single component, check its documentation's "Theming" section (e.g. [Button theming](/en/components/button#theming));
- When only one instance should change, prefer `custom-class` / `custom-style`.

## Notes

- `uni.scss` is compile-time injected and **not hot-reloaded**; restart the dev server after changing variables — see [FAQ](/en/guide/faq#theme-does-not-change-after-editing-uni-scss).
- Override only what you need; keeping the rest at defaults minimizes upgrade diffs.
- Panel visuals are now owned by `$m-picker-*`; after the date / time panels moved onto `m-picker`, the old panel-level variables no longer apply — see the [changelog](/en/changelog).

## Next steps

- [FAQ](/en/guide/faq#why-can-t-i-import-the-variable-file-in-uni-scss): common theming pitfalls
- [Button](/en/components/button): props and events of the button component
