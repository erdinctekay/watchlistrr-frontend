import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/stores/AuthStore'
import { useRouteStore } from '@/stores/RouteStore'
import { useSortStore } from '@/stores/SortStore'
import { useMovieStore } from '@/stores/MovieStore'
import { useWatchlistStore } from '@/stores/WatchlistStore'

const routes = [
	{
		path: '/',
		redirect: { name: 'home' }, // redirect to the 'home'
	},
	{
		path: '/watchlists',
		name: 'home',
		component: () => import('@/views/Home.vue'),
		async beforeEnter(to, from) {
			console.log('entering: ' + to.name)

			const { changeWatchlistsBy } = useWatchlistStore()
			const response = await changeWatchlistsBy('all')
		},
		meta: {
			requiresSorting: true,
		},
	},
	{
		/* for watchlist with id */
		path: '/watchlists/:id',
		name: 'userWatchlists.show',
		component: () => import('@/views/UserWatchlistsShow.vue'),
		async beforeEnter(to, from) {
			const { changeWatchlistsBy } = useWatchlistStore()
			const response = await changeWatchlistsBy(to.params.id)

			const embeded404 = {
				name: '404',
				params: { pathMatch: to.path.split('/').slice(1) },
				query: to.query,
				hash: to.hash,
			}

			if (!response) return embeded404
		},
		meta: {
			requiresSorting: true,
		},
	},
	{
		/* for watchlist with id */
		path: '/watchlist/:id',
		name: 'watchlistMovies.show',
		component: () => import('@/views/WatchlistMoviesShow.vue'),
		async beforeEnter(to, from) {
			const { changeWatchlistId } = useMovieStore()
			const response = await changeWatchlistId(to.params.id)

			const embeded404 = {
				name: '404',
				params: { pathMatch: to.path.split('/').slice(1) },
				query: to.query,
				hash: to.hash,
			}

			if (!response) return embeded404
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
		path: '/auth/verify',
		name: 'verify',
		component: () => import('@/views/auth/Verify.vue'),
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
	const { isFetching: isFetchingMovies } = useMovieStore()
	const { isFetching: isFetchingWatchlists } = useWatchlistStore()

	// prevent page changing if active fetch not resolved
	if (isFetchingWatchlists || isFetchingMovies) return next(false)

	const { fetchUser } = useAuthStore()
	await fetchUser()

	const { isAuthenticated, isEmailVerified } = useAuthStore()

	// should be next()
	const returnPage = (page) => {
		next({ name: page })
	}

	if (isAuthenticated === null || isAuthenticated === undefined) next(false)

	// route protection by auth status
	if (isAuthenticated) {
		// authenticated but not verified user can only go verify page
		const allowedRoutes = ['verify', 'logout']

		if (!isEmailVerified && !allowedRoutes.includes(to.name)) {
			return returnPage('verify')
		}

		// authenticated and verified user can not go verify page anymore
		if (isEmailVerified && to.name === 'verify') {
			return returnPage('home')
		}

		// authenticated user can not get routes requires not auth (like login, register etc.)
		if (to.meta.requiresNotAuth) {
			return returnPage('home')
		}
	} else {
		// not authenticated user can not get routes need auth
		if (to.meta.requiresAuth) {
			return returnPage('home')
		}
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
