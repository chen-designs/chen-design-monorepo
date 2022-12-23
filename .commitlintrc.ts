const config = require('./.cz-config')

module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [2, 'always', config.types.map(({ value }) => value)],
		'type-empty': [2, 'never'],
		// 'scope-empty': [2, 'never'],
		'subject-empty': [2, 'never'],
		'subject-case': [2, 'never', []],
		'body-leading-blank': [1, 'always'],
		'footer-leading-blank': [1, 'always']
	}
}
