import { defineComponent, h, ref, computed, inject, PropType } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { isNumber, oneOf } from '../../utils/is'
import { renderIf } from '../../utils/vnode'
import { Size } from '../../utils/constant'
import { ISKELETON_KEY, Types } from './context'
import SkeletonImage from './skeleton-image.vue'

export default defineComponent({
	name: prefixName('SkeletonItem'),

	props: {
		/**
		 * 当前显示的占位元素的样式
		 * @values title, text, shape, circle, button, input, image
		 */
		type: {
			type: String as PropType<typeof Types[number]>,
			validator: (value: any) => oneOf(value, Types),
			default: 'text'
		},
		/**
		 * 图形大小
		 * @values mini, small, medium, large
		 */
		size: { type: String as PropType<Size> },
		/**
		 * 元素宽度
		 */
		width: { type: [Number, String] },
		/**
		 * 元素高度
		 */
		height: { type: [Number, String] }
	},

	setup(props) {
		const prefix = prefixClass('SkeletonItem')

		const skeleton = inject(ISKELETON_KEY, { size: ref<Size>() })

		const size = computed(() => props.size ?? skeleton.size.value)

		return () => {
			const { type, width, height } = props
			const classs = {
				[prefix]: true,
				[`${prefix}-${type}`]: type,
				[`${prefix}-${size.value}`]: size.value
			}
			const style = {
				width: isNumber(width) ? `${width}px` : width,
				height: isNumber(height) ? `${height}px` : height
			}
			return h('div', { class: classs, style }, [renderIf(props.type === 'image', () => h(SkeletonImage))])
		}
	}
})
