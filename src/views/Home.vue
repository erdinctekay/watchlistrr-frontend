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
		<div
			v-if="!isAllDataFetched && isInitialFetchDone"
			class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto"
		>
			<div class="d-flex flex-row justify-content-center w-100">
				<load-more-button :isDisabled="isFetching" :clickAction="() => getWatchlists('all')" />
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

	const { getWatchlists, changeWatchlistsBy } = useWatchlistStore()
	// prettier-ignore
	const { watchlists, currentWatchlistsBy, isFetching, isAllDataFetched, isInitialFetchDone } = storeToRefs(useWatchlistStore())

	const { returnPage } = router

	onBeforeMount(async () => {
		// if initial load made on this page - otherwise route helper takes care
		if (!currentWatchlistsBy.value || currentWatchlistsBy.value !== 'all') {
			// set watchlist id to store
			await changeWatchlistsBy('all')
		}

		// get initial data
		if (!isInitialFetchDone.value) getWatchlists('all')
	})
</script>

<style></style>
