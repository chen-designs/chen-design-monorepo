import { castArray, isString, transform } from 'lodash-es'

export function firstGroups<T, P extends keyof T>(datas: T[], prop: P | ((data: T) => any)) {
	const result = Object.create(null) as Record<any, T>

	const getprop = (isString(prop) ? (data: T) => data[prop] : prop) as (data: T) => any
	const convert = (groups: any, data: T) => {
		const value = getprop(data)
		if (!groups[value]) groups[value] = data
	}
	return transform(castArray(datas), convert, result)
}
