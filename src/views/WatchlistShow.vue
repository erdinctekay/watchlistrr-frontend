<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<!-- prettier-ignore -->
			<movie-card
				v-for="item in movies.data"
				:item="item.movie"
				:addedBy="item.userId"
				:key="item.movie.id"
				class="cursor-pointer"
			/>
			<div class="d-flex flex-row justify-content-center w-100">
				<button @click="getWatchlistMovies" class="btn btn-primary w-25 fw-bold">LOAD MORE</button>
			</div>
		</div>
	</section>
</template>

<script setup>
	import MovieCard from '@/components/cards/MovieCard.vue'

	import { storeToRefs } from 'pinia'
	import { onBeforeMount } from 'vue'

	import { useMovieStore } from '@/stores/MovieStore'
	import { useRouteStore } from '@/stores/RouteStore'

	const { getWatchlistMovies, changeWatchlistId } = useMovieStore()
	const { movies } = storeToRefs(useMovieStore())

	onBeforeMount(() => {
		// set watchlist id to store
		const { currentPage } = useRouteStore()
		changeWatchlistId(currentPage.params.id)
	})
</script>

<style></style>
