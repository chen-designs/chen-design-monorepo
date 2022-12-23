import { uniqueId } from 'lodash-es'

export function genId(prefix: string) {
	return uniqueId(`${prefix}-`)
}
