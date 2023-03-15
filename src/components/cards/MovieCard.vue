<template>
	<card-constructor
		type="movie"
		:item="item"
		:userCredentials="userCredentials || {}"
		:colorScheme="colorScheme"
		:isAuthorized="isAuthorized"
	>
		<template #after-title>
			<div class="pt-3 d-flex justify-content-start align-items-end text-muted">
				<span class="small fst-italic">
					{{ item.year }}
					<b>·</b>
					{{ item.type === 'tv' ? 'TV Series' : 'Movie' }}
					<b>·</b>
					{{ formatCount(item.runtime, 'min') }}
				</span>
			</div>
			<div v-if="item.type === 'tv'" class="pt-0 d-flex justify-content-start align-items-end text-muted">
				<span class="small">
					{{ formatCount(item.season, 'season') }}
					<b>·</b>
					{{ formatCount(item.episodes, 'episode') }}
					<span v-if="item.ended" class="fst-italic"><span class="fst-normal">— </span>ended</span>
				</span>
			</div>
			<div
				class="d-flex justify-content-start align-items-end text-muted flex-wrap"
				:class="item.type === 'tv' ? 'pt-2' : 'pt-0'"
			>
				<span v-for="(genre, index) in item.genres" class="small fw-bold text-nowrap">
					{{ capitalizeWords(genre) }}
					<b v-if="index !== item.genres.length - 1">·&nbsp</b>
				</span>
			</div>
		</template>
	</card-constructor>
</template>
<script setup>
	import CardConstructor from '@/components/_constructors/CardConstructor.vue'

	import { utils } from '@/helpers'

	import { storeToRefs } from 'pinia'
	import { computed } from 'vue'

	import { useAuthStore } from '@/stores/AuthStore'
	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'

	const { userCredentials, isAuthenticated } = storeToRefs(useAuthStore())
	const { colorScheme } = storeToRefs(useColorSchemeStore())

	const isAuthorized = computed(() => {
		if (!isAuthenticated.value) return false

		const isOwner = props.currentWatchlist.userId === userCredentials.value.uid

		return isOwner
	})

	const props = defineProps({
		item: {
			type: Object,
			required: true,
		},
		addedBy: {
			type: String,
			required: true,
		},
		dateAdded: {
			type: String,
			required: true,
		},
		currentWatchlist: {
			type: Object,
			required: true,
		},
	})

	const { formatCount, capitalizeWords } = utils
</script>
