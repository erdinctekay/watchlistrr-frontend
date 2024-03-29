<template>
	<div class="card py-3 focus-highlight-border border-0 bg-transparent align-items-center" :data-key="item.id">
		<div class="row w-100 g-0">
			<div class="col-12">
				<div
					class="card-body bg-standart hover-highlight special-hover d-flex flex-column justify-content-between"
					:class="type === 'movie' ? 'movie' : ''"
					:style="{
						'--backdrop-path': type === 'movie' ? `url(https://image.tmdb.org/t/p/w500${backdropPath})` : '',
					}"
				>
					<div>
						<div class="position-relative" :style="type === 'movie' ? 'z-index:1;' : ''">
							<div class="row g-0 d-flex align-items-center px-2 pt-2 position-relative">
								<div class="row g-0 d-flex flex-nowrap mb-3 align-items-stretch">
									<div
										v-if="type === 'movie'"
										class="col img-parent d-flex align-items-center rounded-3"
										:style="{ 'max-width': `${sideImageWidth}px` }"
									>
										<img
											v-if="item.posterPath"
											data-key=""
											width="100"
											:src="`https://image.tmdb.org/t/p/w200` + item.posterPath"
											class="rounded-3"
											style="aspect-ratio: 2/3; min-width: 100px"
										/>
										<img
											v-else
											class="rounded-3"
											src="data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2050%2075%22%3E%3Crect%20width%3D%2250%22%20height%3D%2275%22%20fill%3D%22%23eee%22%2F%3E%3C%2Fsvg%3E"
											width="50"
											style="aspect-ratio: 2/3; min-width: 100px"
										/>
									</div>
									<div
										class="col-12 pe-0 d-flex flex-column justify-content-between"
										:class="`${sideImageWidth}` > 0 ? 'ps-3' : ''"
										:style="{
											'max-width': type === 'movie' ? `calc(100% - ${sideImageWidth}px)` : `100%`,
											'max-height': type === 'movie' ? '150px' : 'auto',
										}"
									>
										<div class="data-wrapper">
											<p data-key="" class="p-0 m-0 fw-bold">
												<span class="d-flex flex-row flex-wrap align-content-between text-body">
													<span
														v-if="
															type === 'movie' &&
															diacritic.clean(item.title).toLowerCase() !==
																diacritic.clean(item.originalTitle).toLowerCase()
														"
													>
														<span
															class="text-ellipsis line-clamp-1"
															:style="{
																width: type === 'watchlist' ? `calc(100% - ${privateWatchlistIconWidth}px)` : `100%`,
															}"
														>
															{{ item.title }}
														</span>
														<span class="small text-muted fw-normal text-ellipsis line-clamp-1">
															{{ item.originalTitle }}
														</span>
													</span>
													<span
														v-else
														class="text-ellipsis line-clamp-2"
														style="min-height: 2.5rem"
														:style="{
															width: type === 'watchlist' ? `calc(100% - ${privateWatchlistIconWidth}px)` : `100%`,
														}"
													>
														{{ item.title }}
													</span>
													<private-item-indicator
														v-if="type === 'watchlist' && !item.public"
														:IconWidth="privateWatchlistIconWidth"
													/>
												</span>
											</p>
											<slot name="after-title"></slot>
										</div>
										<!-- <div
											v-if="type === 'movie'"
											class="pt-3 d-flex justify-content-start align-items-end text-muted"
											style="padding-bottom: 3px"
										>
											<span
												class="small fst-italic cursor-pointer hover-highlight-button text-body text-decoration-underline"
											>
												<a>See more details </a>
											</span>
										</div> -->
									</div>
								</div>
							</div>
							<div
								class="card-bottom row g-0 px-2 mt-2 border-top border-1 d-flex justify-content-between align-items-center pt-3"
							>
								<div
									class="w-auto justify-content-start align-items-center d-flex flex-nowrap"
									style="min-height: 2rem"
								>
									<div class="w-auto justify-content-end align-items-end d-flex flex-nowrap">
										<interaction-buttons-constructor :type="type" :item="item" />
									</div>
								</div>
								<div class="w-auto justify-content-end align-items-center d-flex flex-nowrap">
									<control-dropdown
										v-if="isAuthorized"
										:type="type"
										:userCredentials="userCredentials"
										:colorScheme="colorScheme"
										:item="item"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import InteractionButtonsConstructor from '@/components/_constructors/InteractionButtonsConstructor.vue'
	import PrivateItemIndicator from '@/components/indicators/PrivateItemIndicator.vue'
	import ControlDropdown from '@/components/dropdowns/ControlDropdown.vue'

	import { onMounted, onUpdated, computed } from 'vue'
	import diacritic from 'diacritic'

	const props = defineProps({
		type: {
			type: String,
			required: true,
		},
		colorScheme: {
			type: String,
			required: true,
		},
		userCredentials: {
			type: Object,
			required: true,
		},
		isAuthorized: {
			type: Boolean,
			default: false,
		},
		item: {
			type: Object,
			required: true,
		},
	})

	const backdropPath = computed(() => (props.item.backdropPath ? props.item.backdropPath : props.item.posterPath))

	onUpdated(() => {})

	const privateWatchlistIconWidth = 36
	const sideImageWidth = props.type === 'movie' ? 100 : 0
