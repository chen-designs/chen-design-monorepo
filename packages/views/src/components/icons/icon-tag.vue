<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M24.835 6.035a1 1 0 0 1 .903-.273l12.964 2.592a1 1 0 0 1 .784.785l2.593 12.963a1 1 0 0 1-.274.904L21.678 43.133a1 1 0 0 1-1.415 0L4.708 27.577a1 1 0 0 1 0-1.414L24.835 6.035Z"></path><path d="M31.577 17.346a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path><path fill="currentColor" stroke="none" d="M31.582 17.349a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconTag',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-tag`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
