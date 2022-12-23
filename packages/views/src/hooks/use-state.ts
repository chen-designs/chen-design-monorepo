import { computed, ref, Ref } from 'vue'
import { isUndefined } from '../utils/is'

/**
 *
 * @param value
 * @param defValue
 * @param emit
 * @returns
 */
export function useState<T>(value: Ref<T>, defValue: T, emit: (value: T) => void) {
	const isNil = (value: Ref<T>) => isUndefined(value.value)

	const local = ref(defValue) as Ref<T>

	return computed<T>({
		get: () => (isNil(value) ? local.value : value.value),
		set: (val: T) => (isNil(value) ? (local.value = val) : emit?.(val))
	})
}
