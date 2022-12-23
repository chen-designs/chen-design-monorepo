import { isFunction } from 'lodash-es'
import { defineComponent, h, computed } from 'vue'
import { prefixName, prefixClass } from '../../utils/config'
import { useDropdown } from './hooks'
import RenderInner from './render-inner'

export default defineComponent({
	name: prefixName('DropOption'),

	props: {
		/**
		 * 菜单项的唯一标识
		 */
		name: { type: [String, Number] },
		/**
		 * 菜单图标
		 */
		icon: { type: String },
		/**
		 * 菜单名称
		 */
		label: { type: String },
		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false },
		/**
		 * 点击事件
		 */
		onClick: { type: Function }
	},
	/**
	 * @slot icon
	 */
	/**
	 * @slot default
	 */
	/**
	 * @slot extra
	 */
	setup: (props, { slots }) => {
		const prefix = prefixClass('DropOption')
		const { iDropdown, key, data, disabled } = useDropdown(props)
		// 是否选中
		const isActive = computed(() => iDropdown?.active === (data.value.name ?? key))
		// 样式
		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-selected`]: isActive.value,
				[`${prefix}-disabled`]: disabled.value
			}
		})
		// 处理点击事件
		const onClick = (e: PointerEvent) => {
			if (disabled.value) return
			if (isFunction(props.onClick)) return props.onClick(e)
			iDropdown?.onClick(key, data.value)
		}
		return () => {
			return h('div', { class: classes.value }, [
				// 渲染菜单内容
				h(RenderInner, { data: data.value, onClick }, slots)
			])
		}
	}
})
