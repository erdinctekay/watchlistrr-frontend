<template>
	<!-- prettier-ignore -->
	<modal-constructor
		:isModalShowing="isModalShowing"
		:item="item"
		:triggerModalClose="triggerModalClose"
        :isDismissible="true"
	>
		<div class="d-flex flex-column">
            <span class="mb-3">Please login to perform this action.</span>
			<span class="small fst-italic"> 
                If you do not have an account,
                <br> 
                You can 
                <a
                    @click.stop="redirectAction('register')"
                    class="hover-highlight-button text-body fst-normal cursor-pointer text-decoration-none"
                >
                    register
                </a>
                instead. 
            </span>
		</div>
	</modal-constructor>
</template>
<script setup>
	import ModalConstructor from '@/components/_constructors/ModalConstructor.vue'

	import { computed, ref } from 'vue'

	import { router } from '@/helpers'

	const triggerModalClose = ref(false)

	const { returnPage } = router

	const redirectAction = (page) => {
		triggerModalClose.value = true
		returnPage(page)
	}

	const item = {
		title: computed(() => 'Not Authorized'),
		successButton: {
			disabled: computed(() => {
				return false
			}),
			text: 'Login',
			action: () => redirectAction('login'),
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
