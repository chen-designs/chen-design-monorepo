import Mime, { TypeMap } from 'mime'
import { isEmpty, transform } from 'lodash-es'

const caches = { extensions: {} as Record<string, string[]> }

const resoloveExtensions = () => {
	if (!isEmpty(caches.extensions)) return caches.extensions

	const convert = (mapper: Record<string, string[]>, ext: string, mime: string) => {
		const [prefix] = String(mime || '').match(/^[a-z]+/i) || []
		const type = `${prefix}/*`
		const exists = mapper[type] || (mapper[type] = [])
		exists.push(`.${ext}`)
	}

	return transform((Mime as any)._extensions, convert, {})
}

export type ResolveResult = {
	type: string
	mime: string | null
	ext: string | null
	exts: string[]
}

export function resolve(type: string): ResolveResult {
	const mappers = resoloveExtensions()

	const resolveType = (mime: string | null) => {
		const [prefix] = String(mime || '').match(/^[a-z]+/i) || []
		return prefix ? `${prefix}/*` : mime!
	}
	// 根据类型获取后缀
	if (/^([a-z]+\/\*)/i.test(type)) {
		const exts = mappers[type] || []
		return { type, mime: null, ext: exts[0], exts }
	}
	// 根据类型获取后缀
	if (/^([a-z]+\/)/i.test(type)) {
		return resolve(Mime.getExtension(type!)!)
	}
	// 根据后缀获取类型
	const mime = Mime.getType(type)
	const ext = Mime.getExtension(mime!)
	return { type: resolveType(mime), mime, ext: ext ? `.${ext}` : null, exts: ext ? [`.${ext}`] : [] }
}

export function define(mimes: TypeMap, force = true) {
	caches.extensions = {}
	Mime.define(mimes, force)
}

export function getType(ext: string, isAlls = false) {
	const { mime, type } = resolve(ext)
	return isAlls ? type : mime
}

export function getExts(type: string, isAlls = false) {
	const { exts } = resolve(type)
	return isAlls ? exts : exts[0]
}

export default { resolve, define, getType, getExts }
