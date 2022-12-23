import { defineComponent, h, ref, computed, Transition, PropType } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { Direction } from '../../utils/constant'
import { renderIf } from '../../utils/vnode'
import { on, off } from '../../utils/dom'
import { TRACK_SIZE, ThumbData, ThumbMap } from './context'

export default defineComponent({
	name: prefixName('ScrollbarTracker'),

	props: {
		data: { type: Object as PropType<ThumbData> },
		direction: { type: String as PropType<Direction>, default: 'horizontal' },
		visible: { type: Boolean, default: false }
	},

	emits: ['scroll'],

	setup: (props, { emit, expose }) => {
		const prefix = prefixClass('Scrollbar')

		const elRef = ref<HTMLDivElement>()
		const thumbRef = ref<HTMLDivElement>()
		const mOffset = ref(0)
		const isdrager = ref(false)
		const mouseOffset = ref(0)

		const thumbMap = computed<ThumbMap>(() => {
			if (props.direction === 'horizontal') {
				return { size: 'width', direction: 'left', offset: 'offsetWidth', client: 'clientX' }
			}
			return { size: 'height', direction: 'top', offset: 'offsetHeight', client: 'clientY' }
		})

		const thumbClass = computed(() => {
			return {
				[`${prefix}-thumb`]: true,
				[`${prefix}-thumb-${props.direction}`]: true,
				[`${prefix}-thumb-dragging`]: isdrager.value
			}
		})

		const thumbStyle = computed(() => {
			const { size, direction } = thumbMap.value
			const transforms = { left: `translateX(${mOffset.value}px)`, top: `translateY(${mOffset.value}px)` }
			return {
				[{ width: 'height', height: 'width' }[size]]: `${TRACK_SIZE}px`,
				[size]: `${props.data?.thumbSize ?? 0}px`,
				transform: transforms[direction]
			}
		})

		const getOffset = (offset: number) => {
			if (offset < 0) return 0
			if (props.data && offset > props.data.max) return props.data.max
			return offset
		}

		const setOffset = (offset: number) => {
			if (!isdrager.value) {
				offset = getOffset(offset)
				if (offset !== mOffset.value) {
					mOffset.value = offset
				}
			}
		}

		const handleTrackClick = (ev: MouseEvent) => {
			ev.preventDefault()
			if (!thumbRef.value || ev.target !== elRef.value) return
			const offset = getOffset(
				ev[thumbMap.value.client] > thumbRef.value.getBoundingClientRect()[thumbMap.value.direction]
					? mOffset.value + (props.data?.thumbSize ?? 0)
					: mOffset.value - (props.data?.thumbSize ?? 0)
			)
			if (offset !== mOffset.value) {
				emit('scroll', (mOffset.value = offset))
			}
		}

		const handleThumbMouseDown = (ev: MouseEvent) => {
			ev.preventDefault()
			if (!thumbRef.value) return
			mouseOffset.value = ev[thumbMap.value.client] - thumbRef.value.getBoundingClientRect()[thumbMap.value.direction]
			isdrager.value = true
			on(window, 'mousemove', handleMouseMove)
			on(window, 'mouseup', handleMouseUp)
			on(window, 'contextmenu', handleMouseUp)
		}

		const handleMouseMove = (ev: MouseEvent) => {
			if (elRef.value && thumbRef.value) {
				const offset = getOffset(ev[thumbMap.value.client] - elRef.value.getBoundingClientRect()[thumbMap.value.direction] - mouseOffset.value)
				if (offset !== mOffset.value) {
					emit('scroll', (mOffset.value = offset))
				}
			}
		}

		const handleMouseUp = () => {
			isdrager.value = false
			off(window, 'mousemove', handleMouseMove)
			off(window, 'mouseup', handleMouseUp)
			off(window, 'contextmenu', handleMouseUp)
		}

		expose({ setOffset })

		return () => {
			const render = () => {
				return renderIf(props.visible, () => {
					return h('div', { ref: elRef, class: [`${prefix}-tracker`, `${prefix}-tracker-${props.direction}`], onMousedown: handleTrackClick }, [
						h('div', { ref: thumbRef, class: thumbClass.value, style: thumbStyle.value, onMousedown: handleThumbMouseDown }, [
							//
							h('div', { class: `${prefix}-thumb-bar` })
						])
					])
				})
			}
			return h(Transition, {}, { default: render })
		}
	}
})
