<template>
	<div
		class="d-flex w-100 align-items-center justify-content-end flex-row-reverse rounded-pill"
		:class="hasActiveSearch ? '' : 'hover-highlight-icon'"
		style="position: relative; min-width: 13.5rem; /* transform: translateX(-2.1rem); margin-right: -2.1rem */"
		:style="isFormDisabled ? 'pointer-events: none' : ''"
	>
		<i
			v-if="!hasActiveSearch"
			class="bi bi-search"
			style="
				aspect-ratio: 1;
				padding: 0 0.5rem;
				min-width: 38px;
				transform: translateX(-42px);
				margin-right: -40px;
				pointer-events: none !important;
			"
		></i>
		<button
			v-else
			@click="clearSearch()"
			class="btn bg-transparent hover-highlight-icon rounded-circle search-reset"
			type="reset"
			style="aspect-ratio: 1; padding: 0 0.5rem; transform: translateX(-42px); margin-right: -40px"
		>
			<i class="bi bi-arrow-clockwise rotate-180" style="font-size: 1.25rem; max-height: 20px"></i>
		</button>

		<!-- prettier-ignore-attribute class -->
		<input
			@input="searchAction()"
			v-model="searchQuery"
			class="ps-4 bg-border-box text-body bg-standart hover-highlight focus-highlight-border 
							form-control input-search border-transparent border-0 rounded-pill"
			type="text"
			:placeholder="`${props.placeholder ? props.placeholder : 'Search'}`"
			aria-label="Search"
			style="padding-right: 38px; font-size: 0.875rem"
			:disabled="isFormDisabled"
			data-bs-toggle="popover"
			data-bs-trigger="hover"
			data-bs-placement="bottom"
			data-bs-container="body"
			:data-bs-content="
				currentPage.name === 'watchlistMovies.show'
					? `Search movies or tv series by typing directly title or the name of the contributing directors, stars.`
					: `Search watchlists by typing title or name of the creator.`
			"
		/>
	</div>
</template>
<script setup>
	import { ref, computed } from 'vue'
	import { storeToRefs } from 'pinia'
	import { utils } from '@/helpers'
	import { useSortStore } from '@/stores/SortStore'

	const { normalizeSpacing, sanitize } = utils

	const searchQuery = ref()
	const hasActiveSearch = computed(() => searchQuery.value?.length > 0)

	const { currentPage } = storeToRefs(props)

	const searchAction = () => {
		searchQuery.value = normalizeSpacing(sanitize(searchQuery.value))
		let searchValue = searchQuery.value

		setTimeout(async () => {
			if (searchValue === searchQuery.value) {
				const { updateSearchQuery } = useSortStore()

				if (props.searchSource === 'tmdb') {
					return updateSearchQuery(searchValue, 'tmdb', 'userInput')
				} else {
					// prettier-ignore
					if (props.currentPage.name === 'home' || props.currentPage.name === 'userWatchlists.show') return updateSearchQuery(searchValue, 'watchlist', 'userInput')
					// prettier-ignore
					if (props.currentPage.name === 'watchlistMovies.show') return updateSearchQuery(searchValue, 'movie', 'userInput')
				}
			}
		}, 700)
	}

	const clearSearch = () => {
		searchQuery.value = ''
		searchAction()
	}

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
		currentPage: {
			type: Object,
			required: true,
		},
		searchSource: {
			type: String,
			default: 'db',
		},
		placeholder: {
			type: String,
			default: null,
		},
		isFormDisabled: {
			type: Boolean,
			default: false,
		},
	})
</script>
