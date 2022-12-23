import { cloneVNode, defineComponent, h, onMounted, onUnmounted, ref, shallowRef, VNode, VNodeNormalizedChildren } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { createResizeObserver } from '../../utils/resize-observer'
import { getStyle } from '../../utils/dom'
import MenuSubmenu from './menu-submenu'
import { Icon } from '../icon'

export default defineComponent({
	name: prefixName('MenuOverflow'),

	setup: (props, { slots }) => {
		const prefix = prefixClass('MenuOverflow')
		const SUBMENU_CLASS = `${prefix}-more`
		const MENU_ITEM_CLASS = `${prefix}-hidden`

		const OVERFLOW_THRESHOLD = 10

		const refWrapper = shallowRef<HTMLDivElement>()
		const lastIndex = ref<number | null>(null)

		const getNodeWidth = (el: HTMLElement) => {
			return el && parseFloat(el.getBoundingClientRect().width.toFixed(2))
		}

		const px2Num = (str: string): number => {
			const result = Number(str.replace('px', ''))
			return Number.isNaN(result) ? 0 : result
		}

		const hasClass = (node: HTMLElement, cls: string) => {
			const classNames = node.className.split(' ')
			return classNames.includes(cls)
		}

		const computeLastVisibleIndex = () => {
			const element = refWrapper.value as HTMLDivElement
			const wrapperWidth = getNodeWidth(element)
			const children = Array.from(element.children) as HTMLElement[]

			let menuItemIndex = 0
			let currentRightWidth = 0

			for (let i = 0; i < children.length; i++) {
				const node = children[i]
				// 忽略 overflow-submenu 的宽度，其宽度测量交由 overflow-submenu-mirror
				if (hasClass(node, SUBMENU_CLASS)) continue

				const nodeWidth = getNodeWidth(node) + px2Num(getStyle(node, 'marginLeft')) + px2Num(getStyle(node, 'marginRight'))

				currentRightWidth += nodeWidth

				if (currentRightWidth + OVERFLOW_THRESHOLD > wrapperWidth) {
					return (lastIndex.value = menuItemIndex - 1)
				}

				menuItemIndex++
			}

			// 全部可见
			return (lastIndex.value = null)
		}

		const observer = createResizeObserver(computeLastVisibleIndex)

		onMounted(() => observer.observe(refWrapper.value))

		onUnmounted(() => observer.disconnect())

		return () => {
			const renderSubmenu = (children: VNodeNormalizedChildren) => {
				return h(MenuSubmenu, { class: SUBMENU_CLASS, ismore: true }, { default: () => children, label: () => h(Icon, { name: 'icon-more' }) })
			}

			const renderChildren = () => {
				const children = (slots.default?.() || []) as VNode[]
				let overflows = null
				const items = children.map((child, index) => {
					const item = cloneVNode(child, lastIndex.value !== null && index > lastIndex.value ? { class: MENU_ITEM_CLASS } : { class: '' })
					if (lastIndex.value !== null && index === lastIndex.value + 1) {
						overflows = renderSubmenu(children.slice(index).map(child => cloneVNode(child)))
					}
					return item
				})
				return [...items, overflows]
			}

			return h('div', { ref: refWrapper, class: prefix }, renderChildren())
		}
	}
})
