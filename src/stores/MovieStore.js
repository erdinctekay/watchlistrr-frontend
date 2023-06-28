import { defineStore } from 'pinia'
import { reactive, ref, toRaw, computed, watch } from 'vue'

import { movie } from '@/services/backend/'
import { watchlist } from '@/services/backend'

import { useSortStore } from '@/stores/SortStore'

export const useMovieStore = defineStore('movie', () => {
	const { activeSortOptions, updateSearchQuery } = useSortStore()

	const movies = reactive({ data: [], watchlistId: null })

	const page = ref(0)
	const limit = 12
	const queryOptions = reactive({
		sort: {
			sortFilter: computed(() => activeSortOptions.sortFilterMovie?.split(' ')[0]),
			sortOrder: computed(() => activeSortOptions.sortFilterMovie?.split(' ')[1]),
		},
		searchQuery: computed(() => activeSortOptions.searchQuery.movie),
	})
	const lastPage = ref(null)
	const isFetching = ref(false)
	const routerWatchlistId = ref() /* also used on backend movie services */

	// to send all data bout current watchlist to other components like header etc.
	const currentWatchlist = ref(null)

	const isAllDataFetched = ref(null)
	const isInitialFetchDone = ref(null)
	const noSearchResult = ref(null)

	watch(
		() => queryOptions.searchQuery,
		(newValue, oldValue) => {
			// if same search value return
			if (newValue.value === oldValue.value) return
			// if change not triggered by user input return
			if (newValue.triggeredBy === null) return

			console.log('movie refetch triggered due to search query change')
			refetchMovies()
		},
		{ deep: true }
	)

	watch(
		() => queryOptions.sort,
		() => {
			console.log('movie refetch triggered due to sort query change')
			refetchMovies()
		},
		{ deep: true }
	)

	const getWatchlistMovies = async () => {
		try {
			// console.log(movies.watchlistId)

			if (currentWatchlist.value.moviesCount === 0) return (isAllDataFetched.value = true)
			if (lastPage.value && lastPage.value <= page.value) return (isAllDataFetched.value = true)
			if (isFetching.value) return

			isFetching.value = true
			page.value++

			// prettier-ignore
			const response = await movie.getAllByWatchlist(queryOptions.sort.sortFilter, queryOptions.sort.sortOrder, page.value, limit, queryOptions.searchQuery.value)
			lastPage.value = Math.ceil(response.headers.get('x-total-count') / limit)

			const success = response.ok
			const status = response.status
			const data = success ? await response.json() : null

			// // add some delay and give time to showing loading indicator
			// await (async () => {
			// 	await new Promise((resolve) => setTimeout(resolve, 100))
			// })()

			// if request not completed with success decrement page number
			page.value = success ? page.value : --page.value
			// re-check if all data fetched or not
			if (lastPage.value && lastPage.value <= page.value) isAllDataFetched.value = true
			// if page first page successfully retrived remove flag
			if (page.value > 0 && success) isInitialFetchDone.value = true
			// if there is search and status 404 means all fetched
			if (status === 404 && queryOptions.searchQuery.value?.length > 0) noSearchResult.value = true
			// else search found
			if (success && queryOptions.searchQuery.value?.length > 0) noSearchResult.value = false
			// set fetching flag back to false
			isFetching.value = false

			if (data) {
				// duplicate join id to each nested movie object
				data.forEach((movieJoin) => (movieJoin.movie['joinId'] = movieJoin.id))

				console.log(data)

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
		console.log('movie data cleared')
		movies.data = []
		page.value = 0
		lastPage.value = null
		isAllDataFetched.value = null
		isInitialFetchDone.value = null
		noSearchResult.value = null
	}

	const changeWatchlistId = async (id) => {
		// if same page (without active search) do not refetch but return true for router
		if (id === routerWatchlistId.value && !hasActiveSearch.value) return true

		// get new watchlist id from router
		const response = await watchlist.get(id)
		const success = response.ok
		// will return false for router to get if page really exist
		if (!success) return false
		const data = await response.json()
		currentWatchlist.value = response.ok ? data : null
		routerWatchlistId.value = id

		// reset all
		clearMovieData()
		movies.watchlistId = routerWatchlistId.value

		updateSearchQuery('', 'movie')

		// make initial fetch
		if (!isInitialFetchDone.value && !isAllDataFetched.value) await getWatchlistMovies(id)

		// return true for router
		return true
	}

	const updateCurrentWatchlistData = (item) => {
		if (currentWatchlist) currentWatchlist.value = item

		return
	}

	const updateMovieDataById = (item, message = null) => {
		const id = item.joinId
		const index = movies.data.findIndex((movie) => movie.id === id)

		// check if triggered for delete
		if (message === 'delete') {
			if (index !== -1) movies.data.splice(index, 1)
			return
		}

		// else update with new values
		/* currently not supporting */
		// if (index !== -1) {
		// 	const updatedMovies = {
		// 		...movie.data[index],
		// 		...item,
		// 	}
		// 	movie.data.splice(index, 1, updatedMovies)
		// }
	}

	const refetchMovies = async () => {
		clearMovieData()
		await getWatchlistMovies()
	}

	const hasActiveSearch = computed(() => queryOptions.searchQuery.value !== '')

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
		noSearchResult,
		hasActiveSearch,
		updateMovieDataById,
	}
})
