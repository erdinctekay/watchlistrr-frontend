<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row g-0 w-100 justify-content-center">
				<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit">
					<template #before-form>
						<div class="d-flex flex-row g-0 w-100 justify-content-between">
							<h2 class="fs-5">LOGIN</h2>
							<span class="small text-end">
								Do you have an account?
								<br />
								<a
									@click.stop="returnPage('login')"
									class="hover-highlight-button text-body cursor-pointer text-decoration-none"
								>
									Login
								</a>
								instead.
							</span>
						</div>
					</template>
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

	import { ref, computed } from 'vue'

	import { utils } from '@/helpers'
	import { router } from '@/helpers'

	import { useAuthStore } from '@/stores/AuthStore'

	const { register } = useAuthStore()

	const { returnPage } = router
	const { removeAllSpaces, normalizeSpacing, capitalizeWords } = utils

	const fullName = ref('')
	const email = ref('')
	const password = ref('')
	const confirmPassword = ref('')

	const isFormDisabled = ref(false)
	const passwordToggle = ref()
	const passwordFieldTpe = computed(() => (passwordToggle.value?.showPassword ? 'text' : 'password'))

	// form fields
	// prettier-ignore
	const fields = [
		{ label: 'Full Name', name: 'full-name', type: 'text', model: fullName, disabled: isFormDisabled, inputAction: () => fullName.value = normalizeSpacing(capitalizeWords(fullName.value.toLowerCase())) }, // class can be added //
		{ label: 'Email', name: 'email', type: 'email', model: email, disabled: isFormDisabled, inputAction: () => email.value = removeAllSpaces(email.value.toLowerCase()) },
		{ label: 'Password', name: 'password', type: passwordFieldTpe, model: password, disabled: isFormDisabled },
		{ label: 'Confirm Password', name: 'confirm-password', type: passwordFieldTpe, model: confirmPassword, disabled: isFormDisabled },
	]

	const submitButton = {
		label: 'Register',
		labelClass: 'text-uppercase fs-5 py-2 fw-bold w-100',
		disabled: isFormDisabled,
	}

	const handleSubmit = async () => {
		isFormDisabled.value = true

		try {
			const data = {
				fullName: fullName.value,
				email: email.value,
				password: password.value,
				confirmPassword: confirmPassword.value,
			}

			await register(data)
		} catch (error) {
			console.log(error)
		}

		isFormDisabled.value = false
	}
</script>
