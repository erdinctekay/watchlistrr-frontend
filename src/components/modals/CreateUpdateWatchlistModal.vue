<template>
	<modal-constructor
		:isModalShowing="isModalShowing"
		:isDismissible="!isFormDisabled"
		:isFormDisabled="isFormDisabled"
		:item="item"
		:triggerModalClose="triggerModalClose"
	>
		<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit">
			<!-- <template v-slot:additional-area> -->
			<template #additional-area>
				<!-- need to replace with toggle input component -->
				<span
					ref="toggle"
					@click="toggleWatchlistPrivacy"
					@keyup.enter="toggleWatchlistPrivacy"
					tabindex="0"
					:class="isFormDisabled ? 'disabled' : ''"
					class="d-flex align-items-center unselectable cursor-pointer w-50 text-contrast form-check form-switch ps-0"
				>
					<input
						v-model="isPrivate"
						:disabled="isFormDisabled"
						class="form-check-input m-0 me-2 bg-standart border-transparent"
						role="switch"
						type="checkbox"
						id="inlineCheckbox1"
						tabIndex="-1"
						style="pointer-events: none"
					/>
					<label class="form-check-label fst-italic small" for="inlineCheckbox1" style="pointer-events: none">
						Private watchlist
					</label>
				</span>
			</template>
		</form-constructor>
	</modal-constructor>
</template>
<script setup>
	import ModalConstructor from '@/components/_constructors/ModalConstructor.vue'
	import FormConstructor from '@/components/_constructors/FormConstructor.vue'

	import { ref, computed, onMounted } from 'vue'

	import { watchlist } from '@/services/backend/'

	import { utils } from '@/helpers'
	import { router } from '@/helpers'

	import { useWatchlistStore } from '@/stores/WatchlistStore'

	const { updateWatchlistDataById, refetchWatchlists } = useWatchlistStore()

	const { normalizeSpacing, sanitize } = utils

	const title = ref('')
	const isPublic = ref(true)
	const isPrivate = computed(() => !isPublic.value)
	const isEditing = ref(null)

	const isFormDisabled = ref(false)

	// form fields
	// prettier-ignore
	const fields = [
		{ label: 'Watchlist Title', name: 'title', type: 'text', model: title, disabled: isFormDisabled, inputAction: () => title.value = normalizeSpacing(sanitize(title.value)) },
	]

	const submitButton = {
		label: 'Save',
		labelClass: 'text-uppercase fs-5 py-2 fw-bold w-100',
		isHidden: true,
		disabled: isFormDisabled,
	}

	const triggerModalClose = ref(false)

	const handleSubmit = async () => {
		isFormDisabled.value = true
		let success

		try {
			const data = {
				title: title.value,
				public: isPublic.value,
			}

			let response
			if (isEditing.value) {
				// if change really made?
				if (data.title === props.objectToEdit.title && data.public === props.objectToEdit.public) return

				response = await watchlist.patch(data, props.objectToEdit.id)
				if (response.ok) {
					const { title, public: isPublic, ...rest } = props.objectToEdit

					// update store data with new values
					const newObject = { title: data.title, public: data.public, ...rest }
					updateWatchlistDataById(newObject)
				}
			} else {
				response = await watchlist.create(data)
			}

			success = response.ok
			console.log('success: ' + success)
		} catch (error) {
			console.log(error)
		}

		if (success) {
			if (!isEditing.value) refetchWatchlists()
			isFormDisabled.value = false
			triggerModalClose.value = true
		}

		// release modal even if no success
		setTimeout(() => {
			/* add some delay for awareness
			 ** since we are not using any error notify */
			isFormDisabled.value = false
		}, 650)
	}

	const { returnPage } = router

	const toggleWatchlistPrivacy = () => {
		if (!isFormDisabled.value) isPublic.value = !isPublic.value
	}

	const isFormValid = computed(() => title.value.length >= 5)

	const item = {
		title: computed(() => (isEditing.value ? 'Edit watchlist' : 'Add new watchlist')),
		successButton: {
			disabled: computed(() => {
				if (isFormDisabled.value || !isFormValid.value) {
					return true
				}
			}),
			text: computed(() => `${isEditing.value ? 'Save' : 'Create'}`),
			action: () => handleSubmit(),
		},
	}

	const props = defineProps({
		isModalShowing: {
			type: Boolean,
			required: true,
		},
		objectToEdit: {
			type: Object,
			default: null,
		},
	})

	onMounted(() => {
		if (props.objectToEdit) {
			const item = props.objectToEdit

			title.value = item.title
			isPublic.value = item.public
			isEditing.value = true
			return
		}
		return (isEditing.value = false)
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
