import { createPopper, placements, VirtualElement } from '@popperjs/core'

type TriggerOptions = {
	placement?: typeof placements[number]
	strategy?: 'fixed' | 'absolute'
	arrow?: HTMLElement
	offset?: number
	boundaries?: number
	gpuAcceleration?: boolean
	options?: any
}

const createOptions = ({ options, ...props }: TriggerOptions) => {
	const buildModifiers = (extraModifiers = []) => {
		const modifiers: Array<any> = [
			{ name: 'offset', options: { offset: [0, props.offset ?? 8] } },
			{ name: 'preventOverflow', options: { padding: props.offset ?? 12 } },
			{ name: 'flip', options: { padding: props.boundaries ?? 8 } },
			{ name: 'computeStyles', options: { gpuAcceleration: props.gpuAcceleration ?? false } }
		]
		if (props.arrow) {
			modifiers.push({ name: 'arrow', options: { element: props.arrow, padding: 8 } })
		}
		return modifiers.concat(extraModifiers)
	}
	return {
		placement: props.placement || 'auto',
		strategy: props.strategy || 'fixed',
		...options,
		modifiers: buildModifiers(options.modifiers)
	}
}

export function createPopuper(reference: Element | VirtualElement, popper: HTMLElement, options: TriggerOptions) {
	return createPopper(reference, popper, createOptions(options))
}
