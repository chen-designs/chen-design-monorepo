import { first, last, sortBy } from 'lodash-es'
import type { Node } from 'gojs'
import type { FindMode, FindPathReult } from './types'

export function findDfs(from: Node, to: Node, limit: number): FindPathReult[] {
	// 递归获取节点路径
	const deepParents = function deepParents({ parent, node, link }: { parent: any; node: any; link: any }, { parts = [] as any[], datas = [] as any[] }) {
		if (parent) {
			parts.unshift(link, node)
			datas.unshift(link.data, node.data)
			// 递归调用
			deepParents(parent, { parts, datas })
		} else {
			parts.unshift(node)
			datas.unshift(node.data)
		}
		return { parts, datas }
	}
	// 创建节点路径信息
	const makePath = function (paths: any[], details: any) {
		const { parts, datas } = deepParents(details, { parts: [], datas: [] })
		paths.push({ parts, datas, from: first(parts), to: last(parts), setps: parts.length, count: Math.round(parts.length / 2) })
	}
	// 递归寻找路径
	const finder = function finder(paths: any[], start: any, end: any, caches: any) {
		const parent = start.parent || {}
		// 判断起点是否为空或者是否超出 limit 限制
		if (!start.node || paths.length >= limit) return paths
		// 获取节点关系
		for (let it = start.node.linksConnected; it.next() && paths.length < limit; ) {
			const [link, fnode, tnode] = [it.value, it.value.fromNode, it.value.toNode]
			// 判断是否等起点
			if (parent.node === fnode || parent.node === tnode) continue
			// 临时对象
			let tn = fnode === end ? fnode : tnode
			// 判断
			if (fnode === end || tnode === end) {
				makePath(paths, { parent: start, node: tn, data: tn.data, link })
			} else if ((tn = fnode === start.node ? tnode : fnode) && tn.__gohashid && !caches[tn.__gohashid]) {
				finder(paths, { parent: start, node: tn, data: tn.data, link }, end, Object.assign({}, caches, { [tn.__gohashid]: true }))
			}
		}
		// 返回路径
		return paths
	}
	// 查找路径
	const paths = finder([], { node: from }, to, { [(from as any).__gohashid]: true })
	// 按路径排序
	return sortBy(paths, ({ count }) => count)
}

export function findBfs(from: Node, to: Node, limit: number): FindPathReult[] {
	// TODO: 以后实现
	return findDfs(from, to, limit)
}

export function findPaths(mode: FindMode, from: Node, to: Node, limit: number): FindPathReult[] {
	if (mode === 'bfs') return findBfs(from, to, limit)
	return findDfs(from, to, limit)
}
