import { each, extend, flatten, kebabCase, map } from 'lodash-es'
import type { Diagram, GraphObject, InputEvent } from 'gojs'
import type EventEmitter from 'eventemitter3'
import type { ObjectType } from './types'
import { DiagramInstance } from '../context'

export const GRAPHOBJECT_EVENTS = [
	'click',
	'contextClick',
	'doubleClick',
	'mouseDrop',
	'mouseHold',
	'mouseEnter',
	// 'mouseHover',
	// 'mouseOver',
	'mouseLeave',
	'mouseDragEnter',
	'mouseDragLeave'
]

export const EVENT_NAMES = flatten(
	map([null /* DIAGRAM */, 'GROUP', 'NODE', 'LINK'], value => {
		return map(GRAPHOBJECT_EVENTS, event => kebabCase(`${value || ''} ${event}`))
	})
)

export function bindEvents(type: ObjectType, graphObject: GraphObject | Diagram, dInstance: DiagramInstance) {
	const emitter = dInstance.emitter() as EventEmitter
	each(GRAPHOBJECT_EVENTS, etype => {
		extend(graphObject, {
			[etype]: (e: InputEvent, ...args: GraphObject[]) => {
				const env = extend(e, { etype, prefix: type })
				// 事件名称
				const event1 = kebabCase(`${type} ${etype}`)
				const event2 = kebabCase(`${etype}`)
				// 发布事件
				dInstance.fire(event1.replace(/^diagram-/i, ''), env, ...args)
				if (event1 !== event2) emitter.emit(kebabCase(`${etype}`), env, ...args)
			}
		})
	})
}
