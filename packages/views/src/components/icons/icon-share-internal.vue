<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M40 35v6H8v-6m1.108-4c1.29-8.868 13.917-15.85 29.392-15.998M30 6l9 9-9 9"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconShareInternal',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-share-internal`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
