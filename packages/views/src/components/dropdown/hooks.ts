import { computed, inject } from 'vue'
import { genId } from '../../utils/id'
import { IDROP_OPTION_KEY, IDROPDOWN_KEY, IDROP_GROUP_KEY, IDROP_SUBMENU_KEY } from './context'
import { OptionData } from './types'

export function useDropdown(props?: any) {
	const key = genId('MKEY')

	const iDropdown = inject(IDROPDOWN_KEY)
	const iDropGroup = inject(IDROP_GROUP_KEY, {} as any)
	const iDropSubmenu = inject(IDROP_SUBMENU_KEY, {} as any)
	const iData = inject(IDROP_OPTION_KEY, {}) as OptionData

	const data = computed(() => {
		return {
			name: props.name ?? iData.name ?? key,
			icon: props.icon ?? iData.icon,
			label: props.label ?? iData.label,
			extra: props.badge ?? iData.extra,
			disabled: props.disabled || iData.disabled || false
		}
	})

	const disabled = computed(() => iDropdown?.disabled || iDropSubmenu.disabled || iDropGroup.disabled || data.value.disabled)

	return { key, iDropdown, data, disabled }
}
