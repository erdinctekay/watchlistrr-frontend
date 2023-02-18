import { abortableFetch, convertToHttps, isValidLink } from "./utils.js";

export const validateImageUrl = async (userInput, timeout=3000) => {

    console.log(userInput + "is valid: "+ isValidLink(userInput))

    if(!isValidLink(userInput)) {
        console.log('use http/https link');
        return Promise.resolve(false);
    }

    let url = convertToHttps(userInput);

    // Regular expression for checking the format of the URL
    const linkRegex = /^(?:(?:https?:\/\/)(?:[\w.-]+:?[\w.-]*@)?(?:www\.)?[\w.-]+\.[\w]{2,}(?::\d{1,5})?[^\s]*|[\w.-]+\.[\w]{2,}(?::\d{1,5})?[^\s]*|[\w.-]+\.[\w]{2,}[^\s]*)$/;
  
    // min max value
    const allowedContentLength = [0, 1000000];
  
    // Check that the URL is in a valid format
    if (!linkRegex.test(url)) {
      console.log('link validation error');
      return Promise.resolve(false);
    }

    let abortController = new AbortController();
    let abortSignal = abortController.signal;
    
    let fetchPromise = abortableFetch(url, {
    // Use HTTPS to ensure a secure connection
    protocol: 'https:',
    // Set the content security policy to allow content from any domain
    csp: 'default-src *',
    // Pass the abort signal to the fetch request
    signal: abortSignal
    });

    let isTimeout = false;

    let timeoutId = setTimeout(() => {
        console.log('request timeout');
        abortController.abort();
        isTimeout = true;
        return Promise.resolve(false);
    }, timeout);

    // Return the promise created by the fetch call
    if (!isTimeout) {
        
        return fetchPromise
        .then(response => {
            // Clear the timeout if the request is successful
            clearTimeout(timeoutId);
    
            // Check the status code of the response
            if (response.status < 200 || response.status >= 300) {
                console.log('status error')
                return Promise.resolve(false);
            }
        
            // Check the content length of the URL
            const contentLength = response.headers.get('Content-Length');
            if (contentLength < allowedContentLength[0] || contentLength > allowedContentLength[1]) {
                console.log('size error use something lower than 1mb')
                return Promise.resolve(false);
            }
        
            // Check the content type of the URL
            const contentType = response.headers.get('Content-Type');
            if (!contentType.startsWith('image/')) {
                console.log('content-type error')
                return Promise.resolve(false);
            }
        
            // If the URL is accessible and meets all the criteria, return true
            console.log('all OK')
            return Promise.resolve(true);
        })
        .catch(error => {
            // Clear the timeout anyway
            clearTimeout(timeoutId);

            // If there was an error fetching the URL, throw the error
            console.log('fetching error')
            return Promise.resolve(false);
        });
    }
  
};  
  