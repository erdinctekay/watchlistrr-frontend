import { apiMethod } from '@/helpers/api.js'

const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL
const TMDB_URL = `${BASE_URL}/tmdb`

const getMovie = (id) => {
	let result = fetch(TMDB_URL + '/movie/' + id, apiMethod('GET'))
	return result
}

const getTV = (id) => {
	let result = fetch(TMDB_URL + '/tv/' + id, apiMethod('GET'))
	return result
}

const getPerson = (id) => {
	let result = fetch(TMDB_URL + '/person/' + id, apiMethod('GET'))
	return result
}

const makeSearch = (id, page) => {
	let result = fetch(TMDB_URL + '/search/' + id + '/' + page, apiMethod('GET'))
	return result
}

export { getMovie, getTV, getPerson, makeSearch }
