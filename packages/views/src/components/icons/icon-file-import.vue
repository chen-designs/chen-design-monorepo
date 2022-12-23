<template>
	<svg viewBox="0 0 36 36" :class="classes" :style="styles"><path fill="currentColor" d="M11.94 26.28a1 1 0 1 0 1.41 1.41L19 22l-5.68-5.68a1 1 0 0 0-1.41 1.41L15.2 21H3a1 1 0 1 0 0 2h12.23Z"></path><path fill="currentColor" d="M28 13.22V30H8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V13.5a7.49 7.49 0 0 1-2-.28Z"></path><path fill="currentColor" d="M10 13.61h7.61V6h4.89a7.49 7.49 0 0 1 .28-2h-7.91L8 10.86V15h2Zm0-1.92L15.7 6h.3v6h-6Z"></path><circle cx="30" cy="6" r="5" fill="currentColor"></circle><path fill="none" d="M0 0h36v36H0z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconFileImport',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-file-import`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
