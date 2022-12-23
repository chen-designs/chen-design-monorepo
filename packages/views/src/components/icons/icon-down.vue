<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M39.6 17.443 24.043 33 8.487 17.443"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconDown',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-down`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
