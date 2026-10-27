/**
 * 同步 core 组件包到 playground / 其他 uni-app x 工程
 *
 * 用法：
 *   node scripts/sync-uni-components.mjs           # 复制（增量覆盖）
 *   node scripts/sync-uni-components.mjs --check   # 仅校验一致性（CI / precommit）
 *
 * 原理：packages/core 本身就是标准 uni_modules 组件插件目录（components/ 结构），
 * 直接复制为 playground/uni_modules/m-ui-x；HBuilderX 编译只扫描
 * 工程 uni_modules/ 目录，node_modules 内的组件不被 easycom 识别。
 *
 * 注意：插件目录名必须为 m-ui-x（DCloud 插件市场 id，x 后缀
 * 呼应 uni-app x 生态命名）；dest 侧 package.json、changelog.md、
 * README.md 为 playground 侧手工维护（插件市场要求的格式与
 * npm 包不同），同步时保留、不参与复制与校验。
 */
import { cpSync, existsSync, rmSync, readdirSync, statSync, readFileSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'packages/core')
const dest = join(root, 'packages/playground/uni_modules/m-ui-x')

/** 插件目录同步这些内容（组件源码 + 主题变量 + 字体等静态资源 + 标准协议文件）；
 *  README 不同步：npm 包侧文件与 DCloud 插件市场要求的格式不一致，
 *  插件侧单独生成维护（见 KEEP） */
const INCLUDE = ['components', 'theme', 'static', 'LICENSE']

/** 同步时需在目标目录保留的手工维护文件（不复制、不删除、校验豁免）：
 *  - package.json：HBuilderX 插件发布要求 id 为 m-ui-x，与 core（npm 包）元数据不同
 *  - changelog.md：core 无此文件，仅 playground 侧维护
 *  - README.md：插件市场格式与 npm 包不同，插件侧单独生成维护 */
const KEEP = ['package.json', 'changelog.md', 'README.md']

/** 列出目录下全部相对文件；filterTop 为 true 时仅统计 INCLUDE 白名单内的顶层条目（与复制 filter 语义一致） */
function listFiles(dir, filterTop = false) {
	const out = []
	if (!existsSync(dir)) return out
	for (const name of readdirSync(dir)) {
		if (name === 'node_modules' || name === 'unpackage' || name === '.DS_Store') continue
		if (filterTop && !INCLUDE.includes(name)) continue
		const p = join(dir, name)
		if (statSync(p).isDirectory()) out.push(...listFiles(p).map(f => join(name, f)))
		else out.push(name)
	}
	return out.sort()
}

/** 哈希目录树；exclude 中的相对路径不参与（用于豁免手工维护文件） */
function hashTree(base, filterTop = false, exclude = []) {
	const hash = createHash('sha256')
	for (const rel of listFiles(base, filterTop)) {
		if (exclude.includes(rel)) continue
		hash.update(rel)
		hash.update(readFileSync(join(base, rel)))
	}
	return hash.digest('hex')
}

const check = process.argv.includes('--check')
if (!existsSync(src)) {
	console.error(`[sync] 源目录不存在: ${src}`)
	process.exit(1)
}

if (check) {
	/** 源侧按白名单过滤（INCLUDE 外文件不参与校验）；
	 *  目标侧全量校验（可发现白名单外的多余文件），仅豁免手工维护的 KEEP 文件 */
	const complete = existsSync(dest) && KEEP.every(name => existsSync(join(dest, name)))
	const same = complete && hashTree(src, true) === hashTree(dest, false, KEEP)
	console.log(same ? '[sync] playground 插件与 core 一致' : complete ? '[sync] playground 插件与 core 不一致（需执行 pnpm sync:uni-modules）' : `[sync] playground 插件缺失或缺少手工维护文件（${KEEP.join(', ')}）`)
	process.exit(same ? 0 : 1)
}

/** 清空目标目录但保留手工维护文件（rmSync 整目录会连带删掉 dest/package.json） */
if (existsSync(dest)) {
	for (const name of readdirSync(dest)) {
		if (KEEP.includes(name)) continue
		rmSync(join(dest, name), { recursive: true, force: true })
	}
}
cpSync(src, dest, {
	recursive: true,
	filter: from => {
		const rel = from.slice(src.length + 1)
		if (rel === '') return true
		return INCLUDE.includes(rel.split(/[\\/]/)[0])
	}
})
console.log('[sync] 已同步 packages/core → packages/playground/uni_modules/m-ui-x（手工维护文件已保留）')
