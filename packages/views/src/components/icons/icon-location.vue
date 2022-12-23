<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><circle cx="24" cy="19" r="5"></circle><path d="M39 20.405C39 28.914 24 43 24 43S9 28.914 9 20.405C9 11.897 15.716 5 24 5c8.284 0 15 6.897 15 15.405Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconLocation',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-location`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
