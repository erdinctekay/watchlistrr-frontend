<template>
	<main style="min-height: 100vh">
		<!-- <section class="col-12">
			<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
				<div class="d-flex flex-row justify-content-between align-items-center my-5">
					<div class="w-auto">
						<p class="m-0">{{ authStatus }}</p>
					</div>
					<div class="w-auto">
						<router-link v-if="authStatus === 'Authenticated'" :to="{ name: 'logout' }" class="btn btn-secondary">
							Logout
						</router-link>
						<router-link v-else :to="{ name: 'login' }" class="btn btn-secondary">Login</router-link>
					</div>
				</div>
				<div class="row">
					<p class="small text-break">{{ userDetails }}</p>
				</div>
			</div>
		</section> -->
		<router-view />
	</main>
</template>
<script setup>
	import { computed } from 'vue'
	import { storeToRefs } from 'pinia'
	import { useAuthStore } from '@/stores/AuthStore'

	const { isAuthenticated, userCredentials } = storeToRefs(useAuthStore())
	const authStatus = computed(() => (isAuthenticated.value ? 'Authenticated' : 'Not Authenticated'))
</script>
<style></style>
