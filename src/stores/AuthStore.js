import { defineStore } from 'pinia'
import { ref, computed, onBeforeMount } from 'vue'
import { router } from '@/helpers'
import { auth } from '@/services/firebase'
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
	// core setup

	const currentUser = ref('')
	const { returnPage } = router

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
		returnPage('home')
	}

	const logout = async () => {
		await signOut(auth)
		currentUser.value = null
		returnPage('home')
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
	})

	/* controllers end */

	/* getters start */

	const isAuthenticated = computed(() => !!currentUser.value)
	const userCredentials = computed(() => currentUser.value)

	/* getters end */

	return { login, register, logout, fetchUser, isAuthenticated, userCredentials, isFetching }
})
