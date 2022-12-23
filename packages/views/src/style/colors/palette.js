// @ts-nocheck
// const { generate } = require('@chen-design/chen-color')
const { generate } = require('@arco-design/color')

module.exports = {
	install(_, __, functions) {
		functions.add('color-palette', (color, index) => {
			return generate(color.value, { index: index.value })
		})
		functions.add('color-palette-dark', (color, index) => {
			return generate(color.value, { index: index.value, dark: true })
		})
	}
}