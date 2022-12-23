<template>
	<div :class="classes">
		<div :class="`${prefix}-image`">
			<!-- slot: image -->
			<slot name="image">
				<empty-image :image="image" />
			</slot>
		</div>
		<template v-if="$slots.default || description">
			<div :class="`${prefix}-description`">
				<!-- slot: default -->
				<slot name="default">{{ description }}</slot>
			</div>
		</template>
		<template v-if="$slots.footer">
			<div :class="`${prefix}-footer`">
				<!-- slot: footer -->
				<slot name="footer"></slot>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { prefixClass, prefixName } from '../../utils/config'
import EmptyImage from './images'

export default defineComponent({
	name: prefixName('Empty'),

	components: { EmptyImage },

	props: {
		/**
		 * 图片
		 * @values default, simple
		 * @defaultValue default
		 */
		image: { type: String, default: 'simple' },
		/**
		 * 描述
		 */
		description: { type: String },
		/**
		 * 不填充父容器
		 */
		fitno: { type: Boolean }
	},

	expose: ['$el'],

	setup: (props, { slots }) => {
		const prefix = prefixClass('Empty')

		const classes = computed(() => {
			return {
				[prefix]: true,
				[`${prefix}-fit`]: !props.fitno,
				[`${prefix}-normal`]: !(props.image || slots.image)
			}
		})

		return { prefix, classes }
	}
})
</script>
