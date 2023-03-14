import { defineStore, storeToRefs } from 'pinia'
import { reactive, ref, toRaw, computed } from 'vue'

import { watchlist } from '@/services/backend/'
import { user } from '@/services/backend/'

import { router } from '@/helpers'

import { useSortStore } from '@/stores/SortStore'
import { useMovieStore } from '@/stores/MovieStore'

export const useWatchlistStore = defineStore('watchlist', () => {
	const { activeSortOptions } = useSortStore()

	const watchlists = reactive({ data: [], watchlistsBy: null })

	const page = ref(0)
	const limit = 1
	const sortFilter = computed(() => activeSortOptions.sortFilterList.split(' ')[0])
	const sortOrder = computed(() => activeSortOptions.sortFilterList.split(' ')[1])
	const lastPage = ref(null)
	const routerWatchlistsBy = ref(null)

	// to send all data bout current listing to other components like header etc.
	const currentWatchlistsBy = ref(null)

	const getWatchlists = async (id) => {
		try {
			// if (currentWatchlistsBy.value.watchlistCount === 0) return
			if (lastPage.value && lastPage.value <= page.value) return

			page.value++

			// prettier-ignore
			const decideResponse = async () => {
				let response
				if (watchlists.watchlistsBy === 'all' && id === 'all') 
					response = await watchlist.getAll(sortFilter.value, sortOrder.value, page.value, limit)
				if (watchlists.watchlistsBy !== 'all' && id !== 'all') 
					response = await user.getWatchlistsByUser(id, sortFilter.value, sortOrder.value, page.value, limit)
				return response
			}

			const response = await decideResponse()
			console.log(response)
			lastPage.value = Math.ceil(response.headers.get('x-total-count') / limit)

			const data = response.ok ? await response.json() : null

			if (data) {
				if (watchlists.data.length < 1) {
					watchlists.data = [...data]
				} else {
					watchlists.data = [...toRaw(watchlists.data), ...data]
				}
			}

			console.log(toRaw(watchlists.data))
		} catch (error) {
			console.log(error)
		}
	}

	const clearWathclistData = () => {
		watchlists.data = []
		page.value = 0
		lastPage.value = null
	}

	const changeWatchlistsBy = async (id) => {
		if (id === 'all') {
			currentWatchlistsBy.value = 'all'
			routerWatchlistsBy.value = 'all'

			console.log('watchlistBy changed to all')
		} else {
			// get new watchlist id from router
			const response = await user.get(id)
			const data = await response.json()
			currentWatchlistsBy.value = response.ok ? data : null
			routerWatchlistsBy.value = id

			console.log('watchlistBy changed to ' + id)
		}

		// reset all
		clearWathclistData()
		watchlists.watchlistsBy = routerWatchlistsBy.value
	}

	const updateWatchlistDataById = (item, message = null) => {
		const id = item.id
		const index = watchlists.data.findIndex((watchlist) => watchlist.id === id)

		const { updateCurrentWatchlistData, currentWatchlist } = useMovieStore()

		console.log()

		// check if triggered for delete
		if (message === 'delete') {
			const { returnPage } = router
			if (index !== -1) watchlists.data.splice(index, 1)
			if (currentWatchlist?.id === id) returnPage('home')
			return
		}

		// else update with new values
		if (index !== -1) {
			const updatedWatchlist = {
				...watchlists.data[index],
				...item,
			}
			watchlists.data.splice(index, 1, updatedWatchlist)
		}

		updateCurrentWatchlistData(item)
	}

	return {
		watchlists,
		getWatchlists,
		clearWathclistData,
		changeWatchlistsBy,
		currentWatchlistsBy,
		updateWatchlistDataById,
	}
})
