<template>
	<span style="padding-top: 3px" :style="{ width: `${IconWidth}px` }">
		<span class="d-flex hover-highlight-icon align-items-center w-100 justify-content-end m-n1">
			<i
				@click.stop.prevent=""
				class="bi bi-eye-slash-fill filled-icon p-1 me-n1 cursor-pointer"
				style="font-size: 1rem"
				data-bs-toggle="popover"
				data-bs-trigger="hover"
				data-bs-placement="bottom"
				data-bs-content="This watchlist is private to you 
                    and isn't visible for other users."
			></i>
		</span>
	</span>
</template>
<script setup>
	import { Popover } from 'bootstrap'
	import { onMounted } from 'vue'

	import { enablePopovers } from '@/helpers/ui'

	const props = defineProps({
		IconWidth: {
			type: Number,
			default: 36,
		},
	})

	onMounted(() => {
		enablePopovers(Popover)
	})
</script>
