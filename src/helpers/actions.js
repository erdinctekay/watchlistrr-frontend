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
	let type

	switch (interaction) {
		case 'likes':
		case 'watchs':
			body = { movieId: itemId }
			type = 'movie'
			break

		case 'favs':
		case 'follows':
			body = { watchlistId: itemId }
			type = 'watchlist'
			break
	}

	try {
		const { getInteractions } = useUserStore()

		response = await user.makeInteraction(interaction, interactionId, body)
		if (response.ok) {
			// update store data
			await getInteractions(userId)

			if (type === 'watchlist') {
				const { updateWatchlistDataById } = useWatchlistStore()

				// try full sync with db
				response = await watchlist.get(itemId)
				if (response.ok) {
					let item = await response.json()

					console.log(item)
					// update store data
					updateWatchlistDataById(item)
				}
			}
		}

		isToggling = false
		return response
	} catch (error) {
		isToggling = false
		console.log(error)
	}
}
