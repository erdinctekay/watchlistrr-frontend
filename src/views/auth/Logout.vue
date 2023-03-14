<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row g-0 w-100 justify-content-center">
				<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit">
					<!-- <template v-slot:additional-area> -->
					<template #additional-area>
						<p class="lead fw-bold">Are you sure to logout?</p>
					</template>
				</form-constructor>
			</div>
		</div>
	</section>
</template>

<script setup>
	import FormConstructor from '@/components/_constructors/FormConstructor.vue'
	import { ref } from 'vue'
	import { useAuthStore } from '@/stores/AuthStore'

	const { logout } = useAuthStore()

	const isFormDisabled = ref(false)

	// form fields
	const fields = []

	const submitButton = {
		label: 'Logout',
		labelClass: 'text-uppercase fs-5 py-2 fw-bold w-100',
		disabled: isFormDisabled,
	}

	const handleSubmit = async () => {
		isFormDisabled.value = true

		try {
			await logout()
		} catch (error) {
			console.log(error)
		}

		isFormDisabled.value = false
	}
</script>
