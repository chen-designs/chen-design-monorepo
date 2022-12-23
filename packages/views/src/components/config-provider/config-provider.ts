import { defineComponent, Fragment, h, reactive, toRefs, PropType, provide } from 'vue'
import { prefixName } from '../../utils/config'
import { Size } from '../../utils/constant'
import { ICONFIG_PROVIDER_KEY } from './context'

export default defineComponent({
	name: prefixName('ConfigProvider'),

	props: {
		/**
		 * 大小
		 */
		size: { type: String as PropType<Size> }
	},

	setup: (props, { slots }) => {
		const config = reactive(toRefs(props))

		provide(ICONFIG_PROVIDER_KEY, config)

		return () => h(Fragment, {}, [slots.default?.()])
	}
})
