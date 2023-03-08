<template>
	<card-constructor type="watchlist" :item="item" :userCredentials="userCredentials || {}" :colorScheme="colorScheme">
		<template #additional-area>
			<div class="py-2 pt-1 d-flex justify-content-start align-items-end text-muted">
				<span class="small fst-italic">
					{{ formatCount(item.moviesCount, 'movie') }}
					<b>·</b>
					{{ formatCount(item.favCount, 'favorite') }}
					<b>·</b>
					{{ formatCount(item.followCount, 'follower') }}
				</span>
			</div>

			<div class="py-3 d-flex justify-content-start align-items-end text-muted">
				<span class="small fst-italic fw-bold" style="height: 50px">
					<span v-if="item.highlightedMovies.length > 0" v-for="(movie, index) in item.highlightedMovies">
						<span> {{ movie.title }} </span>
						<span v-if="index !== item.highlightedMovies.length - 1">, </span>
						<span v-else class="fst-normal fw-normal"> and more...</span>
					</span>
					<!-- -->
					<span v-else class="fst-normal fw-normal"> No movies have been added to this watchlist yet. </span>
				</span>
			</div>

			<div class="d-flex flex-row justify-content-end mt-2 mb-n3">
				<!-- <div class="pt-1 pb-2 text-muted fst-italic small">
					Created by:
					<span class="fst-italic text-body hover-highlight-button cursor-pointer text-decoration-underline">
						<a>{{ item.user.displayName }}</a>
					</span>
				</div> -->

				<button-constructor
					:mainColor="'transparent'"
					:mainClass="'rounded-pill py-0 p-0 hover-highlight-button text-body border-transparent border-2'"
					:textClass="'small uppercase-first-letter ms-0'"
					:hasAfterImage="true"
					:afterImageSource="'/profile.webp'"
					:afterImageHeight="'29'"
					:afterImageClass="'rounded-circle'"
					:afterImageStyle="`padding:3px; ${colorScheme === 'light' ? 'filter: brightness(1.1) contrast(.85);' : ''}`"
				>
					{{ item.user.displayName }}
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
					{{ item.user.displayName }}
				</button-constructor> -->
			</div>
		</template>
	</card-constructor>
</template>
<script setup>
	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'
	import CardConstructor from '@/components/constructors/CardConstructor.vue'

	import { utils } from '@/helpers'

	import { storeToRefs } from 'pinia'

	import { useAuthStore } from '@/stores/AuthStore'
	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'

	const props = defineProps({
		item: {
			type: Object,
			required: true,
		},
	})

	const { userCredentials } = storeToRefs(useAuthStore())
	const { colorScheme } = storeToRefs(useColorSchemeStore())

	const { formatCount } = utils
</script>
