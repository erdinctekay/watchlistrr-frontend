import { defineStore } from 'pinia'
import { reactive, ref, toRaw, computed, watch } from 'vue'

import { tmdb } from '@/services/backend/'

import { useSortStore } from '@/stores/SortStore'

export const useMovieSearchStore = defineStore('movieSearch', () => {
	const { activeSortOptions, updateSearchQuery } = useSortStore()

	const movieSearchData = reactive({ data: [] })
	const selectedMovies = reactive({ data: [] })

	const page = ref(0)

	const queryOptions = reactive({
		searchQuery: computed(() => activeSortOptions.searchQuery.tmdb),
	})

	const forcedLastPage = ref(5) /* restrict maximum search result (5 page * 20 result per page) */
	const lastPage = ref(null)
	const isFetching = ref(false)

	const isAllDataFetched = ref(null)
	const isInitialFetchDone = ref(null)
	const noSearchResult = ref(null)

	watch(
		() => queryOptions.searchQuery,
		(newValue, oldValue) => {
			console.log('search trigerred')

			// if same search value return
			if (newValue.value === oldValue.value) return
			// if no search value return
			if (newValue.value === '') return clearMovieSearchData()
			// if change not triggered by user input return
			if (newValue.triggeredBy === null) return

			console.log('movie search refetch triggered due to search query change')
			refetchSearchResults()
		},
		{ deep: true }
	)

	const getSearchResults = async () => {
		try {
			if (forcedLastPage.value && forcedLastPage.value <= page.value) return (isAllDataFetched.value = true) // force last page
			if (lastPage.value && lastPage.value <= page.value) return (isAllDataFetched.value = true)
			if (isFetching.value) return

			isFetching.value = true
			page.value++

			console.log(queryOptions.searchQuery.value)

			const response = await tmdb.makeSearch(queryOptions.searchQuery.value, page.value)

			const success = response.ok
			const status = response.status
			let data = success ? await response.json() : null

			if (success) {
				lastPage.value = data.total_pages
				data = data.results
			}

			// if request not completed with success decrement page number
			page.value = success ? page.value : --page.value
			// re-check if all data fetched or not
			if (lastPage.value && lastPage.value <= page.value) isAllDataFetched.value = true
			// force last page and flag all fetched
			if (forcedLastPage.value && forcedLastPage.value <= page.value) isAllDataFetched.value = true
			// if page first page successfully retrived remove flag
			if (page.value > 0 && success) isInitialFetchDone.value = true
			// if there is search and status 404 means all fetched
			if (status === 404 && queryOptions.searchQuery.value?.length > 0) noSearchResult.value = true
			// else search found
			if (success && queryOptions.searchQuery.value?.length > 0) noSearchResult.value = false
			// set fetching flag back to false
			isFetching.value = false

			if (data) {
				// console.log(data)
				if (movieSearchData.data.length < 1) {
					movieSearchData.data = [...data]
				} else {
					movieSearchData.data = [...toRaw(movieSearchData.data), ...data]
				}
			}

			if (selectedMovies.data.length > 0) markSelectedResult(selectedMovies.data[0])

			console.log(toRaw(movieSearchData.data))
		} catch (error) {
			console.log(error)
		}
	}

	const clearMovieSearchData = () => {
		console.log('movie search data cleared')
		movieSearchData.data = []
		page.value = 0
		lastPage.value = null
		isAllDataFetched.value = null
		isInitialFetchDone.value = null
		noSearchResult.value = null
	}

	const refetchSearchResults = async () => {
		clearMovieSearchData()
		await getSearchResults()
	}

	const resetSearchStore = () => {
		clearMovieSearchData()
		selectedMovies.data = []
		updateSearchQuery('', 'tmdb')
	}

	const selectMovie = (selectedItem) => {
		let item = { ...selectedItem, selected: true }
		selectedMovies.data = [item]
		removeSelectedMarks()
		markSelectedResult(item)

		console.log(movieSearchData.data)

		/** bulk add will be added on next versions **/
		//
		// // Check if the movie is already selected
		// if (selectedMovies.data.some((movie) => movie.id === id)) return
		// // Add the new movie to the selectedMovies array
		// const data = [{ id, title }]
		// selectedMovies.data = [...selectedMovies.data, ...data]
	}

	const hasActiveSearch = computed(() => queryOptions.searchQuery.value !== '')

	const markSelectedResult = (item) => {
		const index = movieSearchData.data.findIndex((movie) => movie.id === item.id)
		// else update with new values
		if (index !== -1) {
			const updatedMovie = {
				...movieSearchData.data[index],
				...item,
			}
			movieSearchData.data.splice(index, 1, updatedMovie)
		}
	}

	const removeSelectedMarks = () => {
		const index = movieSearchData.data.findIndex((movie) => movie.selected === true)
		if (index !== -1) {
			const { selected, ...rest } = movieSearchData.data[index]
			const updatedMovie = { ...rest }
			movieSearchData.data.splice(index, 1, updatedMovie)
		}
	}

	return {
		movieSearchData,
		selectedMovies,
		getSearchResults,
		isFetching,
		isAllDataFetched,
		isInitialFetchDone,
		refetchSearchResults,
		resetSearchStore,
		noSearchResult,
		hasActiveSearch,
		selectMovie,
	}
})
