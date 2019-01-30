// some mock data with the preferred short URL
// and it's full URL it should be redirecting to
var data = [
    {
        short_url: "go/fb",
        url: "https://www.facebook.com"
    },
    {
        short_url: "go/tw",
        url: "https://www.twitter.com"
    },
    {
        short_url: "go/cat",
        url: "http://i.dailymail.co.uk/i/pix/2017/08/24/14/4385B31200000578-4819776-image-a-43_1503581669316.jpg"
    }
]

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