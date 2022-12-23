<template>
	<svg viewBox="0 0 24 24" :class="classes" :style="styles"><path fill="currentColor" d="M20 20h-4v-4h4v4Zm-6 0h-4v-4h4v4Zm-6 0H4v-4h4v4Zm12-6h-4v-4h4v4Zm-6 0h-4v-4h4v4Zm-6 0H4v-4h4v4Zm12-6h-4V4h4v4Zm-6 0h-4V4h4v4ZM8 8H4V4h4v4Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconGrid',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-grid`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
