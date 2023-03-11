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
			>
				<div class="watchlist-info d-flex flex-column me-3" style="position: relative; max-width: 10.5rem">
					<span
						class="watchlist-name text-body fw-bold"
						style="text-overflow: ellipsis; overflow: hidden; white-space: pre"
					>
						{{ isHomePage ? 'Watchlists' : currentWatchlist?.title }}
					</span>
					<span
						v-if="!isHomePage"
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
						<a class="hover-highlight-button text-body cursor-pointer text-decoration-underline"
							>{{ currentWatchlist?.user.displayName }}
						</a>
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
						<i class="">all watchlists included </i>
						<i class="d-none">all watchlists except yours </i>
					</span>
				</div>
			</div>
		</div>

		<divider-constructor :mainClass="'border-1 border-end mx-3 my-1 d-none d-md-block'" />

		<div class="action-buttons d-flex flex-row align-items-center me-1 me-md-0">
			<div v-if="!isAuthorized && !isHomePage" class="d-flex flex-row">
				<interaction-buttons-constructor :type="'watchlist'" />
			</div>
			<div v-else class="d-flex flex-row">
				<button-constructor
					v-if="isHomePage"
					@click="openModal('addWatchlist')"
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
					v-else
					@click="openModal('addMovie')"
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
	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'
	import DividerConstructor from '@/components/constructors/DividerConstructor.vue'
	import InteractionButtonsConstructor from '@/components/constructors/InteractionButtonsConstructor.vue'
	import ControlDropdown from '@/components/dropdowns/ControlDropdown.vue'

	import { onMounted, onUpdated, computed, ref, watchEffect, onBeforeUnmount } from 'vue'
	import { storeToRefs } from 'pinia'

	import { useMovieStore } from '@/stores/MovieStore'
	import { useModalStore } from '@/stores/ModalStore'

	const { openModal } = useModalStore()

	const { currentWatchlist, routerWatchlistId } = storeToRefs(useMovieStore())

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

	const isAuthorized = computed(() => {
		if (!props.isAuthenticated) return false

		const isOwner = currentWatchlist.value?.userId === props.userCredentials.uid
		const isWatchlistPage = props.currentPage.name === 'watchlist.show'

		return isWatchlistPage ? isOwner : false
	})

	onMounted(() => {
		controlTextOverflow()
	})

	onUpdated(() => {
		controlTextOverflow()
	})

	// onBeforeUnmount(() => {
	// 	isAuthorized.value = null
	// })

	// control margin-end due to ellipsis
	const controlTextOverflow = () => {
		const watchlistInfoEls = document.querySelectorAll('.watchlist-info')

		watchlistInfoEls.forEach((watchlistInfoEl) => {
			const textBodyEl = watchlistInfoEl.querySelector('.watchlist-name')

			if (textBodyEl.scrollWidth > textBodyEl.clientWidth) {
				watchlistInfoEl.classList.remove('me-3')
				watchlistInfoEl.classList.add('me-2')
			}
		})
	}
</script>
<style scoped>
	.action-buttons > div > button:last-of-type {
		margin-right: 0 !important;
	}
</style>
