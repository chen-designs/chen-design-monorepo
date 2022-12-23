import { isEmpty, partition, filter, map, mergeWith } from 'lodash-es'
import { resolve } from '../file-mime'

export type StartInDirectory = 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos'

export type FileOption = {
	id?: string
	multiple?: boolean
	description: string
	startIn?: StartInDirectory
	accepts?: string[]
	excludeAcceptAllOption: boolean
}

export const DEFAULT_ACCEPTS = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.json']

export function resolveAccepts(accepts: FileOption['accepts']) {
	const [mimes, exts] = partition(isEmpty(accepts || []) ? DEFAULT_ACCEPTS : accepts, value => {
		return /^[a-z]+\//.test(value)
	})

	const match = (pattern: string, str: string) => {
		return new RegExp(pattern, 'i').test(str)
	}

	const inclusive = (file: File) => {
		if (isEmpty(mimes) && isEmpty(exts)) return true
		if (isEmpty(mimes)) return exts.some(ext => match(`${ext}$`, file.name))
		return mimes.some(mime => match(mime.replace('*', '.*'), file.type))
	}

	return { mimes, exts, inclusive, accepts: mimes.concat(exts).join(',') }
}

export function resolveTypes(option: { mimes: string[]; exts: string[] }) {
	const [first, ...mimes] = map(option.mimes, mime => {
		const { type, exts } = resolve(mime)
		return { [type]: exts }
	})

	const exts = map(option.exts, ext => {
		const { type, exts } = resolve(ext)
		return { [type]: exts }
	})

	const accepts = mergeWith(first, ...mimes.concat(exts), (oval: any, sval: any) => {
		return [].concat(oval || [], sval || [])
	})

	return map(accepts, (exts, type) => ({ accept: { [type]: exts } }))
}

export function fileWithHandle(handle: FileSystemFileHandle, path?: string, dirHandle?: FileSystemDirectoryHandle) {
	return handle.getFile().then(file => {
		return Object.defineProperties(file, {
			dirHandle: { configurable: true, enumerable: true, get: () => dirHandle },
			handle: { configurable: true, enumerable: true, get: () => handle },
			webkitRelativePath: {
				configurable: true,
				enumerable: true,
				get: () => path || dirHandle?.name || file.name
			}
		})
	})
}

export default function open(option: FileOption) {
	const { mimes, exts, inclusive } = resolveAccepts(option.accepts || [])

	const types = resolveTypes({ mimes, exts })

	const promise = window.showOpenFilePicker({
		id: option.id || 'FileOpen',
		startIn: option.startIn || 'desktop',
		multiple: option.multiple || false,
		excludeAcceptAllOption: option.excludeAcceptAllOption || false,
		types
	})

	return promise
		.then(handles => handles.map(handle => fileWithHandle(handle)))
		.then(handles => Promise.all(handles))
		.then(results => filter(results, file => inclusive(file)))
		.then(files => {
			if (!files.length) return Promise.reject(new Error('Select file invalid.'))
			// 返回选择的文件
			return option.multiple ? Array.from(files) : files[0]
		})
}
