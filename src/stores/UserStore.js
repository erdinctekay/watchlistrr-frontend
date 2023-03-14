import { defineStore } from 'pinia'
import { ref, reactive, onBeforeMount } from 'vue'

import { user } from '@/services/backend/index'

import { useAuthStore } from '@/stores/AuthStore'

export const useUserStore = defineStore('user', () => {
	// core setup
	const askOnDelete = ref(null)
	const userInteractionData = reactive({ likes: [], watchs: [], favs: [], follows: [] })

	const getInteractions = async (id) => {
		const interactionTypes = Object.keys(userInteractionData)
		console.log(interactionTypes)

		try {
			interactionTypes.forEach(async (interaction) => {
				const response = await user.getInteractions(id, interaction)
				if (response.ok) {
					userInteractionData[interaction] = await response.json()
				}
			})
		} catch (error) {
			console.error(error)
		}
	}

	const toggleAskOnDeleteStore = () => {
		askOnDelete.value = !askOnDelete.value
		localStorage.setItem('askOnDelete', askOnDelete.value)
	}

	const clearUserStore = () => {
		askOnDelete.value = null
		userData.data = []
		userData.userId = null

		const interactionTypes = Object.keys(userInteractionData)
		interactionTypes.forEach(async (interaction) => {
			userInteractionData[interaction] = []
		})
		console.log('user store cleared')
	}

	// turn string to boolean with ternary
	askOnDelete.value = localStorage.getItem('askOnDelete') ? true : false

	// check if user attached preference to local storage
	onBeforeMount(() => {
		// if local empty assing default values
		if (!askOnDelete.value) {
			localStorage.setItem('askOnDelete', true)
			askOnDelete.value = true
		}
	})

	return { userData, askOnDelete, toggleAskOnDeleteStore, getInteractions, clearUserStore }
})
