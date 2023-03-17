import { defineStore } from 'pinia'
import { reactive, ref, toRaw, computed, watch } from 'vue'

import { watchlist } from '@/services/backend/'
import { user } from '@/services/backend/'

import { router } from '@/helpers'

import { useSortStore } from '@/stores/SortStore'
import { useMovieStore } from '@/stores/MovieStore'

export const useWatchlistStore = defineStore('watchlist', () => {
	const { activeSortOptions, updateSearchQuery } = useSortStore()

	const watchlists = reactive({ data: [], watchlistsBy: null })

	const page = ref(0)
	const limit = 1
	const queryOptions = reactive({
		sort: {
			sortFilter: computed(() => activeSortOptions.sortFilterList?.split(' ')[0]),
			sortOrder: computed(() => activeSortOptions.sortFilterList?.split(' ')[1]),
		},
		searchQuery: computed(() => activeSortOptions.searchQuery.watchlist),
	})
	const lastPage = ref(null)
	const isFetching = ref(false)
	const routerWatchlistsBy = ref(null)

	// to send all data bout current listing to other components like header etc.
	const currentWatchlistsBy = ref(null)

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

			console.log('watchlist refetch triggered due to search query change')
			refetchWatchlists()
		},
		{ deep: true }
	)

	watch(
		() => queryOptions.sort,
		() => {
			console.log('watchlist refetch triggered due to sort query change')
			refetchWatchlists()
		},
		{ deep: true }
	)

	const getWatchlists = async (id) => {
		try {
			console.log('fetch blocked: ' + isFetching.value)
			// prettier-ignore
			if (routerWatchlistsBy.value !== 'all' && currentWatchlistsBy.value.watchlistCount === 0) return (isAllDataFetched.value = true)
			if (lastPage.value && lastPage.value <= page.value) return (isAllDataFetched.value = true)

			if (isFetching.value) return

			isFetching.value = true
			page.value++

			// prettier-ignore
			const decideResponse = async () => {
				let response
				if (watchlists.watchlistsBy === 'all' && id === 'all' && page.value > 0) 
					response = await watchlist.getAll(queryOptions.sort.sortFilter, queryOptions.sort.sortOrder, page.value, limit, queryOptions.searchQuery.value)
				if (watchlists.watchlistsBy !== 'all' && id !== 'all' && page.value > 0) 
					response = await user.getWatchlistsByUser(id, queryOptions.sort.sortFilter, queryOptions.sort.sortOrder, page.value, limit, queryOptions.searchQuery.value)
				return response
			}

			const response = await decideResponse()
			lastPage.value = Math.ceil(response.headers.get('x-total-count') / limit)

			const success = response.ok
			const status = response.status
			const data = success ? await response.json() : null

			// add some delay and give time to showing loading indicator
			await (async () => {
				await new Promise((resolve) => setTimeout(resolve, 100))
			})()

			// if request not completed with success decrement page number
			page.value = success ? page.value : --page.value
			// re-check if all data fetched or not
			if (lastPage.value && lastPage.value <= page.value) isAllDataFetched.value = true
			// if first page successfully retrived remove flag
			if (page.value > 0 && success) isInitialFetchDone.value = true
			// if there is search and status 404 means all fetched
			if (status === 404 && queryOptions.searchQuery.value?.length > 0) noSearchResult.value = true
			// else search found
			if (success && queryOptions.searchQuery.value?.length > 0) noSearchResult.value = false
			// if there is no watchlist record find by user
			if (routerWatchlistsBy.value !== 'all' && status === 404 && page.value === 0) isAllDataFetched.value = true
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
		console.log('watchlist data cleared')
		watchlists.data = []
		page.value = 0
		lastPage.value = null
		isAllDataFetched.value = null
		isInitialFetchDone.value = null
		noSearchResult.value = null
	}

	const changeWatchlistsBy = async (id) => {
		// if same page (without active search) do not refetch but return true for router
		if (id === routerWatchlistsBy.value && !hasActiveSearch.value) return true

		if (id === 'all') {
			currentWatchlistsBy.value = 'all'
			routerWatchlistsBy.value = 'all'

			console.log('watchlistBy changed to all')
		} else {
			// get new watchlist id from router
			const response = await user.get(id)
			const success = response.ok
			// will return false for router to get if page really exist
			if (!success) return false
			const data = await response.json()
			currentWatchlistsBy.value = response.ok ? data : null
			routerWatchlistsBy.value = id

			console.log('watchlistBy changed to ' + id)
		}

		// reset all
		clearWathclistData()
		watchlists.watchlistsBy = routerWatchlistsBy.value

		updateSearchQuery('', 'watchlist')

		// make initial fetch
		if (!isInitialFetchDone.value && !isAllDataFetched.value) await getWatchlists(id)

		// return true for router
		return true
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

	const hasActiveSearch = computed(() => queryOptions.searchQuery.value !== '')

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
		noSearchResult,
		hasActiveSearch,
	}
})
