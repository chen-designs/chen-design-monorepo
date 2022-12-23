import { defineComponent, h } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { renderSlots } from '../../utils/vnode'

export default defineComponent({
	name: prefixName('MenuGroup'),

	props: {
		title: { type: String }
	},

	setup: (props, { slots }) => {
		const prefix = prefixClass('MenuGroup')

		return () => {
			return h('div', { class: prefix }, [
				// 渲染分组标题
				h('div', { class: `${prefix}-title` }, [props.title ?? 'Menu Group']),
				renderSlots(slots, 'default')
			])
		}
	}
})
