<template>
	<nothing-found-indicator v-if="noSearchResult || (isAllDataFetched && movies.data?.length === 0)" />
	<section v-else class="col-12 my-4">
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
	import NothingFoundIndicator from '@/components/indicators/NothingFoundIndicator.vue'

	import { storeToRefs } from 'pinia'

	import { useMovieStore } from '@/stores/MovieStore'

	const { getWatchlistMovies } = useMovieStore()
	// prettier-ignore
	const { movies, currentWatchlist, isFetching, isAllDataFetched, isInitialFetchDone, noSearchResult } = storeToRefs(useMovieStore())
</script>

<style></style>
