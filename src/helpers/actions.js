import { watchlist, user, movie } from '@/services/backend/'
import { useWatchlistStore } from '@/stores/WatchlistStore'
import { useMovieStore } from '@/stores/MovieStore'
import { useUserStore } from '@/stores/UserStore'
import { storeToRefs } from 'pinia'

export const deleteAction = async (type, item) => {
	console.log('delete ' + type)
	let response

	try {
		const { updateWatchlistDataById } = useWatchlistStore()

		if (type === 'watchlist') {
			response = await watchlist.remove(item.id)
			if (response.ok) {
				// update store data
				updateWatchlistDataById(item, 'delete')
			}
		} else {
			const { updateMovieDataById } = useMovieStore()
			const { routerWatchlistId } = storeToRefs(useMovieStore())

			console.log(item)

			response = await movie.removeFromWatchlist(item.joinId)
			if (response.ok) {
				// update store data
				updateMovieDataById(item, 'delete')
				// update watchlist data
				const getWatchlist = await watchlist.get(routerWatchlistId.value)

				if (getWatchlist.ok) {
					const watchlistData = await getWatchlist.json()
					updateWatchlistDataById(watchlistData)
				}
			}
		}

		return response
	} catch (error) {
		console.log(error)
	}
}

let isToggling = false
export const toggleInteraction = async (interaction, interactionId, itemId, userId) => {
	if (isToggling) return
	isToggling = true
	console.log('toggle started')

	let response
	let body
	let itemIdType

	switch (interaction) {
		case 'likes':
		case 'watchs':
			body = { movieId: itemId }
			itemIdType = 'movie'
			break

		case 'favs':
		case 'follows':
			body = { watchlistId: itemId }
			itemIdType = 'watchlist'
			break
	}

	try {
		response = await user.makeInteraction(interaction, interactionId, body)
		if (response.ok) {
			// first sync manually and remove toggling flag
			const { updateInteractionStore } = useUserStore()
			let result = await updateInteractionStore(interaction, interactionId, itemId, itemIdType, userId)
			console.log(interaction + ' done - pending id')
			if (result) {
				// release button
				isToggling = false

				// get related interaction data from db first
				const { getInteractionByType } = useUserStore()
				await getInteractionByType(userId, interaction)
				console.log(interaction + ' id retrieved from db')

				// then try to catch db
				await syncInteractionsStore(userId, itemId, itemIdType)
				console.log('all interactions synced with db')
			}
		}

		return response
	} catch (error) {
		isToggling = false
		console.log(error)
	}
}

const syncInteractionsStore = async (userId, itemId, itemIdType) => {
	const { getAllInteractions } = useUserStore()

	// update store data
	await getAllInteractions(userId)

	if (itemIdType === 'watchlist') {
		await syncWatchlistChanges(itemId)
	}
}

export const syncWatchlistChanges = async (itemId) => {
	const { updateWatchlistDataById } = useWatchlistStore()

	// try full sync with db
	const response = await watchlist.get(itemId)
	if (response.ok) {
		let item = await response.json()

		console.log(item)
		// update store data
		updateWatchlistDataById(item)
	}
}

const baseUrl = window.location.origin

export const shareAction = async (item) => {
	const shareData = {
		title: `${item.title} | Watchlistrr`,
		text: `Look this watchlist I found at watchlistrr! — ${item.title}`,
		url: `${baseUrl}/watchlist/${item.id}`,
	}
	if (navigator.share) {
		try {
			await navigator.share(shareData)
		} catch (error) {
			console.error('Error sharing:', error)
			copyUrl(shareData.url)
		}
	} else {
		copyUrl(shareData.url)
	}
}

const copyUrl = async (url) => {
	const textarea = document.createElement('textarea')
	textarea.style.position = 'absolute'
	textarea.style.left = '-9999px'
	textarea.style.opacity = '0'
	textarea.value = url
	document.body.appendChild(textarea)
	textarea.select()
	document.execCommand('copy')
	document.body.removeChild(textarea)
	console.log('URL copied to clipboard')

	showSuccessfulCopy()
}

/** will replace with alerts component next versions */
const showSuccessfulCopy = () => {
	// Create a new notification div element
	const notification = document.createElement('div')
	notification.classList.add(
		'd-flex',
		'bg-secondary',
		'bg-opacity-75',
		'text-gray-150',
		'rounded-3',
		'py-2',
		'px-3',
		'bg-success'
	)
	notification.style.minHeight = '50px'
	notification.style.position = 'fixed'
	notification.style.bottom = '10px'
	notification.style.left = '50%'
	notification.style.transform = 'translateX(-50%)'
	notification.style.opacity = '0'
	notification.style.transition = 'opacity 0.25s ease'

	// Add the notification text
	const notificationText = document.createElement('span')
	notificationText.classList.add(
		'small',
		'fw-bold',
		'd-flex',
		'flex-column',
		'col-12',
		'align-items-center',
		'justify-content-center'
	)

	const notificationTextInner = document.createElement('span')
	notificationTextInner.classList.add('fw-normal', 'text-nowrap', 'fw-bold')
	notificationTextInner.textContent = 'URL copied to clipboard'

	notificationText.appendChild(notificationTextInner)
	notification.appendChild(notificationText)

	// Add the notification to the document body
	document.body.appendChild(notification)

	setTimeout(() => {
		notification.style.opacity = '1'
	}, 500)

	// Hide the notification after 2 seconds
	setTimeout(() => {
		notification.style.opacity = '0'
		notification.style.transition = 'opacity 0.65s ease-in-out'

		setTimeout(() => {
			document.body.removeChild(notification)
		}, 500)
	}, 1500)
}
