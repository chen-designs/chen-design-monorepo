import { defineComponent, h } from 'vue'
import { prefixName, prefixClass } from '../../utils/config'
import { renderSlot } from '../../utils/vnode'
import { SkeletonItem } from '../skeleton'
import Space from '../space'

export default defineComponent({
	name: prefixName('Header'),
	/**
	 * Header 内容
	 * @slot default
	 */
	setup(_, { slots }) {
		const prefix = prefixClass('Header')
		return () => {
			return h('header', { class: prefix }, [
				renderSlot(slots, 'default', () => {
					return h('div', { class: `${prefix}-holder` }, [
						h(Space, {} as any, {
							default: () => [h(SkeletonItem, { type: 'shape' }), h(SkeletonItem, { type: 'title', width: 100 })]
						}),
						h(Space, {} as any, {
							default: () => [h(SkeletonItem, { type: 'text' }), h(SkeletonItem, { type: 'text' }), h(SkeletonItem, { type: 'circle' })]
						})
					])
				})
			])
		}
	}
})
