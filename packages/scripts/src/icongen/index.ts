import path from 'path'
import glob from 'glob'
import fs from 'fs-extra'
import { map, each, kebabCase, capitalize, camelCase } from 'lodash'
import { optimize } from 'svgo'
import { JSDOM } from 'jsdom'
import prettier from 'prettier'
import config from './svgo.config'
import { genIconVomponent } from './templates'

const root = process.cwd()

interface IconData {
	name: string
	path: string
}

const loadSvgs = () => {
	const files = glob.sync(`src/icons/**/*.svg`, { cwd: root, absolute: true })
	return map(files, filepath => {
		return {
			name: kebabCase(`icon-${path.basename(filepath, '.svg')}`),
			path: filepath
		} as IconData
	})
}

const genIconConponents = async (datas: IconData[]) => {
	const output = path.resolve(root, 'src/components/icons')
	await fs.emptyDir(output)

	each(datas, item => {
		const file = fs.readFileSync(item.path, 'utf8')

		const { data } = optimize(file, { path: item.path, ...config })
		if (data) {
			const svgElement = JSDOM.fragment(data).firstElementChild
			if (svgElement) {
				fs.outputFile(path.resolve(output, `${item.name}.vue`), genIconVomponent(item.name, svgElement.outerHTML), (err: any) => {
					console.info(`Build ${item.name} ${err ? 'Failed: ' + err : 'Success!'}`)
				})
			}
		}
	})
}

// packages/views/src/components/icon/icons

export default async function icongen() {
	console.info('生成图标 : ')

	const data = loadSvgs()

	await genIconConponents(data)
}
