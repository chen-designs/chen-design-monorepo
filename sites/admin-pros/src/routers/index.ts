import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'

// 隐藏右上角加载动画
NProgress.configure({ showSpinner: true })

export const WHITES: RouteRecordRaw[] = [
	{ path: '/', redirect: '/login' },
	{
		path: '/login',
		name: 'LOGIN',
		component: () => import('@/views/login/index.vue')
	}
	// {
	// 	path: '/:path(*)',
	// 	name: 'NOT_FOUND',
	// 	component: () => import('@/views/login/index.vue')
	// }
]

const router = createRouter({
	history: createWebHistory('./'),
	routes: WHITES.concat([])
	// parseQuery: () => {},
	// stringifyQuery: () => {},
})
router.beforeEach((to, from, next) => {
	NProgress.start()

	next()
})

router.afterEach(() => {
	NProgress.done()
})

export default router
