<template>
	<div :class="`${mainClass}`"></div>
</template>
<script setup>
	const props = defineProps({
		mainClass: {
			type: String,
			required: true,
		},
	})
</script>
