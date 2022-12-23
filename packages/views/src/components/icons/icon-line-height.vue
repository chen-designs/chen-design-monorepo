<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M4 8h14.5M33 8H18.5m0 0v34"></path><path fill="currentColor" stroke="none" d="M39 9.5 37 13h4l-2-3.5ZM39 38.5 37 35h4l-2 3.5Z"></path><path d="M39 13h2l-2-3.5-2 3.5h2Zm0 0v22m0 0h2l-2 3.5-2-3.5h2Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconLineHeight',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-line-height`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
