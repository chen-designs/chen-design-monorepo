import { defineComponent, computed, h, PropType, CSSProperties, VNode } from 'vue'
import { allElements, renderIf, renderSlot, renderText } from '../../utils/vnode'
import { isArray, isInteger, isNumber, oneOf } from '../../utils/is'
import { prefixClass, prefixName } from '../../utils/config'
import { Orientation, SIZES } from '../../utils/constant'
import { ALIGNS, Space } from './context'

export default defineComponent({
	name: prefixName('Space'),

	props: {
		/**
		 * 排列方向
		 * @values vertical, horizontal
		 * @defaultValue horizontal
		 */
		orient: { type: String as PropType<Orientation>, default: 'horizontal' },
		/**
		 * 间距大小
		 * @values mini, small, medium, large, number
		 */
		space: {
			type: [String, Number, Array] as PropType<Space | [Space, Space]>,
			validator: (value: any) => oneOf(value, SIZES) || isInteger(value)
		},
		/**
		 * 对齐方式
		 * @values start, center, end, baseline
		 */
		align: { type: String as PropType<typeof ALIGNS[number]> },
		/**
		 * 环绕类型的间距,用于折行的场景
		 */
		wrap: { type: Boolean, default: false },
		/**
		 * 充满整行
		 */
		fill: { type: Boolean, default: false },
		/**
		 * 分割器
		 */
		split: { type: [Boolean, String], default: false }
	},
	/**
	 * Space 内容
	 * @slot default
	 */
	/**
	 * 自定义分割
	 * @slot split
	 */
	setup: (props, { slots }) => {
		const prefix = prefixClass('Space')

		const align = computed(() => {
			const align = props.orient === 'horizontal' ? 'center' : ''
			return props.align ?? align
		})

		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-${props.space}`]: oneOf(props.space, SIZES),
				[`${prefix}-${props.orient}`]: props.orient,
				[`${prefix}-align-${align.value}`]: align.value,
				[`${prefix}-fill`]: props.fill,
				[`${prefix}-wrap`]: props.wrap
			}
		})

		const getMargin = (size: Space | undefined) => {
			if (isNumber(size)) return size
			return { mini: 4, small: 8, medium: 16, large: 24 }[size!] || 8
		}

		const getMarginStyle = (isLast: boolean) => {
			const style = {} as CSSProperties
			const marginRight = `${getMargin(isArray(props.space) ? props.space[0] : props.space)}px`
			const marginBottom = `${getMargin(isArray(props.space) ? props.space[1] : props.space)}px`
			if (isLast) return props.wrap ? { marginBottom } : {}
			if (props.orient === 'horizontal') {
				style.marginRight = marginRight
			}
			if (props.orient === 'vertical' || props.wrap) {
				style.marginBottom = marginBottom
			}
			return style
		}

		const renderSplit = () => {
			return renderIf(Boolean(props.split), () => {
				return renderSlot(slots, 'split', { orient: props.orient }, () => {
					return renderText(props.split === true ? '|' : props.split)
				})
			})
		}

		return () => {
			const elements = allElements(slots.default?.(), true)

			const children = elements.reduce((prevs, curr, index, { length }) => {
				const style = getMarginStyle(index === length - 1)
				prevs.push(h('div', { class: `${prefix}-item`, style }, [curr]))
				if (!props.split || index >= length - 1) return prevs
				prevs.push(h('div', { class: `${prefix}-split`, style: style }, [renderSplit()]))
				return prevs
			}, [] as VNode[])

			return h('div', { class: classes.value }, children)
		}
	}
})
