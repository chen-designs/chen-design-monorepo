import { defineComponent, h } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'

export default defineComponent({
	name: prefixName('DropDivider'),

	setup: () => {
		const prefix = prefixClass('DropDivider')
		return () => h('div', { class: prefix })
	}
})
