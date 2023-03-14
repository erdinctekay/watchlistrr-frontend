<template>
	<section class="col-12 my-4">
		<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
			<div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 80vh">
				<h1 class="fw-bold">404</h1>
				<quote class="h4 fst-italic fw-normal mb-1">"Houston, we have a problem..."</quote>
				<span class="h4 mb-5">This page is lost in space.</span>
				<button-constructor
					@click="returnPage('home')"
					:mainColor="'primary'"
					:mainClass="'rounded-pill py-1'"
					:textStyle="'font-weight:500;'"
				>
					Return Home
				</button-constructor>
			</div>
		</div>
	</section>
</template>

<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'
	import { router } from '@/helpers'

	const { returnPage } = router
</script>

<style></style>
