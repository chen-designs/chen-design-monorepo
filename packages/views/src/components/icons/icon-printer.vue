<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M14 15V8a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v7m-20 0H7a1 1 0 0 0-1 1v17a1 1 0 0 0 1 1h6m1-19h20m0 0h7a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1h-6m-22 0v6a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1v-6m-22 0v-5a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v5"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconPrinter',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-printer`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
