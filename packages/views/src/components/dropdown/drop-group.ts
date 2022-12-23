import { defineComponent, h, provide, reactive, toRef } from 'vue'
import { prefixName, prefixClass } from '../../utils/config'
import { renderIf, renderSlots } from '../../utils/vnode'
import { IDROP_GROUP_KEY } from './context'

export default defineComponent({
	name: prefixName('DropGroup'),

	props: {
		/**
		 * 标题
		 */
		title: { type: String },
		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false }
	},
	/**
	 * @slot title
	 */
	/**
	 * @slot default
	 */
	setup: (props, { slots }) => {
		const prefix = prefixClass('DropGroup')
		provide(IDROP_GROUP_KEY, reactive({ disabled: toRef(props, 'disabled') }))
		return () => {
			return h('div', { class: [prefix, { [`${prefix}-disabled`]: props.disabled }] }, [
				// 渲染标题
				renderIf(slots.title || props.title, () => {
					return h('div', { class: `${prefix}-title` }, [props.title ?? 'Group'])
				}),
				renderSlots(slots, 'default')
			])
		}
	}
})
