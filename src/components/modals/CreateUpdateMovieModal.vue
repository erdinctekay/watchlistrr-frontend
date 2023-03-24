<template>
	<modal-constructor
		:isModalShowing="isModalShowing"
		:isDismissible="isDismissible"
		:isFormDisabled="isFormDisabled"
		:item="item"
		:triggerModalClose="triggerModalClose"
	>
		<div class="col">
			<search-input
				:colorScheme="colorScheme"
				:currentPage="currentPage"
				:searchSource="'tmdb'"
				:placeholder="'Search movies or TV series...'"
				:isFormDisabled="isFormDisabled"
			/>
			<div
				class="row pt-1 w-100 g-0 d-flex justify-content-center"
				:style="isFormDisabled ? 'pointer-events: none;' : ''"
			>
				<div class="d-flex dropdown align-items-center" style="max-width: 360px">
					<ul
						:class="'bg-standart'"
						class="w-100 border-0 px-0 py-0 scrollable-parent"
						style="list-style-type: none; border-radius: 1.5rem; min-width: 240px"
					>
						<div
							class="my-3 scrollable d-flex flex-column me-n4"
							style="max-height: 320px; min-height: 320px; overflow-y: scroll"
						>
							<div
								v-if="!hasActiveSearch"
								class="d-flex align-item-center justify-content-center flex-column flex-grow-1 text-center pe-3"
							>
								<span class="small" v-if="showTypeSomething">Type something to get results</span>
							</div>
							<div
								v-else-if="isFetching"
								class="d-flex align-item-center justify-content-center flex-column flex-grow-1 text-center pe-3"
							>
								<span class="small">Searching...</span>
							</div>
							<div
								v-else-if="noSearchResult"
								class="d-flex align-item-center justify-content-center flex-column flex-grow-1 text-center pe-3"
							>
								<span class="fw-bold lead">OOPS!</span>
								<span class="small">We couldn't find any matching records.</span>
							</div>
							<!---->
							<li
								v-for="item in movieSearchData.data"
								:key="item.name"
								class="movie-card-search py-2 rounded-3 px-2 me-3"
								:class="item.selected ? 'selected bg-primary bg-opacity-25' : 'hover-highlight'"
								style="max-width: 312px"
							>
								<div class="ps-1 py-1 pe-0">
									<div class="d-flex align-items-start">
										<div class="d-flex flex-row w-100" style="max-height: 75px; min-height: 75px">
											<img
												v-if="item.posterPath"
												class="rounded-3"
												:src="'https://image.tmdb.org/t/p/w200/' + item.posterPath"
												width="50"
												style="aspect-ratio: 2/3; min-width: 50px"
											/>
											<img
												v-else
												class="rounded-3"
												src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2050%2075%22%3E%3Crect%20width%3D%2250%22%20height%3D%2275%22%20fill%3D%22%23eee%22%2F%3E%3C%2Fsvg%3E"
												width="50"
												style="aspect-ratio: 2/3; min-width: 50px"
											/>
											<div class="ps-2 d-flex flex-row w-100 justify-content-between">
												<div class="col-10 ps-1 pe-3 d-flex flex-column">
													<span
														class="fw-bold"
														style="
															text-overflow: ellipsis;
															overflow: hidden;
															-webkit-line-clamp: 2;
															display: -webkit-box;
															-webkit-box-orient: vertical;
															padding-bottom: 3px !important;
														"
													>
														{{ item.title }}
													</span>
													<!-- SOME CONFLICTS HERE -->
													<!-- !!!! control with diacritic cleaned state -->
													<span
														v-if="
															diacritic.clean(item.title).toLowerCase() !==
															diacritic.clean(item.originalTitle).toLowerCase()
														"
														class="small text-muted"
														style="
															text-overflow: ellipsis;
															overflow: hidden;
															-webkit-line-clamp: 2;
															display: -webkit-box;
															-webkit-box-orient: vertical;
															padding-bottom: 3px !important;
														"
													>
														{{ item.originalTitle }}
													</span>
												</div>
												<div class="col-2 pe-1 d-flex flex-column justify-content-between">
													<div
														class="d-flex flex-column justify-content-start align-items-end text-muted"
														style="font-size: 0.75rem"
													>
														<span style="font-weight: 900">
															{{ item.year || '&nbsp' }}
														</span>
														<span class="fst-italic" :style="`${item.type === 'tv' ? 'padding-right: 2px;' : ''}`">
															{{ item.type === 'tv' ? 'TV' : 'Movie' || '&nbsp' }}
														</span>
													</div>
													<div style="transform: translate(0, 0.5rem)">
														<div class="p-2 g-0 m-0 me-2 d-flex button-parent cursor-pointer" style="min-width: 40px">
															<button-constructor
																@click="selectMovie(item)"
																:mainColor="'primary'"
																:mainClass="'px-1 py-1 rounded-pill square'"
																:hasMainIcon="true"
																:mainIcon="`plus`"
																:mainIconClass="'mx-0'"
																:mainIconSize="'.9rem'"
																:mainIconStyle="'padding: 0 0px;'"
																:textClass="'d-none'"
															>
															</button-constructor>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
							<!---->
							<div
								v-if="hasActiveSearch && !isAllDataFetched && isInitialFetchDone"
								class="d-flex flex-row justify-content-center w-100"
							>
								<load-more-button
									:isAttachedModal="true"
									:isDisabled="isFetching"
									:clickAction="() => getSearchResults()"
								/>
							</div>
						</div>
					</ul>
				</div>
				<div
					class="d-flex align-items-center rounded-3 ps-3 pb-2 pt-1"
					style="max-width: 310px; min-height: 54px"
					:style="
						colorScheme === 'dark'
							? 'background-color: var(--bs-dark-bg-subtle)'
							: 'background-color: var(--bs-light-border-subtle)'
					"
				>
					<span
						:class="selectedMovies.data.length > 0 ? 'col-3' : 'col-12 text-center pe-3 text-muted'"
						class="fw-bold"
						style="padding-top: 3px"
					>
						{{ selectedMovies.data.length > 0 ? 'Selected:' : 'Nothing selected yet' }}</span
					>
					<div v-for="item in selectedMovies.data" class="d-flex flex-column col-9 ms-2">
						<span
							class="pe-3"
							style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; line-height: 1.75rem"
						>
							{{ item.title }}
						</span>
						<span class="small text-muted" style="font-size: 0.75rem">
							<b>{{ item.year }} &nbsp;·&nbsp; </b> <i>{{ item.type === 'tv' ? 'TV' : 'Movie' || '&nbsp' }}</i>
						</span>
					</div>
				</div>
			</div>
		</div>
	</modal-constructor>
