import {
	computed,
	defineComponent,
	Fragment,
	h,
	inject,
	mergeProps,
	nextTick,
	onBeforeUnmount,
	onMounted,
	onUpdated,
	PropType,
	provide,
	reactive,
	readonly,
	Ref,
	ref,
	toRef,
	Transition,
	vShow,
	watch,
	withDirectives
} from 'vue'
import { Instance, placements, VirtualElement } from '@popperjs/core'
import { extend, isBoolean, map } from 'lodash-es'
import { createPromise, promiseify } from '../../utils/promise'
import { prefixClass, prefixName } from '../../utils/config'
import { IEventKey, on, contains } from '../../utils/dom'
import { isElement, isText, renderIf, renderSlots } from '../../utils/vnode'
import { ClientTeleport } from '../client-teleport'
import { useState, useZIndex } from '../../hooks'
import { ITRIGGER_KEY, TriggerMethod } from './context'
import { createPopuper } from './utils'
import { Empty } from '../empty'

export default defineComponent({
	name: prefixName('Trigger'),
	inheritAttrs: false,

	props: {
		clsprefix: { type: String },
		/**
		 * 弹出框是否可见
		 */
		visible: { type: Boolean, default: undefined },
		/**
		 * 弹出框默认是否可见（非受控模式）
		 */
		defaultVisible: { type: Boolean, default: false },
		/**
		 * 触发方式
		 * @values normal, hover, click, focus, contextmenu
		 */
		trigger: { type: String as PropType<TriggerMethod>, default: 'hover' },
		/**
		 * 显示方式
		 */
		placement: { type: String as PropType<typeof placements[number]>, default: 'bottom' },
		/**
		 * 提示框位置偏移
		 */
		offset: { type: Number },
		/**
		 * 显示延时单位毫秒
		 */
		showDelay: { type: Number, default: 100 },
		/**
		 * 隐藏延时单位毫秒
		 */
		hideDelay: { type: Number, default: 100 },
		/**
		 * 过度动画
		 */
		animate: { type: String, default: 'fade-in' },
		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false },
		/**
		 * 鼠标是否可以进入
		 */
		enterable: { type: Boolean, default: true },
		/**
		 * 是否显示箭头
		 */
		showArrow: { type: Boolean, default: true },
		/**
		 * 定位方式
		 */
		strategy: { type: String as PropType<'fixed' | 'absolute'>, default: 'absolute' },
		/**
		 * 是否使用 GPU 加速
		 */
		gpuAcceleration: { type: Boolean, default: false },
		boundaries: { type: Number, default: 8 },
		/**
		 * 其他选项
		 */
		options: { type: Object, default: () => ({}) },
		/**
		 * 显示之前调用,可用于阻止显示
		 */
		showBefore: { type: Function as PropType<() => boolean | Promise<boolean>>, default: () => true },
		/**
		 * 是否在点击触发器时关闭弹出框
		 */
		clickToClose: { type: Boolean, default: false },
		/**
		 * 是否挂载在 body 元素下
		 */
		renderToBody: { type: Boolean, default: true },
		/**
		 * 是否总是渲染
		 */
		alwaysRender: { type: Boolean, default: false },
		/**
		 * 是否阻止弹出层中的元素点击时获取焦点
		 */
		preventFocus: { type: Boolean, default: false },
		/**
		 * 内容溢出隐藏
		 */
		overhide: { type: Boolean, default: false },
		// 触发器点击事件
		onClickTrigger: { type: Function, default: () => {} }
	},

	emits: ['update:visible', 'change', 'show', 'hide'],

	setup: (props, { slots, emit, attrs, expose }) => {
		const prefix = prefixClass('Popup')
		// 用于多个 Trigger 嵌套时保持打开状态
		const childRefs = new Set<Ref<HTMLElement>>()
		const iTrigger = inject(ITRIGGER_KEY, undefined)
		// 元素引用
		const popupRef = ref<HTMLDivElement>()
		const arrowRef = ref<HTMLDivElement>()
		const referentRef = ref<HTMLDivElement>()
		// 弹框显示状态
		const popupVisible = useState(toRef(props, 'visible'), props.defaultVisible, value => {
			emit('update:visible', value)
			emit('change', value)
		}) as Ref<boolean>
		// 是否已挂载
		const isMounted = ref(popupVisible.value || false)
		// 是否正在执行动画过度
		const isAnimation = ref(false)
		const loading = ref(false)
		const triggers = ([] as Array<TriggerMethod>).concat(props.trigger) as Array<TriggerMethod>
		const alwaysRender = computed(() => props.alwaysRender || iTrigger?.alwaysRender || false)
		// 鼠标位置
		const anchorPoint = ref({ isPoint: false, x: 0, y: 0, width: 0, height: 0 })
		// 定位锚点
		const popupAnchor = {
			getBoundingClientRect: () => {
				const { isPoint, x, y, width, height } = anchorPoint.value
				// 获取触发器元素
				const reference = isElement(referentRef.value) ? referentRef.value : (referentRef.value as any)?.$el
				if (reference && !isPoint) {
					return reference.getBoundingClientRect()
				} else {
					return new DOMRect(x, y, width, height)
				}
			}
		} as VirtualElement
		// 决定定位层级
		const { zIndex, nextZIndex } = useZIndex()

		let { mPopper, delayTimer = 0 } = {} as { mPopper: Instance | null; delayTimer: number }
		// 创建 Popper 实列对象
		const createPopper = () => {
			return createPromise<Instance>(resolve => {
				// popupVisible.value = true
				if (mPopper) return resolve(mPopper)
				// 创建 Popper
				resolve((mPopper = createPopuper(popupAnchor, popupRef.value!, { ...props, arrow: arrowRef.value })))
			})
		}
		// 更新 Popper 位置
		const updatePopper = () => {
			if (!popupVisible.value) return
			createPopper().then(popper => {
				// TODO: 更新样式
				// const rect = popper.state.rects.reference
				// extend(popper.state.styles.popper, {
				// 	minWidth: `${rect.width}px`,
				// })
				popper.update()
			})
		}
		// 清除定时器
		const cleanDelayTimer = () => {
			if (!delayTimer) return
			clearTimeout(delayTimer)
			delayTimer = 0
		}

		// 更新鼠标位置
		const updateAnchorPoint = (e?: MouseEvent | HTMLElement) => {
			if (e instanceof HTMLElement) {
				const rect = e.getBoundingClientRect()
				anchorPoint.value = { isPoint: true, x: rect.x, y: rect.y, width: rect.width, height: rect.height }
			} else if (e instanceof MouseEvent) {
				anchorPoint.value = { isPoint: false, x: e.pageX, y: e.pageY, width: 0, height: 0 }
			} else {
				anchorPoint.value.isPoint = !referentRef.value
			}
		}
		// 切换显示隐藏
		const changeVisible = (visible: boolean, delay?: number) => {
			// 清空定时器
			cleanDelayTimer()
			if (visible === popupVisible.value) {
				return updatePopper()
			}
			// 更新显示状态
			const update = () => {
				popupVisible.value = visible
				if (visible) nextTick(updatePopper)
			}
			// 判断是否需要延时
			if (!delay) return update()
			// 判断是否需要改变显示状态
			if (visible !== popupVisible.value) {
				delayTimer = setTimeout(update, delay)
			}
		}

		// 显示 Popper
		const showPopper = (e?: HTMLElement | MouseEvent) => {
			if (props.disabled || loading.value) return
			// 判断非 click 触发方式,直接显示
			if (!triggers.includes('click') || popupVisible.value) {
				updateAnchorPoint(e)
				changeVisible(true, popupVisible.value ? 0 : props.showDelay)
			} else {
				// click 触发方式由 showBefore 方法返回值决定是否需要显示
				promiseify(props.showBefore, (loading.value = true))
					.catch(() => false)
					.then(showing => !!(showing ?? true) && loading.value)
					.then(showing => (showing && updateAnchorPoint(e), showing))
					.then(showing => showing && changeVisible(showing, popupVisible.value ? 0 : props.showDelay))
					.finally(() => (loading.value = false))
			}
		}
		// 隐藏 Popper
		const hidePopper = () => {
			loading.value = false
			// if (!popupVisible.value) return
			changeVisible(false, props.hideDelay)
		}
		// 显示/隐藏 Popper
		const toggle = (visible?: boolean, e?: MouseEvent) => {
			if (!isBoolean(visible)) {
				changeVisible(!popupVisible.value, popupVisible.value ? props.hideDelay : props.showDelay)
			} else if (visible) {
				showPopper(e)
			} else {
				hidePopper()
			}
		}
		expose(readonly({ $el: popupRef, visible: popupVisible, toggle, show: showPopper, hide: hidePopper }))

		// #region 处理事件
		const onClickTrigger = (e: PointerEvent) => {
			// 触发点击事件
			return promiseify(() => props.onClickTrigger?.(e))
		}
		const onClick = (e: PointerEvent) => {
			if (props.disabled) return onClickTrigger(e)
			if (triggers.includes('contextmenu') && popupVisible.value) {
				// 隐藏 Popper
				hidePopper()
			} else if (triggers.includes('click')) {
				if (popupVisible.value && props.clickToClose) {
					hidePopper()
				} else {
					showPopper()
				}
			}
			return onClickTrigger(e)
		}
		const onMouseenter = () => {
			if (props.disabled || !triggers.includes('hover')) return
			// 显示 Popper
			showPopper()
		}
		const onMouseleave = () => {
			if (props.disabled || !triggers.includes('hover')) return
			// 隐藏 Popper
			hidePopper()
		}
		const onContextmenu = (e: PointerEvent) => {
			if (props.disabled || !triggers.includes('contextmenu')) return
			// 阻止浏览器默认行为
			e.preventDefault()
			// 切换显示/隐藏 Popper
			if (popupVisible.value && props.clickToClose) {
				hidePopper()
			} else {
				showPopper()
			}
		}
		const onFocusin = () => {
			if (props.disabled || !triggers.includes('focus')) return
			// 显示 Popper
			showPopper()
		}
		const onFocusout = () => {
			if (props.disabled || !triggers.includes('focus')) return
			// 隐藏 Popper
			hidePopper()
		}

		const events = (() => {
			const mappers: { [k in TriggerMethod]: any } = {
				normal: {},
				click: { onClick },
				hover: { onMouseenter, onMouseleave },
				contextmenu: { onClick, onContextmenu },
				focus: { onFocus: onFocusin, onBlur: onFocusout }
			}
			const handlers = map(triggers, trigger => mappers[trigger] || {})
			return extend({ onClick: onClickTrigger }, ...handlers) as { [k in IEventKey]?: () => void }
		})()

		const onStartAnimation = () => {
			isAnimation.value = true
		}
		const onAfterEnter = () => {
			isAnimation.value = false
			if (popupVisible.value) {
				emit('show', (isMounted.value = true))
			}
		}
		const onAfterLeave = () => {
			isAnimation.value = false
			if (!popupVisible.value) {
				emit('hide', (isMounted.value = false))
			}
		}

		const onPopupMouseenter = (e: MouseEvent) => {
			iTrigger?.onMouseenter(e)
			if (props.enterable) onMouseenter()
		}
		const onPopupMouseleave = (e: MouseEvent) => {
			iTrigger?.onMouseleave(e)
			onMouseleave()
		}
		const onPopupMousedown = (e: MouseEvent) => {
			if (props.preventFocus) e.preventDefault()
		}
		// #endregion

		// #region 处理 Trigger 嵌套状态保持
		const addChildRef = (ref: Ref<HTMLElement>) => {
			childRefs.add(ref)
			iTrigger?.addChildRef(ref)
		}
		const delChildRef = (ref: Ref<HTMLElement>) => {
			childRefs.delete(ref)
			iTrigger?.delChildRef(ref)
		}
		provide(ITRIGGER_KEY, reactive({ alwaysRender, onMouseenter: onPopupMouseenter, onMouseleave: onPopupMouseleave, addChildRef, delChildRef }))
		// #endregion

		watch(popupVisible, value => {
			if (!value) return hidePopper()
			nextZIndex()
			nextTick(updatePopper)
		})

		watch(isMounted, value => {
			if (value || alwaysRender.value || !mPopper) return
			mPopper.destroy()
			mPopper = null
		})

		// #region 外部元素点击处理
		const outsideHandler = (e: MouseEvent) => {
			if (!popupVisible.value) return
			const target = e.target as HTMLElement
			// 获取触发器元素
			const reference = isElement(referentRef.value) ? referentRef.value : (referentRef.value as any)?.$el
			if (contains(reference, target) || contains(popupRef.value, target) || Array.from(childRefs).some(item => contains(item.value, target))) {
				return
			}
			hidePopper()
		}
		const removeClickOutside = on(document.documentElement, 'mousedown', outsideHandler, true)
		// #endregion

		onMounted(() => {
			iTrigger?.addChildRef(popupRef)
			// 判断是否默认显示
			if (props.defaultVisible) showPopper()
		})

		onUpdated(updatePopper)

		onBeforeUnmount(() => {
			iTrigger?.delChildRef(popupRef)
			removeClickOutside()
		})

		return () => {
			return h(Fragment, {}, [
				// 渲染触发器元素
				renderIf(renderSlots(slots, 'default', { loading: loading.value }), ([first]) => {
					const opts = mergeProps(attrs, { ref: referentRef, class: [`${prefix}-trigger`], ...events })
					return isText(first) ? h('span', opts, [first]) : h(first, opts)
				}),
				// 渲染 Popper 内容
				renderIf((popupVisible.value || isMounted.value || alwaysRender.value) && !props.disabled, () => {
					const popupEvents = { onMouseenter: onPopupMouseenter, onMouseleave: onPopupMouseleave, onMousedown: onPopupMousedown }
					// 合并样式
					const classnames = [prefix, attrs.class, { [`${prefix}-opened`]: popupVisible.value || isMounted.value, [`${props.clsprefix}-popper`]: !!props.clsprefix }]
					const style = { ...(attrs.style || {}), zIndex: zIndex.value, pointerEvents: isAnimation.value ? 'none' : 'all' }
					// 渲染弹层容器
					const popup = withDirectives(
						h('div', { ...attrs, ref: popupRef, class: classnames, style, ...popupEvents }, [
							// 渲染箭头
							renderIf(props.showArrow, () => {
								return h('div', { ref: arrowRef, class: [`${prefix}-arrow`, { [`${props.clsprefix}-arrow`]: !!props.clsprefix }], ['data-popper-arrow']: '' })
							}),
							// 渲染内容
							h('div', { class: [`${prefix}-content`, { [`${prefix}-overhide`]: props.overhide, [`${props.clsprefix}-content`]: !!props.clsprefix }] }, [
								renderSlots(slots, 'content', { toggle, visible: popupVisible.value }, () => h(Empty))
							])
						]),
						[[vShow, popupVisible.value]]
					)
					// 添加动画
					const transition = h(
						Transition,
						{ appear: true, name: props.animate, onBeforeEnter: onStartAnimation, onAfterEnter, onBeforeLeave: onStartAnimation, onAfterLeave },
						{ default: () => [popup] }
					)
					// 挂载节点
					return h(ClientTeleport, { disabled: !props.renderToBody }, { default: () => transition })
				})
			])
		}
	}
})
