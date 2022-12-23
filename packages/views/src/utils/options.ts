import { Size } from './types'

export interface BaseOptions {
	[name: string]: any
}

export interface GlobalOptions {
	readonly [name: string]: BaseOptions | string | undefined
	prefix?: string
	icon?: IconOptions
}

export interface IconOptions extends BaseOptions {
	size?: number | Size
}
