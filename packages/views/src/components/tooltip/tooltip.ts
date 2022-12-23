import { defineComponent, h, ref, PropType, computed } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { renderSlots, renderText } from '../../utils/vnode'
import { Trigger } from '../trigger'
import { Scrollbar } from '../scrollbar'

export default defineComponent({
	name: prefixName('Tooltip'),
	inheritAttrs: false,

	props: {
		/**
		 * 提示内容
		 */
		content: { type: String },
		/**
		 * 鼠标是否可以进入
		 */
		enterable: { type: Boolean, default: false },
		/**
		 * 最大显示宽度
		 */
		maxWidth: { type: [Number, String] as PropType<number | string>, default: 350 },
		/**
		 * 最大显示高度
		 */
		maxHeight: { type: [Number, String], default: 250 }
	},
	/**
	 * default
	 * @slot default
	 */
	/**
	 * content
	 * @slot content
	 */
	setup: (props, { slots, attrs }) => {
		const prefix = prefixClass('Tooltip')

		const scrollbar = ref<typeof Scrollbar>()

		const enterable = computed(() => props.enterable || scrollbar.value?.hasScroll || false)

		return () => {
			const renderContent = () => {
				const content = renderSlots(slots, 'content', {}, () => renderText(props.content))
				return h(Scrollbar, { ref: scrollbar, clsprefix: prefix, maxHeight: props.maxHeight }, { default: () => [content] })
			}
			return h(Trigger, { ...attrs, overhide: true, enterable: enterable.value, clsprefix: prefix }, { default: () => slots.default?.(), content: renderContent })
		}
	}
})
