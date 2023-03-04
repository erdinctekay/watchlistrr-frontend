<template>
	<div
		class="d-flex w-100 align-items-center hover-highlight-icon justify-content-end flex-row-reverse rounded-pill"
		style="position: relative; min-width: 13.5rem; /* transform: translateX(-2.1rem); margin-right: -2.1rem */"
	>
		<!-- <button
						class="btn bg-transparent hover-highlight-icon rounded-circle search-reset"
						type="reset"
						style="aspect-ratio: 1; padding: 0 0.5rem; transform: translateX(-42px); margin-right: -40px"
					>
						<i class="bi bi-arrow-clockwise rotate-180" style="font-size: 1.25rem; max-height: 20px"></i>
					</button> -->
		<i
			class="bi bi-search"
			style="
				aspect-ratio: 1;
				padding: 0 0.5rem;
				transform: translateX(-42px);
				margin-right: -40px;
				pointer-events: none !important;
			"
		></i>

		<!-- prettier-ignore-attribute class -->
		<input
			class="ps-4 bg-border-box text-body bg-standart hover-highlight focus-highlight-border 
							form-control input-search border-transparent border-0 rounded-pill"
			type="text"
			placeholder="Search"
			aria-label="Search"
			style="padding-right: 38px; font-size: 0.875rem"
			data-bs-toggle="popover"
			data-bs-trigger="hover"
			data-bs-placement="bottom"
			data-bs-container="body"
			:data-bs-content="
				currentPage.name !== 'home'
					? `Search movies or tv series by typing directly title or the name of the contributing directors, stars.`
					: `Search watchlists by typing title or name of the creator.`
			"
		/>
	</div>
</template>
<script setup>
	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
		currentPage: {
			type: Object,
			required: true,
		},
	})
</script>
