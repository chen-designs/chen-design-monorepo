export type Callback = (result: { url: string; connect: boolean; network: boolean }) => boolean

/**
 *
 * @param {String} url
 * @param {Callback} callback
 * @param {Number} timeout
 * @returns {Function} stop
 */
export default function ping(url: string, callback: Callback, timeout = 5000) {
	let timeId = setTimeout(function request() {
		// 生成随机数
		const random = Math.floor((1 + Math.random()) * 0x10000).toString(16)
		// 获取请求地址
		const uri = (url = url || window.location.origin)
		// 发送请求
		return fetch(`${uri}//ping?random=${random}`, { cache: 'no-cache' })
			.then(response => response.ok)
			.catch(() => false)
			.then(connect => {
				timeId = setTimeout(request, timeout)
				const stop = callback.call(null, { url, connect, network: navigator.onLine })
				if (stop === true) clearTimeout(timeId)
			})
	}, timeout)
	// 返回 Stop 函数
	return () => clearTimeout(timeId)
}
