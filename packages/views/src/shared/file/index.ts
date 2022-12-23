export { default as dirOpen, type DirOption } from './dir-open'
export { default as fileOpen, type FileOption } from './file-open'
export { default as saveOpen, type SaveOption } from './file-save'
export { default as readBlob, readBase, readText, readJson, type ReadOption } from './file-reader'
export { default as fileMime, type ResolveResult } from './file-mime'

export function basename(path: string) {
	const pathstr = String(path || '')
	let idx = pathstr.lastIndexOf('/')
	idx = idx > -1 ? idx : pathstr.lastIndexOf('\\')
	return idx < 0 ? pathstr : pathstr.substring(idx + 1)
}

export function filename(path: string, ext?: string) {
	const name = basename(path)
	if (!ext) return name
	return name.replace(new RegExp(`.${ext}$`), '')
}
