<template>
	<modal-constructor
		:isModalShowing="isModalShowing"
		:item="item"
		:triggerModalClose="triggerModalClose"
		:isDismissible="true"
	>
		<div class="d-flex flex-column w-100 mx-auto">
			<div
				class="py-1 pb-2 scrollable d-flex flex-column me-n4"
				style="max-height: 480px; overflow-y: auto; overflow-x: hidden"
			>
				<div class="row" style="min-width: 312px">
					<div class="col-md-6">
						<h5 class="mb-3">Frontend</h5>
						<p>
							<strong>Repo:</strong><br />
							<a href="https://github.com/erdinctekay/watchlistrr-frontend/" target="_blank">
								github/watchlistrr-frontend
							</a>
						</p>
						<p><strong>Serve on:</strong><br /><span class="text-muted">Netlify</span></p>
						<p class="mb-0"><strong>Built with:</strong></p>
						<ul class="list-unstyled text-muted">
							<li>vue 3</li>
							<li>vue-router</li>
							<li>pinia</li>
							<li>vite</li>
							<li>firebase</li>
							<li>bootstrap 5</li>
							<li>@popperjs/core</li>
							<li>bootstrap-icons</li>
							<li>diacritic</li>
						</ul>
						<p class="mb-0"><strong>Ext. Services:</strong></p>
						<ul class="list-unstyled text-muted mb-0">
							<li>Firebase Auth</li>
						</ul>
					</div>

					<div class="col-md-6">
						<h5 class="mb-3">Backend</h5>
						<p>
							<strong>Repo:</strong><br />
							<a href="https://github.com/erdinctekay/watchlistrr-fake-backend" target="_blank">
								github/watchlistrr-fake-backend
							</a>
						</p>
						<p>
							<strong>Serve on:</strong><br />
							<span class="text-muted">AWS nginx</span>
						</p>
						<p class="mb-0"><strong>Built with:</strong></p>
						<ul class="list-unstyled text-muted">
							<li>json-server</li>
							<li>lowdb</li>
							<li>express</li>
							<li>firebase-admin</li>
							<li>uuid</li>
							<li>body-parser</li>
							<li>express-rate-limit</li>
							<li>node-fetch</li>
							<li>diacritic</li>
						</ul>
						<p class="mb-0"><strong>Ext. Services:</strong></p>
						<ul class="list-unstyled text-muted mb-0">
							<li>Firebase Admin</li>
							<li>TMDB API</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</modal-constructor>
</template>
<script setup>
	import ModalConstructor from '@/components/_constructors/ModalConstructor.vue'

	const triggerModalClose = false

	const item = {
		title: 'Credits',
		successButton: {
			hide: true,
		},
	}

	const props = defineProps({
		isModalShowing: {
			type: Boolean,
			required: true,
		},
	})
</script>
<style></style>
