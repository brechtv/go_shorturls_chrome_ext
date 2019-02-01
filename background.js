var data = JSON.parse(localStorage.getItem('last_known_shorturls'))

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    localStorage.setItem('last_known_shorturls', JSON.stringify(request))
    data = request
})

// the function to redirect the url
function redirectURL(requestDetails) {
  // decode the url for better regexing
  var url = decodeURIComponent(requestDetails.url)
  // if there is a match for the go/abc pattern
  if(url.match(/(go)\/(\w+)/g)) {
    var input = url.match(/(go)\/(\w+)/g)[0]
    // then fetch the equivalent long URL
    var input_match = data.find(o => o.short_url === input)
    // redirect to the long URL
    return {redirectUrl: input_match.url}
  }
}

// listen to url changes in the browser
chrome.webRequest.onBeforeRequest.addListener(
    redirectURL, {urls: ["<all_urls>"], 
    // but only to the main page
    types: ["main_frame"]},
    // and allow blocking
    ['blocking']
);

