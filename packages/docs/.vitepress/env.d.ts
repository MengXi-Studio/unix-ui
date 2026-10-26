/**
 * Vite 构建期环境类型补充
 *
 * docs 包未直接依赖 vite，无法引用 vite/client 类型；
 * 此处按其同构形态声明，供主题组件消费 import.meta.env
 */
interface ImportMetaEnv {
	/** 是否为开发模式（构建期静态替换） */
	readonly DEV: boolean
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
