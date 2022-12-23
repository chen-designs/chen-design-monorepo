import { times } from 'lodash-es'
import { defineComponent, h } from 'vue'
import { prefixName } from '../../utils/config'
import SkeletonItem from './skeleton-item'

export default defineComponent({
	name: prefixName('SkeletonLine'),

	props: {
		/**
		 * 展示的段落行数
		 */
		rows: { type: Number, default: 3 }
	},

	setup(props) {
		return () => {
			return times(props.rows, i => {
				const last = i >= 2 && i === props.rows - 1
				return h(SkeletonItem, {
					class: [{ first: i === 0 && props.rows > 1, last }]
				})
			})
		}
	}
})
