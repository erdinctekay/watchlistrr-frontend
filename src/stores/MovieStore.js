import { defineStore } from 'pinia'
import { reactive, ref, toRaw, computed, watch } from 'vue'

import { movie } from '@/services/backend/'
import { watchlist } from '@/services/backend'

import { useSortStore } from '@/stores/SortStore'
import { useRouteStore } from '@/stores/RouteStore'

export const useMovieStore = defineStore('movie', () => {
	const { activeSortOptions, updateSearchQuery } = useSortStore()

	const movies = reactive({ data: [], watchlistId: null })

	const page = ref(0)
	const limit = 1
	const queryOptions = reactive({
		sortFilter: computed(() => activeSortOptions.sortFilterMovie?.split(' ')[0]),
		sortOrder: computed(() => activeSortOptions.sortFilterMovie?.split(' ')[1]),
		searchQuery: computed(() => activeSortOptions.searchQuery),
	})
	const lastPage = ref(null)
	const isFetching = ref(false)
	const routerWatchlistId = ref() /* also used on backend movie services */

	// to send all data bout current watchlist to other components like header etc.
	const currentWatchlist = ref(null)

	const isAllDataFetched = ref(null)
	const isInitialFetchDone = ref(null)

	watch(queryOptions, (newValue) => {
		const { currentPage } = useRouteStore()

		if (currentPage.name === 'watchlistMovies.show') {
			console.log('movie refetch')
			refetchMovies()
		}
	})

	// quick patch for search value reset on different watchlistsBy pages+
	const lastFetchedWatchlistId = ref(null)

	const getWatchlistMovies = async () => {
		try {
			// console.log(movies.watchlistId)

			if (currentWatchlist.value.moviesCount === 0) return (isAllDataFetched.value = true)
			if (lastPage.value && lastPage.value <= page.value) return (isAllDataFetched.value = true)
			if (isFetching.value) return

			// if page changed since last fetch - reset searchQuery (it will trigger refetch)
			if (lastFetchedWatchlistId.value !== movies.watchlistId) {
				// only trigger if it's empty - RETURN
				if (activeSortOptions.searchQuery !== '') return updateSearchQuery('')
			}

			lastFetchedWatchlistId.value = movies.watchlistId
			isFetching.value = true
			page.value++

			// prettier-ignore
			const response = await movie.getAllByWatchlist(queryOptions.sortFilter, queryOptions.sortOrder, page.value, limit, queryOptions.searchQuery)
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
			// if page first page successfully retrived remove flag
			if (page.value !== 0 && success) isInitialFetchDone.value = true
			// set fetching flag back to false
			isFetching.value = false

			if (data) {
				if (movies.data.length < 1) {
					movies.data = [...data]
				} else {
					movies.data = [...toRaw(movies.data), ...data]
				}
			}

			console.log(toRaw(movies.data))
		} catch (error) {
			console.log(error)
		}
	}

	const clearMovieData = () => {
		movies.data = []
		page.value = 0
		lastPage.value = null
		isAllDataFetched.value = null
		isInitialFetchDone.value = null
	}

	const changeWatchlistId = async (id) => {
		// get new watchlist id from router
		const response = await watchlist.get(id)
		const data = await response.json()
		currentWatchlist.value = response.ok ? data : null
		routerWatchlistId.value = id

		// reset all
		clearMovieData()
		movies.watchlistId = routerWatchlistId.value
	}

	const updateCurrentWatchlistData = (item) => {
		if (currentWatchlist) {
			currentWatchlist.value = item
		}
		return
	}

	const refetchMovies = async () => {
		clearMovieData()
		await getWatchlistMovies()
	}

	return {
		movies,
		getWatchlistMovies,
		changeWatchlistId,
		currentWatchlist,
		routerWatchlistId,
		updateCurrentWatchlistData,
		isFetching,
		isAllDataFetched,
		isInitialFetchDone,
		refetchMovies,
	}
})
