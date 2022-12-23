import { Config } from 'svgo'

export default {
	plugins: [
		{
			name: 'preset-default',
			params: {
				overrides: { removeViewBox: false }
			}
		},
		'removeStyleElement',
		'removeScriptElement',
		'removeDimensions',
		{
			name: 'removeAttrs',
			params: { attrs: ['class', 'style'] }
		},
		{
			name: 'addAttributesToSVGElement',
			params: {
				attributes: [
					{ ':class': 'classes' },
					{ ':style': 'styles' }
					// { ':stroke-width': 'strokeWidth' },
					// { ':stroke-linecap': 'strokeLinecap' },
					// { ':stroke-linejoin': 'strokeLinejoin' }
				]
			}
		}
	]
} as Config
