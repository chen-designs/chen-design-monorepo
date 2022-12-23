import { defineComponent, h } from 'vue'
import { prefixName, prefixClass } from '../../utils/config'
import { renderSlot } from '../../utils/vnode'
import Space from '../space'
import { SkeletonItem } from '../skeleton'

export default defineComponent({
	name: prefixName('Footer'),
	/**
	 * Footer 内容
	 * @slot default
	 */
	setup(_, { slots }) {
		const prefix = prefixClass('Footer')
		return () => {
			return h('footer', { class: prefix }, [
				renderSlot(slots, 'default', () => {
					return h('div', { class: `${prefix}-holder` }, [
						h(Space, {} as any, {
							default: () => [
								h(SkeletonItem, { type: 'text', width: 100 }),
								h(SkeletonItem, { type: 'text', width: 250 }),
								h(SkeletonItem, { type: 'text', width: 100 })
							]
						})
					])
				})
			])
		}
	}
})
