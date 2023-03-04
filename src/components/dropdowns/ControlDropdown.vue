<template>
	<div class="dropdown d-flex justify-content-center" :class="dropdownPosition">
		<button-constructor
			v-if="useDefaultButton"
			:mainColor="'transparent'"
			:mainClass="'rounded-pill p-1 border-transparent hover-highlight-button text-body border-2 dropstart'"
			:textClass="'d-none'"
			:hasMainIcon="true"
			:mainIcon="`three-dots`"
			:mainIconClass="'icon-opacity-100'"
			:mainIconSize="'1.25rem'"
			:dataBsToggle="'dropdown'"
			:ariaExpanded="false"
		>
		</button-constructor>
		<slot name="new-button"></slot>
		<dropdown-constructor :dropdownObject="dropdownObject" :colorScheme="colorScheme" />
	</div>
</template>
<script setup>
	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'
	import DropdownConstructor from '@/components/constructors/DropdownConstructor.vue'

	// import { router } from '@/helpers'
	import { storeToRefs } from 'pinia'
	const { userCredentials } = storeToRefs(props)
	// const { returnPage } = router

	const props = defineProps({
		colorScheme: {
			type: String,
			required: true,
		},
		userCredentials: {
			type: Object,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		useDefaultButton: {
			type: Boolean,
			default: true,
		},
		dropdownPosition: {
			type: String,
			default: 'dropstart',
		},
	})

	const controlDropdown = [
		{
			label: 'Edit ' + props.type,
			name: 'edit',
			mainIcon: 'pencil-fill',
			// action: () => returnPage('account'),
		},
		{
			label: 'Delete ' + props.type,
			name: 'delete',
			mainIcon: 'trash-fill',

			// action: () => returnPage('account'),
		},
	]

	const dropdownObject = {
		'Control Dropdown': {
			defaults: {
				showGroupName: false,
				mainClass: 'w-100 hover-highlight bg-opacity-50 text-body py-2',
				textClass: 'uppercase-first-letter',
				// textStyle: '/*min-width:31px;*/',
				hasMainIcon: true,
				mainIconSize: '1.15rem',
				mainIconClass: 'ps-1 pe-2',
				mainIconStyle: 'transform: translateY(1px);',
			},
			items: [...controlDropdown],
		},
	}
</script>
