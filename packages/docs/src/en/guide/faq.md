# FAQ

## Installation and imports

### Component tag not rendered

Check in order:

1. The directory under `uni_modules` must be `m-ui-x` (matching the plugin id); otherwise easycom will not scan it;
2. For npm installs, register the easycom rule in `pages.json`: `"^m-(.*)": "@meng-xi/unix-ui/components/m-$1/m-$1.uvue"`;
3. Restart the dev server after editing `pages.json`;
4. If it still fails, copy the package into `uni_modules/m-ui-x/` and use the zero-config route.

### No type hints after npm install

Make sure the project's `tsconfig.json` / `jsconfig.json` does not override `moduleResolution`; the uni-app x template defaults already resolve `.uvue` and `.uts` inside the package. Restore the template defaults if you changed them.

### Can I import only some components?

Yes. With uni_modules, keep only the `components/m-*` directories you need — but keep `theme/`, `utils/` and `static/` (icon font), otherwise variables or icons go missing.

## Theming

### Why can't I import the variable file in uni.scss?

`uni.scss` is injected into every component style, and components already import `vars.scss`, so pointing both at the same file triggers a circular import:

```
[sass] This file is already being loaded.
```

Define variables directly in `uni.scss` instead — see [Theming](/en/guide/theming).

### Theme does not change after editing uni.scss

`uni.scss` is compile-time injected and is not hot-reloaded. Restart the dev server (recompile if needed) and refresh.

### How do I style a single instance?

Pass a class via `custom-class` or inline styles via `custom-style`; avoid changing global variables for one-off cases.

## Using components

### What value types do date, time and picker components use?

| Component | Value type |
| --- | --- |
| `m-input` / `m-picker` | `string` / `string[]` |
| `m-date-picker` / `m-calendar` | `Date \| null` |
| `m-time-picker` | `'HH:mm'` or `'HH:mm:ss'` |
| `m-lunar-picker` | Gregorian `Date` (lunar only appears in columns and echo text) |
| `m-checkbox-group` | array |

Multi-column `columns` accepts `PickerOption[][]` or a plain string matrix; items can be `{ text, value, disabled }`.

### The lunar date looks off by one day

`m-lunar-picker` always exposes a Gregorian `Date` (local midnight); lunar values only drive columns and input echo. When formatting, use helpers such as `formatDate` and avoid `toISOString()` slicing, which converts to UTC and can shift the day.

### Input height looks wrong inside m-cell

Use the `inlaid` mode inside `m-cell`: the control height is guaranteed by `$m-input-inlaid-min-height` (default `24px`) to match a single-line cell. If that variable was customized, restore it or adjust the cell row height accordingly.

### Icons are not showing

Icons rely on font files under `static/`. Verify:
1. The directory was copied along with the library;
2. The `m-icon` `name` exists in the [icon list](/en/components/icon);
3. Custom fonts are packaged on App — cloud builds and local runs behave the same.

## Platforms

### Text styles do not apply on App

Set text styles on `text` / `button` only; `view`s on App do not inherit text styles. Move `font-size` / `color` onto `text`.

### The option slot does not work on mini programs

Mini programs render only the first same-named slot inside a `v-for`, so per-column slots such as `option` fall back to built-in text. Use `formatter` for custom text, or use the slot on Web / App only.

### Is vapor mode supported?

Yes — see [Compatibility · Vapor mode](/en/guide/compatibility#vapor-mode).

## Versions and migration

### What changed in the date / time panels?

Since 0.6.0, `m-date-picker` / `m-time-picker` compose `m-picker` internally. **Public props / events / slots / value types are unchanged**; visuals are owned by `$m-picker-*` and the old panel-level variables no longer apply. See the [changelog](/en/changelog).

### How do I see what changed in a release?

The [changelog](/en/changelog) lists additions, fixes and changes per version; the plugin marketplace and npm package ship the same content.
