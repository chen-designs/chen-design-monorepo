<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M25 39h-2V18h2z"></path><path fill="currentColor" stroke="none" d="M25 39h-2V18h2z"></path><path d="M25 11h-2V9h2z"></path><path fill="currentColor" stroke="none" d="M25 11h-2V9h2z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconInfo',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-info`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
