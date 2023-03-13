<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<!-- <movie-card> </movie-card> -->
			<watchlist-card
				v-for="watchlist in watchlists.data"
				@click.stop="returnPage('watchlistMovies.show', watchlist.id)"
				:item="watchlist"
				:key="watchlist.id"
				class="cursor-pointer"
			/>
			<div class="d-flex flex-row justify-content-center w-100">
				<button @click="getWatchlists(currentPage.params.id)" class="btn btn-primary w-25 fw-bold">LOAD MORE</button>
			</div>
		</div>
	</section>
</template>

<script setup>
	import WatchlistCard from '@/components/cards/WatchlistCard.vue'

	import { storeToRefs } from 'pinia'
	import { onBeforeMount } from 'vue'

	import { router } from '@/helpers/'

	import { useWatchlistStore } from '@/stores/WatchlistStore'
	import { useRouteStore } from '@/stores/RouteStore'

	const { returnPage } = router

	const { getWatchlists, changeWatchlistsBy } = useWatchlistStore()
	const { watchlists, currentWatchlistsBy } = storeToRefs(useWatchlistStore())

	const { currentPage } = useRouteStore()

	onBeforeMount(() => {
		// if initial load made on this page - otherwise route helper takes care
		if (!currentWatchlistsBy.value || currentWatchlistsBy.value === 'all') {
			// set watchlist id to store
			changeWatchlistsBy(currentPage.params.id)
		}
	})
</script>

<style></style>
