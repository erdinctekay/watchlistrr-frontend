import { defineStore } from 'pinia'
import { ref, computed, onBeforeMount, watch } from 'vue'
import { router } from '@/helpers'
import { auth } from '@/services/firebase'
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from 'firebase/auth'

import { useWatchlistStore } from '@/stores/WatchlistStore'
import { useUserStore } from '@/stores/UserStore'

export const useAuthStore = defineStore('auth', () => {
	// core setup

	const currentUser = ref(null)
	const { returnPage } = router

	const { getInteractions, clearUserStore } = useUserStore()

	const login = async ({ email, password }) => {
		const { user } = await signInWithEmailAndPassword(auth, email, password)
		currentUser.value = user
		returnPage('home')
	}

	const register = async ({ email, password, fullName }) => {
		// prettier-ignore
		const { user } = await createUserWithEmailAndPassword(auth, email, password)
		currentUser.value = user
		await updateProfile(user, {
			displayName: fullName,
		})
		// first create user on our db
		returnPage('home')
	}

	const logout = async () => {
		await signOut(auth)
		currentUser.value = null
		// clear local storage items
		localStorage.clear()
		// clear user store
		clearUserStore()
		returnPage('home')
		// to get default local storage items
		location.reload()
	}

	/* controllers start */

	const isFetching = ref(null)
	const fetchUser = async () => {
		// flag fetching
		isFetching.value = true

		// use bc to sync
		const authChannel = new BroadcastChannel('auth')
		await new Promise((resolve) => {
			// detect auth state change
			onAuthStateChanged(auth, (user) => {
				if (user === null) {
					currentUser.value = null
					authChannel.postMessage({ auth: false })
				} else {
					currentUser.value = user
					authChannel.postMessage({ auth: true })
				}
				resolve()
			})
		})
		isFetching.value = false
	}

	onBeforeMount(async () => {
		await fetchUser()
		/* commented below cause watch seems satisfy needs */
		// if (isAuthenticated.value) await getInteractions(currentUser.value.uid)
	})

	/* controllers end */

	/* getters start */

	const isAuthenticated = computed(() => !!currentUser.value)
	const userCredentials = computed(() => currentUser.value)

	/* getters end */

	/* to do when auth status change */
	const { clearWathclistData } = useWatchlistStore()

	watch(isAuthenticated, async (newValue, oldValue) => {
		if (newValue !== oldValue) clearWathclistData()
		if (newValue === true) await getInteractions(currentUser.value.uid)
	})
	/* to do when auth status change */

	return { login, register, logout, fetchUser, isAuthenticated, userCredentials, isFetching }
})
