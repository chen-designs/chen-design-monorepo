import { extend, noop } from 'lodash-es'
import { isFunction } from './is'

export type PromiseExecutor<T> = (resolve: (value: T) => void, reject: (reason?: any) => void) => void

export type PromiseLike2<T> = PromiseLike<T> & {
	resolve: (value: T) => void
	reject: (reason?: any) => void
}

export function sleep(millisecond = 500, isReject = false) {
	return (res: any) => {
		return new Promise((resolve, reject) => {
			setTimeout(isReject ? reject : resolve, Math.max(millisecond || 0, 0), res)
		})
	}
}

export function promiseify<T>(executor: T | ((...args: any[]) => T | Promise<T>), ...args: any[]): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		Promise.resolve(isFunction(executor) ? executor(...args) : executor)
			.then(resolve)
			.catch(reject)
	})
}

export function createPromise<T>(executor: PromiseExecutor<T>) {
	let [resolve, reject] = [noop, noop]

	const promise = new Promise((_resolve, _reject) => {
		try {
			executor.call(null, (resolve = _resolve), (reject = _reject))
		} catch (e) {
			_reject(e)
		}
	})

	return extend(promise, { resolve, reject }) as PromiseLike2<T>
}
