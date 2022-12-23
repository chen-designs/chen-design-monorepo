import { computed, inject } from 'vue'
import { genId } from '../../../utils/id'
import { IMENU_DATE_KEY, IMENU_KEY, ISUBMENU_KEY, MenuData } from '../context'

export const useMenu = (props?: any) => {
	const key = genId('MKEY')

	const iMenu = inject(IMENU_KEY)
	const iSubmenu = inject(ISUBMENU_KEY, null)
	const iData = inject(IMENU_DATE_KEY, {}) as MenuData

	const data = computed(() => {
		return {
			name: props.name ?? iData.name ?? key,
			icon: props.icon ?? iData.icon,
			label: props.label ?? iData.label,
			extra: props.badge ?? iData.extra
		}
	})

	const collapsed = computed(() => iMenu?.collapsed && level.value <= 1)

	const level = computed(() => (iMenu?.level || 0) + (iSubmenu?.level || 0) + 1)

	const indent = computed(() => {
		if (iMenu?.mode !== 'vertical' || iMenu.collapsed) return 0
		return (level.value - 1) * iMenu.indent
	})

	return { iMenu, iSubmenu, key, data, collapsed, level, indent }
}
