import { defineStore, storeToRefs } from 'pinia'
import { ref, reactive, onBeforeMount, toRaw } from 'vue'

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
			const responses = await Promise.all(interactionTypes.map((interaction) => user.getInteractions(id, interaction)))

			for (let i = 0; i < responses.length; i++) {
				const response = responses[i]
				const interactionType = interactionTypes[i]

				if (response.ok) {
					const data = await response.json()
					userInteractionData[interactionType] = data
				}
			}

			console.log(toRaw(userInteractionData))
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

	return { askOnDelete, toggleAskOnDeleteStore, getInteractions, clearUserStore, userInteractionData }
})
