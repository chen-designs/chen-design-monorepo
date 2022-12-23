import { computed, defineComponent, h, onMounted, PropType } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { useMenu } from './hooks'
import MenuInner from './inner'

export default defineComponent({
	name: prefixName('MenuItem'),

	props: {
		/**
		 * 菜单项的唯一标识(必填)
		 */
		name: { type: [String, Number] as PropType<string | number> },
		/**
		 * 菜单图标
		 */
		icon: { type: String },
		/**
		 * 菜单名称
		 */
		label: { type: String },
		/**
		 * 菜单徽标
		 */
		badge: { type: [Number, String] },
		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false }
	},

	setup: (props, { slots }) => {
		const prefix = prefixClass('MenuItem')

		const { iMenu, iSubmenu, key, data, collapsed, level, indent } = useMenu(props)

		const showTips = computed(() => collapsed.value && level.value === 1)
		// 是否选择
		const isActive = computed(() => iMenu?.current === data.value.name)

		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-selected`]: isActive.value,
				[`${prefix}-disabled`]: props.disabled
			}
		})

		const onClick = () => {
			iMenu?.onItemClick(data.value.name)
		}

		onMounted(() => {
			// console.info('iSubmenu : ', iSubmenu)

			iMenu?.addChild({ key, parent: iSubmenu?.key })
		})

		return () => {
			const style = { paddingLeft: indent.value ? `${indent.value}px` : null }
			return h('div', { class: classes.value, style }, [
				// 渲染菜单内容
				h(MenuInner, { data: data.value, showTips: showTips.value, collapsed: collapsed.value, onClick }, slots)
			])
		}
	}
})
