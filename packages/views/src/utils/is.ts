import { includes } from 'lodash-es'

export const toString = Object.prototype.toString
export const eq = (value: any, type: string) => toString.call(value) === type

export const isServer = (() => {
	try {
		return !(typeof window !== 'undefined' && document !== undefined)
	} catch (e) {
		return true
	}
})()

export const isWindow = (value: any): value is Window => value === window

export const isError = (value: any): value is Error => eq(value, '[object Error]')

export const isValid = (value: any) => !isEmpty(value)

export const isNull = (value: any): value is null => eq(value, '[object Null]')

export const isExist = (value: any) => value || value === 0

export const oneOf = (value: any, values: readonly any[]) => includes(values, value)

export const eqLen = (value: any, length: number): value is any[] => isArray(value) && value.length === length

export const isUndefined = (value: any): value is undefined => value === undefined

export const isBase = (value: any): value is string | number => isString(value) || isNumber(value)

export const isBoolean = (value: unknown): value is boolean => eq(value, '[object Boolean]')

export const isString = (value: any): value is string => eq(value, '[object String]')

export const isSet = (value: any): value is Set<any> => eq(value, '[object Set]')

export const isMap = (value: any): value is Map<any, any> => eq(value, '[object Map]')

export const isRegExp = (value: any): value is RegExp => eq(value, '[object RegExp]')

export const isArray = (value: any): value is any[] => eq(value, '[object Array]')

export const isNil = (value: any): value is null | undefined => isNull(value) || isUndefined(value)

export const isObject = (value: any): value is { [key: string]: any } => eq(value, '[object Object]')

export const isPromise = <T>(value: unknown): value is Promise<T> => eq(value, '[object Promise]')

export const isNumber = (value: any): value is number => eq(value, '[object Number]') && value === value

export const isInteger = (value: any): value is number => isNumber(value) && value === Math.ceil(value)

export const isFunction = (value: any): value is (...args: any[]) => any => typeof value === 'function'

export const isEmpty = (value: any) => {
	if (isSet(value) || isMap(value)) return value.size === 0
	if (isObject(value)) return Object.keys(value).length === 0
	if (isString(value)) return value.trim().length === 0
	if (isArray(value)) return value.length === 0
	if (isNumber(value)) return value < 0
	return !value
}

export const isColor = (value: any, includes?: readonly string[]): value is string => {
	return (
		// regex hex
		/^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(value) ||
		// regex rgb
		/^rgb\((\s*\d+\s*,?){3}\)$/.test(value) ||
		// regex rgba
		/^rgba\((\s*\d+\s*,\s*){3}\s*\d(\.\d+)?\s*\)$/.test(value) ||
		(includes || []).includes(value)
	)
}

export const isPixel = (value: any, includes?: readonly string[]): value is string | number => {
	return /^\d+(px)?$/.test(value) || (includes || []).includes(value)
}
