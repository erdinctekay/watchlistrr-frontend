import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouteStore } from '@/stores/RouteStore'

// pages
import Home from '../views/Home.vue'

const routes = [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: {
			requiresSorting: true,
		},
	},
	{
		path: '/watchlist/:id',
		name: 'watchlist.show',
		component: () => import('@/views/WatchlistShow.vue'),
		beforeEnter(to, from) {
			const exist = true // await fetch

			if (!exist)
				return {
					name: '404',
					// keep the url same
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
		path: '/register',
		name: 'register',
		component: () => import('@/views/Register.vue'),
		meta: {
			requiresNotAuth: true,
		},
	},
	{
		path: '/login',
		name: 'login',
		component: () => import('@/views/Login.vue'),
		meta: {
			requiresNotAuth: true,
		},
	},
	{
		path: '/logout',
		name: 'logout',
		component: () => import('@/views/Logout.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/forgot-password',
		name: 'forgotPassword',
		component: () => import('@/views/ForgotPassword.vue'),
		meta: {
			requiresNotAuth: true,
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
		path: '/account',
		name: 'account',
		component: () => import('@/views/Account.vue'),
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: '/__/auth/action',
		name: 'firebaseAuthAction',
		component: () => import('@/views/FirebaseAuthAction.vue'),
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

	next()
})

router.beforeResolve(async (to) => {
	// set current page to store
	const { updateCurrentPage } = useRouteStore()
	updateCurrentPage(to)
})

export default router
