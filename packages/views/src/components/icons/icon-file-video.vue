<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M37 42H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h21l7 7v27a2 2 0 0 1-2 2Z"></path><path d="M22 27.796v-6l5 3-5 3Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconFileVideo',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-file-video`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
