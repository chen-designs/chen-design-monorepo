import { upperFirst, camelCase } from 'lodash'

export function genIconVomponent(name: string, svgstr: string) {
	return `<template>
	${svgstr}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: '${upperFirst(camelCase(name))}',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [\`${name}\`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
`
}
