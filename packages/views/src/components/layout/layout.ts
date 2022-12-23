import { defineComponent, shallowRef, ref, computed, h, provide, inject } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { ILAYOUT_KEY } from './context'
import { renderSlot } from '../../utils/vnode'
import Empty from '../empty'

export default defineComponent({
	name: prefixName('Layout'),

	props: {
		/**
		 * 显示边框
		 */
		border: { type: Boolean },
		/**
		 * 表示子元素里有 Sider, 一般不用指定. 可用于服务端渲染时避免样式闪动
		 */
		hasSider: { type: Boolean }
	},

	setup: (props, { slots }) => {
		const prefix = prefixClass('Layout')
		const ctxLayout = inject(ILAYOUT_KEY, null)

		const elRef = shallowRef<HTMLElement>()

		const siderIds = ref<string[]>([])

		const showBorder = computed(() => props.border || ctxLayout?.border?.value || false)

		const classes = computed(() => {
			const hasAside = props.hasSider || siderIds.value.length > 0
			return {
				[prefix]: true,
				[`${prefix}-has-aside`]: hasAside,
				[`${prefix}-border`]: showBorder.value
			}
		})

		provide(ILAYOUT_KEY, {
			el: elRef,
			border: computed(() => props.border || ctxLayout?.border?.value || false),
			onSiderMount: id => id && siderIds.value.push(id),
			onSiderUnMount: id => (siderIds.value = siderIds.value.filter(value => value !== id))
		})

		return () => {
			return h('section', { ref: elRef, class: classes.value }, [
				// 没有内容显示 Empty 组件
				renderSlot(slots, 'default', {}, () => h(Empty))
			])
		}
	}
})
