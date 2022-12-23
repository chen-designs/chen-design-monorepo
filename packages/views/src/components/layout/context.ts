import { InjectionKey, ShallowRef, ComputedRef } from 'vue'

export interface ILayoutContext {
	el: ShallowRef<HTMLElement | undefined>
	border: ComputedRef<boolean>
	onSiderMount?: (id: string) => void
	onSiderUnMount?: (id: string) => void
}

export const ILAYOUT_KEY: InjectionKey<ILayoutContext> = Symbol('LAYOUT_INJECTION_KEY')
