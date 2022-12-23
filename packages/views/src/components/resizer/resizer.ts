import { castArray, camelCase, extend } from 'lodash-es'
import { defineComponent, PropType, h, ref, computed, toRef, CSSProperties } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { renderSlot, renderIf } from '../../utils/vnode'
import { Direction } from '../../utils/constant'
import { isNumber } from '../../utils/is'
import { on, off } from '../../utils/dom'
import { useState } from '../../hooks'
import { Moveable } from './context'
import { Empty } from '../empty'
import Handle from './handle'

export default defineComponent({
	name: prefixName('Resizer'),

	props: {
		/**
		 * 伸缩框的 html 标签
		 */
		tag: { type: String, default: 'div' },
		/**
		 * 宽度
		 */
		width: { type: Number },
		/**
		 * 高度
		 */
		height: { type: Number },
		/**
		 * 最小宽/高
		 */
		min: { type: Number, default: 0 },
		/**
		 * 最大宽/高
		 */
		max: { type: Number },
		/**
		 * 可以进行伸缩的边，有上、下、左、右可以使用
		 * @values left, right, top, bottom
		 * @defaultValue right
		 */
		directions: {
			type: [String, Array] as PropType<Direction | Direction[]>,
			default: () => ['right']
		},
		/**
		 * 是否禁用调整大小
		 */
		disabled: { type: Boolean }
	},

	emits: [
		'update:width',
		'update:height',
		/**
		 * 拖拽开始时触发
		 * @param event
		 */
		'moving-start',
		/**
		 * 拖拽中触发
		 * @param {{ width: number; height: number; }} size
		 * @param {MouseEvent} event
		 */
		'moving',
		/**
		 * 拖拽结束时触发
		 * @param {MouseEvent} event
		 */
		'moving-end'
	],
	/**
	 * default
	 * @slot default
	 */
	/**
	 * trigger
	 * @slot trigger
	 */
	setup: (props, { slots, attrs, emit }) => {
		const prefix = prefixClass('Resizer')
		// 根元素引用
		const elRef = ref<HTMLElement>()
		// 是否正在拖动
		const moving = ref<boolean>(false)
		// 所有拖动方向
		const directions = computed(() => {
			return castArray(props.directions).filter(value => ['top', 'left', 'right', 'bottom'].includes(value))
		})
		// 是否横向拖动
		const isHorizontal = (direction: Direction) => ['left', 'right'].includes(direction)
		// 获取句柄方向
		const realDirection = (direction: Direction) => (isHorizontal(direction) ? 'horizontal' : 'vertical')
		// 元素宽度
		const width = useState(toRef(props, 'width'), null, value => {
			emit('update:width', value!)
		})
		// 元素高度
		const height = useState(toRef(props, 'height'), null, value => {
			emit('update:height', value!)
		})
		// 样式
		const styles = computed(() => {
			const css = {} as CSSProperties
			if (isNumber(width.value)) css.width = `${width.value}px`
			if (isNumber(height.value)) css.height = `${height.value}px`
			return css
		})
		// 获取有效大小
		const realSize = (prop: 'width' | 'height', value: number) => {
			const parent = elRef.value?.parentElement || elRef.value
			const field = camelCase(`client-${prop}`) as 'clientWidth'
			return Math.min(Math.max(value, props.min), props.max || parent?.[field] || value)
		}
		const moveable = {} as Moveable
		// 处理拖拽开始事件
		const onHandlerStart = (direction: Direction, e: MouseEvent) => {
			emit('moving-start', e)
			// 标识正在拖动
			moving.value = true
			// 记录拖拽信息
			moveable.direction = direction
			moveable.pageX = e.pageX
			moveable.pageY = e.pageY
			moveable.width = elRef.value?.clientWidth || 0
			moveable.height = elRef.value?.clientHeight || 0
			// 注册事件
			on(window, 'mousemove', onHandlerMoving)
			on(window, 'mouseup', onHandlerEnd)
			on(window, 'contextmenu', onHandlerEnd)
		}
		// 处理拖拽中事件
		const onHandlerMoving = (e: MouseEvent) => {
			if (!moving.value) return
			// 获取拖拽信息
			const { direction, pageX, pageY } = moveable
			// 往右移动的距离
			const offsetX = e.pageX - pageX
			// 往下移动的距离
			const offsetY = e.pageY - pageY
			// 根基方向计算大小
			if (direction === 'left') {
				width.value = realSize('width', moveable.width - offsetX)
			} else if (direction === 'right') {
				width.value = realSize('width', moveable.width + offsetX)
			} else if (direction === 'top') {
				height.value = realSize('height', moveable.height - offsetY)
			} else if (direction === 'bottom') {
				height.value = realSize('height', moveable.height + offsetY)
			}
			// 触发拖拽事件
			emit('moving', { width: width.value!, height: height.value! }, e)
		}
		// 处理拖拽结束事件
		const onHandlerEnd = (e: MouseEvent) => {
			emit('moving-end', e)
			// 标识正在拖动
			moving.value = false
			// 注销事件
			off(window, 'mousemove', onHandlerMoving)
			off(window, 'mouseup', onHandlerEnd)
			off(window, 'contextmenu', onHandlerEnd)
		}
		return () => {
			const classe = [prefix, { [`${prefix}-moving`]: moving.value }, attrs.class]
			return h('div', { ...attrs, ref: elRef, class: classe, style: extend({}, attrs.style || {}, styles.value) }, [
				h(props.tag || 'div', { class: `${prefix}-container` }, [renderSlot(slots, 'default', () => h(Empty))]),
				renderIf(!props.disabled, () => {
					return directions.value.map((value: Direction) => {
						return h(
							Handle,
							{ class: `${prefix}-direction-${value}`, direction: realDirection(value), onMousedown: onHandlerStart.bind(null, value) },
							{ default: slots.trigger }
						)
					})
				})
			])
		}
	}
})
