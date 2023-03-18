import { defineStore, storeToRefs } from 'pinia'
import { ref, reactive, onBeforeMount, toRaw } from 'vue'

import { user } from '@/services/backend/index'
import { getRandomNumber } from '@/helpers/utils'

import { useAuthStore } from '@/stores/AuthStore'

export const useUserStore = defineStore('user', () => {
	// core setup
	const askOnDelete = ref(null)
	const userInteractionData = reactive({ likes: [], watchs: [], favs: [], follows: [] })

	const getAllInteractions = async (id) => {
		const interactionTypes = Object.keys(userInteractionData)
		console.log(interactionTypes)

		try {
			const responses = await Promise.all(interactionTypes.map((interaction) => user.getInteraction(id, interaction)))

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

	const getInteractionByType = async (id, type) => {
		const interaction = type
		try {
			const response = await user.getInteraction(id, interaction)
			if (response.ok) {
				const data = await response.json()
				userInteractionData[interaction] = data
			}

			console.log(toRaw(userInteractionData[interaction]))
		} catch (error) {
			console.error(error)
		}
	}

	const updateInteractionStore = async (interaction, interactionId, itemId, type, userId) => {
		if (interactionId) {
			// if interaction id not false means delete
			userInteractionData[interaction] = userInteractionData[interaction].filter((item) => item.id !== interactionId)
			console.log(toRaw(userInteractionData[interaction]))
		} else {
			// add to array
			let itemIdType
			if (type === 'watchlist') itemIdType = 'watchlistId'
			if (type === 'movie') itemIdType = 'movieId'

			let tempId = 'temp_' + getRandomNumber(16) // temporary id will replaced after sync
			let data = { id: tempId, userId: userId }
			data[itemIdType] = itemId

			userInteractionData[interaction].push(data)
			console.log(toRaw(userInteractionData[interaction]))
		}

		return true
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

	return {
		askOnDelete,
		toggleAskOnDeleteStore,
		getAllInteractions,
		getInteractionByType,
		clearUserStore,
		updateInteractionStore,
		userInteractionData,
	}
})
