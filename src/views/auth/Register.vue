<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row g-0 w-100 justify-content-center">
				<form-constructor :fields="fields" :submitButton="submitButton" @submit="handleSubmit">
					<template #before-form>
						<div class="d-flex flex-row g-0 w-100 justify-content-between">
							<h2 class="fs-5">REGISTER</h2>
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
							<ul class="password-check small m-0 px-3 list-unstyled">
								<li
									v-for="req in validatePassword()"
									:class="{ 'text-muted': req.isMet, 'text-body': !req.isMet }"
									:style="{ 'text-decoration': req.isMet ? 'line-through' : 'none' }"
								>
									{{ req.text }}
								</li>
							</ul>
						</div>
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

	const { register } = useAuthStore()

	const { returnPage } = router
	const { removeAllSpaces, normalizeSpacing, capitalizeWords, sanitize, limitMaxLength, limitWordLength } = utils

	const fullName = ref('')
	const email = ref('')
	const password = ref('')
	const confirmPassword = ref('')

	const isFormDisabled = ref(false)
	const passwordToggle = ref()
	const passwordFieldTpe = computed(() => (passwordToggle.value?.showPassword ? 'text' : 'password'))

	const isNameOkay = computed(() => fullName.value.length >= 3)
	const isPasswordOkay = ref(false)
	const isEmailOkay = ref(false)

	const isFormValid = computed(() => isNameOkay.value && isPasswordOkay.value && isEmailOkay.value)

	// form fields
	// prettier-ignore
	const fields = [
		{ label: 'Display Name', name: 'full-name', type: 'text', model: fullName, disabled: isFormDisabled, inputAction: () => fullName.value = limitMaxLength(limitWordLength(normalizeSpacing(capitalizeWords(sanitize(fullName.value.toLowerCase())))), 30) },
		{ label: 'Email', name: 'email', type: 'email', model: email, disabled: isFormDisabled, inputAction: () => validateEmail(), blurAction: () => formatEmail() },
		{ label: 'Password', name: 'password', type: passwordFieldTpe, model: password, disabled: isFormDisabled, inputAction: () => validatePassword() },
		{ label: 'Confirm Password', name: 'confirm-password', type: passwordFieldTpe, model: confirmPassword, disabled: isFormDisabled, inputAction: () => validatePassword() },
	]

	const submitButton = {
		label: 'Register',
		labelClass: 'text-uppercase fs-5 py-2 fw-bold w-100',
		disabled: computed(() => {
			if (isFormDisabled.value || !isFormValid.value) {
				return true
			}
		}),
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

	const formatEmail = () => {
		email.value = removeAllSpaces(email.value.toLowerCase())
	}

	const validateEmail = () => {
		formatEmail()

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		const emailValue = email.value

		const isEmailValid = emailRegex.test(emailValue)

		isEmailOkay.value = isEmailValid
	}

	const validatePassword = () => {
		const allowedSpecialChars = '\u0021\u0023\u0024\u0025\u002a\u002b\u002c\u002d\u002e\u003f\u0040\u005e\u005f'

		const passwordRegex = new RegExp(
			`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${allowedSpecialChars}])[A-Za-z\\d${allowedSpecialChars}]{8,}$`
		)
		const passwordValue = password.value
		const confirmPasswordValue = confirmPassword.value

		// Check if password matches confirm password
		const isMatched =
			passwordValue === confirmPasswordValue &&
			passwordRegex.test(passwordValue) &&
			passwordRegex.test(confirmPasswordValue)

		// prettier-ignore
		const requirements = [
			{ text: 'Should have 8 characters at least', isMet: passwordValue.length >= 8 },
			{ text: 'Should have 1 uppercase character at least', isMet: /[A-Z]/.test(passwordValue) },
			{ text: 'Should have 1 lowercase character at least', isMet: /[a-z]/.test(passwordValue) },
	      		{ text: 'Should have 1 special character at least', isMet: new RegExp(`[${allowedSpecialChars}]`).test(passwordValue) },
			{ text: 'Should have 1 number at least', isMet: /\d/.test(passwordValue) },
			{ text: 'Passwords should match', isMet: isMatched },
		]

		// Check if all requirements are met
		const allRequirementsMet = requirements.every((req) => req.isMet)
		isPasswordOkay.value = allRequirementsMet

		return requirements
	}
</script>
<style>
	[data-bs-theme='dark'] ul.password-check li.text-body {
		--bs-body-color: var(--bs-white) !important;
		--bs-body-color-rgb: var(--bs-white-rgb) !important;
	}

	[data-bs-theme='light'] ul.password-check li.text-body {
		--bs-body-color: var(--bs-black) !important;
		--bs-body-color-rgb: var(--bs-black-rgb) !important;
	}
</style>
