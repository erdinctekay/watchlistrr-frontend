import { defineStore } from 'pinia'
import { ref, watch, onBeforeMount, nextTick } from 'vue'

export const useColorSchemeStore = defineStore('colorScheme', () => {
	// core setup

	const colorScheme = ref('')

	const toggleColorScheme = async () => {
		colorScheme.value = colorScheme.value === 'light' ? 'dark' : 'light'

		// wait till job done
		await nextTick()

		// remove button focus
		if (document.activeElement.tagName === 'BUTTON') {
			document.activeElement.blur()
		}
	}

	const decideColorScheme = (matches) => {
		colorScheme.value = matches ? 'dark' : 'light'
	}

	/* controllers start */

	const savedColorScheme = ref('')
	const queryColorScheme = window.matchMedia('(prefers-color-scheme: dark)')

	savedColorScheme.value = localStorage.getItem('colorScheme')

	onBeforeMount(() => {
		// check if user attached preference to local storage
		if (!savedColorScheme.value) {
			// if local storage empty
			decideColorScheme(queryColorScheme.matches)
		} else {
			// else go with local storage
			colorScheme.value = savedColorScheme.value
		}
	})

	/* controllers end */

	/* listeners start */

	queryColorScheme.addEventListener('change', (e) => {
		decideColorScheme(e.matches)
		// console.log('changed')
	})

	// - define dom elements
	const body = document.querySelector('body')
	const html = document.querySelector('html')

	watch(colorScheme, (newValue) => {
		body.className = 'bg-' + newValue
		html.setAttribute('data-bs-theme', newValue)
		localStorage.setItem('colorScheme', newValue)
	})

	/* listeners end */

	return { colorScheme, decideColorScheme, toggleColorScheme }
})
