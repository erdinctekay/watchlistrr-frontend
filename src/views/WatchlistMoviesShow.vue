<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<!-- prettier-ignore -->
			<movie-card
				v-for="item in movies.data"
				:item="item.movie"
				:dateAdded="item.createdAt"
				:addedBy="item.userId"
				:key="item.movie.id"
				class="cursor-pointer"
			/>
		</div>
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row justify-content-center w-100">
				<load-more-button :clickAction="() => getWatchlistMovies()" />
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

	const { getWatchlistMovies, changeWatchlistId, currentWatchlist } = useMovieStore()
	const { movies } = storeToRefs(useMovieStore())

	onBeforeMount(() => {
		// if initial load made on this page - otherwise route helper takes care
		if (!currentWatchlist) {
			// set watchlist id to store
			const { currentPage } = useRouteStore()
			changeWatchlistId(currentPage.params.id)
		}
	})
</script>

<style></style>
