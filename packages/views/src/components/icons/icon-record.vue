<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M24 6c9.941 0 18 8.059 18 18s-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6Z" clip-rule="evenodd"></path><path fill="currentColor" stroke="none" d="M30 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path><path d="M30 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconRecord',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-record`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
