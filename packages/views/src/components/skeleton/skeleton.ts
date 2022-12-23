import { times } from 'lodash-es'
import { computed, defineComponent, h, PropType, provide, ref, toRef, VNode, watch } from 'vue'
import { renderIf, renderSlot } from '../../utils/vnode'
import { prefixClass, prefixName } from '../../utils/config'
import { Size } from '../../utils/constant'
import { ISKELETON_KEY } from './context'
import SkeletonItem from './skeleton-item'
import SkeletonLine from './skeleton-line'

export default defineComponent({
	name: prefixName('Skeleton'),

	props: {
		/**
		 * 是否展示骨架屏(加载中状态)
		 */
		loading: { type: Boolean, default: true },
		/**
		 * 是否开启骨架屏动画
		 */
		animate: { type: Boolean, default: false },
		/**
		 * 延迟占位 DOM 渲染的时间
		 */
		throttle: { type: Number, default: 0 },
		/**
		 * 图形大小
		 * @values mini, small, medium, large
		 */
		size: { type: String as PropType<Size> },
		/**
		 * 显示图像
		 */
		shape: { type: Boolean, default: false },
		/**
		 * 渲染多少个 template, 建议使用尽可能小的数字
		 */
		count: { type: Number, default: 3 },
		/**
		 * 展示的段落行数
		 */
		rows: { type: Number, default: 2 }
	},
	/**
	 * 用来展示自定义占位符
	 * @slot template
	 */
	/**
	 * 用来展示真实内容
	 * @slot default
	 */
	setup(props, { slots }) {
		const prefix = prefixClass('Skeleton')

		const shouldLoading = ref(props.throttle <= 0 ? props.loading : false)

		const classe = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-loading`]: props.loading,
				[`${prefix}-animate`]: props.animate
			}
		})

		provide(ISKELETON_KEY, { size: toRef(props, 'size') })

		let loadTimeout = 0
		watch(toRef(props, 'loading'), value => {
			if (props.throttle <= 0 || !value) return (shouldLoading.value = value)
			if (loadTimeout) clearTimeout(loadTimeout)
			loadTimeout = setTimeout(() => {
				shouldLoading.value = props.loading
			}, props.throttle) as unknown as number
		})

		const renderTemplate = () => {
			return times<VNode>(Math.max(props.count, 1), () => {
				return renderSlot(slots, 'template', {}, () => {
					return h('div', { class: `${prefix}-holder` }, [
						renderIf(props.shape, () => h(SkeletonItem, { type: 'shape' })),
						renderIf(props.rows > 0, () => {
							const attrs = { class: `${prefix}-holder-rows` }
							return h('div', attrs, [h(SkeletonLine, { rows: props.rows })])
						})
					])
				}) as unknown as VNode
			})
		}

		return () => {
			return h('div', { class: classe.value }, [
				renderIf(shouldLoading.value, renderTemplate, () => {
					return renderSlot(slots)
				})
			])
		}
	}
})
