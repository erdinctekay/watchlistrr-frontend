<template>
	<the-page v-if="!isLoading" :thePageMountedCallback="thePageMounted"></the-page>
</template>

<script setup>
	import { onMounted, onBeforeMount } from 'vue'
	import { loadUiFunctions } from '@/helpers/ui'
	import { useAuthStore } from '@/stores/AuthStore'
	import { storeToRefs } from 'pinia'
	import ThePage from '@/components/ThePage.vue'

	import { useColorSchemeStore } from '@/stores/ColorSchemeStore'
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

	const thePageMounted = () => {
		// initial delay with "0ms" setTimeout
		setTimeout(() => {
			document.documentElement.click() // to trigger some ui func
			document.querySelector('body').style.opacity = '' // to show body (initial opacity was 0)
		}, 0)
		// console.log('page mounted')
	}
	/** callback from the page - ui funcs **/
</script>

<style scoped></style>
