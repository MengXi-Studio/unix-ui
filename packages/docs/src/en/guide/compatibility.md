# Platform Compatibility

## Platform Matrix

| Platform | Status | Notes |
| --- | --- | --- |
| Web | ✅ Verified | Compiled and run with HBuilderX; rendering / events / theme override matrix all passed |
| App-Android | 🔧 Adapted | Vapor mode compilation verified; on-device testing pending |
| App-iOS | 🔧 Adapted | Conditional compilation in place; on-device testing pending (requires macOS) |
| App-HarmonyOS | 🔧 Adapted | Conditional compilation in place; testing pending (requires DevEco Studio) |
| Mini Programs | 🔧 Adapted | Conditional compilation in place; testing pending in developer tools |

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

Platform differences are isolated inside components via conditional compilation, so your business code stays unaware of them:

- The Web build adds `cursor: pointer` and other mouse-friendly styles
- Text rendering is always placed in `<text>` nodes (ucss requires it — text styles are not inherited)
- Style isolation uses strategy 2.0, so component styles never leak into the global scope

## Next Steps

- [FAQ](/en/guide/faq): high-frequency compilation and runtime issues
- [Button](/en/components/button): component API reference
