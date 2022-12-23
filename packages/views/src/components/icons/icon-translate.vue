<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><path d="M42 25c0 9.941-8.059 18-18 18-6.867 0-12.836-3.845-15.87-9.5M28.374 27 25 18h-2l-3.375 9m8.75 0L31 34m-2.625-7h-8.75m0 0L17 34M6 25c0-9.941 8.059-18 18-18 6.867 0 12.836 3.845 15.87 9.5M43 25h-2l1-1 1 1ZM5 25h2l-1 1-1-1Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconTranslate',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-translate`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
