import _ from 'lodash'

const CLICK_OUTSIDE = Symbol('click-outside')

export default {
	mounted(el, { value, modifiers }) {
		const handler = e => {
			if (el.contains(e.target)) return false
			if (_.isFunction(value)) return value(e)
		}
		handler.capture = modifiers.capture || false
		el[CLICK_OUTSIDE] = handler
		document.addEventListener('click', handler, handler.capture)
		document.addEventListener('contextmenu', handler, handler.capture)
	},
	unmounted(el) {
		const handlder = el[CLICK_OUTSIDE]
		document.removeEventListener('click', handlder, handlder.capture)
		document.removeEventListener('contextmenu', handlder, handlder.capture)
		delete el[CLICK_OUTSIDE]
	}
}
