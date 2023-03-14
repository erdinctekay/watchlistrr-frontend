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
		</div>
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row justify-content-center w-100">
				<load-more-button :clickAction="() => getWatchlists('all')" />
			</div>
		</div>
	</section>
</template>

<script setup>
	import LoadMoreButton from '@/components/buttons/LoadMoreButton.vue'
	import WatchlistCard from '@/components/cards/WatchlistCard.vue'

	import { storeToRefs } from 'pinia'
	import { onBeforeMount } from 'vue'

	import { router } from '@/helpers/'

	import { useWatchlistStore } from '@/stores/WatchlistStore'

	const { returnPage } = router

	const { getWatchlists, changeWatchlistsBy } = useWatchlistStore()
	const { watchlists, currentWatchlistsBy } = storeToRefs(useWatchlistStore())

	onBeforeMount(() => {
		// if initial load made on this page - otherwise route helper takes care
		if (!currentWatchlistsBy.value || currentWatchlistsBy.value !== 'all') {
			// set watchlist id to store
			changeWatchlistsBy('all')
		}
	})
</script>

<style></style>
