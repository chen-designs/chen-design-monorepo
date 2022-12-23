import { resolve } from '../file-mime'
import { StartInDirectory, fileWithHandle } from '../file-open/native'

export type SaveOption = {
	id?: string
	description: string
	fileName: string
	startIn?: StartInDirectory
	excludeAcceptAllOption: boolean
}

const openSave = (handle: FileSystemFileHandle | undefined, blob: Blob, option: SaveOption) => {
	if (handle instanceof FileSystemFileHandle) return Promise.resolve(handle)

	const { type, exts } = resolve(blob.type || 'text/plain')

	const accept = { [type]: exts }

	return window.showSaveFilePicker({
		id: option.id || 'FileSave',
		startIn: option.startIn || 'downloads',
		suggestedName: option.fileName || 'New File',
		types: [{ accept, description: option.description || 'Save' }],
		excludeAcceptAllOption: option.excludeAcceptAllOption || false
	})
}

export default function save(blob: Blob, option: SaveOption, handle?: FileSystemFileHandle) {
	const fileWrite = (fileHandle: any, blob: Blob) => {
		return fileHandle
			.createWritable()
			.then((fsw: any) => [fsw.write(blob), fsw.close()])
			.then(() => fileWithHandle(fileHandle))
	}
	return openSave(handle, blob, option).then(handle => fileWrite(handle, blob)) as Promise<File>
}
