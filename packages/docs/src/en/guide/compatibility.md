# Platform Compatibility

unix-ui is written in UTS + uvue, and platform differences are isolated inside components via conditional compilation — your business code never has to branch on the platform.

## Platform Matrix

| Platform | Status | Notes |
| --- | --- | --- |
| Web | ✅ Verified | Compiled and run with HBuilderX; rendering / events / theme override matrix and per-component scenarios verified in the browser |
| App-Android | ✅ Cloud build verified | Both vapor and vdom modes compile and package via cloud build; a demo APK ships with every release (see [Installation](/en/guide/installation#try-it-on-a-device)) |
| App-iOS | 🔧 Adapted | Conditional compilation in place; on-device testing pending (requires macOS) |
| App-HarmonyOS | 🔧 Adapted | Conditional compilation in place; testing pending (requires DevEco Studio) |
| WeChat Mini Program | 🔧 Baseline verified | Baseline issues (overlay visibility / popup layers / font loading) were reproduced and fixed in testing during v0.3.1; new components are verified release by release |
| Other Mini Programs | 🔧 Adapted | Conditional compilation in place; testing pending in developer tools |

## HBuilderX Version Requirements

| Capability | Minimum Version |
| --- | --- |
| Component compilation (uni-app x) | 5.08 |
| Style isolation strategy 2.0 | 4.13+ |
| `UniElement.animate` (loading animation, Android vapor mode) | 4.53+ |

## Vapor Mode

unix-ui components are compatible with vapor mode compilation. To enable it in your project, configure `manifest.json` as follows:

```json
{
	"uni-app-x": {
		"styleIsolationVersion": "2",
		"vapor": true,
		"vapor-render-target": "bytecode"
	}
}
```

Components do not rely on any vdom-only capabilities, so behavior is identical in both vdom and vapor modes.

## Platform Differences

Platform differences are handled inside components, so your business code stays unaware of them:

- The Web build adds `cursor: pointer` and other mouse-friendly styles
- Text rendering is always placed in `<text>` nodes (ucss requires it — text styles are not inherited)
- 0.5px hairline borders always use an absolutely positioned node with `transform: scale(0.5)`, avoiding per-platform border rendering differences
- Style isolation uses strategy 2.0, so component styles never leak into the global scope

## Known Limitations

| Scenario | Notes |
| --- | --- |
| App-iOS / App-HarmonyOS | Conditional compilation is in place, but on-device testing is pending; please report issues with a reproduction project |
| WeChat Mini Program · DOM capabilities | `UniElement` on mini-programs provides no `children` / `parentElement`; scroll-related features that depend on subtree traversal or synchronous measurement degrade (e.g. some switch animations snap into place instead of animating) |
| WeChat Mini Program · Font icons | `@font-face` cannot reference local font files, so icons load at runtime via `loadFontFace`; the first frame may briefly show the default glyph |
| Web · Routing | With `web.router.mode` set to `history`, the `#` part of the URL is ignored by routing — see the [FAQ](/en/guide/faq) |

## Reporting Issues

For platform-related issues, include the HBuilderX version, platform and device / browser version, and a minimal reproduction or code snippet in a [GitHub Issue](https://github.com/MengXi-Studio/unix-ui/issues).

## Next Steps

- [FAQ](/en/guide/faq): high-frequency compilation and runtime issues
- [Button](/en/components/button): component API reference
