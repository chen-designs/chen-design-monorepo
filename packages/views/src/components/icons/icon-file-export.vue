<template>
	<svg viewBox="0 0 36 36" :class="classes" :style="styles"><path fill="currentColor" d="M28.32 16.35a1 1 0 0 0-1.41 1.41L30.16 21H18a1 1 0 0 0 0 2h12.19l-3.28 3.28a1 1 0 1 0 1.41 1.41L34 22Z"></path><path fill="currentColor" d="M26 12.34a7.53 7.53 0 0 1-2-1.85v3.89h2Z"></path><path fill="currentColor" d="M6 13.61h7.61V6h8.89a7.49 7.49 0 0 1 .28-2H10.87L4 10.87V30a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2H6Zm0-1.92L11.69 6H12v6H6Z"></path><circle cx="30" cy="6" r="5" fill="currentColor"></circle><path fill="none" d="M0 0h36v36H0z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconFileExport',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-file-export`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
