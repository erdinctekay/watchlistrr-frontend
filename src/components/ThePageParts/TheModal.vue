<template>
	<create-update-watchlist-modal
		v-if="currentModal === 'addWatchlist'"
		:isModalShowing="isModalShowing"
		:objectToEdit="currentModalData"
	/>

	<create-update-movie-modal
		v-if="currentModal === 'addMovie'"
		:isModalShowing="isModalShowing"
		:objectToEdit="currentModalData"
	/>
	<!-- prettier-ignore -->
	<please-login-modal
		v-if="currentModal === 'pleaseLogin'"
		:isModalShowing="isModalShowing"
	/>

	<!-- prettier-ignore -->
	<delete-item-modal
		v-if="currentModal?.split('/')[0] === 'deleteItem'"
		:isModalShowing="isModalShowing"
		:objectToDelete="currentModalData"
		:type="currentModal.split('/')[1]"
	/>
</template>
<script setup>
	import CreateUpdateWatchlistModal from '@/components/modals/CreateUpdateWatchlistModal.vue'
	import CreateUpdateMovieModal from '@/components/modals/CreateUpdateMovieModal.vue'
	import PleaseLoginModal from '@/components/modals/PleaseLoginModal.vue'
	import DeleteItemModal from '@/components/modals/DeleteItemModal.vue'

	import { storeToRefs } from 'pinia'
	import { watch } from 'vue'

	import { useModalStore } from '@/stores/ModalStore'

	const { isModalShowing, currentModal, currentModalData } = storeToRefs(useModalStore())

	watch(
		() => currentModal.value,
		(newValue) => {
			if (newValue) {
				console.log(currentModal.value)
			}
		}
	)
</script>
