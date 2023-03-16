<template>
	<nothing-found-indicator v-if="noSearchResult || (isAllDataFetched && watchlists.data?.length === 0)" />
	<section v-else class="col-12 my-4">
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
				<load-more-button :isDisabled="isFetching" :clickAction="() => getWatchlists(currentPage.params.id)" />
			</div>
		</div>
	</section>
</template>

<script setup>
	import LoadMoreButton from '@/components/buttons/LoadMoreButton.vue'
	import WatchlistCard from '@/components/cards/WatchlistCard.vue'
	import NothingFoundIndicator from '@/components/indicators/NothingFoundIndicator.vue'

	import { storeToRefs } from 'pinia'
	import { onBeforeMount } from 'vue'

	import { router } from '@/helpers/'

	import { useWatchlistStore } from '@/stores/WatchlistStore'
	import { useRouteStore } from '@/stores/RouteStore'

	const { currentPage } = useRouteStore()
	const { getWatchlists, changeWatchlistsBy } = useWatchlistStore()
	// prettier-ignore
	const { watchlists, currentWatchlistsBy, isFetching, isAllDataFetched, isInitialFetchDone, noSearchResult } = storeToRefs(useWatchlistStore())

	const { returnPage } = router

	onBeforeMount(async () => {
		// if initial load made on this page - otherwise route helper takes care
		if (!currentWatchlistsBy.value || currentWatchlistsBy.value === 'all') {
			console.log('initial page load')
			// set watchlist id to store
			await changeWatchlistsBy(currentPage.params.id)
		}

		// get initial data
		if (!isInitialFetchDone.value) await getWatchlists(currentPage.params.id)
	})
</script>

<style></style>
