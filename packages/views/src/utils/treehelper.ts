import { cloneDeep, each, extend, filter, omit, random, times } from 'lodash-es'
import { Nil, Data } from './types'

export type TreeOptions = {
	cloned: boolean
	defId: any
	idKey: string
	parentKey: string
	childKey: string
	levelKey: string
}

export type TreeNode<T> = { [k in keyof T]: T[k] | Nil } & {
	// [k: string]: any
	id: any
	parentId?: any
	level?: number
	children?: TreeNode<T>[]
}

export type ToTreeProcress<T> = (data: T, parent?: TreeNode<T>, idmaps?: Map<string | number, T>, children?: T[]) => T | void
export type ToListProcress<T> = (data: T, parent?: T, children?: T[]) => T | void

/**
 * 默认选项
 */
const defaultOptions: TreeOptions = {
	cloned: true,
	defId: '0',
	idKey: 'id',
	parentKey: 'parentId',
	childKey: 'children',
	levelKey: 'level'
}

/**
 * 将对象数组转换成树形结构数组
 * @param list 对象数组
 * @param options 配置选项
 * @param procress 节点处理函数
 * @returns 树结构数组
 */
export function toTree<T extends Data>(list: Array<T>, options?: TreeOptions, procress?: ToTreeProcress<T>): TreeNode<T>[] {
	// 配置信息
	const { cloned, idKey, parentKey, childKey, levelKey, defId } = extend({}, defaultOptions, options || {})
	// 处理函数
	const handler = procress || (() => {})
	// 节点 ID 映射
	const idmaps = new Map<string | number, T>()
	// 子节点集合
	const childs = new Map<string | number, T[]>()
	// 克隆一份数据
	const clones = (list || []).map((item: any) => {
		const data = cloned ? cloneDeep(item) : item
		// 添加 ID 对 data 的映射
		idmaps.set((data[idKey] = data[idKey] || defId), data)
		// 添加 parentId 对子节点的映射
		const pId = data[parentKey]
		if (!childs.has(pId)) childs.set(pId, [data])
		else childs.get(pId)!.push(data)
		// 返回克隆数据
		return data
	})
	// 获取顶级节点
	const nodes = filter(clones, item => !idmaps.has(item[parentKey]))
		// 调用 handler 处理节点
		.map(item => handler(item, {} as any, idmaps, childs.get(item[parentKey])) || item)
	// 创建迭代集合
	const iterator = Array.from(nodes)
	// 遍历节点
	while (iterator.length > 0) {
		// 获取当前节点
		const current = iterator.shift() as any
		// 设置节点等级
		current[levelKey] = current[levelKey] || 0
		// 设置子节点
		current[childKey] = current[childKey] || []
		// 遍历子节点
		each(childs.get(current[idKey]), (node: any) => {
			// 设置节点等级
			node[levelKey] = current[levelKey] + 1
			// 处理节点
			const data = handler(node, current, idmaps, childs.get(node[idKey])) || node
			// 将节点添加父节点中
			current[childKey].push(data)
			// 将 node 添加到 iterator 数据中用于迭代
			iterator.push(data)
		})
	}
	// 返回节点
	return nodes as Array<TreeNode<T>>
}

/**
 * 将树结构数组装换成对象数组
 * @param nodes 树结构数组
 * @param options 配置选项
 * @param procress 节点处理函数
 * @returns 对象数组
 */
export function toList<T extends TreeNode<Data>>(nodes: T[], options?: Pick<TreeOptions, 'childKey'>, procress?: ToListProcress<T>) {
	// 配置信息
	const { cloned, childKey } = extend({}, defaultOptions, options || {})
	// 处理函数
	const handler = procress || (() => {})
	// 要返回的对象数组
	const list = [] as Array<Omit<T, 'children'>>
	// 父节点
	let parent = {} as T
	// 遍历节点
	each(nodes, function recur(node) {
		const item: any = cloned ? omit(cloneDeep(node), [childKey]) : (delete node[childKey], node)
		// 调用 handler 处理节点
		const data = handler(item, parent, node[childKey] || []) || item
		// 添加到对象数组中
		list.push(data as any)
		// 设置父节点
		parent = data
		// 递归子节点
		each(node[childKey], recur)
	})
	// 返回对象数据
	return list
}

/**
 * 将对象数组转换成对象数组
 * @param list 对象数组
 * @param options 配置选项
 * @param procress 节点处理函数
 * @returns 对象数组
 */
