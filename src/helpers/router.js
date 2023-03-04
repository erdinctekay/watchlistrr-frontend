import router from '@/router'

export const returnPage = (page) => {
	router.push({ name: page })
}

export const routerReadyCallback = async () => {
	await new Promise((resolve, reject) => {
		router.isReady().then(() => {
			// console.log('callback: router ready')
			resolve()
		})
	})
}

let newPageValue = null

export const pageChangedCallback = async () => {
	await new Promise((resolve, reject) => {
		if (newPageValue) {
			resolve()
		} else {
			const checkPageValue = setInterval(() => {
				if (newPageValue) {
					clearInterval(checkPageValue)
					resolve()
				}
			}, 100)
		}
	})

	// console.log('resolving ' + newPageValue.name)
	newPageValue = null
}

export const newPageInformer = (to) => {
	newPageValue = to
}
