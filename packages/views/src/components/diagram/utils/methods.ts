import { GraphObject } from 'gojs'
import { isFunction, isUndefined } from 'lodash-es'

export const $ = GraphObject.make

export function set<T>(ctx: T, prop: string | symbol, value: any): T {
	return ((ctx as any)[prop] = value), ctx
}

export function get(ctx: any, prop: string | symbol, defValue?: any) {
	return ctx[prop] ?? defValue
}

export function exec(ctx: any, handler: any, value: any, ...args: any[]) {
	if (!isFunction(handler)) return value
	const result = handler.apply(ctx, [value].concat(args, ctx))
	if (!isUndefined(result)) return result
	return ctx
}
