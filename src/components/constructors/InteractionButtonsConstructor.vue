<template>
	<!-- prettier-ignore -->
	<button-constructor
		v-for="item in interactionObject[type].items"
		:key="item.name"
		:mainColor="item.mainColor || interactionObject[type].defaults.mainColor || interactionObject.defaults.mainColor"
		:mainClass="item.mainClass || interactionObject[type].defaults.mainClass || interactionObject.defaults.mainClass"
		:hasMainIcon="item.hasMainIcon || interactionObject[type].defaults.hasMainIcon || interactionObject.defaults.hasMainIcon"
		:mainIcon="item.mainIcon || interactionObject[type].defaults.mainIcon || interactionObject.defaults.mainIcon"
		:mainIconClass="item.mainIconClass || interactionObject[type].defaults.mainIconClass || interactionObject.defaults.mainIconClass"
		:mainIconSize="item.mainIconSize || interactionObject[type].defaults.mainIconSize || interactionObject.defaults.mainIconSize"
		:mainIconStyle="item.mainIconStyle || interactionObject[type].defaults.mainIconStyle || interactionObject.defaults.mainIconStyle"
		:textClass="item.textClass || interactionObject[type].defaults.textClass || interactionObject.defaults.textClass"
	>
	</button-constructor>
</template>
<script setup>
	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'

	const props = defineProps({
		type: {
			type: String,
			required: true,
		},
	})

	const movieInteractions = [
		{
			name: 'like',
			mainIcon: 'heart',
			mainIconSize: '1.275rem',
			mainIconStyle: 'transform: translateY(1px)',
		},
		{
			name: 'watch',
			mainIcon: 'check-circle',
			// action: () => function(),
		},
	]

	const watchlistInteractions = [
		{
			name: 'fav',
			mainIcon: 'star',
			mainIconSize: '1.275rem',
			mainIconStyle: 'transform: translateY(-1px)',
		},
		{
			name: 'follow',
			mainIcon: 'plus-circle',
			// action: () => function(),
		},
	]

	const interactionObject = {
		defaults: {
			mainColor: 'transparent',
			mainClass: 'rounded-pill square hover-highlight-icon border-0 p-0 me-3 text-light',
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
	}
</script>
