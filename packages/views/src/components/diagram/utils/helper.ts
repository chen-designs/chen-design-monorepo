import { castArray, each, isPlainObject, reduce } from 'lodash-es'
import type { Key } from 'gojs'
import type { Data } from '../../../utils/types'
import type { ModelData } from './types'
import { defId } from './def-value'

export function reduceIfexists<T extends ModelData>(datas: T | T[], exists: Map<Key, boolean>, defaultCreate: any, extra?: Data) {
	const callback = (results: { datas: T[]; repeats: T[]; ids: Map<Key, boolean> }, data: T) => {
		if (isPlainObject(data)) {
			const key = data.key || (data.key = defId(data as any))
			if (exists.has(key)) {
				results.repeats.push(data)
			} else {
				results.datas.push(defaultCreate(data, extra))
				exists.set(key, true)
				results.ids.set(key, true)
			}
		}
		return results
	}
	return reduce(castArray(datas), callback, { datas: [], repeats: [], ids: new Map() })
}

export function additionIfexists<T extends ModelData>(datas: T | T[], exists: { nids: Map<Key, boolean>; lids: Map<Key, boolean> }, modelChange: string) {
	each(castArray(datas), data => {
		if (modelChange === 'nodeDataArray') {
			exists.nids.set(data.key, true)
		} else {
			exists.lids.set(data.key, true)
		}
	})
	return exists
}

export function removeIfexists<T extends ModelData>(datas: T | T[], exists: { nids: Map<Key, boolean>; lids: Map<Key, boolean> }, modelChange: string) {
	each(castArray(datas), data => {
		if (modelChange === 'nodeDataArray') {
			exists.nids.delete(data.key)
		} else {
			exists.lids.delete(data.key)
		}
	})
	return exists
}