</script>

<style>
	[data-bs-theme='dark'] .card .card-body.movie > div::before {
		background-image: radial-gradient(transparent 75%, black), var(--backdrop-path);
	}

	[data-bs-theme='light'] .card .card-body.movie > div::before {
		background-image: radial-gradient(#ffffff60 75%, #000000), var(--backdrop-path);
		opacity: 0.2;
		filter: grayscale(100%) blur(1px) contrast(1.25) brightness(0.85);
	}

	.card .card-body.movie > div::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-size: cover;
		opacity: 0.25;
		filter: grayscale(100%) blur(1px) contrast(1.25) brightness(0.8);
		clip-path: inset(5.5% 0% round 2rem);
	}

	[data-bs-theme='dark'] .card .card-body.movie span {
		text-shadow: 0.125rem 0.175rem 0.35rem rgb(0 0 0 / 30%);
	}

	[data-bs-theme='dark'] .card .card-body.movie span.small:not(.fw-bold) {
		text-shadow: 0.125rem 0.175rem 0.35rem rgb(0 0 0 / 80%) !important;
	}

	[data-bs-theme='dark'] .card .card-body.movie .img-parent {
		box-shadow: 0 0.125rem 0.65rem rgb(0 0 0 / 15%) !important;
	}

	[data-bs-theme='light'] .card .card-body.movie span:not(.small) {
		text-shadow: 0.175rem 0.175rem 0.25rem rgb(120 120 120 / 20%) !important;
	}

	[data-bs-theme='light'] .card .card-body.movie span.small {
		text-shadow: 0.125rem 0.125rem 0.75rem rgb(255 255 255 / 90%) !important;
	}

	[data-bs-theme='light'] .card .card-body.movie {
		--bs-secondary-color-rgb: var(--bs-gray-700-rgb);
		--bs-secondary-color: var(--bs-gray-700);
		--bs-body-color: var(--bs-gray-800);
		--bs-body-color-rgb: var(--bs-gray-800-rgb);
	}

	[data-bs-theme='light'] .card .card-body.movie .img-parent {
		box-shadow: 0.175rem 0.175rem 0.35rem rgb(120 120 120 / 15%);
	}

	[data-bs-theme='light'] .card .card-body.movie.hover-highlight:not(:disabled):hover,
	.card .card-body.movie.hover-highlight:not(:disabled):focus {
		background-color: rgba(var(--bs-light-rgb), 1) !important;
	}
</style>
