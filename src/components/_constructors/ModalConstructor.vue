<template>
	<div
		ref="modalRef"
		class="modal fade"
		:data-bs-backdrop="backdrop"
		:data-bs-keyboard="keyboard"
		tabindex="-1"
		aria-hidden="true"
	>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5">{{ item.title.value || item.title }}</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						:disabled="isFormDisabled"
					></button>
				</div>
				<div class="modal-body-wrapper">
					<div class="modal-body py-4">
						<slot></slot>
					</div>
				</div>
				<div class="modal-footer">
					<button-constructor
						data-bs-dismiss="modal"
						:mainColor="'secondary'"
						:mainClass="'rounded-pill px-2 p-1 my-1 text-light'"
						:hasMainIcon="true"
						:textClass="'small'"
						:isDisabled="isFormDisabled"
					>
						Close
					</button-constructor>
					<button-constructor
						v-if="!item.successButton.hide"
						@click="primaryAction"
						:mainColor="'primary'"
						:mainClass="'rounded-pill px-2 p-1 my-1 text-light'"
						:hasMainIcon="true"
						:textClass="'small'"
						:isDisabled="item.successButton.disabled?.value"
					>
						{{ item.successButton.text.value || item.successButton.text }}
					</button-constructor>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup>
	import ButtonConstructor from '@/components/_constructors/ButtonConstructor.vue'

	import { Modal } from 'bootstrap'
	import { ref, onMounted, watch, computed } from 'vue'

	import { useModalStore } from '@/stores/ModalStore'

	const { closeModal } = useModalStore()

	const props = defineProps({
		isModalShowing: {
			type: Boolean,
			required: true,
		},
		item: {
			type: Object,
			required: true,
		},
		isDismissible: {
			type: Boolean,
			default: false,
		},
		triggerModalClose: {
			type: Boolean,
			default: false,
		},
		isFormDisabled: {
			type: Boolean,
			default: false,
		},
	})

	const { item } = props

	const modalRef = ref(null)
	let modalInstance = null

	onMounted(() => {
		let backdrops = document.querySelectorAll('.modal-backdrop')

		modalInstance = new Modal(modalRef.value)

		/* hmr reloads and router related remounts creates new backdrops
		 * (bootstrap only shows one modal but adds backdrop)
		 * there could be a better solution then this contoller
		 * ** SHOULD CHECK LATER **
		 */
		if (backdrops.length > 0) {
			for (let i = 0; backdrops.length > i; i++) {
				const parent = backdrops[i].parentNode
				parent.removeChild(backdrops[i])
			}
		}

		modalInstance.show()

		// update instance on isDismissable value change
		updateModalInstance(modalInstance)

		// listen for closing triggers like form success etc.
		listenClosingTrigger(modalInstance)

		// fix some bs modal style approachs
		bsModalFixes()

		// if first one triggers before modal added to DOM - to ensure
		modalRef.value.addEventListener('shown.bs.modal', openAction)

		// inform the store when modal is closed
		modalRef.value.addEventListener('hidden.bs.modal', closeAction)
	})

	const closeAction = () => {
		closeModal()
	}

	const openAction = () => {
		bsModalFixes()
	}

	const bsModalFixes = () => {
		// remove bs-padding fixer
		let header = document.querySelector('header')
		let body = document.querySelector('body')
		let modal = document.querySelector('.modal')
		let backdrops = document.querySelectorAll('.modal-backdrop')

		let elems = [body, header, modal]

		elems.forEach((el) => {
			el.style.removeProperty('padding-right')
		})

		backdrops.forEach((backdrop) => {
			backdrop.style.cssText +=
				'width: calc(100vw * (1 / var(--zoom-ratio))); height: calc(100vh * (1 / var(--zoom-ratio)))'
		})
	}

	// reactive dismiss config

	const keyboard = computed(() => (props.isDismissible ? true : false))
	const backdrop = computed(() => (props.isDismissible ? true : 'static'))

	const updateModalInstance = (instance) => {
		watch(
			() => props.isDismissible,
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (instance) {
						instance = Modal.getOrCreateInstance(modalRef.value)
						instance._config.backdrop = backdrop.value
						instance._config.keyboard = keyboard.value
					}
				}
			}
		)
	}

	const listenClosingTrigger = (instance) => {
		watch(
			() => props.triggerModalClose,
			(newValue) => {
				if (newValue === true) {
					if (instance) {
						instance.hide()
						closeAction()
					}
				}
			}
		)
	}

	// primary button action
	const primaryAction = async () => {
		console.log('primary action triggered')
		const modal = Modal.getOrCreateInstance(modalRef.value)
		item.successButton.action()
		// 	modal.hide()
		// 	closeAction()
		return
	}
</script>
<style>
	.modal {
		padding-right: 0px !important;
	}

	.modal-content {
		width: 380px !important;
		align-items: center;
		justify-content: center;
	}

	.modal-content > div:not(.modal-body-wrapper) {
		width: 360px !important;
		display: flex;
		align-items: center;
		border: none;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.modal-content .modal-body {
		max-width: 360px !important;
		display: flex;
		border: none;
		align-items: flex-start;
		padding-left: 1.5rem;
		padding-right: 1.5rem;
	}

	.modal-content .modal-body-wrapper {
		width: 100%;
		border-bottom: var(--bs-modal-header-border-width) solid var(--bs-modal-header-border-color);
		border-top: var(--bs-modal-header-border-width) solid var(--bs-modal-header-border-color);
		min-height: 120px;
		display: flex;
		justify-content: center;
	}

	.modal-dialog {
		display: flex;
		justify-content: center;
	}

	[data-bs-theme='dark'] .modal-content {
		box-shadow: 0px 15px 45px rgba(0, 0, 0, 0.2), 0px 5px 15px rgba(0, 0, 0, 0.3);
	}

	[data-bs-theme='light'] .modal-content {
		box-shadow: 0px 15px 45px rgba(0, 0, 0, 0.1), 0px 5px 15px rgba(0, 0, 0, 0.15);
	}
</style>
