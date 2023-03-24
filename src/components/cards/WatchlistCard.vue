<template>
	<card-constructor
		type="watchlist"
		:item="item"
		:userCredentials="userCredentials || {}"
		:colorScheme="colorScheme"
		:isAuthorized="isAuthorized"
	>
		<template #after-title>
			<div class="py-2 pt-1 d-flex justify-content-start align-items-end text-muted">
				<span class="small fst-italic">
					{{ formatCount(item.moviesCount, 'movie') }}
					<b>·</b>
					{{ formatCount(item.favsCount, 'favorite') }}
					<b>·</b>
					{{ formatCount(item.followsCount, 'follower') }}
				</span>
			</div>

			<div class="py-3 d-flex justify-content-start align-items-end text-muted">
				<span class="small fst-italic fw-bold" style="height: 50px">
					<!-- if there is movies -->
					<template v-if="item.highlightedMovies.length > 0">
						<template v-for="(movie, index) in item.highlightedMovies.slice(0, 5)">
							<span>{{ movie.title }}</span>
							<template v-if="index !== 4 && index !== item.highlightedMovies.length - 1">,&nbsp</template>
						</template>
						<span class="fst-normal fw-normal" v-if="item.moviesCount > 5"> and more...</span>
					</template>

					<!-- if there is no movies -->
					<template v-else>
						<span class="fst-normal fw-normal">No movies have been added to this watchlist yet.</span>
					</template>
				</span>
			</div>

			<div class="d-flex flex-row justify-content-end mt-2 mb-n3">
				<!-- <div class="pt-1 pb-2 text-muted fst-italic small">
					Created by:
					<span class="fst-italic text-body hover-highlight-button cursor-pointer text-decoration-underline">
						<a>{{ formatShortName(item.user.displayName) }}</a>
					</span>
				</div> -->

				<button-constructor
					@click="returnPage('userWatchlists.show', item.user.id)"
					:mainColor="'transparent'"
					:mainClass="'rounded-pill py-0 p-0 hover-highlight-button text-body border-transparent border-2'"
					:textClass="'small uppercase-first-letter ms-0'"
					:hasAfterImage="true"
					:afterImageSource="'/profile.webp'"
					:afterImageHeight="'29'"
					:afterImageClass="'rounded-circle'"
					:afterImageStyle="`padding:3px; ${colorScheme === 'light' ? 'filter: brightness(1.1) contrast(.85);' : ''}`"
				>
					{{ formatShortName(item.user.displayName) }}
				</button-constructor>

				<!-- <button-constructor
					:mainColor="'transparent'"
					:mainClass="'rounded-pill py-0 p-0 hover-highlight-button text-body border-transparent border-2'"
					:textClass="'small uppercase-first-letter me-0'"
					:hasBeforeImage="true"
					:beforeImageSource="'/profile.webp'"
					:beforeImageHeight="'29'"
					:beforeImageClass="'rounded-circle ps-0'"
					:beforeImageStyle="`padding:3px; ${colorScheme === 'light' ? 'filter: brightness(1.1) contrast(.85);' : ''}`"
				>
					{{ formatShortName(item.user.displayName) }}
				</button-constructor> -->
			</div>
		</template>
	</card-constructor>
</template>
<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import CardConstructor from '@/components/_constructors/CardConstructor.vue'

	import { utils } from '@/helpers'
	import { router } from '@/helpers'
	import { formatShortName } from '@/helpers/utils'

	import { storeToRefs } from 'pinia'
	import { computed } from 'vue'

	import { useAuthStore } from '@/stores/AuthStore'
	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'

	const { returnPage } = router

	const props = defineProps({
		item: {
			type: Object,
			required: true,
		},
	})

	const { userCredentials, isAuthenticated } = storeToRefs(useAuthStore())
	const { colorScheme } = storeToRefs(useColorSchemeStore())

	const { formatCount } = utils

	const isAuthorized = computed(() => {
		if (!isAuthenticated.value) return false

		const isOwner = props.item.userId === userCredentials.value.uid

		return isOwner
	})
</script>
