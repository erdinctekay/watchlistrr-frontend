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
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import DropdownConstructor from '@/components/_constructors/DropdownConstructor.vue'

	import { storeToRefs } from 'pinia'

	import { capitalizeWords } from '@/helpers/utils'
	import { deleteAction } from '@/helpers/actions'
	import { shareAction } from '@/helpers/actions'

	import { useModalStore } from '@/stores/ModalStore'
	import { useUserStore } from '@/stores/UserStore'

	const { openModal } = useModalStore()
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
		item: {
			type: Object,
			default: null,
		},
	})

	const { askOnDelete } = storeToRefs(useUserStore())

	const preferredDeleteAction = async () => {
		console.log('clicked DELETE - ask:' + askOnDelete.value)
		if (!askOnDelete?.value) {
			console.log('delete directly')

			let response = await deleteAction(props.type, props.item)

			let success = response.ok
			console.log('success: ' + success)
		} else {
			console.log('open modal')
			openModal(`deleteItem/${props.type}`, props.item)
		}
	}

	const controlDropdown = [
		{
			label: 'Edit ' + props.type,
			name: 'edit',
			mainIcon: 'pencil-fill',
			action: () => openModal(`add${capitalizeWords(props.type)}`, props.item),
		},
		{
			label: 'Delete ' + props.type,
			name: 'delete',
			mainIcon: 'trash-fill',
			action: () => preferredDeleteAction(),
		},
		{
			label: 'Share ' + props.type,
			name: 'share',
			mainIcon: 'share-fill',
			mainIconSize: '1.15rem',
			action: () => shareAction(props.item),
		},
	]

	// movies not editable since fething from TMDB
	if (props.type === 'movie') {
		const itemsToRemove = ['edit', 'share']

		itemsToRemove.forEach((itemName) => {
			const itemIndex = controlDropdown.findIndex((item) => item.name === itemName)
			if (itemIndex > -1) {
				controlDropdown.splice(itemIndex, 1)
			}
		})
	}

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
