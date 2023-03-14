import { watchlist } from '@/services/backend/'
import { useWatchlistStore } from '@/stores/WatchlistStore'

export const deleteAction = async (type, item) => {
	let response
	if (type === 'watchlist') {
		const { updateWatchlistDataById } = useWatchlistStore()

		response = await watchlist.remove(item.id)
		if (response.ok) {
			// update store data
			updateWatchlistDataById(item, 'delete')
		}
	}
	return response
}
