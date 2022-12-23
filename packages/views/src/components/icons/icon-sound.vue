<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path stroke-linejoin="round" d="m14 16 10-9v34l-10-9H6V16h8Z"></path><path d="M31.071 16.929c3.905 3.905 3.905 10.237 0 14.142M36.727 11.272c7.03 7.03 7.03 18.426 0 25.456"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconSound',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-sound`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
