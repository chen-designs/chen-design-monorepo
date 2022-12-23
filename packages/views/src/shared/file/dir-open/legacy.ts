import { debounce, filter, after } from 'lodash-es'
import { resolveAccepts } from '../file-open/native'
import type { DirOption } from './native'

export default function open(option: DirOption) {
	return new Promise<File[]>((resolve, reject) => {
		const delay = 1000
		// 获取可接受的文件类型
		const { accepts, inclusive } = resolveAccepts(option.accepts || [])
		// 创建 Input 标签
		const input = document.createElement('input')
		input.setAttribute('type', 'file')
		input.setAttribute('accept', accepts)
		input.setAttribute('webkitdirectory', 'yes')
		// 是否多选
		const depth = (option.recursive as number) + 1
		// 处理 Input 事件
		const onFileChange = () => {
			if (!document.hasFocus()) return
			if (!input.files?.length) return reject(new Error('Canceled file select.'))
			// 过滤无效的文件
			const files = filter(input.files || [], file => {
				if (!inclusive(file)) return false
				return String(file.webkitRelativePath).split('/').length <= depth
			})
			if (!files.length) return reject(new Error('Select file invalid.'))
			// 返回选择的文件
			resolve(files)
		}
		// 处理 Window 焦点事件
		const onWinFocus = after(2, () => {
			const env = document.createEvent('HTMLEvents')
			env.initEvent('change', false, false)
			input.dispatchEvent(env)

			window.removeEventListener('focus', onWinFocus)
		})
		// 监听事件
		input.addEventListener('change', debounce(onFileChange, delay))
		window.addEventListener('focus', onWinFocus)
		// 选择文件
		input.click()
	})
}
