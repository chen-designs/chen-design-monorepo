import { camelize } from 'vue'
import { isString, isServer } from './is'

const trim = (str: string) => String(str || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')

export type IElement = HTMLElement | Document | Window | undefined
export type IEventKey = keyof HTMLElementEventMap
export type IEventListener<E extends IEventKey> = (ev: HTMLElementEventMap[E]) => void

export function on<E extends IEventKey>(el: IElement, event: E, handler: IEventListener<E>, useCapture: boolean | AddEventListenerOptions = false) {
	if (el && event && handler) {
		el?.addEventListener(event, handler as EventListenerOrEventListenerObject, useCapture)
	}
	return () => off(el, event, handler, useCapture)
}

export function off<E extends IEventKey>(el: IElement, event: E, handler: IEventListener<E>, useCapture: boolean | AddEventListenerOptions = false) {
	if (el && event && handler) {
		el?.removeEventListener(event, handler as EventListenerOrEventListenerObject, useCapture)
	}
}

export function once<E extends IEventKey>(element: IElement, event: E, handler: IEventListener<E>, options: boolean | AddEventListenerOptions = false) {
	const listener = function wrap(this: any, ...args: any) {
		off(element, event, listener)
		if (handler) handler.apply(this, args)
	}
	on(element, event, listener, options)
}

export function stopEvent(event: Event) {
	if (event instanceof Event) event.stopPropagation()
	return event
}

export function hasClass(el: Element, cls: string): boolean {
	if (!el || !cls) return false

	const classes = trim(cls).split(' ')

	return classes.some(value => {
		const items = value.replace(/^\.+/, '').split('.')

		return items.every(name => {
			const clsname = trim(name)
			if (el.classList) return el.classList.contains(clsname)
			return String(` ${el.className} `).indexOf(` ${clsname} `) > -1
		})
	})
}

export function addClass(el: Element, cls: string) {
	if (!el) return
	let curClass = el.className
	const classes = (cls || '').split(' ')

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i]
		if (!clsName) continue

		if (el.classList) {
			el.classList.add(clsName)
		} else if (!hasClass(el, clsName)) {
			curClass += ` ${clsName}`
		}
	}
	if (!el.classList) {
		el.className = curClass
	}
}

export function removeClass(el: Element, cls: string) {
	if (!el || !cls) return
	const classes = cls.split(' ')
	let curClass = ` ${el.className} `

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i]
		if (!clsName) continue

		if (el.classList) {
			el.classList.remove(clsName)
		} else if (hasClass(el, clsName)) {
			curClass = curClass.replace(` ${clsName} `, ' ')
		}
	}
	if (!el.classList) {
		el.className = trim(curClass)
	}
}

export function getStyle(el: HTMLElement, name: string, pseudo?: string) {
	const prop = camelize(name)

	if (pseudo) return getComputedStyle(el, pseudo)[prop as any]

	return el.style[prop as any]
}

export function contains(element?: HTMLElement, target?: HTMLElement) {
	if (!element || !target) return false
	return element.contains(target)
}

export function isSelector(el: HTMLElement, selector: string | HTMLElement) {
	if (!(el instanceof HTMLElement || selector)) return false

	if (typeof selector === 'string') {
		if (/^#/.test(trim(selector))) return el.id === selector.replace('#', '')
		return hasClass(el, selector)
	}

	return el === selector
}

export const querySelector = (selectors: string, container?: Document | HTMLElement) => {
	if (isServer) return undefined

	return (container ?? document).querySelector<HTMLElement>(selectors) ?? undefined
}

export const getElement = (target: string | HTMLElement | undefined, container?: Document | HTMLElement): HTMLElement | undefined => {
	if (isString(target)) {
		return querySelector(target[0] === '#' ? `[id='${target.slice(1)}']` : target, container)
	}
	return target
}
