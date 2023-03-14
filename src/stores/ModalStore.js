import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useModalStore = defineStore('modal', () => {
	// core setup

	const currentModal = ref(null)
	const isModalShowing = ref(null)
	const currentModalData = ref(null)

	const openModal = (modalName, data = null) => {
		currentModal.value = modalName
		isModalShowing.value = true
		if (data) currentModalData.value = data
	}

	const closeModal = () => {
		currentModal.value = null
		isModalShowing.value = false
		currentModalData.value = null
	}

	return { openModal, closeModal, isModalShowing, currentModal, currentModalData }
})
