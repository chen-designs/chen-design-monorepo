<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M37 42H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2Z"></path><path fill="currentColor" stroke="none" d="M25 30a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path><path d="M25 30a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 0-.951-12.363a.5.5 0 0 1 .58-.532L30 18"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconFileAudio',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-file-audio`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
