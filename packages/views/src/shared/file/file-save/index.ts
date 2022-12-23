import legacy from './legacy'
import native, { type SaveOption } from './native'

export type { SaveOption } from './native'

export default function fileSave(blob: Blob | File, option?: SaveOption) {
	const opts = (option || {}) as SaveOption
	if ('showSaveFilePicker' in (window || {})) return native(blob, opts, (blob as any).handle)
	return legacy(blob, opts)
}
