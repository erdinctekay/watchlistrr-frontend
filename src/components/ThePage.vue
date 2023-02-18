<template>
	<the-header />
	<the-main />
	<the-footer />
</template>

<script setup>
	import TheHeader from '@/components/ThePageParts/TheHeader.vue'
	import TheMain from '@/components/ThePageParts/TheMain.vue'
	import TheFooter from '@/components/ThePageParts/TheFooter.vue'
	import { onMounted } from 'vue'

	const props = defineProps({
		thePageMountedCallback: {
			type: Function,
			required: true,
		},
	})

	onMounted(() => {
		props.thePageMountedCallback()
	})
</script>

<style scoped></style>
