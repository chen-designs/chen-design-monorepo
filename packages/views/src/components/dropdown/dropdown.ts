import { isEmpty, map } from 'lodash-es'
import { computed, defineComponent, h, mergeProps, PropType, provide, reactive, ref, toRef } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import { promiseify } from '../../utils/promise'
import { renderSlots } from '../../utils/vnode'
import { useState } from '../../hooks'
import { OptionData } from './types'
import { IDROPDOWN_KEY } from './context'
import { Trigger, TriggerInstance } from '../trigger'
import { Scrollbar } from '../scrollbar'
import RenderOption from './render-option'

import options from './options.json'

export default defineComponent({
	name: prefixName('Dropdown'),
	inheritAttrs: false,

	props: {
		options: { type: Array as PropType<OptionData[]>, default: () => options },
		/**
		 * 当前激活想
		 */
		active: { type: [String, Number], default: void 0 },
		/**
		 * 点击后是否隐藏弹层
		 */
		hideOnClick: { type: Boolean, default: false },
		/**
		 * 显示图标
		 */
		showIcon: { type: Boolean, default: false },
		/**
		 * 弹出层最大高度
		 */
		maxHeight: { type: [String, Number], default: 350 },
		/**
		 * 是否禁用
		 */
		disabled: { type: Boolean, default: false },
		// 点击事件
		onClick: { type: Function as PropType<(name: OptionData['name'], data: OptionData) => any>, default: () => console.info('点击事件') }
	},

	emits: ['update:active'],

	setup: (props, { slots, attrs, emit, expose }) => {
		const prefix = prefixClass('Dropdown')
		const iTrigger = ref<TriggerInstance>()

		const active = useState(toRef(props, 'active'), null, value => {
			emit('update:active', value)
		})

		const disabled = computed(() => props.disabled || (!slots.overlays && isEmpty(props.options)) || false)

		const onClick = (key: string, data: OptionData) => {
			promiseify(props.onClick, (active.value = data.name), data).finally(() => {
				if (props.hideOnClick) iTrigger.value?.hide()
			})
		}

		provide(IDROPDOWN_KEY, reactive({ prefix, active, disabled, showIcon: toRef(props, 'showIcon'), maxHeight: props.maxHeight, onClick }))

		expose({
			$el: computed(() => iTrigger.value?.$el),
			show: (e?: HTMLElement | MouseEvent) => iTrigger.value?.show(e),
			hide: () => iTrigger.value?.hide()
		})

		return () => {
			const opts = { ref: iTrigger, clsprefix: prefix, enterable: true, disabled: disabled.value, alwaysRender: false }
			return h(Trigger, mergeProps(attrs, opts) as any, {
				default: () => slots.default?.(),
				content: () => {
					const renderContent = () => {
						return renderSlots(slots, 'overlays', {}, () => {
							return map(props.options, data => h(RenderOption, { data } as any))
						})
					}
					return h('div', { class: [prefix, { 'show-icons': props.showIcon }] }, [
						// 渲染滚动容器
						h(Scrollbar, { maxHeight: props.maxHeight }, { default: renderContent })
					])
				}
			})
		}
	}
})
