<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row g-0 w-100 justify-content-center">
				<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit">
					<!-- <template v-slot:additional-area> -->
					<template #additional-area>
						<form-show-password-toggle ref="passwordToggle" :isFormDisabled="ref(isFormDisabled)" />

						<div class="mt-2 bg-standart opacity-75 rounded-3 px-2 py-3">
							<ul class="small m-0">
								<li>Should have 8 character at least</li>
								<li>Should have 1 uppercase character at least</li>
								<li>Should have 1 lowercase character at least</li>
								<li>Should have 1 special character at least</li>
								<li>Should have 1 number at least</li>
								<li>Passwords should match</li>
							</ul>
						</div>
					</template>
				</form-constructor>
			</div>
		</div>
	</section>
</template>

<script setup>
	import FormConstructor from '@/components/constructors/FormConstructor.vue'
	import FormShowPasswordToggle from '@/components/formParts/FormShowPasswordToggle.vue'
	import { ref, computed, reactive } from 'vue'

	/* will be used as one data object on next versions */
	// const data = reactive({
	// 	currentPassword: currentPassword.value,
	// 	password: password.value,
	// 	confirmPassword: confirmPassword.value,
	// })

	const currentPassword = ref('')
	const password = ref('')
	const confirmPassword = ref('')

	const isFormDisabled = ref(false)
	const passwordToggle = ref()
	const passwordFieldTpe = computed(() => (passwordToggle.value?.showPassword ? 'text' : 'password'))

	// form fields
	// prettier-ignore
	const fields = [
		{ label: 'Current Password', name: 'current-password', type: passwordFieldTpe, model: currentPassword, disabled: isFormDisabled },
		{ label: 'New Password', name: 'password', type: passwordFieldTpe, model: password, disabled: isFormDisabled },
		{ label: 'Confirm New Password', name: 'confirm-password', type: passwordFieldTpe, model: confirmPassword, disabled: isFormDisabled },
	]

	const submitButton = {
		label: 'Change Password',
		labelClass: 'w-100',
		disabled: isFormDisabled,
	}

	const handleSubmit = async () => {
		isFormDisabled.value = true

		try {
			const data = {
				currentPassword: currentPassword.value,
				password: password.value,
				confirmPassword: confirmPassword.value,
			}

			await register(data.value)
		} catch (error) {
			console.log(error)
		}

		isFormDisabled.value = false
	}
</script>
