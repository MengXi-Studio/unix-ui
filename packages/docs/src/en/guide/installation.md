# Installation

## Requirements

- HBuilderX `5.08` or above (uni-app x compiler)
- Optional: an npm package manager (for the npm install method)

## Option 1: uni_modules (recommended)

Place the library into your project's `uni_modules/m-ui-x` directory (via the plugin marketplace or manual copy), following the [uni_modules component plugin spec](https://doc.dcloud.net.cn/uni-app-x/plugin/uni_modules.html#dir):

```
uni_modules/m-ui-x/
├── components/
│   └── m-button/
│       └── m-button.uvue
├── theme/
│   └── vars.scss
├── package.json
└── ...
```

Components are picked up automatically by [easycom](https://doc.dcloud.net.cn/uni-app-x/component/#easycom) — **no configuration required**.

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

## Verify the Installation

Use a component directly in any page template, no import or registration:

```html
<template>
	<m-button type="primary">Installed</m-button>
</template>
```

## Try It on a Device

You can experience the components on a real device without writing any code: [download the Android demo app (APK)](https://mp-b8b8347a-48e9-434d-8302-3e9d99c2cb01.cdn.bspapp.com/cloudstorage/app-build-pkg/1793059625238-__UNI__F1AA560_1793059613497.apk) — a cloud-packaged build of the playground example project (one page per component exhaustively covering all props / variants / events). The package is rebuilt with each release; use the link in the latest release notes.

## Next Steps

- [Quick Start](/en/guide/getting-started): basic usage and event handling
- [Theming](/en/guide/theming): override the default theme variables
