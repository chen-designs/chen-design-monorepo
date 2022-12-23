import { resolve } from 'path'
import { defineConfig } from 'vite'
import Banner from 'vite-plugin-banner'
import PluginVue from '@vitejs/plugin-vue'
import PurgeIcons from 'vite-plugin-purge-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import RemoveConsole from 'vite-plugin-remove-console'
import HtmlEnv from 'vite-plugin-html-env'
import { compression as Compression } from 'vite-plugin-compression2'
import FileMock from 'vite-plugin-file-mock'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
			'@chen-design/views': resolve(__dirname, '../../packages/views/src/index.ts')
		}
		// alias: [
		// 	{ find: /^@\/(.*)/, replacement: resolve(__dirname, 'src/$1') },
		// 	{ find: /^@chen-design\/views/, replacement: resolve(__dirname, '../../packages/views/src/index.ts') },
		// ],
	},
	plugins: [
		Banner({ content: 'this is a banner', debug: true }),
		PluginVue(),
		PurgeIcons({ content: ['**/*.html', '**/*.ts', '**/*.tsx', '**/*.vue'] }),
		AutoImport({
			dts: resolve(__dirname, 'src/typings/auto-imports.d.ts'),
			imports: ['vue', 'vue-router']
		}),
		Components({
			dts: resolve(__dirname, 'src/typings/components.d.ts'),
			resolvers: []
		}),
		RemoveConsole(),
		HtmlEnv({ compress: true }),
		Compression(),
		FileMock({ dir: 'src/mocks' })
	]
})
