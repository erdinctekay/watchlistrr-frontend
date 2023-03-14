<template>
	<button-constructor
		@click="clickAction()"
		:mainColor="'primary'"
		:mainClass="'w-100 w-sm-25 fw-bold'"
		:textClass="'w-100'"
	>
		LOAD MORE
	</button-constructor>
</template>
<script setup>
	import ButtonConstructor from '@/components/constructors/ButtonConstructor.vue'

	const props = defineProps({
		clickAction: {
			type: Function,
			required: true,
		},
	})
</script>
