import { computed, defineComponent, h, inject, provide, reactive } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { renderSlots } from '../../utils/vnode'
import { IDROPDOWN_KEY, IDROP_GROUP_KEY, IDROP_SUBMENU_KEY } from './context'
import RenderInner from './render-inner'
import { Trigger } from '../trigger'
import { Scrollbar } from '../scrollbar'
import { IBaseContext } from './types'

export default defineComponent({
	name: prefixName('DropSubmenu'),

	props: {
		/**
		 * 图标
		 */
		icon: { type: String },
		/**
		 * 子菜单标题
		 */
		title: { type: String },
		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false }
	},
	/**
	 * @slot icon
	 */
	/**
	 * @slot title
	 */
	/**
	 * @slot default
	 */
	setup: (props, { slots }) => {
		const prefix = prefixClass('DropSubmenu')
		const iDropdown = inject(IDROPDOWN_KEY)
		const iDropGroup = inject(IDROP_GROUP_KEY, {} as IBaseContext)
		// 禁用状态
		const disabled = computed(() => iDropdown?.disabled || iDropGroup?.disabled || props.disabled || false)

		provide(IDROP_SUBMENU_KEY, reactive({ disabled }))

		return () => {
			const renderTitle = () => {
				return h('div', { class: `${prefix}-title` }, [
					// 渲染标题内容
					h(RenderInner, { data: { icon: props.icon, label: props.title }, showArrow: true }, { icon: slots.icon, default: slots.title })
				])
			}
			const renderSubmenu = () => {
				const renderContent = () => {
					return h('div', { class: [`${prefix}-popup`, { 'show-icons': iDropdown?.showIcon }] }, [renderSlots(slots, 'default')])
				}
				// 渲染滚动容器
				return h(Scrollbar, { maxHeight: iDropdown?.maxHeight }, { default: renderContent })
			}
			return h('div', { class: [prefix, { [`${prefix}-disabled`]: disabled.value }] }, [
				h(Trigger, { clsprefix: prefix, enterable: true, placement: 'right-start', disabled: disabled.value }, { default: renderTitle, content: renderSubmenu })
			])
		}
	}
})
