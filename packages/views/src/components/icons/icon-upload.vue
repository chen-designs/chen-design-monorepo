<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M14.93 17.071 24.001 8l9.071 9.071m-9.07 16.071v-25M40 35v6H8v-6"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconUpload',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-upload`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
