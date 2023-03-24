<template>
	<div class="d-flex flex-row flex-nowrap justify-content-between" style="min-height: 45px">
		<div class="btn-group me-3 me-md-0" role="group">
			<control-dropdown
				v-if="isAuthorized"
				:type="'watchlist'"
				:dropdownPosition="'dropdown-start'"
				:useDefaultButton="false"
				:userCredentials="userCredentials"
				:colorScheme="colorScheme"
				:item="isWatchlistPage ? currentWatchlist : null"
			>
				<template #new-button>
					<button-constructor
						:mainColor="'secondary'"
						:mainClass="'p-0 m-0 border-transparent text-white border-2 rounded-0 rounded-start-3 border-0'"
						:textClass="'d-none'"
						:hasMainIcon="true"
						:mainIcon="`gear-fill`"
						:mainIconClass="'icon-opacity-100 px-1'"
						:mainIconSize="'.8rem'"
						:dataBsToggle="'dropdown'"
						:ariaExpanded="false"
					>
					</button-constructor>
				</template>
			</control-dropdown>
			<div
				class="d-flex justify-content-start align-items-center text-muted btn-standart hover-none p-1 ps-3"
				:class="`${isAuthorized ? 'rounded-end-3' : 'rounded-3'}`"
				style="min-width: 150px"
			>
				<div class="watchlist-info d-flex flex-column me-3" style="position: relative; max-width: 10.5rem">
					<div class="d-flex justify-content-between">
						<span
							class="watchlist-name text-body fw-bold"
							style="text-overflow: ellipsis; overflow: hidden; white-space: pre"
						>
							{{
								isHomePage || isUserWatchlistsPage
									? isHomePage
										? 'Public Watchlists'
										: currentWatchlistsBy?.displayName || ' '
									: currentWatchlist?.title
							}}
						</span>
						<private-item-indicator
							v-if="isWatchlistPage && !currentWatchlist?.public"
							class="me-n2"
							style="margin-top: -0.1rem"
						/>
					</div>
					<span
						v-if="isWatchlistPage"
						class="fst-italic small text-nowrap text-muted"
						style="
							color: var(--bs-secondary-color) !important;
							padding-bottom: 2px;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: pre;
							max-width: inherit;
						"
					>
						<i class="">by </i>
						<a
							@click="
								returnPage(
									'userWatchlists.show',
									isUserWatchlistsPage ? currentWatchlistsBy?.id : currentWatchlist?.user.id
								)
							"
							class="hover-highlight-button text-body cursor-pointer text-decoration-underline"
						>
							{{
								isUserWatchlistsPage
									? formatShortName(currentWatchlistsBy?.displayName)
									: formatShortName(currentWatchlist?.user.displayName)
							}}
						</a>
						<i>&nbsp;— {{ hasActiveSearch ? 'filtered' : 'all sorted' }} </i>
					</span>
					<span
						v-else
						class="fst-italic small text-nowrap text-muted"
						style="
							color: var(--bs-secondary-color) !important;
							padding-bottom: 2px;
							text-overflow: ellipsis;
							overflow: hidden;
							white-space: pre !important;
							max-width: inherit;
						"
					>
						<i>
							{{ hasActiveSearch ? 'search filtered ' + source + 's' : 'all ' + source + 's sorted' }}
						</i>
					</span>
				</div>
			</div>
		</div>

		<divider-constructor
			v-if="(isUserWatchlistsPage && isUserPageOwner) || isHomePage || isWatchlistPage"
			:mainClass="'border-1 border-end mx-3 my-1 d-none d-md-block'"
		/>

		<div class="action-buttons d-flex flex-row align-items-center me-1 me-md-0">
			<div v-if="!isAuthorized && !isHomePage && !isUserWatchlistsPage" class="d-flex flex-row">
				<interaction-buttons-constructor :type="'watchlist'" :item="isWatchlistPage ? currentWatchlist || {} : {}" />
			</div>
			<div v-else class="d-flex flex-row">
				<button-constructor
					v-if="isHomePage || (isUserWatchlistsPage && isUserPageOwner)"
					@click="isAuthenticated ? openModal('addWatchlist') : openModal('pleaseLogin')"
					:mainColor="'primary'"
					:mainClass="'rounded-pill px-2 p-1 my-1 text-light'"
					:hasMainIcon="true"
					:mainIcon="'plus-lg'"
					:mainIconClass="'me-0'"
					:textClass="'small'"
				>
					Add New
				</button-constructor>
				<button-constructor
					v-else-if="isWatchlistPage"
					@click="isAuthenticated ? openModal('addMovie') : openModal('pleaseLogin')"
					:mainColor="'primary'"
					:mainClass="'rounded-pill px-2 p-1 my-1 text-light'"
					:hasMainIcon="true"
					:mainIcon="'plus-lg'"
					:mainIconClass="'me-0'"
					:textClass="'small'"
				>
					Add New
				</button-constructor>
			</div>
		</div>
	</div>
