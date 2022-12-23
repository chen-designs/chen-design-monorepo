import { debounce, filter } from 'lodash-es'
import { FileOption, resolveAccepts } from './native'

export default function open(option: FileOption) {
	return new Promise<File | File[]>((resolve, reject) => {
		// 是否多选
		const multiple = option.multiple || false
		// 获取可接受的文件类型
		const { accepts, inclusive } = resolveAccepts(option.accepts || [])
		// 创建 Input 标签
		const input = document.createElement('input')
		input.setAttribute('type', 'file')
		input.setAttribute('multiple', multiple ? 'yes' : 'no')
		input.setAttribute('accept', accepts)
		// 处理 Input 事件
		const onFileChange = () => {
			if (!input.files?.length) return reject(new Error('Canceled file select.'))
			// 过滤无效的文件
			const files = filter(input.files || [], file => inclusive(file))
			if (!files.length) return reject(new Error('Select file invalid.'))
			// 返回选择的文件
			resolve(multiple ? files : files[0])
		}
		// 处理 Window 焦点事件
		const onWinBlur = () => {
			const onWinFocus = () => {
				if (!input) return
				const env = document.createEvent('HTMLEvents')
				env.initEvent('change', false, false)
				input.dispatchEvent(env)
			}
			window.addEventListener('focus', debounce(onWinFocus, 500), { once: true, capture: true })
		}
		// 监听事件
		input.addEventListener('change', onFileChange, { once: true })
		window.addEventListener('blur', debounce(onWinBlur, 500), { once: true, capture: true })
		// 选择文件
		input.click()
	})
}
