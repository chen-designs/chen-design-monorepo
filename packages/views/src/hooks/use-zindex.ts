import { ref } from 'vue'

const current = ref(0)

export const useZIndex = () => {
	const initial = ref(1000)
	const zIndex = ref(initial.value + current.value)

	const nextZIndex = () => {
		return (zIndex.value = current.value++ + initial.value)
	}

	return { initial, zIndex, nextZIndex }
}
