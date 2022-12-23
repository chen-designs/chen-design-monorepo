<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M24 30v4m0 3v6m19-19h-6m-3 0h-4M7 7h17v17H7V7Zm0 25h9v9H7v-9Zm25 0h9v9h-9v-9Zm0-25h9v9h-9V7Zm-18 7h3v3h-3v-3Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconQrcode',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-qrcode`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
