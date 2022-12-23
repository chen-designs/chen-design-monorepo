import { defineComponent, h } from 'vue'
import { prefixName } from '../../../utils/config'
import Default from './default.vue'
import Simple from './simple.vue'

const iMaps: Record<string, any> = { default: Default, simple: Simple }

export default defineComponent({
	name: prefixName('EmptyImage'),

	props: { image: { type: String } },

	setup(props) {
		const prefix = prefixName('EmptyImage')
		return () => {
			const component = iMaps[props.image || '']
			if (component) return h(component, { class: prefix })
			return h('img', { class: prefix, src: props.image })
		}
	}
})
