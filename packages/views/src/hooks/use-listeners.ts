import { onUnmounted } from 'vue'
import { on, IElement, IEventKey, IEventListener } from '../utils/dom'

export function useListener<E extends IEventKey>(element: IElement, event: E, handler: IEventListener<E>) {
	const onbind = on(element, event, handler)

	onUnmounted(onbind)
}
