/**
 * 构建组件演示（playground）并部署到文档站静态目录
 *
 * 产物随文档站同站发布（packages/docs/src/public/playground，VitePress srcDir
 * 下的 public 目录），供文档站生产环境 iframe 加载演示页；本地开发文档站
 * iframe 直连 dev server，不经过本脚本。
 *
 * 流程：
 * 1. HBuilderX CLI `cli publish web` 构建 playground
 * 2. 产物拷贝至 packages/docs/src/public/playground
 * 3. 资源引用路径补齐部署前缀（vite base 未生效时的兜底）
 * 4. 为每个 pages-sub 演示页生成深链静态目录（history 路由在无子目录
 *    404 兜底能力的托管环境如 GitHub Pages 下可直接命中）
 * 5. 复制 index.html 为 404.html，兜底其余 history 路由深链
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const playgroundDir = path.join(root, 'packages/playground')
const buildOutDir = path.join(playgroundDir, 'unpackage/dist/build/web')
const targetDir = path.join(root, 'packages/docs/src/public/playground')

/** 演示部署子路径（与 docs 构建默认 DEMO_BASE 保持一致） */
const DEMO_BASE = '/unix-ui/playground/'

/**
 * 递归收集目录下全部文件绝对路径
 *
 * @param {string} dir 起始目录
 * @returns {string[]} 文件路径列表
 */
function collectFiles(dir) {
	const out = []
	for (const name of readdirSync(dir)) {
		const full = path.join(dir, name)
		if (statSync(full).isDirectory()) out.push(...collectFiles(full))
		else out.push(full)
	}
	return out
}

/**
 * 产物资源引用路径补齐部署前缀
 *
 * 仅处理以 "/assets/、'/assets/、(/assets/ 形式出现的构建资源引用，
 * 应用内静态资源（static/）不匹配、不受影响
 *
 * @param {string[]} files 产物文件列表
 */
function rewriteBase(files) {
	const pattern = /(["'(])\/assets\//g
	let touched = 0
	for (const file of files) {
		if (!/\.(html|js|css)$/.test(file)) continue
		const content = readFileSync(file, 'utf8')
		const replaced = content.replace(pattern, `$1${DEMO_BASE}assets/`)
		if (replaced !== content) {
			writeFileSync(file, replaced)
			touched++
		}
	}
	console.log(`[build-demo] 资源路径补前缀：${touched} 个文件`)
}

/**
 * 解析 HBuilderX CLI 可执行文件：优先环境变量 HBUILDERX_CLI，
 * 其次常见安装路径，均未命中时回退 PATH 中的 cli
 *
 * @returns {string} cli 可执行文件路径
 */
function resolveCli() {
	const candidates = [
		process.env.HBUILDERX_CLI,
		'/Applications/HBuilderX.app/Contents/MacOS/cli',
		path.join(process.env.HOME || '', 'Applications/HBuilderX.app/Contents/MacOS/cli')
	].filter(Boolean)
	for (const p of candidates) {
		if (existsSync(p)) return p
	}
	return 'cli'
}

/**
 * 收集全部组件演示页的 history 路由路径
 *
 * 约定：pages-sub 下每个子目录 <name> 若存在同名 <name>.uvue，
 * 则演示页路由为 pages-sub/<name>/<name>，与文档 frontmatter.demo 一致
 *
 * @returns {string[]} 演示页路由路径列表
 */
function collectDemoPages() {
	const base = path.join(playgroundDir, 'pages-sub')
	if (!existsSync(base)) return []
	const out = []
	for (const name of readdirSync(base)) {
		const dir = path.join(base, name)
		if (statSync(dir).isDirectory() && existsSync(path.join(dir, name + '.uvue'))) {
			out.push('pages-sub/' + name + '/' + name)
		}
	}
	return out
}

function main() {
	console.log('[build-demo] 构建 playground ...')
	execSync(`"${resolveCli()}" publish web --project "${playgroundDir}"`, { stdio: 'inherit', cwd: root })

	if (!existsSync(path.join(buildOutDir, 'index.html'))) {
		console.error(`[build-demo] 构建产物缺失：${buildOutDir}`)
		process.exit(1)
	}

	console.log('[build-demo] 拷贝产物至 docs public ...')
	rmSync(targetDir, { recursive: true, force: true })
	mkdirSync(path.dirname(targetDir), { recursive: true })
	cpSync(buildOutDir, targetDir, { recursive: true })

	const files = collectFiles(targetDir)
	rewriteBase(files)

	// 深链静态化：为每个演示页生成目录 + index.html（SPA 入口，资源以 base 绝对路径引用）
	console.log('[build-demo] 生成演示页深链目录 ...')
	for (const page of collectDemoPages()) {
		const dir = path.join(targetDir, page)
		mkdirSync(dir, { recursive: true })
		copyFileSync(path.join(targetDir, 'index.html'), path.join(dir, 'index.html'))
	}

	// history 路由深链兜底：静态托管 404 时回退到 SPA 入口
	copyFileSync(path.join(targetDir, 'index.html'), path.join(targetDir, '404.html'))

	console.log(`[build-demo] 完成：${targetDir}（${files.length} 个文件）`)
}

main()
