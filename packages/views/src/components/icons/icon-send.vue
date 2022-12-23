<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path stroke-miterlimit="3.864" d="m14 24-7-5V7l34 17L7 41V29l7-5Zm0 0h25"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconSend',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-send`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
