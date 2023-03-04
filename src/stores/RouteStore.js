import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { router } from '@/helpers'

export const useRouteStore = defineStore('route', () => {
	// core setup

	const currentPage = ref('')
	const { returnPage, newPageInformer } = router

	const updateCurrentPage = (to) => {
		currentPage.value = to
		newPageInformer(to)
	}

	// sync tabs if target page restricted due to new auth state
	const authChannel = new BroadcastChannel('auth')
	authChannel.onmessage = ({ data }) => {
		// firts check if current page defined on vue-router
		if (currentPage.value) {
			// then handle
			if (data.auth) {
				// check if it needs not auth
				if (currentPage.value.meta.requiresNotAuth) {
					// to be sure reactive data updated
					let interval = setInterval(() => {
						if (useAuthStore().isAuthenticated) {
							clearInterval(interval)
							returnPage('home')
						}
					}, 100)
				}
			} else {
				// check if it needs auth
				if (currentPage.value.meta.requiresAuth) {
					// to be sure reactive data updated
					let interval = setInterval(() => {
						if (!useAuthStore().isAuthenticated) {
							clearInterval(interval)
							returnPage('home')
						}
					}, 100)
				}
			}
		}
	}

	return { currentPage, updateCurrentPage }
})
