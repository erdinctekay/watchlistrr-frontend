import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouteStore } from '@/stores/RouteStore'

import { watchlist } from '@/services/backend'

const routes = [
	{
		path: '/',
		name: 'home',
		component: () => import('@/views/Home.vue'),
		meta: {
			requiresSorting: true,
		},
	},
	{
		path: '/watchlist/:id',
		name: 'watchlist.show',
		component: () => import('@/views/WatchlistShow.vue'),
		async beforeEnter(to, from) {
			const response = await watchlist.get(to.params.id)

			if (!response.ok)
				return {
					name: '404',
					params: { pathMatch: to.path.split('/').slice(1) },
					query: to.query,
					hash: to.hash,
				}
		},
		meta: {
			requiresSorting: true,
		},
	},
	{
		path: '/account',
		name: 'account',
		component: () => import('@/views/Account.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/account/change-password',
		name: 'changePassword',
		component: () => import('@/views/ChangePassword.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/auth/register',
		name: 'register',
		component: () => import('@/views/auth/Register.vue'),
		meta: {
			requiresNotAuth: true,
		},
	},
	{
		path: '/auth/login',
		name: 'login',
		component: () => import('@/views/auth/Login.vue'),
		meta: {
			requiresNotAuth: true,
		},
	},
	{
		path: '/auth/logout',
		name: 'logout',
		component: () => import('@/views/auth/Logout.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/auth/forgot-password',
		name: 'forgotPassword',
		component: () => import('@/views/auth/ForgotPassword.vue'),
		meta: {
			requiresNotAuth: true,
		},
	},
	{
		path: '/__/auth/action',
		name: 'firebaseAuthAction',
		component: () => import('@/views/auth/FirebaseAuthAction.vue'),
	},
	{
		path: '/:pathMatch(.*)*',
		name: '404',
		component: () => import('@/views/404NotFound.vue'),
	},
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { top: 0 }
	},
})

// to redirect auth related paths to auth/path
const authPaths = ['login', 'logout', 'register', 'forgot-password']

// restrict routes before enter
router.beforeEach(async (to, from, next) => {
	let { fetchUser } = useAuthStore()
	await fetchUser()

	// should be next()
	const returnPage = (page) => {
		next({ name: page })
	}

	// to.name === 'logout'
	// to.matched.some((record) => record.meta.requiresAuth
	if (to.meta.requiresNotAuth && useAuthStore().isAuthenticated) {
		return returnPage('home')
	}

	if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
		return returnPage('home')
	}

	// redirect auth related paths to auth/path
	/* should work before other controllers */
	const path = to.path.replace('/', '')
	if (authPaths.includes(path)) {
		return returnPage(path)
	}

	next()
})

router.beforeResolve(async (to) => {
	// set current page to store
	const { updateCurrentPage } = useRouteStore()
	updateCurrentPage(to)
})

export default router
