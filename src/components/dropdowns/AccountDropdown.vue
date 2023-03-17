<template>
	<div class="dropdown d-flex justify-content-center">
		<button-constructor
			:mainColor="'standart'"
			:mainClass="'rounded-pill py-0 ps-0 border-transparent border-2 hover-highlight-icon'"
			:textClass="'small uppercase-first-letter d-none d-sm-block'"
			:hasBeforeImage="true"
			:beforeImageSource="'/profile.webp'"
			:beforeImageHeight="'29'"
			:beforeImageClass="'rounded-circle'"
			:beforeImageStyle="`padding:3px; ${colorScheme === 'light' ? 'filter: brightness(1.25) contrast(0.85);' : ''}`"
			:hasAfterIcon="true"
			:afterIcon="`caret-down-fill`"
			:afterIconClass="'text-body filled-icon'"
			:afterIconSize="'1rem'"
			:afterIconStyle="'transform:translateY(1px);'"
			:dataBsToggle="'dropdown'"
			:ariaExpanded="false"
		>
			{{ userCredentials?.displayName }}
		</button-constructor>
		<dropdown-constructor :dropdownObject="dropdownObject" :colorScheme="colorScheme" />
	</div>
</template>
<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import DropdownConstructor from '@/components/_constructors/DropdownConstructor.vue'

	import { router } from '@/helpers'
	import { storeToRefs } from 'pinia'
	const { userCredentials } = storeToRefs(props)
	const { returnPage } = router

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
		userCredentials: {
			type: Object,
			required: true,
		},
	})

	const accountDropdown = [
		{
			label: 'Account',
			name: 'account',
			action: () => returnPage('account'),
		},
		{
			label: 'Logout',
			name: 'logout',
			action: () => returnPage('logout'),
		},
	]

	const dropdownObject = {
		'Account Dropdown': {
			defaults: {
				groupName: `Welcome ${userCredentials.value.displayName?.split(' ')[0]}`,
				showGroupName: true,
				mainClass: 'w-100 hover-highlight bg-opacity-50 text-body py-2',
				textClass: 'uppercase-first-letter',
				// textStyle: '/*min-width:31px;*/',
			},
			items: [...accountDropdown],
		},
	}
</script>
