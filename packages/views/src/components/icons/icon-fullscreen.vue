<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M42 17V9a1 1 0 0 0-1-1h-8M6 17V9a1 1 0 0 1 1-1h8m27 23v8a1 1 0 0 1-1 1h-8M6 31v8a1 1 0 0 0 1 1h8"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconFullscreen',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-fullscreen`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
