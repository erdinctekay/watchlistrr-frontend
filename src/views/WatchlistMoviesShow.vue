<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<!-- prettier-ignore -->
			<movie-card
				v-for="item in movies.data"
				:item="item.movie"
				:currentWatchlist="currentWatchlist"
				:dateAdded="item.createdAt"
				:addedBy="item.userId"
				:key="item.movie.id"
				class="cursor-pointer"
			/>
		</div>
		<div
			v-if="!isAllDataFetched && isInitialFetchDone"
			class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto"
		>
			<div class="d-flex flex-row justify-content-center w-100">
				<load-more-button :isDisabled="isFetching" :clickAction="() => getWatchlistMovies()" />
			</div>
		</div>
	</section>
</template>

<script setup>
	import LoadMoreButton from '@/components/buttons/LoadMoreButton.vue'
	import MovieCard from '@/components/cards/MovieCard.vue'

	import { storeToRefs } from 'pinia'
	import { onBeforeMount } from 'vue'

	import { useMovieStore } from '@/stores/MovieStore'
	import { useRouteStore } from '@/stores/RouteStore'
	import { useSortStore } from '@/stores/SortStore'

	const { updateSearchQuery, activeSortOptions } = useSortStore()
	const { getWatchlistMovies, changeWatchlistId } = useMovieStore()
	const { movies, currentWatchlist, isFetching, isAllDataFetched, isInitialFetchDone } = storeToRefs(useMovieStore())

	onBeforeMount(async () => {
		// if there is search value reset
		if (activeSortOptions.updateSearchQuery !== '') updateSearchQuery('')

		// if initial load made on this page - otherwise route helper takes care
		if (!currentWatchlist.value) {
			// set watchlist id to store
			const { currentPage } = useRouteStore()
			await changeWatchlistId(currentPage.params.id)
		}

		// if there is search value reset
		if (activeSortOptions.updateSearchQuery !== '') updateSearchQuery('')
		// get initial data
		if (!isInitialFetchDone.value) await getWatchlistMovies()
	})
</script>

<style></style>
