<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 60vh">
				<h1 class="fw-bold">OOPS!</h1>

				<span v-if="activeSortOptions.searchQuery !== ''" class="h4 mb-5">
					Sorry, we couldn't find any matching records.
				</span>

				<span v-else class="h4 mb-5">Nothing to show here.</span>

				<button-constructor
					v-if="currentPage.name !== 'home' && activeSortOptions.searchQuery === ''"
					@click="returnPage('home')"
					:mainColor="'primary'"
					:mainClass="'rounded-pill py-1'"
					:textStyle="'font-weight:500;'"
				>
					Return Home
				</button-constructor>
			</div>
		</div>
	</section>
</template>

<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import { storeToRefs } from 'pinia'
	import { router } from '@/helpers'
	import { useRouteStore } from '@/stores/RouteStore'
	import { useSortStore } from '@/stores/SortStore'

	const { currentPage } = storeToRefs(useRouteStore())
	const { activeSortOptions } = useSortStore()

	const { returnPage } = router
</script>
