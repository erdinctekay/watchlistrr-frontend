import { defineStore } from 'pinia'
import { ref, reactive, computed, onBeforeMount, watch } from 'vue'
import { router } from '@/helpers'
import { user as userService } from '@/services/backend/'
import { auth } from '@/services/firebase'
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	updateProfile,
	sendEmailVerification,
} from 'firebase/auth'

import { useWatchlistStore } from '@/stores/WatchlistStore'
import { useUserStore } from '@/stores/UserStore'

export const useAuthStore = defineStore('auth', () => {
	// core setup

	const currentUser = reactive({
		value: null,
	})
	const { returnPage } = router

	const { getAllInteractions, clearUserStore } = useUserStore()

	const verificationSended = ref(null)
	const isFirstLogin = ref(null)

	const login = async ({ email, password }) => {
		const { user } = await signInWithEmailAndPassword(auth, email, password)
		currentUser.value = user

		// check if user present is on db
		const response = await userService.get(user.uid)
		// if not create it
		if (!response.ok) {
			// console.log('user not found on db - will be created')

			// if not create user on our db
			const response = await userService.create({ displayName: user.displayName })
			// if user cannot created with success logout
			if (!response.ok) return logout()

			// console.log('user created with success!')
		}
		await fetchUser()
		returnPage('home')
	}

	const register = async ({ email, password, fullName }) => {
		// prettier-ignore
		const { user } = await createUserWithEmailAndPassword(auth, email, password)
		currentUser.value = user
		// set first for block flicking on view
		currentUser.value = { ...user, displayName: fullName }
		await updateProfile(user, {
			displayName: fullName,
		})
		// then take last value with success
		fetchUser()
		isFirstLogin.value = true
		// Send verification email
		await sendVerificationEmail(user)
		// first create user on our db
		const response = await userService.create({ displayName: fullName })
		// if user cannot created with success logout
		if (!response.ok) return logout()
		// redirect
		returnPage('home')
	}

	const logout = async () => {
		await signOut(auth)
		currentUser.value = null
		await Promise.all([
			// clear local storage items
			localStorage.clear(),
			// clear user store
			clearUserStore(),
		])
		// redirect
		returnPage('home')
		// to get default local storage items
		location.reload()
	}

	const sendVerificationEmail = async (user) => {
		try {
			await sendEmailVerification(user)
			const now = new Date().toISOString()
			verificationSended.value = now
			localStorage.setItem('verificationSended', now)
			return true
		} catch (error) {
			console.log(error)
			return false
		}
	}

	const resendVerificationEmail = async () => {
		if (isAuthenticated) {
			return await sendVerificationEmail(currentUser.value)
		}
	}

	/* controllers start */

	const isFetching = ref(null)
	const fetchUser = async () => {
		// flag fetching
		isFetching.value = true
		// console.log('fetching user')

		// use bc to sync
		const authChannel = new BroadcastChannel('auth')
		await new Promise((resolve) => {
			// detect auth state change
			onAuthStateChanged(auth, (user) => {
				// console.log('auth state changed - user is: ' + user?.displayName)

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
		// if (isAuthenticated.value) await getAllInteractions(currentUser.value.uid)
	})

	/* controllers end */

	/* getters start */

	const isAuthenticated = computed(() => !!currentUser.value)
	const userCredentials = computed(() => currentUser.value)
	const isEmailVerified = computed(() => currentUser.value?.emailVerified)

	/* getters end */

	/* to do when auth status change */
	const { refetchWatchlists } = useWatchlistStore()

	watch(isAuthenticated, async (newValue, oldValue) => {
		if (newValue !== oldValue) await refetchWatchlists()
		if (newValue && isEmailVerified.value) await getAllInteractions(currentUser.value.uid)
	})
	/* to do when auth status change */

	return {
		login,
		register,
		logout,
		fetchUser,
		isAuthenticated,
		userCredentials,
		isFetching,
		resendVerificationEmail,
		isEmailVerified,
		verificationSended,
		isFirstLogin,
	}
})
