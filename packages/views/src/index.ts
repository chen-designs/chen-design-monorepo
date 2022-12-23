import { App } from 'vue'
import { has } from 'lodash-es'
import { GlobalOptions } from './utils/options'
export * from './components'
import * as components from './components'

import './style.less'

export default function (app: App, options: GlobalOptions) {
	for (const key of Object.keys(components)) {
		const component = (components as any)[key]
		if (has(component, 'install')) {
			app.use(component, options)
		}
	}
}
