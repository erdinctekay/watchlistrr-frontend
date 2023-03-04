<template>
	<div class="d-flex row justify-content-between align-items-center g-0 flex-md-row-reverse" style="min-height: 40px">
		<div
			class="right-col col-12 col-md-6 ps-0 ps-md-3 mb-2 mb-md-0 mx-n1 mx-md-0 buttons d-flex flex-row justify-content-end"
		>
			<!-- <divider-constructor :mainClass="'d-none d-lg-block border-1 border-start mx-4 my-1'" /> -->
			<div class="d-flex flex-row align-items-center">
				<!-- add buttons here -->
				<sort-dropdown :colorScheme="colorScheme" />
				<search-input :currentPage="currentPage" :colorScheme="colorScheme" />
			</div>
		</div>

		<div class="left-col col-12 col-md-6 mb-1 buttons d-flex flex-row justify-content-between align-items-center">
			<page-controls-bar
				:currentPage="currentPage"
				:colorScheme="colorScheme"
				:userCredentials="userCredentials"
				:isAuthenticated="isAuthenticated"
			/>
		</div>
	</div>
</template>
<script setup>
	import SortDropdown from '@/components/dropdowns/SortDropdown.vue'
	import SearchInput from '@/components/inputs/SearchInput.vue'
	import PageControlsBar from '@/components/headerParts/PageControlsBar.vue'

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
		currentPage: {
			type: Object,
			required: true,
		},
		userCredentials: {
			type: Object,
			required: true,
		},
		isAuthenticated: {
			type: Boolean,
			required: true,
		},
	})
</script>
<style scoped>
	@media (max-width: 767.98px) {
		.right-col {
			min-width: calc(100% + 0.5rem);
		}
	}

	.left-col > div,
	.right-col > div {
		width: 100% !important;
	}

	@media (min-width: 768px) {
		.left-col > div,
		.right-col > div {
			width: unset !important;
		}
	}
</style>
