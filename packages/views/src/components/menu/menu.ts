import { map } from 'lodash-es'
import { computed, defineComponent, h, toRef, PropType, provide, reactive, ref } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { renderIf, renderSlots } from '../../utils/vnode'
import { val2px } from '../../utils/pixels'
import { useState } from '../../hooks'
import { IMENU_KEY, MenuData, MenuMode, MenuChild } from './context'
import MenuOverflow from './overflow'
import DataRender from './data-render'

import menus from './data.json'

export default defineComponent({
	name: prefixName('Menu'),

	props: {
		/**
		 * 菜单数据
		 */
		data: { type: Array as PropType<MenuData[]>, default: () => menus },
		/**
		 * 激活菜单的 name 值
		 */
		active: { type: [Number, String], default: void 0 },
		/**
		 * 模式
		 * @values horizontal, vertical, popup
		 */
		mode: { type: String as PropType<MenuMode>, default: 'vertical' },
		/**
		 * 是否水平折叠菜单,(仅在 mode 不为 horizontal 时有效)
		 */
		collapsed: { type: Boolean, default: void 0 },
		/**
		 * 菜单折叠宽度
		 */
		collapsedWidth: { type: Number, default: 48 },
		/**
		 * 是否开启折叠动画
		 */
		collapseTransition: { type: Boolean, default: true },
		/**
		 * inline 模式的菜单缩进宽度
		 */
		indent: { type: Number, default: 12 },
		/**
		 * 子菜单打开的触发方式(仅在 mode 不为 inline 时有效)
		 */
		trigger: { type: String as PropType<'click' | 'hover'>, default: 'hover' },
		/**
		 * 是否开启手风琴模式，开启后每次至多展开一个子菜单
		 */
		accordion: { type: Boolean, default: false },
		/**
		 * 是否自动滚动选中项目到可见区域
		 */
		scrollIntoView: { type: Boolean, default: true },
		/**
		 * 展开的子菜单 key 数组
		 */
		openKeys: { type: Array as PropType<string[]> },
		/**
		 * 选中的菜单项 key 数组
		 */
		selectedKeys: { type: Array as PropType<string[]> },
		/**
		 * 展开选中的菜单
		 */
		openSelected: { type: Boolean, default: false }
	},

	setup: (props, { slots, emit }) => {
		const prefix = prefixClass('Menu')

		const current = useState(toRef(props, 'active'), void 0, value => {
			emit('update:active', value)
		})

		const openKeys = ref<string[]>(props.openKeys || [])

		const mode = computed(() => props.mode || 'vertical')

		const collapsed = computed(() => props.collapsed && mode.value !== 'horizontal')

		const popupPersistent = ref(false)

		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-${props.mode}`]: props.mode,
				[`${prefix}-collapsed`]: collapsed.value
			}
		})

		const styles = computed(() => {
			if (!collapsed.value) return {}
			return { width: props.collapsedWidth && val2px(props.collapsedWidth) }
		})

		const onItemClick = (key: string) => {
			current.value = key
			console.info('onItemClick : ', { key })
		}
		const onSubClick = (key: string, level: number) => {
			console.info('onSubClick : ', { key, level })
		}

		const childMapers = ref<Map<string, MenuChild>>(new Map())

		const addChild = (item: MenuChild) => {
			// console.info('addChild : ', item, { childMapers })
		}

		provide(
			IMENU_KEY,
			reactive({
				current,
				openKeys,
				mode,
				indent: props.indent,
				collapsed,
				scrollIntoView: props.scrollIntoView,
				popupPersistent,
				onItemClick,
				onSubClick,
				addChild
			})
		)

		return () => {
			const children = renderSlots(slots, 'default', {}, () => {
				return map(props.data, data => {
					return h(DataRender, { data, group: props.mode !== 'horizontal' && !collapsed.value } as any)
				})
			})
			return h('div', { class: classes.value, style: styles.value }, [
				renderIf(
					props.mode === 'horizontal',
					() => h(MenuOverflow, {}, { default: () => children }),
					() => children
				)
			])
		}
	}
})
