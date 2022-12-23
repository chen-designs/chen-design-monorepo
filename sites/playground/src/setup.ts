import { App } from 'vue'
import views from '@chen-design/views'
import * as allviews from '@chen-design/views'
// 注册图标
import 'virtual:svg-icons-register'

console.info('allviews : ', allviews)

export default {
	install: (app: App) => {
		app.use(views, { icon: 'aaa' })
	}
}
