import { defineConfig } from 'vite'
import uniDefault from '@dcloudio/vite-plugin-uni'
import { routeGen } from './uni_modules/ux-router/plugins/index.mjs'

// ESM 加载时默认导出是模块命名空间对象，真正的函数在 .default 上
const uni = (uniDefault as unknown as { default?: typeof uniDefault }).default ?? uniDefault

export default defineConfig({
	plugins: [
		routeGen({
			verbose: true,
			pages: {
				pagesDir: 'pages',
				// 演示页按组件分类拆分为 8 个分包（与首页分组、docs 侧栏一一对应，组内页名不变）
				subPackages: [
					{ root: 'pages-sub/basic', dir: 'pages-sub/basic' },
					{ root: 'pages-sub/layouts', dir: 'pages-sub/layouts' },
					{ root: 'pages-sub/form', dir: 'pages-sub/form' },
					{ root: 'pages-sub/pickers', dir: 'pages-sub/pickers' },
					{ root: 'pages-sub/datetime', dir: 'pages-sub/datetime' },
					{ root: 'pages-sub/feedback', dir: 'pages-sub/feedback' },
					{ root: 'pages-sub/display', dir: 'pages-sub/display' },
					{ root: 'pages-sub/nav', dir: 'pages-sub/nav' }
				],
				entryPage: 'pages/index/index',
				tabBar: {
					color: '#7A7E83',
					selectedColor: '#007AFF',
					backgroundColor: '#FFFFFF'
				},
				dts: 'types/define-uni-page.d.ts'
			},
			router: {
				outputPath: 'router/routes.gen.uts',
				importFrom: '@/uni_modules/ux-router/utssdk/index.uts',
				dts: 'types/route-name.gen.d.ts'
			}
		}),

		uni()
	]
})
