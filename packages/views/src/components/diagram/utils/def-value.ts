import { orderBy, defaults, trim, isNil, uniqueId } from 'lodash-es'
import type { Key } from 'gojs'
import type { Data } from '../../../utils/types'
import type { NodeData, LinkData, ImageOptions } from './types'

export function defValue(value: any, ...args: any[]): any {
	if (!args.length) return value
	const [first, ...rest] = args
	return isNil(value) || !trim(String(value ?? '')) ? defValue.apply(null, [first, ...rest]) : value
}

export function defId(data: NodeData | LinkData): Key {
	const { key, from, to } = data || {}
	if (!(from && to)) return key || uniqueId('N')
	return orderBy([from, to], [value => value], ['asc']).join('-')
}

export function defNode(data: NodeData, extra?: Data) {
	return defaults(data, {
		category: void 0,
		key: defId(data),
		etype: 'NODE',
		keywords: void 0,
		text: '节点',
		image: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
		extra: extra || {}
	})
}

export function defLink(data: LinkData, extra?: Data) {
	return defaults(data, {
		category: void 0,
		key: defId(data),
		etype: 'LINK',
		keywords: void 0,
		from: 'from-node',
		to: 'to-node',
		text: '关系',
		extra: extra || {}
	})
}
