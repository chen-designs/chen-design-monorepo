import legacy from './legacy'
import native, { type FileOption } from './native'

export type { FileOption } from './native'

export default function fileOpen(option?: FileOption) {
	const opts = (option || {}) as FileOption
	if ('showOpenFilePicker' in (window || {})) return native(opts)
	return legacy(opts)
}
