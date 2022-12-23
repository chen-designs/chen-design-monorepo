import { defineComponent, h, PropType, VNode } from 'vue'
import { renderIf, renderSlot, renderSlots, renderText } from '../../utils/vnode'
import { prefixClass, prefixName } from '../../utils/config'
import { isEmpty } from '../../utils/is'
import { MenuData } from './context'
import { Icon } from '../icon'
import { Tooltip } from '../tooltip'

export default defineComponent({
	name: prefixName('MenuInner'),

	props: {
		data: { type: Object as PropType<MenuData>, default: () => ({}) },
		collapsed: { type: Boolean, default: false },
		// 是否显示 Tooltip
		showTips: { type: Boolean, default: false }
	},

	setup: (props, { slots }) => {
		const prefix = prefixClass('MenuInner')

		return () => {
			const data = (props.data || {}) as MenuData

			// 菜单图标
			const icon = renderIf(slots.icon || data.icon, () => {
				return renderSlots(slots, 'icon', { data }, () => {
					return h(Icon, { class: `${prefix}-icon`, name: data.icon } as any)
				})
			})
			// const icon = renderIf(slots.icon || data.icon, () => {
			// 	return h('div', { class: `${prefix}-icon` }, [
			// 		renderSlots(slots, 'icon', { data }, () => {
			// 			return h(Icon, { name: data.icon } as any)
			// 		})
			// 	])
			// })

			const label = renderIf(!props.collapsed || props.showTips, () => {
				return h('div', { class: `${prefix}-content` }, [
					renderSlot(slots, 'default', { data }, () => {
						return renderText(data.label ?? 'Menu Item')
					})
				])
			})

			const extra = renderIf(!props.collapsed && (slots.extra || data.extra), () => {
				return h('div', { class: `${prefix}-extra` }, [
					renderSlot(slots, 'extra', { data }, () => {
						return renderText(data.extra)
					})
				])
			})

			const renderItem = () => {
				const children = renderIf(
					props.showTips,
					() => [icon],
					() => [icon, label, extra]
				) as VNode[]

				return h('div', { class: [prefix, { [`${prefix}-has-icon`]: !isEmpty(icon) }] }, children)
			}

			return renderIf(props.showTips, () => h(Tooltip, { placement: 'right' }, { default: renderItem, content: () => label }), renderItem)
		}
	}
})