</template>
<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import DividerConstructor from '@/components/_constructors/DividerConstructor.vue'
	import InteractionButtonsConstructor from '@/components/_constructors/InteractionButtonsConstructor.vue'

	import PrivateItemIndicator from '@/components/indicators/PrivateItemIndicator.vue'
	import ControlDropdown from '@/components/dropdowns/ControlDropdown.vue'

	import { onMounted, onUpdated, computed } from 'vue'
	import { storeToRefs } from 'pinia'

	import { router } from '@/helpers'
	import { formatShortName } from '@/helpers/utils'

	import { useMovieStore } from '@/stores/MovieStore'
	import { useWatchlistStore } from '@/stores/WatchlistStore'
	import { useModalStore } from '@/stores/ModalStore'

	const { openModal } = useModalStore()

	const { currentWatchlist, hasActiveSearch: hasActiveMovieSearch } = storeToRefs(useMovieStore())
	const { currentWatchlistsBy, hasActiveSearch: hasActiveWatchlistSearch } = storeToRefs(useWatchlistStore())

	const { returnPage } = router

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
		currentPage: {
			type: Object,
			required: true,
		},
		isAuthenticated: {
			type: Boolean,
			required: true,
		},
		userCredentials: {
			type: Object,
			required: true,
		},
	})

	const isHomePage = computed(() => {
		if (props.currentPage.name === 'home') return true

		return false
	})

	const isWatchlistPage = computed(() => {
		if (props.currentPage.name === 'watchlistMovies.show') return true

		return false
	})

	const isUserWatchlistsPage = computed(() => {
		if (props.currentPage.name === 'userWatchlists.show') return true

		return false
	})

	const isUserPageOwner = computed(() => {
		if (!props.isAuthenticated) return false

		if (isUserWatchlistsPage.value) return currentWatchlistsBy.value?.id === props.userCredentials.uid

		return false
	})

	const isAuthorized = computed(() => {
		if (!props.isAuthenticated) return false

		const isOwner = currentWatchlist.value?.userId === props.userCredentials.uid
		const isWatchlistPage = props.currentPage.name === 'watchlistMovies.show'

		return isWatchlistPage ? isOwner : false
	})

	const source = computed(() => {
		if (isHomePage.value || isUserWatchlistsPage.value) return 'watchlist'
		if (isWatchlistPage.value) return 'movie'
	})

	const hasActiveSearch = computed(() => {
		if (isHomePage.value || isUserWatchlistsPage.value) return hasActiveWatchlistSearch?.value
		if (isWatchlistPage.value) return hasActiveMovieSearch?.value
	})

	onMounted(() => {
		controlTextOverflow()
	})

	onUpdated(() => {
		resetTextOverflow()
		controlTextOverflow()
	})

	// control margin-end due to ellipsis
	const controlTextOverflow = () => {
		const watchlistInfoEls = document.querySelectorAll('.watchlist-info')

		watchlistInfoEls.forEach((watchlistInfoEl) => {
			const textBodyEl = watchlistInfoEl.querySelector('.watchlist-name')

			if (textBodyEl.scrollWidth > textBodyEl.clientWidth) {
				if (watchlistInfoEl.classList.contains('me-3')) watchlistInfoEl.classList.remove('me-3')
				if (!watchlistInfoEl.classList.contains('me-2')) watchlistInfoEl.classList.add('me-2')
			}
		})
	}

	// reset values to fix conflicts
	const resetTextOverflow = () => {
		const watchlistInfoEls = document.querySelectorAll('.watchlist-info')

		watchlistInfoEls.forEach((watchlistInfoEl) => {
			if (watchlistInfoEl.classList.contains('me-2')) watchlistInfoEl.classList.remove('me-2')
			if (!watchlistInfoEl.classList.contains('me-3')) watchlistInfoEl.classList.add('me-3')
		})
	}
</script>
<style scoped></style>
<style>
	.watchlist-info .popover,
	.watchlist-info .popover-body {
		min-width: 225px !important;
	}

	.action-buttons > div > button:last-of-type {
		margin-right: 0 !important;
	}
</style>
