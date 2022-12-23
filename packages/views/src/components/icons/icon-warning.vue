<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M23 9h2v21h-2z"></path><path fill="currentColor" stroke="none" d="M23 9h2v21h-2z"></path><path d="M23 37h2v2h-2z"></path><path fill="currentColor" stroke="none" d="M23 37h2v2h-2z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconWarning',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-warning`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
