<template>
	<div>Error</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'NotFound',
	setup: (props) => {
		console.info('props : ', props);
	}
});
</script>
