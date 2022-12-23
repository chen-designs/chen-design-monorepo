import { onMounted, onUnmounted, Ref, isRef, computed } from 'vue'
import { createResponsiveObserver, ResponsiveResult, Breakpoint } from '../utils/responsive-observer'

export function useResponsive(
	target: HTMLElement | Ref<HTMLElement | undefined> | undefined,
	breakpoint: Breakpoint | Ref<Breakpoint | undefined> | undefined,
	callback: (checked: boolean, result: ResponsiveResult) => void
) {
	const element = computed(() => (isRef(target) ? target.value : target || document.body))

	const point = computed(() => (isRef(breakpoint) ? breakpoint.value : breakpoint))

	const observer = createResponsiveObserver({}, result => {
		callback(result.matchs[point.value!] || false, result)
	})

	onMounted(() => observer.observe(element.value!))

	onUnmounted(() => observer.unobserve(element.value!))
}
