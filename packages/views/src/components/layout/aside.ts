import { defineComponent, inject, PropType, toRef, ref, computed, h, onMounted, onUnmounted } from 'vue'
import { renderIf, renderSlot } from '../../utils/vnode'
import { prefixClass, prefixName } from '../../utils/config'
import { Breakpoint } from '../../utils/responsive-observer'
import { useState, useResponsive } from '../../hooks'
import { isEmpty } from '../../utils/is'
import { genId } from '../../utils/id'
import { ILAYOUT_KEY } from './context'

import Resizer from '../resizer'
import Skeleton from '../skeleton'
import Icon from '../icon'

export default defineComponent({
	name: prefixName('Aside'),

	props: {
		/**
		 * 标题
		 */
		title: { type: String },
		/**
		 * 是否可收起
		 */
		collapsible: { type: Boolean, default: false },
		/**
		 * 当前收起状态
		 */
		collapse: { type: Boolean, default: undefined },
		/**
		 * 默认宽度
		 */
		width: { type: Number, default: 251 },
		/**
		 * 最小宽度,也是收缩宽度
		 */
		minWidth: { type: Number, default: 48 },
		/**
		 * 最大宽度
		 */
		maxWidth: { type: Number, default: 500 },
		/**
		 * 翻转折叠触发器的方向,当 Sider 在右边时可以使用
		 */
		reverse: { type: Boolean, default: false },
		/**
		 * 是否可调整大小
		 */
		resizeable: { type: Boolean, default: false },
		/**
		 * 触发响应式布局的断点, 详见[响应式栅格](/vue/component/grid)
		 * @values xs, sm, md, lg, xl, xxl
		 * @defaultValue lg
		 */
		breakpoint: {
			type: String as PropType<Breakpoint>,
			default: 'lg'
		},
		/**
		 * 隐藏折叠触发器
		 */
		hideTrigger: { type: Boolean, default: false }
	},

	emits: [
		'update:collapsed',
		/**
		 * 展开-收起时的事件，有点击 trigger 以及响应式反馈两种方式可以触发
		 * @param {boolean} collapsed
		 * @param {'clickTrigger' | 'responsive'} type
		 */
		'collapse',
		/**
		 * 触发响应式布局断点时的事件
		 * @param {boolean} collapsed
		 */
		'breakpoint',
		/**
		 * 调整大小时触发的事件
		 * @param {number} width
		 */
		'resize'
	],
	/**
	 * 自定义内容
	 * @slot default
	 */
	/**
	 * Trigger
	 * @slot trigger
	 */
	setup(props, { slots, emit, expose }) {
		const prefix = prefixClass('Aside')
		// 生成唯一 ID
		const uniqueId = genId('ASIDE')
		// 获取 Layout
		const ctxAside = inject(ILAYOUT_KEY)
		// 当前折叠状态
		const collapse = useState(toRef(props, 'collapse'), false, value => {
			emit('update:collapsed', value)
		})
		// 边栏实际宽度
		const realWidth = ref(props.width)
		// 宽度计算
		const siderWidth = computed({
			get: () => (collapse.value ? props.minWidth : realWidth.value),
			set: value => (realWidth.value = value)
		})
		const realCollapsed = computed(() => {
			return collapse.value || siderWidth.value <= props.minWidth
		})
		// 是否需要显示 Trigger
		const shouldTrigger = computed(() => {
			return props.collapsible && !props.hideTrigger && realWidth.value > props.minWidth
		})
		/**
		 * 切换折叠状态
		 * @public
		 * @method toggle
		 */
		const toggle = () => emit('collapse', (collapse.value = !collapse.value), 'clickTrigger')

		// 处理响应式折叠
		useResponsive(ctxAside?.el, props.breakpoint, checked => {
			const collapsed = !checked
			if (collapsed !== collapse.value) {
				collapse.value = collapsed
				emit('collapse', collapsed, 'responsive')
				emit('breakpoint', collapsed)
			}
		})

		// 处理生命周期
		onMounted(() => ctxAside?.onSiderMount?.(uniqueId))
		onUnmounted(() => ctxAside?.onSiderUnMount?.(uniqueId))
		// 导出接口
		expose({ toggle })

		// 组件头部
		const renderHeader = () => {
			return renderIf(!isEmpty(props.title) || slots.header, () => {
				const content = renderSlot(slots, 'header', { toggle }, () => {
					return h('span', { class: `${prefix}-header-text` }, [props.title])
				})
				return h('div', { class: `${prefix}-header` }, [content])
			})
		}
		// 组件渲染函数
		const renderContainer = (style: any) => {
			const options = { collapsed: realCollapsed.value }
			return h('div', { class: `${prefix}-container`, style }, [
				renderSlot(slots, 'default', options, () => {
					return h(Skeleton, { shape: true, size: 'mini', count: 5, rows: realCollapsed.value ? 0 : 1 } as any)
				})
			])
		}
		// 渲染触发器
		const renderTrigger = () => {
			return renderIf(shouldTrigger.value, () => {
				const rotate = collapse.value ? 0 : 180
				const options = { rotate, collapsed: collapse.value }
				const content = renderSlot(slots, 'trigger', options, () => {
					return renderIf(
						props.reverse,
						() => h(Icon, { name: 'left-double', rotate } as any),
						() => h(Icon, { name: 'right-double', rotate } as any)
					)
				})
				const classe = { [`${prefix}-trigger`]: true, [`${prefix}-trigger-reverse`]: props.reverse }
				return h('div', { class: classe, onClick: toggle }, [content])
			})
		}

		// 返回渲染函数
		return () => {
			const style = { width: `${siderWidth.value}px` }
			const options: any = {
				tag: 'aside',
				class: {
					[prefix]: true,
					[`${prefix}-reverse`]: props.reverse,
					[`${prefix}-has-trigger`]: shouldTrigger.value,
					[`${prefix}-collapsed`]: collapse.value
				},
				style: style,
				min: props.minWidth,
				max: props.maxWidth,
				disabled: !props.resizeable || collapse.value,
				directions: props.reverse ? 'left' : 'right',
				width: siderWidth.value,
				'onUpdate:width': (value: number) => (siderWidth.value = value)
			}
			return h(Resizer, options, {
				default: () => [renderHeader(), renderContainer(style), renderTrigger()]
			})
		}
	}
})
