<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 60vh">
				<h1 class="fw-bold">
					{{ isUserPageOwner && !isActiveSearchQuery ? `HEY!` : 'OOPS!' }}
				</h1>

				<span v-if="isActiveSearchQuery" class="h4 mb-5"> Sorry, we couldn't find any matching records. </span>

				<span v-else-if="!isUserPageOwner" class="h4 mb-5">Nothing to show here.</span>

				<div v-else class="mb-5 d-flex flex-column align-items-center">
					<span class="h4"> Feeling empty without any {{ source }}s in here... </span>
					<span class="lead">Add your first {{ source }} to get started!</span>
				</div>

				<div v-if="!isHomePage && !isActiveSearchQuery">
					<button-constructor
						v-if="!isUserPageOwner"
						@click="returnPage('home')"
						:mainColor="'primary'"
						:mainClass="'rounded-pill py-1 px-4'"
						:textStyle="'font-weight:500;'"
					>
						Return Home
					</button-constructor>
					<button-constructor
						v-else-if="isWatchlistPage"
						@click="openModal('addMovie')"
						:mainColor="'primary'"
						:mainClass="'rounded-pill py-2 px-3'"
						:textStyle="'font-weight:500;'"
						:hasMainIcon="true"
						:mainIcon="'plus-lg'"
						:mainIconClass="'me-0'"
						:textClass="''"
					>
						Add New
					</button-constructor>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'

	import { computed } from 'vue'
	import { storeToRefs } from 'pinia'

	import { router } from '@/helpers'

	import { useRouteStore } from '@/stores/RouteStore'
	import { useSortStore } from '@/stores/SortStore'
	import { useAuthStore } from '@/stores/AuthStore'
	import { useMovieStore } from '@/stores/MovieStore'
	import { useModalStore } from '@/stores/ModalStore'

	const { currentPage } = storeToRefs(useRouteStore())
	const { userCredentials, isAuthenticated } = storeToRefs(useAuthStore())
	const { currentWatchlist } = storeToRefs(useMovieStore())
	const { activeSortOptions } = storeToRefs(useSortStore())
	const { openModal } = useModalStore()

	const { returnPage } = router

	const isHomePage = computed(() => {
		if (currentPage.value.name === 'home') return true

		return false
	})

	const isUserWatchlistsPage = computed(() => {
		if (currentPage.value.name === 'userWatchlists.show') return true

		return false
	})

	const isWatchlistPage = computed(() => {
		if (currentPage.value.name === 'watchlistMovies.show') return true

		return false
	})

	const isUserPageOwner = computed(() => {
		if (!isAuthenticated.value) return false

		// if (isUserWatchlistsPage.value) return currentWatchlistsBy.value?.id === userCredentials.value?.uid
		if (isWatchlistPage.value) return currentWatchlist.value?.userId === userCredentials.value?.uid

		return false
	})

	let source = computed(() => {
		if (isHomePage.value || isUserWatchlistsPage.value) return 'watchlist'
		if (isWatchlistPage.value) return 'movie'
	})

	const isActiveSearchQuery = computed(() => {
		return activeSortOptions.value?.searchQuery[source.value]?.value !== ''
	})
</script>
