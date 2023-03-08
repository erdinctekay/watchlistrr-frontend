<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<!-- <movie-card> </movie-card> -->
			<watchlist-card
				v-for="watchlist in watchlists.data"
				@click.stop="returnPage('watchlist.show', watchlist.id)"
				:item="watchlist"
				:key="watchlist.id"
				class="cursor-pointer"
			/>
			<div class="d-flex flex-row justify-content-center w-100">
				<button @click="getWatchlists" class="btn btn-primary w-25 fw-bold">LOAD MORE</button>
			</div>
		</div>
	</section>
</template>

<script setup>
	// import MovieCard from '@/components/cards/MovieCard.vue'
	import WatchlistCard from '@/components/cards/WatchlistCard.vue'

	import { storeToRefs } from 'pinia'
	import { router } from '@/helpers/'

	import { useWatchlistStore } from '@/stores/WatchlistStore'

	const { returnPage } = router

	const { getWatchlists } = useWatchlistStore()
	const { watchlists } = storeToRefs(useWatchlistStore())
</script>

<style></style>
