<template>
	<footer class="border-1 border-top">
		<section class="col-12 py-1" :class="`${colorScheme === 'light' ? 'bg-gray-150' : 'bg-gray-800'}`">
			<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
				<div class="d-flex flex-column justify-content-center align-items-end">
					<span class="small" :class="`${colorScheme === 'light' ? 'text-dark' : 'text-light'}`">
						<b>crafted</b>&nbsp; with ❤️ in istanbul
						<br />
						<div class="d-flex flex-row justify-content-between text-muted">
							<span class="small fst-italic">
								by
								<a
									class="text-decoration-underline cursor-pointer"
									href="https://github.com/erdinctekay"
									target="_blank"
								>
									Erdinc
								</a>
							</span>
							<span class="small fst-italic">—</span>
							<a @click="openModal('credits')" class="small fst-italic text-decoration-underline cursor-pointer">
								see full credits
							</a>
						</div>
					</span>
				</div>
			</div>
		</section>
	</footer>
</template>
<script setup>
	import { storeToRefs } from 'pinia'

	import { useModalStore } from '@/stores/ModalStore'
	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'

	const { colorScheme } = storeToRefs(useColorSchemeStore())

	const { openModal } = useModalStore()
</script>
<style></style>
