<template>
	<button-constructor
		@click="clickAction()"
		:mainColor="'primary'"
		:mainClass="`w-100 ${isAttachedModal ? 'me-3 mt-4' : 'w-sm-25'} fw-bold ${isDisabled ? 'disabled' : ''}`"
		:textClass="'w-100'"
	>
		<span v-if="isDisabled"> LOADING </span>
		<span v-else>LOAD MORE</span>
	</button-constructor>
</template>
<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'

	const props = defineProps({
		clickAction: {
			type: Function,
			required: true,
		},
		isDisabled: {
			type: Boolean,
			required: true,
		},
		isAttachedModal: {
			type: Boolean,
			default: false,
		},
	})
</script>
