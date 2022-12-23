import { computed, defineComponent, h, provide, PropType, reactive, ref, vShow, withDirectives } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { renderIf, renderSlots } from '../../utils/vnode'
import { ISUBMENU_KEY, MenuData } from './context'
import MenuInner from './inner'
import { Trigger } from '../trigger'
import { ExpandTransition } from '../transition'
import { useMenu } from './hooks'

export default defineComponent({
	name: prefixName('MenuSubmenu'),

	props: {
		name: { type: [String, Number] as PropType<string | number> },
		icon: { type: String },
		label: { type: String },
		data: { type: Object as PropType<MenuData>, default: () => ({}) },
		ismore: { type: Boolean, default: false }
	},

	setup: (props, { slots }) => {
		const prefix = prefixClass('MenuSubmenu')

		const { iMenu, key, data, level } = useMenu(props)

		const mode = computed(() => iMenu?.mode || 'vertical')

		const showPopup = computed(() => mode.value !== 'vertical' || iMenu?.collapsed)

		const placement = computed(() => (mode.value === 'horizontal' && level.value <= 1 ? 'bottom' : 'right-start'))
		const alwaysRender = computed(() => iMenu?.popupPersistent || false)

		provide(ISUBMENU_KEY, reactive({ level, key }))

		const opened = ref(false)

		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-selected`]: false
			}
		})

		const onClick = () => {
			iMenu?.onSubClick(key.value, level.value)
			opened.value = !opened.value
		}

		return () => {
			const renderInner = () => {
				return h('div', { class: `${prefix}-title` }, [
					h(MenuInner, { collapsed: showPopup.value && !props.ismore, data: data.value, onClick }, { icon: slots.icon, default: slots.label, extra: slots.extra })
				])
			}
			const renderSubmenu = () => {
				return withDirectives(
					h('div', { class: `${prefix}-${showPopup.value ? 'popup' : 'items'}` }, [renderSlots(slots, 'default')]),
					// 使用指令(v-show)控制子菜单是否显示
					[[vShow, opened.value || showPopup.value]]
				)
			}

			return h('div', { class: classes.value }, [
				renderIf(
					showPopup.value,
					() => {
						return h(
							Trigger,
							{ class: 'ch-menu-popup', enterable: true, placement: placement.value, alwaysRender: alwaysRender.value },
							{ default: renderInner, content: renderSubmenu }
						)
					},
					() => [renderInner(), h(ExpandTransition, {}, { default: renderSubmenu })]
				)
			])
		}
	}
})
