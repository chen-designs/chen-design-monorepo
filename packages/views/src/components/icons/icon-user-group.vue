<template>
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 48 48" :class="classes" :style="styles"><circle cx="18" cy="15" r="7"></circle><circle cx="34" cy="19" r="4"></circle><path d="M6 34a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v6H6v-6ZM34 30h4a4 4 0 0 1 4 4v4h-8"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconUserGroup',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-user-group`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
