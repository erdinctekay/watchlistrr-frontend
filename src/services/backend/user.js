import { apiMethod } from '@/helpers/api.js'

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL
const USER_URL = `${BASE_URL}/users`

const getWatchlistsByUser = (id, sortFilter, sortOrder, page = '', limit = '', searchQuery) => {
	let searchPlug

	searchQuery ? (searchPlug = 'q=' + searchQuery + '&') : (searchPlug = '')

	// prettier-ignore
	let result = fetch(
		USER_URL + '/' + id + '/watchlists?' + searchPlug + '_page=' + page + '&_limit=' + limit + '&_sort=' + sortFilter + '&_order=' + sortOrder + '&_expand=user',
		apiMethod('GET')
	)
	return result
}

const get = (id) => {
	let result = fetch(USER_URL + '/' + id, apiMethod('GET'))
	return result
}

// to get likes, follows etc.
const getInteractions = (id, interaction) => {
	let result = fetch(USER_URL + '/' + id + '/' + interaction, apiMethod('GET'))
	return result
}

const create = async (body) => {
	let result = fetch(USER_URL, apiMethod('POST', body))
	return result
}

// const remove = (id) => {
// 	let result = fetch(USER_URL + '/' + id, apiMethod('DELETE'))
// 	return result
// }

// const put = async (body, id) => {
// 	let result = fetch(USER_URL + '/' + id, apiMethod('PUT', body))
// 	return result
// }

// const patch = async (body, id) => {
// 	let result = fetch(USER_URL + '/' + id, apiMethod('PATCH', body))
// 	return result
// }

export { getWatchlistsByUser, get, getInteractions, create }

// export { getAll, get, create, remove, put, patch }
