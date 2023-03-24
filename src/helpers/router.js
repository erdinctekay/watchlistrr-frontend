import router from '@/router'

export const routerReadyCallback = async () => {
	await new Promise((resolve, reject) => {
		router.isReady().then(() => {
			// console.log('callback: router ready')
			resolve()
		})
	})
}

export let newPageValue = null

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

let currentId
let lastPageName

export const newPageInformer = (to) => {
	newPageValue = to

	lastPageName = to.name
	currentId = to.params.id
}

export const returnPage = (pageName, id) => {
	// console.log('page change function triggered')
	if (id) {
		// do not reload same page without force
		if (id === currentId) return

		return router.push({ name: pageName, params: { id: id } })
	} else {
		// do not reload same page without force
		if (lastPageName === pageName) return

		router.push({ name: pageName })
	}
}

export const getUrl = (pageName, id) => {
	const route = router.resolve({
		name: pageName,
		params: {
			id: id,
		},
	})

	return route.href
}
