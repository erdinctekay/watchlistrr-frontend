<template>
	<!-- prettier-ignore -->
	<button-constructor
		v-for="item in interactionObject.value[type].items"
		@click="item.action"
		:key="item.name"
		:mainColor="item.mainColor || interactionObject.value[type].defaults.mainColor || interactionObject.value.defaults.mainColor"
		:mainClass="item.mainClass || interactionObject.value[type].defaults.mainClass || interactionObject.value.defaults.mainClass"
		:hasMainIcon="item.hasMainIcon || interactionObject.value[type].defaults.hasMainIcon || interactionObject.value.defaults.hasMainIcon"
		:mainIcon="item.mainIcon || interactionObject.value[type].defaults.mainIcon || interactionObject.value.defaults.mainIcon"
		:mainIconClass="item.mainIconClass || interactionObject.value[type].defaults.mainIconClass || interactionObject.value.defaults.mainIconClass"
		:mainIconSize="item.mainIconSize || interactionObject.value[type].defaults.mainIconSize || interactionObject.value.defaults.mainIconSize"
		:mainIconStyle="item.mainIconStyle || interactionObject.value[type].defaults.mainIconStyle || interactionObject.value.defaults.mainIconStyle"
		:textClass="item.textClass || interactionObject.value[type].defaults.textClass || interactionObject.value.defaults.textClass"
	>
	</button-constructor>
</template>
<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'

	import { reactive, watchEffect, computed } from 'vue'
	import { storeToRefs } from 'pinia'

	import { toggleInteraction } from '@/helpers/actions'

	import { useAuthStore } from '@/stores/AuthStore'
	import { useModalStore } from '@/stores/ModalStore'
	import { useUserStore } from '@/stores/UserStore'

	const { userInteractionData } = storeToRefs(useUserStore())
	const { openModal } = useModalStore()
	const { isAuthenticated, userCredentials } = storeToRefs(useAuthStore())

	const props = defineProps({
		type: {
			type: String,
			required: true,
		},
		item: {
			type: Object,
			required: true,
		},
	})

	const interactionData = reactive({
		isLiked: null,
		isWatched: null,
		isFavorited: null,
		isFollowed: null,
	})

	const updateInteractionData = () => {
		const like = userInteractionData.value.likes.find((like) => like.movieId === props.item.id)
		interactionData.isLiked = like ? like.id : false

		const watch = userInteractionData.value.watchs.find((watch) => watch.movieId === props.item.id)
		interactionData.isWatched = watch ? watch.id : false

		const fav = userInteractionData.value.favs.find((fav) => fav.watchlistId === props.item.id)
		interactionData.isFavorited = fav ? fav.id : false

		const follow = userInteractionData.value.follows.find((follow) => follow.watchlistId === props.item.id)
		interactionData.isFollowed = follow ? follow.id : false
	}

	watchEffect(() => {
		updateInteractionData()
	})

	const movieInteractions = [
		{
			name: 'like',
			mainIcon: computed(() => (!!interactionData.isLiked ? 'heart-fill' : 'heart')),
			mainIconClass: computed(() => (!!interactionData.isLiked ? 'text-danger filled-icon colored' : 'filled-icon')),
			mainIconSize: '1.275rem',
			mainIconStyle: 'transform: translateY(1px)',
			action: () =>
				isAuthenticated.value
					? toggleInteraction('likes', interactionData.isLiked, props.item.id, userCredentials.value.uid)
					: openModal(`pleaseLogin`),
		},
		{
			name: 'watch',
			mainIcon: computed(() => (!!interactionData.isWatched ? 'check-circle-fill' : 'check-circle')),
			mainIconClass: 'filled-icon',
			action: () =>
				isAuthenticated.value
					? toggleInteraction('watchs', interactionData.isWatched, props.item.id, userCredentials.value.uid)
					: openModal(`pleaseLogin`),
		},
	]

	const watchlistInteractions = [
		{
			name: 'fav',
			mainIcon: computed(() => (!!interactionData.isFavorited ? 'star-fill' : 'star')),
			// prettier-ignore
			mainIconClass: computed(() => (!!interactionData.isFavorited ? 'text-warning filled-icon colored' : 'filled-icon')),
			mainIconSize: '1.275rem',
			mainIconStyle: 'transform: translateY(-1px)',
			action: () =>
				isAuthenticated.value
					? toggleInteraction('favs', interactionData.isFavorited, props.item.id, userCredentials.value.uid)
					: openModal(`pleaseLogin`),
		},
		{
			name: 'follow',
			mainIcon: computed(() => (!!interactionData.isFollowed ? 'plus-circle-fill' : 'plus-circle')),
			mainIconClass: 'filled-icon',
			action: () =>
				isAuthenticated.value
					? toggleInteraction('follows', interactionData.isFollowed, props.item.id, userCredentials.value.uid)
					: openModal(`pleaseLogin`),
		},
	]

	// needs to be reactive to update icons and classes without using .value
	const interactionObject = reactive({
		value: {
			defaults: {
				mainColor: 'transparent',
				mainClass: 'rounded-pill square hover-highlight-icon border-0 p-0 me-3',
				hasMainIcon: true,
				mainIcon: 'check-circle',
				mainIconClass: 'me-0',
				mainIconSize: '1.25rem',
				textClass: 'd-none',
			},
			movie: {
				defaults: {},
				items: [...movieInteractions],
			},
			watchlist: {
				defaults: {},
				items: [...watchlistInteractions],
			},
		},
	})
</script>
<style>
	[data-bs-theme='dark'] .hover-highlight-icon i.colored {
		--bs-filled-icon-opacity: 0.8 !important;
	}

	[data-bs-theme='dark'] .hover-highlight-icon:hover i:not(.colored) {
		--bs-filled-icon-opacity: 0.85 !important;
	}

	[data-bs-theme='dark'] .hover-highlight-icon:hover i {
		--bs-filled-icon-opacity: 1 !important;
	}

	[data-bs-theme='light'] .hover-highlight-icon i.colored {
		--bs-filled-icon-opacity: 0.75 !important;
	}

	[data-bs-theme='light'] .hover-highlight-icon:hover i:not(.colored) {
		--bs-filled-icon-opacity: 0.8 !important;
	}

	[data-bs-theme='light'] .hover-highlight-icon:hover i {
		--bs-filled-icon-opacity: 0.9 !important;
	}
</style>
