import { isEmpty, isFunction } from './is'
import { createResizeObserver } from './resize-observer'

export const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

export type BreakpointSize = number | [min: number, max?: number]

export type Breakpoint = typeof breakpoints[number]

export type ResponsiveOptions = {
	breakpoints?: Record<Breakpoint, BreakpointSize>
	useBoxSize?: boolean
}

export type ResponsiveSize = { width: number; height: number }

export type ResponsiveResult = {
	breakpoint?: Breakpoint
	screens: Record<Breakpoint, boolean>
	matchs: Record<Breakpoint, boolean>
	size: ResponsiveSize
}

export type ResponsiveCallback = (result: ResponsiveResult) => void

const refBoxSize = (useBoxSize: boolean, entry: ResizeObserverEntry) => {
	const { contentBoxSize, borderBoxSize, contentRect } = entry

	const boxSize = (useBoxSize && borderBoxSize) || contentBoxSize

	const first = Array.isArray(boxSize) ? boxSize[0] : boxSize

	const width = boxSize ? first.inlineSize : contentRect.width
	const height = boxSize ? first.blockSize : contentRect.height

	return { width, height } as ResponsiveSize
}

const matchSize = (width: number, value: BreakpointSize) => {
	const [min, max] = Array.isArray(value) ? value : [value]
	return width >= min && width <= (max || width)
}

const findMatchs = (points: ResponsiveOptions['breakpoints'], width: number) => {
	const screens = {} as Record<Breakpoint, boolean>
	const matchs = {} as Record<Breakpoint, boolean>
	let breakpoint = undefined as unknown as Breakpoint
	let unique = ''

	for (const key of breakpoints) {
		if (!points?.[key]) continue
		screens[key] = matchSize(width, points[key])
		if (screens[key]) {
			matchs[key] = screens[key]
			breakpoint = breakpoint || key
			unique = unique ? `${unique}_${key}` : key
		}
	}

	return { breakpoint, screens, matchs, unique }
}

const breakmaps: Record<Breakpoint, BreakpointSize> = {
	xs: [0, 575],
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1600
}

export function createResponsiveObserver(options: ResponsiveOptions, callback: ResponsiveCallback) {
	const breakpoints = isEmpty(options.breakpoints) ? breakmaps : options.breakpoints

	let prevUnique: string

	const observer = createResizeObserver(entries => {
		// 获取盒子大小
		const size = refBoxSize(options.useBoxSize || false, entries[0])
		const { unique, ...args } = findMatchs(breakpoints, size.width)
		// 调用回调函数
		if (isFunction(callback) && unique !== prevUnique) {
			prevUnique = unique
			callback({ size, ...args })
		}
	})

	return {
		observe: (target?: HTMLElement) => observer.observe(target),
		unobserve: (target?: HTMLElement) => observer.unobserve(target),
		disconnect: () => observer.disconnect()
	}
}
