<template>
	<header class="position-fixed fixed-top border-1 border-bottom">
		<section class="nav col-12 fixed-to-parent">
			<nav
				:class="`${colorScheme === 'light' ? 'bg-gray-150' : 'bg-gray-800'}`"
				class="navbar navbar-expand-lg p-0 w-100"
			>
				<div class="container-fluid container-fluid-xxl py-2 px-3 px-sm-5 row g-0 m-auto">
					<div class="d-flex flex-column w-100">
						<header-main-row
							v-if="isRouterMounted && currentPage"
							:currentPage="currentPage"
							:colorScheme="colorScheme"
							:toggleColorScheme="toggleColorScheme"
							:returnPage="returnPage"
							:isAuthenticated="isAuthenticated"
							:userCredentials="userCredentials || {}"
						></header-main-row>
						<header-sorting-row
							v-if="isRouterMounted && currentPage.meta.requiresSorting"
							:colorScheme="colorScheme"
						></header-sorting-row>
					</div>
				</div>
			</nav>
		</section>
	</header>
</template>

<script setup>
	import HeaderMainRow from '@/components/headerParts/HeaderMainRow.vue'
	import HeaderSortingRow from '@/components/headerParts/HeaderSortingRow.vue'

	import { router } from '@/helpers'

	import { useAuthStore } from '@/stores/AuthStore'
	import { useRouteStore } from '@/stores/RouteStore'
	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'

	import { storeToRefs } from 'pinia'
	import { ref, onUpdated } from 'vue'

	const { isAuthenticated, userCredentials } = storeToRefs(useAuthStore())

	const { colorScheme } = storeToRefs(useColorSchemeStore())
	const { toggleColorScheme } = useColorSchemeStore()

	const { currentPage } = storeToRefs(useRouteStore())

	const { returnPage, isRouterReady } = router
	const isRouterMounted = ref(false)

	isRouterReady().then(() => {
		isRouterMounted.value = true
	})

	onUpdated(() => {
		document.documentElement.click() // to trigger some ui func about header
	})
</script>