</template>
<script setup>
	import ModalConstructor from '@/components/_constructors/ModalConstructor.vue'
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import LoadMoreButton from '@/components/buttons/LoadMoreButton.vue'

	import SearchInput from '@/components/inputs/SearchInput.vue'

	import { ref, computed, watch, onBeforeUnmount } from 'vue'
	import { storeToRefs } from 'pinia'
	import diacritic from 'diacritic'

	import { movie } from '@/services/backend/'

	import { capitalizeWords } from '@/helpers/utils'
	import { router } from '@/helpers'
	import { syncWatchlistChanges } from '@/helpers/actions'

	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'
	import { useRouteStore } from '@/stores/RouteStore'
	import { useMovieStore } from '@/stores/MovieStore'
	import { useMovieSearchStore } from '@/stores/MovieSearchStore'

	// prettier-ignore
	const { movieSearchData, selectedMovies, isFetching, isAllDataFetched, isInitialFetchDone, noSearchResult, hasActiveSearch } = storeToRefs(useMovieSearchStore())
	const { resetSearchStore, getSearchResults, selectMovie } = useMovieSearchStore()
	const { refetchMovies, updateCurrentWatchlistData } = useMovieStore()
	const { currentWatchlist } = storeToRefs(useMovieStore())

	const showTypeSomething = ref(true)

	watch(hasActiveSearch, () => {
		isDismissible.value = !hasActiveSearch.value
		setTimeout(() => {
			showTypeSomething.value = !hasActiveSearch.value
		}, 500)
	})

	onBeforeUnmount(() => {
		resetSearchStore()
	})

	const { currentPage } = storeToRefs(useRouteStore())
	const { colorScheme } = storeToRefs(useColorSchemeStore())

	const isFormDisabled = ref(false)
	const isDismissible = ref(true)

	watch(isFormDisabled, () => {
		isDismissible.value = !isFormDisabled.value
	})

	const props = defineProps({
		isModalShowing: {
			type: Boolean,
			required: true,
		},
	})

	const triggerModalClose = ref(false)

	const handleSubmit = async () => {
		isFormDisabled.value = true
		let success
		const id = selectedMovies.value.data[0].id

		try {
			const data = { movieId: id }

			const response = await movie.addToWatchlist(data)

			success = response.ok
			console.log('success: ' + success)
		} catch (error) {
			console.log(error)
		}

		if (success) {
			updateCurrentWatchlistData({ ...currentWatchlist.value, moviesCount: currentWatchlist.value.moviesCount + 1 })

			await refetchMovies()
			isFormDisabled.value = false
			triggerModalClose.value = true
			syncWatchlistChanges(currentPage.value.params.id)
		}

		// release modal even if no success
		setTimeout(() => {
			/* add some delay for awareness
			 ** since we are not using any error notify */
			isFormDisabled.value = false
		}, 650)
	}

	const isFormValid = computed(() => selectedMovies.value.data.length !== 0)

	const item = {
		title: 'Add new movie',
		successButton: {
			disabled: computed(() => {
				// will be enabled after validation feature
				if (isFormDisabled.value || !isFormValid.value) {
					return true
				}
			}),
			text: 'Add',
			action: () => handleSubmit(),
		},
	}
</script>
<style scoped>
	.button-parent {
		display: none;
	}

	.button-parent:hover .btn {
		color: var(--bs-btn-hover-color);
		background-color: var(--bs-btn-hover-bg);
		border-color: var(--bs-btn-hover-border-color);
	}

	.movie-card-search:not(.selected):hover .button-parent {
		transform: translateY(0px);
		opacity: 1;
		transition: all 0.3s ease-in-out;
	}

	.movie-card-search:not(.selected) .button-parent {
		transform: translateY(20px);
		opacity: 0;
		transition: all 0.3s ease-in-out;
	}
</style>
