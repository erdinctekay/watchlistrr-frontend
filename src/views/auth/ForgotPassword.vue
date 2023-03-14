<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row g-0 w-100 justify-content-center">
				<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit"> </form-constructor>
			</div>
		</div>
	</section>
</template>

<script setup>
	import FormConstructor from '@/components/_constructors/FormConstructor.vue'
	import { ref } from 'vue'
	import { utils } from '@/helpers'

	const { removeAllSpaces } = utils

	const email = ref('')

	const isFormDisabled = ref(false)

	// form fields
	// prettier-ignore
	const fields = [		
		{ label: 'Email', name: 'email', type: 'email', model: email, disabled: isFormDisabled, inputAction: () => email.value = removeAllSpaces(email.value.toLowerCase()) },
	]

	const submitButton = {
		label: 'Send Reset Email',
		labelClass: 'w-100',
		disabled: isFormDisabled,
	}

	const handleSubmit = async () => {
		isFormDisabled.value = true

		try {
			const data = {
				email: email.value,
			}

			await register(data)
		} catch (error) {
			console.log(error)
		}

		isFormDisabled.value = false
	}
</script>
