<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path fill="currentColor" stroke="none" d="M25 10h-2V8h2v2ZM25 25h-2v-2h2v2ZM25 40h-2v-2h2v2Z"></path><path d="M25 10h-2V8h2v2ZM25 25h-2v-2h2v2ZM25 40h-2v-2h2v2Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconMoreVertical',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-more-vertical`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
