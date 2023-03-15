import { defineStore } from 'pinia'
import { reactive, ref, toRaw, computed, watch } from 'vue'

import { watchlist } from '@/services/backend/'
import { user } from '@/services/backend/'

import { router } from '@/helpers'

import { useSortStore } from '@/stores/SortStore'
import { useRouteStore } from '@/stores/RouteStore'
import { useMovieStore } from '@/stores/MovieStore'

export const useWatchlistStore = defineStore('watchlist', () => {
	const { activeSortOptions, updateSearchQuery } = useSortStore()

	const watchlists = reactive({ data: [], watchlistsBy: null })

	const page = ref(0)
	const limit = 1
	const queryOptions = reactive({
		sortFilter: computed(() => activeSortOptions.sortFilterList?.split(' ')[0]),
		sortOrder: computed(() => activeSortOptions.sortFilterList?.split(' ')[1]),
		searchQuery: computed(() => activeSortOptions.searchQuery),
	})
	const lastPage = ref(null)
	const isFetching = ref(false)
	const routerWatchlistsBy = ref(null)

	// to send all data bout current listing to other components like header etc.
	const currentWatchlistsBy = ref(null)

	const isAllDataFetched = ref(null)
	const isInitialFetchDone = ref(null)

	watch(queryOptions, (newValue) => {
		const { currentPage } = useRouteStore()

		console.log(currentPage)
		if (currentPage.name === 'userWatchlists.show' || currentPage.name === 'home') {
			console.log('watchlist refetch due to query change')
			refetchWatchlists()
		}
	})

	// quick patch for search value reset on different watchlistsBy pages+
	const lastFetchedWatchlistsBy = ref()

	const getWatchlists = async (id) => {
		try {
			if (routerWatchlistsBy.value !== 'all' && currentWatchlistsBy.value.watchlistCount === 0)
				return (isAllDataFetched.value = true)
			if (lastPage.value && lastPage.value <= page.value) return (isAllDataFetched.value = true)
			if (isFetching.value) return

			// if page changed since last fetch - reset searchQuery (it will trigger refetch)
			if (!isInitialFetchDone.value && lastFetchedWatchlistsBy.value !== watchlists.watchlistsBy) {
				// only trigger if it's empty - RETURN
				if (activeSortOptions.searchQuery !== '') return updateSearchQuery('')
			}

			lastFetchedWatchlistsBy.value = watchlists.watchlistsBy
			isFetching.value = true
			page.value++

			// prettier-ignore
			const decideResponse = async () => {
				let response
				if (watchlists.watchlistsBy === 'all' && id === 'all') 
					response = await watchlist.getAll(queryOptions.sortFilter, queryOptions.sortOrder, page.value, limit, queryOptions.searchQuery)
				if (watchlists.watchlistsBy !== 'all' && id !== 'all') 
					response = await user.getWatchlistsByUser(id, queryOptions.sortFilter, queryOptions.sortOrder, page.value, limit, queryOptions.searchQuery)
				return response
			}

			const response = await decideResponse()
			lastPage.value = Math.ceil(response.headers.get('x-total-count') / limit)

			const success = response.ok
			const data = success ? await response.json() : null

			// add some delay and give time to showing loading indicator
			await (async () => {
				await new Promise((resolve) => setTimeout(resolve, 100))
			})()

			// if request not completed with success decrement page number
			page.value = success ? page.value : page.value--
			// re-check if all data fetched or not
			if (lastPage.value && lastPage.value <= page.value) isAllDataFetched.value = true
			// if first page successfully retrived remove flag
			if (page.value !== 0 && success) isInitialFetchDone.value = true
			// set fetching flag back to false
			isFetching.value = false

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
		isAllDataFetched.value = null
		isInitialFetchDone.value = null
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
		return
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

	const refetchWatchlists = async () => {
		clearWathclistData()
		await getWatchlists(routerWatchlistsBy.value)
	}

	return {
		watchlists,
		getWatchlists,
		clearWathclistData,
		changeWatchlistsBy,
		currentWatchlistsBy,
		updateWatchlistDataById,
		isFetching,
		isAllDataFetched,
		isInitialFetchDone,
		refetchWatchlists,
	}
})
