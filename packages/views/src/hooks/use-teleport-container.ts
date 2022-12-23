import { ref, Ref, onMounted, watch } from 'vue'
import { getElement } from '../utils/dom'

export type TeleportContainerOptions = {
	popupContainer: Ref<string | HTMLElement | undefined>
	visible: Ref<boolean>
	defaultContainer?: string
	documentContainer?: boolean
}

export const useTeleportContainer = ({ popupContainer, visible, defaultContainer = 'body', documentContainer }: TeleportContainerOptions) => {
	const teleportContainer = ref(popupContainer.value)
	const containerRef = ref<HTMLElement>()

	const getContainer = () => {
		const element = getElement(popupContainer.value)

		const _teleportContainer = element ? popupContainer.value : defaultContainer

		const _containerElement = element ?? (documentContainer ? document.documentElement : getElement(defaultContainer))

		if (_teleportContainer !== teleportContainer.value) {
			teleportContainer.value = _teleportContainer
		}
		if (_containerElement !== containerRef.value) {
			containerRef.value = _containerElement
		}
	}

	onMounted(getContainer)

	watch(visible, value => {
		if (value && teleportContainer.value !== popupContainer.value) {
			getContainer()
		}
	})

	return { teleportContainer, containerRef }
}
