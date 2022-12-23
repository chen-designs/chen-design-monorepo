import { extend } from 'lodash-es'
import type { BaseOptions, NodeOptions, LinkOptions, GroupOptions } from './types'

export const defaultOptions: BaseOptions = { active: '#2D8CF0', light: '#ED4014', border: '#DCDEE2', color: '#999999', background: 'white', font: '14px snas-serif', zOrder: 1 }

export function groupOptions({ group }: { group: GroupOptions }) {
	return extend({ zOrder: 1 }, defaultOptions, group || {}) as GroupOptions
}

export function nodeOptions({ node }: { node: NodeOptions }) {
	return extend({ zOrder: 5, size: 70, shape: 'Circle', shapeIsMain: 'RoundedRectangle' }, defaultOptions, node || {}) as NodeOptions
}

export function linkOptions({ link }: { link: LinkOptions }) {
	return extend({ zOrder: 3 }, defaultOptions, link || {}) as LinkOptions
}
