import { defineComponent, h, Transition } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { addClass, removeClass } from '../../utils/dom'

export default defineComponent({
	name: prefixName('ExpandTransition'),

	setup: (props, { slots }) => {
		const prefix = prefixClass('ExpandTransition')

		const dataset = Object.create(null)

		const onBeforeEnter = (el: HTMLElement) => {
			addClass(el, prefix)

			dataset.height = el.style.height
			dataset.oldPaddingTop = el.style.paddingTop
			dataset.oldPaddingBottom = el.style.paddingBottom

			el.style.height = '0px'
			el.style.paddingTop = '0px'
			el.style.paddingBottom = '0px'
		}
		const onEnter = (el: HTMLElement) => {
			dataset.oldOverflow = el.style.overflow
			if (el.scrollHeight !== 0) {
				el.style.height = `${el.scrollHeight}px`
				el.style.paddingTop = dataset.oldPaddingTop
				el.style.paddingBottom = dataset.oldPaddingBottom
			} else {
				el.style.height = dataset.height
				el.style.paddingTop = dataset.oldPaddingTop
				el.style.paddingBottom = dataset.oldPaddingBottom
			}
			el.style.overflow = 'hidden'
		}
		const onAfterEnter = (el: HTMLElement) => {
			removeClass(el, prefix)

			el.style.height = dataset.height
			el.style.overflow = dataset.oldOverflow
		}
		const onBeforeLeave = (el: HTMLElement) => {
			addClass(el, prefix)

			dataset.height = el.style.height
			dataset.oldPaddingTop = el.style.paddingTop
			dataset.oldPaddingBottom = el.style.paddingBottom
			dataset.oldOverflow = el.style.overflow

			el.style.height = `${el.scrollHeight}px`
			el.style.overflow = 'hidden'
		}
		const onLeave = (el: HTMLElement) => {
			if (el.scrollHeight !== 0) {
				// el.style.transitionProperty = 'height,paddingTop,paddingBottom'
				el.style.height = '0px'
				el.style.paddingTop = '0px'
				el.style.paddingBottom = '0px'
			}
		}
		const onAfterLeave = (el: HTMLElement) => {
			removeClass(el, prefix)

			el.style.height = dataset.height
			el.style.overflow = dataset.oldOverflow
			el.style.paddingTop = dataset.oldPaddingTop
			el.style.paddingBottom = dataset.oldPaddingBottom
		}

		return () => h(Transition, { onBeforeEnter, onEnter, onAfterEnter, onBeforeLeave, onLeave, onAfterLeave } as any, slots)
	}
})
