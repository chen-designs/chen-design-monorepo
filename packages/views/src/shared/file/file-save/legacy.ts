import { saveAs } from 'file-saver'
import { resolve as resolveType } from '../file-mime'
import { SaveOption } from './native'

export default function save(blob: Blob, option: SaveOption) {
	return new Promise<File>(resolve => {
		const { ext } = resolveType(blob.type || 'text/plain')

		const fileName = String(option.fileName || 'New File').replace(new RegExp(`${ext}$`, 'i'), ext || '')

		const file = blob instanceof File ? blob : new File([blob], fileName, { type: blob.type })

		saveAs(file, file.name)

		return resolve(file)
	})
}
