import { defineComponent } from 'vue'
import { prefixName } from '../../utils/config'
import { renderIf } from '../../utils/vnode'

export default defineComponent({
	name: prefixName('When'),

	props: {
		/**
		 * 是否隐藏不显示
		 */
		hide: { type: Boolean, default: false }
	},

	setup: (props, { slots }) => {
		return () => renderIf(!props.hide, () => slots.default?.({ ...props }))
	}
})
