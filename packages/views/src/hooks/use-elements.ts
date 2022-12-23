import { onMounted, onUpdated, ref, VNode } from 'vue'
import { firstVNode } from '../utils/vnode'

export const useFirstElement = () => {
	const first = ref<VNode>()
	const children = ref<VNode[]>([])

	const update = () => {
		const element = firstVNode(children.value)
		if (element !== first.value) {
			first.value = element
		}
	}

	const setChildren = (nodes: VNode[]) => {
		children.value = nodes || []

		console.info('nodes : ', nodes)

		return nodes
	}

	onMounted(() => update())

	onUpdated(() => update())

	return { first, children, setChildren }
}
