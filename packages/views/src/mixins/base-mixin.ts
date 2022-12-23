import { defineComponent } from 'vue'
import { prefixClass } from '../utils/config'

export default defineComponent({
	computed: {
		clsprefix() {
			return prefixClass(this.$options.name || 'base-mixins')
		}
	}
})
