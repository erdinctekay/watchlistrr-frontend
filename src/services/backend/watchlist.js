import { apiMethod } from '@/helpers/api.js'

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL
const WATCHLIST_URL = `${BASE_URL}/watchlists`

const getAll = (sortFilter, sortOrder, page = '', limit = '', searchQuery) => {
	// console.log('all watchlists wanted')
	let searchPlug

	searchQuery ? (searchPlug = 'q=' + searchQuery + '&') : (searchPlug = '')

	// prettier-ignore
	let result = fetch(
		WATCHLIST_URL + '?' + searchPlug + '_page=' + page + '&_limit=' + limit + '&_sort=' + sortFilter + '&_order=' + sortOrder + '&_expand=user',
		apiMethod('GET')
	)
	return result
}

const get = (id) => {
	let result = fetch(WATCHLIST_URL + '/' + id + '?_expand=user', apiMethod('GET'))
	return result
}

const create = async (body) => {
	let result = fetch(WATCHLIST_URL, apiMethod('POST', body))
	return result
}

// const remove = (id) => {
// 	let result = fetch(WATCHLIST_URL + '/' + id, apiMethod('DELETE'))
// 	return result
// }

// const update = async (body, id) => {
// 	let result = fetch(WATCHLIST_URL + '/' + id, apiMethod('PUT', body))
// 	return result
// }

// const patch = async (body, id) => {
// 	let result = fetch(WATCHLIST_URL + '/' + id, apiMethod('PATCH', body))
// 	return result
// }

export { getAll, get, create }

// export { getAll, get, create, remove, update, patch }
