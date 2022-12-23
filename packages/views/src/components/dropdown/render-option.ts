import { defineComponent, resolveComponent, h, provide, PropType } from 'vue'
import { map, isEmpty } from 'lodash-es'
import { prefixName } from '../../utils/config'
import { OptionData } from './types'
import { IDROP_OPTION_KEY } from './context'
import DropGroup from './drop-group'
import DropOption from './drop-option'
import DropSubmenu from './drop-submenu'
import DropDivider from './drop-divider'

const COMPONENT_NAME = prefixName('OptionRender')
export default defineComponent({
	name: COMPONENT_NAME,

	props: {
		data: { type: Object as PropType<OptionData>, default: () => ({}) },
		group: { type: Boolean, default: true }
	},

	setup: props => {
		const data = props.data || {}

		provide(IDROP_OPTION_KEY, data)

		const renderItems = () => {
			const Component = resolveComponent(COMPONENT_NAME)
			return map(props.data.children, data => h(Component, { data, group: data.group || false }))
		}

		return () => {
			if (props.data.divider) return h(DropDivider)
			if (isEmpty(props.data.children)) return h(DropOption)
			else if (props.data.group && props.group) return h(DropGroup, { title: data.label, disabled: data.disabled || false }, { default: renderItems })
			else return h(DropSubmenu, { title: data.label, icon: data.icon, disabled: data.disabled }, { default: renderItems })
		}
	}
})
