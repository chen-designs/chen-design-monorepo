import { filter } from 'lodash-es'
import { StartInDirectory, fileWithHandle, resolveAccepts } from '../file-open/native'

export type DirOption = {
	id: string
	mode: 'read' | 'readwrite'
	startIn: StartInDirectory
	recursive: boolean | number
	accepts?: string[]
}

function flatFiles(dirHandle: FileSystemDirectoryHandle, depth: number, path?: string) {
	const files = [] as any[]

	const eachIterator = (iterator: any) => {
		return iterator.next().then(({ done, value }: { done: boolean; value: FileSystemFileHandle }) => {
			if (done) return Promise.resolve()
			const nestedPath = `${path || dirHandle.name}/${value.name}`
			if (value.kind === 'file') {
				files.push(fileWithHandle(value, nestedPath, dirHandle))
			} else if (value.kind === 'directory' && depth > 1) {
				files.push(flatFiles(value as any, depth - 1, nestedPath))
			}
			return eachIterator(iterator)
		})
	}

	return eachIterator((dirHandle as any).values())
		.then(() => files.flat())
		.then((promises: any[]) => Promise.all(promises))
}

export default function open(option: DirOption) {
	const { inclusive } = resolveAccepts(option.accepts || [])

	const promise = window.showDirectoryPicker({
		id: option.id || 'DirOpen',
		startIn: option.startIn || 'desktop',
		mode: option.mode || 'read'
	})

	return promise
		.then(handle => flatFiles(handle, option.recursive as number))
		.then(results => filter(results.flat() as File[], file => inclusive(file)))
		.then(files => {
			if (!files.length) return Promise.reject(new Error('Select file invalid.'))
			// 返回选择的文件
			return files
		})
}
