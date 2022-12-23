<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path stroke-linejoin="round" d="M24 42c-6.075 0-11-4.925-11-11V18h22v13c0 6.075-4.925 11-11 11Zm0 0V23m11 4h8M5 27h8M7 14a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4m0 28v-.5a6.5 6.5 0 0 0-6.5-6.5M7 42v-.5a6.5 6.5 0 0 1 6.5-6.5M17 14a7 7 0 1 1 14 0"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconBug',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-bug`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
