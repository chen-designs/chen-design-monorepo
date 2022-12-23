export type OptionData = {
	name?: string | number
	icon?: string
	label?: string
	extra?: string | number
	disabled?: boolean
	children?: Array<OptionData>
	group?: boolean
	divider?: boolean
}

export interface IBaseContext {
	disabled: boolean
}

export interface IDropdownContext extends IBaseContext {
	prefix: string
	active: OptionData['name']
	showIcon: boolean
	maxHeight: string | number
	onClick: (key: string, data: OptionData) => any
}
