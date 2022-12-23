const { getRgbStr } = require('@arco-design/color')
// const { rgbStr } = require('@chen-design/chen-color')

module.exports = {
	install(_, __, functions) {
		functions.add('rgb-str', color => {
			return getRgbStr(color.value)
		})

		functions.add('var-str', color => {
			if (color.value.indexOf('rgb') === 0) {
				return color.value.replace(/rgb\((.*)\)/, '$1')
			}
			return getRgbStr(color.value)
		})
	}
}
