import type EventEmitter from 'eventemitter3'
import { InjectionKey, ShallowRef } from 'vue'
import type { Diagram, Link, Node } from 'gojs'
import type { Func, Nil } from '../../utils/types'
import type { LinkOptions, NodeOptions } from './utils/types'

export interface DiagramInstance {
	$el: HTMLDivElement
	use(callback: (self: this, diagram: Diagram) => any): any
	emitter(callback?: (emitter: EventEmitter) => any): any
	diagram(handler?: Diagram | ((diagram: Diagram) => any)): any
	nodemap(name: string | Nil, template: Node | ((options: NodeOptions) => Node)): any
	linkmap(name: string | Nil, template: Link | ((options: LinkOptions) => Link)): any
	// 监听事件
	on(name: string, handler: Func): this
	// 监听一次性事件
	once(name: string, handler: Func): this
	// 注销事件监听
	off(name: string, handler: Func): this
	// 发布事件
	fire(name: string, ...args: any[]): this
}

export const IDRAGRAM_KEY: InjectionKey<DiagramInstance> = Symbol('INJECTION_DIAGRAM_KEY')
