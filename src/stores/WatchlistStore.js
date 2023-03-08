import { defineStore } from 'pinia'
import { reactive, ref, toRaw, computed } from 'vue'

import { watchlist } from '@/services/backend/'

import { useSortStore } from '@/stores/SortStore'

export const useWatchlistStore = defineStore('watchlist', () => {
	const { activeSortOptions } = useSortStore()

	const watchlists = reactive({ data: [] })

	const page = ref(0)
	const limit = 1
	const sortFilter = computed(() => activeSortOptions.sortFilterList.split(' ')[0])
	const sortOrder = computed(() => activeSortOptions.sortFilterList.split(' ')[1])
	const lastPage = ref()

	const getWatchlists = async () => {
		try {
			if (lastPage.value <= page.value) return

			page.value++
			const response = await watchlist.getAll(sortFilter.value, sortOrder.value, page.value, limit)
			lastPage.value = Math.ceil(response.headers.get('x-total-count') / limit)

			const data = response.ok ? await response.json() : null

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

	return { watchlists, getWatchlists }
})
