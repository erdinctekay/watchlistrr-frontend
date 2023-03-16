export const findMaxArr = (arr) => {
	if (arr.length === 0) {
		return 0
	}
	return Math.max(...arr)
}

export const includesElements = (array, elements) => {
	return elements.some((element) => array.includes(element))
}

export const capitalizeSentence = (str) => {
	return str.replace(/.+?([\.\?\!]\s|$)/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	})
}

export const capitalizeWords = (words) => {
	var separateWord = words.toLowerCase().split(' ')
	for (var i = 0; i < separateWord.length; i++) {
		separateWord[i] = separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
	}
	return separateWord.join(' ')
}

export const sanitize = (input) => {
	const disallowedChars = /['"%<>_&\-`;\(\)\/]/g
	return input.replace(disallowedChars, '')
}

export const removeUnderscores = (str) => {
	return str.replace(/_/g, ' ')
}

export const removeAllSpaces = (str) => {
	return str.replace(/\s/g, '')
}

export const removeWhiteSpaces = (str) => {
	return str.replace(/' '/g, '')
}

export const normalizeSpacing = (input) => {
	return input.replace(/^\s+/, '').replace(/\s+/g, ' ')
}

export const keepOnlyDigitsAndPlus = (input) => {
	const digitsAndPlusRegex = /[\d+]/g
	const matches = input.match(digitsAndPlusRegex)
	return matches ? matches.join('') : ''
}

export const keepOnlyDigits = (input) => {
	const digitsAndPlusRegex = /[\d]/g
	const matches = input.match(digitsAndPlusRegex)
	return matches ? matches.join('') : ''
}

export const getDateNowIsoStr = () => {
	let date = new Date()
	let isoString = date.toISOString()

	return isoString
}

export const convertTimestamp = (timestamp) => {
	const date = new Date(timestamp * 1000)
	const year = date.getFullYear()
	const month = `0${date.getMonth() + 1}`.slice(-2)
	const day = `0${date.getDate()}`.slice(-2)
	const hours = `0${date.getHours()}`.slice(-2)
	const minutes = `0${date.getMinutes()}`.slice(-2)
	const seconds = `0${date.getSeconds()}`.slice(-2)
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const currentTimestamp = () => Math.floor(Date.now() / 1000)

export const getNumberFromString = (str) => {
	const match = str.match(/\d+/)
	if (!match) return 0
	return parseInt(match[0], 10)
}

export const formatCount = (count, unit, unitPlural) => {
	if (!unitPlural) unitPlural = `${unit}s`

	if (count === 1) {
		return `1 ${unit}`
	} else if (count < 1000) {
		return `${count} ${unitPlural}`
	} else if (count < 1000000) {
		const countInK = Math.floor(count / 1000)
		const countDecimal = count % 1000 ? `.${Math.floor((count % 1000) / 100)}` : ''
		return `${countInK}${countDecimal}K ${unitPlural}`
	} else {
		const countInM = Math.floor(count / 1000000)
		const countDecimal = count % 1000000 ? `.${Math.floor((count % 1000000) / 100000)}` : ''
		return `${countInM}${countDecimal}M ${unitPlural}`
	}
}

export const convertToHttps = (url) => {
	// if http convert to https
	if (/^http/.test(url)) return url.replace(/^http:\/\//, 'https://')

	// if not http/https add it
	if (!/^(http(s)?:)/.test(url)) return (url = 'https://' + url)
}

export const abortableFetch = (url, options) => {
	let fetchPromise = fetch(url, options).catch((error) => {
		// Return a rejected promise with the error
		return Promise.reject(error)
	})
	let abortController = new AbortController()
	let abortSignal = abortController.signal
	let abortPromise = fetchPromise.then(
		(value) => {
			// Return a resolved promise with the value
			return Promise.resolve(value)
		},
		(error) => {
			// Return a rejected promise with the error
			return Promise.reject(error)
		}
	)
	abortPromise.abort = () => {
		abortController.abort()
	}
	return abortPromise
}

export const isValidLink = (link) => {
	// Check if the link has a prefix
	const [prefix] = link.split(':')
	if (prefix && prefix !== 'http' && prefix !== 'https') {
		return false
	}

	// Check if the link has a domain
	const domainRegex = /(?:www\.)?[\w.-]+\.[\w]{2,}/
	if (!domainRegex.test(link)) {
		return false
	}

	// Check if the link has a valid port number (if present)
	const portRegex = /:\d{1,5}/
	if (portRegex.test(link)) {
		const [port] = link.match(portRegex)
		if (port > 65535) {
			return false
		}
	}

	// If all checks pass, return true
	return true
}

// to english blocking numbers
export const toEnglish = (text) => {
	// Use the built-in String.prototype.normalize method to remove diacritics
	let normalizedText = text.normalize('NFD')

	// Replace non-English characters with their English equivalents, preserving case
	normalizedText = normalizedText.replace(/ı/g, 'i')
	normalizedText = normalizedText.replace(/İ/g, 'I')
	normalizedText = normalizedText.replace(/ö/g, 'o')
	normalizedText = normalizedText.replace(/Ö/g, 'O')
	normalizedText = normalizedText.replace(/ü/g, 'u')
	normalizedText = normalizedText.replace(/Ü/g, 'U')
	normalizedText = normalizedText.replace(/ğ/g, 'g')
	normalizedText = normalizedText.replace(/Ğ/g, 'G')
	normalizedText = normalizedText.replace(/ş/g, 's')
	normalizedText = normalizedText.replace(/Ş/g, 'S')
	normalizedText = normalizedText.replace(/ç/g, 'c')
	normalizedText = normalizedText.replace(/Ç/g, 'C')

	// Use a regular expression to remove all other non-English characters, except for spaces, dots, and dashes
	return normalizedText.replace(/[^a-zA-Z .-]/g, '')
}

export const baseUrlSettings = () => {
	if (window.location.href.endsWith('/index.html')) {
		// Redirect the user to the base URL
		window.location.href = window.location.href.substring(0, window.location.href.length - 10)
	}

	// Get the full URL of the current page
	var fullUrl = document.location.href

	// Extract the base URL by removing everything after the last '/' character
	var baseUrl = fullUrl.substring(0, fullUrl.lastIndexOf('/') + 1)

	// Set the href attribute of the base element to the base URL
	document.getElementById('baseUrl').href = baseUrl
}
