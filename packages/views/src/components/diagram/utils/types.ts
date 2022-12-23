import type { Key, DiagramInitOptions, Node, Link, Part } from 'gojs'
import type { Data } from '../../../utils/types'

export type FindMode = 'dfs' | 'bfs'
export type FindPathReult = {
	datas: Array<NodeData | LinkData>
	parts: Array<Node | Link>
	count: number
	setps: number
	from: Node
	to: Node
}

export type LayoutType = 'default' | 'forceLayout' | 'layeredLayout' | 'treeLayout' | 'gridLayout' | 'circularLayout'

export type DiagramOptions = {
	options: DiagramInitOptions | { node: NodeOptions; link: LinkOptions }
	defaultLayout: LayoutType
	allowZoom: boolean
	scale: number
	minScale: number
	maxScale: number
	edges: number
}

export type BaseOptions = {
	// 选中颜色
	active: string
	// 高亮颜色
	light: string
	// 边框颜色
	border: string
	// 字体颜色
	color: string
	// 背景颜色
	background: string
	// 字体大小
	font: string
	// 堆叠层级
	zOrder: number
}
export type GroupOptions = BaseOptions
export type NodeOptions = BaseOptions & { size: number; shape: string; shapeIsMain: string }
export type LinkOptions = BaseOptions

export type ObjectType = 'DIAGRAM' | 'GROUP' | 'NODE' | 'LINK'

export type ModelData = {
	[index: string]: any
	key: Key
	category?: string
	keywords?: string
	text?: string
	data?: Data
}

export type NodeData = ModelData & {
	etype: ObjectType
	main?: boolean
	isGroup?: boolean
	group?: string
}

export type LinkData = ModelData & {
	etype: ObjectType
	from: Key
	to: Key
	fromArrow: string
	toArrow: string
}

export type ImageOptions = {
	parts?: Part[]
	scale?: number
	padding?: number
	details?: number
	background?: string
	type?: 'image/jpeg' | 'image/png' | 'image/webp'
	returnType?: 'blob' | 'string' | 'Image' | 'ImageData'
	filename?: string
}

export type TaskOptions = {
	key?: string | number
	name: string
	priority?: number
	abort?: AbortController
}
