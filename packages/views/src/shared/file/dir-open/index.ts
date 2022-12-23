import legacy from './legacy'
import native, { type DirOption } from './native'

export type { DirOption } from './native'

export default function dirOpen(option?: DirOption) {
	const opts = (option || {}) as DirOption
	const recursive = opts.recursive === true ? Number.MAX_SAFE_INTEGER : Math.max(opts.recursive || 0, 1)
	if ('showDirectoryPicker' in (window || {})) return native({ ...opts, recursive })
	return legacy({ ...opts, recursive })
}
