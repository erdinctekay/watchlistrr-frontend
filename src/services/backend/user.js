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

const create = (body) => {
	let result = fetch(USER_URL, apiMethod('POST', body))
	return result
}

// to get likes, follows etc.
const getInteraction = (id, interaction) => {
	let result = fetch(USER_URL + '/' + id + '/' + interaction, apiMethod('GET'))
	return result
}

const makeInteraction = (interaction, interactionId, body) => {
	if (interactionId) {
		// if interactionId provided means delete
		let result = fetch(BASE_URL + '/' + interaction + '/' + interactionId, apiMethod('DELETE'))
		return result
	} else {
		// else make post req
		let result = fetch(BASE_URL + '/' + interaction, apiMethod('POST', body))
		return result
	}
}

// const remove = (id) => {
// 	let result = fetch(USER_URL + '/' + id, apiMethod('DELETE'))
// 	return result
// }

// const put = (body, id) => {
// 	let result = fetch(USER_URL + '/' + id, apiMethod('PUT', body))
// 	return result
// }

// const patch = (body, id) => {
// 	let result = fetch(USER_URL + '/' + id, apiMethod('PATCH', body))
// 	return result
// }

export { getWatchlistsByUser, get, create, getInteraction, makeInteraction }

// export { getAll, get, create, remove, put, patch }
