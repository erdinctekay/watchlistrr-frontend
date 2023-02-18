import router from '@/router'

export const returnPage = (page) => {
	router.push({ name: page })
}

export const isRouterReady = async () => {
	await new Promise((resolve, reject) => {
		router.isReady().then(() => {
			resolve()
		})
	})
}
