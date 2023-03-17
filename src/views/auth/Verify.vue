<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-row g-0 w-100 justify-content-center">
				<div class="mt-3" style="width: 320px">
					<h3 class="text-center mb-3 fw-bold fst-italic pe-2">
						{{ userCredentials.displayName?.split(' ')[0] }}, <span class="text-nowrap">one last step...</span>
					</h3>

					<div class="px-4 py-4 rounded-5 bg-standart" style="min-width: inherit">
						<div class="py-2">
							<p class="mb-3">
								To become a <span class="fst-italic">watchlistrr</span>,<br />
								<span class="" style="font-weight: 500">please verify your email address:</span>
							</p>

							<!--dropdown class for quick patch styling-->
							<div class="dropdown mb-1">
								<div class="form-floating w-100">
									<input
										:value="userCredentials?.email"
										class="form-control pe-none rounded-2 pt-4 py-3 btn-standart hover-none border-transparent ps-4 fw-bold"
										style="min-height: 4.5rem !important"
										name="email"
										readonly
									/>
									<label class="d-flex align-items-center ps-4" for="email">Email</label>
								</div>
							</div>
							<div class="d-flex justify-content-end pt-4 mb-n1">
								<button-constructor
									@click="returnPage('logout')"
									:mainColor="'secondary'"
									:mainClass="'rounded-pill px-2 p-1 my-1 text-light'"
									:hasMainIcon="true"
									:textClass="'small'"
								>
									Logout
								</button-constructor>
								<button-constructor
									@click="verify()"
									:mainColor="'primary'"
									:mainClass="'rounded-pill px-2 p-1 my-1 text-light ms-2 fw-bold'"
									:hasMainIcon="true"
									:textClass="'small'"
								>
									Verified!
								</button-constructor>
							</div>
						</div>
					</div>
					<p class="small my-3 mt-4 text-center">
						<b class="fst-italic">Didn't receive the email?</b> <br />
						Check your spam folder or click
						<a class="text-decoration-underline cursor-pointer" @click="resendVerificationEmail()">resend</a>.
					</p>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import { router } from '@/helpers'
	import { useAuthStore } from '@/stores/AuthStore'

	const { userCredentials, resendVerificationEmail } = useAuthStore()
	const { returnPage } = router

	const verify = () => location.reload()
</script>
