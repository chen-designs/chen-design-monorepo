<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M24 38c-7.732 0-14-6.268-14-14 0-3.815 1.526-7.273 4-9.798M24 10c7.732 0 14 6.268 14 14 0 3.815-1.526 7.273-4 9.798M24 7v6l-4-3 4-3Zm0 33v-6l4 3-4 3Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconRefresh',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-refresh`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
