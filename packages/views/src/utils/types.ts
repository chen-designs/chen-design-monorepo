import type { App, VNode } from 'vue'
import { BaseOptions } from './options'

export const Tuple = <T extends string[]>(...args: T) => args

export type ElementOf<T> = T extends (infer E)[] ? E : T extends readonly (infer F)[] ? F : never

export type EmitFn<T> = (event: T, ...args: any[]) => void

export type Nil = null | undefined

export type Data = { [x: string]: any } // Record<string, any>

export type Func = (...args: any[]) => any

export type SlotRender = (...args: any[]) => VNode[] | VNode | any[] | null | undefined

export type SfcInstall<T = BaseOptions> = Record<string, any> & {
	install: (app: App, options: T) => void
}
