<template>
	<modal-constructor
		:isModalShowing="isModalShowing"
		:isDismissible="!isFormDisabled"
		:item="item"
		:triggerModalClose="triggerModalClose"
	>
		<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit">
			<!-- <template v-slot:additional-area> -->
			<template #before-form>
				<div class="d-flex flex-column">
					<!-- prettier-ignore -->
					<span class="mb-1">
						You are about to delete <b>{{ objectToDelete.title }}</b>.
					</span>
					<span class="mb-1 fw-bold">Are you sure?</span>
				</div>
			</template>

			<template #additional-area>
				<!-- need to replace with toggle input component -->
				<span
					ref="toggle"
					@click="toggleAskOnDelete"
					@keyup.enter="toggleAskOnDelete"
					tabindex="0"
					:class="isFormDisabled ? 'disabled' : ''"
					class="d-flex align-items-center unselectable cursor-pointer w-50 text-contrast form-check form-switch ps-0"
				>
					<input
						v-model="doNotAskOnDelete"
						:disabled="isFormDisabled"
						class="form-check-input m-0 me-2 bg-standart border-transparent"
						role="switch"
						type="checkbox"
						id="inlineCheckbox1"
						tabIndex="-1"
						style="pointer-events: none"
					/>
					<label class="form-check-label fst-italic small" for="inlineCheckbox1" style="pointer-events: none">
						Don't ask again.
					</label>
				</span>
			</template>
		</form-constructor>
	</modal-constructor>
</template>
<script setup>
	import ModalConstructor from '@/components/constructors/ModalConstructor.vue'
	import FormConstructor from '@/components/constructors/FormConstructor.vue'

	import { ref, computed } from 'vue'

	import { deleteAction } from '@/helpers/actions'

	import { useUserStore } from '@/stores/UserStore'
	import { storeToRefs } from 'pinia'

	const isFormDisabled = ref(false)

	const fields = []

	const submitButton = {
		label: 'Delete',
		labelClass: 'text-uppercase fs-5 py-2 fw-bold w-100',
		isHidden: true,
		disabled: isFormDisabled,
	}

	const triggerModalClose = ref(false)

	const handleSubmit = async () => {
		isFormDisabled.value = true
		let success

		try {
			let response = await deleteAction('watchlist', props.objectToDelete)

			success = response.ok
			console.log('success: ' + success)

			if (success) {
				if (askOnDelete.value === doNotAskOnDelete.value) toggleAskOnDeleteStore()

				isFormDisabled.value = false
				triggerModalClose.value = true
			}
		} catch (error) {
			console.log(error)
		}
	}

	const { askOnDelete } = storeToRefs(useUserStore())
	const { toggleAskOnDeleteStore } = useUserStore()
	const doNotAskOnDelete = ref(false)

	const toggleAskOnDelete = () => {
		if (!isFormDisabled.value) doNotAskOnDelete.value = !doNotAskOnDelete.value
		console.log(doNotAskOnDelete.value)
		console.log(askOnDelete.value)
	}

	const item = {
		title: computed(() => `Delete ` + props.type),
		successButton: {
			disabled: computed(() => {
				return isFormDisabled.value

				// will be enabled after validation feature
				if (isFormDisabled.value || !isFormValid.value) {
					return true
				}
			}),
			text: 'Delete',
			action: () => handleSubmit(),
		},
	}

	const props = defineProps({
		isModalShowing: {
			type: Boolean,
			required: true,
		},
		objectToDelete: {
			type: Object,
			default: null,
		},
		type: {
			type: String,
			required: true,
		},
	})
</script>
<style>
	[data-bs-theme='light'] span input {
		opacity: 0.7;
		transition: opacity 0.15s ease-in-out, background-position 0.15s ease-in-out, background-color 0.15s ease-in-out;
	}

	[data-bs-theme='dark'] span input {
		opacity: 0.75;
		transition: opacity 0.15s ease-in-out, background-position 0.15s ease-in-out;
	}

	[data-bs-theme='light'] span label {
		opacity: 0.6;
		transition: opacity 0.15s ease-in-out;
	}

	[data-bs-theme='dark'] span label {
		opacity: 0.65;
		transition: opacity 0.15s ease-in-out;
	}

	span:not(.disabled):hover input,
	span:not(.disabled):focus input {
		opacity: 1;
		background-color: rgba(var(--bs-gray-650-rgb), 1) !important;
		transition: opacity 0.15s ease-in-out, background-position 0.15s ease-in-out;
	}

	[data-bs-theme='light'] span:not(.disabled):hover input,
	[data-bs-theme='light'] span:not(.disabled):focus input {
		opacity: 0.8;
		background-color: rgba(var(--bs-hover-highlight-color-rgb), 1) !important;
		transition: opacity 0.15s ease-in-out, background-position 0.15s ease-in-out, background-color 0.15s ease-in-out;
	}

	span:not(.disabled):hover label,
	span:not(.disabled):focus label {
		opacity: 1;
		transition: opacity 0.15s ease-in-out;
	}

	span:not(.disabled):hover input:checked,
	span:not(.disabled):focus input:checked {
		background-color: var(--bs-primary) !important;
		opacity: 1;
		transition: opacity 0.15s ease-in-out, background-position 0.15s ease-in-out;
	}

	span input:checked {
		background-color: var(--bs-primary) !important;
		opacity: 0.8;
		transition: opacity 0.15s ease-in-out, background-position 0.15s ease-in-out;
	}
</style>
