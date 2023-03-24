import { apiMethod } from '@/helpers/api.js'
import { storeToRefs } from 'pinia'
import { useMovieStore } from '@/stores/MovieStore'

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL

const getAllByWatchlist = (sortFilter, sortOrder, page = '', limit = '', searchQuery) => {
	const { routerWatchlistId: watchlistId } = storeToRefs(useMovieStore())
	const WATCHLIST_MOVIE_URL = `${BASE_URL}/watchlists/${watchlistId.value}/movies`

	let searchPlug

	searchQuery ? (searchPlug = 'q=' + searchQuery + '&') : (searchPlug = '')

	// prettier-ignore
	let result = fetch(
		WATCHLIST_MOVIE_URL + '?' + searchPlug + '_page=' + page + '&_limit=' + limit + '&_sort=' + sortFilter + '&_order=' + sortOrder + '&_expand=movie',
		apiMethod('GET')
	)
	return result
}

const addToWatchlist = (body) => {
	const { routerWatchlistId: watchlistId } = storeToRefs(useMovieStore())
	const WATCHLIST_MOVIE_URL = `${BASE_URL}/watchlists/${watchlistId.value}/movies`

	let result = fetch(WATCHLIST_MOVIE_URL, apiMethod('POST', body))
	return result
}

const removeFromWatchlist = (id) => {
	const { routerWatchlistId: watchlistId } = storeToRefs(useMovieStore())
	const WATCHLIST_MOVIE_URL = `${BASE_URL}/watchlists/${watchlistId.value}/movies`

	let result = fetch(WATCHLIST_MOVIE_URL + `/${id}`, apiMethod('DELETE'))
	return result
}

// const get = (id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('GET'))
// 	return result
// }

// const create = (body) => {
// 	let result = fetch(MOVIE_URL, apiMethod('POST', body))
// 	return result
// }

// const remove = (id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('DELETE'))
// 	return result
// }

// const put = (body, id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('PUT', body))
// 	return result
// }

// const patch = (body, id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('PATCH', body))
// 	return result
// }

export { getAllByWatchlist, addToWatchlist, removeFromWatchlist }

// export { getAllByWatchlist, get, create, remove, put, patch }
