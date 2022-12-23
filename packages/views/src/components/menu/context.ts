import { InjectionKey } from 'vue'

export type MenuMode = 'horizontal' | 'vertical' | 'popup'
export type ChildMaper = { key: string; parent: string }
export type MenuChild = { key: string; name?: string; parent?: string }

export type MenuData = {
	name?: string | number
	icon?: string
	label?: string
	extra?: string | number
	children?: Array<MenuData>
	group?: boolean
}

export interface IMenuContext {
	current: MenuData['name']
	openKeys: string[]
	mode: MenuMode
	level: number
	indent: number
	collapsed: boolean
	scrollIntoView: boolean
	popupPersistent: boolean
	addChild: (item: MenuChild) => void
	onItemClick: (key: string) => void
	onSubClick: (key: string, level: number) => void
}

export interface ISubmenuContext {
	level: IMenuContext['level']
	key: string
}

export const IMENU_KEY: InjectionKey<IMenuContext> = Symbol('INJECTION_MENU_KEY')
export const ISUBMENU_KEY: InjectionKey<ISubmenuContext> = Symbol('INJECTION_SUBMENU_KEY')
export const IMENU_DATE_KEY: InjectionKey<MenuData> = Symbol('INJECTION_MENU_DATE_KEY')
