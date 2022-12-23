import { defineComponent, h, inject, ref } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { IDRAGRAM_KEY } from './context'
import { Dropdown, IDropdownInstence } from '../dropdown'

export default defineComponent({
	name: prefixName('DiagramCtxmenu'),
	inheritAttrs: false,

	props: {
		placement: { type: String, default: 'bottom-start' },
		showIcon: { type: Boolean, default: true }
	},

	setup: (props, { attrs, slots }) => {
		const prefix = prefixClass('DiagramCtxmenu')
		const idiagram = inject(IDRAGRAM_KEY)
		const idropdown = ref<IDropdownInstence>()

		idiagram?.on('context-click', function (e) {
			if (e.event instanceof PointerEvent) e.event.stopPropagation()
			console.info('contextmenu : ', e.prefix, e.event)
			idropdown.value?.show(e.event)
		})

		return () => {
			const opts = { ...attrs, ref: idropdown, class: prefix, trigger: 'normal', placement: props.placement, showIcon: props.showIcon, hideOnClick: true }
			return h(Dropdown, opts, { overlays: slots.default })
		}
	}
})
