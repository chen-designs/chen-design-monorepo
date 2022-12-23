import { defineComponent, h, PropType, ref, computed, CSSProperties, onMounted, onUnmounted, watch, Component } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { createResizeObserver } from '../../utils/resize-observer'
import { renderSlot } from '../../utils/vnode'
import { val2px } from '../../utils/pixels'
import { THUMB_MIN_SIZE, TRACK_SIZE, ThumbData } from './context'
import { Empty } from '../empty'
import Tracker from './tracker'

export default defineComponent({
	name: prefixName('Scrollbar'),
	inheritAttrs: false,

	props: {
		clsprefix: { type: String },
		/**
		 * 视图的元素
		 */
		tag: { type: String, default: 'div' },
		/**
		 * 类型
		 * @values track, embed
		 */
		type: { type: String as PropType<'track' | 'embed'>, default: 'embed' },
		/**
		 * 最大高度
		 */
		maxHeight: { type: [String, Number] },
		/**
		 * 是否隐藏滚动条
		 */
		hide: { type: Boolean, default: false }
	},

	emits: {
		/**
		 * @zh 滚动时触发
		 * @en Triggered when scroll
		 */
		scroll: (event: Event) => event
	},
	/**
	 *
	 * @slot default
	 */
	setup: (props, { slots, emit, expose }) => {
		const prefix = prefixClass('Scrollbar')
		const elRef = ref<HTMLDivElement>()
		const wrapRef = ref<HTMLElement>()

		const hThumbRef = ref<typeof Tracker>()
		const vThumbRef = ref<typeof Tracker>()

		const hdata = ref<ThumbData>()
		const vdata = ref<ThumbData>()

		const padding = ref({ right: 0, bottom: 0 })

		const hasHbar = ref(false)
		const hasVbar = ref(false)
		const isBoth = ref(false)

		const hasScroll = computed(() => hasHbar.value || hasVbar.value)

		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${props.clsprefix}-scrollbar`]: !!props.clsprefix,
				[`${prefix}-${props.type}`]: true,
				[`${prefix}-both`]: isBoth.value
			}
		})

		const style = computed(() => {
			const style: CSSProperties = { maxHeight: val2px(props.maxHeight) }
			if (props.type !== 'track') return style
			if (hasVbar.value) style.paddingRight = `${TRACK_SIZE + padding.value.right}px`
			if (hasHbar.value) style.paddingBottom = `${TRACK_SIZE + padding.value.bottom}px`
			return style
		})

		const observer = createResizeObserver(() => {
			if (!wrapRef.value) return
			const { clientWidth, clientHeight, offsetWidth, offsetHeight } = elRef.value!
			const { scrollWidth, scrollHeight, scrollTop, scrollLeft } = wrapRef.value

			hasHbar.value = scrollWidth > clientWidth
			hasVbar.value = scrollHeight > clientHeight
			isBoth.value = hasHbar.value && hasVbar.value

			const hTrackWidth = props.type === 'embed' && isBoth.value ? offsetWidth - TRACK_SIZE : offsetWidth
			const vTrackHeight = props.type === 'embed' && isBoth.value ? offsetHeight - TRACK_SIZE : offsetHeight

			const hThumbWidth = Math.round(hTrackWidth / Math.min(scrollWidth / clientWidth, hTrackWidth / THUMB_MIN_SIZE))
			const vThumbHeight = Math.round(vTrackHeight / Math.min(scrollHeight / clientHeight, vTrackHeight / THUMB_MIN_SIZE))

			const maxHOffset = hTrackWidth - hThumbWidth
			const maxVOffset = vTrackHeight - vThumbHeight

			const hRatio = (scrollWidth - clientWidth) / maxHOffset
			const vRatio = (scrollHeight - clientHeight) / maxVOffset

			hdata.value = { ratio: hRatio, thumbSize: hThumbWidth, max: maxHOffset }
			vdata.value = { ratio: vRatio, thumbSize: vThumbHeight, max: maxVOffset }

			if (scrollLeft > 0) {
				hThumbRef.value?.setOffset(Math.round(scrollLeft / (vdata.value?.ratio ?? 1)))
			}
			if (scrollTop > 0) {
				vThumbRef.value?.setOffset(Math.round(scrollTop / (vdata.value?.ratio ?? 1)))
			}
		})

		const handleScroll = (env: Event) => {
			if (wrapRef.value) {
				if (hasHbar.value) hThumbRef.value?.setOffset(Math.round(wrapRef.value.scrollLeft / (hdata.value?.ratio ?? 1)))
				if (hasVbar.value) vThumbRef.value?.setOffset(Math.round(wrapRef.value.scrollTop / (vdata.value?.ratio ?? 1)))
			}
			emit('scroll', env)
		}

		const handleHScroll = (offset: number) => {
			if (wrapRef.value) wrapRef.value.scrollTo({ left: offset * (hdata.value?.ratio ?? 1) })
		}

		const handleVScroll = (offset: number) => {
			if (wrapRef.value) wrapRef.value.scrollTo({ top: offset * (vdata.value?.ratio ?? 1) })
		}

		watch(elRef, el => {
			if (!el) return
			const style = getComputedStyle(el)
			padding.value.right = parseFloat(style.paddingRight)
			padding.value.bottom = parseFloat(style.paddingBottom)
		})

		expose({ $el: elRef, hasScroll })

		onMounted(() => observer.observe(wrapRef.value!))
		onUnmounted(() => observer.disconnect())

		return () => {
			return h('div', { ref: elRef, class: classes.value, style: style.value }, [
				h(props.tag || 'div', { ref: wrapRef, class: [`${prefix}-container`, { [`${props.clsprefix}-scrollbar-container`]: !!props.clsprefix }], onScroll: handleScroll }, [
					// 渲染插槽内容
					renderSlot(slots, 'default', () => h(Empty))
				]),
				// 渲染滚动条
				h(Tracker, { ref: hThumbRef, data: hdata.value, direction: 'horizontal', onScroll: handleHScroll, visible: !props.hide && hasHbar.value }),
				h(Tracker, { ref: vThumbRef, data: vdata.value, direction: 'vertical', onScroll: handleVScroll, visible: !props.hide && hasVbar.value })
			])
		}
	}
})
