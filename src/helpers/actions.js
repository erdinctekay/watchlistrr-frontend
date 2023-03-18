import { watchlist, user } from '@/services/backend/'
import { useWatchlistStore } from '@/stores/WatchlistStore'
import { useUserStore } from '@/stores/UserStore'

export const deleteAction = async (type, item) => {
	let response

	try {
		if (type === 'watchlist') {
			const { updateWatchlistDataById } = useWatchlistStore()

			response = await watchlist.remove(item.id)
			if (response.ok) {
				// update store data
				updateWatchlistDataById(item, 'delete')
			}
		}
		return response
	} catch (error) {
		console.log(error)
	}
}

let isToggling = false
export const toggleInteraction = async (interaction, interactionId, itemId, userId) => {
	if (isToggling) return
	isToggling = true
	console.log('toggle started')

	let response
	let body
	let itemIdType

	switch (interaction) {
		case 'likes':
		case 'watchs':
			body = { movieId: itemId }
			itemIdType = 'movie'
			break

		case 'favs':
		case 'follows':
			body = { watchlistId: itemId }
			itemIdType = 'watchlist'
			break
	}

	try {
		response = await user.makeInteraction(interaction, interactionId, body)
		if (response.ok) {
			// first sync manually and remove toggling flag
			const { updateInteractionStore } = useUserStore()
			let result = await updateInteractionStore(interaction, interactionId, itemId, itemIdType, userId)
			console.log(interaction + ' done - pending id')
			if (result) {
				// release button
				isToggling = false

				// get related interaction data from db first
				const { getInteractionByType } = useUserStore()
				await getInteractionByType(userId, interaction)
				console.log(interaction + ' id retrieved from db')

				// then try to catch db
				await syncInteractionsStore(userId, itemId, itemIdType)
				console.log('all interactions synced with db')
			}
		}

		return response
	} catch (error) {
		isToggling = false
		console.log(error)
	}
}

const syncInteractionsStore = async (userId, itemId, itemIdType) => {
	const { getAllInteractions } = useUserStore()

	// update store data
	await getAllInteractions(userId)

	if (itemIdType === 'watchlist') {
		const { updateWatchlistDataById } = useWatchlistStore()

		// try full sync with db
		const response = await watchlist.get(itemId)
		if (response.ok) {
			let item = await response.json()

			console.log(item)
			// update store data
			updateWatchlistDataById(item)
		}
	}
}
