import { defineComponent, h, renderSlot } from 'vue'
import { prefixName, prefixClass } from '../../utils/config'
import Empty from '../empty'

export default defineComponent({
	name: prefixName('Main'),
	/**
	 * Main 内容
	 * @slot default
	 */
	setup(_, { slots }) {
		const prefix = prefixClass('Main')
		return () => {
			return h('main', { class: prefix }, [
				// 没有内容显示 Empty 组件
				renderSlot(slots, 'default', {}, () => [h(Empty)])
			])
		}
	}
})
