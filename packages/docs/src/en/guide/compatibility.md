# Compatibility

## Support matrix

| Platform | Status | Notes |
| --- | --- | --- |
| Web (H5 / desktop browsers) | Every component verified | The demo site runs on Web, where all variants can be exercised |
| App · Android | Supported | A cloud-built APK is available, see [Installation](/en/guide/installation#try-it-on-a-device) |
| App · iOS | Supported | Shares the same uvue sources as Android |
| App · HarmonyOS | Supported | Depends on the native renderer of the matching HBuilderX version |
| WeChat / Alipay mini programs | Supported (with limits) | See "Known limitations" below |

The goal is consistent behavior from one codebase; platform differences are confined to conditional compilation inside components, so application code needs no platform checks.

## Requirements

| Item | Requirement |
| --- | --- |
| HBuilderX | `5.08` or later |
| uni-app x compiler | Bundled with HBuilderX |
| Style isolation | Strategy 2.0 recommended (HBuilderX 4.13+) |
| Node.js | Only needed for npm installs |

## Vapor mode

The library is compatible with uni-app x [vapor mode](https://doc.dcloud.net.cn/uni-app-x/compiler/#vapor) (vapor + bytecode): templates avoid VDOM-only syntax and animations use `UniElement.animate`, so enabling `vapor` in `manifest.json` compiles and runs as-is.

## How platform differences are handled

| Difference | Handling inside components |
| --- | --- |
| 0.5px hairlines | Absolutely positioned layer + `transform: scale(0.5)`, identical everywhere |
| Animation | `UniElement.animate` (ucss has no `@keyframes` and no pseudo-elements) |
| Icon fonts | Font files under `static/` rendered by `text`, no Web font loading |
| Text styles | Only on `text` / `button` (App `view`s do not inherit text styles) |
| Platform-only capabilities | Isolated with `#ifdef APP-ANDROID` / `APP-IOS` / `WEB`, transparent to users |

## Known limitations

- **Named slots in mini programs**: when a same-named slot is used inside `v-for`, only the first instance takes effect, so per-column / per-item slots such as `option` are unavailable on mini programs and columns fall back to built-in text rendering; Web and App are unaffected.
- **Scroll snapping feel**: snapping in wheel components relies on each platform's `UniElement` implementation, so inertia on real devices differs slightly from Web — a platform trait.
- **Lunar range**: conversion data covers 1900–2100; Gregorian dates outside the range are clamped to the boundary.
- **Panel-level theme variables**: date / time panels now compose `m-picker`, so the old `$m-date-picker-*` / `$m-time-picker-*` visual variables no longer apply; use `$m-picker-*`.

## Feedback

If any platform behaves differently from the docs, open a [GitHub issue](https://github.com/MengXi-Studio/unix-ui/issues) with the platform, HBuilderX version, component name and a minimal reproduction.

## Next steps

- [FAQ](/en/guide/faq): build, theming and runtime questions
- [Theming](/en/guide/theming): variable overrides and precedence
