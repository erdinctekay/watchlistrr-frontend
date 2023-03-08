import { apiMethod } from '@/helpers/api.js'
import { storeToRefs } from 'pinia'
import { useMovieStore } from '@/stores/MovieStore'

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL
const MOVIE_URL = `${BASE_URL}/movies`

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

// const get = (id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('GET'))
// 	return result
// }

// const create = async (body) => {
// 	let result = fetch(MOVIE_URL, apiMethod('POST', body))
// 	return result
// }

// const remove = (id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('DELETE'))
// 	return result
// }

// const update = async (body, id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('PUT', body))
// 	return result
// }

// const patch = async (body, id) => {
// 	let result = fetch(MOVIE_URL + '/' + id, apiMethod('PATCH', body))
// 	return result
// }

export { getAllByWatchlist }

// export { getAllByWatchlist, get, create, remove, update, patch }
