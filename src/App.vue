<template>
	<the-page v-if="!isLoading" :thePageMountedCallback="isPageMounted"></the-page>
</template>

<script setup>
	import ThePage from '@/components/ThePage.vue'

	import { onMounted, onBeforeMount, ref } from 'vue'
	import { storeToRefs } from 'pinia'

	import { useAuthStore } from '@/stores/AuthStore'
	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'

	import { Popover } from 'bootstrap'
	import { router } from '@/helpers'
	import { loadUiFunctions, enablePopovers } from '@/helpers/ui'

	const { colorScheme } = storeToRefs(useColorSchemeStore())

	const body = document.querySelector('body')
	const html = document.querySelector('html')

	onBeforeMount(() => {
		body.className = 'bg-' + colorScheme.value
		html.setAttribute('data-bs-theme', colorScheme.value)
	})

	/** reactive auth state start **/
	const { isFetching: isLoading } = storeToRefs(useAuthStore())
	// useAuthStore().isAuthenticated

	/** reactive auth state end **/

	/** callback from the page - ui funcs **/
	onMounted(() => {
		loadUiFunctions()
		// console.log('app mounted')
	})

	// step by step contollers started
	const { routerReadyCallback, pageChangedCallback } = router
	const isRouterMounted = ref(false)
	const isPageChanged = ref(false)

	const isPageMounted = async () => {
		// console.log('page mounted')

		routerReadyCallback().then(async () => {
			isRouterMounted.value = true
			// console.log('router ready')
		})

		pageChangedCallback().then(() => {
			isPageChanged.value = true
			// console.log('page change ready')
		})

		// jobs to do when new page fully setted
		const syncUi = () => {
			document.documentElement.click() // to trigger some ui func
			document.querySelector('body').style.opacity = '' // to show body (initial opacity was 0)
			enablePopovers(Popover) // detect popovers on new page

			isRouterMounted.value = false
			isPageChanged.value = false
			// console.log('ui synced and router flag removed')
		}

		const isPageFullySet = async () => {
			await new Promise((resolve) => {
				if (isRouterMounted.value && isPageChanged.value) {
					resolve()
				} else {
					const checkRouter = setInterval(() => {
						if (isRouterMounted.value && isPageChanged.value) {
							clearInterval(checkRouter)
							resolve()
						}
					}, 100)
				}
			})
		}

		// update some ui functionality when everything is ready
		await isPageFullySet()
		syncUi()
	}
	/** callback from the page - ui funcs **/
</script>

<style scoped></style>
