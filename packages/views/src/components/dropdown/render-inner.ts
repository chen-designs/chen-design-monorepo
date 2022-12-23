import { defineComponent, h, inject, PropType } from 'vue'
import { prefixName, prefixClass } from '../../utils/config'
import { renderIf, renderSlots, renderSlot, renderText } from '../../utils/vnode'
import { OptionData } from './types'
import { IDROPDOWN_KEY } from './context'
import { Icon } from '../icon'

export default defineComponent({
	name: prefixName('RenderInner'),

	props: {
		data: { type: Object as PropType<OptionData>, default: () => ({}) },
		showArrow: { type: Boolean, default: false }
	},

	setup: (props, { slots }) => {
		const prefix = prefixClass('RenderInner')
		const iDropdown = inject(IDROPDOWN_KEY)

		const data = (props.data || {}) as OptionData

		return () => {
			return h('div', { class: prefix }, [
				renderIf(iDropdown?.showIcon, () => {
					return h('div', { class: `${prefix}-icon` }, [
						renderSlots(slots, 'icon', { data }, () => {
							return renderIf(data.icon, () => h(Icon, { name: data.icon } as any))
						})
					])
				}),
				h('div', { class: `${prefix}-content` }, [
					renderSlot(slots, 'default', { data }, () => {
						return renderText(data.label ?? 'label')
					})
				]),
				renderIf(slots.extra || data.extra || props.showArrow, () => {
					return h('div', { class: `${prefix}-extra` }, [
						renderSlot(slots, 'extra', { data }, () => {
							return renderIf(
								props.showArrow,
								() => h(Icon, { name: 'icon-right' }),
								() => renderText(data.extra)
							)
						})
					])
				})
			])
		}
	}
})
