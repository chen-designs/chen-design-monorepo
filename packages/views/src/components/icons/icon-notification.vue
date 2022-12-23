<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M24 9c7.18 0 13 5.82 13 13v13H11V22c0-7.18 5.82-13 13-13Zm0 0V4M6 35h36m-25 7h14"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconNotification',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-notification`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
