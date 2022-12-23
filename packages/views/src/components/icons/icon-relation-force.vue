<template>
	<svg viewBox="0 0 32 32" :class="classes" :style="styles"><path fill="currentColor" d="M26 6a3.996 3.996 0 0 0-3.858 3H17.93A7.996 7.996 0 1 0 9 17.93v4.212a4 4 0 1 0 2 0v-4.211a7.951 7.951 0 0 0 3.898-1.62l3.669 3.67A3.953 3.953 0 0 0 18 22a4 4 0 1 0 4-4 3.952 3.952 0 0 0-2.019.567l-3.67-3.67A7.95 7.95 0 0 0 17.932 11h4.211A3.993 3.993 0 1 0 26 6ZM12 26a2 2 0 1 1-2-2 2.002 2.002 0 0 1 2 2Zm-2-10a6 6 0 1 1 6-6 6.007 6.007 0 0 1-6 6Zm14 6a2 2 0 1 1-2-2 2.002 2.002 0 0 1 2 2Zm2-10a2 2 0 1 1 2-2 2.002 2.002 0 0 1-2 2Z"></path></svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { val2px } from '../../utils/pixels'

export default defineComponent({
	name: 'IconRelationForce',
	props: {
		size: { type: [Number, String] }
	},
	setup: props => {
		return {
			classes: [`icon-relation-force`],
			styles: { fontSize: val2px(props.size) }
		}
	}
})
</script>
