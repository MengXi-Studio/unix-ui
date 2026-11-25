# Installation

## Requirements

| Item | Requirement |
| --- | --- |
| Compiler | HBuilderX `5.08` or later (uni-app x compiler) |
| Project type | uni-app x project — Web / App / Mini Program |
| Package manager | Optional; only needed for the npm route |
| Style isolation | Strategy 2.0 recommended (HBuilderX 4.13+) |
| Vapor mode | Compatible with vapor compilation, see [Compatibility](/en/guide/compatibility) |

## Option 1: uni_modules (recommended)

Put the library into `uni_modules/m-ui-x/` of your project (import from the plugin marketplace or copy manually). The layout follows the [uni_modules component plugin spec](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir):

```
uni_modules/m-ui-x/
├── components/         # one directory per component: m-button/, m-input/ …
├── utils/              # date tool entries: index.uts / date.uts
├── theme/
│   └── vars.scss       # every $m-* variable (!default)
├── static/             # icon font and other static assets
├── package.json        # plugin id: m-ui-x
└── changelog.md
```

Once in place, components are picked up by [easycom](https://doc.dcloud.net.cn/uni-app-x/component/#easycom) automatically — **no configuration needed**.

::: tip The directory must be named m-ui-x
The plugin id is `m-ui-x`, so the directory under `uni_modules` must match it; otherwise easycom cannot resolve the components.
:::

## Option 2: npm

```bash
npm install @meng-xi/unix-ui
```

Then register an easycom rule in `pages.json`:

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

::: tip If components are not recognized
HBuilderX only scans the project's `uni_modules/` directory, and easycom resolution for components inside `node_modules` is unreliable in some versions. If tags do not render, copy the package content into `uni_modules/m-ui-x/` (same directory name) and use option 1.
:::

## Verify the installation

Use a component directly in any page template — no import or registration:

```html
<template>
	<m-button type="primary">Installed</m-button>
</template>
```

A primary-colored button means it works. If the tag does not render, check the directory name and easycom rule, or read the [FAQ](/en/guide/faq#component-tag-not-rendered).

## Importing utilities

The library also ships a pure-function date toolset. Two equivalent entry points:

```ts
// Aggregated entry: everything at once
import { formatDate, parseDate, addDays, solarToLunar } from '@/uni_modules/m-ui-x/utils/index.uts'

// Short-path entry: date module only (identical exports)
import { formatDate } from '@/uni_modules/m-ui-x/utils/date.uts'
```

For npm installs, replace the prefix with the package name (e.g. `@meng-xi/unix-ui/utils/date.uts`). See [Date tools](/en/tools/date) for the full list.

## Upgrading

- **uni_modules**: overwrite `uni_modules/m-ui-x/` with the new version and keep your own code; `package.json` / `changelog.md` come with the package.
- **npm**: `npm install @meng-xi/unix-ui@latest`.
- Read the [changelog](/en/changelog) first, especially entries marked as breaking; recent releases refactored picker panels internally without API changes.

## Try it on a device

You can try the components on a real device without writing code: [download the Android demo APK](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1795586984213-__UNI__F1AA560_1795586972273.apk). It is the cloud build of the playground project, with one page per component covering every prop / variant / event; the APK is rebuilt per release, so always use the link from the latest release notes.

## Next steps

- [Quick Start](/en/guide/getting-started): props, events and two-way binding
- [Theming](/en/guide/theming): override the default theme
- [Compatibility](/en/guide/compatibility): per-platform support and vapor mode
