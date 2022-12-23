import { isEmpty, map } from 'lodash-es'
import { defineComponent, h, PropType, provide, resolveComponent } from 'vue'
import { prefixName } from '../../utils/config'
import { IMENU_DATE_KEY, MenuData } from './context'
import MenuItem from './menu-item'
import MenuGroup from './menu-group'
import MenuSubmenu from './menu-submenu'

const COMPONENT_NAME = prefixName('MenuRender')
export default defineComponent({
	name: COMPONENT_NAME,

	props: {
		data: { type: Object as PropType<MenuData>, default: () => ({}) },
		group: { type: Boolean, default: true }
	},

	setup: props => {
		provide(IMENU_DATE_KEY, props.data)

		const renderItems = () => {
			const Component = resolveComponent(COMPONENT_NAME)
			return map(props.data.children, data => h(Component, { data: data }))
		}

		return () => {
			if (isEmpty(props.data.children)) return h(MenuItem)
			else if (props.data.group && props.group) return h(MenuGroup, { title: props.data.label }, { default: renderItems })
			else return h(MenuSubmenu, {}, { default: renderItems })
		}
	}
})
