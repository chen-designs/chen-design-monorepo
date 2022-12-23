import { defineComponent, h, Transition } from 'vue'
import { prefixName } from '../../utils/config'

export default defineComponent({
	name: prefixName('IconSwitcher'),

	setup: (props, { slots }) => {
		return h(Transition, {}, slots)
	}
})
