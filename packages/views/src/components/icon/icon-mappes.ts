import { defineAsyncComponent } from 'vue'
import { isFunction, transform } from 'lodash-es'
import { filename } from '../../shared/file'

const modules = import.meta.glob('../icons/*.vue', { eager: false })

const convert = (mappers: any, value: any, iconpath: string) => {
	const name = filename(iconpath, 'vue')
	mappers[name] = isFunction(value) ? defineAsyncComponent(value) : value.default
}

export default transform(modules, convert, Object.create(null)) as any
