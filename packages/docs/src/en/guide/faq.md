# FAQ

## Why can't I import the variable file in uni.scss?

The uni-app x compiler **injects the project root `uni.scss` into every component's styles** at compile time. The library's `theme/vars.scss` is already imported inside each component; importing the same file again from `uni.scss` triggers a sass circular import:

```
[sass] This file is already being loaded.
```

To override the theme, simply **define** `$mxi-*` variables directly in `uni.scss`. See [Theming](/en/guide/theming) for details.

## Build error: "index.html is missing in the root directory"

The uni-app x Web build is based on Vite, so the project root must contain an `index.html` entry template (containing `<script type="module" src="/main">`). Projects created by the CLI include it by default; manually scaffolded projects need to add it themselves.

## manifest.json appid errors

- An appid already taken by someone else → "You are not a member of this application's project"
- A made-up, unregistered appid → "The appid does not exist, please re-acquire it in manifest.json"

During local Web development you can set `appid` in `manifest.json` to an empty string `""`. Before cloud-packaging an App, obtain a real one from [dev.dcloud.net.cn](https://dev.dcloud.net.cn/).

## The local port is taken by another project

When multiple projects share the same machine, Vite's default port 5173 may be grabbed by another dev server (the log looks normal but the page content belongs to a different project). Specify the port explicitly in `manifest.json`:

```json
{
	"web": {
		"devServer": {
			"port": 5174
		}
	}
}
```

## The theme doesn't change after editing uni.scss

`uni.scss` is injected at compile time and does **not** participate in hot updates. After changing variables you must restart the dev server (stop it first, then `launch web` again).

## In-page navigation with # in the URL doesn't work on Web

When `web.router.mode` in `manifest.json` is set to `history`, routing reads the URL pathname (e.g. `http://localhost:5174/pages-sub/button/button`) and the hash part after `#` is ignored. Use the pathname form when sharing or bookmarking page links.

## How do I enable vapor mode?

See [Platform Compatibility · Vapor Mode](/en/guide/compatibility#vapor-mode).

## Next Steps

- [Theming](/en/guide/theming): the full guide to variable overrides
- [GitHub Discussions](https://github.com/MengXi-Studio/unix-ui/discussions): ask about anything not covered here
