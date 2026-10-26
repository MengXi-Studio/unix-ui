import { onContentUpdated } from 'vitepress'

/** 「代码演示」区间起始 h2 文案（中英双语文档各取其一） */
const DEMO_HEADINGS = new Set(['代码演示', 'Examples'])

/** 区间终点 h2 文案（API 段起始，中英一致） */
const END_HEADING = 'API'

/** 标题锚点与零宽字符（header-anchor 内的 # 与 U+200B 系字符不参与文本比较） */
const INVISIBLE_RE = /[\u200B-\u200F\uFEFF]/g

/**
 * 提取标题的纯文本（剥离 header-anchor 与零宽字符后 trim）
 *
 * @param el 标题元素
 */
function headingText(el: Element): string {
	const clone = el.cloneNode(true) as Element
	clone.querySelector('.header-anchor')?.remove()
	return (clone.textContent || '').replace(INVISIBLE_RE, '').trim()
}

/**
 * 判断元素是否为指定文案的 h2
 *
 * @param el 待判定元素
 * @param text 目标标题文案
 */
function isHeading(el: Element, text: string): boolean {
	return el.tagName === 'H2' && headingText(el) === text
}

/**
 * 向单个代码块注入折叠按钮（默认展开，点击切换 collapsed 类）
 *
 * @param block VitePress 代码块根节点（div[class*='language-']）
 * @param zh 是否使用中文按钮文案
 */
function injectToggle(block: HTMLElement, zh: boolean): void {
	if (block.querySelector('.vp-code-collapse')) return
	const btn = document.createElement('button')
	btn.type = 'button'
	btn.className = 'vp-code-collapse'
	btn.setAttribute('aria-expanded', 'true')

	/** 按折叠态同步按钮文案与 aria 属性 */
	const syncLabel = () => {
		const collapsed = block.classList.contains('collapsed')
		btn.textContent = collapsed ? (zh ? '展开代码' : 'Expand') : zh ? '收起代码' : 'Collapse'
		btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true')
	}
	btn.addEventListener('click', () => {
		block.classList.toggle('collapsed')
		syncLabel()
	})
	syncLabel()
	block.insertBefore(btn, block.firstChild)
}

/**
 * 组件页代码演示区折叠增强
 *
 * 内容更新后在「代码演示」h2 与 API h2 区间内的代码块注入折叠按钮；
 * 仅由演示页挂载的 DemoPhone 注册，非演示页无副作用
 *
 * @param getZh 返回当前界面是否为中文（决定按钮文案语言）
 */
export function setupCodeCollapse(getZh: () => boolean): void {
	onContentUpdated(() => {
		const doc = document.querySelector('.vp-doc')
		if (!doc) return

		/** 定位「代码演示」h2，未找到（非组件文档结构）则跳过 */
		let demoHeading: Element | null = null
		for (const h2 of doc.querySelectorAll('h2')) {
			if (DEMO_HEADINGS.has(headingText(h2))) {
				demoHeading = h2
				break
			}
		}
		if (!demoHeading) return

		/** 遍历区间内兄弟节点，向代码块注入折叠按钮 */
		let node: Element | null = demoHeading.nextElementSibling
		while (node && !isHeading(node, END_HEADING)) {
			if (node.matches('div[class*="language-"]')) injectToggle(node as HTMLElement, getZh())
			node = node.nextElementSibling
		}
	})
}
