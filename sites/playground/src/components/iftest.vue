<template>
	<span v-if="!hide" v-demo>
		<slot></slot>
	</span>
</template>

<script lang="ts">
export default {
	name: 'Iftest',

	directives: {
		demo: () => {
			console.info('test directives')
		},
	},

	props: {
		hide: { type: Boolean, default: false },
	},
}
</script>
