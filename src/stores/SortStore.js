import { defineStore } from 'pinia'
import { reactive, onBeforeMount, nextTick } from 'vue'

export const useSortStore = defineStore('sort', () => {
	// core setup

	const activeSortOptions = reactive({
		sortFilterList: null,
		sortFilterMovie: null,
		searchQuery: '',
	})

	// defaults
	const sortDefaults = {
		sortFilterList: 'updatedAt desc',
		sortFilterMovie: 'createdAt desc',
	}

	const updateSearchQuery = (value) => {
		activeSortOptions.searchQuery = value
	}

	const changeSortOptions = async (type, value) => {
		switch (true) {
			case type === 'sortFilterList':
				activeSortOptions.sortFilterList = value
				localStorage.setItem('sortFilterList', value)

				break

			case type === 'sortFilterMovie':
				activeSortOptions.sortFilterMovie = value
				localStorage.setItem('sortFilterMovie', value)

				break

			default:
				break
		}

		// wait till job done
		await nextTick()
		return
	}

	activeSortOptions.sortFilterList = localStorage.getItem('sortFilterList')
	activeSortOptions.sortFilterMovie = localStorage.getItem('sortFilterMovie')

	// check if user attached preference to local storage
	onBeforeMount(() => {
		// if local empty assing default values
		if (!activeSortOptions.sortFilterList) changeSortOptions('sortFilterList', sortDefaults.sortFilterList)
		if (!activeSortOptions.sortFilterMovie) changeSortOptions('sortFilterMovie', sortDefaults.sortFilterMovie)
	})

	return { changeSortOptions, activeSortOptions, updateSearchQuery }
})
