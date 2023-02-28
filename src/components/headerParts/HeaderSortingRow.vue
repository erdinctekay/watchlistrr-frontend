<template>
	<div class="d-flex row justify-content-between align-items-center g-0 flex-md-row-reverse">
		<div class="col-12 col-md-8 col-xl-6 ps-0 ps-md-3 mb-2 mb-md-1 buttons d-flex flex-row">
			<div class="d-flex w-100">
				<!-- <select class="form-select search-select rounded-pill">
					<option value="full_name">Name</option>
					<option value="job_title">Job Title</option>
					<option value="city">City</option>
					<option value="phone">Phone</option>
				</select> -->

				<!-- <div class="dropdown">
					<div
						class="btn btn-select ms-0 ms-md-2 row g-0 d-flex align-items-center justify-content-center rounded-pill py-0 px-3 border-transparent border-2 bg-standart hover-highlight hover-highlight-icon focus-highlight-border"
						style="position: relative; z-index: 9"
						data-bs-toggle="dropdown"
						aria-expanded="false"
					>
						<div class="d-flex h-100 align-items-center justify-content-between">
							<div class="d-inline-flex align-items-start flex-column flex-grow-1" style="width: 80px">
								<div class="text-body py-0 ps-1">
									<span class="d-flex align-items-center">
										<span class="">Name</span>
									</span>
								</div>
							</div>
							<div class="icon-after" style="transform: translateX(0.25rem)">
								<i
									class="bi bi-caret-down-fill text-body filled-icon"
									style="font-size: 1.1rem; transform: translateY(1px)"
								></i>
							</div>
						</div>
					</div>

					<ul
						v-bind:class="`${colorScheme === 'light' ? 'bg-light' : 'bg-gray-850'}`"
						class="dropdown-menu border-0 p-3 shadow"
						style="max-width: calc(100%); transform: translateX(-0.35rem); width: 10.5rem; border-radius: 1.5rem"
					>
						<li class="btn w-100 py-0 hover-highlight bg-opacity-50 rounded-pill px-2">
							<a class="nav-link px-1">
								<div class="d-flex h-100 align-items-center justify-content-center">
									<div class="d-inline-flex align-items-start flex-column flex-grow-1">
										<div class="nav-link text-body py-0 ps-1">
											<span class="d-flex align-items-center">
												<span class="ps-0">Name</span>
											</span>
										</div>
									</div>
									<div
										v-bind:class="`${colorScheme === 'light' ? 'bg-gray-350' : 'bg-gray-650'}`"
										class="icon-after rounded-circle"
									>
										<i class="bi bi-circle-fill text-body m-2 d-flex" style="font-size: 0.5rem"></i>
									</div>
								</div>
							</a>
						</li>
						<li class="btn w-100 py-0 hover-highlight bg-opacity-50 rounded-pill px-2">
							<a class="nav-link px-1">
								<div class="d-flex h-100 align-items-center justify-content-center">
									<div class="d-inline-flex align-items-start flex-column flex-grow-1">
										<div class="nav-link text-body py-0 ps-1">
											<span class="d-flex align-items-center">
												<span class="ps-0">Director</span>
											</span>
										</div>
									</div>
									<div
										v-bind:class="`${colorScheme === 'light' ? 'bg-gray-350' : 'bg-gray-650'}`"
										class="icon-after rounded-circle"
									>
										<i class="bi bi-circle-fill text-body m-2 d-flex" style="font-size: 0.5rem"></i>
									</div>
								</div>
							</a>
						</li>
					</ul>
				</div> -->
			</div>

			<!-- <divider-constructor :mainClass="'d-none d-lg-block border-1 border-start mx-4 my-1'" /> -->
			<button-constructor
				:mainColor="'primary'"
				:mainClass="'d-none d-md-flex btn-add rounded-pill my-1'"
				:hasMainIcon="true"
				:mainIcon="'plus-lg'"
				:mainIconClass="'me-2'"
			>
				Add New
			</button-constructor>
		</div>

		<div class="col-12 col-md-4 mb-1 buttons d-flex flex-row justify-content-between">
			<div class="d-flex flex-row flex-nowrap">
				<!-- <i class="bi bi-sort-down d-flex align-items-center me-2" style="font-size:1.5rem;"></i> -->
				<p class="text-nowrap text-muted d-none d-lg-flex align-items-center m-0 me-2">Sort by:</p>

				<sort-dropdown :colorScheme="colorScheme" />

				<!-- <div
					class="d-flex w-100 align-items-center justify-content-start flex-row-reverse"
					style="position: relative; min-width: 15rem; /* transform: translateX(-2.1rem); margin-right: -2.1rem */"
				>
					<button
						class="btn bg-transparent hover-highlight-icon rounded-circle search-reset"
						type="reset"
						style="aspect-ratio: 1; padding: 0 0.5rem; transform: translateX(-42px); margin-right: -40px"
					>
						<i class="bi bi-arrow-clockwise rotate-180" style="font-size: 1.25rem; max-height: 20px"></i>
					</button> -->

				<!-- prettier-ignore-attribute class -->

				<!-- <input
						class="ps-5 bg-border-box text-body bg-standart hover-highlight focus-highlight-border 
												form-control input-search border-transparent border-2 rounded-pill"
						type="text"
						placeholder="Select and search"
						aria-label="Search"
					/>
				</div> -->
			</div>

			<div class="ms-2 d-flex d-md-none flex-row flex-nowrap">
				<!-- prettier-ignore-attribute class -->
				<button-constructor
					:mainColor="'primary'"
					:mainClass="'btn-add btn-primary rounded-pill px-2 px-sm-3 text-light d-flex flex-row flex-nowrap align-items-center'"
					:hasMainIcon="true"
					:mainIcon="'plus-lg'"
					:mainIconClass="'me-0 me-sm-2'"
					:mainIconStyle="'padding: 0 2px;'"
					:textClass="'d-none d-sm-block'"
				>
					Add New
				</button-constructor>
				<!-- <button
                        class="btn btn-add rounded-pill px-2 px-sm-3 btn-primary text-light 
                            d-flex flex-row flex-nowrap align-items-center"
                    >
                        <i class="bi bi-plus-lg d-flex me-0 me-sm-2" style="font-size: 1.25rem"></i>
                        <span class="mx-2 text-nowrap d-none d-sm-block">Add New</span>
                </button> -->
			</div>
		</div>
	</div>
</template>
<script setup>
	import SortDropdown from '@/components/dropdowns/SortDropdown.vue'
	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
	})
</script>
