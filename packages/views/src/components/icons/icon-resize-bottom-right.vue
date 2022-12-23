<template>
	<svg viewBox="0 0 24 24" :class="classes" :style="styles"><path fill="currentColor" d="M22 22h-2v-2h2v2m0-4h-2v-2h2v2m-4 4h-2v-2h2v2m0-4h-2v-2h2v2m-4 4h-2v-2h2v2m8-8h-2v-2h2v2Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconResizeBottomRight',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-resize-bottom-right`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
