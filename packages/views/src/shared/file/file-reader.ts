import { camelCase } from 'lodash-es'

type ReadBlob = Blob | File
type ReadProgress = (e: ProgressEvent) => void
type ReadMethod = 'ArrayBuffer' | 'BinaryString' | 'DataURL' | 'Text'

export type ReadOption = {
	method: ReadMethod
	encoding?: string
	onProgress?: ReadProgress
}

export default function readBlob(blob: ReadBlob, option?: ReadOption) {
	return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
		if (!(blob instanceof Blob)) throw new TypeError('Must be a File or Blob')
		const fr = new FileReader()
		// 处理事件
		fr.onload = ({ target }) => resolve(target!.result)
		fr.onerror = reject
		fr.onprogress = (e: ProgressEvent) => {
			const percent = (e.loaded / e.total) * 100.0
			option?.onProgress?.({ ...e, percent } as any)
		}
		// 获取读取方法
		const method = camelCase(`readAs${option?.method || 'ArrayBuffer'}`)
		// 读取数据
		const readers = fr as any
		if (readers[method]) {
			readers[method](blob, option?.encoding)
		} else {
			fr.readAsArrayBuffer(blob)
		}
	})
}

export function readBase(blob: Blob, onProgress?: ReadProgress): Promise<string | null> {
	return readBlob(blob, { method: 'DataURL', onProgress }) as Promise<string | null>
}

export function readText(blob: ReadBlob, encoding?: string, onProgress?: ReadProgress) {
	return readBlob(blob, { method: 'Text', encoding: encoding || 'utf8', onProgress }) as Promise<string>
}

export function readJson(blob: ReadBlob, defValue?: any, onProgress?: ReadProgress): Promise<any> {
	return readText(blob, undefined, onProgress)
		.then(text => JSON.parse(text as string))
		.catch(err => defValue ?? Promise.reject(err))
}
