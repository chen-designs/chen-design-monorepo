import { InjectionKey, Ref } from 'vue'

export interface TriggerInstance {
	$el: Ref<HTMLDivElement>
	visible: Ref<boolean>
	toggle: (visible?: boolean, e?: MouseEvent) => void
	show: (e?: HTMLElement | MouseEvent) => void
	hide: () => void
}

export const TRIGGER_METHODS = ['normal', 'hover', 'click', 'focus', 'contextmenu'] as const
export type TriggerMethod = typeof TRIGGER_METHODS[number]

export interface ITriggerContext {
	alwaysRender: boolean
	onMouseenter: (ev: MouseEvent) => void
	onMouseleave: (ev: MouseEvent) => void
	addChildRef: (ref: any) => void
	delChildRef: (ref: any) => void
}

export const ITRIGGER_KEY: InjectionKey<ITriggerContext> = Symbol('INJECTION_TRIGGER_KEY')