export function asList<T extends Data>(list: Array<T>, options?: TreeOptions, procress?: ToTreeProcress<T>) {
	// 配置信息
	const { cloned, idKey, parentKey, levelKey, defId } = extend({}, defaultOptions, options || {})
	// 处理函数
	const handler = procress || (() => {})
	// 节点 ID 映射
	const idmaps = new Map<string | number, T>()
	// 子节点集合
	const childs = new Map<string | number, T[]>()
	// 克隆一份数据
	const clones = (list || []).map((item: any) => {
		const data = cloned ? cloneDeep(item) : item
		// 添加 ID 对 data 的映射
		idmaps.set((data[idKey] = data[idKey] || defId), data)
		// 添加 parentId 对子节点的映射
		const pId = data[parentKey]
		if (!childs.has(pId)) childs.set(pId, [data])
		else childs.get(pId)!.push(data)
		// 返回克隆数据
		return data
	})
	// 返回结果
	const results = filter(clones, item => !idmaps.has(item[parentKey]))
		// 调用 handler 处理节点
		.map(item => handler(item, {} as any, idmaps, childs.get(item[parentKey])) || item)
	// 创建迭代集合
	const iterator = Array.from(results)
	// 遍历节点
	while (iterator.length > 0) {
		// 获取当前节点
		const current = iterator.shift() as any
		// 设置节点等级
		current[levelKey] = current[levelKey] || 0
		// 遍历子节点
		each(childs.get(current[idKey]), (node: any) => {
			// 设置节点等级
			node[levelKey] = current[levelKey] + 1
			// 处理节点
			const data = handler(node, current, idmaps, childs.get(node[idKey])) || node
			// 将节点添加返回结果中
			results.push(data)
			// 将 node 添加到 iterator 数据中用于迭代
			iterator.push(data)
		})
	}
	// 返回节点
	return results as Array<T & Omit<TreeNode<T>, 'children'>>
}

/**
 * 查找节点
 * @param nodes 树结构数组
 * @param predicate 自定义节点查找方法
 * @returns
 */
export function findNodes<T extends TreeNode<Data>>(nodes: T[], predicate: (node: T, parent?: T) => boolean) {
	const finder = (items: T[], parent?: T, results: T[] = []) => {
		// 遍历节点
		each(items, (node: T) => {
			if (predicate(node, parent)) results.push(node)
			// 递归查找子节点
			finder(node.children as T[], node, results)
		})
		// 返回结果
		return results
	}
	return finder(nodes)
}

/**
 * 过滤节点
 * @param nodes 树结构数组
 * @param predicate 自定义节点过滤方法
 * @returns 过滤后的节点数组
 */
export function filterNodes<T extends TreeNode<Data>>(nodes: T[], predicate: (node: T, parent?: T) => boolean) {
	const filterate = (items: T[], parent?: T, results: T[] = []) => {
		// 遍历节点
		each(items, (node: T) => {
			const children = filterate(node.children as T[], node)
			if (children.length !== 0 || predicate(node, parent)) {
				results.push({ ...node, children })
			}
		})
		// 返回结果
		return results
	}
	return filterate(nodes)
}

/**
 * 生成树结构数据
 * @param options 配置选项
 * @param creater 自定义节点生成方法
 * @returns 树结构数组
 */
export function makeTrees<T extends Data>(
	options?: {
		count?: number | [min: number, max: number]
		depth?: number | [min: number, max: number]
	},
	creater?: (index: number, parent?: any) => T
) {
	const { count, depth } = extend({ count: [1, 5], depth: [2, 4] }, options || {})
	const [min, max] = (Number.isInteger(count) ? [count, count] : count) as Array<number>
	const [dmin, dmax] = (Number.isInteger(depth) ? [depth, depth] : depth) as Array<number>
	const _random = (min: number, max: number) => Math.floor(random(min, max))
	const generator = creater || ((index: number, { id } = {}): Data => ({ id: `${index}`, name: `节点 ${index}`, parentId: `${id ?? 0}` }))

	let len = 1

	const make = (level: number, parent?: any): any[] => {
		if (level <= 0) return []
		return times(_random(min, max), () => {
			const node = extend({ id: len }, generator(len++, parent))
			return extend(node, {
				id: node.id ?? len,
				parentId: node.parentId ?? parent?.id,
				children: make(level - 1, node)
			})
		})
	}

	return make(_random(dmin, dmax)) as TreeNode<T>[]
}
