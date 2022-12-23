import { defineComponent, h, computed, toRef } from 'vue'
import { renderIf, renderText, renderSlots } from '../../utils/vnode'
import { prefixClass, prefixName } from '../../utils/config'
import { promiseify } from '../../utils/promise'
import { ZERO_CHAR } from '../../utils/constant'
import { isFunction } from '../../utils/is'
import { useState } from '../../hooks'

import IconMappers from './icon-mappes'

console.info('IconMappers : ', IconMappers)

export default defineComponent({
	name: prefixName('Icon'),

	props: {
		/**
		 * 图标名称
		 */
		name: { type: String },
		/**
		 * 文案
		 */
		label: { type: String },
		/**
		 * 颜色
		 */
		color: { type: String },
		/**
		 * 大小
		 */
		size: { type: String },
		/**
		 * 是否转圈
		 */
		spin: { type: Boolean, default: false },
		/**
		 * 旋转角度
		 */
		rotate: { type: Number },
		/**
		 * 添加背景颜色
		 */
		background: { type: Boolean, default: false },
		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false },
		/**
		 * 加载中
		 */
		loading: { type: Boolean, default: undefined },

		onClick: { type: Function }
	},

	emits: ['update:loading'],

	setup: (props, { slots, emit }) => {
		const prefix = prefixClass('Icon')

		const loading = useState(toRef(props, 'loading'), false, value => {
			emit('update:loading', value || false)
		})

		const disabled = computed(() => props.disabled)

		const clickable = computed(() => {
			return isFunction(props.onClick) && !disabled.value && !loading.value
		})

		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-clickable`]: !disabled.value && props.onClick,
				[`${prefix}-spin`]: props.spin,
				[`${prefix}-disabled`]: disabled.value,
				[`${prefix}-loading`]: loading.value,
				[`${prefix}-background`]: props.background
			}
		})

		// 处理图标点击事件
		const onClick = (e: Event) => {
			// 判断是否可以点击
			if (!clickable.value) return
			// 设置加载状态
			loading.value = true
			// 触发点击事件
			promiseify(() => props.onClick?.(e)).finally(() => {
				loading.value = false
			})
		}

		// 渲染 Loading 图标
		const renderLoading = () => h(IconMappers['icon-loading'], { size: props.size })

		// 渲染自定义图标
		const renderIcon = () => {
			const icons = renderSlots(slots, 'default', () => {
				return renderIf(
					IconMappers[props.name!],
					icon => h(icon, { size: props.size }),
					() => h('svg', { name: props.name }, [h('use', { 'xlink:href': `#${props.name}` })])
				)
			})
			return renderIf(icons, ([icon]) => {
				return h(icon, { style: { transform: `rotate(${props.rotate}deg)` } })
			})
		}

		return () => {
			return h('span', { class: classes.value, onClick }, [
				// 渲染零宽字符解决图标与文字对齐问题
				renderText(ZERO_CHAR),
				// 渲染图标
				renderIf(loading.value, renderLoading, renderIcon),
				// 渲染文案
				renderIf(props.label, () => h('label', { class: `${prefix}-text` }, props.label))
			])
		}
	}
})
