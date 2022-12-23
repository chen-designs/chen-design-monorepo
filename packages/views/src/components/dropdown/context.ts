import { InjectionKey, Ref } from 'vue'
import { OptionData, IDropdownContext, IBaseContext } from './types'

export interface IDropdownInstence {
	$el: Ref<HTMLDivElement>
	// visible: Ref<boolean>
	toggle: (visible?: boolean, e?: MouseEvent) => void
	show: (e?: HTMLElement | MouseEvent) => void
	hide: () => void
}

export const IDROP_OPTION_KEY: InjectionKey<OptionData> = Symbol('INJECTION_DROP_OPTION_KEY')
export const IDROPDOWN_KEY: InjectionKey<IDropdownContext> = Symbol('INJECTION_DROPDOWN_KEY')
export const IDROP_GROUP_KEY: InjectionKey<IBaseContext> = Symbol('INJECTION_DROP_GROUP_KEY')
export const IDROP_SUBMENU_KEY: InjectionKey<IBaseContext> = Symbol('INJECTION_DROP_SUBMENU_KEY')
