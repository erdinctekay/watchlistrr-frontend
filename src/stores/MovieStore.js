import { defineStore } from 'pinia'
import { reactive, ref, toRaw, computed } from 'vue'

import { movie } from '@/services/backend/'
import { watchlist } from '@/services/backend'

import { useSortStore } from '@/stores/SortStore'

export const useMovieStore = defineStore('movie', () => {
	const { activeSortOptions } = useSortStore()

	const movies = reactive({ data: [], watchlistId: null })

	const page = ref(0)
	const limit = 1
	const sortFilter = computed(() => activeSortOptions.sortFilterMovie.split(' ')[0])
	const sortOrder = computed(() => activeSortOptions.sortFilterMovie.split(' ')[1])
	const lastPage = ref(null)
	const routerWatchlistId = ref() /* also used on backend movie services */

	// to send all data bout current watchlist to other components like header etc.
	const currentWatchlist = ref(null)

	const getWatchlistMovies = async () => {
		try {
			// console.log(movies.watchlistId)

			if (currentWatchlist.value.moviesCount === 0) return
			if (lastPage.value && lastPage.value <= page.value) return

			page.value++

			const response = await movie.getAllByWatchlist(sortFilter.value, sortOrder.value, page.value, limit)
			lastPage.value = Math.ceil(response.headers.get('x-total-count') / limit)

			const data = response.ok ? await response.json() : null

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

	return { movies, getWatchlistMovies, changeWatchlistId, currentWatchlist, routerWatchlistId }
})
