<template>
	<!-- prettier-ignore -->
	<span 
		@click="togglePasswordVisibility" 
		@keyup.enter="togglePasswordVisibility" 
		tabindex="0" 
        :class="isFormDisabled.value ? 'disabled' : ''"
		class="d-flex align-items-center unselectable cursor-pointer w-50 text-contrast form-check form-switch ps-0">
            <input
                v-model="showPassword" :disabled="isFormDisabled.value"
                class="form-check-input m-0 me-2 bg-standart border-transparent" role="switch" type="checkbox" id="inlineCheckbox1"
                tabIndex="-1" style="pointer-events: none;"
            />
		    <label class="form-check-label fst-italic small " for="inlineCheckbox1" style="pointer-events: none;">Show password</label>
        </span>
</template>
<script setup>
	import { ref } from 'vue'

	const props = defineProps({
		isFormDisabled: {
			type: Object,
			required: true,
		},
	})

	const showPassword = ref(false)

	const togglePasswordVisibility = () => {
		if (!props.isFormDisabled.value) showPassword.value = !showPassword.value
	}

	defineExpose({
		showPassword,
	})
</script>

<style scoped>
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
