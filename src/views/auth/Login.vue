<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row g-0 w-100 justify-content-center">
				<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit">
					<template #before-form>
						<div class="d-flex flex-row g-0 w-100 justify-content-between">
							<h2 class="fs-5">LOGIN</h2>
							<span class="small text-end">
								Don't you have an account?
								<br />
								<a
									@click.stop="returnPage('register')"
									class="hover-highlight-button text-body cursor-pointer text-decoration-none"
								>
									Register
								</a>
								instead.
							</span>
						</div>
					</template>
					<template #additional-area>
						<form-show-password-toggle ref="passwordToggle" :isFormDisabled="ref(isFormDisabled)" />
					</template>
				</form-constructor>
			</div>
		</div>
	</section>
</template>

<script setup>
	import FormConstructor from '@/components/_constructors/FormConstructor.vue'
	import FormShowPasswordToggle from '@/components/formParts/FormShowPasswordToggle.vue'

	import { ref, computed } from 'vue'

	import { utils } from '@/helpers'
	import { router } from '@/helpers'

	import { useAuthStore } from '@/stores/AuthStore'

	const { login } = useAuthStore()

	const { returnPage } = router
	const { removeAllSpaces } = utils

	const email = ref('')
	const password = ref('')

	const isFormDisabled = ref(false)
	const passwordToggle = ref()
	const passwordFieldTpe = computed(() => (passwordToggle.value?.showPassword ? 'text' : 'password'))

	// form fields
	// prettier-ignore
	const fields = [
		{ label: 'Email', name: 'email', type: 'email', model: email, disabled: isFormDisabled, inputAction: () => email.value = removeAllSpaces(email.value.toLowerCase()) },
		{ label: 'Password', name: 'password', type: passwordFieldTpe, model: password, disabled: isFormDisabled },
	]

	const submitButton = {
		label: 'Login',
		labelClass: 'text-uppercase fs-5 py-2 fw-bold w-100',
		disabled: isFormDisabled,
	}

	const handleSubmit = async () => {
		isFormDisabled.value = true

		try {
			const data = {
				email: email.value,
				password: password.value,
			}

			await login(data)
		} catch (error) {
			console.log(error)
		}

		isFormDisabled.value = false
	}
</script>
