import { compact, castArray, each, map, last } from 'lodash-es'
import { h, Text, VNode, Slots, isVNode, Comment, Fragment, Component, mergeProps, VNodeProps, cloneVNode } from 'vue'
import { isArray, isEmpty, isFunction, isValid } from './is'
import { prefixName } from './config'
import { Data, SlotRender } from './types'
import { hide } from '@popperjs/core'

export enum ShapeFlags {
	ELEMENT = 1,
	FUNCTIONAL_COMPONENT = 1 << 1,
	STATEFUL_COMPONENT = 1 << 2,
	TEXT_CHILDREN = 1 << 3,
	ARRAY_CHILDREN = 1 << 4,
	SLOTS_CHILDREN = 1 << 5,
	TELEPORT = 1 << 6,
	SUSPENSE = 1 << 7,
	COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
	COMPONENT_KEPT_ALIVE = 1 << 9,
	COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT
}

export const isOn = (value: any): value is string => /^on[^a-z]/.test(value)

export const isVnode = (node: any): node is VNode => isVNode(node)

export const isText = (node: any): node is VNode => {
	return Boolean(node && node.shapeFlag & ShapeFlags.TEXT_CHILDREN)
}

export const isComment = (node: any): node is VNode => {
	return isVNode(node) && node.type === Comment
}

export const isHide = (node: any): node is VNode => {
	return isVNode(node) && (node.type as { name: string }).name === prefixName('When') && (node.props?.hide === '' || (node.props?.hide ?? false))
}

export const isFragment = (node: any): node is VNode => {
	return isVNode(node) && node.type === Fragment
}

export const isTemplate = (node: any): node is VNode => {
	return isVNode(node) && node.type === 'template'
}

export const isComponent = (node: any): node is Component => {
	return Boolean(node && node.shapeFlag & ShapeFlags.COMPONENT)
}

export const isElement = (vnode: any): vnode is HTMLElement => {
	return vnode instanceof HTMLElement
}

export const renderText = (text: any): VNode => h(Text, text ?? '')

export function renderIf(cond: any, success?: SlotRender, failure?: SlotRender) {
	// return (isBoolean(cond) ? cond : isValid(cond)) ? success?.(cond) : failure?.()
	return isValid(cond) ? success?.(cond) : failure?.()
}

export function renderSlot<T extends Slots, K extends keyof T>(slots: T, name?: K, options?: SlotRender | any, fallback?: SlotRender): VNode[] | VNode | null | undefined {
	if (isFunction(options)) {
		fallback = options
		options = {}
	}

	const render = slots[name || 'default'] || fallback

	if (!isFunction(render)) return null

	return render(options || {})
}

export function renderSlots<T extends Slots, K extends keyof T>(slots: T, name?: K, options?: any, fallback?: SlotRender): VNode[] {
	return compact(castArray(renderSlot(slots, name, options, fallback))) as VNode[]
}

export function findDomNode(instance: any): HTMLElement {
	let node = instance?.vnode?.el || (instance && (instance.$el || instance))
	while (node && !node.tagName) {
		node = node.nextSibling
	}
	return node
}

export function firstVNode(children: VNode[]): VNode | undefined {
	if (!children || isEmpty(children)) return undefined

	for (const child of children) {
		if (isElement(child) || isComponent(child)) return child
		if (child.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			const result = firstVNode(child.children as [])
			if (result) return result
		}
		if (child.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
			const result = firstVNode((child.children as Slots).default?.() || [])
			if (result) return result
		}
		if (isArray(child)) return firstVNode(child)
	}

	return undefined
}

export function firstElement(children: VNode[]): HTMLElement {
	return firstVNode(children)?.el as HTMLElement
}

export function allElements(vnodes: VNode[] | undefined, includeText = true) {
	const results: VNode[] = []

	for (const node of vnodes ?? []) {
		if (isElement(node) || isComponent(node) || (includeText && isText(node))) {
			if (!(isComment(node) || isHide(node))) results.push(node)
		} else if (node.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			results.push(...allElements(node.children as [], includeText))
		} else if (node.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
			results.push(...allElements((node.children as Slots).default?.(), includeText))
		} else if (isArray(node)) {
			results.push(...allElements(node, includeText))
		}
	}

	return results
}
