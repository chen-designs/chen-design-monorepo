import ResizeObserver from 'resize-observer-polyfill'

export function createResizeObserver(callback: ResizeObserverCallback) {
	const observer = new ResizeObserver((entries, observer) => {
		callback?.(entries, observer)
	})

	const unobserve = (...targets: Array<HTMLElement | undefined>) => {
		targets?.forEach(element => element && observer.unobserve(element))
	}

	const observe = (...targets: Array<HTMLElement | undefined>) => {
		targets?.forEach(element => element && observer.observe(element))
		return () => unobserve(...(targets || []))
	}

	const disconnect = () => observer.disconnect()

	return { observe, unobserve, disconnect }
}
