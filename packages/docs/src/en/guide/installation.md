# Installation

## Requirements

| Item | Requirement |
| --- | --- |
| Compiler | HBuilderX `5.08` or above (uni-app x compiler) |
| Project type | A uni-app x project (App / Web / mini-program) |
| Package manager | Optional; only needed for the npm install method |
| Style isolation | Strategy 2.0 recommended (HBuilderX 4.13+) |
| Vapor mode | Compatible with vapor compilation — see [Platform Compatibility](/en/guide/compatibility) |

## Option 1: uni_modules (recommended)

Place the library into your project's `uni_modules/m-ui-x/` directory (via the plugin marketplace or manual copy), following the [uni_modules component plugin spec](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir):

```
uni_modules/m-ui-x/
├── components/
│   └── m-button/
│       └── m-button.uvue
├── utils/
│   └── date.uts
├── theme/
│   └── vars.scss
├── package.json
└── ...
```

Components are picked up automatically by [easycom](https://doc.dcloud.net.cn/uni-app-x/component/#easycom) — **no configuration required**.

::: tip The directory name must be m-ui-x
The plugin id is `m-ui-x`, and the directory under `uni_modules` must match it; otherwise easycom cannot resolve the components.
:::

## Option 2: npm

```bash
npm install @meng-xi/unix-ui
```

Then configure the easycom rule in `pages.json`:

```json
{
	"easycom": {
		"autoscan": true,
		"custom": {
			"^m-(.*)": "@meng-xi/unix-ui/components/m-$1/m-$1.uvue"
		}
	}
}
```

::: tip
If your project cannot resolve components inside `node_modules`, copy the package contents into `uni_modules/m-ui-x/` (same directory name as above) and use the zero-config approach from Option 1.
:::

## Verify the Installation

Use a component directly in any page template, no import or registration:

```html
<template>
	<m-button type="primary">Installed</m-button>
</template>
```

If the primary-colored button renders after compiling, installation is complete. If the tag does not render, check the directory name and easycom rule, or see the [FAQ](/en/guide/faq).

## Importing Utilities

The library also ships a date toolset; import it from the `utils` entry on demand:

```ts
// Aggregate entry: everything in one import
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/index.uts'

// On-demand entry: date module only, shorter path
import { formatDate } from '@/uni_modules/m-ui-x/utils/date.uts'
```

See [Date tools](/en/tools/date) for the full function list.

## Try It on a Device

You can experience the components on a real device without writing any code: [download the Android demo app (APK)](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1794590278532-__UNI__F1AA560_1794590268233.apk) — a cloud-packaged build of the playground example project (one page per component exhaustively covering all props / variants / events). The package is rebuilt with each release; use the link in the latest release notes.

## Next Steps

- [Quick Start](/en/guide/getting-started): basic usage, props and events
- [Theming](/en/guide/theming): override the default theme variables
- [Platform Compatibility](/en/guide/compatibility): per-platform support and vapor mode
