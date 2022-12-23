import type { App, Component, Plugin } from 'vue'
import { extend, merge, camelCase, kebabCase, upperFirst } from 'lodash-es'
import { GlobalOptions, BaseOptions } from './options'
import { SfcInstall } from './types'

const CONFIG_NAME = String('$CHVIEWS')
const DEFAULT_PREFIX = String('ch')

const GLOBAL_CONFIG: GlobalOptions = {}

export function setupConfigs(app: App, options: GlobalOptions) {
	const defaults = extend(GLOBAL_CONFIG, options)
	if (!app.config.globalProperties[CONFIG_NAME]) {
		app.config.globalProperties[CONFIG_NAME] = defaults
	}
	return defaults
}

export function prefixName(name: string) {
	const prefix = DEFAULT_PREFIX
	return upperFirst(camelCase(`${prefix} ${name}`))
}

export function prefixClass(name: string) {
	const PREFIX_REGEX = new RegExp(`^${DEFAULT_PREFIX}-`, 'i')
	const clsname = kebabCase(`${name || 'unkown'}`)
	return PREFIX_REGEX.test(clsname) ? clsname : kebabCase(`${DEFAULT_PREFIX}-${clsname}`)
}

export function expose<T extends BaseOptions>(...components: Component[]) {
	return Object.assign(components[0], {
		install: (app, options: T) => {
			merge(GLOBAL_CONFIG, { [components[0].name!]: options })
			// 注册组件
			components.forEach(component => {
				app.component(component.name!, component)
			})
		}
	} as SfcInstall) as Plugin & typeof components[0]
}
