import { defineComponent, ref, onMounted, onUnmounted, h, Teleport } from 'vue'
import { prefixName } from '../../utils/config'
import { renderIf } from '../../utils/vnode'

export default defineComponent({
	name: prefixName('ClientTeleport'),

	props: {
		to: { type: [String, HTMLElement], default: 'body' },
		disabled: { type: Boolean }
	},

	setup: (props, { slots }) => {
		const mounted = ref(false)
		onMounted(() => (mounted.value = true))
		onUnmounted(() => (mounted.value = false))
		return () => {
			return renderIf(mounted.value || true, () => {
				return h(Teleport, props as any, [slots.default?.()])
			})
		}
	}
})
