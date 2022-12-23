import { defineComponent, h, PropType } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { Direction } from '../../utils/constant'
import { renderSlot } from '../../utils/vnode'

export default defineComponent({
	name: prefixName('ResizerHandle'),

	props: {
		/**
		 * @values horizontal, vertical
		 */
		direction: { type: String as PropType<Direction>, default: 'horizontal' },
		/**
		 * 是否隐藏图标
		 */
		hideIcon: { type: Boolean as PropType<boolean>, default: false }
	},
	/**
	 * default
	 * @slot default
	 * @binding direction
	 */
	setup(props, { slots }) {
		const prefix = prefixClass('ResizerHandle')
		return () => {
			return h('div', { class: [prefix, `${prefix}-${props.direction}`] }, [
				// 渲染自定义内容
				renderSlot(slots, 'default', { direction: props.direction })
			])
		}
	}
})
